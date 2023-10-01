import Swal from "sweetalert2";

import { types } from "../../types/types";
import { fetchConToken } from "../helpers/fetch";
import { uiSetLoading,uiOpenModal } from "./ui";

export const startListEntradas = (idproducto,lote, dateStart,dateEnd ) =>{
    return async (dispatch) => {

        dispatch(uiSetLoading(true))

        const url = `productos/${idproducto}/${lote}/${dateStart}/${dateEnd}`;    
        const resp = await fetchConToken( url );
        const result = await resp.json();   
        console.log(result.entradas);
        dispatch(entradaList(result.entradas));
        dispatch(entradaListFilter(1) );
        result.entradas.length === 0 && Swal.fire('','No se encontraron datos', 'info');

        dispatch(uiSetLoading(false))

    }
}

export const startGetDataEntradaCabecero = ( idEntradaCabecero ) => {
    return async( dispatch) => {
        const url = `productos/getdataentradacabecero/${ idEntradaCabecero }`
        const resp = await fetchConToken( url )
        const resul = await resp.json()
        dispatch( entradaEditCabecero( resul.entradasCabecero ))
    }
}

export const stratGetDetalleEntrada = (idEntrada) =>{
    return async( dispatch) => {
        const url = `productos/getentradadata/${ idEntrada }`
        const resp = await fetchConToken( url )
        const resul = await resp.json()
        dispatch( entradaEditDetalle( resul.entradas ));
        dispatch( uiOpenModal() );
    }
}

export const startClearDetalleEntrada = () =>{
    return async( dispatch) => { 
        dispatch( entradaClearDetalle());
        dispatch( uiOpenModal() );
    }
}

const entradaList = (payload) =>({
    type: types.entradaList,
    payload
})

export const entradaListFilter = (payload) => ({
    type: types.entradaListFilter,
    payload
})

export const entradaEdit = (payload) =>({
    type: types.entradaEdit,
    payload
})

export const entradaEmpyEdit = () =>({
    type: types.entradaEmpyEdit
})

export const entradaUpdate = (payload) =>({
    type: types.entradaUpdate,
    payload
})

export const entradaDelete = (payload) =>({
    type: types.entradaDelete,
    payload
})

export const entradaClearLists = () =>({
    type: types.entradaClearLists
})

const entradaEditCabecero = (payload) => ({
    type: types.entradaEditCabecero,
    payload
})

const entradaEditDetalle = (payload) =>({
    type: types.entradaEditDetalle,
    payload
})

const entradaClearDetalle = () =>({
    type: types.entradaClearDetalle
})

export const entradaAddDetalle = (payload) =>({
    type: types.entradaAddDetalle,
    payload
})

export const entradaUpdateDetalle = (payload) =>({
    type: types.entradaUpdateDetalle,
    payload
})

export const entradaDeleteDetalle = (payload) =>({
    type: types.entradaDeleteDetalle,
    payload
})