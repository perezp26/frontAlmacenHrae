import { types } from "../../types/types";


const initialState = {
    productos:[],
    ubicaciones:[],
    estadosCalidad:[],
    modalOpen: false,
    loading: false,
    viewModalSurtir : { view:'producto', idListSurtido : '', idProducto: 0},
    numPedidos: [],
    updatePedido : false,
    proveedores:[],
    fuentesFinanciamiento:[]
}

export const uiReducer  = (state = initialState, action) =>{

    switch ( action.type ) {
        case types.uiSetLoading:
            return{ 
                ...state,
                loading : action.payload
            }
        case types.uiSetUsuario:
                return {
                    ...state,
                    usuario : { ... action.payload }
                }

        case types.uiSetCatalogos:
                return {
                    ...state,
                    ...action.payload
                }
        case types.uiAddNewProducto:
                return{
                    ...state,
                    productos: [
                        ...state.productos,
                        action.payload
                    ]
                }
        case types.uiUpdateProducto:
                return{
                    ...state,
                    productos : state.productos.map( 
                        e  => ( e.id === action.payload.id ) ? action.payload : e
                        ),
                }
        case types.uiAddNewUbicacion:
            return{
                ...state,
                ubicaciones: [
                    ...state.ubicaciones,
                    action.payload
                ]
            }
        case types.uiUpdateUbicacion:
            return{
                ...state,
                ubicaciones : state.ubicaciones.map( 
                    e  => ( e.id === action.payload.id ) ? action.payload : e
                    ),
            }
        case types.uiOpenModal: 
            return {
                ...state,
                modalOpen: true
            };
    
        case types.uiCloseModal:    
            return {
                ...state,
                modalOpen: false
            };
        case types.uiViewModalSurtir:
            return{
                ...state,
                viewModalSurtir: { ...action.payload }
            }
        case types.uiClearDataLogout:
            return{
                ...initialState
            }
        case types.uiAddPedido : 
                return {
                    ...state,
                    numPedidos : [ {numPedidos : state.numPedidos[0].numPedidos + 1} ]
                }
        case types.uiRemovePedido:
                return{
                    ...state,
                    numPedidos : [ {numPedidos : state.numPedidos[0].numPedidos - 1} ] 
                }
        case types.uiUpdatePedido:
                return{
                    ...state,
                    updatePedido : !state.updatePedido
                }
        case types.uiAddNewProveedor:
            return{
                ...state,
                proveedores: [
                    ...state.proveedores,
                    action.payload
                ]
            }
        case types.uiUpdateProveedor:
            return{
                ...state,
                proveedores : state.proveedores.map( 
                    e  => ( e.value === action.payload.value ) ? action.payload : e
                    ),
            }
        default:
            return state;
    }

}