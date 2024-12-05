import { Col, Row, Form } from 'react-bootstrap';
import React, { useContext } from 'react';
import AppContext from '../../context/AppContext';
import namer from "color-namer";

let convertName = {
    black: "noir", blue: "bleu", cyan: "cyan", green: "vert",
    teal: "bleu canard", turquoise: "turquoise", indigo: "indigo", gray: "gris", brown: "marron",
    tan: "tan", violet: "noir", beige: "beige", fuchsia: "fuchsia", gold: "or",
    magenta: "magenta", orange: "orange", pink: "rose", red: "rouge", white: "blanc",
    yellow: "jaune"
}


export function ColorInput(props) {
    const { api } = useContext(AppContext);

    // namer(props.data.color).basic[0].name
    // ntc.name(props.data.color)[1]

    return (
        <>
            <Col xs={4} style={{ paddingBottom: "10px" }}>
                <Row>
                    <Col xs={3}>
                        <div style={{
                            alignSelf: 'center',
                            width: "30px",
                            height: "30px",
                            backgroundColor: props.data.color,
                            borderRadius: "50%"
                        }} />
                    </Col>
                    <Col xs={9}>
                        <Form.Control
                            size='sm'
                            type="text"
                            id={`NM${props.data.color}`}
                            placeholder='Nom'
                            className='name updateInfo'
                            defaultValue={convertName[namer(props.data.color).basic[0].name]}
                            onChange={() => props.changeStatusUncomplete(api.testEmptyUpdateInfo())}
                        />
                    </Col>
                </Row>
            </Col>
            <Col xs={8}>
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
        <Row style={{ paddingBottom: "5px" }}>
            <Col xs={4}>
                <Form.Label htmlFor={`add${props.axis}Info`} className='subtitle'>
                    {props.label}
                </Form.Label>
            </Col>
            <Col xs={8}>
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
        </Row>
    );
}