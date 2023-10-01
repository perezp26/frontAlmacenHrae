
import DatePicker  from 'react-datetime-picker/dist/entry.nostyle';
import DateTimePicker  from 'react-datetime-picker/dist/entry.nostyle';
import "react-datetime-picker/dist/DateTimePicker.css";
import "react-calendar/dist/Calendar.css";

import Swal from 'sweetalert2';
import 'sweetalert2/dist/sweetalert2.css'

import { MyTextInput } from './MyTextInput';
import { fetchConToken } from '../../helpers/fetch';
import { generarId } from '../../helpers/generarId';

export const DatosPedido = ({ errors, touched, data, setValuesForm, setAction, setListProductos }) => {
    const { datePedido, dateEntrega, formaPago, idVendedor, idRuta } = data; 

    const handlesImportEntrada = async() => {
       
        const url = `productos/getdataentradacabecero/${ data.numEntrada }`
        const resp = await fetchConToken( url )
        const result = await resp.json()
        const { ok, entradasCabecero, existSalidas } = result

        if ( !existSalidas ){

                setValuesForm("partidaPresupuestal" , entradasCabecero.partidaPresupuestal)
                setValuesForm("ordenSurtimiento" , entradasCabecero.ordenSurtimiento)
                setValuesForm("docFuente" , entradasCabecero.numeroDocumento)
                setValuesForm("isImportEntrada", true)

                setListProductos(entradasCabecero.entradas.map( e => ({ 
                                        idEntrada : e.idEntrada,
                                        cantidad : e.unidades,
                                        surtido : e.unidades,
                                        producto : { value : e.idProducto, codigo : e.codigoProducto, descripcion : e.descripcionProducto,  },
                                        unidad : e.producto.unidadmedida.descripcion,
                                        pUnitario : e.precio,
                                        ivaUnitario: e.iva,
                                        precio : (Number(e.unidades) * Number(e.precio)).toFixed(2),
                                        iva : ( Number(e.unidades) * Number(e.iva) ).toFixed(2),
                                        id :  generarId(),
                                        idEntradaCabecero : e.idEntradaCabecero

                })))
        }else{
            Swal.fire('Aviso','No se pude realizar esta acción. Esta entrada ya cuenta con movimientos','info');
        }
    }

  return (
    <>
        <div className='flex mb-10'>
                <div className="w-1/4 px-2">
                    <label className="text-gray-800" htmlFor="idDireccion"> Fecha Pedido </label>
                    <DatePicker 
                        name = "datePedido"
                        className={ `block w-full p-2 rounded-lg outline-blue-500 text-center  bg-slate-200   
                                    ${ errors.datePedido && touched.datePedido ? ' border border-red-600 ': ''}`}
                        styles = {'border: none ' }
                        format='dd-MM-y'
                        value={ datePedido } 
                        onChange={ date => setValuesForm("datePedido", date) }
                        disabled= { setAction === '1' }
                    />

                </div>
                <div className="w-1/4 px-2">
                    <label className="text-gray-800" htmlFor="idDireccion"> Fecha y Hora Entrega </label>
                    <DateTimePicker 
                        name = "dateEntrega"
                        className={ `block w-full p-2 rounded-lg outline-blue-500 text-center bg-slate-200   
                                     ${ errors.dateEntrega && touched.dateEntrega ? ' border border-red-600 ': ''}`}
                        styles = {'border: none ' }
                        format='dd-MM-y h:mm a'
                        value={ dateEntrega } 
                        onChange={ date => setValuesForm("dateEntrega", date) }
                        disabled= { setAction === '1' }
                    />
                </div>
                <div className="w-1/2 px-2">
                    <MyTextInput 
                        label="Lugar de Entrega"
                        name="direccionEntrega"
                        labelClassName="text-gray-800"
                        className={`mt2 block w-full p-3 bg-gray-200 rounded-lg outline-blue-500 text-center  
                                    ${errors.direccionEntrega && touched.direccionEntrega ? ' border border-red-700 ' : ''}   `}
                        type="text"
                        placeholder="Lugar Entrega"
                        disabled= { setAction === '1' }
                    />
                </div>
        </div>
        <div className=' md:flex mb-7'>
                <div className="md:w-1/4 md:pr-7">
                    <MyTextInput 
                            label="Número de Entrada"
                            name="numEntrada"
                            labelClassName="text-gray-800"
                            className={'mt2 block w-full p-2 bg-gray-200 rounded-lg outline-blue-500 text-center '}
                            type="text"
                            placeholder="Número de Entrada"    
                            disabled= { setAction === '1' }
                    />
                    { data.idRemision === 0 && <button className='w-full bg-green-700 text-white rounded-md' type='button' onClick={ handlesImportEntrada } >Importar Entrada y Surtir</button> }
                </div>
                <div className="md:w-1/4 md:pr-7">
                    <MyTextInput 
                            label="Partida Presupuestal"
                            name="partidaPresupuestal"
                            labelClassName="text-gray-800"
                            className={'mt2 block w-full p-2 bg-gray-200 rounded-lg outline-blue-500 text-center '}
                            type="text"
                            placeholder="Partida Presupuestal"    
                            disabled= { setAction === '1' }
                    />
                </div>
                <div className="md:w-1/4 md:pl-7">
                    <MyTextInput 
                            label="Orden Surtimiento"
                            name="ordenSurtimiento"
                            labelClassName="text-gray-800"
                            className={'mt2 block w-full p-2 bg-gray-200 rounded-lg outline-blue-500 text-center '}
                            type="text"
                            placeholder="Orden Surtimiento"   
                            disabled= { setAction === '1' } 
                    />
                </div>
                <div className="md:w-1/4 md:pl-7">
                    <MyTextInput 
                            label="Documento Fuente"
                            name="docFuente"
                            labelClassName="text-gray-800"
                            className={'mt2 block w-full p-2 bg-gray-200 rounded-lg outline-blue-500 text-center '}
                            type="text"
                            placeholder="Documento Fuente"    
                            disabled= { setAction === '1' }
                    />
                </div>
        </div>
    </>
  )
}
