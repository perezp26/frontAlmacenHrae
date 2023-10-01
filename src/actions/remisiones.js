import { types } from "../../types/types";
import { fetchConToken } from "../helpers/fetch";

export const startListPedidos = (dateStart, dateEnd) => {
    return async(dispatch) => {
        const url = `remisiones/pedidos/${ dateStart }/${ dateEnd }/pedidos`
        const resp = await fetchConToken(url);
        const result = await resp.json();
        dispatch(setListPedidos( result.remisiones ));
    }
}

export const startEditPedido = (idRemision, setAction) =>{
    return async( dispatch ) => {
        const url = `remisiones/pedidos/${ idRemision }`;
        const resp = await fetchConToken( url );
        const result = await resp.json();
        dispatch( remisionGet({ ...result.remision, setAction}) )
    }
}

export const startGetPedidos = ( dateStart, dateEnd ) => {
    return async(dispatch) => {
        const url = `remisiones/${ dateStart }/${ dateEnd }`;
        const resp = await fetchConToken(url);
        const result = await resp.json();
        result.ok ? dispatch(remisionesGetListRemisiones(result.remisiones)) 
                  : dispatch(remisionesGetListRemisiones([]))
    }
}

const setListPedidos = (payload) => ({
    type: types.remisionesListPedidos,
    payload
})

const remisionGet = (payload) => ({
    type: types.remisionesGetRemision,
    payload
})

export const remisionesClearData = (payload) =>({
    type: types.remisionClearData,
    payload
})

const remisionesGetListRemisiones = (payload) =>({
    type: types.remisionGetListRemisiones,
    payload
})

export const remisionesUpdateTotalAbono = (payload) =>({
    type: types.remisionesUpdateTotalAbono,
    payload
})

export const cancelPedido = ( payload )=>({
    type: types.remisionesCancelListPedidos,
    payload
})