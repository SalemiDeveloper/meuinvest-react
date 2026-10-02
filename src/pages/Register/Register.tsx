import {
    type FormEvent,
    useState,
} from 'react';
import {
    Eye,
    EyeOff,
} from 'lucide-react';
import {
    Link,
    useNavigate,
} from 'react-router-dom';

import { supabase } from '../../lib/supabase';

import './Register.css';

function Register() {
    const navigate = useNavigate();

    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [passwordConfirmation, setPasswordConfirmation] =
        useState('');

    const [showPassword, setShowPassword] =
        useState(false);

    const [showPasswordConfirmation, setShowPasswordConfirmation] =
        useState(false);

    const [error, setError] =
        useState<string | null>(null);

    const [message, setMessage] =
        useState<string | null>(null);

    const [loading, setLoading] = useState(false);

    const handleSubmit = async (
        event: FormEvent<HTMLFormElement>,
    ) => {
        event.preventDefault();

        setError(null);
        setMessage(null);

        if (password !== passwordConfirmation) {
            setError('As senhas não coincidem.');
            return;
        }

        setLoading(true);

        const { data, error } =
            await supabase.auth.signUp({
                email,
                password,
                options: {
                    data: {
                        name: name.trim(),
                    },
                },
            });

        setLoading(false);

        if (error) {
            setError(error.message);
            return;
        }

        if (data.session) {
            navigate('/dashboard');
            return;
        }

        setMessage(
            'Cadastro realizado. Verifique seu e-mail para confirmar a conta.',
        );
    };

    return (
        <main className="register-page">
            <div className="register-container">
                <div className="register-logo">
                    <img
                        src="/logo_ofc.png"
                        alt="MeuInvest"
                    />
                </div>

                <header className="register-header">
                    <h1>Registre-se</h1>

                    <p>
                        Crie sua conta e veja seus resultados.
                    </p>
                </header>

                <form
                    className="register-form"
                    onSubmit={handleSubmit}
                >
                    <div className="register-field">
                        <label htmlFor="name">
                            Nome
                        </label>

                        <input
                            id="name"
                            type="text"
                            value={name}
                            onChange={(event) =>
                                setName(event.target.value)
                            }
                            placeholder="Nome completo"
                            autoComplete="name"
                            required
                        />
                    </div>

                    <div className="register-field">
                        <label htmlFor="email">
                            E-mail
                        </label>

                        <input
                            id="email"
                            type="email"
                            value={email}
                            onChange={(event) =>
                                setEmail(event.target.value)
                            }
                            placeholder="seu@email.com"
                            autoComplete="email"
                            required
                        />
                    </div>

                    <div className="register-field">
                        <label htmlFor="password">
                            Senha
                        </label>

                        <div className="register-password-input">
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
                                autoComplete="new-password"
                                minLength={6}
                                required
                            />

                            <button
                                type="button"
                                className="register-password-toggle"
                                onClick={() =>
                                    setShowPassword(
                                        current => !current,
                                    )
                                }
                                aria-label={
                                    showPassword
                                        ? 'Ocultar senha'
                                        : 'Mostrar senha'
                                }
                            >
                                {showPassword ? (
                                    <EyeOff size={16} />
                                ) : (
                                    <Eye size={16} />
                                )}
                            </button>
                        </div>
                    </div>

                    <div className="register-field">
                        <label htmlFor="password-confirmation">
                            Confirmar senha
                        </label>

                        <div className="register-password-input">
                            <input
                                id="password-confirmation"
                                type={
                                    showPasswordConfirmation
                                        ? 'text'
                                        : 'password'
                                }
                                value={passwordConfirmation}
                                onChange={(event) =>
                                    setPasswordConfirmation(
                                        event.target.value,
                                    )
                                }
                                placeholder="Sua senha"
                                autoComplete="new-password"
                                minLength={6}
                                required
                            />

                            <button
                                type="button"
                                className="register-password-toggle"
                                onClick={() =>
                                    setShowPasswordConfirmation(
                                        current => !current,
                                    )
                                }
                                aria-label={
                                    showPasswordConfirmation
                                        ? 'Ocultar confirmação de senha'
                                        : 'Mostrar confirmação de senha'
                                }
                            >
                                {showPasswordConfirmation ? (
                                    <EyeOff size={16} />
                                ) : (
                                    <Eye size={16} />
                                )}
                            </button>
                        </div>
                    </div>

                    {error && (
                        <p className="register-error">
                            {error}
                        </p>
                    )}

                    {message && (
                        <p className="register-success">
                            {message}
                        </p>
                    )}

                    <button
                        type="submit"
                        className="register-submit"
                        disabled={loading}
                    >
                        {loading
                            ? 'Criando conta...'
                            : 'Criar conta'}
                    </button>
                </form>

                <p className="register-login">
                    Já possui uma conta?{' '}
                    <Link to="/login">
                        Entrar
                    </Link>
                </p>
            </div>
        </main>
    );
}

export default Register;