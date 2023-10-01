const baseUrl = 'http://localhost:3001/api';
//const baseUrl = 'http://192.168.151.51:3001/api';

const fetchSinToken = ( endpoint, data, method = 'GET' ) => {

    const url = `${ baseUrl }/${ endpoint }`;
    
    if ( method === 'GET' ) {
        return fetch( url )        ;
    } else {
        return fetch( url, {
            method : method,
            headers:{
                'Content-type' : 'application/json'
            },
            body: JSON.stringify( data )
        });
    }

}

const fetchConToken = ( endpoint, data, method = 'GET' ) => {

    const url = `${ baseUrl }/${ endpoint }`;
    const token = localStorage.getItem('token') || '';

    if ( method === 'GET' ) {
        return fetch( url,{
            method : method,
            headers : {
                'x-token' : token
            },
        } );
    } else {
        return fetch( url, {
            method : method,
            headers:{
                'Content-type' : 'application/json',
                'x-token' : token
            },
            body: JSON.stringify( data )
        });
    }
}

export {
    fetchSinToken,
    fetchConToken
}
