import { types } from "../../types/types";
import { fetchConToken } from "../helpers/fetch";

export const fillDataSurtido = (idSurtido) =>{
    return async(dispatch) =>{
            const url = idSurtido.substring(0, 2) !== 'PR' ? `surtido/${idSurtido}` : `surtido/surtidoRemisiones/${idSurtido}`;
            const resp = await fetchConToken(url);
            const result = await resp.json();
            if (result.ok){
                dispatch( surtidoFillProductoSolicitud( result.productosSolicitado ) );
                dispatch( surtidoListaProductosSurtidos( result.productosListSurtido ) );
                return result.dataSurtido;
            }else {
                return false
            }
    }
}

const surtidoFillProductoSolicitud = (payload) =>({
    type: types.surtidoFillProductoSolicitud,
    payload
})

const surtidoListaProductosSurtidos = (payload) =>({
    type: types.surtidoListaProductosSurtidos,
    payload
})

export const addProductoSurtido = (payload) => ({
    type : types.surtidoAddProductoSurtido,
    payload
})

export const clearProductosSurtido = () => ({
    type : types.surtidoClearProductos
})

export const deleteProductoSolicitud = (payload) => ({
    type: types.surtidoDeleteProductoSolicitud,
    payload
})

export const surtidoAddProductoSolicitud = (payload) => ({
    type : types.surtidoAddProductoSolicitud,
    payload
})

export const surtidoAddProductoSurtido = (payload) => ({
    type : types.surtidoAddProductoSurtido,
    payload
})

export const surtidoListaFilterProductosSurtidos = (payload) =>({
    type: types.surtidoListaFilterProductosSurtidos,
    payload
})

export const surtidoDeleteProdcutosSurtido = (payload) =>({
    type: types.surtidoDeleteProdcutosSurtido,
    payload
})

export const surtidoUpdatePorcentajeSolicitud = (payload) =>({
    type: types.surtidoUpdatePorcentajeSolicitud,
    payload
})