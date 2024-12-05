import { Col, Container, Row } from 'react-bootstrap';
import React, { useContext, useEffect } from 'react';
import AppContext from '../context/AppContext';
import { VizUnderline } from '../assets/js/design/underliners/vizUnderline';

import Viz from '../components/elements/Viz'

import { AxisInput, ColorInput } from './elements/Inputs';

function ModalContent(props) {
    const { state, api } = useContext(AppContext);

    useEffect(() => props.changeStatusUncomplete(api.testEmptyUpdateInfo()), [api, props]);

    if (state.dataParser === null) {
        return <></>
    }
    
    let viz = new VizUnderline()

    let resDefault = api.getDefaultValues()

    let dataX = resDefault["dataX"]
    let dataY = resDefault["dataY"]
    let rows_data = resDefault["rows_data"]
    
    return (
        <Container>
            <Row>
                <Col xs={6} style={{ borderRight: "0.1rem solid grey" }}>
                    <Viz dataviz={viz.options}/>
                </Col>
                <Col xs={6}>
                    <Container>
                        <div className='subtitle' style={{ marginBottom: "5px" }}>Axes</div>
                        <Row style={{ marginBottom: "5px" }}>
                            <AxisInput
                                label={state.language.xAxisText(state.dataParser.type)}
                                changeStatusUncomplete={props.changeStatusUncomplete}
                                data={dataX}
                                axis="X" />
                            <AxisInput
                                label={state.language.yAxisText(state.dataParser.type)}
                                changeStatusUncomplete={props.changeStatusUncomplete}
                                data={dataY}
                                axis="Y" />
                        </Row>
                        <hr />
                    </Container>
                    <Container>
                        <div className='subtitle' style={{ paddingBottom: "5px" }}>{state.language.colorText()}</div>
                        <Row>{rows_data.map((row, i1) => (
                            Object.keys(row).includes("color") ? <ColorInput key={i1} data={row} changeStatusUncomplete={props.changeStatusUncomplete} /> :
                                row.data.map((rdata, i2) => (<ColorInput key={100 * i1 + i2} data={rdata} changeStatusUncomplete={props.changeStatusUncomplete} />))
                        ))}
                        </Row>
                    </Container>
                </Col>
            </Row>
        </Container>
    );
}

export default ModalContent;