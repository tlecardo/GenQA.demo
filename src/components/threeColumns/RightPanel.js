import React, { useContext } from 'react';
import AppContext from '../../context/AppContext';
import Article from '../elements/Article';
import Viz from '../elements/Viz';
import RightPanelLegend from './RightPanelLegend';

function RightPanel(props) {

    const { state } = useContext(AppContext);

    return (
        <>
            <div id="text_dataviz">{state.language.vizText()}</div>
            <Viz dataviz={props.dataviz}/>
            <Article article={props.article}/>
            <hr />
            <RightPanelLegend 
                globalStatus={props.globalStatus}
                color={props.color}/>
        </>
    );
}

export default RightPanel;