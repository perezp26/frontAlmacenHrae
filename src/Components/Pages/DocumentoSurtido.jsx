import { useState, useEffect, forwardRef, useContext } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';

import Swal from 'sweetalert2';
import 'sweetalert2/dist/sweetalert2.css'

import DatePicker from 'react-datetime-picker/dist/entry.nostyle';
import "react-datetime-picker/dist/DateTimePicker.css";
import "react-calendar/dist/Calendar.css";
import "react-clock/dist/Clock.css";
import { isValid } from 'date-fns';
import { utcToZonedTime, toDate} from 'date-fns-tz'

import MaterialTable from '@material-table/core';
import DeleteOutline from '@material-ui/icons/DeleteOutline';
import Edit from '@material-ui/icons/EditSharp';

import { fetchConToken } from '../../helpers/fetch';
import { UseForm } from '../../hooks/UseForm'
import { uiOpenModal, uiViewModalSurtir } from '../../actions/ui';
import { clearProductosSurtido, fillDataSurtido } from '../../actions/surtido';
import { Alerta } from '../ControlsForm/Alerta';
import ModalSutir from '../ControlsForm/ModalSurtir';
import { SocketContext } from '../../../SocketContext';
import { ResumenCosto } from '../ControlsForm/ResumenCosto';
import { Form, Formik } from 'formik';


