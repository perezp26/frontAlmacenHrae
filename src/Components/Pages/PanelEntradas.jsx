import { forwardRef } from 'react';

import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

import MaterialTable from '@material-table/core';
import Assignment from '@material-ui/icons/Assignment';
import Print from '@material-ui/icons/Print';
import BorderColorRounded from '@material-ui/icons/BorderColorRounded'

import DatePicker  from 'react-datetime-picker/dist/entry.nostyle';
import "react-datetime-picker/dist/DateTimePicker.css";
import "react-calendar/dist/Calendar.css";
import { format, subDays  } from 'date-fns'

import { entradaEmpyEdit, startGetDataEntradaCabecero } from '../../actions/entrada';
import { UseForm } from '../../hooks/UseForm';
import { useState } from 'react';
import { fetchConToken } from '../../helpers/fetch';
import { useEffect } from 'react';
import { dowloadPdfGet } from '../../helpers/downloadPdf';
import { uiSetLoading } from '../../actions/ui';
import { downloadExcel, downloadExcelEntradasPanel } from '../../helpers/dowloadExcel';
import { Spinner } from '../ControlsForm/Spinner';

const tableIcons = {
  Edit: forwardRef((props, ref) => <Assignment {...props} ref={ref} style={{ color: "#f09f48" }} />),
  Print : forwardRef((props, ref) => <Print {...props} ref={ref} style={{ color: "#376bba" }}/>),
  BorderColorRounded: forwardRef((props, ref) => <BorderColorRounded {...props} ref={ref} />),
}

