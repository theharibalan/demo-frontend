import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardMedia, IconButton, Typography, LinearProgress, Box, TextField, CircularProgress, MenuItem, Select, InputLabel, FormControl, Button } from '@mui/material';
import AddPhotoAlternateIcon from '@mui/icons-material/AddPhotoAlternate';
import CloseIcon from '@mui/icons-material/Close';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import { styled } from '@mui/material/styles';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { message } from 'antd';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const UploadCard = styled(Card)(({ theme }) => ({
  border: '2px dashed #ccc',
  textAlign: 'center',
  padding: 0,
  cursor: 'pointer',
  position: 'relative',
  transition: 'border-color 0.3s ease',
  '&:hover': {
    borderColor: '#888',
  },
}));

const Form = () => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [progress, setProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [productNames, setProductNames] = useState({
    'ToorDal': ['Fatka ToorDal', 'Desi ToorDal', 'Imported ToorDal', 'Polished ToorDal'],
    'MoongDal': ['Polished MoongDal', 'Imported MoongDal', 'Desi MoongDal'],
    'UradDal': ['Black UradDal', 'Desi UradDal', 'Imported UradDal'],
    'GramDal': ['Premium GramDal', 'Gold GramDal'],
  });
  const [selectedProduct, setSelectedProduct] = useState('');
  const [selectedType, setSelectedType] = useState('');
  // const []
  const [moisture, setMoisture] = useState('');
  const [shelfLife, setShelfLife] = useState('');
  const [units, setUnits] = useState('');
  const [validity, setValidity] = useState('');
  const [packages, setPackages] = useState([{ type: '', quantity: '' }]);
  const [pricePerKgOrTon, setPricePerKgOrTon] = useState('');
  const [totalAmount, setTotalAmount] = useState(0);
  const [totalQuantity, setTotalQuantity] = useState(0);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleImageChange = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    // Create a form data object
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', 'ml_default'); // Replace with your actual preset
    formData.append('cloud_name', 'dalzs7bc2'); // Replace with your actual Cloudinary cloud name

    setIsUploading(true); // Set uploading state

    try {
      // Upload to Cloudinary
      const response = await axios.post(
        'https://api.cloudinary.com/v1_1/dalzs7bc2/image/upload', // Replace with your Cloudinary URL
        formData,
        {
          onUploadProgress: (progressEvent) => {
            const progressPercentage = Math.round(
              (progressEvent.loaded * 100) / progressEvent.total
            );
            setProgress(progressPercentage); // Update progress bar
          },
        }
      );

      // Set the uploaded image URL in the state
      setSelectedImage(response.data.secure_url);
      setIsUploading(false); // Stop showing the loader
      setProgress(0); // Reset progress bar
    } catch (error) {
      console.error('Error uploading the image:', error);
      setIsUploading(false); // Reset uploading state on error
    }
  };

  const handleRemoveImage = (e) => {
    e.stopPropagation();
    setSelectedImage(null);
  };

  useEffect(() => {
    if (isUploading) {
      const interval = setInterval(() => {
        setProgress((oldProgress) => {
          if (oldProgress === 100) {
            clearInterval(interval);
            setIsUploading(false);
            return 100;
          }
          return Math.min(oldProgress + 10, 100);
        });
      }, 500);
    }
  }, [isUploading]);

  // const handleChange = (event) => {
  //   setSelectedProduct(event.target.value);
  //   console.log(event.target.value);
  // };

  const handleCardClick = () => {
    if (!selectedImage) {
      document.getElementById('imageInput').click();
    }
  };

  const handleUnitsChange = (event) => {
    setUnits(event.target.value);
    calculateTotalAmount();
  };

  const handlePackageTypeChange = (index, event) => {
    const newPackages = [...packages];
    newPackages[index].type = event.target.value;
    setPackages(newPackages);
  };

  const handleProductChange = (event) => {
    setSelectedProduct(event.target.value);
    setSelectedType('');
  };

  const handleTypeChange = (event) => {
    setSelectedType(event.target.value);
  };
  const addPackageField = () => {
    setPackages([...packages, { type: '', quantity: '' }]);
  };

  const removePackageField = (index) => {
    const newPackages = packages.filter((_, i) => i !== index);
    setPackages(newPackages);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    let isValid = true;
    const token = localStorage.getItem("token"); 
    if (!token) {
      message.error("User is not authenticated.");
      return;
    }
    if (!selectedImage) {
      toast.error("Please upload an image.", { position: "top-center" });
      isValid = false;
      return;
    }
    if (!selectedProduct) {
      toast.error("Please select a product.", { position: "top-center" });
      isValid = false;
      return;
    }
    if (!selectedType) {
      toast.error("Please select a product type.", { position: "top-center" });
      isValid = false;
      return;
    }
    if (!pricePerKgOrTon || pricePerKgOrTon <= 0) {
      toast.error("Please enter a valid price.", { position: "top-center" });
      isValid = false;
      return;
    }
    if (!units) {
      toast.error("Please select a unit (kg or tonne).", { position: "top-center" });
      isValid = false;
      return;
    }

    // Moisture validation
    if (!moisture) {
      toast.error("Please select moisture percentage.", { position: "top-center" });
      isValid = false;
      return;
    }

    // Shelf life validation
    if (!shelfLife) {
      toast.error("Please select shelf life.", { position: "top-center" });
      isValid = false;
      return;
    }

    // Validity validation
    if (!validity) {
      toast.error("Please select a validity date.", { position: "top-center" });
      isValid = false;
      return;
    }

    // Description validation
    const description = event.target.description.value;
    if (!description) {
      toast.error("Please enter a description.", { position: "top-center" });
      isValid = false;
      return;
    }

    // Packages validation
    if (packages.length === 0) {
      toast.error("Please add at least one package.", { position: "top-center" });
      isValid = false;
      return;
    } else {
      packages.forEach((pkg, index) => {
        if (!pkg.type) {
          toast.error(`Please select a package type for package ${index + 1}.`, { position: "top-center" });
          isValid = false;
          return;
        }
        if (!pkg.quantity || pkg.quantity <= 0) {
          toast.error(`Please enter a valid quantity for package ${index + 1}.`, { position: "top-center" });
          isValid = false;
          return;
        }
      });
    }

    const packageDict = packages.reduce((acc, pkg) => {
      if (pkg.type && pkg.quantity) {
        acc[pkg.type] = pkg.quantity;
      }
      return acc;
    }, {});
  
    // Construct the form data object
  //   const formData = {
  //     productName: selectedProduct,
  //     productImg: selectedImage,
  //     price: pricePerKgOrTon,
  //     // units: units,
  //     isOrganic: true,
  //     moisture: "10%",
  //     shelfLife: "1 year",
  //     validity: "2025-12-31",
  //     description: "A perennial legume that belongs to the Fabaceae family...",
  //     packaging: packageDict,
  //     productType: "Green ToorDal"
  // }
    const formData = {
      productName: selectedProduct,
      productImg: selectedImage,
      price: pricePerKgOrTon,
      units: units,
      moisture: moisture,
      isOrganic: true,
      shelfLife: shelfLife,
      validity: validity,
      description: event.target.description.value,
      packaging: packageDict,
      productType: selectedType
    };
  
    try {
      setLoading(true);
      const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/seller/addProduct`, {
        method: 'POST',
        headers: {
          Authorization:`Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      console.log(formData);
      
      if (!response.ok) {
        throw new Error('Something went wrong while sending the data.');
      }
  
      const data = await response.json();
      console.log('Success:', data);
      toast.success('Product added successfully!', {
        onClose: () => navigate(-1), position: "top-center" });

    } catch (error) {
      console.error('Error:', error);
      toast.error('Failed to submit form data', { position: "top-center" });
    } finally {
      setLoading(false); // Stop loading when done
    }
  };
  
  const calculateTotalAmount = () => {
    if (pricePerKgOrTon && units && packages.length) {
      const totalQuantity = packages.reduce((acc, pkg) => acc + parseFloat(pkg.quantity || 0), 0);
      const multiplier = units === 'kg' ? 1 : 1000;
      const total = pricePerKgOrTon * totalQuantity * 1000;
      setTotalQuantity(totalQuantity);
      // setTotalAmount(total);
    setTotalAmount(total.toLocaleString('en-IN'));
    }
  };
  const handlePackageQuantityChange = (index, event) => {
    const newPackages = [...packages];
    newPackages[index].quantity = event.target.value;
    setPackages(newPackages);
    calculateTotalAmount(); // Recalculate total amount and quantity on quantity change
  };
  
  const handlePriceChange = (event) => {
    setPricePerKgOrTon(event.target.value);
    calculateTotalAmount(); // Recalculate total amount and quantity on price change
  };
  
  useEffect(calculateTotalAmount, [pricePerKgOrTon, packages, units])  

  return (
    <div className="bggram">
      <ToastContainer />
      <div className='formContainer'>
      <Card 
        sx={{
          margin: ' 30px 20px'
        }}
      >
        <CardContent>
          <Typography variant="h6" color="text.secondary">
            Your one-stop shop for premium quality pulses. Discover a wide variety of wholesome, nutritious pulses for all your cooking needs.
          </Typography>
        </CardContent>
      </Card>

      <Card 
        sx={{ 
          maxWidth: '100%', 
          margin: '20px auto', 
          mt: 5, 
          padding: 2, 
          '@media (max-width: 360px)': { 
            maxWidth: '100%', 
            margin: 'auto', 
            boxShadow: 'none' 
          } 
        }}
      >
        <form onSubmit={handleSubmit}>
          <CardContent>
            <Typography gutterBottom variant="h5" component="div" sx={{ marginBottom: 5 }}>
              Product Details Form
            </Typography>

            <Box sx={{ display: 'flex', justifyContent: 'center', marginBottom: 5, alignItems: 'center', gap: 3 }}>
              <UploadCard
                sx={{ width: 120, height: 120, textAlign: 'center', position: 'relative' }}
                onClick={handleCardClick}
              >
                <input
                  type="file"
                  accept="image/*"
                  id="imageInput"
                  style={{ display: 'none' }}
                  onChange={handleImageChange}
                />
                {selectedImage && !isUploading ? (
                  <CardMedia
                    component="img"
                    image={selectedImage}
                    alt="Uploaded"
                    sx={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                ) : (
                  <CardContent
                    sx={{
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      justifyContent: 'center',
                      padding: 0,
                      height: '100%',
                    }}
                  >
                    <IconButton color="primary">
                      <AddPhotoAlternateIcon sx={{ fontSize: 40 }} />
                    </IconButton>
                    {isUploading ? (
                      <>
                        <Typography variant="body2" color="text.secondary" sx={{ margin: '10px auto 6px' }}>
                          Uploading...
                        </Typography>
                        <Box sx={{ width: 120, textAlign: 'center' }}>
                          <LinearProgress variant="determinate" value={progress} />
                        </Box>
                      </>
                    ) : (
                      <Typography variant="body2" color="text.secondary">
                        Upload Image
                      </Typography>
                    )}
                  </CardContent>
                )}
                {selectedImage && !isUploading && (
                  <IconButton
                    sx={{
                      position: 'absolute',
                      top: '5px',
                      right: '5px',
                      backgroundColor: 'red',
                      color: 'white',
                      fontSize: '14px',
                      padding: '4px',
                      '&:hover': {
                        backgroundColor: 'darkred',
                      },
                    }}
                    onClick={handleRemoveImage}
                  >
                    <CloseIcon fontSize="5px" />
                  </IconButton>
                )}
              </UploadCard>
            </Box>
            <Box sx={{ display: 'flex', gap: 2, marginBottom: 2 }}>
      
              {/* Product Name Dropdown */}
              <FormControl fullWidth>
                <InputLabel id="product-select-label">Select Product</InputLabel>
                <Select
                  labelId="product-select-label"
                  value={selectedProduct}
                  onChange={handleProductChange}
                  label="Select Product"
                >
                  {Object.keys(productNames).map((product, index) => (
                    <MenuItem key={index} value={product}>
                      {product}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              {/* Product Type Dropdown */}
              <FormControl fullWidth>
                <InputLabel id="product-type-select-label">Product Type</InputLabel>
                <Select
                  labelId="product-type-select-label"
                  value={selectedType}
                  onChange={handleTypeChange}
                  label="Product Type"
                  
                >
                  {selectedProduct &&
                    productNames[selectedProduct].map((type, index) => (
                      <MenuItem key={index} value={type}>
                        {type}
                      </MenuItem>
                    ))}
                    <MenuItem value={'Other'}>Others</MenuItem>
                </Select>
              </FormControl>
            </Box>
            
            <Box sx={{ display: 'flex', alignItems: 'center', margin: '20px 0' }}>
              <TextField
                label="Pricing"
                variant="outlined"
                type="number"
                sx={{ flex: 1, marginRight: 1 }}
                value={pricePerKgOrTon}
                onChange={handlePriceChange}
                
              />
              /
              <FormControl sx={{ flex: 1, marginLeft: 1 }}>
                <InputLabel>Units</InputLabel>
                <Select
                  value={units}
                  label="Units"
                  onChange={handleUnitsChange}                  
                >
                  <MenuItem value="kg">1 KG</MenuItem>
                  <MenuItem value="ton">1 TONNE</MenuItem>
                </Select>
              </FormControl>
            </Box>
            
            <Box sx={{ display: 'flex', gap: 2, marginBottom: 2 }}>
              <FormControl fullWidth>
                <InputLabel>Moisture</InputLabel>
                <Select
                  value={moisture}
                  label="Moisture"
                  onChange={(event) => setMoisture(event.target.value)}
                  
                >
                  <MenuItem value="Dry">Dry</MenuItem>
                  <MenuItem value="Wet">Wet</MenuItem>
                  <MenuItem value="Normal">Normal</MenuItem>
                  {/* <MenuItem value="40%">40%</MenuItem> */}
                </Select>
              </FormControl>
              <FormControl fullWidth>
                <InputLabel>Shelf Life</InputLabel>
                <Select
                  value={shelfLife}
                  label="Shelf Life"
                  onChange={(event) => setShelfLife(event.target.value)}
                  
                >
                  <MenuItem value="1 month">1 month</MenuItem>
                  <MenuItem value="3 months">3 months</MenuItem>
                  <MenuItem value="6 months">6 months</MenuItem>
                  <MenuItem value="1 year">1 year</MenuItem>
                </Select>
              </FormControl>
            </Box>
            
            <TextField
              label="Validity"
              variant="outlined"
              type="date"
              InputLabelProps={{ shrink: true }}
              fullWidth
              sx={{ marginBottom: 2 }}
              value={validity}
              onChange={(event) => setValidity(event.target.value)}
              
            />
            
            <TextField
              label="Description"
              variant="outlined"
              fullWidth
              multiline
              rows={4}
              name="description" 
              
            />
            
            <Box sx={{ marginTop: 2 }}>
              <Typography variant="h6" gutterBottom>
                Packaging
              </Typography>
              {packages.map((pkg, index) => (
                <Box key={index} sx={{ display: 'flex', alignItems: 'center', marginBottom: 2 }}>
                  <FormControl sx={{ flex: 1, marginRight: 1 }}>
                    <InputLabel>Type</InputLabel>
                    <Select
                      value={pkg.type}
                      label="Type"
                      onChange={(event) => handlePackageTypeChange(index, event)}
                      
                    >
                      <MenuItem value="unpacked">Unpacked</MenuItem>
                      <MenuItem value="1kg">1kg Packed</MenuItem>
                      <MenuItem value="5kg">5kg Packed</MenuItem>
                      <MenuItem value="25kg">25kg Packed</MenuItem>
                      <MenuItem value="50kg">50kg Packed</MenuItem>
                    </Select>
                  </FormControl>
                  <Typography variant="h6" sx={{ marginX: 1 }}> - </Typography>
                  <FormControl sx={{ flex: 1 }}>
                    <TextField
                      label="Quantity (in Tonnes)"
                      variant="outlined"
                      type="number"
                      sx={{ flex: 1, marginRight: 1 }}
                      value={pkg.quantity}
                      onChange={(event) => handlePackageQuantityChange(index, event)}
                      
                    />
                  </FormControl>
                  <IconButton
                    sx={{
                      marginLeft: 2,
                      padding: '2px',
                      backgroundColor: 'rgba(255, 0, 0, 0.3)',
                      color: 'rgba(255, 0, 0, 0.7)',
                      '&:hover': {
                        backgroundColor: 'rgba(255, 0, 0, 0.5)',
                      },
                    }}
                    onClick={() => removePackageField(index)}
                  >
                    <RemoveIcon />
                  </IconButton>
                </Box>
              ))}
              <IconButton
                sx={{
                  marginTop: 2,
                  backgroundColor: 'blue',
                  color: 'white',
                  fontSize: '12px',
                  borderRadius: '5px',
                  '&:hover': {
                    backgroundColor: 'rgba(0, 0, 255, 0.5)',
                    color: 'white'
                  },
                }}
                onClick={addPackageField}
                
              >
                <AddIcon /> Add Package
              </IconButton>
            </Box>
            {/* Calculated Total */}
            <Box sx={{ display: 'flex', alignItems: 'end', flexDirection: 'column', marginTop: 3 }}>
              <Typography sx={{ flex: 1, fontWeight: 'bold', fontSize: '18px' }}>
                Total Quantity: {totalQuantity} Tonnes
              </Typography>
              <Typography sx={{ flex: 1, fontWeight: 'bold', fontSize: '18px' }}>
                Total Amount: INR {totalAmount}
              </Typography>
            </Box>

            <Box sx={{ display: 'flex', justifyContent: 'center', marginTop: 5}}>
              <Button 
                type="submit" 
                variant="contained" 
                color="primary"
                sx={{ fontSize: '16px', textTransform: 'capitalize'}}
                disabled={loading}
              >
                {loading ? <><CircularProgress size={24} sx={{marginRight: '10px'}}/>Submitting...</>: 'Submit'}
              </Button>
            </Box>
            {/* <Box sx={{ display: 'flex', justifyContent: 'center', marginTop: 5}}>
              <Button 
                type="submit" 
                variant="contained" 
                color="primary"
                sx={{ fontSize: '16px', textTransform: 'capitalize'}}
              >
                Submit
              </Button>
            </Box> */}
          </CardContent>
        </form>
      </Card>
    </div>
    </div>
  );
};

export default Form;
