// src/components/ConsultaDeKits.js
import React, { useState, useEffect } from 'react';
import { Container, Typography, List, ListItem, ListItemText, ListItemAvatar, Avatar, TextField } from '@mui/material';
import { searchKitByItemId, getKits } from '../api';
import ImageGallery from 'react-image-gallery';
import Modal from 'react-modal';
import '../styles.css';

function ConsultaDeKits() {
  const [kits, setKits] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedImages, setSelectedImages] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      const savedKits = await getKits();
      setKits(savedKits);
    };
    fetchData();
  }, []);

  const handleSearch = async (e) => {
    const query = e.target.value;
    setSearchQuery(query);
    if (query) {
      const result = await searchKitByItemId(query);
      setKits(result);
    } else {
      const savedKits = await getKits();
      setKits(savedKits);
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
      <Typography variant="h2" gutterBottom>Consulta de Kits</Typography>
      <TextField
        label="Pesquisar Kits por Nome, Código AX ou Código Legacy"
        fullWidth
        margin="normal"
        value={searchQuery}
        onChange={handleSearch}
      />
      {kits.map(kit => (
        <div key={kit.cardNumber}>
          <Typography variant="h4">Cartão: {kit.cardNumber}</Typography>
          <List>
            {kit.items.map(item => (
              <ListItem key={item.id} className="list-item">
                <ListItemAvatar className="list-item-avatar">
                  <Avatar src={item.image} onClick={() => handleImageClick(kit.items.map(i => i.image))} />
                </ListItemAvatar>
                <ListItemText
                  primary={item.name}
                  secondary={`AX: ${item.axCode}, Legacy: ${item.legacyCode}`}
                  className="list-item-text"
                />
              </ListItem>
            ))}
          </List>
        </div>
      ))}
      <Modal isOpen={isModalOpen} onRequestClose={handleCloseModal} className="modal" overlayClassName="overlay" ariaHideApp={false}>
        <div className="modal-content">
          <ImageGallery items={selectedImages} className="image-gallery" />
          <button onClick={handleCloseModal}>Fechar</button>
        </div>
      </Modal>
    </Container>
  );
}

export default ConsultaDeKits;
