import React, { useState, useEffect } from 'react';
import { getUserById, updateUser } from '../services/apiService';
import { Modal, Box, TextField, Button, Typography, FormControl, InputLabel, Select, MenuItem, IconButton, Alert } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

const EditUser = ({ open, onClose, userId, onUpdate }) => {
    const [user, setUser] = useState({ fullname: '', username: '', email: '', password: '', role: '' });
    const [error, setError] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        if (!userId) return;
        getUserById(userId).then(setUser).catch(e => {
            console.error("Error fetching user:", e);
            setError('Failed to fetch user data. Please try again.');
        });
    }, [userId]);

    const handleChange = e => setUser(prev => ({ ...prev, [e.target.name]: e.target.value }));
    const handleSubmit = async e => {
        e.preventDefault();
        if (!user.fullname || !user.email || !user.username) return setError('All fields must be filled out');
        setIsSubmitting(true);
        try {
            onUpdate(await updateUser(userId, user));
            onClose();
        } catch (error) {
            console.error("Error updating user:", error);
            setError('Failed to update user. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    const styles = {
        modal: {
            position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: { xs: '90%', sm: 500 },
            bgcolor: '#1c1c1c', border: '1px solid #333', borderRadius: '10px', boxShadow: '0 4px 20px rgba(85, 81, 81, 0.5)',
            p: 4, color: '#f5f5f5'
        },
        closeIcon: {
            position: 'absolute', right: 8, top: 8, color: '#9e9e9e', '&:hover': { color: '#4caf50' }
        },
        title: {
            fontFamily: 'Poppins, sans-serif', fontSize: { xs: '1.8rem', sm: '2.2rem' }, fontWeight: 700, color: '#4caf50',
            textAlign: 'center', mb: 3
        },
        input: {
            '& .MuiInputLabel-root': { color: '#9e9e9e' },
            '& .MuiInputLabel-root.Mui-focused': { color: '#4caf50' },
            '& .MuiOutlinedInput-root': { 
                color: '#f5f5f5',
                '& fieldset': { borderColor: '#333' },
                '&:hover fieldset': { borderColor: '#4caf50' },
                '&.Mui-focused fieldset': { borderColor: '#4caf50' }
            },
            '& .MuiInputBase-input': { color: '#f5f5f5' }
        },
        button: {
            width: '50%', backgroundColor: '#4caf50', color: 'white', fontSize: '1rem', padding: '10px',
            borderRadius: '8px', margin: '20px auto 0', display: 'block',
            '&:hover': { backgroundColor: '#388e3c' },
            '&:disabled': { backgroundColor: '#2a2a2a', color: '#555' }
        }
    };

    return (
        <Modal open={open} onClose={onClose}>
            <Box sx={styles.modal}>
                <IconButton aria-label="close" onClick={onClose} sx={styles.closeIcon}>
                    <CloseIcon />
                </IconButton>
                <Typography variant="h4" align="center" sx={styles.title}>Edit User</Typography>
                {error && <Alert severity="error" sx={{ mb: 2, width: '100%', bgcolor: '#2a2a2a' }}>{error}</Alert>}
                <form onSubmit={handleSubmit}>
                    <TextField name="fullname" label="Full Name" value={user.fullname} onChange={handleChange} fullWidth margin="normal" required disabled={isSubmitting} sx={styles.input} />
                    <TextField name="username" label="Username" value={user.username} onChange={handleChange} fullWidth margin="normal" required disabled={isSubmitting} sx={styles.input} />
                    <TextField name="email" label="Email" value={user.email} onChange={handleChange} fullWidth margin="normal" required disabled={isSubmitting} sx={styles.input} />
                    <FormControl fullWidth margin="normal" required sx={styles.input}>
                        <InputLabel id="role-label">Role</InputLabel>
                        <Select labelId="role-label" name="role" value={user.role} onChange={handleChange} disabled={isSubmitting}>
                            <MenuItem value="EMPLOYER">EMPLOYER</MenuItem>
                            <MenuItem value="JOBSEEKER">JOBSEEKER</MenuItem>
                        </Select>
                    </FormControl>
                    <Button type="submit" variant="contained" disabled={isSubmitting} sx={styles.button}>
                        {isSubmitting ? 'Saving...' : 'Update User'}
                    </Button>
                </form>
            </Box>
        </Modal>
    );
};

export default EditUser;