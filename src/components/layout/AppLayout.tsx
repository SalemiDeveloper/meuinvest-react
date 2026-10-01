import { useState } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';

import {
    BarChart3,
    CircleDollarSign,
    CircleHelp,
    FileSpreadsheet,
    FileText,
    LayoutDashboard,
    LogOut,
    PanelLeftClose,
    PanelLeftOpen,
    Settings,
    ChevronUp,
    ChevronDown,
} from 'lucide-react';

import { useAuth } from '../../contexts/useAuth';
import { supabase } from '../../lib/supabase';

import './AppLayout.css';

const menuItems = [
    {
        label: 'Dashboard',
        path: '/dashboard',
        icon: LayoutDashboard,
    },
    {
        label: 'Importar relatório',
        path: '/importar-relatorio',
        icon: FileSpreadsheet,
    },
    {
        label: 'Relatórios',
        path: '/relatorios',
        icon: FileText,
    },
    {
        label: 'Análise mensal',
        path: '/analise-mensal',
        icon: BarChart3,
    },
    {
        label: 'Evolução',
        path: '/evolucao',
        icon: BarChart3,
    },
    {
        label: 'Análise Individual',
        path: '/analise-individual',
        icon: CircleDollarSign,
    },
    {
        label: 'Como funciona',
        path: '/como-funciona',
        icon: CircleHelp,
    },
];

function AppLayout() {
    const navigate = useNavigate();
    const { user } = useAuth();

    const [profileMenuOpen, setProfileMenuOpen] =
        useState(false);

    const [sidebarCollapsed, setSidebarCollapsed] =
        useState(false);

    const handleToggleSidebar = () => {
        setSidebarCollapsed(current => !current);
        setProfileMenuOpen(false);
    };

    const handleLogout = async () => {
        try {
            await supabase.auth.signOut();
            navigate('/login', { replace: true });
        } catch (error) {
            console.error(
                'Não foi possível sair da conta:',
                error,
            );
        }
    };

    const email = user?.email ?? '';

    const displayName =
        user?.user_metadata?.name ??
        user?.user_metadata?.full_name ??
        'Usuário';

    const initial = displayName
        .charAt(0)
        .toUpperCase();

    return (
        <div
            className={`app-layout ${
                sidebarCollapsed
                    ? 'sidebar-collapsed'
                    : ''
            }`}
        >
            <aside className="app-sidebar">
                <div className="app-sidebar-content">
                    <div className="app-brand">
                        <img
                            src="/logo_ofc.png"
                            alt="MeuInvest"
                            className="app-brand-logo"
                        />

                        <span>MeuInvest</span>
                    </div>

                    <div className="app-menu-label">
                        Menu Principal
                    </div>

                    <nav className="app-nav">
                        {menuItems.map(item => {
                            const Icon = item.icon;

                            return (
                                <NavLink
                                    key={item.path}
                                    to={item.path}
                                    title={
                                        sidebarCollapsed
                                            ? item.label
                                            : undefined
                                    }
                                    className={({ isActive }) =>
                                        `app-nav-link ${
                                            isActive
                                                ? 'active'
                                                : ''
                                        }`
                                    }
                                >
                                    <Icon size={16} />

                                    <span>
                                        {item.label}
                                    </span>
                                </NavLink>
                            );
                        })}
                    </nav>
                </div>

                <div className="app-sidebar-footer">
                    {profileMenuOpen && (
                        <div className="app-profile-menu">
                            <button
                                type="button"
                                className="app-profile-menu-item"
                                onClick={() => {
                                    setProfileMenuOpen(false);
                                    navigate('/configuracoes');
                                }}
                            >
                                <Settings size={17} />

                                <span>
                                    Configurações
                                </span>
                            </button>

                            <button
                                type="button"
                                className="app-profile-menu-item logout"
                                onClick={handleLogout}
                            >
                                <LogOut size={17} />

                                <span>Sair</span>
                            </button>
                        </div>
                    )}

                    <button
                        type="button"
                        className={`app-profile ${
                            profileMenuOpen
                                ? 'menu-open'
                                : ''
                        }`}
                        onClick={() =>
                            setProfileMenuOpen(
                                current => !current,
                            )
                        }
                        title={
                            sidebarCollapsed
                                ? displayName
                                : undefined
                        }
                    >
                        <div className="app-profile-avatar">
                            {initial}
                        </div>

                        <div className="app-profile-info">
                            <strong>{displayName}</strong>

                            <span>{email}</span>
                        </div>

                        {profileMenuOpen ? (
                            <ChevronDown
                                size={16}
                                className="app-profile-chevron"
                            />
                        ) : (
                            <ChevronUp
                                size={16}
                                className="app-profile-chevron"
                            />
                        )}
                    </button>
                </div>
            </aside>

            <div className="app-main">
                <header className="app-topbar">
                    <button
                        type="button"
                        className="app-menu-button"
                        onClick={handleToggleSidebar}
                        aria-label={
                            sidebarCollapsed
                                ? 'Expandir menu'
                                : 'Recolher menu'
                        }
                        aria-expanded={!sidebarCollapsed}
                    >
                        {sidebarCollapsed ? (
                            <PanelLeftOpen size={17} />
                        ) : (
                            <PanelLeftClose size={17} />
                        )}
                    </button>
                </header>

                <div className="app-content">
                    <Outlet />
                </div>
            </div>
        </div>
    );
}

export default AppLayout;