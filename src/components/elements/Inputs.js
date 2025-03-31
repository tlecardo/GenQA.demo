import { Col, Row, Form } from 'react-bootstrap';
import React, { useContext } from 'react';
import AppContext from '../../context/AppContext';
import namer from "color-namer";

export function ColorInput(props) {
    const { state, api } = useContext(AppContext);

    return (
        <>
            <Col xs={3} style={{ paddingBottom: "10px" }}>
                <Row>
                    <Col xs={4}>
                        <div style={{
                            alignSelf: 'center',
                            width: "2vw",
                            height: "2vw",
                            backgroundColor: props.data.color,
                            borderRadius: "50%"
                        }} />
                    </Col>
                    <Col xs={8}>
                        <Form.Control
                            size='sm'
                            type="text"
                            id={`NM${props.data.color}`}
                            placeholder={state.language.nameText()}
                            className='name updateInfo'
                            defaultValue={state.language.color(namer(props.data.color).basic[0].name)}
                            onChange={() => props.changeStatusUncomplete(api.testEmptyUpdateInfo())}
                        />
                    </Col>
                </Row>
            </Col>
            <Col xs={9}>
                <Form.Control
                    size='sm'
                    type="text"
                    id={`DE${props.data.color}`}
                    className='label updateInfo'
                    placeholder='Description'
                    defaultValue={Object.keys(props.data).includes("label") ? props.data.label : props.data.text}
                    onChange={() => props.changeStatusUncomplete(api.testEmptyUpdateInfo())}
                />
            </Col>
        </>
    );
}


export function AxisInput(props) {
    const { api } = useContext(AppContext);

    return (
        <>
            <Col xs={3} style={{ paddingBottom: "10px" }}>
                <Row>
                    <Form.Label htmlFor={`add${props.axis}Info`} style={{ fontSize: "1vw", verticalAlign: "text-top" }}>
                        {props.label}
                    </Form.Label>
                </Row>
            </Col>
            <Col xs={9} styles={{height:"1vw"}}>
                <Form.Control
                    size='sm'
                    type="text"
                    id={`add${props.axis}Info`}
                    placeholder='Description'
                    defaultValue={props.data}
                    className='updateInfo'
                    onChange={() => props.changeStatusUncomplete(api.testEmptyUpdateInfo())}
                />
            </Col>
        </>
    );
}