import { Container, Row, Col } from 'react-bootstrap';
import VizDT from './VizDT';
import ModalForm2 from '../ModalForm2.js';
import ModalContent from '../ModalContent';

import { useState, useContext } from 'react';
import AppContext from '../../context/AppContext';

function AtomicHistory(props) {

    const { api } = useContext(AppContext);
    let rId = Math.floor(Math.random() * 100000) + 1;

    const [hiddenStatus, changeHiddenStatus] = useState(true);
    const [heightStatus, changeHeightStatus] = useState(0);

    const [statusUncomplete, changeStatusUncomplete] = useState(true);

    let openModal = async function () {
        //changeLoadingStatus(true)

        await api.requestDataWrapperAPI()
        //   .then(() => setShow(true))
        //.catch((err) => props.displayToast(err.message))
        //.finally(() => changeLoadingStatus(false))
    }


    return (
        <Row
            style={{ margin: "1rem 0rem", textAlign: "center", borderRadius: "1rem", borderTop: "0.3vw solid #22577A", borderBottom: "0.3vw solid #22577A" }}
            onMouseEnter={() => {
                api.updateArticleText(props.article)
                api.updateId(null, null, props.id)
            }}
            onMouseLeave={() => {
                changeHiddenStatus(true)
            }}
        >
            <Row>
                <Col xs={6} className="atomicHistory" id={rId}>
                    <Container style={{ marginTop: "2vh" }}>
                        <VizDT id={props.id} local={rId} />
                    </Container>
                </Col>
                <Col xs={5} style={{ alignSelf: "center" }}>
                    {hiddenStatus ?
                        <Container className="articleCard"
                            style={{ textAlign: "justify", textJustify: "inter-word" }}>
                            {props.article}
                        </Container>
                        :
                        <div style={{ height: heightStatus, verticalAlign: "text-top" }}>
                            <ModalContent changeStatusUncomplete={changeStatusUncomplete} />
                        </div>
                    }
                </Col>
                <Col xs={1} style={{ alignContent: "center" }}>
                    <div
                        className={'load'}
                        onClick={() => {
                            api.updateArticleText(props.article)
                            api.updateId(null, null, props.id)
                            if (hiddenStatus) {
                                api.requestDataWrapperAPI()
                                changeHeightStatus(document.querySelector(`.atomicHistory[id='${rId}']`).offsetHeight)
                            }
                            console.log(heightStatus);
                            changeHiddenStatus(!hiddenStatus);
                        }}
                        style={{ fontSize: "5cqw", cursor: "pointer" }}>{">"}</div>
                </Col>
            </Row>
            <Row style={{ marginBottom: "1rem" }}>
                <Col xs={6}>
                    <a className='subtitle' style={{ color: "#555555" }} href={`https://datawrapper.dwcdn.net/${props.id}`} target="_blank" rel="noopener noreferrer">{props.titleViz}</a>
                </Col>
                <Col xs={5}>
                    <a className='subtitle' style={{ color: "#555555" }} href={props.url} target="_blank" rel="noopener noreferrer">{props.titleArticle}</a>
                </Col>
            </Row>
        </Row>
    );
}

export default AtomicHistory;