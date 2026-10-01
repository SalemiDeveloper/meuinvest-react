export function parseBrazilianDate(
    value: string | null,
): string | null {
    if (!value) {
        return null;
    }

    const parts = value.split('/');

    if (parts.length !== 3) {
        throw new Error(
            `Data inválida: "${value}". Esperado o formato DD/MM/YYYY.`,
        );
    }

    const [day, month, year] = parts;

    if (
        !day ||
        !month ||
        !year ||
        day.length !== 2 ||
        month.length !== 2 ||
        year.length !== 4
    ) {
        throw new Error(
            `Data inválida: "${value}". Esperado o formato DD/MM/YYYY.`,
        );
    }

    return `${year}-${month}-${day}`;
}

export function formatDate(
    value: string | null,
): string {
    if (!value) {
        return '-';
    }

    const [year, month, day] = value.split('-');

    if (!year || !month || !day) {
        return value;
    }

    return `${day}/${month}/${year}`;
}