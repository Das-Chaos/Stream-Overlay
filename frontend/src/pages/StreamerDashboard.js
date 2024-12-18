import React, { useState, useEffect } from 'react';
import { Stage, Layer, Text, Image, Transformer } from 'react-konva';
import useImage from 'use-image';
import axios from 'axios';
import { Tooltip } from 'react-tooltip';

const URLImage = ({ imageUrl, x, y, id, onClick }) => {
  const [image] = useImage(imageUrl);
  return <Image image={image} x={x} y={y} draggable onClick={onClick} />;
};

const StreamerDashboard = () => {
  const [elements, setElements] = useState([
    { type: 'text', x: 50, y: 60, text: 'Sample Text', id: 'text1' },
    { type: 'image', x: 150, y: 160, imageUrl: 'https://via.placeholder.com/150', id: 'image1' }
  ]);
  const [selectedId, setSelectedId] = useState(null);

  const handleSelect = (e, id) => {
    e.cancelBubble = true;
    setSelectedId(id);
  };

  const handleSave = async () => {
    try {
      await axios.post('/api/overlays', { elements }, {
        headers: { 'x-auth-token': localStorage.getItem('token') }
      });
      alert('Overlay saved successfully!');
    } catch (error) {
      console.error('Error saving overlay', error);
    }
  };

  const handleLoad = async () => {
    try {
      const response = await axios.get('/api/overlays', {
        headers: { 'x-auth-token': localStorage.getItem('token') }
      });
      setElements(response.data.elements);
    } catch (error) {
      console.error('Error loading overlay', error);
    }
  };

  const addTextElement = () => {
    const newText = {
      type: 'text',
      x: 100,
      y: 100,
      text: 'New Text',
      id: `text${elements.length + 1}`
    };
    setElements([...elements, newText]);
  };

  const addImageElement = () => {
    const newImage = {
      type: 'image',
      x: 200,
      y: 200,
      imageUrl: 'https://via.placeholder.com/150',
      id: `image${elements.length + 1}`
    };
    setElements([...elements, newImage]);
  };

  const handleDelete = () => {
    if (selectedId) {
      setElements(elements.filter(element => element.id !== selectedId));
      setSelectedId(null);
    }
  };

  return (
    <div style={{ padding: '20px' }}>
      <h1>Streamer Dashboard</h1>
      <div style={{ marginBottom: '10px' }}>
        <button onClick={addTextElement} data-tip="Add a new text element">Add Text</button>
        <button onClick={addImageElement} data-tip="Add a new image element">Add Image</button>
        <button onClick={handleDelete} disabled={!selectedId} data-tip="Delete the selected element">Delete Selected</button>
        <button onClick={handleSave} data-tip="Save the current overlay">Save Overlay</button>
        <button onClick={handleLoad} data-tip="Load the saved overlay">Load Overlay</button>
        <Tooltip place="top" type="dark" effect="solid" />
      </div>
      <Stage
        width={window.innerWidth}
        height={window.innerHeight - 100}
        onClick={() => setSelectedId(null)}
      >
        <Layer>
          {elements.map(element => {
            if (element.type === 'text') {
              return (
                <Text
                  key={element.id}
                  text={element.text}
                  x={element.x}
                  y={element.y}
                  draggable
                  onClick={(e) => handleSelect(e, element.id)}
                />
              );
            } else if (element.type === 'image') {
              return (
                <URLImage
                  key={element.id}
                  imageUrl={element.imageUrl}
                  x={element.x}
                  y={element.y}
                  id={element.id}
                  onClick={(e) => handleSelect(e, element.id)}
                />
              );
            }
            return null;
          })}
          {selectedId && (
            <Transformer
              nodes={elements.filter(el => el.id === selectedId).map(el => el.ref)}
            />
          )}
        </Layer>
      </Stage>
    </div>
  );
};

export default StreamerDashboard;
