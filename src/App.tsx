import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthContextProvider } from './context/AuthContext';
import { WalletProvider } from './contexts/WalletContext';
import { Home } from './pages/Home';
import { CreateProject } from './pages/CreateProject';
import { ProjectDetails } from './pages/ProjectDetails';
import { Navigation } from './components/Navigation';
import { UserDashboard } from './pages/UserDashboard';
import { PrivyProviderWrapper } from './providers/PrivyProviderWrapper';

function App() {
  return (
    <PrivyProviderWrapper>
      <WalletProvider>
        <AuthContextProvider>
          <Router>
            <div className="min-h-screen bg-gray-50">
              <Navigation />
              <main className="container mx-auto px-4 py-8">
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/create-project" element={<CreateProject />} />
                  <Route path="/project/:id" element={<ProjectDetails />} />
                  <Route path="/dashboard" element={<UserDashboard />} />
                </Routes>
              </main>
            </div>
          </Router>
        </AuthContextProvider>
      </WalletProvider>
    </PrivyProviderWrapper>
  );
}

export default App;