const tableIcons = {
    Delete: forwardRef((props, ref) => <DeleteOutline {...props} ref={ref} />),
    Edit: forwardRef((props, ref) => <Edit {...props} ref={ref} />),
}
export const DocumentoSurtido = () => {

    const socketContext = useContext( SocketContext );
    const navigate = useNavigate()
    const dispatch = useDispatch();
    const { idSurtido } = useParams();
    const { productosListSolicitado, productosListSurtido } = useSelector(state => state.surtido);

    const [cargando, setCargando] = useState(false);
    const [errorDate, seterrorDate] = useState(false);
    const [costoResumen, setCostoResumen] = useState({
        subtotal : "0.00",
        iva :  "0.00",
        total :  "0.00"
    })
    const [valuesForm, handleInputChange, reset] = UseForm({
        dateRegistro: new Date(),
        numSurtido: '',
        cliente: '',
        ruta: '',
        numFactura: '',
        status: 1
    })
    const { dateRegistro, numSurtido, cliente, ruta, numFactura, status } = valuesForm;

    const columns = [
        { title: 'Producto', field: '', render: rowData => <>{ `${rowData.codigo}-${rowData.nombreProducto}` }</>,  width: 600 },
        { title: 'Solicitado', field: 'solicitado', width: 20 },
        { title: 'Surtido', field: 'surtido',width: 20 },
        { title: 'Procentaje', field: 'porcentaje', width: 20 },
        { title: 'Iva', field:'iva', type:'currency', width: 20},
        { title: 'Costo', field:'precio', type:'currency',width: 20},
    ];

    useEffect( async() => {
        dispatch(clearProductosSurtido());
        if( idSurtido !== 'null' ){
            const resp = await dispatch( fillDataSurtido(idSurtido) )
            const { dateRegistro, numSurtido, cliente, status, subtotal, iva, total } = resp;
            const formatDate = toDate(utcToZonedTime(dateRegistro)) 
            reset({ dateRegistro : formatDate, numSurtido, cliente, status })
        }
    }, [])

    useEffect( () => {
        let ivaTotal = 0.00;
        let precioTotal = 0.00;

        productosListSolicitado.forEach(e => {
            ivaTotal = ivaTotal + Number(e.iva);
            precioTotal = precioTotal + Number(e.precio)
        });

        setCostoResumen({ iva: ivaTotal.toFixed(2), subtotal : precioTotal.toFixed(2), total : (ivaTotal + precioTotal).toFixed(2) })       

    }, [productosListSolicitado])

    const handleOpenModal = (view = 'productos', idListSurtido = '', codigo = '' , idProducto = 0, solicitado = 0) => {
        dispatch(uiOpenModal());
        const dataView = { view, idListSurtido, codigo, idProducto, solicitado }
        dispatch(uiViewModalSurtir(dataView))
    }

    const handlesGrabaSurtido = async () => {

        setCargando(true);
        seterrorDate(false);

        const isValidDate = isValid(dateRegistro);
        const isValidData = numSurtido.trim() === "" ? false : cliente.trim() === "" ? false : productosListSolicitado.length < 1 ? false : true 

        if (isValidDate && isValidData) {

            const dataSurtido = {
                numSurtido,
                dateRegistro,
                cliente,
                status,
                productosSolicitado: productosListSolicitado,
                productosSurtido : productosListSurtido,
                costoResumen
            }

            if( idSurtido === 'null'){
                // const url = `surtido/addsurtido`;
                // const respuesta = await fetchConToken(url, dataSurtido, 'POST');
                // const result = await respuesta.json();
    
                // if (result.ok) {
                //     Swal.fire('OK', 'Los datos se guardaron correctamente', 'success');
                // }
            }else {
                //console.log( dataSurtido );
                const url =  idSurtido.substring(0,2) !== 'PR' ? `surtido/${idSurtido}` : `surtido/editremisionsurtido/${idSurtido}`;
                const respuesta = await fetchConToken(url, dataSurtido, 'PUT');
                const result = await respuesta.json();
                setCargando(false);
                seterrorDate(false);
                if (result.ok) {
                    Swal.fire('OK', result.msg, result.ico);
                    
                    idSurtido.substring(0,2) === 'PR' && socketContext.emit('updatePedido', { status: 'ok' } );
                    idSurtido.substring(0,2) !== 'PR' ? navigate('../salidaalmacen') : navigate('../../almacen/panelpedidos');
                }
            }
            

        } else {
            Swal.fire('Error', 'Datos incompletos', 'error');
            setCargando(false);
            seterrorDate(false);
        }
    }
    const handelNavigate = () => {
      idSurtido.substring(0,2) !== 'PR' ? navigate('../salidaalmacen') : navigate('../../almacen/panelpedidos');
    }

    return (
        <>
            <h1 className=" font-black text-3xl text-blue-900">Salida de Almácen</h1>
            <p className="mt-3">
                Realizar la salida del almacen de un producto con el número de surtido
            </p>

            <div className="bg-white px-5  rounded-md shadow-md mx-auto mt-2">
                <div className='flex justify-between bg-slate-200 py-2 px-5'>
                    <div><h1 className="text-gray-600 font-bold text-xl uppercase text-center">Documento Surtido</h1></div>
                    <button type='button' className='  bg-slate-500 px-3' onClick={ handelNavigate }> <i className="fa-solid fa-xmark fa-xl"></i> </button>
                </div>
                

                <div className="bg-white px-5 py-5 rounded-md shadow-md mx-auto ">

                    <div className="md:flex w-full  mt-3">
                        <div className='md:w-1/3'>
                            <label className="text-gray-800" htmlFor="_pallet"> Número de Surtido</label>
                            <input
                                name="numSurtido"
                                value={numSurtido}
                                className={'mt2 block w-full p-2 bg-gray-200 rounded-lg outline-blue-500 text-center'}
                                type="text"
                                placeholder="Número de Surtido"
                                onChange={({ target }) => { handleInputChange(target.name, target.value) }}
                                disabled = { idSurtido.substring(0,2) === 'PR'  ? true : false }
                            />
                        </div>
                        <div className='md:w-1/3 md:pl-4'>
                            <label className="text-gray-800" htmlFor="dateRegistro" >Fecha Registro</label>
                            <DatePicker
                                name="dateRegistro"
                                className={`mt2 w-full p-1 bg-gray-200 rounded-lg outline-blue-500 text-center `}
                                styles={'border: none '}
                                format='dd-MM-y'
                                onBlur={() => seterrorDate(!isValid(dateRegistro))}
                                onChange={date => { handleInputChange('dateRegistro', date) }}
                                value={dateRegistro}
                                disabled = { idSurtido.substring(0,2) === 'PR'  ? true : false }
                            />
                            {(errorDate) &&
                                <Alerta className="  ml-0" >
                                    Fecha no valida
                                </Alerta>
                            }
                        </div>
                        <div className='md:w-1/3 md:pl-4'>
                            <label className="text-gray-800" htmlFor="_pallet"> Cliente </label>
                            <input
                                name="cliente"
                                value={cliente}
                                className={'mt2 block w-full p-2 bg-gray-200 rounded-lg outline-blue-500 text-center'}
                                type="text"
                                placeholder="Cliente"
                                onChange={({ target }) => { handleInputChange(target.name, target.value) }}
                                disabled = { idSurtido.substring(0,2) === 'PR'  ? true : false }
                            />
                        </div>
                    </div>
                    <div className=' flex flex-row items-center mt-2 '>
                        <p className="text-red-700 font-light text-sm">*Todos los campos son obligatorios</p>
                        {/* <div className="flex-1 text-right ">
                            <button
                                type="button"
                                className="rounded-full px-3 py-2 text-white bg-sky-700 transition ease-out duration-500 hover:bg-sky-600 hover:shadow-lg"
                                onClick={() => { handleOpenModal('productos') }}
                            >
                                <i className='fas fa-plus '> </i>
                            </button>
                        </div> */}
                    </div>
                    <div style={{ maxWidth: '100%' }}>
                        <MaterialTable
                            title="Productos"
                            columns={columns}
                            icons={tableIcons}
                            data={productosListSolicitado}

                            actions={[
                                {
                                    icon: tableIcons.Edit,
                                    tooltip: 'Surtir',
                                    onClick: (event, rowData) => {
                                        handleOpenModal('listSalidas', rowData.id, rowData.codigo, rowData.idProducto, rowData.solicitado)
                                    }
                                },
                                // {
                                //     icon: tableIcons.Delete,
                                //     tooltip: 'Borrar',
                                //     onClick: (event, rowData) => {
                                //         dispatch(deleteProductoSolicitud(rowData.id))
                                //     }
                                // },
                            ]}


                            options={{
                                toolbar: false,
                                headerStyle:{
                                    fontSize:12,
                                    fontWeight: 'bold'
                                },
                                rowStyle:{
                                    fontSize: 12
                                }
                            }}

                            localization={{
                                header: {
                                    actions: ''
                                }
                            }}
                        />
                    </div>
                    <div className='mb-7'>
                        <Formik> 
                            <Form>
                                    <ResumenCosto costoResumen = { costoResumen } />
                            </Form>
                        </Formik>
                    </div>
                    

                    <button
                        className=' w-full bg-sky-700 py-2 text-white transition ease-out duration-500 hover:bg-sky-600 hover:shadow-lg'
                        type='button'
                        onClick={handlesGrabaSurtido}
                    >
                        Guardar Datos
                    </button>
                </div>
            </div>



            <ModalSutir />
        </>
    )
}
