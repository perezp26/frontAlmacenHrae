import { useRef, useState, memo } from 'react';
import Select from 'react-select';
import { customStyles, customStylesControl } from '../Pages/customStylesSelects';

import DatePicker  from 'react-datetime-picker/dist/entry.nostyle';
import "react-datetime-picker/dist/DateTimePicker.css";
import "react-calendar/dist/Calendar.css";

import Swal from 'sweetalert2';
import 'sweetalert2/dist/sweetalert2.css'

import { UseForm } from '../../hooks/UseForm';
import { generarId } from '../../helpers/generarId'
import { DetallePedidoTable } from './DetallePedidoTable';

export const DetallePedido = memo(({  listProductos, setListProductos, productos, unidades, errorListProductos, setAction, dataRemision, setDataRemision, idRemision, isImportEntrada }) => {

    const { dateRemision, importeAbono} = dataRemision;
    const [valuesForm, handleInputChange, resetForm] = UseForm({
        id: '',
        producto: '',
        unidad: '',
        cantidad : 0.00
    })
    const { producto, unidad, cantidad } = valuesForm;

    const [ errorDetalle, setErrorDetalle ] = useState({ errorProducto:'' , errorCantidad:''});

    const refCantidad = useRef();

    const validaDetalle = ( valida ) => {
        switch (valida) {
            case "producto":
                setErrorDetalle( { ...errorDetalle,  errorProducto : producto !== '' ? '' : 'Debe seleccionar un producto' } );
                break;
            case "cantidad" :
                setErrorDetalle( { ...errorDetalle,  errorCantidad : !isNaN(cantidad) && cantidad > 0  ? '' : 'Cantidad no válida' } );
                break;
            default:
                break;
        }
           
    }

    const handlesListProductos = () =>{
       if(producto !== '' && cantidad > 0 &&  !isNaN(cantidad) ){

            const dataRow = { ...valuesForm, iva:0.00, precio: 0.00, id : generarId(), surtido : 0.00}

            if ( listProductos.some( p => p.producto.value === dataRow.producto.value ))
                
                setListProductos( listProductos.map( e => { 
                                                            if (e.producto.value === dataRow.producto.value)  { 
                                                                    if( dataRow.cantidad < e.surtido )
                                                                    {
                                                                        Swal.fire('Error','Lo surtido no puede ser mayor a la cantidad solicitada','error')
                                                                        return e
                                                                    }
                                                                    else

                                                                    return  {...dataRow, id : e.id, surtido: e.surtido, iva : e.iva, precio: e.precio  } 
                                                            }
                                                            else
                                                                    return e } 
                                                ) );
            else
                setListProductos( [...listProductos, {...dataRow} ] );   

            resetForm();
       } else {
            setErrorDetalle({
                ...errorDetalle,
                errorProducto : producto !== '' ? '' : 'Debe seleccionar un producto',
                errorCantidad : !isNaN(cantidad) && cantidad > 0  ? '' : 'Cantidad no válida',
            })
       }
    }


  return (<>
    { setAction === '0' && !isImportEntrada &&
            <div className="grid grid-cols-12">
                <div className="col-span-8 p-2">
                    <label className="text-gray-800" htmlFor="idCliente"> Producto </label>
                    <Select 
                        styles={{
                            ...customStyles,
                            control: (style) => ({
                                ...style,
                                ...customStylesControl
                            })
                        }}
                        options={ productos }
                        id="producto"
                        name="producto"
                        placeholder="Seleccionar Producto"
                        isClearable
                        value={ producto }
                        onChange={ e => { handleInputChange("producto", !!e ? e : '');   }}
                        onBlur = { () => { producto?.idUnidadMedida && handleInputChange("unidad",unidades[producto.idUnidadMedida]) ; validaDetalle('producto')}}
                    />
                    { errorDetalle.errorProducto !== '' && <div className=' text-red-600 -mt-5'>{ errorDetalle.errorProducto }</div> }
                </div>
                <div className="col-span-2 p-2">
                    <label className="text-gray-800" htmlFor="pallet"> Cantidad </label>
                    <input
                        ref= { refCantidad }
                        name="cantidad"
                        id="cantidad"
                        value={ cantidad }
                        className={'mt2 block w-full p-3 bg-gray-200 rounded-lg outline-blue-500 text-center'}
                        type="number"
                        placeholder="Cantidad"
                        onChange={({ target }) => { handleInputChange(target.name, target.value) }}
                        onFocus = { () => refCantidad.current.select() }
                        onBlur = { () => validaDetalle('cantidad')}
                    /> 
                    { errorDetalle.errorCantidad !== '' && <a className=' text-red-600 '>{ errorDetalle.errorCantidad }</a> }
                </div>
                <div className="p-2">
                <label className="text-gray-800" htmlFor="pallet"> Unidad </label>
                <input
                    name="unidad"
                    id="unidad"
                    value={ unidad }
                    className={'mt2 block w-full p-3 bg-gray-200 rounded-lg outline-blue-500 text-center'}
                    type="text"
                    placeholder="Unidad"
                    onChange={({ target }) => { handleInputChange(target.name, target.value) }}
                    disabled = { true }
                />
                </div>
               
                
                <div className="pt-6 text-center">
                    <button type="button" className="mt-1 rounded-full bg-blue-900 text-white text-2xl px-2.5 py-1" onClick={ handlesListProductos }>
                            <i className="fa-solid fa-add"></i>
                    </button>
                </div>     
            </div>
                 
    }
        <DetallePedidoTable 
                listProductos = { listProductos } 
                setListProductos = { setListProductos } 
                setAction = {setAction}
                idRemision = { idRemision }
                isImportEntrada = { isImportEntrada }
        />

        <div className='grid grid-cols-6'>
            {
                setAction === '0' && <div className='col-start-2 col-end-4 col-span-2 text-red-600 text-right px-4 py-2 text-base font-semibold'>{ errorListProductos }</div>
            }
                
        </div>
        <div className='grid grid-cols-6'>
        {
                setAction === '1' && 
                            <div className='col-start-1 col-end-4 col-span-3 flex'>
                                <div className=' mt-14'>
                                    <label>Fecha Cierre</label>
                                    <DatePicker 
                                            name = "dateRemision"
                                            className={ `block w-full p-2 rounded-lg outline-blue-500 text-center  bg-slate-200  font-bold 
                                                    `}
                                            styles = {'border: none ' }
                                            format='dd-MM-y'
                                            value={ dateRemision } 
                                            onChange={ date => setDataRemision( { ...dataRemision, dateRemision : date } ) }
                                    />
                                </div>
                            </div>
            }
        </div>
  </>)
})
