import { types } from "../../types/types";
import { fetchSinToken } from "../helpers/fetch";

export const startUiSetAllCatalogos = () => {
    return async( dispatch ) => {

        const url = 'catalogos/allcatalogos';
        const resp = await fetchSinToken( url )
        const body = await resp.json();

        dispatch( uiSetAllCatalogos(body.data) );

    }
}

export const startUiAddNewProducto = ( data ) => {
    return async( dispatch ) => {

        const url = 'catalogos/addNewProducto';
        const resp = await fetchSinToken( url, data, 'POST',  )
        const body = await resp.json();

        const { idProducto, codigo, descripcion, activo, idUnidadMedida, clvFamilia, presentacion, iva } = body.producto

        const payload = {
            id : idProducto,
            value : idProducto,
            label : codigo + '-' + descripcion,
            idUnidadMedida,
            clvFamilia,
            codigo,
            descripcion,
            presentacion,
            activo,
            iva
        };
        dispatch( uiAddNewProducto(payload) );

    }
}

export const startUiUpdateProducto = ( data ) => {
    return async( dispatch ) => {

        const idproducto = data.id
        const url = `catalogos/updateproducto/${ idproducto }`;
        const resp = await fetchSinToken( url, data, 'PUT',  )
        const body = await resp.json();

        const { idProducto, codigo, descripcion, activo, idUnidadMedida, clvFamilia, presentacion, iva } = body.productoActualizado

        const payload = {
            id : idProducto,
            value : idProducto,
            label : codigo + '-' + descripcion,
            idUnidadMedida,
            clvFamilia,
            codigo,
            descripcion,
            presentacion,
            activo,
            iva
        };

         dispatch( uiUpdateProducto(payload) );

    }
}

export const startUiAddNewUbicacion = ( data ) => {
    return async( dispatch ) => {

        const { label, almacen, activo:_activo } = data;
        const datos = {
            descripcion : label,
            almacen,
            activo: _activo
        }

        const url = 'catalogos/addnewubicaion';
        const resp = await fetchSinToken( url, datos, 'POST',  )
        const body = await resp.json();

        const { idUbicacion, descripcion, activo } = body.ubicacion

        const payload = {
            id : idUbicacion,
            value : idUbicacion,
            label : descripcion,
            almacen: Number(almacen),
            activo
        };
        dispatch( uiAddNewUbicacion(payload) );

    }
}

export const startUiUpdateUbicacion = ( data ) => {
    return async( dispatch ) => {

        const { label, almacen, activo:_activo } = data;
        const datos = {
            descripcion : label,
            almacen,
            activo: _activo
        }

        const idubicacion = data.id
        const url = `catalogos/updateubicacion/${ idubicacion }`;
        const resp = await fetchSinToken( url, datos, 'PUT',  )
        const body = await resp.json();

        const { idUbicacion, descripcion, activo } = body.ubicacionActualizada

        const payload = {
            id : idUbicacion,
            value : idUbicacion,
            label : descripcion,
            almacen: Number(almacen),
            activo
        };

        dispatch( uiUpdateUbicacion(payload) );

    }
}

export const startUiAddNewProveedor = ( data ) => {
    return async( dispatch ) => {

       
        const datos = {
            idProveedor: data.value,
            nombre : data.label,
            rfc: data.rfc,
            activo: data.activo
        }

        const url = 'catalogos/addnewproveedor';
        const resp = await fetchSinToken( url, datos, 'POST',  )
        const body = await resp.json();

        const { idProveedor, rfc, nombre, activo } = body.proveedor

        const payload = {
            value : idProveedor,
            label : nombre,
            rfc,
            activo
        };
        dispatch( uiAddNewProveedor(payload) );

    }
}

export const startUiUpdateProveedor = ( data ) => {
    return async( dispatch ) => {

        const datos = {
            nombre : data.label,
            rfc: data.rfc,
            activo: data.activo
        }

        const id = data.value
        const url = `catalogos/updateproveedor/${ id }`;
        const resp = await fetchSinToken( url, datos, 'PUT',  )
        const body = await resp.json();
        
        const { idProveedor, rfc, nombre, activo } = body.proveedorActualizado

        const payload = {
            value : idProveedor,
            label : nombre,
            rfc,
            activo
        };

        dispatch( uiUpdateProveedor(payload) );

    }
}


const uiSetAllCatalogos = (payload) => ({
    type : types.uiSetCatalogos,
    payload
})

const uiAddNewProducto = ( payload ) => ({
    type : types.uiAddNewProducto,
    payload
})

const uiUpdateProducto = ( payload ) => ({
    type: types.uiUpdateProducto,
    payload
})

const uiAddNewUbicacion = ( payload ) => ({
    type: types.uiAddNewUbicacion,
    payload
})

const uiUpdateUbicacion = ( payload ) => ({
    type: types.uiUpdateUbicacion,
    payload
})

const uiAddNewProveedor = ( payload ) => ({
    type: types.uiAddNewProveedor,
    payload
})

const uiUpdateProveedor = ( payload ) => ({
    type: types.uiUpdateProveedor,
    payload
})

export const uiClearDataLogout = () => ({ type: types.uiClearDataLogout })

export const uiCloseModal = () => ({ type: types.uiCloseModal });

export const uiOpenModal =  () => ({ type: types.uiOpenModal });

export const uiSetUsuario = (usuario) =>({
    type: types.uiSetUsuario,
    payload: usuario
});

export const uiViewModalSurtir = (payload) =>({
    type: types.uiViewModalSurtir,
    payload
});

export const uiSetLoading = (payload) =>({
    type: types.uiSetLoading,
    payload
})

export const uiAddPedido = () =>({
    type: types.uiAddPedido
})

export const uiRemovePedido = () =>({
    type: types.uiRemovePedido
})

export const uiUpdatePedido = () =>({
    type: types.uiUpdatePedido
})
