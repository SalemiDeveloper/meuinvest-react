import { useEffect, useState, type FormEvent } from 'react';
import {
    Eye,
    EyeOff,
    Moon,
    Monitor,
    Sun,
} from 'lucide-react';

import { useAuth } from '../../contexts/useAuth';
import { supabase } from '../../lib/supabase';

import './Settings.css';

type SettingsTab =
    | 'profile'
    | 'security'
    | 'theme';

type Theme = 'light' | 'dark' | 'system';

function Settings() {
    const { user } = useAuth();

    const [activeTab, setActiveTab] =
        useState<SettingsTab>('profile');

    const [name, setName] = useState(
        user?.user_metadata?.name ??
            user?.user_metadata?.full_name ??
            '',
    );

    const [email, setEmail] = useState(
        user?.email ?? '',
    );

    const [currentPassword, setCurrentPassword] =
        useState('');

    const [newPassword, setNewPassword] =
        useState('');

    const [confirmPassword, setConfirmPassword] =
        useState('');

    const [showCurrentPassword, setShowCurrentPassword] =
        useState(false);

    const [showNewPassword, setShowNewPassword] =
        useState(false);

    const [showConfirmPassword, setShowConfirmPassword] =
        useState(false);

    const [theme, setTheme] = useState<Theme>(() => {
        const savedTheme =
            localStorage.getItem(
                'meuinvest-theme',
            );

        if (
            savedTheme === 'light' ||
            savedTheme === 'dark' ||
            savedTheme === 'system'
        ) {
            return savedTheme;
        }

        return 'system';
    });

    const [loading, setLoading] = useState(false);
    const [success, setSuccess] =
        useState<string | null>(null);
    const [error, setError] =
        useState<string | null>(null);

    useEffect(() => {
        setName(
            user?.user_metadata?.name ??
                user?.user_metadata?.full_name ??
                '',
        );

        setEmail(user?.email ?? '');
    }, [user]);

    useEffect(() => {
        document.documentElement.dataset.theme =
            theme;

        localStorage.setItem(
            'meuinvest-theme',
            theme,
        );
    }, [theme]);

    const clearMessages = () => {
        setError(null);
        setSuccess(null);
    };

    const handleProfileSubmit = async (
        event: FormEvent<HTMLFormElement>,
    ) => {
        event.preventDefault();

        clearMessages();

        if (!name.trim()) {
            setError('Informe seu nome.');
            return;
        }

        if (!email.trim()) {
            setError('Informe seu email.');
            return;
        }

        try {
            setLoading(true);

            const { error: updateError } =
                await supabase.auth.updateUser({
                    email: email.trim(),
                    data: {
                        name: name.trim(),
                    },
                });

            if (updateError) {
                throw updateError;
            }

            setSuccess(
                'Perfil atualizado com sucesso.',
            );
        } catch (error) {
            setError(
                error instanceof Error
                    ? error.message
                    : 'Não foi possível atualizar o perfil.',
            );
        } finally {
            setLoading(false);
        }
    };

    const handlePasswordSubmit = async (
        event: FormEvent<HTMLFormElement>,
    ) => {
        event.preventDefault();

        clearMessages();

        if (!currentPassword) {
            setError(
                'Informe sua senha atual.',
            );
            return;
        }

        if (!newPassword) {
            setError(
                'Informe a nova senha.',
            );
            return;
        }

        if (newPassword.length < 6) {
            setError(
                'A nova senha deve possuir pelo menos 6 caracteres.',
            );
            return;
        }

        if (newPassword !== confirmPassword) {
            setError(
                'A confirmação da senha não corresponde à nova senha.',
            );
            return;
        }

        if (!user?.email) {
            setError(
                'Não foi possível identificar o email da conta.',
            );
            return;
        }

        try {
            setLoading(true);

            /*
             * O Supabase não oferece uma operação client-side
             * para "validar senha atual" isoladamente.
             *
             * Fazemos uma autenticação novamente antes de
             * permitir a alteração.
             */
            const { error: signInError } =
                await supabase.auth.signInWithPassword({
                    email: user.email,
                    password: currentPassword,
                });

            if (signInError) {
                throw new Error(
                    'A senha atual está incorreta.',
                );
            }

            const { error: updateError } =
                await supabase.auth.updateUser({
                    password: newPassword,
                });

            if (updateError) {
                throw updateError;
            }

            setCurrentPassword('');
            setNewPassword('');
            setConfirmPassword('');

            setSuccess(
                'Senha atualizada com sucesso.',
            );
        } catch (error) {
            setError(
                error instanceof Error
                    ? error.message
                    : 'Não foi possível atualizar a senha.',
            );
        } finally {
            setLoading(false);
        }
    };

    const handleTabChange = (
        tab: SettingsTab,
    ) => {
        setActiveTab(tab);
        clearMessages();
    };

    return (
        <main className="settings">
            <header className="settings-header">
                <h1>Configurações</h1>

                <p>
                    Gerencie seu perfil e as configurações
                    da conta
                </p>
            </header>

            <div className="settings-layout">
                <aside className="settings-sidebar">
                    <button
                        type="button"
                        className={
                            activeTab === 'profile'
                                ? 'active'
                                : ''
                        }
                        onClick={() =>
                            handleTabChange('profile')
                        }
                    >
                        Perfil
                    </button>

                    <button
                        type="button"
                        className={
                            activeTab === 'security'
                                ? 'active'
                                : ''
                        }
                        onClick={() =>
                            handleTabChange('security')
                        }
                    >
                        Segurança
                    </button>

                    <button
                        type="button"
                        className={
                            activeTab === 'theme'
                                ? 'active'
                                : ''
                        }
                        onClick={() =>
                            handleTabChange('theme')
                        }
                    >
                        Tema
                    </button>
                </aside>

                <section className="settings-content">
                    {activeTab === 'profile' && (
                        <>
                            <div className="settings-section-header">
                                <h2>Perfil</h2>

                                <p>
                                    Atualize seu nome e seu
                                    endereço de email
                                </p>
                            </div>

                            <form
                                className="settings-form"
                                onSubmit={
                                    handleProfileSubmit
                                }
                            >
                                <div className="settings-field">
                                    <label htmlFor="name">
                                        Nome
                                    </label>

                                    <input
                                        id="name"
                                        type="text"
                                        value={name}
                                        onChange={(event) =>
                                            setName(
                                                event.target
                                                    .value,
                                            )
                                        }
                                        disabled={loading}
                                    />
                                </div>

                                <div className="settings-field">
                                    <label htmlFor="email">
                                        Email
                                    </label>

                                    <input
                                        id="email"
                                        type="email"
                                        value={email}
                                        onChange={(event) =>
                                            setEmail(
                                                event.target
                                                    .value,
                                            )
                                        }
                                        disabled={loading}
                                    />
                                </div>

                                {error && (
                                    <p className="settings-error">
                                        {error}
                                    </p>
                                )}

                                {success && (
                                    <p className="settings-success">
                                        {success}
                                    </p>
                                )}

                                <button
                                    type="submit"
                                    className="settings-primary-button"
                                    disabled={loading}
                                >
                                    {loading
                                        ? 'Salvando...'
                                        : 'Salvar'}
                                </button>
                            </form>

                            <div className="settings-danger-section">
                                <h2>
                                    Deletar conta
                                </h2>

                                <p>
                                    Delete sua conta e todos
                                    os seus dados.
                                </p>

                                <div className="settings-danger-box">
                                    <strong>
                                        Aviso
                                    </strong>

                                    <span>
                                        Por favor prossiga com
                                        cuidado, esta ação não
                                        pode ser desfeita.
                                    </span>

                                    <button
                                        type="button"
                                        className="settings-danger-button"
                                    >
                                        Deletar conta
                                    </button>
                                </div>
                            </div>
                        </>
                    )}

                    {activeTab === 'security' && (
                        <>
                            <div className="settings-section-header">
                                <h2>
                                    Atualizar senha
                                </h2>

                                <p>
                                    Garanta que sua conta esteja
                                    usando uma senha forte para
                                    sua segurança.
                                </p>
                            </div>

                            <form
                                className="settings-security-form"
                                onSubmit={
                                    handlePasswordSubmit
                                }
                            >
                                <div className="settings-field">
                                    <label htmlFor="current-password">
                                        Senha atual
                                    </label>

                                    <div className="settings-password-input">
                                        <input
                                            id="current-password"
                                            type={
                                                showCurrentPassword
                                                    ? 'text'
                                                    : 'password'
                                            }
                                            value={
                                                currentPassword
                                            }
                                            onChange={(
                                                event,
                                            ) =>
                                                setCurrentPassword(
                                                    event
                                                        .target
                                                        .value,
                                                )
                                            }
                                            placeholder="Sua senha atual"
                                            disabled={
                                                loading
                                            }
                                        />

                                        <button
                                            type="button"
                                            onClick={() =>
                                                setShowCurrentPassword(
                                                    (
                                                        current,
                                                    ) =>
                                                        !current,
                                                )
                                            }
                                            aria-label={
                                                showCurrentPassword
                                                    ? 'Ocultar senha'
                                                    : 'Mostrar senha'
                                            }
                                        >
                                            {showCurrentPassword ? (
                                                <EyeOff
                                                    size={
                                                        17
                                                    }
                                                />
                                            ) : (
                                                <Eye
                                                    size={
                                                        17
                                                    }
                                                />
                                            )}
                                        </button>
                                    </div>
                                </div>

                                <div className="settings-field">
                                    <label htmlFor="new-password">
                                        Nova senha
                                    </label>

                                    <div className="settings-password-input">
                                        <input
                                            id="new-password"
                                            type={
                                                showNewPassword
                                                    ? 'text'
                                                    : 'password'
                                            }
                                            value={
                                                newPassword
                                            }
                                            onChange={(
                                                event,
                                            ) =>
                                                setNewPassword(
                                                    event
                                                        .target
                                                        .value,
                                                )
                                            }
                                            placeholder="Nova senha"
                                            disabled={
                                                loading
                                            }
                                        />

                                        <button
                                            type="button"
                                            onClick={() =>
                                                setShowNewPassword(
                                                    (
                                                        current,
                                                    ) =>
                                                        !current,
                                                )
                                            }
                                            aria-label={
                                                showNewPassword
                                                    ? 'Ocultar senha'
                                                    : 'Mostrar senha'
                                            }
                                        >
                                            {showNewPassword ? (
                                                <EyeOff
                                                    size={
                                                        17
                                                    }
                                                />
                                            ) : (
                                                <Eye
                                                    size={
                                                        17
                                                    }
                                                />
                                            )}
                                        </button>
                                    </div>
                                </div>

                                <div className="settings-field">
                                    <label htmlFor="confirm-password">
                                        Confirmar senha
                                    </label>

                                    <div className="settings-password-input">
                                        <input
                                            id="confirm-password"
                                            type={
                                                showConfirmPassword
                                                    ? 'text'
                                                    : 'password'
                                            }
                                            value={
                                                confirmPassword
                                            }
                                            onChange={(
                                                event,
                                            ) =>
                                                setConfirmPassword(
                                                    event
                                                        .target
                                                        .value,
                                                )
                                            }
                                            placeholder="Confirmar senha"
                                            disabled={
                                                loading
                                            }
                                        />

                                        <button
                                            type="button"
                                            onClick={() =>
                                                setShowConfirmPassword(
                                                    (
                                                        current,
                                                    ) =>
                                                        !current,
                                                )
                                            }
                                            aria-label={
                                                showConfirmPassword
                                                    ? 'Ocultar senha'
                                                    : 'Mostrar senha'
                                            }
                                        >
                                            {showConfirmPassword ? (
                                                <EyeOff
                                                    size={
                                                        17
                                                    }
                                                />
                                            ) : (
                                                <Eye
                                                    size={
                                                        17
                                                    }
                                                />
                                            )}
                                        </button>
                                    </div>
                                </div>

                                {error && (
                                    <p className="settings-error">
                                        {error}
                                    </p>
                                )}

                                {success && (
                                    <p className="settings-success">
                                        {success}
                                    </p>
                                )}

                                <button
                                    type="submit"
                                    className="settings-primary-button"
                                    disabled={loading}
                                >
                                    {loading
                                        ? 'Salvando...'
                                        : 'Salvar'}
                                </button>
                            </form>

                            <div className="settings-security-placeholder">
                                <h2>
                                    Two-factor
                                    authentication
                                </h2>
                            </div>
                        </>
                    )}

                    {activeTab === 'theme' && (
                        <>
                            <div className="settings-section-header">
                                <h2>
                                    Configurações de tema
                                </h2>

                                <p>
                                    Atualize as configurações
                                    de tema da sua conta.
                                </p>
                            </div>

                            <div className="settings-theme-options">
                                <button
                                    type="button"
                                    className={
                                        theme === 'light'
                                            ? 'active'
                                            : ''
                                    }
                                    onClick={() =>
                                        setTheme('light')
                                    }
                                >
                                    <Sun size={18} />

                                    <span>Claro</span>
                                </button>

                                <button
                                    type="button"
                                    className={
                                        theme === 'dark'
                                            ? 'active'
                                            : ''
                                    }
                                    onClick={() =>
                                        setTheme('dark')
                                    }
                                >
                                    <Moon size={18} />

                                    <span>Escuro</span>
                                </button>

                                <button
                                    type="button"
                                    className={
                                        theme === 'system'
                                            ? 'active'
                                            : ''
                                    }
                                    onClick={() =>
                                        setTheme('system')
                                    }
                                >
                                    <Monitor size={18} />

                                    <span>Sistema</span>
                                </button>
                            </div>
                        </>
                    )}
                </section>
            </div>
        </main>
    );
}

export default Settings;