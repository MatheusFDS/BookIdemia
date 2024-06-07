// src/components/ConsultaDeItens.js
import React, { useState, useEffect } from 'react';
import { Container, Typography, List, ListItem, ListItemText, ListItemAvatar, Avatar, TextField } from '@mui/material';
import { getItems, searchItems } from '../api';
import ImageGallery from 'react-image-gallery';
import Modal from 'react-modal';
import '../styles.css';

function ConsultaDeItens() {
  const [items, setItems] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedImages, setSelectedImages] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

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
          <ListItem key={item.id} className="list-item">
            <ListItemAvatar className="list-item-avatar">
              <Avatar src={item.image} onClick={() => handleImageClick([item.image])} />
            </ListItemAvatar>
            <ListItemText
              primary={item.name}
              secondary={`AX: ${item.axCode}, Legacy: ${item.legacyCode}`}
              className="list-item-text"
            />
          </ListItem>
        ))}
      </List>
      <Modal isOpen={isModalOpen} onRequestClose={handleCloseModal} className="modal" overlayClassName="overlay" ariaHideApp={false}>
        <div className="modal-content">
          <ImageGallery items={selectedImages} className="image-gallery" />
          <button onClick={handleCloseModal}>Fechar</button>
        </div>
      </Modal>
    </Container>
  );
}

export default ConsultaDeItens;
