import { types } from "../../types/types";


const initialState = {
    farmaciaEntradasPendientes : []
}

export const farmaciaReducer  = (state = initialState, action) =>{ 

    switch ( action.type ) {

        case types.farmaciaSetListEntradas :
            return{
                ...state,
                farmaciaEntradasPendientes : action.payload
            }

        default:
            return state;
    }
}