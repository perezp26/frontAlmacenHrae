import { useEffect, useState } from 'react';
import { Formik, Form,Field } from "formik";
import Select from 'react-select';
import Modal from 'react-modal';
import { useSelector, useDispatch } from 'react-redux';

import { uiCloseModal } from '../../actions/ui';
import { MyTextInput } from './MyTextInput';
import { customStyles, customStylesControl } from '../Pages/customStylesSelects.js';
import { startAddNewUsuario, startEditUsuario } from '../../actions/auth';
import { fetchSinToken } from '../../helpers/fetch';


const customStyles_modal = {
    ccontent: {
        top: '50%',
        left: '50%',
        right: 'auto',
        bottom: 'auto',
        marginRight: '-50%',
        transform: 'translate(-50%, -50%)',
        index : '1000'
      },
  };


export const ModalUsuario = () => {

    const dispatch = useDispatch();
    const { modalOpen, loading } = useSelector( state => state.ui);
    const { editUsuario } = useSelector( state => state.auth);

    const [initialValues, setInitialValues ] = useState({});
    const [capturaPass, setCapturaPass] = useState(true)
    const [perfiles, setPerfiles ] = useState([]);
    const [modulos, setModulos ] = useState([]);

   const getPerfiles = async () => {
        const url = `auth/get-perfiles-modulos`;
        const resp = await fetchSinToken( url );
        const result = await resp.json();

        const { perfiles, modulos } = result;

        setPerfiles( [ ...perfiles ] );
        setModulos( [ ...modulos ] );
   }

    const closeModal = () =>
      {        
        dispatch( uiCloseModal() );
      }
    
      useEffect( () => {

        const valuesInit = {
            nombre:'',
            usuario:'',
            idPerfil:'',
            password: '',
            password2 : '', 
            permisos: []           
       }
      
        getPerfiles()
        const intitalValues =  Object.keys(editUsuario).length > 0 ? editUsuario : valuesInit;
        intitalValues.idUsuario ? setCapturaPass( false ) : setCapturaPass( true ) ;
        setInitialValues( intitalValues );
    
    }, [ editUsuario ]);

    const handleSubmit = ( values ) => {

        values.idUsuario ? dispatch( startEditUsuario( values ) ) : dispatch( startAddNewUsuario( values ) );        
        dispatch( uiCloseModal() );

    }

  return (
        <Modal
            isOpen={ modalOpen }
            style={ customStyles_modal }
            onRequestClose={ closeModal }
            //contentLabel="Example Modal"
            closeTimeoutMS = { 200 }
            className='modal'
            overlayClassName='modal-fondo'
            ariaHideApp={false}
        >

                <h1 className=" font-black text-3xl text-blue-900">Registro de Usuario</h1>
                <Formik 
                    initialValues={ initialValues }
                    onSubmit= {  ( values ) =>{
                        handleSubmit( values );
                   } }   
                >
                    {
                        ( { errors, setFieldValue, values, touched } ) => (
                            <Form className="mt-10">
                                <div className="md:flex">
                                    <div className="md:w-1/2 md:pr-7">
                                        <MyTextInput 
                                                label="Nombre" 
                                                name = "nombre"
                                                labelClassName = "text-gray-800"                                        
                                                className = {`mt2 block w-full p-3 bg-gray-200 rounded-lg outline-blue-500 text-center  
                                                            ${ errors.nombre && touched.nombre ? ' border border-red-700 ': ''}   `}
                                                type="text"
                                                placeholder= "Nombre"
                                        />
                                    </div>
                                    <div className="md:w-1/2 md:pr-7">
                                        <MyTextInput 
                                                label="Usuario" 
                                                name = "usuario"
                                                labelClassName = "text-gray-800"                                        
                                                className = {`mt2 block w-full p-3 bg-gray-200 rounded-lg outline-blue-500 text-center  
                                                            ${ errors.usuario && touched.usuario ? ' border border-red-700 ': ''}   `}
                                                type="text"
                                                placeholder= "Usuario"
                                        />
                                    </div>
                                </div>

                                <div className="md:flex mt-5">
                                    <div className="md:w-1/2 md:pr-7">
                                        <div className= { `${errors.idPerfil && touched.idPerfil ? 'mb-10' : 'mb-4'}` }>
                                            <label className = "text-gray-800" htmlFor="idPerfil"> Perfil </label> 
                                            <Select 
                                                styles={ { ...customStyles , 
                                                        control : (style) => ({ ...style, 
                                                                                ...customStylesControl, 
                                                                                border : `${errors.idPerfil && touched.idPerfil ? ' 1px solid #ff0000 ': ''}` }) } }
                                                options={ perfiles }
                                                id="idPerfil"
                                                name="idPerfil"
                                                placeholder= "Seleccionar un perfil"   
                                                value = { values.idPerfil }       
                                                onChange={ e => setFieldValue("idPerfil", !!e ? e : '' ) }                   
                                            />
                                            {( errors.idPerfil && touched.idPerfil )  &&
                                                    <Alerta className=" -m-6 ml-0" >
                                                            { errors.idPerfil.value }
                                                    </Alerta>
                                            }
                                        </div>
                                    </div>
                                </div>
                            {
                                capturaPass &&

                                <div className="md:flex">
                                    <div className="md:w-1/2 md:pr-7">
                                        <MyTextInput 
                                                label="Password" 
                                                name = "password"
                                                labelClassName = "text-gray-800"                                        
                                                className = {`mt2 block w-full p-3 bg-gray-200 rounded-lg outline-blue-500 text-center  
                                                            ${ errors.password && touched.password ? ' border border-red-700 ': ''}   `}
                                                type="password"
                                                placeholder= "Password"
                                        />
                                    </div>
                                    <div className="md:w-1/2 md:pr-7">
                                        <MyTextInput 
                                                label="Password" 
                                                name = "password2"
                                                labelClassName = "text-gray-800"                                        
                                                className = {`mt2 block w-full p-3 bg-gray-200 rounded-lg outline-blue-500 text-center  
                                                            ${ errors.password2 && touched.password2 ? ' border border-red-700 ': ''}   `}
                                                type="password"
                                                placeholder= "Repetir el password"
                                        />
                                    </div>
                                </div>

                            }
                                <div className="grid grid-cols-4 gap-4 mt-7">
                                {
                                    
                                    modulos.map( ( {descripcion , permisos}  ) => {
                                            return (
                                            
                                                <div 
                                                    key= {`div_${ descripcion }`}                                                    
                                                >
                                                        <label 
                                                            key = { descripcion }
                                                            className = "text-gray-800 text-lg font-medium"
                                                        >
                                                            { descripcion }
                                                        </label>   
                                                        {
                                                            permisos.map(( {idpermiso, descripcion: nombrePermiso}) => {
                                                                return (         
                                                                    
                                                                    <div key={ `div_${ idpermiso }` }>
                                                                            <label 
                                                                                className="inline-flex items-center"
                                                                                key = { idpermiso } >
                                                                                <Field 
                                                                                        key={`chk${ idpermiso }`}  
                                                                                        type="checkbox" 
                                                                                        className = "w-5 h-5 rounded-full"
                                                                                        name="permisos" 
                                                                                        value= { `${idpermiso}`} />
                                                                                <span className="ml-2"> { nombrePermiso } </span>
                                                                            </label>
                                                                    </div>
                                                                )
                                                            })
                                                        }                                                
                                                </div> 
                                                     
                                            )
                                    })
                                }

                                </div>
                                <button
                                    type="submit"
                                    className=" mt-5 w-full bg-blue-700 p-3 text-white rounded-lg hover:shadow-2xl hover:touch-pinch-zoom hover:bg-blue-800" 
                                > Guradar Datos </button>
                            </Form>
                        )

                    }
                </Formik>
        </Modal>
  )
}
