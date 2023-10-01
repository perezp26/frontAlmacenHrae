import { useEffect ,forwardRef, useContext } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import 'sweetalert2/dist/sweetalert2.css';

import DatePicker  from 'react-datetime-picker/dist/entry.nostyle';
import "react-datetime-picker/dist/DateTimePicker.css";
import "react-calendar/dist/Calendar.css";
import { format, subDays  } from 'date-fns'

import MaterialTable from '@material-table/core';
import Edit from '@material-ui/icons/BorderColorRounded';
import SaveAlt from '@material-ui/icons/SaveAlt';
import Cancel from '@material-ui/icons/Cancel';
import AddShoppingCartIcon from '@material-ui/icons/AddShoppingCart';
import Print from '@material-ui/icons/Print';

import { UseForm } from '../../hooks/UseForm';
import { fetchConToken } from '../../helpers/fetch';
import { cancelPedido, remisionesClearData, startEditPedido, startListPedidos } from '../../actions/remisiones';
import { uiRemovePedido } from '../../actions/ui';
import { SocketContext } from '../../../SocketContext';
import { dowloadPdfGet } from '../../helpers/downloadPdf';
import { downloadExcel } from '../../helpers/dowloadExcel';

const tableIcons = {
    Edit: forwardRef((props, ref) => <Edit {...props} ref={ref} style={{ color: "#2f973e" }} />),
    Export: forwardRef((props, ref) => <SaveAlt {...props} ref={ref} style={{ color: "#1c617a" }} />),
    AddShoppingCartIcon: forwardRef((props, ref) => <AddShoppingCartIcon {...props} ref={ref} style={{ color : "#5e2576"}} />),
    Cancel : forwardRef((props, ref) => <Cancel {...props} ref={ref}  style={{ color: "#fe0338" }} />),
    Print : forwardRef((props, ref) => <Print {...props} ref={ref} style={{ color: "#376bba" }}/>)
}

