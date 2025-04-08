import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './styles.css';
import './styles/landing-page.css';
import App from './App';
import UserRegistration from './components/UserRegistration';
import LandingPage from './components/LandingPage';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/cadastro-usuarios" element={<UserRegistration />} />
        <Route path="/lp" element={<LandingPage />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);
