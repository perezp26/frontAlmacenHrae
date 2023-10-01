
import { useDispatch, useSelector } from 'react-redux';
import Modal from 'react-modal';
import { uiCloseModal } from '../../actions/ui';
import { FormEntrada } from '../Pages/FormEntrada';

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

export const ModalEditEntrada = ({ setListProductosEntrada, listProductosEntrada, costoResumen, setcostoResumen } ) => {

    const dispatch = useDispatch();
    const { modalOpen } = useSelector( state => state.ui);

    const closeModal = () =>
      {        
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
            <div className='flex justify-between ' >
              <div></div>
              <button type='button' className='  bg-slate-500 px-3' onClick={closeModal}> <i className="fa-solid fa-xmark"></i> </button>
            </div>
            <FormEntrada closeModal={ closeModal } listProductosEntrada={ listProductosEntrada } setListProductosEntrada = { setListProductosEntrada }
                         setcostoResumen = { setcostoResumen } costoResumen = { costoResumen }
            />
        </Modal>
  )
}
