import { Container, Row } from 'react-bootstrap';
import React, { useContext, useEffect } from 'react';
import AppContext from '../context/AppContext';

import { AxisInput, ColorInput } from './elements/Inputs';

function ModalContent(props) {
    const { state, api } = useContext(AppContext);

    useEffect(() => props.changeStatusUncomplete(api.testEmptyUpdateInfo()), [api, props]);

    if (state.dataParser === null) {
        return <></>
    }

    let resDefault = api.getDefaultValues()

    let dataX = resDefault["dataX"]
    let dataY = resDefault["dataY"]
    let rows_data = resDefault["rows_data"]

    return (
        <Container style={{ verticalAlign: "text-top" }}>
            <Row>
                <Container>
                    <div className='fieldForm' style={{ marginBottom: "5px", alignSelf: "center" }}>Axes</div>
                    <Row>
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
                    <hr style={{ margin: "1rem 0 0" }} />
                </Container>
                <Container>
                    <div className='subtitle' style={{ paddingBottom: "5px" }}>{state.language.colorText()}</div>
                    <Row>{rows_data.map((row, i1) => (
                        Object.keys(row).includes("color") ? <ColorInput key={i1} data={row} changeStatusUncomplete={props.changeStatusUncomplete} /> :
                            row.data.map((rdata, i2) => (<ColorInput key={100 * i1 + i2} data={rdata} changeStatusUncomplete={props.changeStatusUncomplete} />))
                    ))}
                    </Row>
                </Container>
            </Row>
        </Container>
    );
}

export default ModalContent;