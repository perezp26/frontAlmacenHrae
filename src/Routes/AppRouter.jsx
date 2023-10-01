import { useEffect, useState, useContext } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

import { startUiSetAllCatalogos, uiAddPedido, uiRemovePedido, uiUpdatePedido } from '../actions/ui';
import { IniciarSesion } from '../Components/Layout/IniciarSesion';
import { Layout } from '../Components/Layout/Layout';
import { CatalogoProductos } from '../Components/Pages/CatalogoProductos';
import { CatalogoUbicaciones } from '../Components/Pages/CatalogoUbicaciones';
import { PanelEntradas } from '../Components/Pages/PanelEntradas';
import { Ubicar } from '../Components/Pages/Ubicar';
import { Usuarios } from '../Components/Pages/Usuarios';

import { PublicRoute } from './PublicRoute';
import { PrivateRoute } from './PrivateRoute';
import { startChecking, checkingFinish } from '../actions/auth';
import { DocumentoSurtido } from '../Components/Pages/DocumentoSurtido';
import { ConsultaPallets } from '../Components/Pages/ConsultaPallets';
import { PanelPedidos } from '../Components/Pages/PanelPedidos';
import { Pedidos } from '../Components/Pages/Pedidos';
import { SocketContext } from '../../SocketContext';
import { NuevaEntrada } from '../Components/Pages/NuevaEntrada';
import { CatalogoProveedores } from '../Components/Pages/CatalogoProveedores';
import { FarmaciaPanelEntradas } from '../Components/Pages/FarmaciaPanelEntradas';

export const AppRouter = () => {

  const socketContext = useContext( SocketContext )
  const dispatch = useDispatch();

  const { checking, login } = useSelector( state => state.auth)
  const { idUsuario, modulos } = login
  const [moduloPermiso, setModuloPermiso] = useState({ entrada: false, consultarPallets: false, catProducto: false, catUbicaciones: false, ubicarPallet : false, 
                                                       surtidos: false, pedidos: false, remisiones: false, usuarios: false,contenedores : false
                                                     })       

  useEffect(() => {

      dispatch( startUiSetAllCatalogos() )
      localStorage.getItem('token') ?  dispatch( startChecking() ) : dispatch( checkingFinish() );

      socketContext.removeAllListeners();
      
      socketContext.on('addListPedido', () =>{
        dispatch( uiAddPedido() );
      })
      socketContext.on('removeListPedido', () =>{
        dispatch( uiRemovePedido() );
      })
      socketContext.on('updateListPedido', () =>{
        dispatch( uiUpdatePedido() );
      })

  }, [dispatch])

  useEffect( () => {
      !!idUsuario && setModuloPermiso({...moduloPermiso, entrada: modulos.includes(1), consultarPallets: modulos.includes(2), catProducto: modulos.includes(3),
                                        catUbicaciones : modulos.includes(4), ubicarPallet : modulos.includes(5),
                                        pedidos: modulos.includes(7), farmacia: modulos.includes(8), usuarios: modulos.includes(9)
                                      })
  },[idUsuario])

  if ( checking ) {
    return (<h5> Espere ...</h5>);
  }

  return (
    <BrowserRouter>
        <Routes>

             <Route path="/" element={ <PublicRoute isAuthenticated = { !!idUsuario }> <IniciarSesion /> </PublicRoute> } />
             
             <Route path="/almacen" element={ <PrivateRoute isAuthenticated = { !!idUsuario }> <Layout /> </PrivateRoute> }>
                <Route index element= { <PrivateRoute isAuthenticated = { !!idUsuario } isValidPermiso = { moduloPermiso.consultarPallets }> <ConsultaPallets /> </PrivateRoute> } />
                {/* <Route path="consultasurtidos" element= { <PrivateRoute isAuthenticated = { !!idUsuario }> <ConsultaSurtidos /> </PrivateRoute> } /> */}
                <Route path="panelentradas" element= { <PrivateRoute isAuthenticated = { !!idUsuario } isValidPermiso = { moduloPermiso.entrada }> <PanelEntradas /> </PrivateRoute> } />
                <Route path="nuevaentrada" element= { <PrivateRoute isAuthenticated = { !!idUsuario } isValidPermiso = { moduloPermiso.entrada }> <NuevaEntrada /> </PrivateRoute> } />
                <Route path="ubicarpallet" element= { <PrivateRoute isAuthenticated = { !!idUsuario } isValidPermiso = { moduloPermiso.ubicarPallet }> <Ubicar /> </PrivateRoute>  } />
                <Route path="documentosurtido/:idSurtido" element= { <PrivateRoute isAuthenticated = { !!idUsuario } isValidPermiso = { moduloPermiso.pedidos }> <DocumentoSurtido /> </PrivateRoute> } />
                <Route path="panelpedidos" element= { <PrivateRoute isAuthenticated = { !!idUsuario } isValidPermiso = { moduloPermiso.pedidos }> <PanelPedidos /> </PrivateRoute> } />
                <Route path="pedidos" element= { <PrivateRoute isAuthenticated = { !!idUsuario } isValidPermiso = { moduloPermiso.pedidos } > <Pedidos /> </PrivateRoute> } />
                <Route path="catalogoproductos" element= { <PrivateRoute isAuthenticated = { !!idUsuario } isValidPermiso = { moduloPermiso.catProducto }> <CatalogoProductos /> </PrivateRoute> } />
                <Route path="catalogoproveedores" element= { <PrivateRoute isAuthenticated = { !!idUsuario } isValidPermiso = { moduloPermiso.catProducto }> <CatalogoProveedores /> </PrivateRoute> } />
                <Route path="catalogoubicaciones" element= { <PrivateRoute isAuthenticated = { !!idUsuario } isValidPermiso = { moduloPermiso.catUbicaciones }> <CatalogoUbicaciones /> </PrivateRoute> } />
                <Route path="usuarios" element= { <PrivateRoute isAuthenticated = { !!idUsuario } isValidPermiso = { moduloPermiso.usuarios }> <Usuarios /> </PrivateRoute> } />
        
            </Route> 
            
            <Route path="/farmacia" element={ <PrivateRoute isAuthenticated = { !!idUsuario }> <Layout /> </PrivateRoute> }>
                <Route index element= { <PrivateRoute isAuthenticated = { !!idUsuario } isValidPermiso = { moduloPermiso.farmacia }> <FarmaciaPanelEntradas /> </PrivateRoute> } />
            </Route>

        </Routes>
    </BrowserRouter>
  )
}
