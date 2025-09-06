import React, { useState, useEffect } from 'react'; import { createUser } from '../services/apiService'; import { Modal, Box, TextField, Button, Typography, MenuItem, Select, FormControl, InputLabel, IconButton, Alert } from '@mui/material'; import CloseIcon from '@mui/icons-material/Close';

const AddUser = ({ open, onClose, onAdd }) => {
    const [user, setUser] = useState({ fullname: '', username: '', email: '', password: '', role: '' }); const [error, setError] = useState(''); const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => { if (open) { setUser({ fullname: '', username: '', email: '', password: '', role: '' }); setError(''); } }, [open]);

    const handleChange = (e) => { const { name, value } = e.target; setUser((prev) => ({ ...prev, [name]: value })); };

    const handleSubmit = async (e) => {
        e.preventDefault(); setIsSubmitting(true); setError('');
        try { const newUser = await createUser(user); onAdd(newUser); onClose(); } 
        catch (error) { console.error("Error posting user:", error); setError('Failed to add user. Please try again.'); } 
        finally { setIsSubmitting(false); }
    };

    return (
        <Modal open={open} onClose={onClose}>
            <Box sx={modalStyle}>
                <IconButton aria-label="close" onClick={onClose} sx={{ position: 'absolute', right: 8, top: 8, color: '#9e9e9e', '&:hover': { color: '#4caf50' } }}><CloseIcon /></IconButton>
                <Typography variant="h4" align="center" sx={modalTitleStyle}>Add User</Typography>
                {error && <Alert severity="error" sx={{ mb: 2, width: '100%', bgcolor: '#2a2a2a' }}>{error}</Alert>}
                <form onSubmit={handleSubmit}>
                    <TextField name="fullname" label="Full Name" value={user.fullname} onChange={handleChange} fullWidth margin="normal" required disabled={isSubmitting} sx={inputStyle} />
                    <TextField name="username" label="Username" value={user.username} onChange={handleChange} fullWidth margin="normal" required disabled={isSubmitting} sx={inputStyle} />
                    <TextField name="email" label="Email" value={user.email} onChange={handleChange} fullWidth margin="normal" required disabled={isSubmitting} sx={inputStyle} />
                    <TextField name="password" type="password" label="Password" value={user.password} onChange={handleChange} fullWidth margin="normal" required disabled={isSubmitting} sx={inputStyle} />
                    <FormControl fullWidth margin="normal" required sx={inputStyle}>
                        <InputLabel>Role</InputLabel>
                        <Select name="role" value={user.role} onChange={handleChange} label="Role" disabled={isSubmitting}>
                            <MenuItem value="EMPLOYER">EMPLOYER</MenuItem>
                            <MenuItem value="JOBSEEKER">JOBSEEKER</MenuItem>
                        </Select>
                    </FormControl>
                    <Button type="submit" variant="contained" disabled={isSubmitting} sx={submitButtonStyle}>{isSubmitting ? 'Saving...' : 'Add User'}</Button>
                </form>
            </Box>
        </Modal>
    );
};

const modalStyle = { position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: { xs: '90%', sm: 500 }, bgcolor: '#1c1c1c', border: '1px solid #333', borderRadius: '10px', boxShadow: '0 4px 20px rgba(85, 81, 81, 0.5)', p: 4, color: '#f5f5f5' };
const modalTitleStyle = { fontFamily: 'Poppins, sans-serif', fontSize: { xs: '1.8rem', sm: '2.2rem' }, fontWeight: 700, color: '#4caf50', textAlign: 'center', mb: 3 };
const inputStyle = { '& .MuiInputLabel-root': { color: '#9e9e9e' }, '& .MuiInputLabel-root.Mui-focused': { color: '#4caf50' }, '& .MuiOutlinedInput-root': { color: '#f5f5f5', '& fieldset': { borderColor: '#333' }, '&:hover fieldset': { borderColor: '#4caf50' }, '&.Mui-focused fieldset': { borderColor: '#4caf50' } }, '& .MuiInputBase-input': { color: '#f5f5f5' } };
const submitButtonStyle = { width: '50%', backgroundColor: '#4caf50', color: 'white', fontSize: '1rem', padding: '10px', borderRadius: '8px', margin: '20px auto 0', display: 'block', '&:hover': { backgroundColor: '#388e3c' }, '&:disabled': { backgroundColor: '#2a2a2a', color: '#555' } };

export default AddUser;