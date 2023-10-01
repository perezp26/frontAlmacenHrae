import Swal from "sweetalert2";

import { types } from "../../types/types";
import { fetchSinToken, fetchConToken } from "../helpers/fetch";

export const startLogin = ( usuario, password ) => {

    return async( dispatch ) =>{ 
        const resp = await fetchSinToken ( 'auth' , { usuario, password }, 'POST' );
        const body = await resp.json();
    
        if ( body.ok ) {
            
            localStorage.setItem( 'token', body.token );
            localStorage.setItem( 'toke-init-date', new Date().getTime() );

            dispatch( login( { ...body.usuario } ));
            return {
                ok : true
            }
        } else {
    
            Swal.fire( 'Error', body.msg, 'error')
            
        }
    }
    
}

export const startChecking = () =>{
    return async( dispatch ) =>{

        const resp =  await fetchConToken('auth/renew', {} , 'POST' );

        const body = await resp.json();

        if( body.ok ){
            localStorage.setItem( 'token', body.token );
            localStorage.setItem( 'toke-init-date', new Date().getTime() );
            
            dispatch( login( {...body.usuario} ) )
        } else {
            Swal.fire('Error', body.msg,'error');
            dispatch(checkingFinish());
        }
    }
}

export const startLogout = () =>{
    return ( dispatch ) =>{

        localStorage.clear();
        dispatch(authLogOut());        
    }
}

export const startAuthSetUsuarios = () => {
    return async( dispatch ) => {

        const url = 'auth/getusuarios';
        const resp = await fetchSinToken( url )
        const body = await resp.json();
        
        dispatch( authSetUsuarios(body.usersResult) );

    }
}

export const startAddNewUsuario = ( data ) => {
    return async( dispatch ) => {
        const dataUser = {
            ...data,
            idPerfil : data.idPerfil.value
        } 
        console.log(dataUser);
         const url = 'auth/newuser';
         const resp = await fetchSinToken( url, dataUser, "POST" )
         const body = await resp.json();
        
         const usuario = {
             ...body.data.user,
             Perfil : data.idPerfil
         }

         dispatch( authNewUsuario(usuario) );
    }
}

export const startEditUsuario = ( data ) => {
    return async( dispatch ) => {
        const dataUser = {
            ...data,
            idPerfil : data.idPerfil.value
        } 
         const url = `auth/updateuser/${ data.idUsuario }`;
         const resp = await fetchSinToken( url, dataUser, "PUT" )
         const body = await resp.json();
        
         const usuario = {
             ...body.data.user,
             Perfil : data.idPerfil
         }

         dispatch( authSaveEditUsuario(usuario) );
    }
}

const login = ( payload ) => ({
    type: types.authLogin,
    payload
})

export const checkingFinish = () => ({ type : types.authChekingFinish });

export const authLogOut = () =>({ type : types.autLogOut});

const authSetUsuarios = ( payload ) => ({
    type : types.authSetUsuarios,
    payload 
});

const authNewUsuario = ( payload ) => ({
    type : types.authNewUsuario,
    payload
})

const authSaveEditUsuario = ( payload ) => ({ 
    type : types.authSaveEditUsuario,
    payload
})

export const authEditUsuario = ( payload ) => ({
    type : types.authEditUsuario,
    payload
})