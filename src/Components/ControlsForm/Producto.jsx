import { useSelector, useDispatch } from 'react-redux';
import Select from 'react-select';
import { UseForm } from '../../hooks/UseForm';

import { customStyles, customStylesControl } from '../Pages/customStylesSelects';
import { uiCloseModal } from '../../actions/ui';
import { surtidoAddProductoSolicitud } from '../../actions/surtido';
import { generarId } from '../../helpers/generarId';


export const Producto = () => {
    const dispatch = useDispatch()
    const { productos } = useSelector( state => state.ui);


    const [ valuesForm, handleInputChange, reset ] = UseForm({
        idProducto: '',
        solicitado : 0
      })
    const {idProducto, solicitado} = valuesForm

    const handlesAdd = () =>{
        const id = generarId()
        dispatch( uiCloseModal() );
        dispatch( surtidoAddProductoSolicitud({ id, idListSurtido: id, idProducto : idProducto.value, 
                                                producto: {id: idProducto.value, descripcion: idProducto.label}, 
                                                solicitado, surtido: 0, porcentaje : '0%' }) )
    }


  return (
    <div>
        <label className="text-gray-800" htmlFor="idProducto"> Producto </label>
                <Select
                    id="idProducto"
                    name="idProducto"
                    styles={{
                        ...customStyles,
                        control: (style) => ({ ...style, ...customStylesControl, padding: '2px' })
                    }}
                    options={productos}
                    placeholder="Seleccionar un producto"
                    onChange={(data) => handleInputChange('idProducto', !!data ? data : '')}
                    isClearable
                />

                <label className="text-gray-800" htmlFor="pallet"> Unidades </label>
                <input
                    name="solicitado"
                    value={solicitado}
                    className={'mt2 block w-full p-2 bg-gray-200 rounded-lg outline-blue-500 text-center'}
                    type="number"
                    placeholder="Solicitado"
                    onChange={({ target }) => handleInputChange(target.name, target.value)}
                />

                <button 
                    type='button' 
                    className=" mt-5 w-full bg-blue-700 p-4 text-white rounded-lg hover:shadow-2xl hover:touch-pinch-zoom hover:bg-blue-800"
                    onClick={ handlesAdd }
                >
                    Agregar
                </button>
    </div>
  )
}
