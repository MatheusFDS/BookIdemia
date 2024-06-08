// src/components/Login.js
import React, { useState } from 'react';
import { Container, TextField, Button, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../AuthContext';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const user = await login(email, password);
    if (user) {
      navigate('/consulta-de-itens');
    } else {
      alert('Email ou senha inválidos');
    }
  };

  return (
    <Container maxWidth="sm">
      <Typography variant="h2" gutterBottom>Login</Typography>
      <form onSubmit={handleSubmit}>
        <TextField
          label="Email"
          fullWidth
          margin="normal"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <TextField
          label="Senha"
          type="password"
          fullWidth
          margin="normal"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <Button type="submit" variant="contained" color="primary" fullWidth margin="normal">Login</Button>
      </form>
      <Button variant="text" color="primary" fullWidth margin="normal" onClick={() => navigate('/register')}>Registrar</Button>
    </Container>
  );
}

export default Login;
