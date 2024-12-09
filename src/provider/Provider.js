import DatavizData from "../assets/js/domExtraction/datavizData";
import { ACTIONS, GEN_STATUS, TYPE_CHART } from "../assets/js/types/types"
import AppContext from "../context/AppContext";
import reducer from "../reducer/Reducer";
import loadImage from "../assets/js/tools/imageLoader";
import CustomDate from "../assets/js/types/CustomDate";
import LanguageSelector from "../assets/js/tools/languageSelector";
import { LANGUAGE } from "../assets/js/types/types";

import React, { useReducer } from "react";
import { saveAs } from 'file-saver';
import Toaster from "../assets/js/tools/toaster";


let DATAWRAPPER_SERVER_PORT = "5020"
//let ROOT_DATAWRAPPER = "https://qrgendeploydt-1063549174037.us-central1.run.app/"
let ROOT_DATAWRAPPER = `http://localhost:${DATAWRAPPER_SERVER_PORT}`
let AI_SERVER_PORT = "5030"
let PYTHON_SERVER_PORT = "5050"

function Provider({ children }) {
    // initialisation du contexte
    const [state, dispatch] = useReducer(reducer, { id: "", article: "", dataParser: null, language: new LanguageSelector(LANGUAGE.FRENCH), multiClusering: true });

    const api = {

        clear: function () {
            dispatch({ type: ACTIONS.CLEAR })
        },

        switchLanguage: function () {
            dispatch({ type: ACTIONS.SWITCH_LANG })
        },

        switchCluster: function () {
            dispatch({ type: ACTIONS.SWITCH_CLUST })
        },

        /**
         * Display the Datawrapper viz
         * @param {String} idViz - viz id
         * @param {String} idPlace - id of the viz node
         */
        displayImage: (idViz, idPlace) => loadImage(idViz, idPlace),

        filterQuestions: function (globalStatus) {

            let dict_q = {}
            for (let row of state.questions.clusters) {
                if (row.diff_word !== null) {
                    let questions = Array.from({ length: row.diff_word[0][1].length }, () => `${row.question}`.split(" "))
                    for (let idx_qst in row.diff_word[0][1]) {
                        for (let idx_word in row.diff_word) {
                            let nw_word = row.diff_word[idx_word][1][idx_qst]
                            questions[idx_qst][row.diff_word[idx_word][0]] = nw_word
                        }
                    }
                    questions.map(x => x.join(" ")).forEach((subquestion, idx) => dict_q[subquestion] = { "cluster": row.cluster, "answer": row.answer[idx] })
                } else {
                    dict_q[row.question] = { "cluster": row.cluster, "answer": row.answer }
                }
            }

            let nw_format = {}
            globalStatus.selectedQuestion.value.forEach(question => {
                let cluster = dict_q[question]["cluster"]
                let topic = state.questions.topics[cluster]
                topic = topic[topic.length - 1]

                if (Object.keys(nw_format).includes(topic)) {
                    nw_format[topic].push({ "Q": question, "A": dict_q[question]["answer"] })
                } else {
                    nw_format[topic] = [{ "Q": question, "A": dict_q[question]["answer"] }]
                }
            })

            return nw_format
        },

        /**
         * Test if all inputs are filled out
         * @returns boolean of this condition
         */
        testEmptyUpdateInfo: function () {
            let inputs = document.querySelectorAll('.updateInfo')
            for (let input of inputs) if (input.value === "") return true
            return false
        },

        /**
         * Create the final JSON file with all selected couples
         */
        generateFile: function (nw_data) {
            var blob = new Blob([JSON.stringify(nw_data, null, 2)], { type: "text/plain;charset=utf-8" });
            saveAs(blob, `${state.id}.faq`);
        },

        /**
         * Initialize the IA server with context (link to AIserver)
         * @param {String} text - press article
         * @param {Object} data - viz data
         */
        async loadDataServer(text, data) {

            data.forEach(x =>
                Object.entries(x).forEach(couple =>
                    x[couple[0]] = couple[1] instanceof CustomDate ? couple[1].get() : couple[1]
                )
            )
            /*
            let params = {
                method: "POST",
                body: JSON.stringify({ article: text, data: data, alldata: state }),
                headers: { "Content-Type": "application/json", "Accept-Language": LanguageSelector.getLanguage(state.article) }
            }
            
            await fetch(`http://localhost:${AI_SERVER_PORT}/init`, params).then(res => {
                console.log("Initialisation du serveur IA")
                if (res.ok) return
                throw new Error("Erreur d'initialisation")
            })
            */
        },

        getDefaultValues() {
            let rows_data = state.dataParser.data
            let dataX = state.dataParser.axisData["horizontal"].text
            let dataY = state.dataParser.metadata.title

            if (state.dataParser.type === TYPE_CHART.BAR_HORIZON) {
                let buff = dataX
                dataX = dataY
                dataY = buff
            } else if (state.dataParser.type === TYPE_CHART.PIE) {
                rows_data = state.dataParser.data[0].data.map(x => { return { color: x.color, label: x.name } })
            }

            let svg_values = localStorage.getItem(state.id + "defVal");

            if (svg_values) {
                let vals = JSON.parse(svg_values)
                rows_data = vals["rows_data"]
                dataX = vals["dataX"]
                dataY = vals["dataY"]
            }

            return { dataX: dataX, dataY: dataY, rows_data: rows_data }
        },

        /**
         * Generate questions (link to AIserver)
         * @returns generated questions
         */
        async getQuestions() {
            let params = { method: "PUT", headers: { "Content-Type": "application/json", "Accept-Language": LanguageSelector.getLanguage(state.article) } }

            let svg_couples = localStorage.getItem(state.id + "Couples");

            if (!svg_couples) {
                return await fetch(`http://localhost:${AI_SERVER_PORT}/QRs1`, params).then(async res => {
                    console.log("Génération des questions")
                    if (res.ok) {
                        let res_json = await res.json()
                        return res_json
                    }
                    throw new Error("Erreur de génération")
                })
            } else {
                console.log("Récupération des questions")
                return JSON.parse(svg_couples)["qrs"].map(x => x["Q"])
            }
        },

        getSingleCluster(questions, answers) {

            let list_couples = []
            for (let index in questions) {
                let lcl_c = {
                    "question": questions[index],
                    "answer": [answers[index]],
                    "diff_word": null,
                    "src": [{ "score": 0, "start": 0, "end": 0, "type": "article" }],
                    "cluster": 0
                }
                list_couples.push(lcl_c)
            }

            return {
                "clusters": list_couples,
                "topics": { "0": ["DEFAULT"] }
            }
        },

        /**
         * Create clustering (link to Pythonserver)
         * @returns questions / answers clustering
         */
        async getClusters(questions, answers, article, data) {

            if (!state.multiClusering) return this.getSingleCluster(questions, answers)

            let params = {
                method: "PUT",
                body: JSON.stringify({ questions: questions, answers: answers, article: article, data: data }),
                headers: { 'Content-type': 'application/json', 'Accept': 'application/json', "Accept-Language": LanguageSelector.getLanguage(state.article) }
            }
            let svg_cluster = localStorage.getItem(state.id + "Clusters");

            if (!svg_cluster) {
                return await fetch(`http://localhost:${PYTHON_SERVER_PORT}/clusters`, params).then(async res => {
                    console.log("Génération des clusters")
                    if (res.ok) {
                        let res_json = await res.json()
                        localStorage.setItem(state.id + "Clusters", res_json)
                        return JSON.parse(res_json)
                    }
                    throw new Error("Erreur de génération")
                })
            } else {
                console.log("Récupération des clusters déjà calculés")
                let res_json = JSON.parse(svg_cluster)
                return res_json
            }
        },

        /**
         * Generate anwers of questions (link to AIserver)
         * @param {List} questions - generated questions
         * @returns generated answers
         */
        async getAnswers(questions) {

            let params = {
                method: "PUT",
                body: JSON.stringify({ questions: questions }),
                headers: { "Content-Type": "application/json", "Accept-Language": LanguageSelector.getLanguage(state.article) }
            }

            let svg_couples = localStorage.getItem(state.id + "Couples");

            if (!svg_couples) {
                return await fetch(`http://localhost:${AI_SERVER_PORT}/QRs2`, params).then(async res => {
                    console.log("Génération des réponses")
                    if (res.ok) {
                        let res_json = await res.json()
                        localStorage.setItem(state.id + "Couples", JSON.stringify(res_json))
                        return res_json
                    }
                    throw new Error("Erreur de génération")
                })
            } else {
                console.log("Récupération des questions")
                return JSON.parse(svg_couples)
            }
        },

        /**
         * 
         * @param {Object} body - {"article": press_article, "data": viz_data}
         * @param {Function} setStatus - update process status 
         */
        updateQuestions: async function (body, setStatus) {

            setStatus(GEN_STATUS.INIT_SERVER)
            await this.loadDataServer(body.article, body.data, setStatus);

            setStatus(GEN_STATUS.CREATE_QUESTIONS)
            let questions = await this.getQuestions();

            setStatus(GEN_STATUS.CREATE_ANSWERS)
            let result = await this.getAnswers(questions)

            let clusters = await this.getClusters(result.qrs.map(x => x["Q"]), result.qrs.map(x => x["R"]), body.article, body.data);
            dispatch({ type: ACTIONS.LOAD_QUESTIONS, payload: { questions: clusters } })
            setStatus(GEN_STATUS.FILTER)
        },

        /**
         * Update global data with selected couples
         * @param {List} questions - Generated questions
         * @param {List} answers - Generated answers
         */
        updateSelected: function (questions, answers) {
            let data = []
            for (let i in questions) data.push({ "Q": questions[i], "R": answers[i] })
            dispatch({ type: ACTIONS.LOAD_QUESTIONS, payload: { questions: { data: { "Catégorie Test": data } } } })
        },

        /**
         * Update dataviz information
         */
        udpateInfo: function () {
            // Common for all viz type
            let inputsColor = document.querySelectorAll('.name.updateInfo')
            let inputsName = document.querySelectorAll('.label.updateInfo')

            inputsColor.forEach((nodeColor, index) => {
                let colorInfo = { name: nodeColor.value.toLowerCase(), text: inputsName[index].value.toLowerCase() }
                dispatch({ type: ACTIONS.UPDATE_COLOR_DESCR, payload: { color: colorInfo, id: nodeColor.id.slice(2) } })
            })

            dispatch({ type: ACTIONS.UPDATE_X_DESCR, payload: { text: document.getElementById('addXInfo').value.toLowerCase() } })
            dispatch({ type: ACTIONS.UPDATE_Y_DESCR, payload: { text: document.getElementById('addYInfo').value.toLowerCase() } })
        },

        /**
         * Update global data and control input with the viz id
         * @param {Function} setCompleteStatus - validate this step
         * @param {Function} setErrorStatus - throw error if format isnt correct
         * @param {String} value - viz id
         */
        updateId: function (setCompleteStatus, setErrorStatus, value = null) {
            if (value !== null) dispatch({ type: ACTIONS.LOAD_VIZ, payload: { id: value } })
            else {
                const idInput = document.getElementById("idViz").value;
                setErrorStatus(/[^A-Za-z0-9]/g.test(idInput))

                if (idInput.length === 5 && !/[^A-Za-z0-9]/g.test(idInput)) {
                    dispatch({ type: ACTIONS.LOAD_VIZ, payload: { id: idInput } })
                    setCompleteStatus(false)
                } else {
                    setCompleteStatus(true)
                }
            }
        },

        /**
         * Update global data with the press article
         * @param {String} text - press article
         */
        updateArticleText: (text) => dispatch({ type: ACTIONS.LOAD_ARTICLE, payload: { text: text } }),

        updateArticle: async function (eventFile, setStatus) {
            if (eventFile.target.value.length === 0) {
                setStatus(true)
                return
            }

            setStatus(false)
            const fileArticle = eventFile.target.files[0];
            var reader = new FileReader();
            return new Promise(function (resolve) {
                reader.addEventListener("load", resolve, false);
                reader.readAsText(fileArticle);
            }).then(res => res.target.result)
                .then(res => { dispatch({ type: ACTIONS.LOAD_ARTICLE, payload: { text: res } }) })
        },

        /**
         * Check serveurStatus and display with toaster
         */
        checkServeurStatus: function () {
            fetch(`${ROOT_DATAWRAPPER}/ping`)
                .then((res) => res.ok ? Toaster.successServeur("DataWrapperServeur") : Toaster.warningServeur("DataWrapperServeur"))
                .catch(() => Toaster.errorServeur("DataWrapperServeur"))
            fetch(`http://localhost:${AI_SERVER_PORT}/ping`)
                .then((res) => res.ok ? Toaster.successServeur("AIServeur") : Toaster.warningServeur("AIServeur"))
                .catch(() => Toaster.errorServeur("AIServeur"))
            fetch(`http://localhost:${PYTHON_SERVER_PORT}/ping`)
                .then((res) => res.ok ? Toaster.successServeur("PythonServeur") : Toaster.warningServeur("PythonServeur"))
                .catch(() => Toaster.errorServeur("PythonServeur"))
        },

        /**
         * Request DataWrapperAPI to get viz information
         * @returns Promise with data extraction from viz
         */
        requestDataWrapperAPI: async function () {

            let svg_values = localStorage.getItem(state.id + "data");
            let svg_dom = localStorage.getItem(state.id + "dom")

            svg_dom = svg_dom.slice(1,-1);
            svg_dom = svg_dom.replaceAll(`'`, `"`)

            if (svg_values) {
                    /*
                await fetch(`${ROOT_DATAWRAPPER}/dom/?id=${state.id}&save=${!!svg_values}`)
                    .then(async res => {
                        if (res.ok) return res.json();
                        await res.json().then(x => { throw new Error(x.error) })
                    })
                    .then(dom => {
                        console.log(dom.replaceAll(`"`, `'`))
                        let datavizParser = new DatavizData(dom, svg_values);
                        datavizParser.getAxis()
                        datavizParser.getData()
                        datavizParser.getLegend()
                        dispatch({ type: ACTIONS.LOAD_PARSER, payload: { dataviz: datavizParser } })
                    })
                    */
                    
                    let datavizParser = new DatavizData(svg_dom, svg_values,  svg_dom.includes("france") ? "RC" : "CBC");
                    datavizParser.getAxis()
                    datavizParser.getData()
                    datavizParser.getLegend()
                    dispatch({ type: ACTIONS.LOAD_PARSER, payload: { dataviz: datavizParser } })
                    
                    
            } else {
                await Promise.all([
                    fetch(`${ROOT_DATAWRAPPER}/dom/?id=${state.id}&save=${!!svg_values}`)
                        .then(async res => {
                            if (res.ok) return res.json();
                            await res.json().then(x => { throw new Error(x.error) })
                        }),
                    fetch(`${ROOT_DATAWRAPPER}/data/?id=${state.id}&save=${!!svg_values}`)
                        .then(async res => {
                            if (res.ok) return res.json();
                            await res.json().then(x => { throw new Error(x.error) })
                        }),
                ]).then(res => {
                    console.log(JSON.stringify(res[1]));
                    let datavizParser = new DatavizData(res[0], res[1]);
                    datavizParser.getAxis()
                    datavizParser.getData()
                    datavizParser.getLegend()
                    dispatch({ type: ACTIONS.LOAD_PARSER, payload: { dataviz: datavizParser } })
                })
            }
        }
    }

    return (
        <AppContext.Provider value={{ state, dispatch, api }}>{children}</AppContext.Provider>
    );
}

export default Provider;