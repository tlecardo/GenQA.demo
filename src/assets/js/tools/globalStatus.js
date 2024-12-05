class GlobalStatus {

    /**
     * 
     */
    constructor() {
        this.question = {}
        this.cluster = {}
        this.view = {}
        this.selectedQuestion = {}
        this.specialKey = {}
        this.subquestion = {}
    }


    addKey(key, curVal, changeValue, opts) {
        this.specialKey[key] = {}
        this.specialKey[key]["value"] = curVal
        this.specialKey[key]["update"] = changeValue
        this.specialKey[key]["inverse"] = () => { changeValue(!this.specialKey[key]["value"]) }
    }

    /**
     * 
     * @param {*} curValue 
     * @param {*} changeValue 
     * @param {Object} opts 
     */
    addSelectedQuestionStatus(curValue, changeValue, opts) {
        this.selectedQuestion["value"] = curValue
        this.selectedQuestion["update"] = changeValue
        this.selectedQuestion["add"] = item => changeValue([...new Set([...curValue, ...item])])
        this.selectedQuestion["remove"] = item => changeValue(curValue.filter(x => !item.includes(x)))

    }

    /**
     * 
     * @param {*} curValue 
     * @param {*} changeValue 
     * @param {Object} opts 
     */
    addQuestionStatus(curValue, changeValue, opts) {
        this.question["value"] = curValue
        this.question["next"] = () => { if (curValue < opts["nb_questions"] - 1) changeValue(curValue + 1) }
        this.question["prev"] = () => { if (curValue !== 0) changeValue(curValue - 1) }
        this.question["update"] = changeValue
        this.question["reload"] = () => { changeValue(0); changeValue(curValue); }
    }

    /**
     * 
     * @param {*} curValue 
     * @param {*} changeValue 
     * @param {Object} opts 
     */
    addSubQuestionStatus(curValue, changeValue, opts) {
        this.subquestion["value"] = curValue
        this.subquestion["next"] = () => { if (curValue < opts["nb_subquestions"] - 1) changeValue(curValue + 1) }
        this.subquestion["prev"] = () => { if (curValue !== 0) changeValue(curValue - 1) }
        this.subquestion["update"] = changeValue
        this.subquestion["reload"] = () => { changeValue(0); changeValue(curValue); }
    }

    /**
     * 
     * @param {*} curValue 
     * @param {*} changeValue 
     * @param {Object} opts 
     */
    addClusterStatus(curValue, changeValue, opts) {
        this.cluster["value"] = curValue
        this.cluster["min"] = opts["min_cluster"]
        this.cluster["max"] = opts["max_cluster"]
        this.cluster["next"] = () => { if (curValue !== opts["max_cluster"] + 1) changeValue(curValue + 1) }
        this.cluster["prev"] = () => { if (curValue !== opts["min_cluster"]) changeValue(curValue - 1) }
        this.cluster["reload"] = () => { changeValue(0); changeValue(curValue); }
        this.cluster["update"] = changeValue
    }

    /**
     * 
     * @param {*} curValue 
     * @param {*} changeValue 
     * @param {Object} opts 
     */
    addViewStatus(curValue, changeValue, opts) {
        this.view["value"] = curValue
        this.view["next"] = () => { if (curValue !== 0) changeValue(curValue - 1) }
        this.view["prev"] = () => { if (curValue !== 2) changeValue(curValue + 1) }
        this.view["reload"] = () => { changeValue(1 - curValue); changeValue(curValue); }
        this.view["update"] = changeValue
    }

    /**
     * 
     */
    reload() {
        this.question.reload()
        this.cluster.reload()
        this.view.reload()
    }

    /**
     * Increment current question on direction
     * 
     * @param {String} direction - incremental direction
     */
    changeQuestion(direction) {
        switch (this.view.value) {
            case 0:
                this.cluster[direction]()
                break
            case 1:
                this.question[direction]()
                break
            default:
        }
    }

    /**
     * Increment current subquestion on direction
     * 
     * @param {String} direction - incremental direction
     */
    changeSubQuestion(direction) {
        switch (this.view.value) {
            case 2:
                this.subquestion[direction]()
                break
            default:
        }
    }

    /**
     * 
     * @param {str} key 
     */
    pressKey(key) {
        if (!this.specialKey[key].value) {
            this.specialKey[key].update(true)
        }
        
    }

    /**
     * 
     * @param {str} key 
     */
    releaseKey(key) {
        if (this.specialKey[key].value) {
            this.specialKey[key].update(false)
        }
    }


    /**
     * Increment current view on direction
     * 
     * @param {*} direction - incremental direction
     */
    changeView(direction) {
        if (this.view.value === 0) this.question.update(0)
        this.view[direction]()
    }

    /**
     * 
     * @param {*} items 
     * @param {*} item 
     */
    changeSelecQ(items) {
        if (this.selectedQuestion.value.includes(items[0])) this.selectedQuestion.remove(items)
        else this.selectedQuestion.add(items)
    }

    /*
    changeSelecQ(items, item) {
        switch (this.view.value) {
            case 0:
                if (this.selectedQuestion.value.includes(items[0])) this.selectedQuestion.remove(items)
                else this.selectedQuestion.add(items)
                break
            case 1:
            case 2:
                if (this.selectedQuestion.value.includes(item)) this.selectedQuestion.remove(item)
                else this.selectedQuestion.add(item)
                break
            default:
        }
    }
    */
}

export default GlobalStatus