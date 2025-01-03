import React, { useState } from 'react';
import Modal from 'react-bootstrap/Modal';
import axios from 'axios';

function LoginModal({ loginModal, setLoginModal, setForgotPass, setRegister }) {
    // State to hold email and password
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    // Login method
    const handleLogin = async (event) => {
        event.preventDefault(); // Prevent default form submission
        try {
            const response = await axios.post('http://localhost:3000/login', { email, password });
            console.log('Login successful:', response.data);
            // Handle successful login (e.g., redirect, store token)
            setLoginModal(false); // Close modal on success
        } catch (error) {
            console.error('Login failed:', error);
            // Handle error (e.g., show error message)
        }
    };

    return (
        <div>
            <Modal className="user-icon-model" centered show={loginModal} onHide={() => setLoginModal(false)} style={{ overflow: 'hidden' }}>
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
                    onClick={() => setLoginModal(false)}
                    aria-label="Close"
                ></button>
                <Modal.Title className="user-icon-title">Login</Modal.Title>
                <Modal.Body>
                    <form onSubmit={handleLogin}>
                        <div>
                            <input 
                                type="email" 
                                placeholder="Email*" 
                                className="user-icon-email" 
                                value={email}
                                onChange={(e) => setEmail(e.target.value)} 
                                required 
                            />
                        </div>

                        <div>
                            <input 
                                type="password" 
                                placeholder="Password*" 
                                className="user-icon-pass" 
                                value={password}
                                onChange={(e) => setPassword(e.target.value)} 
                                required 
                            />
                        </div>

                        <div className="user-icon-forgot-pass">
                            <a href="#" className="text-black" onClick={() => { setForgotPass(true); setLoginModal(false); }}>Forgot Your Password?</a>
                        </div>

                        <div className="user-icon-popup">
                            <div className="row" style={{ width: '101%' }}>
                                <div className="col-6">
                                    <button type="submit" className="w-100 bg-black text-white user-icon-login">Login</button>
                                </div>
                                <div className="col-6" style={{ fontSize: '12px', marginTop: '5px' }}>
                                    <div>
                                        <a href="#" className="text-black" onClick={() => { setRegister(true); setLoginModal(false); }}>New Customer? Create Your Account?</a>
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

export default LoginModal;
