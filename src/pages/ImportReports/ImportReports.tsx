import {
    useRef,
    useState,
    type ChangeEvent,
} from 'react';

import {
    FileSpreadsheet,
    Upload,
    X,
} from 'lucide-react';

import {
    parseInvestmentPositions,
    validateB3Report,
} from '../../services/b3';

import { readExcelFile } from '../../services/excel';

import {
    createInvestmentImport,
} from '../../services/investments';

import type { InvestmentImportWithPositions } from '../../types/investments';

import { parseReferencePeriod } from '../../utils/reference-period';

import './ImportReports.css';

type PreparedReport = {
    file: File;
    referencePeriod: string;
    positions: Omit<
        InvestmentImportWithPositions['positions'][number],
        'id' | 'investment_import_id'
    >[];
};

function ImportReports() {
    const [selectedReports, setSelectedReports] =
        useState<PreparedReport[]>([]);

    const [loading, setLoading] = useState(false);

    const [error, setError] = useState<string | null>(null);

    const [success, setSuccess] = useState<string | null>(null);

    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileChange = async (
        event: ChangeEvent<HTMLInputElement>,
    ) => {
        const files = Array.from(event.target.files ?? []);

        if (files.length === 0) {
            return;
        }

        try {
            setLoading(true);
            setError(null);
            setSuccess(null);

            const preparedReports: PreparedReport[] = [];
            const errors: string[] = [];

            for (const file of files) {
                try {
                    const referencePeriod =
                        parseReferencePeriod(file.name);

                    const rows = await readExcelFile(file);

                    validateB3Report(rows);

                    const positions =
                        parseInvestmentPositions(rows);

                    const alreadySelected =
                        selectedReports.some(
                            report =>
                                report.referencePeriod ===
                                referencePeriod,
                        );

                    const alreadyPrepared =
                        preparedReports.some(
                            report =>
                                report.referencePeriod ===
                                referencePeriod,
                        );

                    if (
                        alreadySelected ||
                        alreadyPrepared
                    ) {
                        errors.push(
                            `${file.name}: o período ${referencePeriod} já foi selecionado.`,
                        );

                        continue;
                    }

                    preparedReports.push({
                        file,
                        referencePeriod,
                        positions,
                    });
                } catch (error) {
                    errors.push(
                        `${file.name}: ${
                            error instanceof Error
                                ? error.message
                                : 'não foi possível processar o relatório.'
                        }`,
                    );
                }
            }

            if (preparedReports.length > 0) {
                setSelectedReports(current => [
                    ...current,
                    ...preparedReports,
                ]);
            }

            if (errors.length > 0) {
                setError(errors.join(' '));
            }
        } finally {
            setLoading(false);

            if (fileInputRef.current) {
                fileInputRef.current.value = '';
            }
        }
    };

    const handleRemoveReport = (
        referencePeriod: string,
    ) => {
        if (loading) {
            return;
        }

        setSelectedReports(current =>
            current.filter(
                report =>
                    report.referencePeriod !==
                    referencePeriod,
            ),
        );

        setError(null);
        setSuccess(null);
    };

    const handleImport = async () => {
        if (selectedReports.length === 0) {
            return;
        }

        try {
            setLoading(true);
            setError(null);
            setSuccess(null);

            for (const report of selectedReports) {
                await createInvestmentImport({
                    referencePeriod:
                        report.referencePeriod,
                    originalFilename:
                        report.file.name,
                    positions: report.positions,
                });
            }

            setSuccess(
                selectedReports.length === 1
                    ? 'Relatório importado com sucesso.'
                    : `${selectedReports.length} relatórios importados com sucesso.`,
            );

            setSelectedReports([]);
        } catch (error) {
            setError(
                error instanceof Error
                    ? error.message
                    : 'Não foi possível importar os relatórios.',
            );
        } finally {
            setLoading(false);
        }
    };

    const handleClear = () => {
        if (loading) {
            return;
        }

        setSelectedReports([]);
        setError(null);
        setSuccess(null);

        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    const handleSelectFiles = () => {
        if (!loading) {
            fileInputRef.current?.click();
        }
    };

    const formatFileSize = (bytes: number) => {
        if (bytes < 1024 * 1024) {
            return `${(bytes / 1024).toFixed(2)} KB`;
        }

        return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
    };

    return (
        <main className="import-reports">
            <header className="import-reports-header">
                <h1>Importar relatório</h1>

                <p>
                    Importe um ou mais relatórios mensais da B3
                    para atualizar seu histórico de investimentos.
                </p>
            </header>

            <section className="import-reports-card">
                <div className="import-reports-card-header">
                    <div className="import-reports-card-icon">
                        <FileSpreadsheet size={19} />
                    </div>

                    <div>
                        <h2>Selecionar relatório</h2>

                        <p>
                            Selecione um ou mais arquivos mensais
                            disponibilizados pela B3 no formato Excel.
                        </p>
                    </div>
                </div>

                <input
                    ref={fileInputRef}
                    type="file"
                    accept=".xlsx"
                    multiple
                    onChange={handleFileChange}
                    disabled={loading}
                    hidden
                />

                <button
                    type="button"
                    className="import-reports-dropzone"
                    onClick={handleSelectFiles}
                    disabled={loading}
                >
                    <Upload
                        className="import-reports-upload-icon"
                        size={30}
                    />

                    <strong>
                        Clique para selecionar os arquivos
                    </strong>

                    <span>
                        Apenas arquivos .xlsx
                    </span>
                </button>

                {selectedReports.length > 0 && (
                    <div className="import-reports-selected">
                        <div className="import-reports-selected-header">
                            <h2>
                                Arquivos selecionados (
                                {selectedReports.length})
                            </h2>

                            <button
                                type="button"
                                onClick={handleClear}
                                disabled={loading}
                            >
                                Limpar todos
                            </button>
                        </div>

                        <div className="import-reports-file-list">
                            {selectedReports.map(report => (
                                <div
                                    key={report.referencePeriod}
                                    className="import-reports-file"
                                >
                                    <div className="import-reports-file-icon">
                                        <FileSpreadsheet size={18} />
                                    </div>

                                    <div className="import-reports-file-info">
                                        <strong>
                                            {report.file.name}
                                        </strong>

                                        <span>
                                            {formatFileSize(
                                                report.file.size,
                                            )}
                                        </span>
                                    </div>

                                    <button
                                        type="button"
                                        className="import-reports-remove"
                                        onClick={() =>
                                            handleRemoveReport(
                                                report.referencePeriod,
                                            )
                                        }
                                        disabled={loading}
                                        aria-label={`Remover ${report.file.name}`}
                                        title="Remover arquivo"
                                    >
                                        <X size={17} />
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {error && (
                    <div className="import-reports-message import-reports-message-error">
                        {error}
                    </div>
                )}

                {success && (
                    <div className="import-reports-message import-reports-message-success">
                        {success}
                    </div>
                )}

                <div className="import-reports-footer">
                    <button
                        type="button"
                        className="import-reports-button"
                        onClick={handleImport}
                        disabled={
                            loading ||
                            selectedReports.length === 0
                        }
                    >
                        <Upload size={16} />

                        {loading
                            ? 'Importando...'
                            : 'Importar relatórios'}
                    </button>
                </div>
            </section>
        </main>
    );
}

export default ImportReports;