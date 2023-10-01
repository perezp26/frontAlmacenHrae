import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import Swal from 'sweetalert2';
import 'sweetalert2/dist/sweetalert2.css'

import MaterialTable from '@material-table/core';
import { startUiAddNewUbicacion, startUiUpdateUbicacion } from '../../actions/ui';

export const CatalogoUbicaciones = () => {
    
    const dispatch = useDispatch();
    const { ubicaciones } = useSelector( state => state.ui )

    const [columns, setColumns] = useState([        
        { title: 'Descripcion', field: 'label' },
        { title: 'Almacen', field: 'almacen' },
        { 
            title: 'Status',
            field: 'activo',
            lookup: { '1': 'Activo', '0' : 'Inactivo' }
        }
    ]);

  return (
    <>
         <h1 className=" font-black text-3xl text-blue-900">Catálogo de ubicaciones</h1>
         <p className="mt-3">
            Administración del catálogo de ubicaciones.
         </p>
         <div className="bg-white mt-10 px-5 py-10 rounded-md shadow-md mx-auto ">
            <div style={{ maxWidth: '100%'  }}>
                
                <MaterialTable                
                    title="Productos"
                    columns={ columns }
                    //icons={ tableIcons }                    
                    data={ ubicaciones }
                    editable={{
                    onRowAdd: async newData =>
                        //  new Promise((resolve, reject) => {
                        //      dispatch( startUiAddNewUbicacion(newData));
                        //      resolve();

                        //  })
                        {
                            const almacen = Number( newData.almacen );
                            const isValidAlmacen = Number.isInteger( almacen );
                            if ( isValidAlmacen ) {
                                await dispatch( startUiAddNewUbicacion(newData) );                              
                            } else {
                                Swal.fire('ERROR',`Almacen no válido`,'error');
                            }                            
                        },
                    onRowUpdate: async (newData, oldData) =>
                        // new Promise((resolve, reject) => {                            
                        //     dispatch( startUiUpdateUbicacion( newData ) );
                        //     resolve();
                        // })
                        {
                            
                            const almacen = Number( newData.almacen );
                            const isValidAlmacen = Number.isInteger( almacen );
                            if ( isValidAlmacen ) {
                                await dispatch( startUiUpdateUbicacion( newData ) );                                
                            } else {
                                Swal.fire('ERROR',`Almacen no válido`,'error');
                            }
                        },
                    }}

                    options={{
                        actionsColumnIndex: -1
                    }}
                />

            </div>
        </div>        
    </>
  )
}