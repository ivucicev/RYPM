export function buildFilter<T>(
    filters: Partial<Record<keyof T, any>>,
    arrayFieldMap: Partial<Record<keyof T, boolean>>): string {
    const conditions: string[] = [];

    Object.entries(filters).forEach(([key, values]) => {
        if (!values || (Array.isArray(values) && values.length === 0)) return;

        const valueArray = Array.isArray(values) ? values : [values];
        const escapedValues = valueArray.map(v => `"${String(v).replace(/"/g, '\\"')}"`);

        if (key === 'search') {
            conditions.push(`name ~ ${escapedValues[0]}`);
            return;
        }

        const isArrayField = arrayFieldMap[key as keyof T];
        const operator = isArrayField ? '~' : '=';

        const fieldConditions = escapedValues.map(value => `${key} ${operator} ${value}`);
        conditions.push(`(${fieldConditions.join(' || ')})`);
    });

    return conditions.join(' && ');
}

