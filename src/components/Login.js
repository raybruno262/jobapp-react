import React, { useState, useEffect } from 'react';
import { sendLoginOtp, verifyLoginOtp } from '../services/apiService';
import { Container, TextField, Button, Typography, Box, Alert, Link } from '@mui/material';
import { useNavigate, Link as RouterLink } from 'react-router-dom';

const Login = ({ onLogin }) => {
    const [state, setState] = useState({
        otpEmail: '', dbEmail: '', otp: '', password: '', 
        message: null, error: null
    });
    const navigate = useNavigate();
    
    useEffect(() => {
        document.body.style.background = 'url(j.jpg) no-repeat center center fixed';
        document.body.style.backgroundSize = 'cover';
        return () => document.body.style.background = '';
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setState(prev => ({ ...prev, [name]: value }));
    };

    const handleSendOtp = async (e) => {
        e.preventDefault();
        setState(prev => ({ ...prev, message: null, error: null }));
        
        if (!state.otpEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(state.otpEmail)) {
            setState(prev => ({ ...prev, error: 'Please enter a valid OTP email address' }));
            return;
        }
    
        try {
            await sendLoginOtp(state.otpEmail);
            setState(prev => ({ ...prev, message: 'Verification code sent successfully. Please check your email.' }));
        } catch (error) {
            const errorMsg = error.response?.status === 404 
                ? 'No user found with this email address'
                : error.response?.data || error.request 
                    ? 'Network error. Please check your connection.' 
                    : 'An unexpected error occurred.';
            setState(prev => ({ ...prev, error: errorMsg }));
        }
    };

    const handleLogin = async (e) => {
        e.preventDefault();
        setState(prev => ({ ...prev, error: null, message: null }));

        if (!state.dbEmail || !state.password || !state.otp || !state.otpEmail) {
            setState(prev => ({ ...prev, error: 'Please fill in all required fields' }));
            return;
        }

        try {
            const userData = await verifyLoginOtp(state.dbEmail, state.otpEmail, state.otp, state.password);
            onLogin(userData);
            setState(prev => ({ ...prev, message: 'Login successful! Redirecting...' }));
            setTimeout(() => navigate(userData.role === 'JOBSEEKER' ? '/userprofile' : '/', { replace: true }), 0);
        } catch (error) {
           
            const errorMsg = error.response?.status === 400 
                ? typeof error.response.data === 'string' ? error.response.data : 'Invalid credentials or OTP'
                : error.response?.status === 401 ? 'Unauthorized access. Please check your credentials.'
                : error.response?.status === 500 ? 'Server error. Please try again later.'
                : error.request ? 'Network issue. Please check your connection.'
                : 'An unexpected error occurred.';
           console.error("Caught an error:", error.message); 
            setState(prev => ({ ...prev, error: errorMsg }));
        }
    };

    const styles = {
        container: { 
            background: 'url(/public/j.jpg) no-repeat center center fixed', 
            backgroundSize: 'cover',
            display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh'
        },
        formContainer: {
            padding: '30px', background: 'rgb(207, 201, 201)', backdropFilter: 'blur(8px)',
            borderRadius: '20px', boxShadow: '0 10px 30px rgba(0, 0, 0, 0.1)', width: '1040px',
            height: '860px', maxWidth: '2100px', margin: '40px auto', display: 'flex',
            flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
            border: '1px solid rgba(255, 255, 255, 0.5)'
        },
        imageBox: {
            flex: 1.6, marginRight: '40px', borderRadius: '15px 50px 50px 15px',
            overflow: 'hidden', boxShadow: '0 5px 15px rgba(12, 8, 8, 0.1)'
        },
        title: {
            fontFamily: 'Poppins, sans-serif', fontWeight: '800', color: '#4caf50',
            marginBottom: '30px', fontSize: '1.8rem', textAlign: 'center'
        },
        fieldLabel: {
            fontFamily: 'Poppins, sans-serif', fontWeight: '500', color: '#2e7d32',
            marginBottom: '8px', fontSize: '0.9rem'
        },
        input: {
            borderRadius: '10px', background: '#f5f5f5', fontSize: '0.95rem'
        },
        button: {
            background: '#4caf50', color: 'white', fontSize: '1rem', padding: '12px',
            borderRadius: '10px', margin: '10px 0', textTransform: 'none', fontWeight: '600',
            boxShadow: '0 3px 5px rgba(0,0,0,0.1)', transition: 'all 0.3s ease',
            '&:hover': { background: '#3d8b40', boxShadow: '0 4px 8px rgba(0,0,0,0.15)' }
        },
        link: {
            textDecoration: 'none', fontSize: '0.9rem', color: '#4caf50',
            fontWeight: '600', '&:hover': { textDecoration: 'underline' }
        }
    };

    return (
        <div style={styles.container}>
            <Container style={styles.formContainer}>
                <Box style={styles.imageBox}>
                    <Typography style={styles.title}>JOB PORTAL MGT SYSTEM</Typography>
                    <img src="/n.jpg" alt="Illustration" style={{ width: '100%', height: '740px', objectFit: 'cover' }} />
                </Box>

                <Box style={{ flex: 1, padding: '30px' }}>
                    <Typography style={styles.title}>LOGIN PAGE</Typography>
                    {state.message && <Alert severity="success">{state.message}</Alert>}
                    {state.error && <Alert severity="error">{state.error}</Alert>}

                    {['otpEmail', 'dbEmail'].map((field) => (
                        <Box key={field} mb={3}>
                            <Typography style={styles.fieldLabel}>
                                {field === 'otpEmail' ? 'OTP Email' : 'Login Email'}
                            </Typography>
                            <TextField
                                fullWidth name={field} value={state[field]} onChange={handleChange}
                                required variant="outlined" placeholder="email@address.com"
                                InputProps={{ style: styles.input }}
                            />
                        </Box>
                    ))}

                    <Button fullWidth onClick={handleSendOtp} sx={styles.button}>
                        Send OTP
                    </Button>

                    {['otp', 'password'].map((field) => (
                        <Box key={field} mb={3}>
                            <Typography style={styles.fieldLabel}>
                                {field === 'otp' ? 'OTP Code' : 'Password'}
                            </Typography>
                            <TextField
                                fullWidth name={field} value={state[field]} onChange={handleChange}
                                required variant="outlined" type={field === 'password' ? 'password' : 'text'}
                                InputProps={{ style: styles.input }}
                            />
                        </Box>
                    ))}

                    <Button fullWidth onClick={handleLogin} sx={styles.button}>
                        Login
                    </Button>

                    <Box style={{ display: 'flex', justifyContent: 'space-between', marginTop: '20px' }}>
                        <Link component={RouterLink} to="/signup" sx={styles.link}>
                            CREATE AN ACCOUNT
                        </Link>
                        <Link component={RouterLink} to="/forgot-password" sx={styles.link}>
                            Forgot Password?
                        </Link>
                    </Box>
                </Box>
            </Container>
        </div>
    );
};

export default Login;