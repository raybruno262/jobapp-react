import React, { useEffect, useState, useCallback } from 'react';
import { Modal, Box, TextField, Button, Typography, IconButton, Alert } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { broadcastToEmployers } from '../services/apiService';

const BroadcastToEmployers = ({ open, onClose, onSend }) => {
    const [messageText, setMessageText] = useState(''), [error, setError] = useState(''), [success, setSuccess] = useState(''), [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => { if (open) { setMessageText(''); setError(''); setSuccess(''); } }, [open]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!messageText.trim()) { setError('Please enter a message'); return; }
        setIsSubmitting(true); setError('');
        try {
            const sentMessages = await broadcastToEmployers(messageText.trim());
            onSend(sentMessages); setSuccess('Message broadcasted successfully!');
            setTimeout(() => { onClose(); setSuccess(''); }, 1500);
        } catch (error) {
            console.error("Error broadcasting message:", error);
            setError(error.response?.data?.message || error.message || 'Failed to broadcast message');
        } finally { setIsSubmitting(false); }
    };

    return (
        <Modal open={open} onClose={onClose}>
            <Box sx={modalStyle}>
                <IconButton aria-label="close" onClick={onClose} sx={{ position: 'absolute', right: 8, top: 8, color: '#9e9e9e', '&:hover': { color: '#4caf50' } }}><CloseIcon /></IconButton>
                <Typography variant="h4" align="center" sx={modalTitleStyle}>Broadcast Message to Employers</Typography>
                {error && <Alert severity="error" sx={{ mb: 2, width: '100%', bgcolor: '#2a2a2a' }}>{error}</Alert>}
                {success && <Alert severity="success" sx={{ mb: 2, width: '100%', bgcolor: '#2a2a2a' }}>{success}</Alert>}
                <form onSubmit={handleSubmit}>
                    <TextField name="messageText" label="Message" value={messageText} onChange={(e) => setMessageText(e.target.value)} fullWidth margin="normal" multiline rows={4} required disabled={isSubmitting} sx={inputStyle} />
                    <Button type="submit" variant="contained" disabled={isSubmitting} sx={submitButtonStyle}>{isSubmitting ? 'Sending...' : 'Send'}</Button>
                </form>
            </Box>
        </Modal>
    );
};

const modalStyle = { position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: { xs: '90%', sm: 500 }, bgcolor: '#1c1c1c', border: '1px solid #333', borderRadius: '10px', boxShadow: '0 4px 20px rgba(85, 81, 81, 0.5)', p: 4, color: '#f5f5f5' };
const modalTitleStyle = { fontFamily: 'Poppins, sans-serif', fontSize: { xs: '1.8rem', sm: '2.2rem' }, fontWeight: 700, color: '#4caf50', textAlign: 'center', mb: 3 };
const inputStyle = { '& .MuiInputLabel-root': { color: '#9e9e9e' }, '& .MuiInputLabel-root.Mui-focused': { color: '#4caf50' }, '& .MuiOutlinedInput-root': { color: '#f5f5f5', '& fieldset': { borderColor: '#333' }, '&:hover fieldset': { borderColor: '#4caf50' }, '&.Mui-focused fieldset': { borderColor: '#4caf50' }, }, '& .MuiInputBase-input': { color: '#f5f5f5' } };
const submitButtonStyle = { width: '50%', backgroundColor: '#4caf50', color: 'white', fontSize: '1rem', padding: '10px', borderRadius: '8px', margin: '20px auto 0', display: 'block', '&:hover': { backgroundColor: '#388e3c' }, '&:disabled': { backgroundColor: '#2a2a2a', color: '#555' } };

export default BroadcastToEmployers;