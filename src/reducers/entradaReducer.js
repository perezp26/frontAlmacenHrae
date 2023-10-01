import { types } from "../../types/types"

const initialState = {
    listEntradas : [],
    listEntradasFilter : [],
    editEntrada: {},
    editEntradaCabecero: {  entradas: [] }
}

export const entradaReducer  = (state = initialState, action) =>{ 

    switch ( action.type ) {
        case types.entradaList :
            return{
                ...state,
                listEntradas : action.payload
            }
        case types.entradaListFilter : 
            const _listEntradaFilter = action.payload === 0 ? state.listEntradas.filter(e => (Number(e.existencia) === 0)) : 
                                       action.payload === -1 ? state.listEntradas : state.listEntradas.filter( e => (Number(e.existencia) > 0)) 
            return{
                ...state, listEntradasFilter : _listEntradaFilter
            }

        case types.entradaEdit : 
        return{
            ...state, editEntrada : {...state.listEntradas.filter( e => ( e.idEntrada === action.payload))[0]}
        }

        case types.entradaClearLists:
            return{
                ...state, listEntradas : [] , listEntradasFilter: []
            }

        case types.entradaUpdate:
            return{
                ...state,
                listEntradas : state.listEntradas.map( 
                    e => ( e.idEntrada === action.payload.idEntrada ) ? {...action.payload, existencia : Number(action.payload.unidades) - Number(action.payload.salidas) } : e  
                ),
                listEntradasFilter : state.listEntradasFilter.map( 
                    e => ( e.idEntrada === action.payload.idEntrada ) ? {...action.payload, existencia : Number(action.payload.unidades) - Number(action.payload.salidas) } : e  
                ),
            }
        case types.entradaDelete: { 
            return{
                ...state,
                listEntradas : state.listEntradas.filter( e => (e.idEntrada !== action.payload)),
                listEntradasFilter : state.listEntradasFilter.filter( e => (e.idEntrada !== action.payload)),
            }
        }

        case types.entradaEditCabecero:{
            return{
                ...state, editEntradaCabecero : { ...action.payload }
            }
        }

        case types.entradaEmpyEdit : 
        return{
            ...state, editEntradaCabecero : { entradas:[] }, editEntrada : {}
        }

        case types.entradaClearDetalle : 
        return{
            ...state, editEntrada : {}
        }

        case types.entradaAddDetalle:
            return{
                ...state,
                editEntradaCabecero : { ...state.editEntradaCabecero , entradas : [ ...state.editEntradaCabecero.entradas, action.payload ] }
            }

        case types.entradaEditDetalle:
            const dataDetalle = state.editEntradaCabecero.entradas.filter( e => ( e.idEntrada === action.payload.idEntrada ))
            return{
                ...state, editEntrada : {  ...dataDetalle[0], existencia: action.payload.existencia, salidas: action.payload.salidas, 
                    producto : action.payload.producto, codigoEstado : action.payload.codigoEstado , ubicacion: action.payload.ubicacion }
            }
        
        case types.entradaUpdateDetalle:
            return{
                ...state,  editEntradaCabecero : { ...state.editEntradaCabecero, 
                                entradas: state.editEntradaCabecero.entradas.map( e => (e.idEntrada === action.payload.idEntrada ? action.payload : e ))
                }
            }

        case types.entradaDeleteDetalle:
            
            return {
                ...state,
                editEntradaCabecero : { ...state.editEntradaCabecero,
                     entradas : action.payload.idEntrada !==0 
                                ?[ ...state.editEntradaCabecero.entradas.filter( e => e.idEntrada !== action.payload.idEntrda ) ]
                                :[ ...state.editEntradaCabecero.entradas.filter( e => e.idTemp !== action.payload.idTemp ) ] 
                }
            }

        default:
            return state;
    }
}