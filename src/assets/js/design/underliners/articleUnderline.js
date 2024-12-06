import { Segmenter } from "../../tools/Segmenter"

class ArticleUnderline {

    START = x => `<span style="${x}">`
    END = x => `</span>`

    /**
     * Initialize object
     * 
     * @param {String} article - Press article
     * @param {Element} node - DOM node to display article
     */
    constructor(article) {
        this.article = article
        this.HTML = ""
        this.style = null
        this.data = null
    }


    extractSubQuestions(row) {
        if (row.diff_word === null) {
            return [row]
        }
        let nw_rows = Array.from({ length: row.diff_word[0][1].length }, (v, i) => { 
            return {
                "question": `${row.question}`.split(" "),
                "answer": [row.answer[i]],
                "diff_word": null,
                "src": [row.src[i]],
                "cluster": row.cluster
            }} )
    
        for (let idx_qst in row.diff_word[0][1]) {
            for (let idx_word in row.diff_word) {
                let nw_word = row.diff_word[idx_word][1][idx_qst]
                nw_rows[idx_qst].question[row.diff_word[idx_word][0]] = nw_word
            }
        }

        nw_rows.forEach(x => x.question = x.question.join(" "))

        return nw_rows
    }

    /**
     * Add data to the object
     * 
     * @param {Array} data_rows - Set of text segments
     * @param {Array} conditional_set - Set of item displayed
     */
    eraseData(data_rows, conditional_set) {
        let allQ = data_rows.flatMap( x => this.extractSubQuestions(x))

        this.data = allQ.filter(item => item.src[0]["end"] - item.src[0]["start"] > 1)
            .filter(item => conditional_set ? conditional_set.includes(item.question) : true)
            .reduce((curSet, item) => curSet.add([item.src[0]["start"], item.src[0]["end"]]), new Set())
    }

    /**
     * Compute a new text article with HTML elements
     * 
     * @returns HTML Text
     */
    computeCoverage(opts) {

        let segs_optim = []

        if (this.data) {
            let segmenter = new Segmenter(this.data)
            segs_optim = segmenter.compute()
        }
        
        let max_freq = Math.max(...segs_optim.map(x => x["freq"]))

        let HTMLText = this.article
        let HTMLStyle = ""

        for (let seg of segs_optim) {
            let freq = seg["freq"]
            let cur_seg = seg["seg"]

            HTMLStyle = (this.style == null) ? `background-color: ${opts["color"].replace("#", freq > 1 ? freq / (2 * max_freq) : 0.3)};` : this.style
            HTMLText = HTMLText.slice(0, cur_seg[0]) + this.START(HTMLStyle) + HTMLText.slice(cur_seg[0], cur_seg[1]) + this.END() + HTMLText.slice(cur_seg[1]);
        }

        this.HTML = HTMLText
        return HTMLText
    }

    /**
     * Create a coverage on article and underline a text segment
     * @param {*} data 
     * @param {Object} opts - Paramaters with color and selectQuestions (optional)
     */
    coverage(data, opts) {
        if (data != null) {
            if (Array.isArray(data)) {
                this.eraseData(data, Object.keys(opts).includes("selectQuestions") ? opts["selectQuestions"] : null)
            } else {
                this.eraseData([data], Object.keys(opts).includes("selectQuestions") ? opts["selectQuestions"] : null)
            }
        }
        return this.computeCoverage(opts)
    }
}

export { ArticleUnderline };