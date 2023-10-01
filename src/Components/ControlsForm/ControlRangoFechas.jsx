
import DatePicker  from 'react-datetime-picker/dist/entry.nostyle';
import "react-datetime-picker/dist/DateTimePicker.css";
import "react-calendar/dist/Calendar.css";

export const ControlRangoFechas = ({ valuesForm,  handleInputChange }) => {
    const { dateStart, dateEnd } = valuesForm 
  return (
            <div className='flex my-2'>
                    <div className="w-1/4 px-2">
                        <label className="text-gray-800" htmlFor="idDireccion"> Fecha Incio </label>
                        <DatePicker 
                            name = "dateStart"
                            className={ `block w-full p-2 rounded-lg outline-blue-500 text-center  bg-slate-200   
                                      `}
                            styles = {'border: none ' }
                            format='dd-MM-y'
                            value={ dateStart } 
                            onChange={ date => handleInputChange("dateStart", date) }
                        />

                    </div>
                    <div className="w-1/4 px-2">
                        <label className="text-gray-800" htmlFor="idDireccion"> Fecha Fin </label>
                        <DatePicker 
                            name = "dateEnd"
                            className={ `block w-full p-2 rounded-lg outline-blue-500 text-center bg-slate-200   
                                        `}
                            styles = {'border: none ' }
                            format='dd-MM-y'
                            value={ dateEnd } 
                            onChange={ date => handleInputChange("dateEnd", date) }
                        />
                    </div>
                    <div className="w-1/4 px-2 pt-5">
                                <button type='button' 
                                        className=' rounded-2xl px-4 py-3 bg-green-700 text-white transition-colors hover:bg-green-900 '
                                        > 
                                        <i className='fas fa-search '> Buscar</i> 
                                </button>
                    </div>
            </div>
  )
}
