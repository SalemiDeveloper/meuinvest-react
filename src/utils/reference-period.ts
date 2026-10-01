const MONTHS: Record<string, string> = {
    janeiro: '01',
    fevereiro: '02',
    marco: '03',
    março: '03',
    abril: '04',
    maio: '05',
    junho: '06',
    julho: '07',
    agosto: '08',
    setembro: '09',
    outubro: '10',
    novembro: '11',
    dezembro: '12',
};

export function parseReferencePeriod(
    filename: string,
): string {
    const normalizedFilename = filename
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '');

    const match = normalizedFilename.match(
        /relatorio-consolidado-mensal-(\d{4})-([a-z]+)/,
    );

    if (!match) {
        throw new Error(
            'Nome de arquivo inválido. Use o formato relatorio-consolidado-mensal-AAAA-mês.xlsx.',
        );
    }

    const [, year, monthName] = match;

    const month = MONTHS[monthName];

    if (!month) {
        throw new Error(
            `Mês inválido no nome do arquivo: "${monthName}".`,
        );
    }

    return `${year}-${month}-01`;
}