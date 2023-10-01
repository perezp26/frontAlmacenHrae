import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import Select from 'react-select';
import { customStyles, customStylesControl } from './customStylesSelects';

import Swal from 'sweetalert2';
import 'sweetalert2/dist/sweetalert2.css'

import DatePicker from 'react-datetime-picker/dist/entry.nostyle';
import "react-datetime-picker/dist/DateTimePicker.css";
import "react-calendar/dist/Calendar.css";
import "react-clock/dist/Clock.css";
import { isValid } from 'date-fns';

import { UseForm } from '../../hooks/UseForm'
import { fetchConToken, fetchSinToken } from '../../helpers/fetch';
import { Spinner } from '../ControlsForm/Spinner';
import { surtidoAddProductoSurtido, surtidoListaFilterProductosSurtidos } from '../../actions/surtido';
import { Alerta } from '../ControlsForm/Alerta';
import { Entrada } from '../ControlsForm/Entrada';

export const Salida = ({ setView, idListSurtido, idSurtido, solicitado, totalUnidades, id_Producto }) => {

    const { productos} = useSelector(state => state.ui);
    const dispatch = useDispatch()
    
    const [cargando, setCargando] = useState( false );
    const [errorUnidad, setErrorUnidad] = useState(false);
    const [errorDate, seterrorDate] = useState(false);
    const [ valuesForm, handleInputChange, reset ] = UseForm({
        _idProducto:'',
        _lote:'',
        _unidades: 0,
        dateRegistro: new Date(),
    })
    const { _unidades, dateRegistro, _idProducto } = valuesForm;

    
    const [_producto, _setProducto] = useState({})
    const [listEntradas, setListEntradas] = useState([])
    const { caducidad, idEntradaCabecero, idEntrada, idProducto, 
            lote, pallet, codigoProducto, descripcionProducto, descripcionUbicacion , 
            totalUnidadesSalidas, unidades, idUbicacion, precio, iva } = _producto

    const handlesConsultar = async( idProducto = 0 ) => {
        _setProducto( {} )
        //const serachProducto = _idProducto.value
        const serachProducto = idProducto;
        setErrorUnidad( false );
        reset();

        try {
            setCargando( true );
                const url = `productos/getInventario/${ serachProducto }/`;
                const respuesta = await fetchConToken( url );
                const result = await respuesta.json();

                if ( result.inventario.length > 0 ) { 

                    setListEntradas([...result.inventario ]);
                    //result.inventario.producto.codigo === codigo ?  
                                        // result.inventario.codigoEstado === 'D' ?  
                                        // _setProducto( result.inventario )
                                        // :Swal.fire('ERROR', `El status del producto es ${result.inventario.codigoEstado}`) 
                    //:Swal.fire('ERROR',`Este pallet no corresponde al producto a surtir`,'error');
                }
                else {
                    _setProducto( {} )
                    Swal.fire('Aviso','No se encontro el producto','info');
                }
            setCargando( false );
  
         } catch (error) {
           console.log(error);
           setCargando( false );
         }
    }

    useEffect(() => {
        handlesConsultar( id_Producto )
    }, [])
    

    const validaExistencia = ( _unidades ) => {
       
        const isNumberInteger = Number(_unidades) && Number(_unidades) > 0 
        const existenciaUnidades = unidades - (!!totalUnidadesSalidas ? totalUnidadesSalidas : 0)
        !isNumberInteger ? setErrorUnidad( true ) : setErrorUnidad( false );

       if ( _unidades > existenciaUnidades ) { 
             
            Swal.fire(`La cantidad maxima disponibles es : ${ existenciaUnidades }`);
            handleInputChange('_unidades', 0 );    

       }
    }

    const handleSubmintSalida = async() => {

        const validaTotalUnidades = totalUnidades +  Number(_unidades);
       
        if( validaTotalUnidades > Number(solicitado) ) {
            Swal.fire('error', `El producto a surtir excede lo solicitado (${ solicitado })`, 'error')
            return false;
        }

        setErrorUnidad( false );
        
        const dataSalida = {
            id : pallet,
            idSurtido,
            idListSurtido,
            idEntradaCabecero,
            idEntrada,
            pallet : pallet,
            lote : lote,
            descripcion : `${codigoProducto} - ${descripcionProducto}`,
            unidades: Number(_unidades),
            dateRegistro,
            idUbicacion,
            precio,
            iva
        }
        
        const isNumberInteger = Number( dataSalida.unidades ) && Number(dataSalida.unidades) > 0 
        if ( isNumberInteger ) {
            setView('dataTable');
            dispatch( surtidoAddProductoSurtido( dataSalida ) );
            dispatch( surtidoListaFilterProductosSurtidos( idListSurtido ) );
        } else {
            
            !isNumberInteger && setErrorUnidad( true );
        }
    }


  return (
    <>
        
            {/* <div className="md:flex">
                <div className="md:w-4/5 md:pr-4">
                        <label className="text-gray-800" htmlFor="_idProducto"> Producto </label>
                        <Select
                            id="_idProducto"
                            name="_idProducto"
                            styles={{
                                ...customStyles,
                                control: (style) => ({ ...style, ...customStylesControl, padding: '0px', fontSize:'12px'})
                            }}
                            options={ productos }
                            value = { _idProducto }
                            placeholder="Seleccionar un producto"
                            onChange={(data) => { handleInputChange('_idProducto', !!data ? data : '') } }
                            isClearable
                        />

                </div>

                <div className="md:w-1/5 md:pl-7 pt-1">
                    {
                        cargando ? <Spinner /> :
                                <button
                                    className=" mt-5 w-full bg-blue-700 p-2 text-white rounded-lg hover:shadow-2xl hover:touch-pinch-zoom hover:bg-blue-800 "
                                    onClick={ handlesConsultar }
                                >
                                    Buscar
                                </button>
                    }
                </div>                
            </div>  */}

            {
                    (idProducto && !cargando ) ? 
                    <>
                    <div className="w-full  mt-7 text-center">
                            <p className = "text-orange-800 font-bold text-xl ">{ pallet }</p>
                    </div>
                    <div className="md:flex w-full  mt-3">                         
                        <div className='md:w-full md:pl-4'>
                            <p className = "text-slate-700 text-sm font-semibold" > Producto </p> 
                            <p className = "text-slate-800 text-sm bg-slate-200 p-2" > { `${codigoProducto} - ${descripcionProducto}` } </p> 
                        </div>
                    </div>

                    <div className="md:flex w-full mt-4">
                        <div className='md:w-1/2 md:pl-4'>
                            <p className = "text-slate-700 text-ms font-semibold" > Lote </p> 
                            <p className = "text-slate-800 text-sm text-center bg-slate-200 p-2" > { lote } </p> 
                        </div>
                        <div className='md:w-1/2 md:pl-4'>
                            <p className = "text-slate-700 text-sm font-semibold" > Caducidad </p> 
                            <p className = "text-slate-800 text-sm text-center bg-slate-200 p-2" > { caducidad } </p> 
                        </div>
                    </div>

                    <div className="md:flex w-full mt-4">
                        <div className='md:w-1/2 md:pl-4'>
                            <label className="text-gray-800" htmlFor="dateRegistro" >Fecha Registro</label>
                            <DatePicker
                                name="dateRegistro"
                                className={`mt2 w-full p-1 bg-gray-200 rounded-lg outline-blue-500 text-center `}
                                styles={'border: none '}
                                format='dd-MM-y'
                                onBlur={() => seterrorDate(!isValid(dateRegistro))}
                                onChange={date => { handleInputChange('dateRegistro', date) }}
                                value={dateRegistro}
                            />
                            {(errorDate) &&
                                <Alerta className="  ml-0" >
                                    Fecha no valida
                                </Alerta>
                            }
                        </div>
                        <div className='md:w-1/2 md:pl-7'>
                            <label className = "text-orange-800" htmlFor="_pallet"> Unidades de Salida</label> 
                            <label className = "text-orange-800 font-semibold text-xs" htmlFor="_pallet"> 
                                    (Por Surtir : { solicitado -totalUnidades } - Existencia Actual: { unidades - (!!totalUnidadesSalidas ? totalUnidadesSalidas : 0) } )
                            </label> 
                             <input
                                name = "_unidades"
                                value={ _unidades }             
                                className = { 'block w-full p-2 bg-gray-200 rounded-lg outline-blue-500 text-center'}
                                type="number"
                                placeholder= "Captura las unidades de salida" 
                                onBlur={ () =>  validaExistencia( _unidades ) }
                                onChange={ ({ target }) => { handleInputChange( target.name, target.value ) } }
                                onFocus = { e => e.target.select() }
                            />
                            {( errorUnidad )  &&
                                                <Alerta className=" ml-0" >
                                                        Unidades Incorrectas
                                                </Alerta>
                            }  
                        </div>
                    </div>

                    <div className="md:flex w-full  mt-3">    
                        <div className='md:w-1/2 md:pl-4'>
                            <p className = "text-slate-700 text-sm font-semibold" > Ubicación </p> 
                            <p className = "text-slate-800 text-sm text-center bg-slate-200 p-2 h-9" > { descripcionUbicacion } </p> 
                        </div>                     
                        <div className='md:flex md:w-1/2 md:pl-4'>
                            <div className='md:w-1/2'>
                                    <p className = "text-slate-700 text-sm font-semibold" > Precio </p> 
                                    <p className = "text-slate-800 text-sm text-center bg-slate-200 p-2" > { precio } </p> 
                            </div>
                            <div className='md:w-1/2 md:pl-2'>
                                    <p className = "text-slate-700 text-sm font-semibold" > IVA </p> 
                                    <p className = "text-slate-800 text-sm text-center bg-slate-200 p-2" > { iva } </p> 
                            </div>
                        </div>
                        
                    </div>

                    {
                        !cargando &&
                        <button 
                            type='button' 
                            className=" ml-2 mt-16 w-full bg-blue-700 p-4 text-white rounded-lg hover:shadow-2xl hover:touch-pinch-zoom hover:bg-blue-800"
                            onClick={ handleSubmintSalida }
                        >
                            Agregar Producto
                        </button>
                    }
                    </>
                    :
                    <>
                       <table className=" w-full mt-5 table-auto shadow bg-white" id='tableEntris '  style={{ fontSize: 11}}>
                            <thead className='bg-blue-800 text-white font-light '  >
                                <tr>
                                    <th className="p-2">Producto</th>
                                    <th className="p-2">Fecha Reg.</th>
                                    <th className="p-2">Lote</th>
                                    <th className="p-2">Caducidad</th>
                                    <th className="p-2">Precio</th>
                                    <th className="p-2">Existencia</th>
                                    <th className="p-2"></th>
                                </tr>
                            </thead>
                            <tbody>
                                {
                                    listEntradas.map(entrada => (
                                        <Entrada
                                            key={entrada.idEntrada}
                                            entrada={entrada}
                                            _setProducto = { _setProducto }
                                            setListEntradas = { setListEntradas }
                                        />
                                    ))
                                }
                            </tbody>
                        </table>
                    </>
            }

    </>
  )
}
