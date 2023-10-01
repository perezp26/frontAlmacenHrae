import { useState } from "react";
import { useDispatch, useSelector } from 'react-redux';
import { Form, Formik } from 'formik';
import * as Yup from 'yup';
import Select from 'react-select';

import DatePicker from 'react-datetime-picker/dist/entry.nostyle';
import "react-datetime-picker/dist/DateTimePicker.css";
import "react-calendar/dist/Calendar.css";
import "react-clock/dist/Clock.css";

import Swal from 'sweetalert2';
import 'sweetalert2/dist/sweetalert2.css'
import { isValid, format } from 'date-fns'
import { utcToZonedTime, toDate } from 'date-fns-tz'

import { Alerta } from '../ControlsForm/Alerta';
import { Spinner } from '../ControlsForm/Spinner';
import { MyTextInput } from '../ControlsForm/MyTextInput';
import { customStyles, customStylesControl } from './customStylesSelects';
import { fetchConToken } from "../../helpers/fetch";
import { uiCloseModal } from '../../actions/ui';
import { entradaAddDetalle, entradaUpdateDetalle } from "../../actions/entrada";
import { downloadPdf } from "../../helpers/downloadPdf";
import { useEffect } from "react";
import { BitacoraEntrada } from "../ControlsForm/BitacoraEntrada";
import { generarId } from "../../helpers/generarId";

