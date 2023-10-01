
import { UseForm } from '../../hooks/UseForm'

import { format, subDays  } from 'date-fns'

import { ControlRangoFechas } from '../ControlsForm/ControlRangoFechas';
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { startSetEntradasPendientes } from '../../actions/farmacia';
import { TablaEntraPendientes } from '../ControlsForm/Farmacia/TablaEntraPendientes';
import { useState } from 'react';

export const FarmaciaPanelEntradas = () => {

const dispatch = useDispatch()

const [viewPendientes, setViewPendientes] = useState(false)
const [ valuesForm, handleInputChange ] = UseForm({
    dateStart :  subDays(new Date(), 30),
    dateEnd : new Date()
 })

 const { dateStart, dateEnd } = valuesForm

 useEffect(() => {
   dispatch( startSetEntradasPendientes( format(dateStart, 'yyyy-MM-dd'), format( dateEnd, 'yyyy-MM-dd' ) ) )
 }, [])
 
 const handlesViewPendientes = () => {
          const  time = viewPendientes ? 700 : 1                                     
          setTimeout(( ) => {
            setViewPendientes( !viewPendientes )
          }, time)
  }                                  
 
  return (
    <>
        <h1 className=" font-black text-3xl text-blue-900">Panel Entradas Farmacia</h1>
        <p className="mt-3">
            Administrador de Entradas Farmacia 
        </p>

        <div className="bg-white px-5 py-5 rounded-md shadow-md mx-auto ">
            
            <ControlRangoFechas handleInputChange={ handleInputChange } valuesForm = { valuesForm } /> 
            <div className=' flex justify-between w-full bg-amber-600 text-white text-lg p-2 rounded-t-lg mt-12 hover:cursor-pointer' onClick={ handlesViewPendientes} > 
                    <span>Traspasos pendientes por confirmar </span>
                    <span className=' bg-orange-600 text-white rounded-xl px-2 ' > 1 </span>
            </div>
            { viewPendientes && <div className= { viewPendientes ? 'animate__animated animate__fadeInDown' : 'animate__animated animate__bounceOut '}> <TablaEntraPendientes /> </div> }
        </div>
    </>
  )
}
