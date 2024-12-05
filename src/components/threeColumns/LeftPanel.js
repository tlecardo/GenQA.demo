import React, { useContext } from 'react';
import AppContext from '../../context/AppContext';
import { ProgressBar } from 'react-bootstrap';

function LeftPanel(props) {

    const { state } = useContext(AppContext);

    let globalStatus = props.globalStatus
    let color = props.color

    let nb_quest_patterns = state.questions.clusters.map(x => (x.diff_word === null || x.diff_word.length === 0) ? 1 : x.diff_word[0][1].length)
    let nb_questions = nb_quest_patterns.reduce((acc, nb) => acc + nb, 0)


    let nbSelecQs = globalStatus.selectedQuestion.value.length
    /*
    let nbSelecQs = state.questions.clusters.filter(x => globalStatus.selectedQuestion.value.includes(x.question))
        .map(x => (x.diff_word === null || x.diff_word.length === 0) ? 1 : x.diff_word[0][1].length)
        .reduce((acc, nb) => acc + nb, 0)
    */
    let color_bar = "white"
    let color_bck_bar = "white"

    let statusBarStyle = { textAlign: "center", fontSize: "11px", weight: "normal" }

    let cur_color = globalStatus.specialKey["R"].value ? color["select"] :
        globalStatus.specialKey["G"].value ? color["all"] :
            "rgba(149, 149, 149, #)"

    if (globalStatus.cluster.value === globalStatus.cluster.max + 1) {
        statusBarStyle = { textAlign: "center", fontSize: "12px", fontWeight: "bold" }
        cur_color = color["select"]
        color_bar = "black"
    } else if (globalStatus.specialKey["G"].value) {
        color_bck_bar = color["all"]
    }

    let node = document.querySelector(".selected-bar.progress")
    if (node != null) {
        node.setAttribute("style", node.style.cssText.split("background-color")[0])
        node.setAttribute("style", node.style.cssText + `background-color: ${color_bck_bar.replace("#", 0.3)}!important;`)
    }

    node = document.querySelector(".selected-bar .bg-secondary.progress-bar")
    if (node != null) {
        node.setAttribute("style", node.style.cssText.split("background-color")[0])
        node.setAttribute("style", node.style.cssText + `background-color: ${cur_color.replace("#", 0.5)}!important;`)
    }

    return (
        <>
            <div style={{ textAlign: "center", fontSize: "20px" }}>
                Clusters
            </div>
            <div id="scatter" />
            <hr />
            <div
                style={{
                    cursor: "pointer",
                    paddingTop: "0.2rem",
                    borderLeft: `0.1rem solid ${color_bar}`,
                    borderBottom: `0.1rem solid ${color_bar}`,
                    borderTop: `0.1rem solid ${color_bar}`,
                    paddingRight: "0.2rem",
                    paddingLeft: "0.2rem",
                    borderTopLeftRadius: "10px",
                    borderBottomLeftRadius: "10px"
                }}
            >
                <div style={{ marginRight: "5%", marginLeft: "5%" }}>
                    <ProgressBar
                        className="selected-bar"
                        variant="secondary"
                        now={100 * nbSelecQs / nb_questions}
                        width="90%"
                    />
                </div>
                <div id="textBar" style={statusBarStyle}>
                    {state.language.selectNumberQText(nbSelecQs)}
                </div>
            </div>
        </>
    );
}

export default LeftPanel;