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

    // window
    color(name) {
        let convertName = {
            black: "noir", blue: "bleu", cyan: "cyan", green: "vert",
            teal: "bleu canard", turquoise: "turquoise", indigo: "indigo", gray: "gris", brown: "marron",
            tan: "tan", violet: "noir", beige: "beige", fuchsia: "fuchsia", gold: "or",
            magenta: "magenta", orange: "orange", pink: "rose", red: "rouge", white: "blanc",
            yellow: "jaune"
        }
        return this.language === LANGUAGE.FRENCH ? convertName[name] : name
    }

    //examples page

    //description
    descriptionExample() {
        return this.language === LANGUAGE.FRENCH ? "Voici un aperçu des différents types de visualisations de données actuellement considérées par la méthodologie GenQA. Tous ces exemples, ainsi que leurs paires de Questions/Réponses, ont été pré-générés. Par conséquent, les différents regroupements et les couples Q/As proposés sont identiques pour chaque exécution. Ces exemples sont classés en fonction de leurs caractéristiques : diagrammes en barres simples ou multiples, graphiques en ligne simples ou multiples, et enfin un exemple en anglais. Pour chaque exemple, un lien vers l'article de presse ainsi que vers la visualisation de données est également fourni sur le modèle ci-dessous. Pour charger un exemple, cliquez sur `>`, à droite, afin d'accéder à l'édition des attributs. Une fois, ceux-ci complétés, cliquez une seconde fois sur le même symbole `>` ." : "Here is an overview of the different types of data-visualizations currently considered by the GenQA methodology. All these examples, along with their Q/A pairs, have been pre-generated. Therefore, the different clusters and Q/A pairs proposed are identical. These examples are classified according to their characteristics: single or multiple barcharts, single or multiple linecharts, and finally an example in English. For each example, a link to the press article as well as to the data-visualization is also provided on the template below:"
    }

    //links
    link2Article() {
        return this.language === LANGUAGE.FRENCH ? "Lien vers l'article de presse" : "Link to the press article"
    }

    link2Viz() {
        return this.language === LANGUAGE.FRENCH ? "Lien vers la visualisation de données" : "Link to the data-visualization"
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

    nameText() {
        return this.language === LANGUAGE.FRENCH ? "Nom" : "Name"
    }

    xAxisText(chartType) {
        if (this.language === LANGUAGE.FRENCH) {
            return chartType === TYPE_CHART.PIE ? "Att. catégorique" : "Axe horizont."
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

    buttonTextHoverArticle() {
        return this.language === LANGUAGE.FRENCH ? "Charger cet article" : "Load this press article"
    }

    buttonTextHoverQA() {
        return this.language === LANGUAGE.FRENCH ? "Générer les couples de Questions / Réponses" : "Load Questions / Answers pairs"
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
                return this.language === LANGUAGE.FRENCH ? "ENSEMBLE DES COUPLES" : "ALL Q/A PAIRS"
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
                return this.language === LANGUAGE.FRENCH ? "Tous les couples" : "All Q/A pairs"
            case "BIN":
                return this.language === LANGUAGE.FRENCH ? "Couples dont les réponses sont du type 'non-mentionnées' dans la visualisation et l'article" : "Q/A pairs whose answer is not mentioned into dataviz or article"
            case "CONTEXT":
                return this.language === LANGUAGE.FRENCH ? "Couples qui ne sont ni associés à la visualisation, ni à l'article" : "Q/A pairs not linked with dataviz or article"
            default:
                return this.language === LANGUAGE.FRENCH ? "Couples qui sont associés à la visualisation ou à l'article" : "Q/A pairs linked with dataviz or article"
        }
    }

    vizText() {
        return this.language === LANGUAGE.FRENCH ? "Visualisation" : "Data Visualization"
    }

    sepText(isUnique) {
        if (this.language === LANGUAGE.FRENCH) {
            return isUnique ? "Couple(s) unique(s)" : "Regroupement(s) syntaxique(s)"
        }
        return isUnique ? "Single couple(s)" : "Syntactic cluster(s)"
    }

    generateFileText() {
        return this.language === LANGUAGE.FRENCH ? "Générer le fichier" : "Create file"
    }

    qaText() {
        return this.language === LANGUAGE.FRENCH ? "Couples de Questions/Réponses" : "Question/Answer pairs"
    }

    selectNumberQText(nbSelecQs) {
        if (this.language === LANGUAGE.FRENCH) {
            return `${nbSelecQs} couple${nbSelecQs > 1 ? "s" : ""} sélectionnée${nbSelecQs > 1 ? "s" : ""}`
        }
        return `${nbSelecQs} selected Q/A pair${nbSelecQs > 1 ? "s" : ""}`
    }

    selectQText() {
        return this.language === LANGUAGE.FRENCH ? "Couples sélectionnés" : "Selected Q/A pairs"
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