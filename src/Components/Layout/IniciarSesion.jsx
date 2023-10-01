import { useNavigate } from 'react-router-dom'
import { Formik, Form } from 'formik'
import { useDispatch } from 'react-redux'

import { startLogin } from '../../actions/auth'
import logoKoonol from '../../imgs/logohraepy.png'
import { MyTextInput } from '../ControlsForm/MyTextInput'

export const IniciarSesion = () => {

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const handleSubmit = async ( values ) => {

           const { usuario, password } = values
           dispatch( startLogin( usuario, password) );

    }

  return (
    <Formik
        initialValues = {{
            usuario:'',
            password:''
        }}
        onSubmit= { ( values ) =>{
            handleSubmit( values )
        } }
    >
    {
        () => {
            return(
            <Form>
                <div className="grid place-items-center h-screen">
                    <div className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4 w-96">                        
                        <img className="mx-auto" src={ logoKoonol } alt="Logo Koonol" width={150} />
                        <div className="mb-4 mt-7">
                            <MyTextInput 
                                label="Usuario"
                                name="usuario"
                                labelClassName= "block text-grey-darker text-sm font-bold mb-2"
                                className = "shadow appearance-none border rounded w-full py-2 px-3 text-grey-darker text-center"
                                type="text"
                                placeholder="Usuario"
                            />
                        </div>
                        <div className="mb-12">
                            <MyTextInput 
                                label="Password"
                                name="password"
                                labelClassName= "block text-grey-darker text-sm font-bold mb-2"
                                className = "shadow appearance-none border rounded w-full py-2 px-3 text-grey-darker text-center"
                                type="password"
                                placeholder="********"
                            />
                        </div>
                        <div className="flex items-center justify-between">
                            <button className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded block w-full text-center" type="submit">
                            Iniciar Sesion
                            </button>
                        </div>
                    </div>
                </div>
            </Form>
        )}
    }
    </Formik>
  )
}
