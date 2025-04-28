export function tryParseDate(str: string): Date | string {
    // ISO date only: "2025-04-24"
    const isoDateOnly = /^\d{4}-\d{2}-\d{2}$/;
    // ISO 8601 with T or space, optional ms, optional Z
    const isoDateTime = /^\d{4}-\d{2}-\d{2}[ T]\d{2}:\d{2}:\d{2}(?:\.\d+)?Z?$/i;
    const usRegex = /^\d{1,2}\/\d{1,2}\/\d{4}$/;
    const euRegex = /^\d{1,2}\.\d{1,2}\.\d{4}$/;

    if (isoDateOnly.test(str) || isoDateTime.test(str)) {
        return new Date(str);
    } else if (usRegex.test(str)) {
        const [month, day, year] = str.split('/').map(Number);
        return new Date(year, month - 1, day);
    } else if (euRegex.test(str)) {
        const [day, month, year] = str.split('.').map(Number);
        return new Date(year, month - 1, day);
    }
    return null;
}
