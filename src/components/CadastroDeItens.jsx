import React, { useState, useEffect } from 'react';
import { Container, Typography, List, ListItem, ListItemText, ListItemAvatar, Avatar, TextField, Button, IconButton, Dialog, DialogContent } from '@mui/material';
import { getItems, saveItem, deleteItem, updateItem, searchItemsByQuery } from '../api';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import '../styles.css';

function CadastroDeItens() {
  const [items, setItems] = useState([]);
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [newItem, setNewItem] = useState({
    id: '',
    name: '',
    axCode: '',
    legacyCode: '',
    image: null
  });
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

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setNewItem((prevItem) => ({
      ...prevItem,
      [name]: files ? files[0] : value
    }));
  };

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (newItem.id) {
      await updateItem(newItem);
    } else {
      await saveItem(newItem);
    }
    const items = await getItems();
    setItems(items);
    setIsFormVisible(false);
    setNewItem({
      id: '',
      name: '',
      axCode: '',
      legacyCode: '',
      image: null
    });
  };

  const handleEdit = (item) => {
    setNewItem(item);
    setIsFormVisible(true);
  };

  const handleDelete = async (id) => {
    await deleteItem(id);
    const items = await getItems();
    setItems(items);
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
      <Typography variant="h2" gutterBottom>Cadastro de Itens</Typography>
      <Button
        variant="contained"
        color="primary"
        startIcon={<AddIcon />}
        onClick={() => setIsFormVisible(!isFormVisible)}
      >
        {isFormVisible ? 'Cancelar' : 'Cadastrar Item'}
      </Button>
      {isFormVisible && (
        <form onSubmit={handleSubmit} style={{ marginTop: '20px' }}>
          <TextField
            label="Nome"
            name="name"
            fullWidth
            margin="normal"
            value={newItem.name}
            onChange={handleChange}
          />
          <TextField
            label="Código AX"
            name="axCode"
            fullWidth
            margin="normal"
            value={newItem.axCode}
            onChange={handleChange}
          />
          <TextField
            label="Código Legacy"
            name="legacyCode"
            fullWidth
            margin="normal"
            value={newItem.legacyCode}
            onChange={handleChange}
          />
          <input
            type="file"
            name="image"
            accept="image/*"
            onChange={handleChange}
            style={{ marginTop: '20px' }}
          />
          <Button
            type="submit"
            variant="contained"
            color="primary"
            style={{ marginTop: '20px' }}
          >
            Salvar
          </Button>
        </form>
      )}
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
            <IconButton onClick={() => handleEdit(item)}>
              <EditIcon />
            </IconButton>
            <IconButton onClick={() => handleDelete(item.id)}>
              <DeleteIcon />
            </IconButton>
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

export default CadastroDeItens;
