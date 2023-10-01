
import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import MaterialTable from '@material-table/core';
import Select from 'react-select';

import Swal from 'sweetalert2';
import 'sweetalert2/dist/sweetalert2.css';

import DatePicker  from 'react-datetime-picker/dist/entry.nostyle';
import "react-datetime-picker/dist/DateTimePicker.css";
import "react-calendar/dist/Calendar.css";
import { format, subDays  } from 'date-fns'

import { customStyles, customStylesControl } from './customStylesSelects';
import { UseForm } from '../../hooks/UseForm';
import { entradaClearLists, entradaListFilter, startListEntradas } from '../../actions/entrada';
import { ModalEditEntrada } from '../ControlsForm/ModalEditEntrada';
import { uiOpenModal } from '../../actions/ui';
import { entradaEdit } from '../../actions/entrada';
import { downloadExcelEntradas } from '../../helpers/dowloadExcel';
import { Spinner } from '../ControlsForm/Spinner';

export const ConsultaPallets = () => {

    const dispatch = useDispatch();
    const { ui, entrada, auth } = useSelector(state => state);
    const { productos, ubicaciones, loading } = ui;
    const { login } = auth
    const { listEntradas, listEntradasFilter } = entrada;

    const [viewDataList, setViewDataList] = useState(1)
    const [actions, SetActions] = useState([
    {
        icon:'print',
        tooltip: 'print'
    },])
    const [valuesForm, handleInputChange] = UseForm({
        idProducto: '',
        pallet: '',
        lote: '',
        idUbicacion: '',
        anio : new Date().getFullYear(),
        dateStart :  subDays(new Date(), 30),
        dateEnd : new Date()
    })

    const { idProducto, pallet, lote, anio, idUbicacion, dateStart, dateEnd } = valuesForm;
    const losProductos = [{ value: 0, label: 'Todos los productos' }, ...productos]

    const columns = [   
        { title: 'Folio', field: 'idEntradaCabecero', width: 70,},     
        {
            field: '',
            width: 500,
            title: 'Producto',
            render: rowData => <>{ `${rowData.producto.codigo}-${rowData.producto.descripcion}` }</>
        },
        { title: 'Lote', field: 'lote', width: 100,},
        { title: 'Caducidad', field: 'caducidad', width: 150, },
        { title: 'Registro', field: 'dateRegistro' , width: 150},
        { title: 'Núm Doc.', field: 'numeroDocumento', width: 200 },
        { title: 'Estado', field: 'codigoEstado.value' , width: 100},
        { title: 'Existencia', field: 'existencia', width: 100 },  
        {   title: 'Costo Unitario', field: 'precio', width:100, 
            render: rowData => <>{ `${ rowData.precio.toLocaleString?.('es-MX',{style:'currency',currency: 'MXN',}) }` }</> 
        },
        {   
            title: 'I.V.A.', field: 'iva', width:100, 
            render: rowData => <>{ `${ rowData.iva.toLocaleString?.('es-MX',{style:'currency',currency: 'MXN',}) }` }</> 
        },
        {  title: 'Entradas', width: 100,
            cellStyle: {
                backgroundColor: '#BFFFBF'
            },
            headerStyle: {
                backgroundColor: '#BFFFBF',
            }, 
            field: 'unidades' 
        },    
        { title: 'Salidas', width: 100, 
                cellStyle: {
                    backgroundColor: '#FFFFBF'
                },
                headerStyle: {
                    backgroundColor: '#FFFFBF',
                }, 
        field: 'salidas' },  
        // {
        //     field: 'idUbicacion',
        //     title: 'Ubicacion',
        //     render: rowData => <>{ !!rowData.idUbicacion && `${rowData.ubicacion.label}` }</>
        //     , width: 100
        // },
        { title: 'Usuario Crea', field: 'userDateCreate' , width: 100},
        { title: 'Usuario Actualiza', field: 'userDateUpdate', width: 100 },
        { title: 'Usuario Ubica', field: 'userDateUbicacion', width: 100 },
       
        
    ];

    useEffect(() => {
        dispatch( entradaClearLists() )      
        login.permisos.includes(3) && SetActions([{
            icon:'editar',
            tooltip: 'editar'
        },...actions, ])
    }, [])
    

    const handlesEdit = ( idEntrada ) =>{
        dispatch( uiOpenModal() );
        dispatch( entradaEdit(idEntrada) )
    }
    const handlesConsultar = async () => {

        const _idproducto = idProducto?.value === '' ? 'undefined' : idProducto.value;
        const _pallet = pallet.trim() === '' ? 'undefined' : pallet;
        const _lote = lote.trim() === '' ? 'undefined' : lote;
        const _idUbicacion = idUbicacion?.value === '' ? 'undefined' : idUbicacion.value;
        setViewDataList( 1 )
        if ((typeof _idproducto === 'undefined' || _idproducto === 'undefined') && _pallet === 'undefined' && _lote === 'undefined') {

            Swal.fire('', 'Debes escribir al menos un dato', 'error');

        } else {
            try {

                dispatch(startListEntradas(_idproducto, _lote, format(dateStart, 'yyyy-MM-dd'), format( dateEnd, 'yyyy-MM-dd' )))
            } catch (error) {
                console.log(error);
            }
        }

    }

    const handlesChangeViewData = ({ target }) => {
        setViewDataList(target.value)
        dispatch(entradaListFilter(Number(target.value)));
    }

    const handlesExportExcel = () =>{
            //console.log(listEntradasFilter);
            downloadExcelEntradas( listEntradasFilter )
    }

    return (
        <>
            <h1 className=" font-black text-3xl text-blue-900">Consulta Productos</h1>
                <p className="mt-3">
                    Para consultar las entras y salidas de productos Selecciones un Producto o escriba un lote
                </p>
            <div className="bg-white mt-5 px-3 py-5 rounded-md shadow-md mx-auto ">
                <div className=' flex  justify-between item'>
                    <h1 className="text-gray-600 font-bold text-xl uppercase text-center">Consultar Datos</h1>
                    
                </div>
                <div className="md:flex">
                    <div className="md:w-2/6 md:pr-4">
                        <label className="text-gray-800" htmlFor="idProducto"> Producto </label>
                        <Select
                            id="idProducto"
                            name="idProducto"
                            styles={{
                                ...customStyles,
                                control: (style) => ({ ...style, ...customStylesControl, padding: '0px', fontSize:'12px'})
                            }}
                            options={losProductos}
                            placeholder="Seleccionar un producto"
                            onChange={(data) => handleInputChange('idProducto', !!data ? data : '')}
                            isClearable
                        />

                    </div>

                    <div className="md:w-1/6 md:pl-1">
                        <label className="text-gray-800" htmlFor="pallet"> Lote </label>
                        <input
                            name="lote"
                            value={lote}
                            className={'mt2 block w-full p-2 bg-gray-200 rounded-lg outline-blue-500 text-center'}
                            type="text"
                            placeholder="Lote"
                            onChange={({ target }) => { handleInputChange(target.name, target.value) }}
                        />
                    </div>

                    <div className="w-2/6 px-4">
                        <label className="text-gray-800" htmlFor="idDireccion"> Fecha Incio </label>
                        <DatePicker 
                            name = "dateStart"
                            className={ `block w-full p-1 rounded-lg outline-blue-500 text-center  bg-slate-200   
                                    `}
                            styles = {'border: none ' }
                            format='dd-MM-y'
                            value={ dateStart } 
                            onChange={ date => handleInputChange("dateStart", date) }
                        />

                    </div>
                    <div className="w-2/6 px-4">
                        <label className="text-gray-800" htmlFor="idDireccion"> Fecha Fin </label>
                        <DatePicker 
                            name = "dateEnd"
                            className={ `block w-full p-1 rounded-lg outline-blue-500 text-center bg-slate-200   
                                        `}
                            styles = {'border: none ' }
                            format='dd-MM-y'
                            value={ dateEnd } 
                            onChange={ date => handleInputChange("dateEnd", date) }
                        />
                    </div>

                   
                    <div className='md:w-1/6  md:pl-5'>
                      {
                        loading ? <Spinner /> : 
                        <button
                            className=" bg-blue-700 px-5 py-2 mt-5 text-white rounded-full hover:shadow-2xl hover:touch-pinch-zoom hover:bg-blue-800 "
                            onClick={ handlesConsultar }
                        >
                            <i className="fa-solid fa-search fa-1x"></i> Consultar
                        </button>
                      }  
                    </div>
                </div>
                
                {listEntradas.length > 0 &&
                    <div
                        className='flex justify-between items-center mx-auto'
                    >
                        <select
                            className='block p-2 bg-gray-200 rounded-lg outline-blue-500 text-center '
                            value={viewDataList}
                            onChange={handlesChangeViewData}
                        >
                            <option value={1}>Con existencia</option>
                            <option value={0}>Sin existencia</option>
                            <option value={-1}>Todos</option>
                        </select>
                        <button
                            id="btnExport"
                            className = "mt-5 w-100 bg-green-700 p-1 text-white rounded-lg hover:shadow-2xl hover:touch-pinch-zoom hover:bg-green-800"
                            onClick={ handlesExportExcel }
                        >
                             Exportar Excel
                        </button>
                    </div>
                }
                <MaterialTable
                        title=""
                        columns={ columns }                 
                        data={ listEntradasFilter }

                        actions={[
                            //...actions
                          ]}

                        components={{
                            Action: props => {
                      
                                if(props.action.tooltip === 'editar'){
                                    return( 
                                        <button type="button"
                                                className=" px-2 py-1 rounded-full transition ease-out duration-500 hover:bg-slate-200 "
                                                onClick={ () => { handlesEdit( props.data.idEntrada ) } }
                                        >
                                            <i className="fa-solid fa-pen text-lg" ></i>
                                        </button>
                                    )
                                }
        
                                if (props.action.icon === 'print') {
                                        return(''
                                        )
                                }
                              }
                        }}
                        options={{
                            pageSize: 50,
                            pageSizeOptions : [10,20,30,40,50],
                            rowStyle: rowData => ({                            
                                //fontWeight : (rowData.status === 'I' || rowData.status === 'P') ? 'normal' : 'lighter',
                                color : rowData.codigoEstado.value === 'C' && 'red'
                            }),
                            tableLayout: "fixed"
                          }}
                        localization={{ 
                            pagination: {
                                labelRowsSelect: 'Filas',
                            },
                            toolbar: { 
                                searchTooltip: 'Buscar',
                                searchPlaceholder: 'Buscar'
                            },
                            header : {
                                actions : ''
                            }
                        }}
                />
            </div>
            <ModalEditEntrada />
        </>
    )
}
