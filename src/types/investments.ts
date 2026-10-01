export type InvestmentPosition = {
    id: number;
    investment_import_id: number;
    product: string;
    institution: string | null;
    issuer: string | null;
    code: string | null;
    indexer: string | null;
    issued_at: string | null;
    maturity_date: string | null;
    curve_value: string;
};

export type InvestmentImport = {
    id: number;
    user_id: string;
    reference_period: string;
    original_filename: string;
    stored_path: string | null;
    created_at: string;
    updated_at: string;
};

export type InvestmentImportWithPositions =
    InvestmentImport & {
        positions: InvestmentPosition[];
    };