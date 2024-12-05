import React, { useContext } from 'react';
import AppContext from '../../context/AppContext';

import { Button } from 'react-bootstrap';
import Toaster from '../../assets/js/tools/toaster';

function SelectedList(props) {
    const { api, state } = useContext(AppContext);

    let globalStatus = props.globalStatus
    let items = globalStatus.selectedQuestion.value


    let dict_q = {}
    for (let row of state.questions.clusters) {
        if (row.diff_word !== null) {
            let questions = Array.from({ length: row.diff_word[0][1].length }, () => `${row.question}`.split(" "))
            for (let idx_qst in row.diff_word[0][1]) {
                for (let idx_word in row.diff_word) {
                    let nw_word = row.diff_word[idx_word][1][idx_qst]
                    questions[idx_qst][row.diff_word[idx_word][0]] = nw_word
                }
            }
            questions.map(x => x.join(" ")).forEach((subquestion, idx) => dict_q[subquestion] = {
                "cluster": row.cluster,
                "answer": [row.answer[idx]],
                "diff_word": null,
                "src": row.src[idx],
                "question": subquestion
            })
        } else {
            dict_q[row.question] = { row }
        }
    }

    let allRows = items.map(x => dict_q[x])

    let buttonStyle = { textAlign: "center", visibility: "hidden", marginTop: "0", height: "0" }
    if (globalStatus.cluster.value === globalStatus.cluster.max + 1) {
        buttonStyle = { textAlign: "center", visibility: "visible", marginTop: "0.5rem", height: null }
    }


    return (
        <div id="generate_file" style={buttonStyle}>
            <Button
                variant="outline-primary"
                className="complete"
                size="sm"
                onClick={
                    () => {
                        let nw_data = api.filterQuestions(globalStatus);
                        api.generateFile(nw_data);
                        Toaster.successFile(state.id);
                    }
                }
            >{state.language.generateFileText()}</Button>
        </div>
    );
}

export default SelectedList;