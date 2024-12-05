const regSep = /[-, /]/g


const textConvert = {
    "janv.": "january",
    "fevr.": "february",
    "mars": "march",
    "avril": "april",
    "avr.": "april",
    "mai": "may",
    "juin": "june",
    "juillet": "july",
    "juill.": "july",
    "juil.": "july",
    "aout": "august",
    "août": "august",
    "septembre": "september",
    "sep.": "september",
    "octobre": "october",
    "oct.": "october",
    "novembre": "november",
    "nov.": "november",
    "decembre": "december",
    "dec.": "december",
    "décembre": "december",
    "déc.": "december"
}

/**
 * Create a representation of date with precision level (day, month or year)
 */
class CustomDate {

    /**
     * Create a CustomDate object
     * @param {String} stringDate - date string
     */
    constructor(stringDate) {
        // formalize
        for (const key in textConvert) stringDate = stringDate.replace(key, textConvert[key])
        this.normalizedDate = new Date(stringDate)
        const splitDate = stringDate.match(regSep)
        this.format = splitDate ? splitDate.length : 0
    }

    /**
     * Get a string format of the object
     * @returns {String} date
     */
    get() {
        const dayNb = (this.normalizedDate.getUTCDate()).toString().padStart(2, '0')
        const monthNb = (this.normalizedDate.getUTCMonth() + 1).toString().padStart(2, '0')
        const yearNb = (this.normalizedDate.getUTCFullYear()).toString()

        switch (this.format) {
            case 2:
                return `${yearNb}-${monthNb}-${dayNb}`
            case 1:
                return `${yearNb}-${monthNb}`
            case 0:
                return yearNb
            default:
                return this.normalizedDate
        }
    }
}

export default CustomDate;