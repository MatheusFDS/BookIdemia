// src/components/CadastroDeItens.js
import React, { useState, useEffect } from 'react';
import { Container, Typography, List, ListItem, ListItemText, IconButton, ListItemAvatar, Avatar, Button, TextField, FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import { getItems, saveItem, updateItem, deleteItem, getItemById } from '../api';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

function CadastroDeItens() {
  const [items, setItems] = useState([]);
  const [itemData, setItemData] = useState({
    id: '',
    name: '',
    type: '',
    axCode: '',
    legacyCode: '',
    image: null
  });
  const [previewImage, setPreviewImage] = useState(null);
  const [isEditMode, setIsEditMode] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      const result = await getItems();
      setItems(result);
    };
    fetchData();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setItemData({ ...itemData, [name]: value });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setItemData({ ...itemData, image: file });
    setPreviewImage(URL.createObjectURL(file));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isEditMode) {
      await updateItem(itemData);
    } else {
      await saveItem(itemData);
    }
    setItemData({
      id: '',
      name: '',
      type: '',
      axCode: '',
      legacyCode: '',
      image: null
    });
    setPreviewImage(null);
    setIsEditMode(false);
    const result = await getItems();
    setItems(result);
  };

  const handleEdit = async (id) => {
    const item = await getItemById(id);
    setItemData(item);
    setPreviewImage(item.image);
    setIsEditMode(true);
  };

  const handleDelete = async (id) => {
    await deleteItem(id);
    const result = await getItems();
    setItems(result);
  };

  return (
    <Container>
      <Typography variant="h2" gutterBottom>Cadastro de Itens</Typography>
      <form onSubmit={handleSubmit}>
        <TextField
          label="Nome"
          fullWidth
          margin="normal"
          name="name"
          value={itemData.name}
          onChange={handleChange}
        />
        <FormControl fullWidth margin="normal">
          <InputLabel id="type-label">Tipo</InputLabel>
          <Select
            labelId="type-label"
            name="type"
            value={itemData.type}
            onChange={handleChange}
          >
            <MenuItem value="cartao">Cartão de Crédito</MenuItem>
            <MenuItem value="carta">Carta Berço</MenuItem>
            <MenuItem value="insert">Insert</MenuItem>
            <MenuItem value="envelope">Envelope</MenuItem>
          </Select>
        </FormControl>
        <TextField
          label="Código AX"
          fullWidth
          margin="normal"
          name="axCode"
          value={itemData.axCode}
          onChange={handleChange}
        />
        <TextField
          label="Código Legacy"
          fullWidth
          margin="normal"
          name="legacyCode"
          value={itemData.legacyCode}
          onChange={handleChange}
        />
        <Button
          variant="contained"
          component="label"
          fullWidth
          margin="normal"
        >
          Upload Imagem
          <input
            type="file"
            hidden
            onChange={handleImageChange}
          />
        </Button>
        {previewImage && (
          <img src={previewImage} alt="Preview" style={{ width: '100%', marginTop: '10px' }} />
        )}
        <Button
          type="submit"
          variant="contained"
          color="primary"
          fullWidth
          margin="normal"
        >
          {isEditMode ? 'Atualizar' : 'Salvar'}
        </Button>
      </form>
      <Typography variant="h4" gutterBottom style={{ marginTop: '20px' }}>Itens Cadastrados</Typography>
      <List>
        {items.map(item => (
          <ListItem key={item.id}>
            <ListItemAvatar>
              <Avatar src={item.image} />
            </ListItemAvatar>
            <ListItemText
              primary={item.name}
              secondary={`AX: ${item.axCode}, Legacy: ${item.legacyCode}`}
            />
            <IconButton onClick={() => handleEdit(item.id)}><EditIcon /></IconButton>
            <IconButton onClick={() => handleDelete(item.id)}><DeleteIcon /></IconButton>
          </ListItem>
        ))}
      </List>
    </Container>
  );
}

export default CadastroDeItens;
