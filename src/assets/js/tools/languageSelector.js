import { LANGUAGE, TYPE_CHART } from "../types/types";

class LanguageSelector {

    constructor(language) {
        this.language = language
    }


    static getLanguage(text) {
        let minText = text.toLowerCase()
        if (    minText.includes(" le ") || 
                minText.includes(" la ") ||
                minText.includes(" les ") || 
                minText.includes(" des ") || 
                minText.includes(" à ") || 
                minText.includes(" un ") || 
                minText.includes(" une ")) {
            return LANGUAGE.FRENCH
        }
        return LANGUAGE.ENGLISH
    }

    // header
    homeText() {
        return this.language === LANGUAGE.FRENCH ? "Accueil" : "Home"
    }

    exampleText() {
        return this.language === LANGUAGE.FRENCH ? "Exemples" : "Examples"
    }

    // home form
    idFormText() {
        return this.language === LANGUAGE.FRENCH ? "Identifiant DataWrapper" : "DataWrapper id"
    }

    articleFormText() {
        return this.language === LANGUAGE.FRENCH ? "Article de presse" : "Press article"
    }

    // modal content
    colorText() {
        return this.language === LANGUAGE.FRENCH ? "Couleurs" : "Colors"
    }


    xAxisText(chartType) {
        if (this.language === LANGUAGE.FRENCH) {
            return chartType === TYPE_CHART.PIE ? "Att. catégorique" : "Axe horizontal"
        }
        return chartType === TYPE_CHART.PIE ? "Categorical att." : "Horizontal axis"
    }

    yAxisText(chartType) {
        if (this.language === LANGUAGE.FRENCH) {
            return chartType === TYPE_CHART.PIE ? "Att. numérique" : "Axe vertical"
        }
        return chartType === TYPE_CHART.PIE ? "Numerical att." : "Vertical axis"
        
    }

    // history
    historyTitleText() {
        return this.language === LANGUAGE.FRENCH ? "Exemples de formats acceptées" : "Examples of accepted dataviz types"
    }

    // modalForm
    titleModalText() {
        return this.language === LANGUAGE.FRENCH ? "Complément d'information" : "Additional information"
    }

    cancelText() {
        return this.language === LANGUAGE.FRENCH ? "Annuler" : "Cancel"
    }

    // button
    buttonText(loadingStatus) {
        if (loadingStatus) {
            return this.language === LANGUAGE.FRENCH ? "  En cours ..." : " In progress ..."
        }
        return this.language === LANGUAGE.FRENCH ? "Charger" : "Load"
    }

    // progress bar
    progressBarText(index) {
        switch (index) {
            case 0:
                return this.language === LANGUAGE.FRENCH ? "Générer" : "Generate"
            case 1:
                return this.language === LANGUAGE.FRENCH ? "Initialisation" : "Initialization"
            case 2:
                return this.language === LANGUAGE.FRENCH ? "Création des question" : "Question generation"
            case 3:
                return this.language === LANGUAGE.FRENCH ? "Création des réponses" : "Answer generation"
            case 4:
                return this.language === LANGUAGE.FRENCH ? "Création des clusters" : "Cluster generation"
            case 5:
                return this.language === LANGUAGE.FRENCH ? "Création des catégories" : "Category generation"
            default:
                break;
        }
    }

    // filterQRs
    topicLabelText(topic) {
        switch(topic) {
            case "DEFAULT":
                return this.language === LANGUAGE.FRENCH ? "ENSEMBLE DES COUPLES" : "ALL COUPLES"
            case "BIN":
                return this.language === LANGUAGE.FRENCH ? "CORBEILLE" : "BIN"
            case "CONTEXT":
                return this.language === LANGUAGE.FRENCH ? "CONTEXTUALISATION" : "CONTEXTUALIZATION"
            default:
                return topic
        }
    }

    tooltipLabelText(topic) {
        switch(topic) {
            case "DEFAULT":
                return this.language === LANGUAGE.FRENCH ? "Tous les couples" : "All couples"
            case "BIN":
                return this.language === LANGUAGE.FRENCH ? "Les réponses de ces couples sont du type 'non-mentionnées' dans la visualisation et l'article" : "The answer of these couples is not mentioned into dataviz or article"
            case "CONTEXT":
                return this.language === LANGUAGE.FRENCH ? "Ces couples ne sont ni liés à la visualisation, ni à l'article" : "These couples aren't linked with dataviz or article"
            default:
                return this.language === LANGUAGE.FRENCH ? "Ces couples sont liés à la visualisation ou à l'article" : "These couples are linked with dataviz or article"
        }
    }

    vizText() {
        return this.language === LANGUAGE.FRENCH ? "Visualisation" : "Data Visualization"
    }

    sepText(isUnique) {
        if (this.language === LANGUAGE.FRENCH) {
            return isUnique ? "Couple(s) unique(s)" : "Couple(s) regroupé(s)"
        }
        return isUnique ? "Single couple(s)" : "Grouped couple(s)"
    }

    generateFileText() {
        return this.language === LANGUAGE.FRENCH ? "Générer le fichier" : "Create file"
    }

    qaText() {
        return this.language === LANGUAGE.FRENCH ? "Questions et réponses" : "Questions and answers"
    }

    selectNumberQText(nbSelecQs) {
        if (this.language === LANGUAGE.FRENCH) {
            return `${nbSelecQs} question${nbSelecQs > 1 ? "s" : ""} sélectionnée${nbSelecQs > 1 ? "s" : ""}`
        }
        return `${nbSelecQs} selected question${nbSelecQs > 1 ? "s" : ""}`
    }

    selectQText() {
        return this.language === LANGUAGE.FRENCH ? "Couples sélectionnés" : "Selected couples"
    }

    selectCouplesText() {
        return this.language === LANGUAGE.FRENCH ? "Répartition des éléments de réponse sélectionnés" : "Distribution of the selected answer cues"
    }

    distribCuesText() {
        return this.language === LANGUAGE.FRENCH ? "Répartition des éléments de réponse du cluster" : "Distribution of answer cues of the cluster"
    }

    distribAllText() {
        return this.language === LANGUAGE.FRENCH ? "Répartition de tous les éléments de réponse" : "Distribution of all answer cues"
    }

    coupleCueText() {
        return this.language === LANGUAGE.FRENCH ? "Elément de réponse du couple" : "Answer evidence of couple"
    }
}

export default LanguageSelector;