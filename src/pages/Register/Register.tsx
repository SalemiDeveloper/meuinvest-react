import {
    type FormEvent,
    useState,
} from 'react';
import { Link, useNavigate } from 'react-router-dom';

import { supabase } from '../../lib/supabase';

function Register() {
    const navigate = useNavigate();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [passwordConfirmation, setPasswordConfirmation] =
        useState('');

    const [error, setError] = useState<string | null>(null);
    const [message, setMessage] = useState<string | null>(null);
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

        const { data, error } = await supabase.auth.signUp({
            email,
            password,
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
        <main>
            <h1>Criar conta</h1>

            <form onSubmit={handleSubmit}>
                <div>
                    <label htmlFor="email">E-mail</label>

                    <input
                        id="email"
                        type="email"
                        value={email}
                        onChange={(event) => setEmail(event.target.value)}
                        required
                    />
                </div>

                <div>
                    <label htmlFor="password">Senha</label>

                    <input
                        id="password"
                        type="password"
                        value={password}
                        onChange={(event) =>
                            setPassword(event.target.value)
                        }
                        minLength={6}
                        required
                    />
                </div>

                <div>
                    <label htmlFor="password-confirmation">
                        Confirmar senha
                    </label>

                    <input
                        id="password-confirmation"
                        type="password"
                        value={passwordConfirmation}
                        onChange={(event) =>
                            setPasswordConfirmation(
                                event.target.value,
                            )
                        }
                        minLength={6}
                        required
                    />
                </div>

                {error && <p>{error}</p>}

                {message && <p>{message}</p>}

                <button type="submit" disabled={loading}>
                    {loading ? 'Criando conta...' : 'Criar conta'}
                </button>
            </form>

            <p>
                Já possui uma conta?{' '}
                <Link to="/login">Entrar</Link>
            </p>
        </main>
    );
}

export default Register;