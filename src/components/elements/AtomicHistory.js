import { Container, Row, Col } from 'react-bootstrap';
import VizDT from './VizDT';
import ModalContent from '../ModalContent';
import { GEN_STATUS } from '../../assets/js/types/types.js';

import { useNavigate } from "react-router-dom";

import { useState, useContext } from 'react';
import AppContext from '../../context/AppContext';

import CurvedArrow from "react-curved-arrow";


function AtomicHistoryExample() {

    const { state } = useContext(AppContext);
    let rId = Math.floor(Math.random() * 100000) + 1;

    return (
        <Row>
            {/* <CurvedArrow fromSelector=".start2.example" toSelector=".end2.example" width="1"/> */}
            <Col xs={1}>
                {/* <div className='start3 example' style={{textAlign: "left", inlineSize: "300px", fontSize: "20px"}}>Visualisation</div>
                <div className='start1 example' style={{textAlign: "left", inlineSize: "300px", fontSize: "20px"}}>Lien vers la visualisation</div> */}
            </Col>
            <Col xs={10}>
                <Row
                    style={{ margin: "1rem 0rem", textAlign: "center", borderRadius: "1rem", borderTop: "0.3vw solid #22577A", borderBottom: "0.3vw solid #22577A" }}
                >
                    <Row>
                        <Col xs={6} className="atomicHistory end3 example" id={rId}>
                            <Container style={{ marginTop: "2vh" }}>
                                <VizDT id={"05U1o"} local={rId} />
                            </Container>
                        </Col>
                        <Col xs={5} style={{ alignSelf: "center" }}>
                            <Container className="articleCard end4 example"
                                style={{ textAlign: "justify", textJustify: "inter-word" }}>
                                {"Cette section contient l'extrait de l'article de presse concerné par la méthodologie GenQA. / This section contains the press article extract concerned by the GenQA methodology."}
                            </Container>
                        </Col>
                        <Col xs={1} style={{ alignContent: "center" }}>
                            <div
                                className="load example"
                                style={{ fontSize: "5cqw", cursor: "pointer", textShadow: `2px 2px 5px green` }}>{">"}</div>
                        </Col>
                    </Row>
                    <Row style={{ marginBottom: "1rem" }}>
                        <Col xs={6}>
                            <a className='subtitle end1 example' style={{ color: "#555555" }} target="_blank" rel="noopener noreferrer">{state.language.link2Viz()}</a>
                        </Col>
                        <Col xs={5}>
                            <a className='subtitle end2 example' style={{ color: "#555555" }} target="_blank" rel="noopener noreferrer">{state.language.link2Article()}</a>
                        </Col>
                    </Row>
                </Row >
            </Col>
            <Col xs={1}>
                {/* <div className='start4 example' style={{direction: "rtl", inlineSize: "300px", fontSize: "20px"}}>Article de presse</div>
                <div className='start2 example' style={{direction: "rtl", inlineSize: "300px", fontSize: "20px"}}>Lien vers l'article</div> */}
            </Col>
        </Row>
    );
}

function AtomicHistory(props) {

    const { state, api } = useContext(AppContext);
    let rId = Math.floor(Math.random() * 100000) + 1;

    const [statusLoad, changeStatusLoad] = useState(GEN_STATUS.DEFAULT);
    const [statusUncomplete, changeStatusUncomplete] = useState(true);
    const [hiddenStatus, changeHiddenStatus] = useState(true);
    const [heightStatus, changeHeightStatus] = useState(0);

    let navigate = useNavigate();

    let loadQAs = async function () {
        await api.udpateInfo()
        let data = await state.dataParser.extractData()
        await api.updateQuestions({ article: state.article, data: data }, changeStatusLoad)
        navigate("/FilterQRs")
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
            <Row style={{ marginTop: "2vh" }}>
                <Col xs={6} className="atomicHistory" id={rId}>
                    <Container>
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
                        <div className="textCard"
                            style={{ height: heightStatus, verticalAlign: "text-top" }}>
                            <ModalContent changeStatusUncomplete={changeStatusUncomplete} />
                        </div>
                    }
                </Col>
                <Col xs={1} style={{ alignContent: "center" }}>
                    <p
                        className={'load'}
                        onClick={() => {
                            api.updateArticleText(props.article)
                            api.updateId(null, null, props.id)
                            if (hiddenStatus) {
                                api.requestDataWrapperAPI()
                                changeHeightStatus(document.querySelector(`.atomicHistory[id='${rId}']`).offsetHeight + (props.offset ? props.offset : 0))
                            } else {
                                loadQAs();
                            }
                            changeHiddenStatus(!hiddenStatus);
                        }}
                        title={ hiddenStatus ? state.language.buttonTextHoverArticle() : state.language.buttonTextHoverQA()}
                        style={{ 
                            fontSize: "5cqw", 
                            cursor: "pointer", 
                            textShadow: `2px 2px 5px ${hiddenStatus ? "green" : ((!statusUncomplete) ? "green" : "red")}`
                            }}>{">"}</p>
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

export { AtomicHistoryExample, AtomicHistory };