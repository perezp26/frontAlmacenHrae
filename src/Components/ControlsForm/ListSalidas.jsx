import { forwardRef, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import MaterialTable from '@material-table/core';
import DeleteOutline from '@material-ui/icons/DeleteOutline';

import { Salida } from '../Pages/Salida';
import { surtidoDeleteProdcutosSurtido, surtidoListaFilterProductosSurtidos, surtidoUpdatePorcentajeSolicitud } from '../../actions/surtido';

const tableIcons = {
    Delete: forwardRef((props, ref) => <DeleteOutline {...props} ref={ref} />),
}
export const ListSalidas = ({ idListSurtido, codigo, idProducto, idSurtido, solicitado }) => {
    const dispatch = useDispatch();
    const { productosFilterListSurtido } = useSelector(state => state.surtido);

    const [_totalUnidades, set_TotalUnidades] = useState(0);
    const [view, setView] = useState('dataTable');
    const [columns, setColumns] = useState([
        //{ title: 'pallet', field: 'pallet' },
        { title: 'producto', field: 'descripcion', width: 550 },
        { title: 'unidad', field: 'unidades' },
        { title: 'Precio', field:'precio', type: "currency", width:40},
        { title: 'Iva', type: "currency",
            render: rowData => <>{ `$${ (rowData.unidades * rowData.iva).toFixed(2) }` }</>, 
            width: 40
        },
        { title: 'Total', type: "currency",
               render: rowData => <>{ `$${ ((rowData.unidades * rowData.precio)+(rowData.unidades * rowData.iva)).toFixed(2) }` }</>, 
                width: 50
        }

    ]);

    useEffect(() => {
      dispatch( surtidoListaFilterProductosSurtidos( idListSurtido ) )
    }, [])

    useEffect(() => {
        let tempTotal = 0.00
        let costoTotal = 0.00
        let ivaTotal = 0.00
        productosFilterListSurtido.forEach(e => {
            tempTotal = Number(tempTotal) + Number(e.unidades)
            costoTotal = Number(costoTotal) + (Number( e.precio ) * Number(e.unidades) )
            ivaTotal = Number(ivaTotal) + (Number(e.iva) * Number(e.unidades) )
        });
        set_TotalUnidades( tempTotal );
        
        tempTotal <=  solicitado && dispatch( surtidoUpdatePorcentajeSolicitud({ surtido:tempTotal.toFixed(2), precio : costoTotal, iva : ivaTotal , id: idListSurtido }) );
    }, [productosFilterListSurtido])
    

    const handlesAddProducto = () =>{
        setView('formSalida')
    }

    return (
        <>
            {view === 'dataTable' ? <>
                <MaterialTable
                    title="Productos"
                    columns={columns}
                    icons={tableIcons}
                    data={productosFilterListSurtido}
                    actions= {[
                        {
                            icon: tableIcons.Delete,
                            tooltip: 'Borrar',
                            onClick: (event, rowData) => {
                                dispatch( surtidoDeleteProdcutosSurtido( rowData.pallet ) );
                                dispatch( surtidoListaFilterProductosSurtidos( idListSurtido ) )
                            }
                          },            
                    ]}
                    options={{
                        toolbar : false,
                        maxBodyHeight :400,
                    }}

                    localization={{
                        header : {
                            actions : ''
                        }
                    }}
                />
                <button
                    type="button"
                    className=" w-full px-3 py-2 text-white bg-sky-700 transition ease-out duration-500 hover:bg-sky-600 hover:shadow-lg"
                    onClick={ handlesAddProducto}
                >
                    Agregar Producto Surtido
                </button>
            </>
                : <>
                    <Salida setView = { setView } 
                            idListSurtido = { idListSurtido } 
                            idSurtido = { idSurtido } 
                            codigo = { codigo }
                            id_Producto= { idProducto } 
                            solicitado = { solicitado }
                            totalUnidades = { _totalUnidades }
                    />
                </>
            }
        </>
    )
}
