
import { MyTextInput } from './MyTextInput';


export const ResumenCosto = ( { costoResumen } ) => { 
  const {subtotal , iva, total } = costoResumen
  return (
    <>
    
                            <div className='flex mt-2 bg-slate-500 text-md font-semibold p-2'>
                                <div className='md:w-1/6 flex'>
                                            <p className='pr-4'>SUBTOTAL</p>
                                            $<MyTextInput
                                                name="subtotal"
                                                labelClassName="text-gray-800"
                                                className={'mt2 block w-full bg-gray-200 rounded-lg outline-blue-500 text-center '}
                                                type="text"
                                                placeholder="0.00"
                                                value = { new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN',minimumFractionDigits: 4  }).format(subtotal) } 
                                                disabled = { true }
                                            />
                                </div>
                                <div className='md:w-1/6 pl-10 flex'>
                                        <p className='pr-4'>IVA</p>
                                        $<MyTextInput
                                            name="iva"
                                            labelClassName="text-gray-800"
                                            className={'mt2 block w-full bg-gray-200 rounded-lg outline-blue-500 text-center '}
                                            type="text"
                                            placeholder="0.00"
                                            value = { new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN',minimumFractionDigits: 4  }).format(iva) } 
                                            disabled = { true }
                                        />
                                 </div>
                                <div className='md:w-1/6 pl-10  flex'>
                                        <p className='pr-4'>TOTAL</p>
                                        $<MyTextInput
                                            name="total"
                                            labelClassName="text-gray-800"
                                            className={'mt2 block w-full bg-gray-200 rounded-lg outline-blue-500 text-center '}
                                            type="text"
                                            placeholder="0.00"
                                            value = { new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN',minimumFractionDigits: 4  }).format(total) } 
                                            disabled = { true }
                                        />
                                  </div>
                          </div>
    
    </>
  )
}
