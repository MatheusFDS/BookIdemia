// src/App.js
import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import Navbar from './components/Navbar';
import Login from './components/login';
import Register from './components/Register';
import CadastroDeItens from './components/CadastroDeItens';
import ConsultaDeItens from './components/ConsultaDeItens';
import CadastroDeKits from './components/CadastroDeKits';
import ConsultaDeKits from './components/ConsultaDeKits';
import theme from './theme';
import { AuthProvider, useAuth } from './AuthContext';
import './styles.css';

const PrivateRoute = ({ children }) => {
  const { user } = useAuth();
  return user ? children : <Navigate to="/" />;
};

function App() {
  return (
    <ThemeProvider theme={theme}>
      <AuthProvider>
        <Router>
          <Navbar />
          <div className="container">
            <Routes>
              <Route path="/" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route
                path="/*"
                element={
                  <PrivateRoute>
                    <Routes>
                      <Route path="consulta-de-itens" element={<ConsultaDeItens />} />
                      <Route path="cadastro-de-itens" element={<CadastroDeItens />} />
                      <Route path="consulta-de-kits" element={<ConsultaDeKits />} />
                      <Route path="cadastro-de-kits" element={<CadastroDeKits />} />
                    </Routes>
                  </PrivateRoute>
                }
              />
            </Routes>
          </div>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
