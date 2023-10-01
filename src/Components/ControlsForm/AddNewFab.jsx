
import { useDispatch } from 'react-redux';

import { uiOpenModal } from '../../actions/ui';
import { authEditUsuario } from '../../actions/auth'

export const AddNewFab = () => {

     const dispatch = useDispatch();
     const handleClickNew = () => {        
           dispatch( authEditUsuario( {} ) );
           dispatch( uiOpenModal() );
     }

  return (
            <button 
                className=" bg-blue-700 fab text-cyan-50"
                onClick={  handleClickNew }
            >
                 <i className='fas fa-plus '> </i> 
            </button>
        );
};
