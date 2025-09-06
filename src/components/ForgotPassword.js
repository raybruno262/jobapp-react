import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Container, TextField, Button, Typography, Box, Link, Alert } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';

const ForgotPassword = () => {
    const [email, setEmail] = useState('');
    const [otpEmail, setOtpEmail] = useState('');
    const [verificationCode, setVerificationCode] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [error, setError] = useState(null);
    const [message, setMessage] = useState(null);
    const [otpSent, setOtpSent] = useState(false);

    useEffect(() => {
        document.body.style.background = 'url(/j.jpg) no-repeat center center fixed';
        document.body.style.backgroundSize = 'cover';
        return () => { document.body.style.background = ''; };
    }, []);

    const handleSendOtp = async (e) => {
        e.preventDefault();
        setMessage(null); setError(null);
        try {
            await axios.post('http://localhost:8081/api/users/password/reset/otp', null, { params: { email, otpEmail } });
            setMessage('Password reset OTP has been sent to your email.'); setOtpSent(true);
        } catch (error) {
            setError(error.response?.data?.message || 'Error sending password reset OTP');
            console.error('Error sending password reset OTP:', error);
        }
    };

    const handleResetPassword = async (e) => {
        e.preventDefault(); setError(null);
        try {
            await axios.post('http://localhost:8081/api/users/password/reset', null, { 
                params: { email, otpEmail, verificationCode, newPassword } 
            });
            setMessage('Password has been reset successfully.');
            setEmail(''); setOtpEmail(''); setVerificationCode(''); setNewPassword(''); setOtpSent(false);
        } catch (error) {
            setError(error.response?.data?.message || 'Error resetting password');
            console.error('Error resetting password:', error);
        }
    };

    return (
        <div style={{ background: 'url(/j.jpg) no-repeat center center fixed', backgroundSize: 'cover', display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}> 
            <Container style={{ padding: '30px', background: 'rgb(207, 201, 201)', backdropFilter: 'blur(8px)', borderRadius: '20px', boxShadow: '0 10px 30px rgba(0, 0, 0, 0.1)', width: '1040px', height: '860px', maxWidth: '90%', margin: '40px auto', display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', border: '1px solid rgba(255, 255, 255, 0.5)' }}>
                <Box style={{ flex: 1.6, marginRight: '40px', borderRadius: '15px 50px 50px 15px', overflow: 'hidden', boxShadow: '0 5px 15px rgba(0,0,0,0.1)' }}>
                    <img src="/passs.avif" alt="Forgot Password Illustration" style={{ width: '100%', height: '840px', objectFit: 'cover', display: 'block' }} />
                </Box>
                <Box style={{ flex: 1, padding: '30px' }}>
                    <Typography variant="h4" align="center" style={{ fontFamily: 'Poppins, sans-serif', fontWeight: '800', color: '#4caf50', marginBottom: '30px', fontSize: '1.8rem' }}>FORGOT PASSWORD</Typography>
                    {message && <Alert severity="success">{message}</Alert>}
                    {error && <Alert severity="error">{error}</Alert>}
                    <Box mb={3}>
                        <Typography variant="subtitle2" style={{ fontFamily: 'Poppins, sans-serif', fontWeight: '500', color: '#2e7d32', marginBottom: '8px', fontSize: '0.9rem' }}>Account Email</Typography>
                        <TextField fullWidth name="email" value={email} onChange={(e) => setEmail(e.target.value)} required variant="outlined" placeholder="Your email" InputProps={{ style: { borderRadius: '10px', background: '#f5f5f5', fontSize: '0.95rem' } }} />
                    </Box>
                    <Box mb={3}>
                        <Typography variant="subtitle2" style={{ fontFamily: 'Poppins, sans-serif', fontWeight: '500', color: '#2e7d32', marginBottom: '8px', fontSize: '0.9rem' }}>OTP Receiving Email</Typography>
                        <TextField fullWidth name="otpEmail" value={otpEmail} onChange={(e) => setOtpEmail(e.target.value)} required variant="outlined" placeholder="Your email" InputProps={{ style: { borderRadius: '10px', background: '#f5f5f5', fontSize: '0.95rem' } }} />
                    </Box>
                    <Box mb={3}>
                        <Button variant="contained" fullWidth type="submit" onClick={handleSendOtp} style={{ background: '#4caf50', color: 'white', fontSize: '1rem', padding: '12px', borderRadius: '10px', margin: '10px 0', textTransform: 'none', fontWeight: '600', boxShadow: '0 3px 5px rgba(0,0,0,0.1)', transition: 'all 0.3s ease' }}>Send OTP</Button>
                    </Box>
                    <Box mb={3}>
                        <Typography variant="subtitle2" style={{ fontFamily: 'Poppins, sans-serif', fontWeight: '500', color: '#2e7d32', marginBottom: '8px', fontSize: '0.9rem' }}>Verification Code</Typography>
                        <TextField fullWidth name="verificationCode" value={verificationCode} onChange={(e) => setVerificationCode(e.target.value)} required variant="outlined" placeholder="Enter OTP Code" InputProps={{ style: { borderRadius: '10px', background: '#f5f5f5', fontSize: '0.95rem' } }} />
                    </Box>
                    <Box mb={3}>
                        <Typography variant="subtitle2" style={{ fontFamily: 'Poppins, sans-serif', fontWeight: '500', color: '#2e7d32', marginBottom: '8px', fontSize: '0.9rem' }}>New Password</Typography>
                        <TextField fullWidth type="password" name="newPassword" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} required variant="outlined" placeholder="Enter new password" InputProps={{ style: { borderRadius: '10px', background: '#f5f5f5', fontSize: '0.95rem' } }} />
                    </Box>
                    <Box mb={3}>
                        <Button variant="contained" fullWidth type="submit" onClick={handleResetPassword} style={{ background: '#4caf50', color: 'white', fontSize: '1rem', padding: '12px', borderRadius: '10px', margin: '10px 0', textTransform: 'none', fontWeight: '600', boxShadow: '0 3px 5px rgba(0,0,0,0.1)', transition: 'all 0.3s ease' }}>Reset Password</Button>
                    </Box>
                    <Box mt={2} textAlign="center">
                        <Link component={RouterLink} to="/login" style={{ textDecoration: 'none', fontSize: '0.9rem', color: '#4caf50', fontWeight: '600' }}>Back to Login</Link>
                    </Box>
                </Box>
            </Container>
        </div>
    );
};

export default ForgotPassword;