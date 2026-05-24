import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import ThemeToggle from './ThemeToggle';

const Login = () => {
    const { login } = useAuth();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(null);
    const [submitting, setSubmitting] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        setError(null);
        setSubmitting(true);

        const result = login(username.trim(), password);
        if (!result.success) {
            setError(result.error);
        }
        setSubmitting(false);
    };

    return (
        <div className="min-h-screen bg-base-200 flex items-center justify-center px-4 relative">
            <div className="absolute top-4 right-4">
                <ThemeToggle />
            </div>
            <div className="card w-full max-w-md bg-base-100 shadow-xl border border-base-300">
                <div className="card-body">
                    <div className="text-center mb-2">
                        <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-primary/10 text-primary mb-3">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                            </svg>
                        </div>
                        <h1 className="text-2xl font-bold">Panel de Administración</h1>
                        <p className="text-base-content/60 text-sm mt-1">Ingresa tus credenciales para continuar</p>
                    </div>

                    {error && (
                        <div className="alert alert-error text-sm py-2">
                            <span>{error}</span>
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-4 mt-2">
                        <div className="form-control">
                            <label className="label" htmlFor="username">
                                <span className="label-text font-medium">Usuario</span>
                            </label>
                            <input
                                id="username"
                                type="text"
                                className="input input-bordered w-full focus:input-primary"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                placeholder="admin"
                                autoComplete="username"
                                required
                            />
                        </div>

                        <div className="form-control">
                            <label className="label" htmlFor="password">
                                <span className="label-text font-medium">Contraseña</span>
                            </label>
                            <input
                                id="password"
                                type="password"
                                className="input input-bordered w-full focus:input-primary"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="••••••••"
                                autoComplete="current-password"
                                required
                            />
                        </div>

                        <button
                            type="submit"
                            className="btn btn-primary w-full mt-2"
                            disabled={submitting}
                        >
                            {submitting ? (
                                <span className="loading loading-spinner loading-sm"></span>
                            ) : (
                                'Iniciar sesión'
                            )}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Login;
