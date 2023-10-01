
import { useState, useEffect, memo } from 'react';
import Select from 'react-select';
import { customStyles, customStylesControl } from '../Pages/customStylesSelects';

import { fetchConToken } from '../../helpers/fetch';

const CabeceraPedido = memo(({ values,setValuesForm,errors,touched,clientes, setAction } ) => {

  return (
    <>
            <div className="px-2">
                <label className="text-gray-800" htmlFor="idCliente"> Servicio </label>
                <Select 
                    styles={{
                        ...customStyles,
                        control: (style) => ({
                            ...style,
                            ...customStylesControl,
                            border: `${errors.idCliente && touched.idCliente ? ' 1px solid #ff0000 ' : ''}`
                        })
                    }}
                    options={ clientes }
                    id="idCliente"
                    name="idCliente"
                    placeholder="Seleccionar un servicio"
                    isClearable
                    value={ values.idCliente }
                    onChange={e => { setValuesForm("idCliente", !!e ? e : '') }}
                    isDisabled = { setAction === '1' }
                />
            </div>

           

    </>
  )
})

export default CabeceraPedido