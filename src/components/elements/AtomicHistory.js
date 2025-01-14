import { Container, Row, Col } from 'react-bootstrap';
import VizDT from './VizDT';
import ModalForm2 from '../ModalForm2.js';

import AppContext from '../../context/AppContext';
import { useContext } from 'react';

function AtomicHistory(props) {

    const { api } = useContext(AppContext);
    let rId = Math.floor(Math.random() * 100000) + 1;

    return (
        <Row style={{ margin: "1rem 0rem", textAlign: "center", borderRadius: "1rem", borderTop: "0.2rem solid #22577A", borderBottom: "0.2rem solid #22577A" }}>
            <Row>
                <Col xs={6}>
                    <Container style={{ marginTop: "1rem", marginBottom: "0.5rem" }}>
                        <VizDT id={props.id} local={rId} />
                    </Container>
                </Col>
                <Col xs={5} style={{ alignSelf: "center" }}>
                    <Container className="articleCard"
                        style={{ textAlign: "justify", textJustify: "inter-word" }}>
                        {props.article}
                    </Container>
                </Col>
                <Col xs={1}
                    style={{ alignContent: "center" }}
                    onMouseEnter={() => {
                        api.updateArticleText(props.article)
                        api.updateId(null, null, props.id)
                    }}>
                    <ModalForm2
                        displayToast={text => Toaster.errorInputs(text)}
                        disabledStatusId={false}
                        disabledStatusArticle={false} />
                </Col>
            </Row>
            <Row style={{marginBottom: "1rem"}}>
                <Col xs={6}>
                    <a className='subtitle' style={{ color: "#555555" }} href={`https://datawrapper.dwcdn.net/${props.id}`} target="_blank" rel="noopener noreferrer">{props.title}</a>
                </Col>
                <Col xs={5}>
                    <a className='subtitle' style={{ color: "#555555" }} href={props.url} target="_blank" rel="noopener noreferrer">Lien vers l'article complet</a>
                </Col>
            </Row>
        </Row>
    );
}

export default AtomicHistory;