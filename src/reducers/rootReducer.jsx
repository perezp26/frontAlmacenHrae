import { combineReducers } from 'redux' ;

import { uiReducer } from "./uiReducer";
import { authReducer } from "./authReducer";
import { surtidoReducer } from './surtidoReducer';
import { entradaReducer } from './entradaReducer';
import { remisionesReducer } from './remisionesReducer';
import { farmaciaReducer } from './farmaciaReducer';

export const rootReducer = combineReducers({
    ui : uiReducer,
    auth : authReducer,
    surtido : surtidoReducer,
    entrada : entradaReducer,
    remisiones :  remisionesReducer,
    farmacia : farmaciaReducer
})