class PopulateStorage {

    clean() {
        localStorage.clear()
    }

    constructor() {

        ["v9KDp", "Q7gAW", "ERrhn", "8ZGFX", "jYsX2", "hVqxw", "wHZmu", "RHSrl"].forEach(id => {
            let status = localStorage.getItem(`${id}defVal`)
            if (!status) {
                let jSON = require(`./computedExamples/${id}.json`);
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