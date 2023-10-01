import { useCallback } from 'react';
import { Form, Formik } from 'formik';
import Swal from "sweetalert2";
import * as Yup from 'yup';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

import Select from 'react-select';
import { customStyles, customStylesControl } from './customStylesSelects';

import DatePicker from 'react-datetime-picker/dist/entry.nostyle';
import "react-datetime-picker/dist/DateTimePicker.css";
import "react-calendar/dist/Calendar.css";
import "react-clock/dist/Clock.css";

import { utcToZonedTime, toDate, format } from 'date-fns-tz'

import { Alerta } from '../ControlsForm/Alerta';
import { MyTextInput } from '../ControlsForm/MyTextInput';
import { DetalleEntradatable } from '../ControlsForm/DetalleEntradatable';
import { ModalEditEntrada } from '../ControlsForm/ModalEditEntrada';
import { useState } from 'react';
import { fetchConToken } from '../../helpers/fetch';
import { startClearDetalleEntrada } from '../../actions/entrada';
import { ResumenCosto } from '../ControlsForm/ResumenCosto';
import { useMemo } from 'react';
import { uiSetLoading } from '../../actions/ui';
import { Spinner } from '../ControlsForm/Spinner';

export const NuevaEntrada = () => {

  const dispatch = useDispatch();
  const navigate = useNavigate();
    const { ui, entrada } = useSelector(state => state);
    const { editEntradaCabecero } = entrada;
    const { proveedores, fuentesFinanciamiento, loading } = ui;

    const { idEntradaCabecero, idProveedor, proveedore, dateRegistro,  pallet, numeroDocumento, observaciones, entradas, subtotal, iva, total,
    idFuenteFinanciamiento, fuentesfinanciamiento, partidaPresupuestal, noContrato, ordenSurtimiento } = editEntradaCabecero;

    const [listProductosEntrada, setListProductosEntrada] = useState(!!entradas ? [...entradas] : [] );
    const [costoResumen, setcostoResumen] = useState({
                subtotal : !!subtotal ? subtotal : "0.00",
                iva : !!iva ? iva : "0.00",
                total : !!total ? total : "0.00"
    })

    const handlesViewAddProducto = () => {
      dispatch( startClearDetalleEntrada() );
    }



    const handleSubmit = async(valores, resetForm) => {

      dispatch(uiSetLoading(true))  
      const datavalores = {
          ...valores,
          idFuenteFinanciamiento : valores.idFuenteFinanciamiento.value,
          idProveedor : valores.idProveedor.value,
          dateRegistro: format(valores.dateRegistro, 'yyyy-MM-dd'),
          subtotal: costoResumen.subtotal,
          iva: costoResumen.iva,
          total: costoResumen.total,
          listProductosEntrada : editEntradaCabecero.entradas,
          costoResumen
      }


       if (datavalores.idEntradaCabecero === 0){
        const resp = await fetchConToken('productos/entradacabecero', datavalores, 'POST');
        const result = await resp.json();
        dispatch(uiSetLoading(false)) ;

        result.ok   ?   navigate('../../almacen/panelentradas') 
                    :   Swal.fire('Error',result.msg,'error')

      }else{
        const resp = await fetchConToken('productos/udpateentradacabecero', datavalores, 'PUT');
        const result = await resp.json();
        dispatch(uiSetLoading(false))  ;

        result.ok && navigate('../../almacen/panelentradas')
      }
      
    }

    const entradaCabeceroSchema = Yup.object().shape({
        idProveedor: Yup.object().shape({ value: Yup.string().required('Debe seleccionar un provedor') }),
        dateRegistro: Yup.string().required('La fecha de entrada es obligatoria').nullable(),
    })

    const setListProductosEntradaCallBack = useCallback(
        ( list ) => {
            setListProductosEntrada( list );
        },
      [],
    ) 

    const setcostoResumenCallBack = useCallback(
        ( data ) => {
            setcostoResumen( data );
        },
      [],
    ) 

    const memoListProductosEntrada = useMemo(() => (listProductosEntrada),
                         [listProductosEntrada])

  return (
    <>
        <h1 className=" font-black text-3xl text-blue-900">Nueva Entrada</h1>

         {/* <FormEntrada /> */}
         <Formik
         
              initialValues={{
                idEntradaCabecero: !!idEntradaCabecero ? idEntradaCabecero : 0,
                idProveedor: !!idProveedor ? proveedore : '',
                dateRegistro: !!dateRegistro ? toDate(utcToZonedTime(dateRegistro, '')) : new Date(),
                pallet: !!pallet ? pallet : '',
                numeroDocumento : !!numeroDocumento ? numeroDocumento : '',
                observaciones : !!observaciones ? observaciones : '',
                idFuenteFinanciamiento: !!idFuenteFinanciamiento ? fuentesfinanciamiento : '',
                partidaPresupuestal : !!partidaPresupuestal ? partidaPresupuestal : '',
                noContrato: !!noContrato ? noContrato : '',
                ordenSurtimiento : !!ordenSurtimiento ? ordenSurtimiento : '',
            }}
            validationSchema={entradaCabeceroSchema}

            onSubmit={(values, { resetForm }) => {
              handleSubmit(values, resetForm);
          }}
         >
         


         {
              ({ errors, setFieldValue, values, touched }) => {

                  return (
                      <Form
                          className="mt-5"
                      >
                         <div className="md:flex">
                                    <div className="md:w-3/5 md:pr-7">
                                        <div className={`${errors.idProveedor && touched.idProveedor ? 'mb-10' : 'mb-4'}`}>
                                            <label className="text-gray-800" htmlFor="idProveedor"> Proveedor </label>
                                            <Select
                                                styles={{
                                                    ...customStyles,
                                                    control: (style) => ({
                                                        ...style,
                                                        ...customStylesControl, padding: 0,
                                                        border: `${errors.idProveedor && touched.idProveedor ? ' 1px solid #ff0000 ' : ''}`
                                                    })
                                                }}
                                                options={ proveedores }
                                                id="idProveedor"
                                                name="idProveedor"
                                                placeholder="Seleccionar un proveedor"
                                                isClearable
                                                value={values.idProveedor}
                                                onChange={e => { setFieldValue("idProveedor", !!e ? e : '') }}
                                            />
                                            {(errors.idProveedor && touched.idProveedor) &&
                                                <Alerta className=" -m-6 ml-0" >
                                                    {errors.idProveedor.value}
                                                </Alerta>
                                            }
                                        </div>
                                    </div>
                                    <div className="md:w-1/5 md:pl-2">
                                            <label className="text-gray-800 block" htmlFor="dateRegistro" >Fecha Registro</label>
                                            <DatePicker
                                                name="dateRegistro"
                                                className={`mt2 w-full p-1.5 bg-gray-200 rounded-lg outline-blue-500 text-center
                                            ${errors.dateRegistro && touched.dateRegistro ? ' border border-red-700 ' : ''} `}
                                                styles={'border: none '}
                                                format='dd-MM-y'
                                                onChange={date => { setFieldValue("dateRegistro", date); }}
                                                value={values.dateRegistro}
                                            />
                                            {(errors.dateRegistro) &&
                                                <Alerta >
                                                    {errors.dateRegistro}
                                                </Alerta>
                                            }
                                    </div>
                                    <div className="md:w-1/5 md:pl-7">
                                        <MyTextInput
                                            label="Número Documento"
                                            name="numeroDocumento"
                                            labelClassName="text-gray-800"
                                            className={'mt2 block w-full p-2 bg-gray-200 rounded-lg outline-blue-500 text-center '}
                                            type="text"
                                            placeholder="Número de Doucmento"
                                        />
                                    </div>
                                  { values.idEntradaCabecero !== 0  &&  <div className="md:w-1/5  text-center pt-4">
                                        <p className=' text-3xl text-green-600 font-semibold ' > { values.idEntradaCabecero } </p>
                                    </div> }
                          </div>
                          <div className=' md:flex mb-2'>
                                <div className="md:w-1/4 md:pr-7">
                                
                                            <label className="text-gray-800" htmlFor="idFuenteFinanciamiento"> Fuente Financiamiento </label>
                                            <Select
                                                styles={{
                                                    ...customStyles,
                                                    control: (style) => ({
                                                        ...style,
                                                        ...customStylesControl, padding: 0,
                                                    })
                                                }}
                                                options={ fuentesFinanciamiento }
                                                id="idFuenteFinanciamiento"
                                                name="idFuenteFinanciamiento"
                                                placeholder="Fuente Financiamiento"
                                                isClearable
                                                value={values.idFuenteFinanciamiento}
                                                onChange={e => { setFieldValue("idFuenteFinanciamiento", !!e ? e : '') }}
                                            />
                                </div>
                                <div className="md:w-1/4 md:pr-7">
                                    <MyTextInput 
                                            label="Partida Presupuestal"
                                            name="partidaPresupuestal"
                                            labelClassName="text-gray-800"
                                            className={'mt2 block w-full p-2 bg-gray-200 rounded-lg outline-blue-500 text-center '}
                                            type="text"
                                            placeholder="Partida Presupuestal"    
                                    />
                                </div>
                                <div className="md:w-1/4 md:pr-7">
                                    <MyTextInput 
                                            label="No. Contrato"
                                            name="noContrato"
                                            labelClassName="text-gray-800"
                                            className={'mt2 block w-full p-2 bg-gray-200 rounded-lg outline-blue-500 text-center '}
                                            type="text"
                                            placeholder="No. Contrato"    
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
                                    />
                                </div>
                          </div>
                          
                          <DetalleEntradatable listProductosEntrada={ memoListProductosEntrada } setListProductosEntrada = { setListProductosEntradaCallBack } costoResumen = {costoResumen} setcostoResumen= { setcostoResumenCallBack } />

                          <button type='button' className='w-full bg-sky-700 py-2 text-white transition ease-out duration-500 hover:bg-sky-600 hover:shadow-lg' onClick={ handlesViewAddProducto }>
                              Agregar Producto 
                          </button>

                        <ResumenCosto costoResumen = { costoResumen } />
                          
                          <div className="md:flex mt-5">

                                    <div className="md: w-full">
                                        <MyTextInput
                                            label="Observaciones"
                                            name="observaciones"
                                            labelClassName="text-gray-800"
                                            className={'mt2 block w-full p-2 bg-gray-200 rounded-lg outline-blue-500 '}
                                            type="text"
                                            placeholder="Marca y/o observaciones (100 Caracteres max.)"
                                            maxLength = { 100 }
                                        />
                                    </div>
                          </div>
                        <div className='flex mt-16'>
                            {
                                loading ? <Spinner />
                                : 
                                <>
                                <button type='submit' className='w-1/2 bg-green-700 py-2 text-white transition ease-out duration-500 hover:bg-green-600 hover:shadow-lg' > 
                                    Grabar 
                                </button>
                                <button
                                type='button'
                                className=" w-1/2 bg-gray-400 p-3 text-white   font-light
                                            transition-colors  hover:shadow-2xl hover:touch-pinch-zoom hover:bg-gray-500"
                                onClick={ () => { navigate('/almacen/panelentradas'); } }
                                >
                                Descartar
                                </button>
                                </>
                            }
                                
                        </div>               

                      </Form>
              )}
          }
      </Formik>
      
      <ModalEditEntrada listProductosEntrada={ listProductosEntrada }  setListProductosEntrada = { setListProductosEntradaCallBack } costoResumen = {costoResumen} setcostoResumen={ setcostoResumenCallBack }/>
    </>
  )
}
