
import { useDispatch,useSelector } from 'react-redux';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { startLogout } from '../../actions/auth';
import { entradaEmpyEdit } from '../../actions/entrada';


import logoKoonol from '../../imgs/logohraepy.png'


export const Layout = () => {
  
  const { auth, ui } = useSelector( state => state );
  const { login } = auth;
  const { numPedidos } = ui;
  const dispatch = useDispatch();
  const location = useLocation();
  const urlActual = location.pathname;

  const handlesNuevaEntrada = () =>{
   //dispatch( entradaEmpyEdit() )
  }

  const handleSalir = () => {
    //dispatch( uiClearDataLogout() )
    dispatch( startLogout() )

  }
    

  return (
    <div className="md:flex md:min-h-screen">

        <div className=" md:w-1/6 bg-blue-900 px-5 p7-10">
          
            <img className="mx-auto mt-10" src={ logoKoonol } alt="Logo Koonol" width={ 150 } />
            <h2 className=" mt-5 text-xl font-semibold text-center text-white">
              HRAEPY - ALMACEN
            </h2>

            <nav className='mt-7 text-sm'>
              {
                login.modulos.includes(2) &&
                <Link 
                  className={`${urlActual === '/almacen' ? 'text-blue-400' : 'text-white' } text-lg block mt-2 hover:text-blue-400`}
                  to="/almacen">
                      <i className="fa-solid fa-folder-tree"></i> - Consulta Entradas
                </Link>  
              }   
              {
                login.modulos.includes(1) &&
                <Link 
                  className={`${urlActual === '/almacen/nuevaentrada' ? 'text-blue-400' : 'text-white' } text-lg block mt-5 hover:text-blue-400`}
                  to="/almacen/panelentradas" onClick={ handlesNuevaEntrada }>
                     <i className="fa-solid fa-check-to-slot"></i> - Entradas
                </Link>
              }
              {
                login.modulos.includes(5) &&
                <Link 
                  className={`${urlActual === '/almacen/ubicarpallet' ? 'text-blue-400' : 'text-white' } text-xl block mt-5 hover:text-blue-400`}
                  to="/almacen/ubicarpallet">
                      <i className="fa-solid fa-map-location-dot"></i> - Ubicar Producto
                </Link>
              } 
              {
                login.modulos.includes(7) &&
                <Link 
                  className={`${urlActual === '/remisiones/panelpedidos' ? 'text-blue-400' : 'text-white' } text-lg block mt-5 hover:text-blue-400`}
                  to="/almacen/panelpedidos">
                      <i className="fa-solid fa-pen-to-square"></i> - Salidas 
                      <span className="inline-block py-1 px-1 leading-none text-center whitespace-nowrap align-baseline bg-red-600 text-white rounded ml-2">
                            { numPedidos.length > 0 ? `${numPedidos[0].numPedidos}` : 0 } 
                      </span>
                </Link>
              }
               {
                login.modulos.includes(3) &&
                <Link 
                  className={`${urlActual === '/almacen/catalogoproductos' ? 'text-blue-400' : 'text-white' } text-lg block mt-5 hover:text-blue-400`}
                  to="/almacen/catalogoproductos">
                      <i className="fa-solid fa-clipboard-list"></i> - Catálogo Productos
                </Link>
              }{
                login.modulos.includes(3) &&
                <Link 
                  className={`${urlActual === '/almacen/catalogoproveedores' ? 'text-blue-400' : 'text-white' } text-lg block mt-5 hover:text-blue-400`}
                  to="/almacen/catalogoproveedores">
                      <i className="fa-solid fa-clipboard-list"></i> - Catálogo Proveedores
                </Link>
              }
              {
                login.modulos.includes(4) &&
                <Link 
                  className={`${urlActual === '/almacen/catalogoubicaciones' ? 'text-blue-400' : 'text-white' } text-lg block mt-5 hover:text-blue-400`}
                  to="/almacen/catalogoubicaciones"  >
                      <i className="fa-solid fa-clipboard-list"></i> - Catálogo Ubicaciones
                </Link>
              }
              {
                login.modulos.includes(8) &&
                <Link 
                  className={`${urlActual === '/farmacia' ? 'text-blue-400' : 'text-white' } text-lg block mt-5 hover:text-blue-400`}
                  to="/farmacia">
                      <i className="fa-solid fa-file-invoice"></i> - Farmacia Entradas
                </Link> 
              } 
              {
                login.modulos.includes(9) &&
                <Link 
                  className={`${urlActual === '/almacen/usuarios' ? 'text-blue-400' : 'text-white' } text-xl block mt-5 hover:text-blue-400`}
                  to="/almacen/usuarios">
                      <i className="fa-solid fa-user"></i> - Usuarios
                </Link>
              }
                <button 
                  type='button' 
                  className=' w-full p-2 bg-slate-200 text-xl text-center mt-32 hover:shadow-sm hover:shadow-white hover:bg-slate-300 hover: transition hover:delay-100 hover:duration-300 hover:ease-in-out'
                  onClick={ handleSalir }
                >
                    Salir
                </button>
            </nav>
        </div>
        <div className='md:w-5/6 p-3 md: h-screen overflow-scroll'>
          <Outlet />
        </div>

    </div>
  )
}