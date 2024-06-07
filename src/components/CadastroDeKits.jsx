// src/components/CadastroDeKits.js
import React, { useState, useEffect } from 'react';
import { Container, Typography, List, ListItem, ListItemText, IconButton, ListItemAvatar, Avatar, Button, FormControl, InputLabel, Select, MenuItem, TextField, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';
import { getItems, saveKitComposition, deleteKitComposition, getKits } from '../api';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';

function CadastroDeKits() {
  const [items, setItems] = useState([]);
  const [kitItems, setKitItems] = useState([]);
  const [selectedItem, setSelectedItem] = useState('');
  const [kitName, setKitName] = useState('');
  const [kits, setKits] = useState([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      const allItems = await getItems();
      setItems(allItems);
      const savedKits = await getKits();
      setKits(savedKits);
    };
    fetchData();
  }, []);

  const handleAddItem = () => {
    if (selectedItem) {
      const item = items.find(i => i.id === selectedItem);
      if (!kitItems.some(kitItem => kitItem.id === item.id)) {
        setKitItems([...kitItems, item]);
      }
      setSelectedItem('');
    }
  };

  const handleDeleteItem = (itemId) => {
    setKitItems(kitItems.filter(item => item.id !== itemId));
  };

  const handleSaveKit = async () => {
    if (kitName && kitItems.length > 0) {
      await saveKitComposition(kitName, kitItems.map(item => item.id));
      setKitItems([]);
      setKitName('');
      const savedKits = await getKits();
      setKits(savedKits);
      alert('Kit salvo com sucesso!');
    } else {
      alert('Por favor, preencha o nome do kit e adicione pelo menos um item.');
    }
  };

  const handleDeleteKit = async (cardNumber) => {
    await deleteKitComposition(cardNumber);
    const savedKits = await getKits();
    setKits(savedKits);
    alert('Kit deletado com sucesso!');
  };

  const handleImageClick = (image) => {
    setPreviewImage(image);
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setPreviewImage(null);
  };

  return (
    <Container>
      <Typography variant="h2" gutterBottom>Cadastro de Kits</Typography>
      <TextField
        label="Nome do Kit"
        fullWidth
        margin="normal"
        value={kitName}
        onChange={(e) => setKitName(e.target.value)}
      />
      <FormControl fullWidth margin="normal">
        <InputLabel id="item-label">Adicionar Item</InputLabel>
        <Select
          labelId="item-label"
          value={selectedItem}
          onChange={(e) => setSelectedItem(e.target.value)}
        >
          {items.map(item => (
            <MenuItem key={item.id} value={item.id}>
              {item.name}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      <Button variant="contained" color="primary" onClick={handleAddItem} startIcon={<AddIcon />}>
        Adicionar Item
      </Button>
      <List>
        {kitItems.map(item => (
          <ListItem key={item.id}>
            <ListItemAvatar>
              <Avatar src={item.image} onClick={() => handleImageClick(item.image)} />
            </ListItemAvatar>
            <ListItemText
              primary={item.name}
              secondary={`AX: ${item.axCode}, Legacy: ${item.legacyCode}`}
            />
            <IconButton onClick={() => handleDeleteItem(item.id)}><DeleteIcon /></IconButton>
          </ListItem>
        ))}
      </List>
      <Button variant="contained" color="primary" onClick={handleSaveKit} style={{ marginRight: '10px' }}>
        Salvar Kit
      </Button>
      <Typography variant="h4" gutterBottom style={{ marginTop: '20px' }}>Kits Cadastrados</Typography>
      <List>
        {kits.map(kit => (
          <div key={kit.cardNumber}>
            <Typography variant="h5">Cartão: {kit.cardNumber}</Typography>
            <List>
              {kit.items.map(item => (
                <ListItem key={item.id}>
                  <ListItemAvatar>
                    <Avatar src={item.image} onClick={() => handleImageClick(item.image)} />
                  </ListItemAvatar>
                  <ListItemText
                    primary={item.name}
                    secondary={`AX: ${item.axCode}, Legacy: ${item.legacyCode}`}
                  />
                  <IconButton onClick={() => handleDeleteKit(kit.cardNumber)}><DeleteIcon /></IconButton>
                </ListItem>
              ))}
            </List>
          </div>
        ))}
      </List>
      <Dialog open={isDialogOpen} onClose={handleCloseDialog}>
        <DialogTitle>Imagem do Item</DialogTitle>
        <DialogContent>
          <img src={previewImage} alt="Item" style={{ width: '100%' }} />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} color="primary">Fechar</Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}

export default CadastroDeKits;
