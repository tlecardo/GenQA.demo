export function alphabetic(a, b) {
    if (a.cluster < b.cluster) return -1;
    else if (a.cluster > b.cluster) return 1;
    else if (a.src.length > b.src.length) return -1;
    else if (a.src.length < b.src.length) return 1;
    else if (a.question < b.question) return -1;
    else if (a.question > b.question) return 1;
    return 0
}

export function segment(a, b) {
    if (a[0] < b[0]) return 1;
    if (a[0] > b[0]) return -1;
    if (a[1] === "]" && b[1] === "[") return -1;
    if (a[1] === "[" && b[1] === "]") return 1;
    return 0;
}

export function segmentBalise(a, b) {
    return segment(a["seg"], b["seg"]);
}