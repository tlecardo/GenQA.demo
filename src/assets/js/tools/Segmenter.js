import * as Order from "../types/orders"

class Segmenter {

    OPEN = "["
    CLOSE = "]"

    constructor(list_segs) {
        this.data = list_segs
    }

    computeDiscret() {

        let dict_vals = {}
        for (let i in this.data) {
            for (let val = this.data[i][0]; val <= this.data[i][1]; val++) {
                if (Object.keys(dict_vals).includes(`${val}`)) {
                    dict_vals[val]++
                } else {
                    dict_vals[val] = 1
                }
            }
        }

        let segs = []
        for (const [key, value] of Object.entries(dict_vals)) {
            segs.push({"freq" : value, "seg" : [key, key]})
        }

        segs = [...segs].sort(Order.segmentBalise)

        return segs
    }

    compute() {

        let data_segs = new Set()
        let nb_close = 1
        let segs = []

        for (let seg of this.data) {
            data_segs.add([seg[0], this.OPEN])
            data_segs.add([seg[1], this.CLOSE])
        }
        data_segs = [...data_segs].sort(Order.segment)
    
        let prec_seg = data_segs[0]
        for (let cur_seg of data_segs.slice(1)) {
            if (cur_seg[1] === this.OPEN) {
                if (nb_close !== 0) segs.push({"freq" : nb_close, "seg" : [cur_seg[0], prec_seg[0]]})
                nb_close -= 1
            } else {
                if (nb_close !== 0) segs.push({"freq" : nb_close, "seg" : [cur_seg[0], prec_seg[0]]})
                nb_close += 1
            }
            prec_seg = cur_seg
        }

        segs = [...segs].sort(Order.segmentBalise)

        return segs
    }
}

export { Segmenter };