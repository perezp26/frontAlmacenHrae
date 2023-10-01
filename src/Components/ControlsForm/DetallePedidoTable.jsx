import { forwardRef } from 'react';

import MaterialTable from '@material-table/core';
import DeleteOutline from '@material-ui/icons/DeleteOutline';

const tableIcons = {
    Delete: forwardRef((props, ref) => <DeleteOutline {...props} ref={ref} />)
}

export const DetallePedidoTable = ({ listProductos, setListProductos, setAction, idRemision, isImportEntrada }) => {    

    const columns = [   
        
        { title: 'Cant.', field: 'cantidad', type: "numeric", width: 20 },    
        { title: 'Surtido', field: 'surtido', type: "numeric", width: 20, hidden: idRemision === 0 && !isImportEntrada  ? true : false },     
       
        {
            field: '',
            title: 'Producto',
            render: rowData => <>{ `${rowData.producto.codigo}-${rowData.producto.descripcion}` }</>, 
            width: 900
        },
        { title: 'Unidad', field: 'unidad', width: 25 },
        { title: 'Costo', field:'precio', type: 'currency',width: 25 },
        { title: 'IVA', field:'iva', type: 'currency',width: 25 },
    ]

  return (
    <div>
        <MaterialTable 
            title='Productos'
            columns={ columns }
            data = { listProductos }

            actions= {[
                {
                    icon: tableIcons.Delete,
                    tooltip: 'eliminar',
                    onClick: (event, rowData) => {  
                        setListProductos( listProductos.filter( e => e.id !== rowData.id ) )     
                        
                    },
                    hidden: setAction === '0' ? false : true
                }
            ]}

            options={{
                paging : false,
                search : false
              }}
            localization = {{
                pagination: {
                    labelRowsSelect: 'Filas',
                },
                toolbar: { 
                    searchTooltip: 'Buscar',
                    searchPlaceholder: 'Buscar'
                },
                header: { actions : '' }
            }}
        />
    </div>
  )
}
