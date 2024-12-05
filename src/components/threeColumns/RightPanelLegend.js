import React, { useContext } from 'react';
import AppContext from '../../context/AppContext';

function RightPanelLegend(props) {

    const { state } = useContext(AppContext);

    let globalStatus = props.globalStatus
    let color = props.color

    let cur_color = globalStatus.specialKey["R"].value ? color["select"] :
        globalStatus.specialKey["G"].value ? color["all"] :
            globalStatus.view.value >= 1 ? color["local"] :
                color["global"]

    let cur_text = globalStatus.specialKey["R"].value ? state.language.selectCouplesText() :
        globalStatus.specialKey["G"].value ? state.language.distribAllText() :
            globalStatus.view.value >= 1 ? state.language.coupleCueText() :
                state.language.distribCuesText()

    if (globalStatus.cluster.value === globalStatus.cluster.max + 1 & globalStatus.view.value === 0) {
        cur_color = color["select"]
        cur_text = state.language.selectCouplesText()
    }

    return (
        <>
            <div id="legendRight">
                <svg viewBox="0 0 100 10">
                    <rect
                        x="1"
                        y="1"
                        width="8"
                        height="6"
                        rx="0.6"
                        fill={cur_color.replace("#", 0.3)}
                        stroke="grey"
                        strokeWidth="0.1" />
                    <text
                        x="12"
                        y="5.5"
                        fontSize="4"
                        textAnchor="start">
                        {cur_text}
                    </text>
                </svg>
            </div>
        </>
    );
}

export default RightPanelLegend;