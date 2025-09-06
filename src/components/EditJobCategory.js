import React, { useState, useEffect } from 'react';
import { getJobCategoryById, updateJobCategory } from '../services/apiService';
import { Modal, Box, TextField, Button, Typography, IconButton, Alert } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

const EditJobCategory = ({ open, onClose, jobCategoryId, onUpdate }) => {
    const [jobCategory, setJobCategory] = useState({ categoryName: '', description: '' });
    const [error, setError] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        if (!jobCategoryId) return;
        getJobCategoryById(jobCategoryId).then(setJobCategory).catch(e => {
            console.error("Error fetching job category:", e);
            setError('Failed to fetch job category data. Please try again.');
        });
    }, [jobCategoryId]);

    const handleChange = (e) => setJobCategory(prev => ({ ...prev, [e.target.name]: e.target.value }));

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!jobCategory.categoryName.trim()) return setError('Category name is required');
        setIsSubmitting(true);
        try {
            await updateJobCategory(jobCategoryId, jobCategory);
            onUpdate(jobCategory);
            onClose();
        } catch (error) {
            console.error("Error updating job category:", error);
            setError('Failed to update job category. Please try again.');
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
                <IconButton aria-label="close" onClick={onClose} sx={{ position: 'absolute', right: 8, top: 8, color: '#9e9e9e', '&:hover': { color: '#4caf50' } }}>
                    <CloseIcon />
                </IconButton>
                <Typography variant="h4" align="center" sx={styles.title}>Edit Job Category</Typography>
                {error && <Alert severity="error" sx={{ mb: 2, width: '100%', bgcolor: '#2a2a2a' }}>{error}</Alert>}
                <form onSubmit={handleSubmit}>
                    <TextField name="categoryName" label="Category Name" value={jobCategory.categoryName} onChange={handleChange} fullWidth margin="normal" required disabled={isSubmitting} sx={styles.input} />
                    <TextField name="description" label="Description" value={jobCategory.description} onChange={handleChange} fullWidth margin="normal" multiline rows={4} disabled={isSubmitting} sx={styles.input} />
                    <Button type="submit" variant="contained" disabled={isSubmitting} sx={styles.button}>{isSubmitting ? 'Updating...' : 'Update'}</Button>
                </form>
            </Box>
        </Modal>
    );
};

export default EditJobCategory;