import { supabase } from '../lib/supabase';

import type {
    InvestmentImport,
    InvestmentImportWithPositions,
    InvestmentPosition,
} from '../types/investments';

type CreateInvestmentImportParams = {
    referencePeriod: string;
    originalFilename: string;
    positions: Omit<
        InvestmentPosition,
        'id' | 'investment_import_id'
    >[];
};

export async function getLatestInvestmentImport(): Promise<InvestmentImportWithPositions | null> {
    const { data, error } = await supabase
        .from('investment_imports')
        .select(`
            id,
            user_id,
            reference_period,
            original_filename,
            stored_path,
            created_at,
            updated_at,
            positions:investment_positions (
                id,
                investment_import_id,
                product,
                institution,
                issuer,
                code,
                indexer,
                issued_at,
                maturity_date,
                curve_value
            )
        `)
        .order('reference_period', {
            ascending: false,
        })
        .limit(1)
        .maybeSingle();

    if (error) {
        throw new Error(
            `Não foi possível carregar a última importação: ${error.message}`,
        );
    }

    return data as InvestmentImportWithPositions | null;
}

export async function getInvestmentImports(): Promise<
    InvestmentImport[]
> {
    const { data, error } = await supabase
        .from('investment_imports')
        .select(`
            id,
            user_id,
            reference_period,
            original_filename,
            stored_path,
            created_at,
            updated_at
        `)
        .order('reference_period', {
            ascending: true,
        });

    if (error) {
        throw new Error(
            `Não foi possível carregar as importações: ${error.message}`,
        );
    }

    return (data ?? []) as InvestmentImport[];
}

export async function getInvestmentPositions(
    investmentImportId: number,
): Promise<InvestmentPosition[]> {
    const { data, error } = await supabase
        .from('investment_positions')
        .select(`
            id,
            investment_import_id,
            product,
            institution,
            issuer,
            code,
            indexer,
            issued_at,
            maturity_date,
            curve_value
        `)
        .eq('investment_import_id', investmentImportId)
        .order('product', {
            ascending: true,
        });

    if (error) {
        throw new Error(
            `Não foi possível carregar as posições: ${error.message}`,
        );
    }

    return (data ?? []) as InvestmentPosition[];
}

export async function createInvestmentImport(
    params: CreateInvestmentImportParams,
): Promise<InvestmentImport> {
    const {
        referencePeriod,
        originalFilename,
        positions,
    } = params;

    const { data, error } = await supabase.rpc(
        'create_investment_import',
        {
            p_reference_period: referencePeriod,
            p_original_filename: originalFilename,
            p_positions: positions,
        },
    );

    if (error) {
        throw new Error(
            `Não foi possível importar o relatório: ${error.message}`,
        );
    }

    return data as InvestmentImport;
}

export async function getInvestmentImportsWithPositions(): Promise<
    InvestmentImportWithPositions[]
> {
    const { data, error } = await supabase
        .from('investment_imports')
        .select(`
            id,
            user_id,
            reference_period,
            original_filename,
            stored_path,
            created_at,
            updated_at,
            positions:investment_positions (
                id,
                investment_import_id,
                product,
                institution,
                issuer,
                code,
                indexer,
                issued_at,
                maturity_date,
                curve_value
            )
        `)
        .order('reference_period', { ascending: false });

    if (error) {
        throw new Error(
            `Não foi possível carregar os relatórios: ${error.message}`,
        );
    }

    return (data ?? []) as InvestmentImportWithPositions[];
}

export async function getInvestmentImportByPeriod(
    referencePeriod: string,
): Promise<InvestmentImportWithPositions | null> {
    const { data, error } = await supabase
        .from('investment_imports')
        .select(`
            id,
            user_id,
            reference_period,
            original_filename,
            stored_path,
            created_at,
            updated_at,
            positions:investment_positions (
                id,
                investment_import_id,
                product,
                institution,
                issuer,
                code,
                indexer,
                issued_at,
                maturity_date,
                curve_value
            )
        `)
        .eq('reference_period', referencePeriod)
        .maybeSingle();

    if (error) {
        throw new Error(
            `Não foi possível carregar o relatório: ${error.message}`,
        );
    }

    return data as InvestmentImportWithPositions | null;
}

export async function deleteInvestmentImport(
    investmentImportId: number,
): Promise<void> {
    const { error } = await supabase
        .from('investment_imports')
        .delete()
        .eq('id', investmentImportId);

    if (error) {
        throw new Error(
            `Não foi possível excluir o relatório: ${error.message}`,
        );
    }
}