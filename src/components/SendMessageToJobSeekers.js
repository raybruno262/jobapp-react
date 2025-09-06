import React, { useState, useEffect } from 'react';
import { sendMessageToJobSeeker, getAllJobSeekers } from '../services/apiService';
import { Modal, Box, TextField, Button, Typography, IconButton, Select, MenuItem, FormControl, InputLabel, Alert, ListItemText, CircularProgress } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

const modalStyle = {
    position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
    width: { xs: '90%', sm: 500 }, bgcolor: '#1c1c1c', border: '1px solid #333',
    borderRadius: '10px', boxShadow: '0 4px 20px rgba(85, 81, 81, 0.5)', p: 4, color: '#f5f5f5'
};

const inputStyle = {
    '& .MuiInputLabel-root': { color: '#9e9e9e' }, '& .MuiInputLabel-root.Mui-focused': { color: '#4caf50' },
    '& .MuiOutlinedInput-root': { color: '#f5f5f5', '& fieldset': { borderColor: '#333' },
    '&:hover fieldset': { borderColor: '#4caf50' }, '&.Mui-focused fieldset': { borderColor: '#4caf50' } },
    '& .MuiInputBase-input': { color: '#f5f5f5' }
};

const SendMessageToJobSeekers = ({ open, onClose, onSend }) => {
    const [jobSeekers, setJobSeekers] = useState([]);
    const [selectedJobSeekerId, setSelectedJobSeekerId] = useState('');
    const [messageText, setMessageText] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        if (open) {
            setSelectedJobSeekerId('');
            setMessageText('');
            setError('');
            setSuccess('');
            fetchJobSeekers();
        }
    }, [open]);

    const fetchJobSeekers = async () => {
        try {
            setJobSeekers(await getAllJobSeekers());
        } catch (error) {
            console.error("Failed to fetch job seekers:", error);
            setError('Failed to load job seekers. Please try again later.');
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!messageText.trim()) return setError('Please enter a message');
        if (!selectedJobSeekerId) return setError('Please select a job seeker');
        
        setIsSubmitting(true);
        setError('');
        setSuccess('');
    
        try {
            const response = await sendMessageToJobSeeker(selectedJobSeekerId.toString(), messageText);
            onSend(response);
            setSuccess('Message sent successfully!');
            setTimeout(() => { onClose(); setSuccess(''); }, 1500);
        } catch (error) {
            console.error("Error sending message:", error);
            setError(error.response?.data?.message || error.response?.statusText || 
                    `Server error: ${error.response?.status}` || error.request ? 
                    'No response from server' : error.message || 'Request setup error');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Modal open={open} onClose={onClose}>
            <Box sx={modalStyle}>
                <IconButton onClick={onClose} sx={{ position: 'absolute', right: 8, top: 8, color: '#9e9e9e', '&:hover': { color: '#4caf50' } }}>
                    <CloseIcon />
                </IconButton>
                <Typography variant="h4" align="center" sx={{ fontFamily: 'Poppins, sans-serif', fontSize: { xs: '1.8rem', sm: '2.2rem' }, fontWeight: 700, color: '#4caf50', textAlign: 'center', mb: 3 }}>
                    Send Message to Job Seeker
                </Typography>

                {error && <Alert severity="error" sx={{ mb: 2, width: '100%', bgcolor: '#2a2a2a' }}>{error}</Alert>}
                {success && <Alert severity="success" sx={{ mb: 2, width: '100%', bgcolor: '#2a2a2a' }}>{success}</Alert>}

                <form onSubmit={handleSubmit}>
                    <TextField name="messageText" label="Message" value={messageText} onChange={(e) => setMessageText(e.target.value)}
                        fullWidth margin="normal" multiline rows={4} required disabled={isSubmitting} sx={inputStyle} />

                    <FormControl fullWidth margin="normal" required>
                        <InputLabel sx={{ color: '#9e9e9e' }}>Select Job Seeker</InputLabel>
                        <Select value={selectedJobSeekerId} onChange={(e) => { setSelectedJobSeekerId(e.target.value); setError(''); }}
                            sx={inputStyle} label="Select Job Seeker" disabled={isSubmitting}>
                            {jobSeekers.map((jobSeeker) => (
                                <MenuItem key={jobSeeker.userId} value={jobSeeker.userId}>
                                    <ListItemText primary={jobSeeker.username} secondary={jobSeeker.email} />
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>

                    <Button type="submit" variant="contained" disabled={isSubmitting}
                        sx={{ width: '50%', backgroundColor: '#4caf50', color: 'white', fontSize: '1rem', padding: '10px',
                        borderRadius: '8px', margin: '20px auto 0', display: 'block', '&:hover': { backgroundColor: '#388e3c' },
                        '&:disabled': { backgroundColor: '#2a2a2a', color: '#555' } }}
                        endIcon={isSubmitting ? <CircularProgress size={20} color="inherit" /> : null}>
                        {isSubmitting ? 'Sending...' : 'Send Message'}
                    </Button>
                </form>
            </Box>
        </Modal>
    );
};

export default SendMessageToJobSeekers;