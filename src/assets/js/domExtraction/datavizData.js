import { TYPE_CHART } from "../types/types"
import { Extractor } from "./extractor.js";

class DatavizData {

    constructor(text, data, src) {

        let postData = []

        if (src === "RC") {
            // RC
            postData = data.replaceAll('"', "").replaceAll(",", ".").trim().split("\\n")
            postData = postData.map(x => x.split("\\t"))
        } else {
            // CBC
            postData = data.replaceAll('"', "").trim().split("\\n")
            postData = postData.map( x => x.split(/\t|\n/).length === 1 ? x.split(/,/) : x.replaceAll(",", ".").split(/\t|\n/)).slice(0,-1)
        }

        const parser = new DOMParser();
        this.htmlDoc = parser.parseFromString(text, "text/html")
        this.extractor = new Extractor(this.htmlDoc, text, postData)

        if (this.htmlDoc.querySelector(".lines") !== null) {
            this.type = TYPE_CHART.LINE
        } else if (this.htmlDoc.querySelector(".columns") !== null) {
            this.type = TYPE_CHART.BAR_VERTICAL
        } else if (this.htmlDoc.querySelector(".pie") !== null) {
            this.type = TYPE_CHART.PIE
        } else if (this.htmlDoc.querySelector(".bc-groups") !== null) {
            this.type = TYPE_CHART.BAR_HORIZON
        }

        this.metadata = this.extractor.metadata(this.type)
    }

    getAxis() {
        switch (this.type) {
            case TYPE_CHART.LINE:
            case TYPE_CHART.BAR_VERTICAL:
                this.axisData = this.extractor.axis()
                return this.axisData
            case TYPE_CHART.BAR_HORIZON:
                this.axisData = this.extractor.axisBar()
                return this.axisData
            case TYPE_CHART.PIE:
                this.axisData = this.extractor.axisPie()
                return this.axisData
            default:
                return null
        }
    }

    getLegend() {
        return this.extractor.addLegend(this.data)
    }

    getData() {
        switch (this.type) {
            case TYPE_CHART.LINE:
                this.data = this.extractor.lines(this.axisData["horizontal"].type, this.axisData["vertical"].type);
                return this.data;
            case TYPE_CHART.BAR_VERTICAL:
                this.data = this.extractor.barData(this.axisData["horizontal"].type, this.axisData["vertical"].type);
                return this.data;
            case TYPE_CHART.BAR_HORIZON:
                this.data = this.extractor.rows(this.axisData["horizontal"].type);
                return this.data;
            case TYPE_CHART.PIE:
                this.data = this.extractor.pie();
                return this.data;
            default:
                this.data = null
                return this.data
        }
    }

    extractData() {
        let values = null;
        let label = null;
        switch (this.type) {
            case TYPE_CHART.PIE:
                let x_label = this.axisData["horizontal"].text
                let y_label = this.axisData["vertical"].text

                return this.data[0].data.map(x => {
                    let obj = {};
                    obj[x_label] = x.name;
                    obj[y_label] = x.value;
                    obj["color"] = x.color;
                    return obj
                })
            case TYPE_CHART.LINE:
            case TYPE_CHART.BAR_VERTICAL:
                values = this.axisData["horizontal"].values;
                label = this.axisData["horizontal"].text;
                break;
            case TYPE_CHART.BAR_HORIZON:
                values = this.axisData["vertical"].values;
                label = this.axisData["vertical"].text;
                break;
            default:
                break;
        }

        return [...values].map((val, index) => {
            let local_data = {}
            local_data[label] = values[index]
            for (let row of this.data) local_data[row.label] = row.data[index].value
            return local_data
        })
    }
}

export default DatavizData;