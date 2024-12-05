import { Row, Form, Container, Col } from "react-bootstrap";

import React, { useContext, useState } from 'react'
import AppContext from '../context/AppContext'
import ModalForm from "../components/ModalForm";
import Toaster from "../assets/js/tools/toaster"

function HomeForm() {
    const {api, state} = useContext(AppContext);
    
    const [errorStatusId, changeErrorId] = useState(false);
    const [disabledStatusId, changeStatusId] = useState(true);
    const [disabledStatusArticle, changeStatusArticle] = useState(true);

    return (
        <Container className="HomeForm" style={{ height:"80vh", fontSize: "large", fontWeight: "500", textAlign: "center", alignContent: "center", justifyContent: "center"}}>
            <Col xs={{ span: 8, offset: 2 }}>
                <Row id="HomeFormViz" style={{ marginTop: "1.5rem"}}>
                    <Form.Label htmlFor="idViz" className="subtitle">{state.language.idFormText()}</Form.Label>
                    <Form.Control
                        className={disabledStatusId ? "uncomplete": "complete"}
                        size="md"
                        type="text"
                        id="idViz"
                        placeholder="W7tCS"
                        minLength={5}
                        maxLength={5}
                        onChange={() => api.updateId(changeStatusId, changeErrorId)}
                        isInvalid={errorStatusId}
                    />
                </Row>
                <Row id="HomeFormArticle" style={{ marginTop: "1.5rem" }}>
                    <Form.Label htmlFor="articleText" className="subtitle">{state.language.articleFormText()}</Form.Label>
                    <Form.Control
                        className={disabledStatusArticle ? "uncomplete": "complete"}
                        size="md"
                        type="file"
                        id="articleText"
                        accept=".txt"
                        onChange={async event => api.updateArticle(event, changeStatusArticle)}
                    />
                </Row>
                <Row id="HomeFormButton" style={{ marginTop: "1rem" }}>
                    <Col>
                        <ModalForm
                            disabledStatusId={disabledStatusId}
                            disabledStatusArticle={disabledStatusArticle}
                            displayToast={text => Toaster.errorInputs(text)}
                        ></ModalForm>
                    </Col>
                </Row>
            </Col>
        </Container >
    );
}

export default HomeForm;