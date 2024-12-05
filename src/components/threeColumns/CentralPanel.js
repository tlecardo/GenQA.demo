import React, { useContext } from 'react';
import AppContext from '../../context/AppContext';
import { Button } from 'react-bootstrap';

import PatternCouple from '../elements/PatternCouple';
import AtomicCouple from '../elements/AtomicCouple';
import Toaster from '../../assets/js/tools/toaster';

function CentralPanel(props) {

    const { api, state } = useContext(AppContext);

    let data = props.data
    let globalStatus = props.globalStatus

    let multiple_data = data.filter(row => row.diff_word instanceof Array && row.diff_word.length !== 0)
    let single_data = data.filter(row => !(row.diff_word instanceof Array && row.diff_word.length !== 0))

    let title = state.language.qaText()
    let buttonStyle = { textAlign: "center", visibility: "hidden", marginTop: "0", height: "0" }
    let coupleHeight = "88vh"

    if (globalStatus.cluster.value === globalStatus.cluster.max + 1) {
        title = state.language.selectQText()
        buttonStyle = { textAlign: "center", visibility: "visible", marginTop: "0.5rem", height: null }
        coupleHeight = "80vh"
    }

    return (
        <>
            <div style={{ marginBottom: "0.5rem", textAlign: "center", fontSize: "20px" }}>{title}</div>
            <div id="text_show" style={{ overflowY: "auto", height: coupleHeight, width: "100.5%", scrollbarWidth: "thin", fontSize: "10px" }}>
                {multiple_data.length > 0 ?
                    <>
                        <div className='separator'>{state.language.sepText(false)}</div>
                        {multiple_data.map((couple, index) => <PatternCouple
                            onClick={() => {
                                globalStatus.view.update(1)
                                globalStatus.question.update(index)
                            }}
                            globalStatus={globalStatus}
                            row={couple}
                            key={index}
                            isDetailled={globalStatus.question.value === index & globalStatus.view.value === 2}
                            isCurrent={globalStatus.question.value === index & globalStatus.view.value >= 1} />)
                        }
                    </>
                    :
                    <></>
                }
                {single_data.length > 0 ?
                    <>
                        <div className='separator'>{state.language.sepText(true)}</div>
                        {
                            single_data.map((couple, index) => <AtomicCouple
                                onClick={() => {
                                    globalStatus.view.update(1)
                                    globalStatus.question.update(index + multiple_data.length)
                                }}
                                row={couple}
                                key={index + multiple_data.length}
                                isDetailled={globalStatus.question.value === index + multiple_data.length & globalStatus.view.value === 2}
                                isSelected={globalStatus.selectedQuestion.value.includes(couple.question)}
                                isCurrent={globalStatus.question.value === index + multiple_data.length & globalStatus.view.value >= 1} />)
                        }
                    </>
                    :
                    <></>
                }
            </div>
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
        </>
    );
}

export default CentralPanel;