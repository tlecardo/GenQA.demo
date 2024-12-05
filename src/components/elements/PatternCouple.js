import * as d3 from 'd3';
import React, { useState } from 'react';

function focusScroll(item) {
    let node = document.querySelector(`[data-question-text="${item}"]`)
    if (node) {
        node.scrollIntoView({ behavior: 'smooth', block: 'center', inline: 'center' })
    }
}

function PatternCouple(props) {

    const [questionIndex, changeQuestionIndex] = useState(0)

    let row = props.row
    let isDetailled = props.isDetailled
    let globalStatus = props.globalStatus

    let text = row.question

    let questions = Array.from({ length: row.diff_word[0][1].length }, () => `${row.question}`.split(" "))
    let split_sentence = row.question.split(" ")

    let _ = [...row.diff_word].forEach(diff => split_sentence[diff[0]] = `<span style="font-style: italic">${diff[1][0]}</span>`)
    text = split_sentence.join(" ") + " - " + row.diff_word[0][1].length + " Qs -"

    for (let idx_qst in row.diff_word[0][1]) {
        for (let idx_word in row.diff_word) {
            let nw_word = row.diff_word[idx_word][1][idx_qst]
            questions[idx_qst][row.diff_word[idx_word][0]] = nw_word
        }
    }

    let nbQsSelected = questions.filter(value => globalStatus.selectedQuestion.value.includes(value.join(" "))).length

    if (globalStatus.view.value === 2 & props.isCurrent) {
        globalStatus.addSubQuestionStatus(questionIndex, changeQuestionIndex, { nb_subquestions: row.diff_word[0][1].length })
        d3.select("body")
            .on("keydown", input => {
                switch (input.key) {
                    case "r":
                        globalStatus.pressKey("R")
                        break;
                    case "g":
                        globalStatus.pressKey("G")
                        break;
                    case "ArrowLeft":
                        globalStatus.view.update(1)
                        globalStatus.subquestion.update(0)
                        break
                    case "ArrowDown":
                        globalStatus.changeSubQuestion("next")
                        focusScroll(questions[globalStatus.subquestion.value].join(" "))
                        break
                    case "ArrowUp":
                        globalStatus.changeSubQuestion("prev")
                        focusScroll(questions[globalStatus.subquestion.value].join(" "))
                        break
                    case "Enter":
                    case " ":
                        let question = questions[globalStatus.subquestion.value].join(" ")
                        globalStatus.changeSelecQ([question])
                        break
                    default:
                        break
                }
            })
    }

    return (
        <div
            data-question-text={row.question}
            onClick={props.onClick}
            style={{
                cursor: 'pointer',
                fontWeight: props.isCurrent > 0 ? 700 : (nbQsSelected ? 500 : "normal"),
                border: props.isCurrent & !isDetailled ? "3px solid rgba(0, 255, 0, 0.4)" : null,
                color: (nbQsSelected > 0 | props.isCurrent) ? "#000000" : "#999999"
            }}>
            <span>
                {nbQsSelected === row.diff_word[0][1].length ? "\u2714 " : (nbQsSelected > 0 ? "\u2756 " : "\u2716 ")}
            </span>
            <span className={"sentence"} dangerouslySetInnerHTML={{ __html: text }} />

            {isDetailled ?
                <div 
                style={{ 
                    borderLeft: "3px solid #999999",
                    marginLeft: "10px",
                    paddingLeft: "5px"
                    }}>
                    {
                        questions.map((val, idx) => {
                            let question = val.join(" ")
                            let isSelected = globalStatus.selectedQuestion.value.includes(question)

                            return (
                                <div
                                    data-question-text={question}
                                    className={"subsentence"}
                                    style={{
                                        cursor: 'pointer',
                                        fontWeight: globalStatus.subquestion.value === idx ? 700 : (isSelected ? 500 : "normal"),
                                        border: globalStatus.subquestion.value === idx ? "3px solid rgba(0, 255, 0, 0.4)" : null,
                                        color: (isSelected | globalStatus.subquestion.value === idx) ? "#000000" : "#999999"
                                    }}
                                >
                                    <span>
                                        {isSelected ? "\u2714 " : "\u2716 "}
                                    </span>
                                    <span dangerouslySetInnerHTML={{ __html: val.join(" ") }} />
                                    <p style={{
                                        marginLeft: "15px",
                                        marginBottom: "0px",
                                    }}>
                                        {"\u27A5 " + row.answer[idx]}
                                    </p>
                                </div>
                            )
                        })
                    }
                </div>
                :
                <></>
            }
        </div>
    );
}

export default PatternCouple;