export const PanelPedidos = () => {
const socketContext = useContext( SocketContext );
const dispatch = useDispatch();
const { ui, remisiones } = useSelector( state => state)  
const { numPedidos, updatePedido } = ui;
const { listPedidos } = remisiones

const navigate = useNavigate();

//const [listPedidos, setListPedidos] = useState([])

 const [ valuesForm, handleInputChange ] = UseForm({
    dateStart :  subDays(new Date(), 30),
    dateEnd : new Date()
 })
 const { dateStart, dateEnd } = valuesForm 
 
 const columns = [   
        
    { title: 'Folio', field: 'folio',width: 10 },     
    { title: 'Fecha', field: 'datePedido',width: 10 },     
    { title: 'Cliente', field: 'nombreCliente',width: 300 },     
    {
        field: '',
        title: 'Procentaje',
        width: 50,
        render: rowData => <>{ ((rowData.surtido / rowData.solicitado) * 100).toFixed(2) }%</>
    },
]

const listarPedidos = async() => {
    dispatch( startListPedidos(format(dateStart, 'yyyy-MM-dd'), format( dateEnd, 'yyyy-MM-dd' )) );
} 

 useEffect(() => {
    listarPedidos();
 }, [numPedidos, updatePedido])

 

 const handlesNewPedido =  async () => {
    dispatch( remisionesClearData( { setAction : '0' } ));
    navigate('/almacen/pedidos');
}

const handlesExportaExcel = () =>{
    downloadExcel(`excel/excelSalidasDowload/${format(dateStart, 'yyyy-MM-dd')}/${format(dateEnd, 'yyyy-MM-dd')}`,{},'Salidas')
}

const handlesExportaContabilidad = () =>{
    downloadExcel(`excel/excelcontabilidadsalidas/${format(dateStart, 'yyyy-MM-dd')}/${format(dateEnd, 'yyyy-MM-dd')}`,{},'Salidas Contabilidad')
}

const handlesCancelar =  async({idRemision, folio}) => {
    Swal.fire({
        title: 'Confirmar',
        text: `Seguro que desea cancelar el pedido ${folio}`,
        type: 'question',
        input: 'text',
	inputPlaceholder: 'Motivo de cancelacion',
        inputValue: '',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        cancelButtonText: 'Cancelar',
        confirmButtonText: 'Aceptar',
        focusConfirm: false,
        inputValidator: (value) => {
            if (!value) {
              return 'Necesita escribir un motivo'
            }
          }
      }).then( async(result) => {
        
        if (result.value) {
            const url = `remisiones/cancelarpedido/${ idRemision }`;
            const resp = await fetchConToken(url, {}, 'DELETE');
            const result = await resp.json()

            if (result.ok) {
                        dispatch( cancelPedido(idRemision) );
                        dispatch( uiRemovePedido() );
                        socketContext.emit('removePedido', { status: 'ok' } );
            }
        }

       

        
      })
}

  return (
    <>
    <h1 className=" font-black text-3xl text-blue-900">Panel Pedidos</h1>
    <p className="mt-3">
        Adminstrador de pedidos 
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
                <div className=" w-1/6 px-2 mt-5">
                            <button type='button' 
                                    className=' rounded-2xl px-4 py-3 bg-green-700 text-white transition-colors hover:bg-green-900 '
                                    onClick={ listarPedidos }> 
                                    <i className='fas fa-search '> Buscar</i> 
                            </button>
                </div>
                <div className="w-1/6 px-2 mt-5">
                            <button    type='button' 
                                        className = " rounded-2xl px-4 py-3 bg-slate-600 text-white transition-colors hover:bg-slate-800 " 
                                        onClick={ handlesExportaExcel }
                            >
                                <i className='fas fa-file-excel '> Exportar</i> 
                            </button>

                           
                </div>
                <div className=' w-1/4 px-2 mt-5 '>
                            <button type='button' 
                                    className=' rounded-2xl px-4 py-3 bg-rose-600 -600 text-white transition-colors hover:bg-rose-800'
                                    onClick={ handlesExportaContabilidad }>
                                <i className='fas fa-file-excel'> Salidas por Partida </i> 
                            </button>
                </div>
        </div>
        <div className=' mt-7 '>
        <MaterialTable 
            title='Pedidos'
            columns={ columns }
            data = { listPedidos }
            actions={[
                rowData => ({
                    icon: tableIcons.Edit, 
                    hidden : rowData.status !== 'P' ? true : false,
                    tooltip:'Editar Pedido',
                    onClick: async (event, rowData) => {
                                await dispatch( startEditPedido( rowData.idRemision, '0' ));
                                navigate('/almacen/pedidos');
                            },
                }),
                rowData => ({
                    icon: tableIcons.AddShoppingCartIcon, 
                    hidden : rowData.status !== 'P' ? true : false,
                    tooltip:'Surtir',
                    onClick: async (event, rowData) => {
                                navigate(`../../almacen/documentosurtido/${rowData.idRemision}`);
                            },
                }),
                rowData => ({
                    icon: rowData.status === 'R' || rowData.status === 'T' ? tableIcons.Print :  tableIcons.Export, 
                    hidden : rowData.status === 'C' ? true : false,
                    tooltip:'Imprimir Salida',
                    onClick: async (event, rowData) => {
                                if( rowData.status === 'P'){
                                        await dispatch( startEditPedido( rowData.idRemision, '1' ));
                                        navigate('/almacen/pedidos');
                                }
                                if( rowData.status === 'R' || rowData.status === 'T'){
                                        await  dowloadPdfGet(`pdf/pdfsalida/${rowData.idRemision}`,`salida ${rowData.idRemision}`);
                                }
                            },
                }),
                rowData => ({
                    icon: tableIcons.Cancel, 
                    hidden : rowData.status === 'C' || rowData.status === 'T' ? true : false,
                    tooltip:'Cancelar Pedido',
                    onClick: async (event, rowData) => {
                                handlesCancelar(rowData)
                            },
                }),
                
            ]}
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
            options={{
                pageSize: 50,
                pageSizeOptions : [10,20,30,40,50],
                rowStyle: rowData => ({                            
                    //fontWeight : (rowData.status === 'I' || rowData.status === 'P') ? 'normal' : 'lighter',
                    color : rowData.status=== 'C' && 'gray'
                })
              }}
        />
        </div>
                <button className=" bg-blue-700 fab text-cyan-50" onClick={ handlesNewPedido }>
                    <i className='fas fa-plus '> </i> 
                </button>
    </div>
    </>
  )
}
