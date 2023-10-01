import { forwardRef, memo, useEffect,useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import MaterialTable from '@material-table/core';
import Edit from '@material-ui/icons/Edit';
import Delete from '@material-ui/icons/Delete'

import { entradaDeleteDetalle, stratGetDetalleEntrada } from '../../actions/entrada';

const tableIcons = {
    Edit: forwardRef((props, ref) => <Edit {...props} ref={ref} />),
    Delete: forwardRef((props, ref) => <Delete {...props} ref={ref} />)
  }

export const DetalleEntradatable = memo(({ listProductosEntrada, setListProductosEntrada, costoResumen, setcostoResumen }) => {
   
    const [paginacion, setPaginacion] = useState(false)

    useEffect(() => {
        setPaginacion(listProductosEntrada.length > 0 ? true : false)
    }, [listProductosEntrada])
    
    
    const dispatch = useDispatch();
    
    const columns = [   
        
        { title: 'Cant.', field: 'unidades', type: "numeric", width: 10 },    
        {
            field: '',
            title: 'Producto',
            render: rowData => <>{ `${rowData.codigoProducto}-${rowData.descripcionProducto}` }</>, 
            width: 650
        },
        { title: 'lote', field: 'lote', width: 20 },
        { title: 'caducidad', field: 'caducidad', width: 20 },
        { title: 'Unitario', field: 'precio', type: "currency", width: 30 },    
        { title: 'Total', type: "currency",
               render: rowData => <>{ `${ new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN',minimumFractionDigits: 4  }).format((rowData.unidades * rowData.precio)) }` }</>, 
                width: 30
        }

        
    ]

    const handlesEdit = ( idEntrada ) =>{
        dispatch( stratGetDetalleEntrada(idEntrada) )
       //dispatch( uiOpenModal() );
    }
  return (
    <div>
        <MaterialTable 
            title='Productos'
            columns={ columns }
            data = { listProductosEntrada }

            actions= {[
                rowData => ({
                    icon: rowData.idEntrada !==0 ? tableIcons.Edit : tableIcons.Delete , 
                    //hidden : rowData.status === 'C' ? true : false,
                    tooltip:'Editar Entrada',
                    onClick: async (event, rowData) => {
                                if (rowData.idEntrada !==0 )
                                    handlesEdit( rowData.idEntrada ) 
                                else{
                                    setcostoResumen({ ...costoResumen , 
                                        subtotal : (Number(costoResumen.subtotal) -  (Number(rowData.precio) * Number(rowData.unidades))).toFixed(2),
                                        iva : (Number(costoResumen.iva) -  (Number(rowData.iva) * Number(rowData.unidades)) ).toFixed(2),
                                        total : (Number(costoResumen.total) - ((Number(rowData.precio) * Number(rowData.unidades)) + (Number(rowData.iva)* Number(rowData.unidades)))).toFixed(2)
                                    })

                                    const productosEntradaFilter = rowData.idEntrada !== 0 
                                                                    ? [ ...listProductosEntrada.filter( e => e.idEntrada !== rowData.idEntrada )]
                                                                    : [ ...listProductosEntrada.filter( e => e.idTemp !== rowData.idTemp ) ];
                                    setListProductosEntrada( [ ...productosEntradaFilter ] );
                                    dispatch( entradaDeleteDetalle( rowData ) )
                                }
                            },
                }),
            ]}
onPageChange = { () => console.log('cambio pagina') }
            options={{
                paging : paginacion,
                pageSize: 20,
                pageSizeOptions : [20,30,40,50,60],
                maxBodyHeight :400,
                search : true,
                headerStyle:{
                    fontSize:12,
                    fontWeight: 'bold'
                },
                rowStyle:{
                    fontSize: 12
                }
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
})
