import React, { useState, useEffect } from 'react';
import { Container, Typography, List, ListItem, ListItemText, ListItemAvatar, Avatar, TextField } from '@mui/material';
import { searchKitByItemId, getKits } from '../api';
import ImageGallery from 'react-image-gallery';
import Modal from 'react-modal';
import '../styles.css';
import 'react-image-gallery/styles/css/image-gallery.css';

Modal.setAppElement('#root'); // Definir o elemento de app para acessibilidade

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
      <div style={{ display: 'flex', flexWrap: 'wrap' }}>
        {kits.map(kit => (
          <div key={kit.cardNumber} style={{ margin: '10px' }}>
            <Typography variant="h4">
              KIT: {kit.cardNumber}
            </Typography>
            <List style={{ display: 'flex', flexDirection: 'row', flexWrap: 'nowrap', overflowX: 'auto' }}>
              {kit.items.map(item => (
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
      </div>
      <Modal isOpen={isModalOpen} onRequestClose={handleCloseModal} style={{ content: { zIndex: 1000 } }}>
        <ImageGallery items={selectedImages} />
        <button onClick={handleCloseModal}>Fechar</button>
      </Modal>
    </Container>
  );
}

export default ConsultaDeKits;
