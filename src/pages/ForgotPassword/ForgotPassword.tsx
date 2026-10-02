import {
    type FormEvent,
    useState,
} from 'react';
import { Link } from 'react-router-dom';

import { supabase } from '../../lib/supabase';

import './ForgotPassword.css';

function ForgotPassword() {
    const [email, setEmail] = useState('');

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
        setLoading(true);

        const { error } =
            await supabase.auth.resetPasswordForEmail(
                email,
                {
                    redirectTo:
                        `${window.location.origin}/redefinir-senha`,
                },
            );

        setLoading(false);

        if (error) {
            setError(error.message);
            return;
        }

        setMessage(
            'Enviamos um link para redefinir sua senha. Verifique seu e-mail.',
        );
    };

    return (
        <main className="forgot-password-page">
            <div className="forgot-password-container">
                <div className="forgot-password-logo">
                    <img
                        src="/logo_ofc.png"
                        alt="MeuInvest"
                    />
                </div>

                <header className="forgot-password-header">
                    <h1>Esqueceu sua senha?</h1>

                    <p>
                        Informe seu e-mail para redefinir a senha.
                    </p>
                </header>

                <form
                    className="forgot-password-form"
                    onSubmit={handleSubmit}
                >
                    <div className="forgot-password-field">
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

                    {error && (
                        <p className="forgot-password-error">
                            {error}
                        </p>
                    )}

                    {message && (
                        <p className="forgot-password-success">
                            {message}
                        </p>
                    )}

                    <button
                        type="submit"
                        className="forgot-password-submit"
                        disabled={loading}
                    >
                        {loading
                            ? 'Enviando...'
                            : 'Receber link para nova senha'}
                    </button>
                </form>

                <p className="forgot-password-login">
                    Ou faça{' '}
                    <Link to="/login">
                        login
                    </Link>
                </p>
            </div>
        </main>
    );
}

export default ForgotPassword;