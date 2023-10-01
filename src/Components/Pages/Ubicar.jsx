import { useState,useEffect } from 'react'
import Select from 'react-select';
import { useSelector } from 'react-redux';

import Swal from 'sweetalert2';
import 'sweetalert2/dist/sweetalert2.css'

import { customStyles, customStylesControl } from './customStylesSelects';
import { Spinner } from '../ControlsForm/Spinner';
import { UseForm } from '../../hooks/UseForm';
import { fetchSinToken, fetchConToken } from '../../helpers/fetch';
import {  } from 'react';
import { Entrada } from '../ControlsForm/Entrada';

export const Ubicar = () => {

    const { productos} = useSelector(state => state.ui);
    const { ubicaciones } = useSelector( state => state.ui );
    const [cargando, setCargando] = useState( false );
    const [listProductos, setListProductos] = useState([]);
    const [_producto, setProducto] = useState({});

    const { caducidad, dateRegistro, idEntrada, idProducto, idUbicacion, lote, pallet, producto, ubicacion, unidades} = _producto
    const [ valuesForm, handleInputChange, reset ] = UseForm({
        _idProducto:'',
        _idUbicacion: idUbicacion,
    })

    const { _idProducto, _idUbicacion } = valuesForm;

    const handleKeyDown = ( e ) => {
        if (e.key === 'Enter'){
            handlesConsultar();
        }
    }
    

    const handlesConsultar = async() => {

        try {
            setCargando( true );
            if ( _idProducto !== ''){
                const url = `productos/${_idProducto.value}/undefined/undefined/undefined`;
                const respuesta = await fetchConToken( url );
                const result = await respuesta.json();
console.log(result);
                if (result.entradas.length > 0) {
                    setListProductos( result.entradas )
                    // setProducto( result.entradas[0] );
                    // handleInputChange('_idUbicacion', result.entradas[0].ubicacion)
                }
                else {
                    setProducto( {} )
                    Swal.fire('Aviso','No se encontro el pallet','info');
                }
            }else{
                Swal.fire('ERROR',`Debe escribir un pallet`,'error');
            }
            //
            setCargando( false );
         } catch (error) {
           console.log(error);
           setCargando( false );
         }
    }

    const handlesUpdateUbicacion = async() => {
        
        try {
            setCargando( true );
            const url = `productos/updateubiacion/${pallet}`;
            const resp = await fetchConToken( url, { idUbicacion: valuesForm._idUbicacion.value } , 'PUT' );
            const result = await resp.json();
            
            const msgAlert = result.ok ? 'La ubicación fue asignada correctamente' : 'No se puedo asignar la ubicación'
            Swal.fire('', msgAlert ,'success');
            
            setProducto ({});
            setCargando( false );
  
         } catch (error) {
           setCargando( false );
           console.log(error);
         }
    }


  return (
    <>
         <h1 className=" font-black text-3xl text-blue-900">Ubicar Lote</h1>
         <p className="mt-3">
            Establece la ubicación en la cual se va a encontrar un pallet determinado
         </p>

         <div className="bg-white mt-10 px-5 py-10 rounded-md shadow-md mx-auto ">
            <h1 className="text-gray-600 font-bold text-xl uppercase text-center">Ubicar Pallet</h1>
            <div className="md:flex">
                <div className="md:w-4/5 md:pl-3">
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
                            className=" mt-4 w-full bg-blue-700 p-2 text-white rounded-lg hover:shadow-2xl hover:touch-pinch-zoom hover:bg-blue-800 "
                            onClick={ handlesConsultar }
                        >
                            Consultar
                        </button>
                    }
                        
                </div>                
            </div>              
                {
                    (idEntrada && !cargando ) ? 
                    <>
                    <div className='mt-16 w-full text-center font-light text-xl text-blue-800'>{ pallet }</div>
                    <div className="md:flex w-full">
                        <div className='md:w-1/2 md:pl-4'>
                            <p className = "text-slate-700 text-xl font-semibold" > Producto </p> 
                            <p className = "text-slate-800 text-xl text-center bg-slate-200 p-2" > { `${producto.codigo} - ${producto.descripcion}` } </p> 
                        </div>
                        <div className='md:w-1/2 md:pl-7'>
                            <p className = "text-slate-700 text-xl font-semibold" > Unidades </p> 
                            <p className = "text-slate-800 text-xl text-center bg-slate-200 p-2" > { unidades } </p> 
                        </div>
                    </div>

                    <div className="md:flex w-full mt-4">
                        <div className='md:w-1/2 md:pl-4'>
                            <p className = "text-slate-700 text-xl font-semibold" > Lote </p> 
                            <p className = "text-slate-800 text-xl text-center bg-slate-200 p-2" > { lote } </p> 
                        </div>
                        <div className='md:w-1/2 md:pl-4'>
                            <p className = "text-slate-700 text-xl font-semibold" > Caducidad </p> 
                            <p className = "text-slate-800 text-xl text-center bg-slate-200 p-2" > { caducidad } </p> 
                        </div>
                    </div>

                    <div className="md:flex w-full mt-4">
                        <div className='md:w-1/2 md:pl-4'>
                            <p className = "text-slate-700 text-xl font-semibold" > Fecha Registro </p> 
                            <p className = "text-slate-800 text-xl text-center bg-slate-200 p-2" > { dateRegistro } </p> 
                        </div>
                        <div className='md:w-1/2 md:pl-7 '>
                            <label className = "text-blue-800 text-xl font-light" htmlFor="idProducto"> Ubicación </label> 
                            <Select 
                                id="idUbicacion"
                                name="idUbicacion"
                                styles={ { ...customStyles , 
                                        control : (style) => ({ ...style, ...customStylesControl }) } }
                                options={ ubicaciones }
                                placeholder= "Seleccionar una ubicacion"   
                                value = { _idUbicacion }
                                onChange={ (data) => handleInputChange('_idUbicacion', !!data ? data : '') }
                                onFocus = { () => { handleInputChange('_pallet','') } }
                                autoFocus 
                                isClearable                       
                            />
                        </div>
                    </div>
                    {
                        !cargando &&
                        <button 
                            type='button' 
                            className=" ml-2 mt-5 w-full bg-blue-700 p-4 text-white rounded-lg hover:shadow-2xl hover:touch-pinch-zoom hover:bg-blue-800"
                            onClick={ handlesUpdateUbicacion }
                        >
                            Ubicar Lote
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
                                    listProductos.map(entrada => (
                                        <Entrada
                                            key={entrada.idEntrada}
                                            entrada={ {...entrada, codigoProducto: entrada.producto.codigo, descripcionProducto: entrada.producto.descripcion}}
                                            _setProducto = { setProducto }
                                            setListProductos = { setListProductos }
                                        />
                                    ))
                                }
                            </tbody>
                        </table>
                    </>
                }
                    
                    
        </div>
    </>
  )
}
