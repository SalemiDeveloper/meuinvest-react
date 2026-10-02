import {
    BrowserRouter,
    Route,
    Routes,
} from 'react-router-dom';

import Home from './pages/Home/Home';
import Login from './pages/Login/Login';
// import Register from './pages/Register/Register';
// import ForgotPassword from './pages/ForgotPassword/ForgotPassword';

import Dashboard from './pages/Dashboard/Dashboard';
import ImportReports from './pages/ImportReports/ImportReports';

import AppLayout from './components/layout/AppLayout';

import ProtectedRoute from './routes/ProtectedRoute';
import Reports from './pages/Reports/Reports';
import MonthlyAnalysis from './pages/MonthlyAnalysis/MonthlyAnalysis';
import Evolution from './pages/Evolution/Evolution';
import InvestmentAnalysis from './pages/InvestmentAnalysis/InvestmentAnalysis';
import HowItWorks from './pages/HowItWorks/HowItWorks';
import Settings from './pages/Settings/Settings';

function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route
                    path="/"
                    element={<Home />}
                />

                <Route
                    path="/login"
                    element={<Login />}
                />

                {/* <Route
                    path="/register"
                    element={<Register />}
                /> */}

                {/* <Route
                    path="/recuperar-senha"
                    element={<ForgotPassword />}
                /> */}

                <Route element={<ProtectedRoute />}>
                    <Route element={<AppLayout />}>
                        <Route
                            path="/dashboard"
                            element={<Dashboard />}
                        />

                        <Route
                            path="/importar-relatorio"
                            element={<ImportReports />}
                        />

                        <Route
                            path="/relatorios"
                            element={<Reports />}
                        />

                        <Route
                            path="/analise-mensal"
                            element={<MonthlyAnalysis />}
                        />

                        <Route
                            path="/evolucao"
                            element={<Evolution />}
                        />

                        <Route
                            path="/analise-individual"
                            element={<InvestmentAnalysis />}
                        />

                        <Route
                            path="/como-funciona"
                            element={<HowItWorks />}
                        />

                        <Route
                            path="/configuracoes"
                            element={<Settings />}
                        />
                    </Route>
                </Route>
            </Routes>
        </BrowserRouter>
    );
}

export default App;