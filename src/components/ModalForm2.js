import { useState, useContext } from 'react';
import { Button, Modal } from 'react-bootstrap';
import { useNavigate } from "react-router-dom";
import ModalContent from './ModalContent';
import AppContext from '../context/AppContext';
import { GEN_STATUS } from '../assets/js/types/types';
import { LoaderBar, LoaderButton } from './elements/Loaders';

function ModalForm2(props) {

  const { api, state } = useContext(AppContext);

  const [show, setShow] = useState(false);
  const [loadingStatus, changeLoadingStatus] = useState(false);
  const [statusUncomplete, changeStatusUncomplete] = useState(true);
  const [statusLoad, changeStatusLoad] = useState(GEN_STATUS.DEFAULT);

  const handleClose = () => {
    setShow(false)
    changeStatusLoad(GEN_STATUS.DEFAULT)
    api.clear()
  };

  let navigate = useNavigate();

  let nwModal = async function () {
    await api.udpateInfo()
    let data = await state.dataParser.extractData()
    await api.updateQuestions({ article: state.article, data: data }, changeStatusLoad)
    navigate("/FilterQRs")
  }

  let closeModal = async function () {
    changeLoadingStatus(false)
    changeStatusUncomplete(true)
  }

  let openModal = async function () {
    changeLoadingStatus(true)

    await api.requestDataWrapperAPI()
      .then(() => setShow(true))
      //.catch((err) => props.displayToast(err.message))
      .finally(() => changeLoadingStatus(false))
  }

  let paramsBorder = "0.2rem solid #57CC99"

  return (
    <>
      <div
        loadingStatus={loadingStatus}
        disabled={props.disabledStatusId || props.disabledStatusArticle || loadingStatus}
        onClick={openModal} 
        style={{fontSize: "5cqw"}}>{">"}</div>
      <Modal
        show={show}
        onHide={handleClose}
        backdrop="static"
        keyboard={false}
        centered
        size="xl"
      >
        <Modal.Header closeButton style={{ backgroundColor: "#38A3A5", border: paramsBorder }}>
          <Modal.Title>{state.language.titleModalText()}</Modal.Title>
        </Modal.Header>
        <Modal.Body style={{ borderLeft: "0.2rem solid #57CC99", borderRight: paramsBorder }}>
          {statusLoad !== GEN_STATUS.DEFAULT ?
            <LoaderBar status={statusLoad} />
            :
            <ModalContent changeStatusUncomplete={changeStatusUncomplete} />}
        </Modal.Body>
        <Modal.Footer style={{ borderBottom: paramsBorder, borderLeft: paramsBorder, borderRight: paramsBorder }}>
          <Button className="complete" variant="outline-secondary" onClick={handleClose}> {state.language.cancelText()} </Button>
          <LoaderButton
            loadingStatus={statusLoad !== GEN_STATUS.DEFAULT && statusLoad !== GEN_STATUS.FILTER}
            disabled={statusUncomplete || (statusLoad !== GEN_STATUS.DEFAULT && statusLoad !== GEN_STATUS.FILTER)}
            onclick={() => { statusLoad >= GEN_STATUS.CREATE_ANSWERS ? closeModal() : nwModal() }} />
        </Modal.Footer>
      </Modal >
    </>
  );
}

export default ModalForm2;