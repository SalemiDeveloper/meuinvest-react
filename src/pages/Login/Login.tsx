import { useState, type FormEvent } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

import { supabase } from '../../lib/supabase';

import './Login.css';

function Login() {
    const navigate = useNavigate();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const [showPassword, setShowPassword] =
        useState(false);

    const [rememberMe, setRememberMe] =
        useState(false);

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(
        null,
    );

    const handleSubmit = async (
        event: FormEvent<HTMLFormElement>,
    ) => {
        event.preventDefault();

        try {
            setLoading(true);
            setError(null);

            if (!email.trim() || !password) {
                setError(
                    'Informe seu email e sua senha.',
                );
                return;
            }

            const { error } =
                await supabase.auth.signInWithPassword({
                    email: email.trim(),
                    password,
                });

            if (error) {
                throw new Error(
                    'Email ou senha inválidos.',
                );
            }

            navigate('/dashboard');
        } catch (error) {
            setError(
                error instanceof Error
                    ? error.message
                    : 'Não foi possível entrar.',
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <main className="login-page">
            <section className="login-container">
                <div className="login-logo">
                    <span className="login-logo-m">
                        M
                    </span>

                    <span className="login-logo-bars">
                        <i />
                        <i />
                        <i />
                    </span>
                </div>

                <header className="login-header">
                    <h1>Entrar</h1>

                    <p>
                        Acesse sua conta do MeuInvest
                    </p>
                </header>

                <form
                    className="login-form"
                    onSubmit={handleSubmit}
                >
                    <div className="login-field">
                        <label htmlFor="email">
                            Email
                        </label>

                        <input
                            id="email"
                            type="email"
                            value={email}
                            onChange={(event) =>
                                setEmail(
                                    event.target.value,
                                )
                            }
                            placeholder="seu@email.com"
                            autoComplete="email"
                            disabled={loading}
                            autoFocus
                        />
                    </div>

                    <div className="login-field">
                        <div className="login-password-header">
                            <label htmlFor="password">
                                Senha
                            </label>

                            <Link to="/recuperar-senha">
                                Esqueceu sua senha?
                            </Link>
                        </div>

                        <div className="login-password-input">
                            <input
                                id="password"
                                type={
                                    showPassword
                                        ? 'text'
                                        : 'password'
                                }
                                value={password}
                                onChange={(event) =>
                                    setPassword(
                                        event.target.value,
                                    )
                                }
                                placeholder="Sua senha"
                                autoComplete="current-password"
                                disabled={loading}
                            />

                            <button
                                type="button"
                                className="login-password-toggle"
                                onClick={() =>
                                    setShowPassword(
                                        (current) =>
                                            !current,
                                    )
                                }
                                aria-label={
                                    showPassword
                                        ? 'Ocultar senha'
                                        : 'Mostrar senha'
                                }
                            >
                                {showPassword ? (
                                    <EyeOff size={15} />
                                ) : (
                                    <Eye size={15} />
                                )}
                            </button>
                        </div>
                    </div>

                    <label className="login-remember">
                        <input
                            type="checkbox"
                            checked={rememberMe}
                            onChange={(event) =>
                                setRememberMe(
                                    event.target.checked,
                                )
                            }
                        />

                        <span>Lembrar de mim</span>
                    </label>

                    {error && (
                        <p className="login-error">
                            {error}
                        </p>
                    )}

                    <button
                        type="submit"
                        className="login-submit"
                        disabled={loading}
                    >
                        {loading
                            ? 'Entrando...'
                            : 'Entrar'}
                    </button>
                </form>

                <p className="login-register">
                    Ainda não possui uma conta?{' '}
                    <Link to="/register">
                        Criar conta
                    </Link>
                </p>
            </section>
        </main>
    );
}

export default Login;