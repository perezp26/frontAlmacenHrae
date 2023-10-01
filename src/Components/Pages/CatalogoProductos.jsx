import { useDispatch, useSelector } from 'react-redux';

import MaterialTable from '@material-table/core';
import { startUiAddNewProducto, startUiUpdateProducto } from '../../actions/ui';
import { downloadExcel } from '../../helpers/dowloadExcel';


export const CatalogoProductos = () => {
    
    const dispatch = useDispatch();
    const { ui, auth } = useSelector( state => state ); 
    const { productos, family, unidad } = ui; 
    const { login } = auth;

    const columns= [
        { title: 'Codigo', field: 'codigo', width: 100 },
        { title: 'Descripcion', field: 'descripcion',width: 500 },
        {
            title: 'Unidad',
            field: 'idUnidadMedida',
            lookup: unidad,
            width: 100
        },
        { 
            title: 'Familia',
            field: 'clvFamilia',
            lookup: family,
            width: 100
        },
        {
            title:'I.V.A',
            field: 'iva',
            lookup: { SI:'SI', NO:'NO'},
            width: 50
        },
       
    ];

    const handlesExportaExcel = () =>{
        downloadExcel('excel/excelcatproductos',{},'catalogo productos')
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
                    title="Productos"
                    columns={ columns }                   
                    data={ productos }
                    editable={{
                    isEditHidden: rowData => !login.permisos.includes(8),
                    onRowAdd: async(newData) =>
                      
                        {
                             await dispatch( startUiAddNewProducto(newData));                            
                        },
                    onRowUpdate: async (newData, oldData) =>
                        
                        {
                            await dispatch( startUiUpdateProducto( newData ) );
                        }
                    }}
                    options={{
                        pageSize: 50,
                        pageSizeOptions : [10,20,30,40,50],
                        tableLayout: "fixed",
                        actionsColumnIndex: -1
                      }}
                />

            </div>
        </div>        
    </>
  )
}