export const PanelEntradas = () => {

    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { status, loading, captura } = useSelector(state => state.ui);

    const handlesNuevaEntrada = () =>{
        dispatch( entradaEmpyEdit() );
        navigate('/almacen/nuevaentrada');
      }

    const columns = [   
        
        { title: 'Folio', field: 'idEntradaCabecero',width: 10,editable: 'never' },     
        { title: 'Fecha', field: 'dateRegistro',width: 10,editable: 'never' },     
        { title: 'Proveedor', field: 'proveedore.nombre',width: 350,editable: 'never' },    
        { title: 'Documento', field: 'numeroDocumento',width: 100,editable: 'never' }, 
        { title: 'Fuente Finaciamiento', field:'fuentesfinanciamiento.descripcion', width: 200, editable: 'never' },   
        { title: 'Total', field: 'total',width: 70, type:'currency', editable: 'never'}, 
        { title: '# Carga', field: 'numCargaSistema',width: 100},    
        
        {
          title: 'Captura',
          field: 'captura.idCaptura',
          lookup: captura,
          width: 120
        },
        {
          title: 'Status',
          field: 'status.idStatus',
          lookup: status,
          width: 120
        },
    ]

    const [ valuesForm, handleInputChange ] = UseForm({
      dateStart :  subDays(new Date(), 30),
      dateEnd : new Date()
    })
    const { dateStart, dateEnd } = valuesForm 
    const [listEntradas, setListEntradas] = useState([])

    const handlesListEntradas = async() =>{
        const resp =  await fetchConToken( `productos/getentradacabecero/${ dateStart }/${ dateEnd }` )
        const result = await resp.json()

        if ( result.ok){
          console.log(result);
          setListEntradas( result.entradasCabecero )
        }
    }

    useEffect(() => {
      handlesListEntradas()
    }, [])
    
const handelsExport = async() =>{
  dispatch( uiSetLoading(true))
  await downloadExcelEntradasPanel( dateStart, dateEnd )
  dispatch( uiSetLoading(false) )
}

const handlesExportContabilidad = async()=>{
  dispatch( uiSetLoading(true) );
    downloadExcel(`excel/excelcontabilidadentradas/${format(dateStart, 'yyyy-MM-dd')}/${format(dateEnd, 'yyyy-MM-dd')}`,{},'Entradas Contabilidad')
  dispatch( uiSetLoading(false) );
}

  return (
  <>
    <h1 className=" font-black text-3xl text-blue-900">Panel Entradas</h1>
    <p className="mt-3">
        Admnstrador de entradas 
    </p>
    <div className="bg-white px-5 py-5 rounded-md shadow-md mx-auto ">
        <div className='flex my-2'>
                <div className="w-1/4 px-2">
                    <label className="text-gray-800" htmlFor="idDireccion"> Fecha Incio </label>
                    <DatePicker 
                        name = "dateStart"
                        className={ `block w-full p-2 rounded-lg outline-blue-500 text-center  bg-slate-200   
                                  `}
                        styles = {'border: none ' }
                        format='dd-MM-y'
                        value={ dateStart } 
                        onChange={ date => handleInputChange("dateStart", date) }
                    />

                </div>
                <div className="w-1/4 px-2">
                    <label className="text-gray-800" htmlFor="idDireccion"> Fecha Fin </label>
                    <DatePicker 
                        name = "dateEnd"
                        className={ `block w-full p-2 rounded-lg outline-blue-500 text-center bg-slate-200   
                                     `}
                        styles = {'border: none ' }
                        format='dd-MM-y'
                        value={ dateEnd } 
                        onChange={ date => handleInputChange("dateEnd", date) }
                    />
                </div>
                {
                  loading ? <Spinner/>
                  :
                  <>
                    <div className="w-1/6 px-2 pt-5">
                                <button type='button' 
                                        className=' rounded-2xl px-4 py-3 bg-green-700 text-white transition-colors hover:bg-green-900 '
                                        onClick={ handlesListEntradas }> 
                                        <i className='fas fa-search '> Buscar</i> 
                                </button>   
                    </div>
                    <div className="w-1/6 px-2 pt-5">
                          <button onClick={ handelsExport } className=' rounded-2xl px-4 py-3 ml-5 bg-slate-600 text-white transition-colors hover:bg-slate-800 '>
                                <i className='fas fa-file-excel '> Exportar</i> 
                          </button>

                    </div>
                    <div className='w-1/4 px-2 pt-5'>
                                <button onClick={ handlesExportContabilidad } className=' rounded-2xl px-4 py-3 bg-rose-600 -600 text-white transition-colors hover:bg-rose-800'>
                                        <i className='fas fa-file-excel'> Entradas por Partida </i> 
                                </button>
                    </div>
                  </>
                }
        </div>
      </div>

      <div className=' mt-7 '>
        <MaterialTable 
            title='Entradas'
            columns={ columns }
            data = { listEntradas }
            actions={[
              rowData => ({
                icon: tableIcons.Edit, 
                //hidden : rowData.status === 'C' ? true : false,
                tooltip:'Editar Entrada',
                onClick: async (event, rowData) => {
                            dispatch( uiSetLoading(true))
                            await dispatch( startGetDataEntradaCabecero( rowData.idEntradaCabecero));
                            dispatch( uiSetLoading(false))
                            navigate('../../almacen/nuevaentrada');
                        },
              }),
              rowData => ({
                icon: tableIcons.Print, 
                tooltip:'Imprimir',
                onClick: async (event, rowData) => {
                        await  dowloadPdfGet(`pdf/pdfentrada/${rowData.idEntradaCabecero}`,`entrada ${rowData.idEntradaCabecero}`);
                        },
            }),
            ]}
            editable={{ 
              onRowUpdate: async (newData, oldData) =>
                        
                        {
                          const resp = await fetchConToken( `productos/setstatuscarga/${ newData.idEntradaCabecero }` , 
                                                            { idStatus : newData.status.idStatus, numCargaSistema : newData.numCargaSistema, idCaptura : !!newData.captura ? newData.captura.idCaptura : '' } ,
                                                             "POST" )
                          const result = await resp.json()
                          if ( result.ok){
                            setListEntradas( listEntradas.map( e => e.idEntradaCabecero === newData.idEntradaCabecero ? newData : e ) )
                          }
                        }

            }}
            localization = {{
                pagination: {
                    labelRowsSelect: 'Filas',
                },
                toolbar: { 
                    searchTooltip: 'Buscar',
                    searchPlaceholder: 'Buscar'
                },
                header: { actions : '' }
            }}
            isLoading = { loading }
            options={{
                pageSize: 20,
                pageSizeOptions : [10,20,30,40,50],
                maxBodyHeight :600,
                rowStyle: rowData => ({                            
                    //fontWeight : (rowData.status === 'I' || rowData.status === 'P') ? 'normal' : 'lighter',
                    color : rowData.status=== 'C' && 'gray'
                })
              }}
              icons={{
                Edit: () => <tableIcons.BorderColorRounded style={{ color: "green", padding:"0" }} />,
              }}
        />
        </div>


            <button className=" bg-blue-700 fab text-cyan-50" onClick={ handlesNuevaEntrada }>
                <i className='fas fa-plus '> </i> 
            </button>

  </>
  )
}
