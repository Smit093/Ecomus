import React, { useEffect, useState } from "react";
import { Container, Row, Col, Modal } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import paypal from '../../../assets/images/paypal.png';
import { TbEye } from "react-icons/tb";
import { FaRegHeart } from 'react-icons/fa';
import { PiShoppingBag } from "react-icons/pi";
import { LiaExpandArrowsAltSolid } from "react-icons/lia";
import { FaPlus, FaMinus } from "react-icons/fa6";
import { TbArrowsCross } from "react-icons/tb";
import './BestSeller.css';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/swiper-bundle.css';
import 'swiper/css';
import Button from 'react-bootstrap/Button';
import axios from "axios";
function BestSeller() {
    const [bestSellerData, setBestSellerData] = useState([]);

    const fetchBestSellers = async () => {
        try {
            const response = await axios.get('http://localhost:3000/bestseller');
            setBestSellerData(response.data);
        } catch (error) {
            console.error('Error fetching BestSeller data:', error);
        }
    };

    useEffect(() => {
        fetchBestSellers();
    }, []);


    const [selectedColors, setSelectedColors] = useState(() => {
        return bestSellerData.map((product) => product.colors[0]);
    });


    const [selectedImages, setSelectedImages] = useState(() =>
        bestSellerData.map((product) => product.images[product.colors[0]])
    );


    const handleColorChange = (productIndex, color) => {
        const newSelectedColors = [...selectedColors];
        const newSelectedImages = [...selectedImages];

        newSelectedColors[productIndex] = color;
        newSelectedImages[productIndex] = bestSellerData[productIndex].images[color];

        setSelectedColors(newSelectedColors);
        setSelectedImages(newSelectedImages);
    };


    //Eye Modal
    const [show, setShow] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState(null);

    const handleEyeModal = (product) => {
        setSelectedProduct(product);
        handleShow();
    };

    const handleShow = () => setShow(true);
    const handleClose = () => {
        setShow(false);
        setSelectedProduct(null); // Clear selected product on close
    };

    const [selectedColor, setSelectedColor] = useState();

    const handleColorChangeModal = (event) => {
        setSelectedColor(event.target.value);
    };

    const [selectedSize, setSelectedSize] = useState('');

    const handleSizeChange = (event) => {
        setSelectedSize(event.target.value);
    };

    const [quantity, setQuantity] = useState(1);

    const handleIncrease = () => {
        setQuantity(prevQuantity => prevQuantity + 1); // Increase quantity by 1
    };

    const handleDecrease = () => {
        setQuantity(prevQuantity => (prevQuantity > 1 ? prevQuantity - 1 : 1)); // Decrease quantity but not below 1
    };

    //Cart Modal

    const [showCart, setShowCart] = useState(false);

    const handleCloseCart = () => setShowCart(false);
    const handleShowCart = () => setShowCart(true);

    const handleCartModal = (product) => {
        setSelectedProduct(product);
        handleShowCart();
    }

    return (
        <>
            {/* Eye Modal */}
            <Modal centered show={show} onHide={handleClose} dialogClassName="bs-modal" >
                <button
                    className="btn-close"
                    style={{
                        position: 'absolute',
                        top: '10px',
                        right: '10px',
                        zIndex: '1051',
                        backgroundColor: 'transparent',
                        border: 'none',
                    }}
                    onClick={handleClose}
                    aria-label="Close"
                ></button>
                {selectedProduct && (
                    <Modal.Body>
                        <div className="row">
                            <div className="col-sm-6">
                                <Swiper
                                    className="bs-swiper"
                                    spaceBetween={50}
                                    slidesPerView={1}
                                    navigation
                                >
                                    {Object.entries(selectedProduct.images).map(([color, image]) => (
                                        <SwiperSlide key={color}>
                                            <img src={image} alt={`${color} ${selectedProduct.title}`} style={{ width: '100%' }} />
                                        </SwiperSlide>
                                    ))}
                                </Swiper>
                            </div>
                            <div className="col">
                                <h4>{selectedProduct.title}</h4>
                                <div className="d-flex bs-btn-cart mt-4">
                                    <Button size="sm" className="h-25" variant="outline-dark">BEST SELLER</Button>
                                    <p className="ms-4 fw-bold">Selling fast! 48 people have this in their carts.</p>
                                </div>
                                <p className="bs-price">${selectedProduct.price.toFixed(2)}</p>
                                <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Temporibus omnis facere reiciendis id </p>
                                <div className="select-colors">
                                    <p>Color: <b>{selectedColor}</b></p>
                                    <div style={{ display: 'flex', gap: '10px' }}>
                                        {selectedProduct.colors.map((color, index) => (
                                            <label
                                                key={index}
                                                style={{
                                                    background: selectedColor === color ? `radial-gradient(circle, ${color} 50%, transparent 40%)`
                                                        : `${color}`,
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    width: '20px', // Width of the circle
                                                    height: '20px', // Height of the circle
                                                    borderRadius: '50%', // Make it round
                                                    backgroundColor: color.toLowerCase(), // Set background color
                                                    cursor: 'pointer',
                                                    border: selectedColor === color ? '2px solid black' : '1px solid grey', // Highlight selected color
                                                }}
                                            >
                                                <input
                                                    type="radio"
                                                    value={color}
                                                    checked={selectedColor === color}
                                                    onChange={(handleColorChangeModal)}
                                                    style={{ display: 'none' }} // Hide the default radio button
                                                />
                                            </label>
                                        ))}
                                    </div>
                                </div>
                                <div className="select-sizes mt-3">
                                    <p>Size: <b>{selectedSize}</b></p>
                                    <div style={{ display: 'flex', gap: '10px' }}>
                                        {selectedProduct.sizes.map((size, index) => (
                                            <label
                                                key={index}
                                                style={{
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    width: '40px', // Width of the square
                                                    height: '40px', // Height of the square
                                                    borderRadius: '5px', // Slightly rounded corners
                                                    backgroundColor: selectedSize === size ? 'black' : 'white', // Change background color based on selection
                                                    color: selectedSize === size ? 'white' : 'black', // Change text color based on selection
                                                    cursor: 'pointer',
                                                    border: '1px solid black', // Add border for better visibility
                                                    fontWeight: 'bold', // Make text bold
                                                    transition: 'all 0.3 ease'
                                                }}
                                            >
                                                <input
                                                    type="radio"
                                                    value={size}
                                                    checked={selectedSize === size}
                                                    onChange={handleSizeChange}
                                                    style={{ display: 'none' }} // Hide the default radio button
                                                />
                                                {size} {/* Display the size */}
                                            </label>
                                        ))}
                                    </div>
                                </div>
                                <div className="mb-3">
                                    <strong>Quantity</strong>
                                    <div className="input-group mt-2" style={{ maxWidth: "140px", backgroundColor: "#ebebeb" }}>
                                        <button className="btn" onClick={handleDecrease}>
                                            <FaMinus />
                                        </button>
                                        <input
                                            type="text"
                                            className="form-control text-center bg-transparent border-0"
                                            value={quantity}
                                            readOnly
                                        />
                                        <button className="btn " onClick={handleIncrease}>
                                            <FaPlus />
                                        </button>
                                    </div>
                                </div>

                                <div className="d-flex align-items-center gap-2 mb-4 pe-2">
                                    <button className="btn btn-dark flex-grow-1">
                                        Add to cart - ${quantity * selectedProduct?.price.toFixed(1)}
                                    </button>
                                    <button className="btn btn-outline-dark">
                                        <FaRegHeart />
                                    </button>
                                    <button className="btn btn-outline-dark">
                                        <TbArrowsCross />
                                    </button>
                                </div>

                                <div className="d-flex gap-2">
                                    <button className="btn bg-warning text-primary w-100">Buy with <img src={paypal} className="paypal-img" /> </button>
                                </div>
                                <div className='more-payment'>
                                    <a href="" >More Payment option </a>
                                </div>
                            </div>
                        </div>
                    </Modal.Body>
                )}
            </Modal>
            {/* Cart Modal */}
            <Modal show={showCart} onHide={handleClose} dialogClassName="cart-modal">
                <button
                    className="btn-close"
                    style={{
                        position: 'absolute',
                        top: '10px',
                        right: '10px',
                        zIndex: '1051',
                        backgroundColor: 'transparent',
                        border: 'none',
                    }}
                    onClick={handleCloseCart}
                    aria-label="Close"
                ></button>
                <Modal.Body>
                    {selectedProduct && (
                        <Modal.Body>
                            <div className="row">
                                <div className="col">
                                    <div className="d-flex">
                                        <img
                                            height={84}
                                            width={64}
                                            src={selectedProduct.images[selectedColor]}
                                            alt={selectedProduct.title}
                                        />
                                        <div className="d-flex-col ms-3">
                                            <h4>{selectedProduct.name}</h4>
                                            <p className="bs-price"><b>${selectedProduct.price.toFixed(2)}</b></p>
                                        </div>
                                    </div>
                                    <div className="select-colors mt-3">
                                        <p>Color: <b>{selectedColor}</b></p>
                                        <div style={{ display: 'flex', gap: '10px' }}>
                                            {selectedProduct.colors.map((color, index) => (
                                                <label
                                                    key={index}
                                                    style={{
                                                        background: selectedColor === color ? `radial-gradient(circle, ${color} 50%, transparent 40%)`
                                                            : `${color}`,
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        justifyContent: 'center',
                                                        width: '20px', // Width of the circle
                                                        height: '20px', // Height of the circle
                                                        borderRadius: '50%', // Make it round
                                                        backgroundColor: color.toLowerCase(), // Set background color
                                                        cursor: 'pointer',
                                                        border: selectedColor === color ? '2px solid black' : '1px solid grey', // Highlight selected color
                                                    }}
                                                >
                                                    <input
                                                        type="radio"
                                                        value={color}
                                                        checked={selectedColor === color}
                                                        onChange={(handleColorChangeModal)}
                                                        style={{ display: 'none' }} // Hide the default radio button
                                                    />
                                                </label>
                                            ))}
                                        </div>
                                    </div>
                                    <div className="select-sizes mt-3">
                                        <p>Size: <b>{selectedSize}</b></p>
                                        <div style={{ display: 'flex', gap: '10px' }}>
                                            {selectedProduct.sizes.map((size, index) => (
                                                <label
                                                    key={index}
                                                    style={{
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        justifyContent: 'center',
                                                        width: '40px', // Width of the square
                                                        height: '40px', // Height of the square
                                                        borderRadius: '5px', // Slightly rounded corners
                                                        backgroundColor: selectedSize === size ? 'black' : 'white', // Change background color based on selection
                                                        color: selectedSize === size ? 'white' : 'black', // Change text color based on selection
                                                        cursor: 'pointer',
                                                        border: '1px solid black', // Add border for better visibility
                                                        fontWeight: 'bold', // Make text bold
                                                        transition: 'all 0.3 ease'
                                                    }}
                                                >
                                                    <input
                                                        type="radio"
                                                        value={size}
                                                        checked={selectedSize === size}
                                                        onChange={handleSizeChange}
                                                        style={{ display: 'none' }} // Hide the default radio button
                                                    />
                                                    {size} {/* Display the size */}
                                                </label>
                                            ))}
                                        </div>
                                    </div>
                                    <div className="mb-3">
                                        <strong>Quantity</strong>
                                        <div className="input-group mt-2" style={{ maxWidth: "140px", backgroundColor: "#ebebeb" }}>
                                            <button className="btn" onClick={handleDecrease}>
                                                <FaMinus />
                                            </button>
                                            <input
                                                type="text"
                                                className="form-control text-center bg-transparent border-0"
                                                value={quantity}
                                                readOnly
                                            />
                                            <button className="btn " onClick={handleIncrease}>
                                                <FaPlus />
                                            </button>
                                        </div>
                                    </div>

                                    <div className="d-flex align-items-center gap-2 mb-4 pe-2">
                                        <button className="btn btn-dark flex-grow-1">
                                            Add to cart - ${quantity * selectedProduct?.price.toFixed(1)}
                                        </button>
                                        <button className="btn btn-outline-dark">
                                            <FaRegHeart />
                                        </button>
                                        <button className="btn btn-outline-dark">
                                            <TbArrowsCross />
                                        </button>
                                    </div>

                                    <div className="d-flex gap-2">
                                        <button className="btn bg-warning text-primary w-100">Buy with <img src={paypal} className="paypal-img" /> </button>
                                    </div>
                                    <div className='more-payment'>
                                        <a href="" >More Payment option </a>
                                    </div>
                                </div>
                            </div>
                        </Modal.Body>
                    )}
                </Modal.Body>
            </Modal >
            {/* Best Seller */}
            < div style={{ marginTop: '100px', fontFamily: 'Albert Sans' }
            }>
                <div className="mb-4">
                    <p className="best-seller-title">Best Seller</p>
                    <p className="best-seller-subtitle">Shop the Latest Styles: Stay ahead of the curve with our newest arrivals</p>
                </div>
                <Container>
                    <Row className="g-5 product-container">
                        {bestSellerData.map((product, index) => (
                            <Col xs={6} sm={6} md={4} lg={3} key={index}>
                                <div className='product'>
                                    <img
                                        src={product.images[product.colors[0]]} // Display the first image for the product
                                        className="img-fluid product-image"
                                        alt={product.name} // Use product.name for alt text
                                    />
                                    <div className='overlay'>
                                        <div className='icons'>
                                            <div className='icon-container'>
                                                <div className='icon icon1'>
                                                    <PiShoppingBag onClick={() => { handleCartModal(product) }} />
                                                </div>
                                                <div className='icon icon2 mobile-view'><FaRegHeart /></div>
                                                <div className='icon icon3 mobile-view'><LiaExpandArrowsAltSolid /></div>
                                                <div className='icon icon4'><TbEye onClick={() => { handleEyeModal(product) }} /></div>
                                            </div>
                                        </div>
                                        <div className="sizes">
                                            <div className='size-text'>
                                                {product.sizes.map(size => size.replace(/['"]+/g, '')).toString().replace(/[\[\]]/g, '')}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <p className="product-title">{product.name}</p> {/* Use product.name instead of title */}
                                <p className="product-price">${product.price.toFixed(2)}</p>
                                <div style={{ display: "flex", gap: "10px" }}>
                                    {product.colors.map(color => (
                                        <label
                                            key={color}
                                            htmlFor={`color-${index}-${color}`}
                                            className="color-label"
                                            style={{
                                                background: color,
                                                border: '1px solid #ccc',
                                                width: '20px',
                                                height: '20px',
                                                borderRadius: '50%',
                                                cursor: 'pointer',
                                                display: 'inline-block',
                                                marginRight: '5px'
                                            }}
                                        >
                                            <input
                                                type="radio"
                                                id={`color-${index}-${color}`}
                                                name={`colorOptions-${index}`}
                                                value={color}
                                                style={{ display: 'none' }}
                                                checked={selectedColors[index] === color}
                                                onChange={() => handleColorChange(index, color)}
                                            />
                                        </label>
                                    ))}
                                </div>
                            </Col>
                        ))}


                    </Row>

                </Container>
                <div className='load-more'>
                    <button className='load-more-btn'>Load More</button>
                </div>
                <button className='RTL-btn'>RTL</button>
            </div >
        </>
    );
}

export default BestSeller;
