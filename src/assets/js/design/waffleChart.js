import * as Order from "../types/orders"
import * as d3 from 'd3'
import tippy from 'tippy.js';
import 'tippy.js/dist/tippy.css'

let colorScaleUnselected = x => "#E5E5E5"
let colorScalePartialSelected = x => "#C0C0C0"
let colorScaleSelected = x => "#959595"

class WaffleChart {

    /**
     * Initialize object with dimension
     * @param {String} dimension 
     */
    constructor(dimension) {
        this.dim = dimension
        this.xScale = x => this.dim.delta * (x % this.dim.number);
        this.yScale = x => this.dim.delta * Math.floor(x / this.dim.number);
    }

    /**
     * Compute a representative string of topics (ie with truncations)
     * @param {Array} topics - Main topics
     * @param {Number} width_max - Number max of caracters
     * @returns 
     */
    #truncateTopics(topics, width_max = 40) {
        let topics_str = topics.slice(1).reduce((prev, cur) => prev + " * " + cur, topics[0]).toUpperCase()
        while (topics_str.length > width_max) {
            let i = topics.map(x => x.length).indexOf(Math.max(...topics.map(x => x.length)));
            topics[i] = topics[i].replace(".", "").slice(0, -3) + "."
            topics_str = topics.slice(1).reduce((prev, cur) => prev + " * " + cur, topics[0]).toUpperCase()
        }
        return topics_str
    }

    /**
     * Initialize waffleChart
     * @param {Array} data - Set of questions
     */
    initialize(data, globalStatus, language) {

        if (document.querySelector("svg#waffleChart") === null) {

            let indexes = new Set(data.clusters.map(e => e.cluster))
            let min_index = Math.min(...indexes)

            var svg = d3.select("#scatter")
                .style("text-align", "center")

            for (let cluster of indexes) {
                let data_cluster = data.clusters.filter(e => e.cluster === cluster)
                data_cluster.sort(Order.alphabetic)

                let width_max = this.dim.delta * Math.ceil(data_cluster.length / this.dim.number) + 0.1
                let topics_str = data.topics[cluster][0] // this.#truncateTopics(data.topics[cluster])

                let sub_svg = svg
                    .append("div")
                    .attr("class", "tab")
                    .style("border", `0.1rem solid ${cluster === globalStatus.cluster.value ? "black" : "white"}`)
                    .style("border-right", null)
                    .style("padding-right", "0.2rem")
                    .style("padding-left", "0.2rem")
                    .style("border-top-left-radius", "10px")
                    .style("border-bottom-left-radius", "10px")

                sub_svg.append("text")
                    .attr("id", `text-cluster${cluster}`)
                    .attr('self-align', 'center')
                    .text(language.topicLabelText(topics_str) + " (?)")
                    .style('font-size', '8px')
                    .style('cursor', 'pointer')
                    .style("font-weight", cluster === min_index ? 700 : null)
                    .on("click", function (e, d, i) {
                        globalStatus.view.update(0);
                        globalStatus.cluster.update(cluster);
                    })

                tippy(`#text-cluster${cluster}`, {
                    content: data.topics[cluster].length == 2 ? data.topics[cluster][1] : language.tooltipLabelText(data.topics[cluster][0]) ,
                    arrow: true,
                    placement: 'right',
                    duration: 0,
                    maxWidth: 200
                })

                let viz = sub_svg.append("svg")
                    .attr("id", "waffleChart")
                    .attr("viewBox", `0 0 10 ${width_max}`)
                    .attr("height", "100%")
                    .attr("width", "100%")
                    .attr("display", "block")
                    .attr("margin", "auto")
                    .append("g")
                    .attr("data-cluster", cluster)

                const i_q_square = d3.local();
                viz.selectAll("dot")
                    .data(data_cluster)
                    .enter()
                    .append("rect")
                    .attr("class", `cluster${cluster}`)
                    .attr("x", (d, i) => this.xScale(i) + 0.1)
                    .attr("y", (d, i) => this.yScale(i) + 0.1)
                    .attr("width", this.dim.size)
                    .attr("height", this.dim.size)
                    .attr("rx", 0.1)
                    .attr("ry", 0.1)
                    .attr("data-question", d => d.question)
                    .attr("data-answer", d => d.answer)
                    .attr("data-index", (d, i) => i)
                    .attr("stroke", "black")
                    .attr("stroke-width", cluster === min_index ? .05 : .01)
                    .style("fill", colorScaleUnselected(cluster))
                    .style('cursor', 'pointer')
                    .each(function (d, i) { i_q_square.set(this, i); })
                    .on("click", function (e, d, i) {
                        globalStatus.view.update(1);
                        globalStatus.cluster.update(cluster);
                        globalStatus.question.update(i_q_square.get(this));
                    })

                const i_q_text = d3.local();
                viz.selectAll("dot")
                    .data(data_cluster)
                    .enter()
                    .append("text")
                    .attr("class", `label-waffle-cluster${cluster}`)
                    .attr("x", (d, i) => this.xScale(i) + this.dim.size)
                    .attr("y", (d, i) => this.yScale(i) + this.dim.size)
                    .attr("data-question", d => d.question)
                    .style("text-anchor", "end")
                    .style("font-size", this.dim.size / 2)
                    .style('cursor', 'pointer')
                    .text(d => (d.diff_word instanceof Array && d.diff_word.length > 0) ? d.diff_word[0][1].length : "")
                    .each(function (d, i) { i_q_text.set(this, i); })
                    .on("click", function (e, d, i) {
                        globalStatus.view.update(1);
                        globalStatus.cluster.update(cluster);
                        globalStatus.question.update(i_q_text.get(this));
                    })
            }
        }
    }

    /**
     * Resize boxes of waffleChart
     * @param {Number} ratio - box size ratio
     * @param {String} question - current question
     */
    resizeBox(opts, question = null) {
        [...document.querySelectorAll((question == null) ? `rect[data-question]` : `rect[data-question="${question}"]`)]
            .forEach(node => {
                if (opts.hasOwnProperty("color")) {
                    node.style.fill = opts["color"].replace("#", 0.3)
                    node.setAttribute("stroke-width", .04)
                }
                if (question !== null) node.setAttribute("stroke-width", .05)
                node.setAttribute("width", (1 + 2 * opts["ratio"]) * this.dim.size)
                node.setAttribute("height", (1 + 2 * opts["ratio"]) * this.dim.size)
                node.setAttribute("x", this.xScale(node.getAttribute("data-index")) + 0.1 - opts["ratio"] * this.dim.size)
                node.setAttribute("y", this.yScale(node.getAttribute("data-index")) + 0.1 - opts["ratio"] * this.dim.size)
            })
    }

    /**
     * Resize boxes of waffleChart
     * @param {Number} ratio - box size ratio
     * @param {String} question - current question
     */
    resizeSelectedBox(opts) {
        [...document.querySelectorAll("[data-selected=true]")]
            .forEach(node => {
                if (opts.hasOwnProperty("color")) {
                    node.style.fill = opts["color"].replace("#", 0.5)
                } else {
                    node.style.fill = "#959595"
                }
                node.setAttribute("width", (1 + 2 * opts["ratio"]) * this.dim.size)
                node.setAttribute("height", (1 + 2 * opts["ratio"]) * this.dim.size)
                node.setAttribute("x", this.xScale(node.getAttribute("data-index")) + 0.1 - opts["ratio"] * this.dim.size)
                node.setAttribute("y", this.yScale(node.getAttribute("data-index")) + 0.1 - opts["ratio"] * this.dim.size)
            })
    }

    /**
     * Update waffleChart - Underline current question only
     * @param {String} question - current question
     */
    updateCurQuestion(question) {
        d3.select(`text[data-question="${question}"] `).style("font-weight", 700)

        this.resizeBox({ "ratio": 0 })
        this.resizeBox({ "ratio": 0.08 }, question)
    }

    /**
     * Update waffleChart - Underline current cluster
     * @param {Array} curCluster - current and last cluster
     * @param {boolean} globalView - Global (cluster) or local (question) view
     */
    updateCurCluster(curCluster, globalView) {
        d3.selectAll("[data-cluster] > *")
            .attr("stroke-width", .01)

        d3.selectAll("[data-cluster] > text")
            .style("font-weight", null)

        d3.selectAll(`[id^="text-cluster"]`)
            .style("font-weight", null)

        d3.selectAll(`div.tab:has([id^="text-cluster"])`)
            .style("border", "0.1rem solid white")
            .style("border-right", null)

        d3.selectAll(`#scatter`)
            .style("border", "0.1rem solid white")
            .style("border-right", null)

        this.resizeBox({ "ratio": 0 })

        switch (globalView) {
            case 0:
                d3.selectAll(`.cluster${curCluster}`)
                    .attr("stroke-width", .05)

                d3.selectAll(`#text-cluster${curCluster}`)
                    .style("font-weight", 700)

                d3.selectAll(`.label-waffle-cluster${curCluster}`)
                    .style("font-weight", 700)

                d3.selectAll(`div.tab:has(#text-cluster${curCluster})`)
                    .style("border", "0.1rem solid black")
                    .style("border-right", null)

                break
            case 1:
            case 2:
                d3.selectAll(`.cluster${curCluster}`)
                    .attr("stroke-width", .01)

                d3.selectAll(`.label-waffle-cluster${curCluster}`)
                    .style("font-weight", null)

                d3.selectAll(`#text-cluster${curCluster}`)
                    .style("font-weight", 700)

                d3.selectAll(`div.tab:has(#text-cluster${curCluster})`)
                    .style("border", "0.1rem solid black")
                    .style("border-right", null)

                break
            default:
        }
    }

    /**
     * Update waffleChart - Underline selected questions
     * @param {Array} data - Set of questions 
     * @param {Array} selectQuestions - Set of selected questions
     */
    updateQuestionSelect(data, selectQuestions) {
        let data_sort = data.clusters.sort(Order.alphabetic);

        let dict_q = {}
        console.log(data_sort)
        for (let row of data_sort) {
            if (row.diff_word !== null) {
                console.log(row.diff_word)
                let questions = Array.from({ length: row.diff_word[0][1].length }, () => `${row.question}`.split(" "))
                for (let idx_qst in row.diff_word[0][1]) {
                    for (let idx_word in row.diff_word) {
                        let nw_word = row.diff_word[idx_word][1][idx_qst]
                        questions[idx_qst][row.diff_word[idx_word][0]] = nw_word
                    }
                }
                questions.map(x => x.join(" ")).filter(subquestion => selectQuestions.includes(subquestion)).forEach(() => {
                    if (Object.keys(dict_q).includes(row.question)) {
                        dict_q[row.question] += 1
                    } else {
                        dict_q[row.question] = 1
                    }
                })
                if (Object.keys(dict_q).includes(row.question)) {
                    dict_q[row.question] /= row.diff_word[0][1].length
                }
            } else {
                if (selectQuestions.includes(row.question))
                    dict_q[row.question] = 1
            }
        }

        d3.selectAll("g > rect[data-question]")
            .style("fill", (d, i) => !Object.keys(dict_q).includes(data_sort[i].question) ? colorScaleUnselected(data_sort[i].cluster) :  (
                dict_q[data_sort[i].question] < 1 ? colorScalePartialSelected(data_sort[i].cluster) : colorScaleSelected(data_sort[i].cluster)))
            .attr("data-selected", (d, i) => Object.keys(dict_q).includes(data_sort[i].question))
    }
}

export { WaffleChart };