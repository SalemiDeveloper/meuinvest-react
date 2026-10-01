export function formatCurrency(value: string | number): string {
    const numericValue = Number(value);

    if (!Number.isFinite(numericValue)) {
        return 'R$ 0,00';
    }

    return numericValue.toLocaleString('pt-BR', {
        style: 'currency',
        currency: 'BRL',
    });
}