export const FormEntrada = ({ listProductosEntrada, setListProductosEntrada, costoResumen, setcostoResumen }) => {

    const dispatch = useDispatch();
    const [cargando, setCargando] = useState(false);
    const [existeLote, setExisteLote] = useState( false );
    const [bitacora, setBitacora] = useState([])
    const [dataInicial, setDataInicial ] = useState({
        iniUnidades : 0,
    })
    const { ui, entrada } = useSelector(state => state);
    const { editEntrada } = entrada;
    const { productos, estadosCalidad } = ui;

    const setPallet = (prefix, fecha = new Date(), consecutivo = '00X') => {

        const prefijo = prefix?.label ?? ''
        const _fecha = isValid(fecha) ? format(fecha, 'yyyyMMdd') : '-------';
        //const pallet = 'P' + prefijo.substring(0, 2) + '-' + _fecha + '-';
        const pallet = 'ENT' + '-' + _fecha + '-';

        return pallet;

    }

    const { idEntrada, idProducto, lote, caducidad, unidades, dateRegistro, pallet, producto, salidas, codigoEstado, precio, iva, partida } = editEntrada;
    
    useEffect(async() => {
        
    setDataInicial({...dataInicial,
            iniUnidades : idEntrada === 0 ? 0 : unidades
        })

        if( idEntrada !== 0 ){

            const url = `productos/getBitEntrada/${ idEntrada }`
            const resp = await fetchConToken( url )
            const resul = await resp.json()

            setBitacora([...bitacora, ...resul.bitacora])
        }

    }, [])
    
    const setDataSave = (valores, isDelete ) => {

        const _valores = { ...valores, 
            idProducto: valores.idProducto.value, 
            codigoEstado: valores.codigoEstado.value,
            ...dataInicial }

        return {
                ...editEntrada,
                ..._valores,
                caducidad: format(valores.caducidad, 'yyyy-MM-dd'),
                codigoProducto: valores.idProducto.codigo,
                descripcionProducto: valores.idProducto.descripcion,
                producto: {
                    idProducto: valores.idProducto.id,
                    //codigo: valores.idProducto.codigo,
                    //descripcion: valores.idProducto.descripcion,
                    //activo: valores.idProducto.activo,
                    iva: valores.idProducto.iva
                },
                codigoEstado : valores.codigoEstado.value,
                add : valores.idEntrada === 0 ? !isDelete && true : false,
                update : valores.idEntrada !== 0 ? !isDelete && true :false,
                delete : isDelete,
                existeLote 
        }

    } 

    const handleSubmit = async ( valores ) => {
        
       
            if (!!idEntrada) {
                if (valores.unidades < salidas) {
                    Swal.fire('Error', `Este pallet tiene ya registradas  : ${salidas} salidas`, 'error')
                    return false;
                }
            }

            setcostoResumen({ ...costoResumen , 
                    subtotal : (Number(costoResumen.subtotal) - ((!!precio ? precio : 0.00) * (!!unidades ? unidades : 0.00) ) + (valores.precio * valores.unidades)).toFixed(2),
                    iva : (Number(costoResumen.iva) - Number((!!iva ? iva * unidades : 0.00)) + (Number(valores.iva) * valores.unidades) ).toFixed(2),
                    total : (Number(costoResumen.total) - (((!!precio ? precio : 0.00) * (!!unidades ? unidades : 0.00))+ Number((!!iva ? iva * unidades : 0.00))) + ((valores.precio * valores.unidades) + (Number(valores.iva)* valores.unidades))).toFixed(2)
            })

            const newValores = setDataSave( valores , false )

            if (valores.idEntrada === 0) {

                setListProductosEntrada([ ...listProductosEntrada, newValores ]);
                dispatch( entradaAddDetalle(newValores) )
                dispatch(uiCloseModal());
            } 
            else {
                        const dataListProductos = listProductosEntrada.map( e => ( e.idEntrada === newValores.idEntrada ) ? newValores : e )
                        setListProductosEntrada([ ...dataListProductos ]);
                        dispatch(entradaUpdateDetalle(newValores));
                        dispatch(uiCloseModal());
            }

            setCargando(false)
    }
    const eliminar = async ( valores ) => {
        const newValores = setDataSave( valores , true )


        setcostoResumen({ ...costoResumen , 
            subtotal : (Number(costoResumen.subtotal) - ((!!precio ? precio : 0.00) * (!!unidades ? unidades : 0.00) ) ).toFixed(2),
            iva : (Number(costoResumen.iva) - Number((!!iva ? iva * unidades : 0.00)) ).toFixed(2),
            total : (Number(costoResumen.total) - (((!!precio ? precio : 0.00) * (!!unidades ? unidades : 0.00))+ Number((!!iva ? iva : 0.00))) ).toFixed(2)
        })

        dispatch(entradaUpdateDetalle(newValores));
        setListProductosEntrada([ ...listProductosEntrada.filter( e => e.idEntrada !== idEntrada) ])
        dispatch(uiCloseModal());
        Swal.fire('', 'El registro fue eliminado', 'info')

    }

    const handlesEliminar = async ( valores ) => {
        Swal.fire({
            title: 'Seguro que desea eliminar el registro?',
            text: "",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Si eliminar',
            cancelButtonText: 'No eliminar'
        }).then((result) => {
            if (result.isConfirmed) {
                eliminar( valores );


            }
        })
    }

    const entradaSchema = Yup.object().shape({

        idProducto: Yup.object().shape({ value: Yup.string().required('Debe seleccionar al menos un producto') }),
        lote: Yup.string().required('El lote es obligatorio'),
        caducidad: Yup.string().required('La caducidad es obligatoria').nullable(),
        unidades: Yup.number()
            //.integer('la unidades deben ser números sin decimales')
            .required('las unidades son requeridas')
            .test('Debe ser mayor a 0', 'las unidades deben ser mayor a cero', (value) => value > 0),
    })

    const _idProdcuto = !!producto ? {
        id: idProducto,
        value: idProducto,
        label: `${producto.codigo}-${producto.descripcion}`,
        codigo: producto.codigo,
        descripcion: producto.descripcion,
        iva: producto.iva,
        activo: producto.activo
    } : '';

    return (
        <div className="bg-white px-5 py-5 rounded-md shadow-md mx-auto ">
            <h1 className="text-gray-600 font-bold text-xl uppercase text-center"> {!!idEntrada ? 'Editar Entrada' : 'Agregar Entrada'}</h1>

            <Formik
                initialValues={{
                    idTemp: generarId(),
                    idEntrada: !!idEntrada ? idEntrada : 0,
                    idProducto: !!idProducto ? _idProdcuto : '',
                    lote: !!lote ? lote : '',
                    caducidad: !!caducidad ? toDate(utcToZonedTime(caducidad, '')) : '',  //new Date()
                    unidades: !!unidades ? unidades : 0,
                    dateRegistro: !!dateRegistro ? toDate(utcToZonedTime(dateRegistro, '')) : new Date(),
                    pallet: !!pallet ? pallet : '',
                    codigoEstado : !!codigoEstado ? codigoEstado : {value: "D", label:"Disponible" },
                    precio : !!precio ?  precio : 0.00,
                    iva : !!iva ? iva : 0.00,
                    partida: !!partida ? partida : ''
                }}

                validationSchema={entradaSchema}

                onSubmit={(values, { resetForm }) => {
                    setCargando(true)
                    setTimeout(( ) => {
                        handleSubmit(values, resetForm);
                      }, 1)
                   
                }}
            >
                {
                    ({ errors, setFieldValue, values, touched }) => {
                        return (
                            <Form
                                className="mt-10"
                            >
                                <div className="md:flex">
                                    <div className=" w-full">
                                        <div className={`${errors.idProducto && touched.idProducto ? 'mb-10' : 'mb-4'}`}>
                                            <label className="text-gray-800" htmlFor="idProducto"> Producto </label>
                                            <Select
                                                styles={{
                                                    ...customStyles,
                                                    control: (style) => ({
                                                        ...style,
                                                        ...customStylesControl,
                                                        border: `${errors.idProducto && touched.idProducto ? ' 1px solid #ff0000 ' : ''}`
                                                    })
                                                }}
                                                options={productos}
                                                id="idProducto"
                                                name="idProducto"
                                                placeholder="Seleccionar un producto"
                                                isClearable
                                                value={values.idProducto}
                                                onChange={e => { setFieldValue("idProducto", !!e ? e : ''); setFieldValue('pallet', setPallet(e, values.dateRegistro)); setFieldValue("lote",'') }}
                                                isDisabled = { !!idEntrada ? !!salidas ? salidas > 0 ? true : false : false : false }
                                            />
                                            {(errors.idProducto && touched.idProducto) &&
                                                <Alerta className=" -m-6 ml-0" >
                                                    {errors.idProducto.value}
                                                </Alerta>
                                            }
                                        </div>
                                    </div>
                                </div>
                                <div className="md:flex mb-4">
                                <div className="md:w-1/3 md:pr-7">
                                        <MyTextInput
                                            label="Unidades"
                                            name="unidades"
                                            labelClassName="text-gray-800"
                                            className={`mt2 block w-full p-3 bg-gray-200 rounded-lg outline-blue-500 text-center  
                                                        ${errors.unidades && touched.unidades ? ' border border-red-700 ' : ''}   `}
                                            type="number"
                                            placeholder="Unidades"
                                            onFocus = { e => e.target.select() }
                                        />
                                    </div>
                                    <div className="md:w-1/3 md:pr-7">
                                        <MyTextInput
                                            label="Lote"
                                            name="lote"
                                            labelClassName="text-gray-800"
                                            className={`mt2 block w-full p-3 bg-gray-200 rounded-lg outline-blue-500 text-center  
                                                        ${errors.lote && touched.lote ? ' border border-red-700 ' : ''}   `}
                                            type="text"
                                            placeholder="Lote"
                                            onBlur = { async() => { 
                                                                setCargando( true ) 
                                                                const url = `productos/getlotecaducidad`
                                                                const resp = await fetchConToken( url, { idProducto : values.idProducto.value, lote : values.lote }, 'POST' );
                                                                const result = await resp.json();  
                                                                
                                                                if (result.ok) { 
                                                                            !!result.loteCaducidad ? 
                                                                                                    setFieldValue( "caducidad",toDate(utcToZonedTime(result.loteCaducidad.dateCaducidad, '')) ) 
                                                                                                    : setFieldValue( "caducidad",'', '');
                                                                             setExisteLote( !!result.loteCaducidad ? true : false )
                                                                        } 
                                                                setCargando( false ) 
                                                                
                                            } }
                                        />
                                    </div>
                                    <div className="flex md:w-1/3 md:pl-7">
                                        <div className="w-full">
                                            <label className="text-gray-800 block" htmlFor="caducidad" >Caducidad</label>
                                            <DatePicker
                                                name="caducidad"
                                                className={`mt2 p-2 w-full bg-gray-200 rounded-lg outline-blue-500 text-center
                                                ${errors.caducidad && touched.caducidad ? ' border border-red-700 ' : ''} `}
                                                styles={'border: none '}
                                                format='dd-MM-y'
                                                onChange={date => setFieldValue("caducidad", date)}
                                                value={values.caducidad}
                                                disabled = { existeLote }
                                                disableCalendar = { existeLote }
                                            />
                                            {(errors.caducidad) &&
                                                <Alerta >
                                                    {errors.caducidad}
                                                </Alerta>
                                            }
                                        </div>
                                        
                                    </div>
                                </div>

                                <div className="md:flex mb-4">
                                   
                                </div>


                                <div className="md:flex mb-2">
                                    <div className="md:w-1/4 md:pr-7">
                                            <label className="text-gray-800" htmlFor="idProducto"> Estado de Calidad </label>
                                            <Select
                                                styles={{
                                                    ...customStyles,
                                                    control: (style) => ({
                                                        ...style,
                                                        ...customStylesControl
                                                    })
                                                }}
                                                options={ estadosCalidad }
                                                id="codigoEstado"
                                                name="codigoEstado"
                                                placeholder="Seleccionar un Estado"
                                                value={values.codigoEstado}
                                                onChange={e => { setFieldValue("codigoEstado", !!e ? e : '') }}
                                            />
                                    </div>
                                    <div className="md:w-1/4">
                                            <MyTextInput
                                                label="Precio Unitario"
                                                name="precio"
                                                labelClassName="text-gray-800"
                                                className={`mt2 block w-full p-3 bg-gray-200 rounded-lg outline-blue-500 text-center ${errors.precio && touched.precio ? ' border border-red-700 ' : ''}   `}
                                                type="number"
                                                placeholder="Precio"
                                                onBlur = { ( { target } ) => { setFieldValue('iva', values.idProducto.iva === 'SI' ? (target.value * .16).toFixed(2) : 0.00 ) } }
                                                onFocus = { e => e.target.select() }
                                            />
                                    </div>
                                    {/* <div className="md:w-1/4 pl-7">
                                        <MyTextInput
                                            label="Partida"
                                            name="partida"
                                            labelClassName="text-gray-800"
                                            className={`mt2 block w-full p-3 bg-gray-200 rounded-lg outline-blue-500 text-center`}
                                            type="text"
                                            placeholder="Partida"
                                        />
                                    </div> */}
                                        <div className="md:w-1/4 pl-7">
                                            <MyTextInput
                                                label="I.V.A."
                                                name="iva"
                                                labelClassName="text-gray-800"
                                                className={`mt2 block w-full p-3 bg-gray-200 rounded-lg outline-blue-500 text-center ${errors.precio && touched.precio ? ' border border-red-700 ' : ''}   `}
                                                type="number"
                                                placeholder="0.00"
                                                onFocus = { e => e.target.select() }
                                            />
                                        </div>
                                    
                                </div>
                                <div className="md:flex mb-4">
                                    <div className="md:w-1/4">
                                        <MyTextInput
                                          
                                            name="pallet"
                                            labelClassName="text-gray-800"
                                            className={'mt2 block w-full bg-gray-200 rounded-lg outline-blue-500 text-center text-gray-400'}
                                            type="text"
                                            placeholder="Id Registro"
                                            disabled={true}
                                        />
                                    </div>
                                    <div className="md:w-3/4 md:pl-7">
                                        {
                                        bitacora.length > 0 &&
                                        <table className="w-full  table-auto shadow bg-white text-xs" >
                                            <thead className='bg-blue-800 text-white text-xs font-light' >
                                                <tr>
                                                    <th className="p-2">Uni.</th>
                                                    <th className="p-2">Usuario</th>
                                                    <th className="p-2">Fecha</th>
                                                </tr>
                                            </thead>
                                        <tbody>
                                            {
                                                bitacora.map(b => (
                                                <BitacoraEntrada 
                                                        key = { b.idBitEntrada } 
                                                        bitacora = { b }
                                                />
                                                ))
                                            }
                                        </tbody>
                                        </table>
                                        }
                                    </div>
                                </div>
                                
                                {
                                    cargando ? <Spinner /> :
                                        <button
                                            type='submit'
                                            className=" mt-5 w-full bg-blue-700 p-4 text-white rounded-lg hover:shadow-2xl hover:touch-pinch-zoom hover:bg-blue-800"
                                        >
                                            {!!idEntrada ? 'Editar Entrada' : 'Grabar Entrada'}
                                        </button>}
                                {!!idEntrada && salidas < 1 && !cargando &&
                                    <button
                                        type="button"
                                        className="mt-5 w-full bg-red-700 p-4 text-white rounded-lg hover:shadow-2xl hover:touch-pinch-zoom hover:bg-red-800"
                                        onClick={() => handlesEliminar(values)}
                                    >
                                        Eliminar
                                    </button>
                                }
                                {
                                    salidas > 0 && !cargando &&
                                    <div className=" w-full text-center text-red-500 mt-8">
                                        <label> NO SE PUEDE ELIMINAR ESTA ENTRADA YA QUE TIENE SALIDAS REGISTRADAS</label>
                                    </div>
                                }



                            </Form>
                        )
                    }
                }
            </Formik>
        </div>
    )
}
