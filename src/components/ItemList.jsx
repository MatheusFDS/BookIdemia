// src/components/ItemList.js
import React, { useState, useEffect } from 'react';
import { Container, Typography, List, ListItem, ListItemText, IconButton, ListItemAvatar, Avatar, TextField } from '@mui/material';
import { Link } from 'react-router-dom';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { deleteItem, getItems, searchItems } from '../api';

function ItemList() {
  const [items, setItems] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      const result = await getItems();
      setItems(result);
    };
    fetchData();
  }, []);

  const handleSearch = async (e) => {
    const query = e.target.value;
    setSearchQuery(query);
    if (query) {
      const result = await searchItems(query);
      setItems(result);
    } else {
      const result = await getItems();
      setItems(result);
    }
  };

  const handleDelete = async (id) => {
    await deleteItem(id);
    setItems(items.filter(item => item.id !== id));
  };

  return (
    <Container>
      <Typography variant="h2" gutterBottom>Consulta de Itens</Typography>
      <TextField
        label="Pesquisar Itens"
        fullWidth
        margin="normal"
        value={searchQuery}
        onChange={handleSearch}
      />
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
            <IconButton component={Link} to={`/item-form/${item.id}`}><EditIcon /></IconButton>
            <IconButton onClick={() => handleDelete(item.id)}><DeleteIcon /></IconButton>
          </ListItem>
        ))}
      </List>
    </Container>
  );
}

export default ItemList;
