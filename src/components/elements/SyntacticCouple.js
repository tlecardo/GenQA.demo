import React from 'react';

function SyntacticCouple(props) {

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

    return (
        <div
            data-question-text={row.question}
            style={{
                cursor: 'pointer',
                fontWeight: props.isCurrent > 0 ? 700 : (nbQsSelected ? 500 : "normal"),
                border: props.isCurrent & !isDetailled ? "3px solid rgba(0, 255, 0, 0.4)" : null,
                color: (nbQsSelected > 0 | props.isCurrent) ? "#000000" : "#999999"
            }}>
            <span
                onClick={props.onClick}
                onDoubleClick={props.onDoubleClick}
            >
                {nbQsSelected === row.diff_word[0][1].length ? "\u2714 " : (nbQsSelected > 0 ? "\u2756 " : "\u2716 ")}
            </span>
            <span
                key={text}
                className={"sentence"} 
                onClick={props.onClick}
                onDoubleClick={props.onDoubleClick}
                dangerouslySetInnerHTML={{ __html: text }}
            />
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
                                    onClick={ () => { 
                                        globalStatus.subquestion.update(idx);
                                    }}
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

export default SyntacticCouple;