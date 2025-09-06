import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Container, TextField, Button, Typography, Box, Link, Alert } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';

const Signup = () => {
    const [user, setUser] = useState({ fullname: '', username: '', email: '', password: '' });
    const [error, setError] = useState(null);
    const [message, setMessage] = useState(null);

    useEffect(() => {
        document.body.style.background = 'url(j.jpg) no-repeat center center fixed';
        document.body.style.backgroundSize = 'cover';
        return () => { document.body.style.background = ''; };
    }, []);

    const handleChange = (e) => setUser({ ...user, [e.target.name]: e.target.value });

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post('http://localhost:8081/api/users/jobseeker', user);
            setMessage('User Saved.');
            setUser({ fullname: '', username: '', email: '', password: '' });
        } catch (error) {
            setError('Error.');
            console.error('Error:', error);
        }
    };

    return (
        <div style={{ background: 'url(/public/j.jpg) no-repeat center center fixed', backgroundSize: 'cover', display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
            <Container style={{ padding: '30px', background: 'rgb(207, 201, 201)', backdropFilter: 'blur(8px)', borderRadius: '20px', boxShadow: '0 10px 30px rgba(0, 0, 0, 0.1)', width: '1040px', height: '860px', maxWidth: '90%', margin: '40px auto', display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', border: '1px solid rgba(255, 255, 255, 0.5)' }}>
                <Box style={{ flex: 1.6, marginRight: '40px', borderRadius: '15px 50px 50px 15px', overflow: 'hidden', boxShadow: '0 5px 15px rgba(0,0,0,0.1)' }}>
                    <img src="/login.jpg" alt="Signup Illustration" style={{ width: '100%', height: '840px', objectFit: 'cover', display: 'block' }} />
                </Box>
                <Box style={{ flex: 1, padding: '30px' }}>
                    <Typography variant="h4" align="center" style={{ fontFamily: 'Poppins, sans-serif', fontWeight: '800', color: '#4caf50', marginBottom: '30px', fontSize: '1.8rem' }}>SIGNUP PAGE</Typography>
                    {message && <Alert severity="success">{message}</Alert>}
                    {error && <Alert severity="error">{error}</Alert>}
                    <form onSubmit={handleSubmit}>
                        {['fullname', 'username', 'email', 'password'].map((field) => (
                            <Box mb={3} key={field}>
                                <Typography variant="subtitle2" style={{ fontFamily: 'Poppins, sans-serif', fontWeight: '500', color: '#2e7d32', marginBottom: '8px', fontSize: '0.9rem' }}>{field.charAt(0).toUpperCase() + field.slice(1).replace('name', ' Name')}</Typography>
                                <TextField fullWidth name={field} value={user[field]} onChange={handleChange} required variant="outlined" placeholder={`Your ${field}`} type={field === 'password' ? 'password' : 'text'} InputProps={{ style: { borderRadius: '10px', background: '#f5f5f5', fontSize: '0.95rem' } }} />
                            </Box>
                        ))}
                        <Button variant="contained" fullWidth type="submit" style={{ background: '#4caf50', color: 'white', fontSize: '1rem', padding: '12px', borderRadius: '10px', margin: '10px 0', textTransform: 'none', fontWeight: '600', boxShadow: '0 3px 5px rgba(0,0,0,0.1)', transition: 'all 0.3s ease' }}>Sign Up</Button>
                    </form>
                    <Box style={{ display: 'flex', justifyContent: 'space-between', marginTop: '20px' }}>
                        <Link component={RouterLink} to="/login" style={{ textDecoration: 'none', fontSize: '0.9rem', color: '#4caf50', fontWeight: '600' }}>Already have an account? Login</Link>
                    </Box>
                </Box>
            </Container>
        </div>
    );
};

export default Signup;