import React, { useState, useEffect } from 'react';
import { useCookies } from 'react-cookie';
import styled from 'styled-components';

const App = () => {
  const [image, setImage] = useState(null);
  const [imageDimensions, setImageDimensions] = useState({ width: 0, height: 0 });
  const [cookies, setCookie] = useCookies(['uploadedImage']);
  const [savedImages, setSavedImages] = useState([]);
  const [showSavedImages, setShowSavedImages] = useState(false);

  // Load the image and saved images from cookies and localStorage
  useEffect(() => {
    if (cookies.uploadedImage) {
      setImage(cookies.uploadedImage);
    }
    const storedImages = JSON.parse(localStorage.getItem('savedImages')) || [];
    setSavedImages(storedImages);
  }, [cookies]);

  // Handle image upload
  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const imageData = reader.result;
        setImage(imageData);
        setCookie('uploadedImage', imageData, { path: '/' });
      };
      reader.readAsDataURL(file);
    }
  };

  // Save the current image to localStorage
  const saveImageToLocalStorage = () => {
    if (image) {
      const updatedSavedImages = [...savedImages, image];
      setSavedImages(updatedSavedImages);
      localStorage.setItem('savedImages', JSON.stringify(updatedSavedImages));
    }
  };

  // Set a saved image as the active image
  const handleSavedImageClick = (selectedImage) => {
    setImage(selectedImage);
    setCookie('uploadedImage', selectedImage, { path: '/' });
    setShowSavedImages(false);
  };

  // Handle image load and get its dimensions
  const handleImageLoad = (e) => {
    const { naturalWidth, naturalHeight } = e.target;
    setImageDimensions({ width: naturalWidth, height: naturalHeight });
  };

  return (
    <AppContainer>
      <Header>
        <SavedImagesLink onClick={() => setShowSavedImages(!showSavedImages)}>
          Saved Images
        </SavedImagesLink>
      </Header>

      <UploadButton>
        <input type="file" accept="image/*" onChange={handleImageUpload} />
        <span>Upload Image</span>
      </UploadButton>

      {image && (
        <>
          <ImageContainer>
            <img src={image} alt="Uploaded" onLoad={handleImageLoad} />
            <GridOverlay width={imageDimensions.width} height={imageDimensions.height} />
          </ImageContainer>
          <SaveButton onClick={saveImageToLocalStorage}>Save to Local Storage</SaveButton>
        </>
      )}

      {showSavedImages && (
        <SavedImagesModal>
          <CloseButton onClick={() => setShowSavedImages(false)}>X</CloseButton>
          {savedImages.length > 0 ? (
            savedImages.map((savedImage, index) => (
              <SavedImage
                key={index}
                src={savedImage}
                alt={`Saved ${index}`}
                onClick={() => handleSavedImageClick(savedImage)}
              />
            ))
          ) : (
            <NoSavedImages>No saved images yet.</NoSavedImages>
          )}
        </SavedImagesModal>
      )}
    </AppContainer>
  );
};

const AppContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  background-color: #1d1d1d;
  color: white;
  position: relative;
`;

const Header = styled.div`
  position: absolute;
  top: 10px;
  right: 20px;
`;

const SavedImagesLink = styled.button`
  background: none;
  border: none;
  color: #00bcd4;
  font-size: 16px;
  cursor: pointer;
  &:hover {
    text-decoration: underline;
  }
`;

const UploadButton = styled.label`
  background-color: #444;
  padding: 10px 20px;
  cursor: pointer;
  border-radius: 5px;
  transition: 0.3s ease-in-out;

  input {
    display: none;
  }

  span {
    color: white;
    font-size: 18px;
    font-weight: bold;
  }

  &:hover {
    background-color: #666;
  }
`;

const ImageContainer = styled.div`
  position: relative;
  max-width: 100%;
  max-height: 80vh;
  margin-top: 20px;

  img {
    max-width: 100%;
    max-height: 80vh;
  }
`;

const GridOverlay = ({ width, height }) => {
  const rows = 4;
  const cols = 4;

  const gridWidth = width / cols;
  const gridHeight = height / rows;

  return (
    <GridWrapper style={{ width: `${width}px`, height: `${height}px` }}>
      {Array.from({ length: rows * cols }).map((_, index) => {
        const row = Math.floor(index / cols);
        const col = index % cols;
        return (
          <GridCell
            key={index}
            style={{
              left: `${col * gridWidth}px`,
              top: `${row * gridHeight}px`,
              width: `${gridWidth}px`,
              height: `${gridHeight}px`,
            }}
          />
        );
      })}
    </GridWrapper>
  );
};

const GridWrapper = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  pointer-events: none;
  z-index: 2;
`;

const GridCell = styled.div`
  position: absolute;
  border: 1px solid rgba(255, 255, 255, 0.7);
  box-sizing: border-box;
`;

const SaveButton = styled.button`
  margin-top: 20px;
  background-color: #00bcd4;
  border: none;
  color: white;
  padding: 10px 20px;
  border-radius: 5px;
  cursor: pointer;
  font-size: 16px;
  &:hover {
    background-color: #008c9e;
  }
`;

const SavedImagesModal = styled.div`
  position: fixed;
  top: 50px;
  right: 20px;
  background: #333;
  border: 1px solid #555;
  padding: 20px;
  border-radius: 5px;
  max-width: 300px;
  z-index: 3;
`;

const SavedImage = styled.img`
  width: 100%;
  height: auto;
  margin-bottom: 10px;
  cursor: pointer;
  border-radius: 5px;
  &:hover {
    opacity: 0.8;
  }
`;

const CloseButton = styled.button`
  position: absolute;
  top: 5px;
  right: 5px;
  background: none;
  border: none;
  color: white;
  font-size: 18px;
  cursor: pointer;
`;

const NoSavedImages = styled.div`
  color: white;
  text-align: center;
  margin-top: 10px;
`;

export default App;
