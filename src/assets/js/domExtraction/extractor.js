import { TYPE_DATA } from "../types/types"
import CustomDate from "../types/CustomDate";

let convert_month = {
    "Janvier": "January",
    "Fevrier": "February",
    "Mars": "March",
    "Avril": "April",
    "Mai": "May",
    "Juin": "June",
    "Juillet": "July",
    "Aout": "August",
    "Septembre": "September",
    "Octobre": "October",
    "Novembre": "November",
    "Decembre": "December",
}

export class Extractor {

    constructor(dom, text, data) {
        this.document = dom;
        this.text = text;
        this.data = { hasTitle: isNaN(+data[0][1]) };
        // unsorted data (croiss or decrois)
        this.data["data"] = data
        // data without header
        this.data["subData"] = data.slice(this.data.hasTitle);
    }

    reverseDataOrder() {
        this.data.subData.reverse()
        this.data.data.slice(this.data.hasTitle).reverse()
    }

    convert(data, type) {
        let clrData = data.trim().replaceAll("\"", "")

        switch (type) {
            case TYPE_DATA.DATETIME:
                clrData = clrData.normalize("NFD").replace(/[\u0300-\u036f]/g, "")
                for (const [key, value] of Object.entries(convert_month)) clrData = clrData.replace(key, value)
                // to be verified
                return new CustomDate(clrData)
            case TYPE_DATA.NUMBER:
                return +clrData.replaceAll(/[A-Za-z]/g, "").replaceAll("\xa0", "").replace(",", ".").replace("−", "-");
            case TYPE_DATA.PROPORTION:
                return +clrData.replace("%", "").replace(",", ".").replace("−", "-")
            default:
                return clrData
        }
    }

    getType(data, type, text = "") {
        if (data.includes("%") || text.includes("%")) return TYPE_DATA.PROPORTION
        else if (data.length === 4 && type === TYPE_DATA.NUMBER) return TYPE_DATA.DATETIME
        return type
    }

