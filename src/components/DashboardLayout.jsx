// Wraps all dashboard pages with sidebar + main content area
// So we don't repeat the sidebar on every page

import Sidebar from './Sidebar';

const DashboardLayout = ({ children }) => {
  return (
    <div style={{
      display: 'flex',
      minHeight: '100vh',
      backgroundColor: '#f5f5f5',
    }}>

      {/* Sidebar */}
      <Sidebar />

      {/* Main content - pushed right by sidebar width */}
      <div style={{
        flex: 1,
        marginLeft: '240px',
        padding: '32px',
        minHeight: '100vh',
      }}>
        {children}
      </div>

    </div>
  );
};

export default DashboardLayout;