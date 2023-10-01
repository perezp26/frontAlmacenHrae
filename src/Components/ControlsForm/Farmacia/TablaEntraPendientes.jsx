import { forwardRef } from 'react';
import MaterialTable from '@material-table/core';
import Edit from '@material-ui/icons/BorderColorRounded';
import { useSelector } from 'react-redux';

const tableIcons = {
    Edit: forwardRef((props, ref) => <Edit {...props} ref={ref} style={{ color: "#2f973e" }} />),
}


const columns = [   
    { title: 'Folio', field: 'folio',width: 10 },     
    { title: 'Fecha', field: 'datePedido',width: 10 },     
    { title: 'Cliente', field: 'nombreCliente',width: 300 },     
    {
        field: '',
        title: 'Procentaje',
        width: 50,
        render: rowData => <>{ ((rowData.surtido / rowData.solicitado) * 100).toFixed(2) }%</>
    },
  ]

export const TablaEntraPendientes = () => {
    const { farmaciaEntradasPendientes } = useSelector( state => state.farmacia)
  return (
    <MaterialTable 
            title='Traspasos por Confirmar'
            columns={ columns }
            data = { farmaciaEntradasPendientes }
            actions={[
                rowData => ({
                    icon: tableIcons.Edit, 
                    hidden : rowData.status !== 'P' ? true : false,
                    tooltip:'Editar Pedido',
                    onClick: async (event, rowData) => {
                                
                            },
                })
                
            ]}
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
            options={{
                pageSize: 3,
                pageSizeOptions : [3,6,9],
              }}
        />
  )
}
