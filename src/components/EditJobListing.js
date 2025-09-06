import React, { useState, useEffect, useCallback } from 'react';
import { getJobListingById, updateJobListing, getAllJobCategories } from '../services/apiService';
import { Modal, Box, TextField, Button, Typography, IconButton, Select, MenuItem, InputLabel, FormControl, Alert } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

const EditJobListing = ({ open, onClose, jobId, onUpdate }) => {
    const [jobListing, setJobListing] = useState({ title: '', description: '', location: '', salary: '', jobCategory: { jobCategoryId: '' } });
    const [jobCategories, setJobCategories] = useState([]);
    const [error, setError] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const fetchJobListingAndCategories = useCallback(async () => {
        setError('');
        if (!jobId) return;
        try {
            const fetchedCategories = await getAllJobCategories();
            const fetchedJobListing = await getJobListingById(jobId);
            setJobListing({ ...fetchedJobListing, salary: fetchedJobListing.salary.toString() });
            setJobCategories(fetchedCategories);
        } catch (error) {
            console.error('Failed to fetch job listing or categories:', error);
            setError('Failed to fetch data. Please try again.');
        }
    }, [jobId]);

    useEffect(() => {
        if (open) fetchJobListingAndCategories();
    }, [open, fetchJobListingAndCategories]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!jobListing.title.trim() || !jobListing.location.trim() || !jobListing.salary.trim() || !jobListing.jobCategory.jobCategoryId) {
            setError('Please fill all required fields');
            return;
        }
        setIsSubmitting(true);
        setError('');
        try {
            await updateJobListing(jobId, { ...jobListing, salary: parseFloat(jobListing.salary) });
            onUpdate(jobListing);
            onClose();
        } catch (error) {
            console.error('Error updating job listing:', error);
            setError('Failed to update job listing. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Modal open={open} onClose={onClose}>
            <Box sx={modalStyle}>
                <IconButton aria-label="close" onClick={onClose} sx={{ position: 'absolute', right: 8, top: 8, color: '#9e9e9e', '&:hover': { color: '#4caf50' } }}>
                    <CloseIcon />
                </IconButton>
                <Typography variant="h4" align="center" sx={modalTitleStyle}>Edit Job Listing</Typography>
                {error && <Alert severity="error" sx={{ mb: 2, width: '100%', bgcolor: '#2a2a2a' }}>{error}</Alert>}
                <form onSubmit={handleSubmit}>
                    <TextField name="title" label="Job Title" value={jobListing.title} onChange={(e) => setJobListing(p => ({ ...p, [e.target.name]: e.target.value }))} fullWidth margin="normal" required disabled={isSubmitting} sx={inputStyle} />
                    <TextField name="description" label="Description" value={jobListing.description} onChange={(e) => setJobListing(p => ({ ...p, [e.target.name]: e.target.value }))} fullWidth margin="normal" multiline rows={4} disabled={isSubmitting} sx={inputStyle} />
                    <TextField name="location" label="Location" value={jobListing.location} onChange={(e) => setJobListing(p => ({ ...p, [e.target.name]: e.target.value }))} fullWidth margin="normal" required disabled={isSubmitting} sx={inputStyle} />
                    <TextField name="salary" label="Salary" type="number" value={jobListing.salary} onChange={(e) => setJobListing(p => ({ ...p, [e.target.name]: e.target.value }))} fullWidth margin="normal" required inputProps={{ min: 0, step: "0.01" }} disabled={isSubmitting} sx={inputStyle} />
                    <FormControl fullWidth margin="normal" required sx={inputStyle}>
                        <InputLabel>Job Category</InputLabel>
                        <Select value={jobListing.jobCategory.jobCategoryId} onChange={(e) => {
                            const selectedId = e.target.value;
                            setJobListing(p => ({ ...p, jobCategory: { jobCategoryId: selectedId } }));
                        }} label="Job Category" disabled={isSubmitting}>
                            {jobCategories.map(c => <MenuItem key={c.jobCategoryId} value={c.jobCategoryId}>{c.categoryName}</MenuItem>)}
                        </Select>
                    </FormControl>
                    <Button type="submit" variant="contained" disabled={isSubmitting} sx={submitButtonStyle}>
                        {isSubmitting ? 'Updating...' : 'Update Job Listing'}
                    </Button>
                </form>
            </Box>
        </Modal>
    );
};

const modalStyle = {
    position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: { xs: '90%', sm: 500 },
    bgcolor: '#1c1c1c', border: '1px solid #333', borderRadius: '10px', boxShadow: '0 4px 20px rgba(85, 81, 81, 0.5)',
    p: 4, color: '#f5f5f5'
};

const modalTitleStyle = {
    fontFamily: 'Poppins, sans-serif', fontSize: { xs: '1.8rem', sm: '2.2rem' }, fontWeight: 700, color: '#4caf50',
    textAlign: 'center', mb: 3
};

const inputStyle = {
    '& .MuiInputLabel-root': { color: '#9e9e9e' },
    '& .MuiInputLabel-root.Mui-focused': { color: '#4caf50' },
    '& .MuiOutlinedInput-root': { color: '#f5f5f5',
        '& fieldset': { borderColor: '#333' },
        '&:hover fieldset': { borderColor: '#4caf50' },
        '&.Mui-focused fieldset': { borderColor: '#4caf50' }
    },
    '& .MuiInputBase-input': { color: '#f5f5f5' }
};

const submitButtonStyle = {
    width: '50%', backgroundColor: '#4caf50', color: 'white', fontSize: '1rem', padding: '10px',
    borderRadius: '8px', margin: '20px auto 0', display: 'block',
    '&:hover': { backgroundColor: '#388e3c' },
    '&:disabled': { backgroundColor: '#2a2a2a', color: '#555' }
};

export default EditJobListing;