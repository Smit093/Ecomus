import React, { useState } from 'react';
import Modal from 'react-bootstrap/Modal';
import axios from 'axios';
import './RegisterModal.css'
function RegisterModal({ register, setLoginModal, setRegister }) {
    // State to hold form data
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        country: '',
    });

    // State to handle error messages
    const [error, setError] = useState('');

    // Handle input changes
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    // Handle registration submission
    const handleRegisterSubmit = async (e) => {
        e.preventDefault();
        setError(''); // Reset error message

        try {
            // Prepare the data to send
            const response = await axios.post('http://localhost:3000/register', formData); // Ensure this matches your backend URL
            console.log('Registration Response:', response.data);

            // Optionally close the modal or redirect the user
            setRegister(false);
            setLoginModal(true); // Show login modal after successful registration

            // Reset form data to initial state
            setFormData({
                firstName: '',
                lastName: '',
                email: '',
                password: '',
                country: '',
            });

        } catch (error) {
            console.error('Error registering user:', error);
            if (error.response) {
                console.error('Response data:', error.response.data); // Log response data for debugging
                setError(error.response.data.message || 'Failed to register user. Please try again.');
            } else {
                setError('Failed to register user. Please try again.');
            }
        }
    };

    return (
        <div>
            <Modal className="create-account-modal" centered show={register} onHide={() => setLoginModal(false)} style={{ overflow: 'hidden' }}>
                <button
                    className="btn-close"
                    style={{
                        position: 'absolute',
                        top: '30px',
                        right: '40px',
                        zIndex: '1051',
                        backgroundColor: 'transparent',
                        border: 'none',
                    }}
                    onClick={() => setRegister(false)}
                    aria-label="Close"
                ></button>
                <Modal.Title className="user-icon-title">Register</Modal.Title>
                <Modal.Body>
                    <form onSubmit={handleRegisterSubmit}>
                        <div>
                            <input 
                                type="text" 
                                name="firstName" 
                                placeholder="First Name" 
                                className="user-icon-pass" 
                                value={formData.firstName} 
                                onChange={handleChange} 
                                required 
                            />
                        </div>

                        <div>
                            <input 
                                type="text" 
                                name="lastName" 
                                placeholder="Last Name" 
                                className="user-icon-pass" 
                                value={formData.lastName} 
                                onChange={handleChange} 
                                required 
                            />
                        </div>

                        <div>
                            <input 
                                type="email" 
                                name="email" 
                                placeholder="Email*" 
                                className="user-icon-pass" 
                                value={formData.email} 
                                onChange={handleChange} 
                                required 
                            />
                        </div>

                        <div>
                            <input 
                                type="password" 
                                name="password" 
                                placeholder="Password*" 
                                className="user-icon-pass" 
                                value={formData.password} 
                                onChange={handleChange} 
                                required 
                            />
                        </div>

                        <div>
                            <input
                                type="text"
                                name="country"
                                placeholder="Country*"
                                className="user-icon-pass"
                                value={formData.country}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        {error && <div className="text-danger">{error}</div>}

                        <div className="user-icon-popup">
                            <div className="row" style={{ width: '105%' }}>
                                <div className="col-6">
                                    <button type="submit" className="w-100 bg-black text-white user-icon-login">Register</button>
                                </div>
                                <div className="col-6" style={{ fontSize: '12px', marginTop: '7px', marginLeft: '-13px' }}>
                                    <div>
                                        <a href="#" className="text-black" onClick={() => { setRegister(false), setLoginModal(true) }}>Already Have an account? Log in here?</a>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </form>
                </Modal.Body>
            </Modal>
        </div>
    );
}

export default RegisterModal;
