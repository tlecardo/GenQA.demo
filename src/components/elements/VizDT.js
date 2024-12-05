import React, { useContext, useEffect } from 'react';
import AppContext from '../../context/AppContext';

import ReactEcharts from "echarts-for-react"; 


function VizDT(props) {
    const { api } = useContext(AppContext);

    useEffect(() => api.displayImage(props.id, `canvas${props.local}`), [props, api]);
    return (<canvas id={`canvas${props.local}`} />)

    return <ReactEcharts option={props.option} />;
}

export default VizDT