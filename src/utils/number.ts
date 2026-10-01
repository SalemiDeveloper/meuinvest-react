export function parseCurveValue(
    value: unknown,
): string {
    if (
        value === null ||
        value === undefined ||
        value === ''
    ) {
        throw new Error(
            'O campo "Valor Atualizado CURVA" é obrigatório.',
        );
    }

    if (
        typeof value !== 'string' &&
        typeof value !== 'number'
    ) {
        throw new Error(
            'O campo "Valor Atualizado CURVA" possui um formato inválido.',
        );
    }

    const normalizedValue = String(value)
        .trim()
        .replace(/\s/g, '');

    const parsedValue = Number(normalizedValue);

    if (!Number.isFinite(parsedValue)) {
        throw new Error(
            `Valor de curva inválido: "${value}".`,
        );
    }

    return parsedValue.toFixed(2);
}