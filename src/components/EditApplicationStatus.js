import React, { useState, useEffect } from 'react';
import { Modal, Box, Button, Typography, IconButton, Alert, FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { updateApplicationStatus } from '../services/apiService';

const EditApplicationStatus = ({ open, onClose, applicationId, currentStatus, onUpdate }) => {
    const [status, setStatus] = useState(currentStatus || ''), [error, setError] = useState('');

    useEffect(() => { setStatus(currentStatus || ''); }, [currentStatus]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const updated = await updateApplicationStatus(applicationId, status);
            onUpdate(updated); onClose();
        } catch (error) {
            console.error("Error updating application status:", error);
            setError('Failed to update application status. Please try again.');
        }
    };

    return (
        <Modal open={open} onClose={onClose}>
            <Box sx={modalStyle}>
                <IconButton aria-label="close" onClick={onClose} sx={{ position: 'absolute', right: 8, top: 8, color: '#6a1b9a' }}><CloseIcon /></IconButton>
                <Typography variant="h4" align="center" sx={modalTitleStyle}>Edit Application Status</Typography>
                {error && <Alert severity="error">{error}</Alert>}
                <form onSubmit={handleSubmit}>
                    <FormControl fullWidth margin="normal" sx={inputStyle}>
                        <InputLabel id="status-label" sx={{ color: '#6a1b9a' }}>Status</InputLabel>
                        <Select labelId="status-label" value={status} label="Status" onChange={(e) => setStatus(e.target.value)} required>
                            {['PENDING', 'ACCEPTED', 'REJECTED'].map(opt => <MenuItem key={opt} value={opt}>{opt}</MenuItem>)}
                        </Select>
                    </FormControl>
                    <Button type="submit" variant="contained" color="primary" sx={submitButtonStyle}>Update Status</Button>
                </form>
            </Box>
        </Modal>
    );
};

const modalStyle = {
    position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: 400,
    bgcolor: 'white', border: '2px solid #6a1b9a', borderRadius: '8px', boxShadow: 24, p: 4,
    display: 'flex', flexDirection: 'column', alignItems: 'center'
};

const modalTitleStyle = {
    fontFamily: 'Verdana, sans-serif', fontSize: '2rem', fontWeight: 'bold',
    color: '#6a1b9a', textAlign: 'center', marginBottom: '20px'
};

const inputStyle = {
    '& .MuiOutlinedInput-root': {
        '& fieldset': { borderColor: '#ccc' },
        '&:hover fieldset': { borderColor: '#6a1b9a' },
        '&.Mui-focused fieldset': { borderColor: '#6a1b9a' }
    }
};

const submitButtonStyle = {
    mt: 2, bgcolor: '#6a1b9a', '&:hover': { bgcolor: '#4a0072' }
};

export default EditApplicationStatus;