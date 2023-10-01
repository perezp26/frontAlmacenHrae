import { types } from "../../types/types";
import { fetchConToken } from "../helpers/fetch";
import { uiSetLoading } from "./ui";

export const startSetEntradasPendientes = ( dateStart, dateEnd ) =>{
    return async (dispatch) => {

        dispatch(uiSetLoading(true))

        const url =`remisiones/pedidos/${ dateStart }/${ dateEnd }/traspasos` ;   
        console.log(url); 
        const resp = await fetchConToken( url );
        const result = await resp.json();   
        console.log( result );
        dispatch(setEntradasPendientes(result.remisiones));

        dispatch(uiSetLoading(false))

    }
}

const setEntradasPendientes = (payload) =>({
    type : types.farmaciaSetListEntradas,
    payload
})