import React, { useState, useEffect } from 'react';
import { Container, Typography, List, ListItem, ListItemText, ListItemAvatar, Avatar, TextField, Button, IconButton } from '@mui/material';
import { getKits, saveKitComposition, getItems, deleteKitComposition, updateKitComposition, searchItemsByQuery, searchKitByItemId } from '../api';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import ImageGallery from 'react-image-gallery';
import Modal from 'react-modal';
import '../styles.css';
import 'react-image-gallery/styles/css/image-gallery.css';

Modal.setAppElement('#root'); // Definir o elemento de app para acessibilidade

function CadastroDeKits() {
  const [kits, setKits] = useState([]);
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [newKit, setNewKit] = useState({
    cardNumber: '',
    itemIds: []
  });
  const [items, setItems] = useState([]);
  const [itemQuery, setItemQuery] = useState('');
  const [searchedItems, setSearchedItems] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedImages, setSelectedImages] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const kits = await getKits();
      setKits(kits || []);
      const items = await getItems();
      setItems(items || []);
    };
    fetchData();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewKit((prevKit) => ({
      ...prevKit,
      [name]: value
    }));
  };

  const handleItemSearch = async (e) => {
    const query = e.target.value;
    setItemQuery(query);
    if (query === '') {
      const items = await getItems();
      setSearchedItems(items || []);
    } else {
      const items = await searchItemsByQuery(query);
      setSearchedItems(items || []);
    }
  };

  const handleAddItem = (item) => {
    setNewKit((prevKit) => ({
      ...prevKit,
      itemIds: [...prevKit.itemIds, item.id]
    }));
    setSearchedItems([]);
    setItemQuery('');
  };

  const handleRemoveItem = (itemId) => {
    setNewKit((prevKit) => ({
      ...prevKit,
      itemIds: prevKit.itemIds.filter(id => id !== itemId)
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (newKit.cardNumber) {
      await updateKitComposition(newKit.cardNumber, newKit.itemIds);
    } else {
      await saveKitComposition(newKit.cardNumber, newKit.itemIds);
    }
    const kits = await getKits();
    setKits(kits || []);
    setIsFormVisible(false);
    setNewKit({
      cardNumber: '',
      itemIds: []
    });
  };

  const handleEdit = (kit) => {
    setNewKit({
      cardNumber: kit.cardNumber,
      itemIds: kit.items ? kit.items.map(item => item.id) : []
    });
    setIsFormVisible(true);
  };

  const handleDelete = async (cardNumber) => {
    await deleteKitComposition(cardNumber);
    const kits = await getKits();
    setKits(kits || []);
  };

  const handleImageClick = (images) => {
    const formattedImages = images.map(image => ({
      original: image,
      thumbnail: image
    }));
    setSelectedImages(formattedImages);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedImages([]);
  };

  const handleKitSearch = async (e) => {
    const query = e.target.value.toLowerCase();
    setItemQuery(query);
    if (query === '') {
      const kits = await getKits();
      setKits(kits || []);
    } else {
      const kits = await searchKitByItemId(query);
      setKits(kits || []);
    }
  };

  return (
    <Container>
      <Typography variant="h2" gutterBottom>Cadastro de Kits</Typography>
      <Button
        variant="contained"
        color="primary"
        startIcon={<AddIcon />}
        onClick={() => setIsFormVisible(!isFormVisible)}
      >
        {isFormVisible ? 'Cancelar' : 'Cadastrar Kit'}
      </Button>
      {isFormVisible && (
        <form onSubmit={handleSubmit} style={{ marginTop: '20px' }}>
          <TextField
            label="Nome do Kit"
            name="cardNumber"
            fullWidth
            margin="normal"
            value={newKit.cardNumber}
            onChange={handleChange}
          />
          <Typography variant="h6" gutterBottom>Itens</Typography>
          <TextField
            label="Pesquisar Item"
            fullWidth
            margin="normal"
            value={itemQuery}
            onChange={handleItemSearch}
          />
          {searchedItems.length > 0 && (
            <List>
              {searchedItems.map(item => (
                <ListItem key={item.id} button onClick={() => handleAddItem(item)}>
                  <ListItemAvatar>
                    <Avatar src={item.image} />
                  </ListItemAvatar>
                  <ListItemText
                    primary={item.name}
                    secondary={`AX: ${item.axCode}, Legacy: ${item.legacyCode}`}
                  />
                </ListItem>
              ))}
            </List>
          )}
          <List>
            {newKit.itemIds.map(itemId => {
              const item = items.find(i => i.id === itemId);
              return (
                <ListItem key={itemId}>
                  <ListItemAvatar>
                    <Avatar src={item?.image} />
                  </ListItemAvatar>
                  <ListItemText
                    primary={item?.name}
                    secondary={`AX: ${item?.axCode}, Legacy: ${item?.legacyCode}`}
                  />
                  <IconButton onClick={() => handleRemoveItem(itemId)}>
                    <DeleteIcon />
                  </IconButton>
                </ListItem>
              );
            })}
          </List>
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
        label="Pesquisar Kits"
        fullWidth
        margin="normal"
        onChange={handleKitSearch}
      />
      <List style={{ marginTop: '20px', display: 'flex', flexWrap: 'wrap' }}>
        {kits.map(kit => (
          <div key={kit.cardNumber} style={{ margin: '10px' }}>
            <Typography variant="h4">
              KIT: {kit.cardNumber}
              <IconButton onClick={() => handleEdit(kit)}>
                <EditIcon />
              </IconButton>
              <IconButton onClick={() => handleDelete(kit.cardNumber)}>
                <DeleteIcon />
              </IconButton>
            </Typography>
            <List style={{ display: 'flex', flexDirection: 'row', flexWrap: 'nowrap', overflowX: 'auto' }}>
              {(kit.items || []).map(item => (
                <ListItem key={item.id} className="list-item" style={{ minWidth: '200px' }}>
                  <ListItemAvatar className="list-item-avatar">
                    <Avatar onClick={() => handleImageClick(kit.items.map(i => i.image))} style={{ cursor: 'pointer' }}>
                      <img src={item.image} alt={item.name} style={{ width: '100%', height: '100%' }} />
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText
                    primary={item.name}
                    secondary={`AX: ${item.axCode}, Legacy: ${item.legacyCode}`}
                  />
                </ListItem>
              ))}
            </List>
          </div>
        ))}
      </List>
      <Modal isOpen={isModalOpen} onRequestClose={handleCloseModal} style={{ content: { zIndex: 1000 } }}>
        <ImageGallery items={selectedImages} />
        <button onClick={handleCloseModal}>Fechar</button>
      </Modal>
    </Container>
  );
}

export default CadastroDeKits;
