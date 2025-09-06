import React, { useState, useEffect } from 'react'; import { createJobListing, getAllJobCategories } from '../services/apiService'; import { Modal, Box, TextField, Button, Typography, IconButton, Select, MenuItem, FormControl, InputLabel, Alert } from '@mui/material'; import CloseIcon from '@mui/icons-material/Close';

const AddJobListing = ({ open, onClose, onAdd }) => {
    const [jobListing, setJobListing] = useState({ title: '', description: '', location: '', salary: '', jobCategory: { jobCategoryId: '' } }); const [jobCategories, setJobCategories] = useState([]); const [selectedCategory, setSelectedCategory] = useState(null); const [error, setError] = useState(''); const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => { if (open) { setJobListing({ title: '', description: '', location: '', salary: '', jobCategory: { jobCategoryId: '' } }); setSelectedCategory(null); setError(''); fetchJobCategories(); } }, [open]);

    const fetchJobCategories = async () => { try { const categories = await getAllJobCategories(); setJobCategories(categories); } catch (error) { console.error("Failed to fetch job categories:", error); } };

    const handleChange = (e) => { const { name, value } = e.target; setJobListing((prev) => ({ ...prev, [name]: value })); };

    const handleCategoryChange = (e) => { const selectedId = e.target.value; const category = jobCategories.find((cat) => cat.jobCategoryId === selectedId); setJobListing(prev => ({ ...prev, jobCategory: { jobCategoryId: selectedId } })); setSelectedCategory(category); };

    const handleSubmit = async (e) => {
        e.preventDefault(); const requiredFields = ['title', 'location', 'salary']; const missingFields = requiredFields.filter(field => !jobListing[field]);
        if (missingFields.length > 0 || !jobListing.jobCategory.jobCategoryId) { setError(`Please fill all required fields: ${missingFields.join(', ')}${!jobListing.jobCategory.jobCategoryId ? ', job category' : ''}`); return; }
        const salaryValue = parseFloat(jobListing.salary); if (salaryValue <= 0) { setError('Salary must be greater than 0'); return; }
        setIsSubmitting(true); setError('');
        try { const newJobListing = await createJobListing({ title: jobListing.title.trim(), description: jobListing.description.trim() || null, location: jobListing.location.trim(), salary: salaryValue, jobCategory: { jobCategoryId: jobListing.jobCategory.jobCategoryId } }); onAdd(newJobListing); onClose(); } 
        catch (error) { let errorMessage = 'Failed to create job listing';
            if (error.response) { if (error.response.status === 400) { errorMessage = 'Validation error: ' + (error.response.data?.message || 'Invalid data provided'); } else if (error.response.status === 500) { errorMessage = 'Server error. Please try again later.'; }
                if (error.response.data?.errors) { errorMessage += ': ' + Object.values(error.response.data.errors).join(', '); } else if (error.response.data?.message) { errorMessage += ` (${error.response.data.message})`; } } 
            else if (error.request) { errorMessage = 'No response from server. Check your connection.'; }
            setError(errorMessage); console.error("Job listing creation error:", error); } 
        finally { setIsSubmitting(false); }
    };

    return (
        <Modal open={open} onClose={onClose}>
            <Box sx={modalStyle}>
                <IconButton aria-label="close" onClick={onClose} sx={{ position: 'absolute', right: 8, top: 8, color: '#9e9e9e', '&:hover': { color: '#4caf50' } }}><CloseIcon /></IconButton>
                <Typography variant="h4" align="center" sx={modalTitleStyle}>Add Job Listing</Typography>
                {error && <Alert severity="error" sx={{ mb: 2, width: '100%', bgcolor: '#2a2a2a' }}>{error}</Alert>}
                <form onSubmit={handleSubmit}>
                    <TextField name="title" label="Job Title" value={jobListing.title} onChange={handleChange} fullWidth margin="normal" required disabled={isSubmitting} sx={inputStyle} />
                    <TextField name="description" label="Description" value={jobListing.description} onChange={handleChange} fullWidth margin="normal" multiline rows={4} disabled={isSubmitting} sx={inputStyle} />
                    <TextField name="location" label="Location" value={jobListing.location} onChange={handleChange} fullWidth margin="normal" required disabled={isSubmitting} sx={inputStyle} />
                    <TextField name="salary" label="Salary" type="number" value={jobListing.salary} onChange={handleChange} fullWidth margin="normal" required inputProps={{ min: 0, step: "0.01" }} disabled={isSubmitting} sx={inputStyle} />
                    <FormControl fullWidth margin="normal" required sx={formControlStyle}>
                        <InputLabel sx={inputLabelStyle}>Job Category</InputLabel>
                        <Select value={jobListing.jobCategory.jobCategoryId || ''} onChange={handleCategoryChange} label="Job Category" disabled={isSubmitting} sx={selectStyle}>
                            {jobCategories.map((category) => <MenuItem key={category.jobCategoryId} value={category.jobCategoryId} sx={menuItemStyle}>{category.categoryName}</MenuItem>)}
                        </Select>
                    </FormControl>
                    <Button type="submit" variant="contained" disabled={isSubmitting} sx={submitButtonStyle}>{isSubmitting ? 'Saving...' : 'Save Job Listing'}</Button>
                </form>
            </Box>
        </Modal>
    );
};

const modalStyle = { position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: { xs: '90%', sm: 500 }, bgcolor: '#1c1c1c', border: '1px solid #333', borderRadius: '10px', boxShadow: '0 4px 20px rgba(85, 81, 81, 0.5)', p: 4, color: '#f5f5f5' };
const modalTitleStyle = { fontFamily: 'Poppins, sans-serif', fontSize: { xs: '1.8rem', sm: '2.2rem' }, fontWeight: 700, color: '#4caf50', textAlign: 'center', mb: 3 };
const inputStyle = { '& .MuiInputLabel-root': { color: '#9e9e9e' }, '& .MuiInputLabel-root.Mui-focused': { color: '#4caf50' }, '& .MuiOutlinedInput-root': { color: '#f5f5f5', '& fieldset': { borderColor: '#333' }, '&:hover fieldset': { borderColor: '#4caf50' }, '&.Mui-focused fieldset': { borderColor: '#4caf50' } }, '& .MuiInputBase-input': { color: '#f5f5f5' } };
const formControlStyle = { '& .MuiInputLabel-root': { color: '#9e9e9e' }, '& .MuiInputLabel-root.Mui-focused': { color: '#4caf50' } };
const inputLabelStyle = { color: '#9e9e9e', '&.Mui-focused': { color: '#4caf50' } };
const selectStyle = { color: '#f5f5f5', '& .MuiOutlinedInput-notchedOutline': { borderColor: '#333' }, '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: '#4caf50' }, '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: '#4caf50' }, '& .MuiSvgIcon-root': { color: '#9e9e9e' } };
const menuItemStyle = { color: '#f5f5f5', backgroundColor: '#1c1c1c', '&:hover': { backgroundColor: '#333' }, '&.Mui-selected': { backgroundColor: '#4caf50', '&:hover': { backgroundColor: '#388e3c' } } };
const submitButtonStyle = { width: '50%', backgroundColor: '#4caf50', color: 'white', fontSize: '1rem', padding: '10px', borderRadius: '8px', margin: '20px auto 0', display: 'block', '&:hover': { backgroundColor: '#388e3c' }, '&:disabled': { backgroundColor: '#2a2a2a', color: '#555' } };

export default AddJobListing;