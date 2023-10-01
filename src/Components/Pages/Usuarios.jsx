import { forwardRef, useEffect } from 'react';
import { useState } from 'react';
import Edit from '@material-ui/icons/Edit';
import Clear from '@material-ui/icons/Clear';
import MaterialTable from '@material-table/core';

import Swal from 'sweetalert2';
import 'sweetalert2/dist/sweetalert2.css'

import { AddNewFab } from '../ControlsForm/AddNewFab';
import { ModalUsuario } from '../ControlsForm/ModalUsuario';
import { useDispatch } from 'react-redux';
import { useSelector } from 'react-redux';
import { authEditUsuario, startAuthSetUsuarios } from '../../actions/auth';
import { uiOpenModal } from '../../actions/ui';
import { fetchConToken, fetchSinToken } from "../../helpers/fetch";

const tableIcons = { 
  Edit: forwardRef((props, ref) => <Edit {...props} ref={ref} />),
  Clear: forwardRef((props, ref) => <Clear {...props} ref={ref} />),
}

export const Usuarios = () => { 

  const dispatch  = useDispatch();
  const { usuarios } = useSelector ( state => state.auth);

  const [columns, setColumns] = useState([        
    { title: 'Nombre', field: 'nombre' },
    { title: 'Usuario', field: 'usuario' },
    { title: 'Perfil', field: 'Perfil.label' },
  ]);


  const setPermisos = async (idUsuario) => {
        const url = `auth/getpermisos-usuarios/${idUsuario}`;
        const resp = await fetchSinToken( url );
        const body = await resp.json();
        return [
          ...body.user_permisos
        ]
      }

  useEffect(() => {
      usuarios.length === 0 && dispatch( startAuthSetUsuarios() );
  }, [])
  
  
  return (
    <>
        
        <h1 className=" font-black text-3xl text-blue-900">Usuarios del Sistema</h1>
         <p className="mt-3">
            Administración de usuarios.
         </p>
         <div className="bg-white mt-10 px-5 py-10 rounded-md shadow-md mx-auto ">
            <div style={{ maxWidth: '100%'  }}>

            {  

                <MaterialTable  
                    icons={tableIcons}              
                    title="Usuarios"
                    columns={ columns }                   
                    data={ usuarios }
                    
                    actions= {[
                      {
                        icon:  tableIcons.Edit ,
                        tooltip: 'Editar Usuario',
                        onClick: async(event, rowData) => {
                            const permisos =  await setPermisos( rowData.idUsuario );
                            const dataUsuario = {
                              idUsuario : rowData.idUsuario,
                              nombre: rowData.nombre,
                              usuario: rowData.usuario,
                              idPerfil: rowData.Perfil,
                              password: ' ******* ',
                              password2 : ' ******* ', 
                              permisos
                            }
                            dispatch( authEditUsuario( dataUsuario ) );
                            dispatch( uiOpenModal() );
                        }
                      },
                      {
                        icon: tableIcons.Clear,
                        tooltip: 'Cambiar Password',
                        onClick: async(event, rowData) =>{
                          const { value: formValues } = await Swal.fire({
                            title: 'Cambiar Password',
                            html:
                              '<input id="swal-input1" type="password" placeholder="Nuevo Passowrd" class="swal2-input">' +
                              '<input id="swal-input2" type="password" placeholder="Confirmar password" class="swal2-input">',
                            focusConfirm: false,
                            showCancelButton: true,
                            confirmButtonText: 'Guardar',
                            cancelButtonText: 'Cancelar',
                            preConfirm: () => {
                              return [
                                document.getElementById('swal-input1').value,
                                document.getElementById('swal-input2').value
                              ]
                            }
                          })

                          if (formValues) {
                              const resp =  await fetchConToken(`auth/updatepassword/${ rowData.idUsuario }`, { password : formValues[0] } , 'POST' );
                              const body = await resp.json();

                              if ( body.ok ) {
                                Swal.fire('OK','El password se actualizo correctamente','success');
                              } else {
                                Swal.fire('ERROR',`No se actualizo el password`,'error');
                              }
                          }
                        }
                      }              
                    ]}

                    options={{
                        actionsColumnIndex: -1
                    }}

                />  
            }


            </div>
          </div>
    


        <ModalUsuario />
        <AddNewFab />
    </>
  )
}
