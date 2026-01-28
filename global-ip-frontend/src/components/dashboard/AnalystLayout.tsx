import React from 'react';
import { Outlet } from 'react-router-dom';
import { AnalystSidebar } from './AnalystSidebar';
import { DashboardHeader } from './DashboardHeader';
import { useAuth } from '../../context/AuthContext';

export const AnalystLayoutContext = React.createContext(false);

export const AnalystLayout: React.FC = () => {
  const { user } = useAuth();

  return (
    <AnalystLayoutContext.Provider value={true}>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-slate-50 to-blue-100">
        <DashboardHeader userName={user?.name || user?.username || 'Analyst'} />
        <div className="flex">
          <AnalystSidebar />

          <main className="flex-1 p-8 overflow-y-auto">
            <Outlet />
          </main>
        </div>
      </div>
    </AnalystLayoutContext.Provider>
  );
};

export default AnalystLayout;
