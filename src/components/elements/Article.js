import React from 'react';

function Article(props) {
    return (
        <>
            <div id="text_article">Article</div>
            <div id="clueArticle" style={{ fontSize: "10px", textAlign: "justify" }}>
                {"'"}
                <span style={{ color: "#505050" }} dangerouslySetInnerHTML={{ __html: props.article }}></span>
                {"'"}
            </div>
        </>
    )
}

export default Article