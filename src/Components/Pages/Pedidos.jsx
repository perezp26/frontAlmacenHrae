
import { useState, useCallback, useEffect, useContext } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';

import { Form, Formik } from 'formik';
import * as Yup from 'yup';

import Swal from 'sweetalert2';
import 'sweetalert2/dist/sweetalert2.css'
import { format, utcToZonedTime, toDate} from 'date-fns-tz';

import CabeceraPedido from '../ControlsForm/CabeceraPedido';
import { generarId } from '../../helpers/generarId';
import { fetchConToken } from '../../helpers/fetch';
import { DetallePedido } from '../ControlsForm/DetallePedido';

import { DatosPedido } from '../ControlsForm/DatosPedido';
import { useMemo } from 'react';
import { dowloadPdfGet } from '../../helpers/downloadPdf';
import { uiAddPedido, uiRemovePedido } from '../../actions/ui';
import { SocketContext } from '../../../SocketContext';
import { ResumenCosto } from '../ControlsForm/ResumenCosto';


export const Pedidos = () => {

    const socketContext = useContext( SocketContext );
    const dispatch = useDispatch();
    const  navigate = useNavigate();
    const { ui, remisiones } = useSelector(state => state);
    const { productos, unidad, clientes } = ui;
    const { remision } = remisiones;
    const { idRemision, idCliente, nombreCliente,  datePedido, dateEntrega, direccionEntrega, detalleremisiones, setAction, 
            numEntrada, partidaPresupuestal, ordenSurtimiento, docFuente} = remision
    
    const [cargando, setCargando] = useState(false);
    const [rutas, setRutas] = useState([]);
    const [vendedores, setVendedores] = useState([]);
    const [listProductos, setListProductos] = useState([])
    const [errorListProductos, setErrorListProductos] = useState('');
    const [dataRemision, setDataRemision] = useState({
        dateRemision : new Date(),
        importeAbono : 0.0
    })

    const [costoResumen, setCostoResumen] = useState({
        subtotal : "0.00",
        iva :  "0.00",
        total :  "0.00"
    })

    useEffect(async () => {

      !!idRemision && setListProductos( [ ...detalleremisiones ] )
     }, []);
    
     useEffect( () => {
        let ivaTotal = 0.00;
        let precioTotal = 0.00;

        listProductos.forEach(e => {
            ivaTotal = ivaTotal + Number(e.iva);
            precioTotal = precioTotal + Number(e.precio)
        });

        setCostoResumen({ iva: ivaTotal.toFixed(2), subtotal : precioTotal.toFixed(2), total : (ivaTotal + precioTotal).toFixed(2) })       

    }, [listProductos])

    const validadPedidoSchema =  Yup.object().shape({ 
        idCliente : Yup.object().shape({ value: Yup.string().required('Deber seleccionar un cliente') }),
        datePedido : Yup.date("debe ser fecha").required('La fecha es requerida').typeError('Debe ser fecha válida'),
        dateEntrega : Yup.date("debe ser fecha").required('La fecha es requerida').typeError('Debe ser fecha válida'),
    })

    const handlesGeneraRemision = () =>{
        const { dateRemision } = dataRemision;

        if (!dateRemision) {
            Swal.fire('Error', 'Fecha de Pedido no válida','error');
            return false;
        }

        Swal.fire({
            title: 'Cerrar Pedido',
            text: "Seguro que desea cerrar el pedido?",
            icon: 'question',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Cerrar Pedido',
            cancelButtonText: 'Cancelar',
          }).then(async(result) => {
            if (result.isConfirmed) {
                startRemision( dateRemision )
            }
          })
    }

    const startRemision = async(dateRemision) => {


        setCargando(true)
        
        const result = await fetchConToken(`remisiones/generar/${ idRemision }`, 
                                            { dateRemision: format(dateRemision, 'yyyy-MM-dd'), idCliente }
                                            , 'PUT');
        const resp = await result.json();

        resp.ok ?   Swal.fire({
                        title: 'Pedido Cerrado',
                        text: "Desea imprimir la salida ? ",
                        icon: 'question',
                        showCancelButton: true,
                        confirmButtonColor: '#3085d6',
                        cancelButtonColor: '#d33',
                        confirmButtonText: 'Si imprimir',
                        cancelButtonText : 'No imprimir'
                      }).then(async (result) => {
                            dispatch( uiRemovePedido() );
                            socketContext.emit('removePedido', { status: 'ok' } );
                        if (result.isConfirmed) {
                            await  dowloadPdfGet(`pdf/pdfsalida/${idRemision}`,`salida${idRemision}`);
                            navigate('/almacen/panelpedidos');
                        }else {
                            navigate('/almacen/panelpedidos');
                        }
                      })
            : Swal.fire('', 'No se pudo generar el pedido', 'error')   ;   
        setCargando( false )              

}     

const handleSubmit = async(values) => {

    if ( listProductos.length > 0 ){
        const data = {  ...values,
                        idCliente : values.idCliente.value,
                        nombreCliente : values.idCliente.label,
                        datePedido: format(new Date(values.datePedido),"yyyy-MM-dd").toString(),
                        dateEntrega : format(new Date(values.dateEntrega),"yyyy-MM-dd HH:mm:ss").toString(),
                        listProductos,
                        costoResumen
                     };
        const method = data.idRemision === 0 ? 'POST' : 'PUT'
        const methoEmit = data.idRemision === 0 ? 'addPedido' : 'updatePedido'
        const result = await fetchConToken('remisiones/pedidos',data, method);
        const resp = await result.json();
        resp.ok ?   
                  Swal.fire({
                            text: "Datos Gurdados Correctamente",
                            icon: 'success',
                            showCancelButton: false,
                            confirmButtonColor: '#3085d6',
                            confirmButtonText: 'OK '
                        }).then((result) => {
                            method === 'POST' && dispatch( uiAddPedido() );
                            socketContext.emit(methoEmit, { status: 'ok' } );
                            navigate('/almacen/panelpedidos');
                    })
                : Swal.fire('', 'No se pudo generar el pedido', 'error')   ;                 
     
        }else{
            setErrorListProductos('Debe agregar al menos un producto');
    }
}
    
  return (
        <div className="bg-white px-5 py-5 rounded-md shadow-md mx-auto ">
            <h1 className="text-gray-600 font-bold text-xl uppercase text-center">Generar Pedidos</h1>
            <Formik
                initialValues={{
                    idRemision : !!idRemision ? idRemision : 0,
                    idCliente : !!idCliente ? { value: idCliente, label : nombreCliente } : '',
                    direccionEntrega: !!direccionEntrega ? direccionEntrega :'',
                    datePedido : !!datePedido ? toDate(utcToZonedTime(datePedido, '')) : new Date(),
                    dateEntrega : !!dateEntrega ? toDate(utcToZonedTime(dateEntrega, '')) : new Date(),
                    numEntrada : !!numEntrada ? numEntrada : '',
                    partidaPresupuestal : !!partidaPresupuestal ? partidaPresupuestal : '',
                    ordenSurtimiento: !!ordenSurtimiento ? ordenSurtimiento : '',
                    docFuente: !!docFuente ? docFuente : '',
                    isImportEntrada : false
                }}

                validationSchema = { validadPedidoSchema }

                onSubmit={async(values, { resetForm }) => {
                   
                    handleSubmit( values )
                   
                }}
            >
            {
                    ({ errors, setFieldValue, values, touched }) => { 
                        
                        const setValuesForm = useCallback(
                            ( id, e ) => {
                                setFieldValue( id , e);
                            },
                          [],
                        )  

                         const memoCliente = useMemo(() => ({idCliente : values.idCliente}),
                         [values.idCliente])
                        
                     return(   
                        <Form
                                className="mt-10"
                        >
                            <CabeceraPedido    
                                               values = { memoCliente } 
                                               setValuesForm = { setValuesForm } 
                                               errors = { errors } 
                                               touched = { touched } 
                                               clientes = { clientes } 
                                               setAction = { setAction }
                             />

                            <DatosPedido errors={ errors } 
                                         touched = { touched } 
                                         data = { { 
                                                    idRemision : values.idRemision,
                                                    datePedido  : values.datePedido, 
                                                    dateEntrega : values.dateEntrega, 
                                                    numEntrada : values.numEntrada,
                                                    partidaPresupuestal : values.partidaPresupuestal,
                                                    ordenSurtimiento : values.ordenSurtimiento,
                                                    docFuente : values.docFuente,
                                                    isImportEntrada : values.isImportEntrada
                                                } } 
                                         rutas = { rutas } 
                                         vendedores = { vendedores }
                                         setValuesForm = { setValuesForm }
                                         setAction = { setAction }
                                         setListProductos = { setListProductos }
                            />
<hr/>
                           <DetallePedido  listProductos = { listProductos } 
                                           setListProductos = { setListProductos }
                                           productos = { productos } 
                                           unidades = { unidad } 
                                           errorListProductos = { errorListProductos } 
                                           setAction = { setAction }
                                           dataRemision = { dataRemision }
                                           setDataRemision = { setDataRemision }
                                           idRemision = { values.idRemision }
                                           isImportEntrada = { values.isImportEntrada }
                            />

                            <ResumenCosto costoResumen = { costoResumen }/>

                       { setAction === '0' && !cargando &&     
                            <div className='flex'>
                                    <button
                                        type='submit'
                                        className=" mt-5 w-full bg-blue-700 p-2 text-white text-lg font-light
                                                    hover:shadow-2xl hover:touch-pinch-zoom hover:bg-blue-800"
                                    >
                                        { !!idRemision  ? 'Editar Pedido' : 'Generar Pedido ' }
                                    </button>
                                    <button
                                        type='button'
                                        className=" mt-5 w-full bg-gray-400 p-2 text-white  text-lg font-light
                                                    transition-colors  hover:shadow-2xl hover:touch-pinch-zoom hover:bg-gray-500"
                                        onClick={ () => { navigate('/almacen/panelpedidos'); } }
                                    >
                                    Descartar
                                    </button>
                            </div>
                        }
                        </Form>
                     )
                    }
            }
            </Formik>
            { setAction === '1' && !cargando &&
                        <div className='flex mt-10'>
                            <button
                                type='button'
                                className=" mt-5 w-full bg-green-600 p-2 text-white text-lg font-light
                                            transition-colors  hover:shadow-2xl hover:touch-pinch-zoom hover:bg-green-700"
                                onClick={ handlesGeneraRemision }
                            >
                              {  idCliente === 102 ? 'Realizar Traspaso' : 'Cerrar Pedido' }
                            </button>
                            <button
                                type='button'
                                className=" mt-5 w-full bg-gray-400 p-2 text-white text-lg font-light
                                            transition-colors  hover:shadow-2xl hover:touch-pinch-zoom hover:bg-gray-500"
                                onClick={ () => { navigate('/almacen/panelpedidos'); } }
                            >
                               Descartar
                            </button>
                        </div>
            }
        </div>
  )
}
