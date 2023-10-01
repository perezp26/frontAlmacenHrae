import { useSelector, useDispatch } from 'react-redux';
import Modal from 'react-modal';
import { uiCloseModal } from '../../actions/ui';
import { Producto } from './Producto';
import { ListSalidas } from './ListSalidas';

const customStyles_modal = {
    content: {
        position: 'absolute',
        top: '50%',
        left: '50%',
        right: 'auto',
        bottom: 'auto',
        marginRight: '-50%',
        transform: 'translate(-50%, -50%)',
        index: '1000',
    },
};

const ModalSurtir = () => {
    const dispatch = useDispatch();
    const { modalOpen, viewModalSurtir } = useSelector(state => state.ui);

    const { view, idListSurtido, codigo, idProducto, solicitado } = viewModalSurtir;
    const closeModal = () => {
        dispatch(uiCloseModal());
    }

    return (
        <Modal
            isOpen={modalOpen}
            style={customStyles_modal}
            onRequestClose={closeModal}
            closeTimeoutMS={200}
            className='modal'
            overlayClassName='modal-fondo'
            ariaHideApp={false}
        >
            <div className='flex justify-between mb-5' >
                <label className=' text-lg text-blue-700 shadow-sm'>{ view === 'listSalidas' ? 'Detalle Surtido' : 'Prodcuto Solicitar' }</label>
                <button type='button' className='  bg-slate-500 px-3' onClick={closeModal}> <i className="fa-solid fa-xmark"></i> </button>
            </div>
                {view === 'listSalidas' ? <ListSalidas idSurtido={0} idListSurtido={idListSurtido} codigo={ codigo } idProducto={idProducto} solicitado = { solicitado } /> : <Producto />}

        </Modal>
    )
}

export default ModalSurtir