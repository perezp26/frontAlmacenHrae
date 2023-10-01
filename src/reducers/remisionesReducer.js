import { types } from "../../types/types"

const initialState = {
    listPedidos : [],
    remision : {},
    listRemisiones: []
}
export const remisionesReducer  = (state = initialState, action) =>{ 

    switch ( action.type ) {
        case types.remisionesListPedidos:
            return {
                ...state,
                listPedidos : [ ...action.payload ]
            }
        case types.remisionesCancelListPedidos:
            return{
                ...state,
                listPedidos : state.listPedidos.map( p => ( p.idRemision !== action.payload ? p : { ...p, status : 'C' } ) )
            }
        case types.remisionClearData :
            return{
                ...state,
                remision : { ...action.payload }
            }
        case types.remisionesGetRemision :
            return{
                ...state,
                remision : { ...action.payload }
            }
        case types.remisionGetListRemisiones:
        {
            return{
                ...state,
                listRemisiones: [ ...action.payload ]
            }
        }
        case types.remisionesUpdateTotalAbono:{
            return{
                ...state,
                listRemisiones: state.listRemisiones.map( r => ( r.idRemision !== action.payload.idRemision ? r : {...r, abonos : action.payload.totalAbonos} ) )
            }
        }
        default:
            return state;
        
    }

}