import LanguageSelector from "../assets/js/tools/languageSelector"
import { ACTIONS, LANGUAGE } from "../assets/js/types/types"

export default function reducer(state, action) {
    let dataParser = state.dataParser
    let langSelec = state.language

    switch (action.type) {
        case ACTIONS.LOAD_ARTICLE:
            return { ...state, article: action.payload.text }
        case ACTIONS.LOAD_VIZ:
            return { ...state, id: action.payload.id }
        case ACTIONS.LOAD_PARSER:
            return { ...state, dataParser: action.payload.dataviz }
        case ACTIONS.UPDATE_X_DESCR:
            dataParser.axisData["horizontal"].text = action.payload.text
            return { ...state, dataParser: dataParser }
        case ACTIONS.UPDATE_Y_DESCR:
            dataParser.axisData["vertical"].text = action.payload.text
            return { ...state, dataParser: dataParser }
        case ACTIONS.UPDATE_COLOR_DESCR:
            for (let row of dataParser.data) {
                if (row.color === action.payload.id) {
                    row["label"] = action.payload.color.text
                    row["name"] = action.payload.color.name
                }
            }
            return { ...state, dataParser: dataParser }
        case ACTIONS.CLEAR:
            return { ...state, id: "", article: "", dataParser: null}
        case ACTIONS.LOAD_QUESTIONS:
            return { ...state, questions: action.payload.questions }
        case ACTIONS.SWITCH_LANG:
            return { ...state, language: new LanguageSelector(langSelec.language === LANGUAGE.FRENCH ? LANGUAGE.ENGLISH : LANGUAGE.FRENCH) }
        case ACTIONS.SWITCH_CLUST:
            return { ...state, multiClusering: !state.multiClusering}
        default:
            return state;
    }
}