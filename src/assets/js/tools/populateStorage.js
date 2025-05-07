class PopulateStorage {

    clean() {
        localStorage.clear()
    }

    constructor() {

        ["v9KDp", "Q7gAW", "ERrhn", "8ZGFX", "jYsX2", "hVqxw", "wHZmu", "RHSrl", "05U1o", "nrFj3"].forEach(id => {
            let status = localStorage.getItem(`${id}defVal`)
            if (!status) {
                let jSON = require(`./computedExamples/${id}.json`);
                localStorage.setItem(`${id}dom`, JSON.stringify(jSON.dom))
                localStorage.setItem(`${id}data`, JSON.stringify(jSON.data))
                localStorage.setItem(`${id}defVal`, JSON.stringify(jSON.defvalues))
                localStorage.setItem(`${id}Couples`, JSON.stringify(jSON.couples))
                localStorage.setItem(`${id}Clusters`, JSON.stringify(jSON.clusters))
            }
        }
        )
    }
}
export { PopulateStorage };