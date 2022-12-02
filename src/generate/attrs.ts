export function handleAttrs(attrs: {[key:string]: string}[]) {
    if (!Array.isArray(attrs) || attrs.length === 0) {
        return ""
    }

    let value = " ";
    for (const attr of attrs) {
        for (const key of Object.keys(attr)) {
            value += `${key}="${attr[key]}" `;
        }
    }
    return value
}