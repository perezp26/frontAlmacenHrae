import { types } from "../../types/types";


const initialState = {
    productosListSolicitado:[],
    productosListSurtido:[],
    productosFilterListSurtido: [],
}

export const surtidoReducer  = (state = initialState, action) =>{ 
    switch ( action.type ) {
        case types.surtidoClearProductos:
            return{
                ...state,
                productosListSolicitado:[],
                productosListSurtido:[],
                productosFilterListSurtido: [],
            } 
        
        case types.surtidoFillProductoSolicitud:
            return{
                ...state,
                productosListSolicitado : action.payload
            }
            
        case types.surtidoAddProductoSolicitud:
            return{
                ...state,
                productosListSolicitado : [ ...state.productosListSolicitado, action.payload ]
            } 

        case types.surtidoDeleteProductoSolicitud:
            return{
                ...state,
                productosListSolicitado: state.productosListSolicitado.filter( 
                    e  => ( e.id !== action.payload ) 
                )
            }    

        case types.surtidoListaProductosSurtidos:
            return{
                ...state,
                productosListSurtido : action.payload
            }   

        case types.surtidoListaFilterProductosSurtidos:
            return{
                ...state,
                productosFilterListSurtido : state.productosListSurtido.filter( e => e.idListSurtido === action.payload )
            }

        case types.surtidoAddProductoSurtido:{
            const productos = state.productosListSurtido.filter( 
                e  => ( e.pallet !== action.payload.pallet ) 
            )
            return{
                ...state,
                productosListSurtido : [ ...productos, action.payload ]
            }
        }

        case types.surtidoDeleteProdcutosSurtido:
            return{
                ...state,
                productosListSurtido : state.productosListSurtido.filter(
                    e => ( e.pallet !== action.payload )
                )
            }

        case types.surtidoUpdatePorcentajeSolicitud:{
            const productos = state.productosListSolicitado.map(
                e => ( e.id === action.payload.id ? { ...e, surtido : action.payload.surtido, 
                                                            precio : action.payload.precio,
                                                            iva : action.payload.iva,
                                                            porcentaje : `${(action.payload.surtido/e.solicitado).toFixed(2)*100}%`} : e )
            )
            return{
                ...state,
                productosListSolicitado : productos
            }
        }
        default:
            return state;
    }
}