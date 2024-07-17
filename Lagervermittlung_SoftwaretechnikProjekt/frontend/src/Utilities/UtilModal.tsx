import Modal from 'react-bootstrap/Modal';

type Props = {
  show: boolean
  handleClose: () => void 
  modalTitle: string,
  children: React.ReactNode
}

function UtilModal({show, handleClose, modalTitle, children}: Props) {

  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>{modalTitle}</Modal.Title>
      </Modal.Header>
      {children}
    </Modal>
  );
}

export default UtilModal;