import React, { useState, useEffect } from 'react';
import { Container, Typography, List, ListItem, ListItemText, ListItemAvatar, Avatar, TextField, Dialog, DialogContent } from '@mui/material';
import { getItems, searchItemsByQuery } from '../api';
import '../styles.css';

function ConsultaDeItens() {
  const [items, setItems] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [open, setOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      const items = await getItems();
      setItems(items);
    };
    fetchData();
  }, []);

  const handleSearch = async (e) => {
    const query = e.target.value;
    setSearchQuery(query);
    if (query === '') {
      const items = await getItems();
      setItems(items);
    } else {
      const result = await searchItemsByQuery(query);
      setItems(result);
    }
  };

  const handleClickOpen = (image) => {
    setSelectedImage(image);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedImage('');
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
      <List style={{ marginTop: '20px', display: 'flex', flexWrap: 'wrap' }}>
        {items.map(item => (
          <ListItem key={item.id} className="list-item" style={{ minWidth: '200px', margin: '10px' }}>
            <ListItemAvatar className="list-item-avatar">
              <Avatar src={item.image} onClick={() => handleClickOpen(item.image)} style={{ cursor: 'pointer' }} />
            </ListItemAvatar>
            <ListItemText
              primary={item.name}
              secondary={`AX: ${item.axCode}, Legacy: ${item.legacyCode}`}
            />
          </ListItem>
        ))}
      </List>
      <Dialog open={open} onClose={handleClose}>
        <DialogContent>
          <img src={selectedImage} alt="Item" style={{ width: '100%' }} />
        </DialogContent>
      </Dialog>
    </Container>
  );
}

export default ConsultaDeItens;
