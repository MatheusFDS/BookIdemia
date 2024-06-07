// src/components/Register.js
import React, { useState } from 'react';
import { Container, TextField, Button, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../AuthContext';

function Register() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newUser = await register(name, email, password);
    if (newUser) {
      alert('Usuário registrado com sucesso!');
      navigate('/');
    } else {
      alert('Falha ao registrar usuário');
    }
  };

  return (
    <Container maxWidth="sm">
      <Typography variant="h2" gutterBottom>Registrar</Typography>
      <form onSubmit={handleSubmit}>
        <TextField
          label="Nome"
          fullWidth
          margin="normal"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
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
        <Button type="submit" variant="contained" color="primary" fullWidth margin="normal">Registrar</Button>
      </form>
    </Container>
  );
}

export default Register;