    colorCode(code) {
        if (Array.isArray(code)) {
            return code.reduce((acc, val) => {
                var hex = val.toString(16);
                return acc + (hex.length === 1 ? "0" + hex : hex);
            }, "#")
        } else if (typeof code === "string" && code.includes("rgb")) {
            let getCode = code.match(/rgba?\((\d{1,3}), ?(\d{1,3}), ?(\d{1,3})\)?(?:, ?(\d(?:\.\d?))\))?/)
            let rgbValue = [getCode[1], getCode[2], getCode[3]].map(x => Number(x));
            return this.colorCode(rgbValue)
        } else if (typeof code === "string") {
            return code.toLowerCase()
        }
        return code
    }

    getEndText(node) {
        if (!node) return ""
        else if (node.childNodes.length === 0) return node.textContent

        return [...node.childNodes].reduce((acc, child) => {
            acc += " " + this.getEndText(child);
            return acc;
        }, "").trim()
    }

    metadata(type = null) {
        
        const metadata = {
            title: this.document.querySelector("#header .headline-block .block-inner").innerText,
            type: type,
            subtitle: null,
            source: null,
            url: this.text.match(/https:\/\/datawrapper.dwcdn.net\/[0-9a-zA-Z]*/g)[0]
        }

        try {
            metadata['source'] = this.document.querySelector("#footer .footer-left .source").innerText;
        } catch { }
        try {
            metadata['author'] = this.document.querySelector("#footer .footer-block .byline-content").innerText;
        } catch { }
        try {
            metadata['subtitle'] = this.document.querySelector("#header .description-block .block-inner").innerText;
        } catch { }
        return metadata
    }

    axisPie() {

        let type = this.getType(this.data.subData[0][0], TYPE_DATA.NUMBER)
        let xData = this.data.subData.map(x => this.convert(x[1], type))

        return {
            vertical: {
                text: this.data.hasTitle ? this.data.data[0][1] : "",
                type: type,
                min: Math.min(...xData),
                max: Math.min(...xData),
                orientation: "vertical"
            }, horizontal: {
                text: this.data.hasTitle ? this.data.data[0][0] : "",
                type: TYPE_DATA.CATEGORICAL,
                values: this.data.subData.map(x => x[0]),
                orientation: "horizontal"
            }
        }
    }

    axisBar() {

        let iterList = Array.from({ length: this.data.data[0].length - 1 }, (_, i) => i + 1)

        let data = {
            horizontal: {
                text: this.data.hasTitle ? this.data.data[0][1] : "",
                values: [],
                min: 0, max: Math.max(...iterList.map(i => Math.max(...this.data.subData.map(x => +x[i])))),
                orientation: "horizontal"
            },
            vertical: {
                text: this.data.hasTitle ? this.data.data[0][0] : "",
                type: TYPE_DATA.CATEGORICAL,
                values: this.data.subData.map(x => x[0]),
                orientation: "vertical"
            }
        }

        data["horizontal"].min = Math.min(...data["horizontal"].values)
        data["horizontal"].max = Math.max(...data["horizontal"].values)

        return data
    }

    barData(xType, yType = TYPE_DATA.NUMBER) {
        // couleurs
        let nodesBars = this.document.querySelector("g.columns").children[0];
        let colorNodes = nodesBars.hasChildNodes() ? nodesBars.querySelectorAll("rect") : [nodesBars]

        let barsData = [...colorNodes].map((item, index) => {
            let colorCode = item.hasAttribute("fill") ? item.getAttribute("fill") : item.getAttribute("style");
            let color = this.colorCode(colorCode)
            return { color: color, data: this.data.subData.map(x => Object({ value: this.convert(x[1 + index], yType), color: color })) }
        })
        return barsData
    }

    addLegend(data) {

        let legend = this.document.querySelectorAll(`div[class*="swatch"]`)

        if (legend.length === 0) return data

        let colorInfo = {}
        Array.from(legend).forEach(x => colorInfo[this.colorCode(x.innerHTML)] = this.getEndText(x))

        data.forEach(d => { d["text"] = colorInfo[d["color"]] })
        return data
    }

    lines(xType = null, yType = null) {

        let linesData = [...this.document.querySelector("g.lines").childNodes].map((node, i) => {
            let item = node.children[0]
            let arrayText = item.getAttribute("aria-datavaluearray")
            let color = this.colorCode(item.getAttribute("style"))

            let dataS = [...this.data.data[1]].slice(1).map((e, i) =>
                this.data.subData.map(x => Object({ value: this.convert(x[i + 1], yType), color: color })))

            // link color with data
            let index = 0
            let currentLast = 0
            dataS.forEach((row, i) => {
                let len = arrayText.lastIndexOf(row[row.length - 1].value)
                if (len > currentLast) {
                    index = i
                    currentLast = len
                }
            })

            return {
                text: item.getAttribute("aria-label"),
                data: dataS[index],
                color: color,
                label: item.getAttribute("aria-label").match(/(?:"[^"]*"|^[^"]*$)/)[0].replace(/"/g, "")
            }
        })

        return linesData
    }

    pie() {

        let nodesColor = this.document.querySelectorAll("path.slice-path");
        let type = this.getType(this.data.subData[0][1], TYPE_DATA.NUMBER)

        let data = [...nodesColor].map((colorNode, index) => {
            return {
                value: this.convert(this.data.subData[index][1], type),
                color: this.colorCode(colorNode.getAttribute("fill")),
                name: this.data.subData[index][0]
            }
        })

        return [{ data: data, type: type, text: "", label: "" }]
    }

    rows(xType = TYPE_DATA.NUMBER) {

        let bars = this.document.querySelectorAll(".bc-bars")
        let data_nb = bars[0].children.length
        let data = [...Array(data_nb)].map(() => Object({ data: [], color: "" }))

        let first_bars = this.document.querySelector(".bc-row.first-row")
        let bars_prop = first_bars.querySelectorAll('.bc-bars * [data-column]')

        bars_prop.forEach((first_row, index) => {
            data[index].color = this.colorCode(first_row.getAttribute("style"))
            data[index].text = first_row.getAttribute("data-column")
        })

        // unique row
        if (data[0].color === "") data[0].color = this.colorCode(this.document.querySelector("div.bc-bar-inner.dw-rect").style.background);

        data.forEach((d, index) => {
            data[index].data = this.data.subData.map(x => Object({ value: this.convert(x[index + 1], xType), color: d.color }))
        })

        return data
    }

    axis() {
        let axisData = {};

        let nodesLabel = []
        let xLabel = this.document.querySelector("g.x-tick-labels")
        if (xLabel) nodesLabel.push(xLabel)
        else {
            let xticks = Array.from(this.document.querySelectorAll("div.label.series"))
            let preType = !isNaN(Number(this.getEndText(xticks[0]))) ? TYPE_DATA.NUMBER : TYPE_DATA.CATEGORICAL;
            let type = this.getType(this.data.subData[0][0], preType)
            let xData = this.data.subData.map(x => this.convert(x[0], type))

            axisData["horizontal"] = {
                text: this.data.hasTitle ? this.data.data[0][0] : "",
                type: type,
                min: type === TYPE_DATA.NUMBER || type === TYPE_DATA.DATETIME ? Math.min(...xData) : null,
                max: type === TYPE_DATA.NUMBER || type === TYPE_DATA.DATETIME ? Math.max(...xData) : null,
                values: xData,
                orientation: "horizontal"
            }
        }

        nodesLabel.push(this.document.querySelector("g.y-tick-labels"))

        nodesLabel.forEach(element => {
            const axis = {
                text: element.getAttribute("aria-label"),
                type: element.getAttribute("aria-datatype"),
                min: element.getAttribute("aria-valuemin"),
                max: element.getAttribute("aria-valuemax"),
                orientation: element.getAttribute("aria-orientation")
            }

            if (axis.orientation === "horizontal") {
                axis["values"] = this.data.subData.map(x => this.convert(x[0], axis.type))
                
                if ((axis.type === TYPE_DATA.DATETIME && axis.values[0].normalizedDate > axis.values[axis.values.length - 1].normalizedDate)
                    || axis.values[0] > axis.values[axis.values.length - 1]) {
                    axis["values"].reverse()
                    this.reverseDataOrder()
                }
            }

            axis.type = this.getType(axis.max, axis.type, axis.text)
            axis.min = this.convert(axis.min, axis.type)
            axis.max = this.convert(axis.max, axis.type)

            axisData[axis.orientation] = axis
        })

        return axisData
    }
}