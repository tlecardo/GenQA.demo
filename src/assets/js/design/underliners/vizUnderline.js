import { useContext } from 'react';
import AppContext from '../../../../context/AppContext';
import { TYPE_CHART, TYPE_DATA } from '../../types/types';
import CustomDate from '../../types/CustomDate'

import { Segmenter } from "../../tools/Segmenter"

let convertColor = function (hexaColor) {
    hexaColor = hexaColor.replace("#", "")
    var aRgbHex = hexaColor.match(/.{1,2}/g);
    var aRgb = [
        parseInt(aRgbHex[0], 16),
        parseInt(aRgbHex[1], 16),
        parseInt(aRgbHex[2], 16)
    ];

    return `${aRgb[0]}, ${aRgb[1]}, ${aRgb[2]}`
}

class VizUnderline {
    state = useContext(AppContext).state;
    options = { series: [] }

    /**
     * Initialize object
     * @param {HTMLElement} node 
     */
    constructor(nb, type) {
        this.max_items = nb
        this.type = type
        this.data_seg = []
        this.attr_seg = []
        this.#initializeOptions()
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
            }
        })

        for (let idx_qst in row.diff_word[0][1]) {
            for (let idx_word in row.diff_word) {
                let nw_word = row.diff_word[idx_word][1][idx_qst]
                nw_rows[idx_qst].question[row.diff_word[idx_word][0]] = nw_word
            }
        }

        nw_rows.forEach(x => x.question = x.question.join(" "))

        return nw_rows
    }


    getOptions() {
        return this.options
    }

    /**
     * Add number of rows
     * @param {integer} nb 
     */
    updateMaxRows(nb) {
        this.max_items = nb
    }

    addData(items, conditional_set) {
        // sub questions
        let allQ = items.flatMap(x => this.extractSubQuestions(x))

        allQ.filter(item => conditional_set ? conditional_set.includes(item.question) : true)
            .filter(item => item.src[0].type === "viz")
            .forEach(item => this.#addDataUnique(item))
    }

    /**
     * Add an underline viz segment
     * @param {dict} item 
     */
    #addDataUnique(item) {
        let dict_attr = {}

        for (let src of item.src) {
            for (let row of src.row) {
                if (!Object.keys(dict_attr).includes(row[0])) dict_attr[row[0]] = [row[1]]
                else dict_attr[row[0]].push(row[1])
            }
        }

        for (let [attr, indexes] of Object.entries(dict_attr)) {
            if (this.type === "line") {
                if (indexes.length > 1) {
                    this.data_seg.push([
                        Math.max(Math.min(...indexes) - 1, 0),
                        Math.min(Math.max(...indexes) + 1, this.max_items - 1)
                    ])
                    this.attr_seg.push(attr)
                } else {
                    this.data_seg.push([Math.max(indexes[0] - 1, 0), Math.min(indexes[0] + 1, this.max_items - 1)])
                    this.attr_seg.push(attr)
                }
            } else {
                indexes.sort()
                indexes = [...new Set(indexes)]

                if (indexes.length === 2) {
                    this.data_seg.push([Math.min(...indexes), Math.max(...indexes)])
                    this.attr_seg.push(attr)
                } else {
                    let cur_start = indexes[0]
                    let cur_val = indexes[0]
                    for (let val of indexes.slice(1)) {
                        if (val !== cur_val + 1) {
                            this.data_seg.push([cur_start, cur_val])
                            this.attr_seg.push(attr)
                            cur_start = val
                        }
                        cur_val = val
                    }
                    this.data_seg.push([cur_start, cur_val])
                    this.attr_seg.push(attr)
                }
            }
        }
    }

    /**
     * Compute a new dataviz with data elements
     * @returns dataviz options
     */
    computeCoverage(opts) {
        switch (this.type) {
            case TYPE_CHART.LINE:
                return this.#computeCoverageLine(opts)
            case TYPE_CHART.BAR_VERTICAL:
                return this.#computeCoverageBarV(opts)
            case TYPE_CHART.PIE:
                return this.#computeCoveragePie(opts)
            default:
                return null
        }
    }

    /**
    * Compute a new dataviz with data elements if it is a pie chart
    * @returns dataviz opts
    */
    #computeCoveragePie(opts) {
        let attr_data = {}
        for (let i in this.attr_seg) {
            let attr = this.attr_seg[i]
            let data = this.data_seg[i]
            if (Object.keys(attr_data).includes(attr)) attr_data[attr].push(data)
            else attr_data[attr] = [data]
        }
    }

    /**
     * Compute a new dataviz with data elements if it is a vertical bar chart
     * @returns dataviz options
     */
    #computeCoverageBarV(opts) {
        let attr_data = {}
        for (let i in this.attr_seg) {
            let attr = this.attr_seg[i]
            let data = this.data_seg[i]
            if (Object.keys(attr_data).includes(attr)) attr_data[attr].push(data)
            else attr_data[attr] = [data]
        }

        for (let cur_attr of Object.keys(attr_data)) {

            let segmenter = new Segmenter(attr_data[cur_attr])
            let attrs_optim = segmenter.computeDiscret()

            let max_freq = Math.max(...attrs_optim.map(x => x["freq"]))

            for (let seg of attrs_optim) {
                let cur_serie = this.options["series"].filter(serie => serie.name === cur_attr)[0]
                let indexRows = cur_serie ? this.options["series"].indexOf(cur_serie) : 0
                let cur_indexes = seg["seg"]
                let cur_freq = seg["freq"]

                if (!cur_indexes[0]) cur_indexes[0] = 0

                if (cur_indexes.length === 2) {
                    for (let step = cur_indexes[0]; step <= cur_indexes[1]; step++) {
                        this.options["series"][indexRows].data[step] = {
                            value: this.options["series"][indexRows].data[step],
                            itemStyle: {
                                color: this.options["series"][indexRows]["color"],
                                borderWidth: Math.min(...[50 / this.options["series"][indexRows].data.length, 10]),
                                borderColor: opts["color"].replace("#", max_freq === 1 ? 0.3 : cur_freq / (2 * max_freq)),
                            }
                        }
                    }
                } else {
                    this.options["series"][indexRows].data[cur_indexes[0]] = {
                        value: this.options["series"][indexRows].data[cur_indexes[0]],
                        itemStyle: {
                            color: this.options["series"][indexRows]["color"],
                            borderWidth: 10,
                            borderColor: opts["color"].replace("#", max_freq === 1 ? 0.3 : cur_freq / (2 * max_freq)),
                        }
                    }
                }
            }
        }

        this.options["tooltip"] = {
            trigger: 'axis',
            axisPointer: {
                type: 'shadow'
            },
            formatter: (args) => {

                let maxLength = 20
                let tooltip = `<p style="font-weight: bold">${args[0].axisValue}</p> <div style="line-height: 50%; text-align: left">`

                args.forEach(({ marker, seriesName, value }) => {
                    tooltip += `<p>${marker} ${seriesName.slice(0, maxLength - 3) + (seriesName.length > maxLength ? "..." : "")} : \t ${value}</p>`;
                });
                return tooltip + `<div/>`;
            }
        }

        return this.options
    }

    /**
     * Compute a new dataviz with data elements if it is a line chart
     * @returns dataviz options
     */
    #computeCoverageLine(opts) {

        let attr_data = {}
        for (let i in this.attr_seg) {
            let attr = this.attr_seg[i]
            let data = this.data_seg[i]
            if (Object.keys(attr_data).includes(attr)) attr_data[attr].push(data)
            else attr_data[attr] = [data]
        }

        for (let cur_attr of Object.keys(attr_data)) {

            let segmenter = new Segmenter(attr_data[cur_attr])
            let attrs_optim = segmenter.compute()

            let max_freq = Math.max(...attrs_optim.map(x => x["freq"]))
            for (let seg of attrs_optim) {
                let cur_serie = this.options["series"].filter(serie => serie.name === cur_attr)[0]
                let indexRows = this.options["series"].indexOf(cur_serie)
                let cur_indexes = seg["seg"]
                let cur_freq = seg["freq"]

                if (cur_indexes.length === 1) {
                    let markers = {
                        symbol: "circle",
                        itemStyle: {
                            color: 'rgba(0, 0, 0, 0)',
                            borderWidth: 2,
                            borderColor: 'rgba(0, 0, 0, 0.8)'
                        },
                        symbolSize: 8,
                        animation: false,
                        data: cur_indexes.map(index => { return { "coord": [this.options.xAxis.data[index], cur_serie.data[index]] } }),
                        label: { show: false }
                    }
                    cur_serie["markPoint"] = markers

                } else if (cur_indexes.length === 2) {
                    if (this.options["visualMap"] === undefined) {
                        this.options["visualMap"] = new Array(this.options["series"].length)
                    }

                    try {
                        this.options["visualMap"][indexRows]["pieces"].push({
                            label: { show: false },
                            gt: cur_indexes[0], lt: cur_indexes[1],
                            color: opts["color"].replace("#", max_freq === 1 ? 0.3 : cur_freq / (2 * max_freq))
                        })
                    } catch {
                        this.options["visualMap"][indexRows] = {
                            type: 'piecewise',
                            show: false,
                            formatter: "Elements de réponse",
                            dimension: 0,
                            padding: 20,
                            seriesIndex: indexRows,
                            pieces: [{
                                label: { show: false },
                                gt: cur_indexes[0], lt: cur_indexes[1],
                                color: opts["color"].replace("#", max_freq === 1 ? 0.3 : cur_freq / (2 * max_freq))
                            }]
                        }
                        cur_serie["areaStyle"] = {}
                    }

                    /*
                                        cur_serie["markLine"] = {
                        symbol: ['none', 'none'],
                        label: { show: false },
                        lineStyle: { color: `rgba(${convertColor(cur_serie["lineStyle"]["color"])}, 0.8)`, width: 1 },
                        animation: false,
                        data: [{ xAxis: cur_indexes[0] }, { xAxis: cur_indexes[1] }]
                    }
                    */
                }
            }
        }

        let colorRoot = opts["color"].split('#')[0]

        this.options["tooltip"] = {
            trigger: "axis",
            axisPointer: {
                axis: "x"
            },
            order: "valueDesc",
            position: ['10%'],
            formatter: (args) => {
                let maxLength = 20
                let tooltip = `<p style="font-weight: bold">${args[0].axisValue}</p><div style="line-height: 50%; text-align: left">`;

                args.forEach(({ marker, seriesName, value }) => {
                    let colorTrue = this.options.series.filter(x => x.name === seriesName)[0].lineStyle.color
                    colorTrue = convertColor(colorTrue)

                    marker = marker
                        .replace("rgba(0,0,0,0)", `rgba(${colorTrue}, 1)`)
                        .replace(colorRoot, `rgba(${colorTrue}, `)
                        .replace(/, 0\.[0-9]+\)/i, `, 1)`)

                    tooltip += `<p>${marker} ${seriesName.slice(0, maxLength - 3) + (seriesName.length > maxLength ? "..." : "")} : \t ${value}</p>`;
                });
                return tooltip + `<div/>`;
            }
        }

        return this.options
    }

    /**
     * Remove all viz segments of VizUnderline object
     */
    #removeMarks() {
        this.#initializeOptions()
        this.data_seg = []
        this.attr_seg = []
    }

    /**
     * Create a coverage on viz
     * @param {*} data 
     * @param {Object} opts - Paramaters with color and selectQuestions (optional)
     */
    coverage(data, opts) {
        this.#removeMarks()

        if (Array.isArray(data)) {
            this.addData(data, Object.keys(opts).includes("selectQuestions") ? opts["selectQuestions"] : null)
        } else {
            this.addData([data])
        }
        this.computeCoverage(opts)
    }

    /**
     * Initialize dataviz options
     */
    #initializeOptions() {

        this.options = { series: [] }
        this.options["animation"] = false

        this.options["grid"] = {
            top: 30,
            left: "15%",
            width: "75%"
        }

        if (this.state.dataParser.type !== TYPE_CHART.PIE) {

            this.options["xAxis"] = {
                type: 'category',
                data: this.state.dataParser.axisData.horizontal.values.map(x => x instanceof CustomDate ? x.get() : x)
            }

            this.options["yAxis"] = { type: 'value' }

            if (this.state.dataParser.axisData.vertical.type === TYPE_DATA.PROPORTION) {
                this.options["yAxis"]["axisLabel"] = { formatter: '{value} %' }
            }
        }

        this.options["title"] = {
            text: this.state.dataParser.metadata.title,
            left: 'center',
            top: 0,
            textStyle: {
                fontSize: 12,
                width: 300,
                overflow: "break"
            }
        }

        if (this.state.dataParser.type === TYPE_CHART.LINE) {

            this.options["series"] = this.state.dataParser.data.map(data_row => {

                return {
                    type: "line",
                    name: data_row.label,
                    showSymbol: false,

                    lineStyle: {
                        color: data_row.color,
                        width: 1
                    },

                    itemStyle: {
                        color: data_row.color
                    },

                    data: data_row.data.map(x => x.value)
                }
            })

        } else if (this.state.dataParser.type === TYPE_CHART.BAR_HORIZON || this.state.dataParser.type === TYPE_CHART.BAR_VERTICAL) {

            this.options["xAxis"]["axisTick"] = {
                alignWithLabel: true
            }

            this.options["series"] = this.state.dataParser.data.map(data_row => {
                return {
                    type: "bar",
                    name: data_row.label,
                    showSymbol: false,
                    color: data_row.color,
                    data: data_row.data.map(x => x.value)
                }
            })
        } else if (this.state.dataParser.type === TYPE_CHART.PIE) {

            let rowList = this.state.dataParser.data[0].data
            let nameList = this.state.dataParser.axisData.horizontal.values

            this.options["series"] = {
                label: { position: "inside" },
                type: 'pie',
                radius: '80%',
                data: rowList.map((row, index) => { return { value: row.value, name: nameList[index], itemStyle: { color: row.color } } })
            }
        }
    }
}

export { VizUnderline };