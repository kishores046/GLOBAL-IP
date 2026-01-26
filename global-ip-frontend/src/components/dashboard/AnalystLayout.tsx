import React from 'react';
import { Outlet } from 'react-router-dom';
import { AnalystSidebar } from './AnalystSidebar';

export const AnalystLayoutContext = React.createContext(false);

export const AnalystLayout: React.FC = () => {
  return (
    <AnalystLayoutContext.Provider value={true}>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-slate-50 to-blue-100">
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
