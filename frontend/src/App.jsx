import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Landing from './pages/site/Landing.jsx';
import Welcome from './pages/site/Welcome.jsx';
import DownloadPage from './pages/site/Download.jsx';
import Changelog from './pages/site/Changelog.jsx';
import Roadmap from './pages/site/Roadmap.jsx';
import Privacy from './pages/site/Privacy.jsx';
import Terms from './pages/site/Terms.jsx';
import Support from './pages/site/Support.jsx';
import About from './pages/site/About.jsx';
import DataDeletion from './pages/site/DataDeletion.jsx';
import Dashboard from './pages/Dashboard.jsx';
import Login from './pages/Login.jsx';
import Register from './pages/Register.jsx';
import Revisions from './pages/Revisions.jsx';
import Profile from './pages/Profile.jsx';
import AIReview from './pages/AIReview.jsx';
import ProtectedRoute from './components/ProtectedRoute.jsx';
import { AuthProvider } from './context/AuthContext.jsx';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Site Pages */}
          <Route path="/" element={<Landing />} />
          <Route path="/welcome" element={<Welcome />} />
          <Route path="/download" element={<DownloadPage />} />
          <Route path="/changelog" element={<Changelog />} />
          <Route path="/roadmap" element={<Roadmap />} />
          <Route path="/privacy" element={<Privacy />} />
          <Route path="/terms" element={<Terms />} />
          <Route path="/support" element={<Support />} />
          <Route path="/about" element={<About />} />
          <Route path="/data-deletion" element={<DataDeletion />} />

          {/* Protected App Core Routes */}
          <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
          <Route path="/revisions" element={<ProtectedRoute><Revisions /></ProtectedRoute>} />
          <Route path="/ai-review" element={<ProtectedRoute><AIReview /></ProtectedRoute>} />
          <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
