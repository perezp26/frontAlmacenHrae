import { types } from "../../types/types"

const initialState = {
    checking : true,
    login: {
        idUsuario: '',
        nombre: '',
        usuario: '',
        permisos: []
    },
    usuarios : [],
    editUsuario: {},
}

export const authReducer  = (state = initialState, action) =>{ 

    switch ( action.type ) {
        case types.authLogin :
            return {
                login: { ...action.payload },
                usuarios : [],
                editUsuario: {},
                checking: false,
            }
        case types.authNewUsuario : 
            return{
                ...state,
                usuarios : [ ...state.usuarios, action.payload]
            }
        case types.authSetUsuarios : 
            return{
                ...state,
                usuarios : [ ... action.payload ]
            }
        case types.authEditUsuario : 
            return {
                ...state,
                editUsuario : { ...action.payload }
            }
        case types.authSaveEditUsuario : 
            return {
                ...state,
                usuarios :  state.usuarios.map( 
                    e  => ( e.idUsuario === action.payload.idUsuario ) ? action.payload : e
                    ),
            }
        case types.authChekingFinish:
            return{
                ...state,
                checking : false
            }
        case types.autLogOut : 
            return{
                ...initialState,
                checking : false
            }
        default:
            return state;

    }
}