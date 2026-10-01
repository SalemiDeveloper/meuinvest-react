import { Navigate, Outlet } from 'react-router-dom';

import { useAuth } from '../contexts/useAuth';

function ProtectedRoute() {
    const { session, loading } = useAuth();

    if (loading) {
        return <p>Carregando...</p>;
    }

    if (!session) {
        return <Navigate to="/login" replace />;
    }

    return <Outlet />;
}

export default ProtectedRoute;