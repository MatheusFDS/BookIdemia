// src/components/Navbar.js
import React from 'react';
import { AppBar, Toolbar, Typography, Button } from '@mui/material';
import { Link } from 'react-router-dom';
import { useAuth } from '../AuthContext';
import '../styles.css';

function Navbar() {
  const { user, logout } = useAuth();

  return (
    <AppBar position="static" className="navbar">
      <Toolbar>
        <Typography variant="h6" style={{ flexGrow: 1 }}>
          Sistema de Gerenciamento
        </Typography>
        {user ? (
          <>
            <Button color="inherit" component={Link} to="/consulta-de-itens">Consulta de Itens</Button>
            <Button color="inherit" component={Link} to="/cadastro-de-itens">Cadastro de Itens</Button>
            <Button color="inherit" component={Link} to="/consulta-de-kits">Consulta de Kits</Button>
            <Button color="inherit" component={Link} to="/cadastro-de-kits">Cadastro de Kits</Button>
            <Button color="inherit" onClick={logout}>Logout</Button>
          </>
        ) : (
          <>
            <Button color="inherit" component={Link} to="/">Login</Button>
            <Button color="inherit" component={Link} to="/register">Registrar</Button>
          </>
        )}
      </Toolbar>
    </AppBar>
  );
}

export default Navbar;
