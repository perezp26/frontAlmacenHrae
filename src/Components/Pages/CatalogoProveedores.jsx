import { useDispatch, useSelector } from 'react-redux';

import MaterialTable from '@material-table/core';
import {  startUiAddNewProveedor, startUiUpdateProveedor } from '../../actions/ui';
import { downloadExcel } from '../../helpers/dowloadExcel';

export const CatalogoProveedores = () => {
    const dispatch = useDispatch();
    const { ui, auth } = useSelector( state => state ); 
    const { proveedores } = ui; 
    const { login } = auth;

    const columns= [
        
        { title: 'Descripcion', field: 'label',width: 380 },
        { title: 'RFC', field: 'rfc', width: 100 },
        { 
            title: 'Status',
            field: 'activo',
            lookup: { '1': 'Activo', '0' : 'Inactivo' },
            width: 100 
        }
    ];
    
    const handlesExportaExcel = () =>{
        downloadExcel('excel/excelcatproveedores',{},'catalogo proveedores')
    }
  return (
    <>
         <h1 className=" font-black text-3xl text-blue-900">Catálogo de Productos</h1>
         <p className="mt-3">
            Administración del catálogo de productos.
         </p>
         <div className="bg-white mt-10 px-5 py-10 rounded-md shadow-md mx-auto ">
            <button    type='button' 
                        className = "mt-5 w-100 bg-green-700 p-1 text-white rounded-lg hover:shadow-2xl hover:touch-pinch-zoom hover:bg-green-800" 
                        onClick={ handlesExportaExcel }
            >
                Exportar Excel
            </button>
            <div style={{ maxWidth: '100%'  }}>
                <MaterialTable                
                    title="Proveedores"
                    columns={ columns }                   
                    data={ proveedores }
                    editable={{
                    //isEditHidden: rowData => !login.permisos.includes(8),
                    onRowAdd: async(newData) =>
                      
                        {
                             await dispatch( startUiAddNewProveedor(newData));                            
                        },
                    onRowUpdate: async (newData, oldData) =>
                        {
                            await dispatch( startUiUpdateProveedor( newData ) );
                        }
                    }}
                    options={{
                        pageSize: 50,
                        pageSizeOptions : [10,20,30,40,50],
                        tableLayout: "fixed",
                        actionsColumnIndex: -1
                      }}
                    localization={{ 
                        pagination: {
                            labelRowsSelect: 'Filas',
                        },
                        toolbar: { 
                            searchTooltip: 'Buscar',
                            searchPlaceholder: 'Buscar'
                        },
                        header : {
                            actions : ''
                        }
                    }}
                />

            </div>
        </div>        
    </>
  )
}
