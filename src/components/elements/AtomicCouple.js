
function AtomicCouple(props) {

    let row = props.row

    return (
        <div
            data-question-text={row.question}
            onClick={props.onClick}
            style={{
                cursor: 'pointer',
                fontWeight: props.isCurrent > 0 ? 700 : (props.isSelected ? 500 : "normal"),
                border: props.isCurrent ? "3px solid rgba(0, 255, 0, 0.4)" : null,
                color: (props.isSelected | props.isCurrent) ? "#000000" : "#999999"
            }}>
            <span>
                {props.isSelected ? "\u2714 " : "\u2716 "}
            </span>
            <span className={"sentence"}>{row.question}</span>
            <p
                style={{
                    marginBottom: 0,
                    paddingLeft: "15px"
                }}>
                {"\u27A5 " + row.answer[0]}
            </p>
        </div>
    );
}

export default AtomicCouple;