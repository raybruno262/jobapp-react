import React, { useState, useEffect } from 'react'; import PropTypes from 'prop-types';
import { applyForJob, getAllJobListings, checkIfApplied } from '../services/apiService';
import { Modal, Box, Button, Typography, IconButton, Select, MenuItem, FormControl, InputLabel, Alert } from '@mui/material'; import CloseIcon from '@mui/icons-material/Close';

const AddApplication = ({ open, onClose, onSuccess }) => {
    const [jobs, setJobs] = useState([]); const [selectedJobId, setSelectedJobId] = useState(''); const [selectedJobTitle, setSelectedJobTitle] = useState(''); const [error, setError] = useState(''); const [success, setSuccess] = useState(''); const [isSubmitting, setIsSubmitting] = useState(false); const [isChecking, setIsChecking] = useState(false); const [alreadyApplied, setAlreadyApplied] = useState(false);

    useEffect(() => {
        if (open) { setSelectedJobId(''); setSelectedJobTitle(''); setError(''); setSuccess(''); setAlreadyApplied(false); fetchJobListings(); }
    }, [open]);

    const fetchJobListings = async () => {
        try { const jobData = await getAllJobListings(); setJobs(jobData); } 
        catch (error) { console.error("Failed to fetch job listings:", error); setError('Failed to load job listings. Please try again later.'); }
    };

    const handleJobSelect = async (e) => {
        const jobId = e.target.value; setSelectedJobId(jobId); setError(''); setSuccess('');
        const selectedJob = jobs.find(job => job.jobId === jobId); if (!selectedJob) return;
        setSelectedJobTitle(selectedJob.title); setIsChecking(true);
        try { const hasApplied = await checkIfApplied(jobId); setAlreadyApplied(hasApplied); if (hasApplied) { setError(`You've already applied to "${selectedJob.title}"`); } } 
        catch (error) { if (error.message.includes('login')) { setError(error.message); } console.warn('Application check warning:', error.message); } 
        finally { setIsChecking(false); }
    };

    const handleSubmit = async (e) => {
        e.preventDefault(); setIsSubmitting(true); setError(''); setSuccess('');
        if (!selectedJobId) { setError('Please select a job'); setIsSubmitting(false); return; }
        try { await applyForJob(selectedJobId, {}); setSuccess(`Success! Your application for "${selectedJobTitle}" has been submitted.`); setAlreadyApplied(true); if (onSuccess) { onSuccess(); } setTimeout(() => onClose(), 2000); } 
        catch (error) { console.error("Application error:", error);
            if (error.response?.status === 400 && error.response.data === 'Already applied to this job') { setError('You have already applied to this job'); setAlreadyApplied(true); } 
            else if (error.response?.status === 400) { setError(error.response.data || 'Invalid application data'); } 
            else { setError(error.message || 'Failed to submit application. Please try again.'); } } 
        finally { setIsSubmitting(false); }
    };

    return (
        <Modal open={open} onClose={onClose}>
            <Box sx={modalStyle}>
                <IconButton aria-label="close" onClick={onClose} sx={{ position: 'absolute', right: 8, top: 8, color: '#9e9e9e', '&:hover': { color: '#4caf50' } }}><CloseIcon /></IconButton>
                <Typography variant="h4" align="center" sx={modalTitleStyle}>Apply for Job</Typography>
                
                {error && <Alert severity="error" sx={{ mb: 2, width: '100%', bgcolor: '#2a2a2a', '& .MuiAlert-message': { color: alreadyApplied ? '#ff5252' : '#f5f5f5' }, '& .MuiAlert-icon': { color: alreadyApplied ? '#ff5252' : '#f5f5f5' } }}>
                    {error}{alreadyApplied && <Box sx={{ mt: 1, fontSize: '0.9rem', color: 'white' }}>You can view your application in "My Applications"</Box>}</Alert>}
                
                {success && <Alert severity="success" sx={{ mb: 2, width: '100%', bgcolor: '#1c1c1c', '& .MuiAlert-message': { color: '#f5f5f5' } }}>
                    {success}<Box sx={{ mt: 1, fontWeight: 'bold', color: '#f5f5f5' }}>We'll contact you if your application progresses.</Box></Alert>}
                
                <form onSubmit={handleSubmit}>
                    <FormControl fullWidth margin="normal" required sx={inputStyle}>
                        <InputLabel sx={{ color: '#9e9e9e' }}>Select Job</InputLabel>
                        <Select value={selectedJobId} onChange={handleJobSelect} label="Select Job" disabled={isSubmitting || isChecking}
                            MenuProps={{ PaperProps: { style: { maxHeight: 300, overflowY: 'auto', backgroundColor: '#1e1e1e' } } }}>
                            <MenuItem value="" disabled sx={{ color: '#9e9e9e' }}>{isChecking ? 'Checking applications...' : 'Select a job'}</MenuItem>
                            {jobs.map((job, index) => (
                                <MenuItem key={job.jobId} value={job.jobId} sx={{ color: '#f5f5f5', opacity: alreadyApplied && job.jobId === selectedJobId ? 0.7 : 1, backgroundColor: index % 2 === 0 ? '#252525' : '#2f2f2f', alignItems: 'flex-start' }}>
                                    <Box display="flex" flexDirection="column" sx={{ padding: '12px' }}>
                                        <Box display="flex" justifyContent="space-between"><Typography sx={{ fontWeight: 'bold', fontSize: '1rem', color: '#ffffff' }}>Title:</Typography><Typography sx={{ fontSize: '1rem', color: '#ffffff' }}>{job.title}</Typography></Box>
                                        <Box display="flex" justifyContent="space-between"><Typography sx={{ fontWeight: 'bold', fontSize: '1rem', color: '#b0bec5' }}>Description:</Typography><Typography sx={{ fontSize: '1rem', color: '#b0bec5' }}>{job.description}</Typography></Box>
                                        <Box display="flex" justifyContent="space-between"><Typography sx={{ fontWeight: 'bold', fontSize: '1rem', color: '#ff9800' }}>Location:</Typography><Typography sx={{ fontSize: '1rem', color: '#ff9800' }}>{job.location}</Typography></Box>
                                        <Box display="flex" justifyContent="space-between" sx={{ padding: '5px 0' }}><Typography sx={{ fontWeight: 'bold', fontSize: '1rem', color: '#4caf50', marginRight: '10px' }}>Salary:</Typography><Typography sx={{ fontSize: '1rem', color: '#4caf50' }}>{job.salary.toFixed(2)} Rwf</Typography></Box>
                                        {alreadyApplied && job.jobId === selectedJobId && <Box display="flex" justifyContent="space-between"><Typography sx={{ fontWeight: 'bold', fontSize: '0.9rem', color: '#ff5252' }}>Status:</Typography><Typography sx={{ fontSize: '0.9rem', color: '#ff5252' }}>(Applied)</Typography></Box>}
                                    </Box>
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>

                    <Button type="submit" variant="contained" sx={{ ...submitButtonStyle, backgroundColor: alreadyApplied ? '#4caf50' : '#4caf50' }} disabled={isSubmitting || isChecking || !selectedJobId || alreadyApplied}>
                        {isSubmitting ? 'Submitting...' : isChecking ? 'Checking...' : alreadyApplied ? 'Application Submitted' : 'Submit Application'}
                    </Button>
                </form>
            </Box>
        </Modal>
    );
};

AddApplication.propTypes = { open: PropTypes.bool.isRequired, onClose: PropTypes.func.isRequired, onSuccess: PropTypes.func };

const modalStyle = { position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: { xs: '90%', sm: 500 }, bgcolor: '#1c1c1c', border: '1px solid #333', borderRadius: '10px', boxShadow: '0 4px 20px rgba(85, 81, 81, 0.5)', p: 4, color: '#f5f5f5' };
const modalTitleStyle = { fontFamily: 'Poppins, sans-serif', fontSize: { xs: '1.8rem', sm: '2.2rem' }, fontWeight: 700, color: '#4caf50', textAlign: 'center', mb: 3 };
const inputStyle = { '& .MuiInputLabel-root': { color: '#9e9e9e' }, '& .MuiInputLabel-root.Mui-focused': { color: '#4caf50' }, '& .MuiOutlinedInput-root': { color: '#f5f5f5', '& fieldset': { borderColor: '#333' }, '&:hover fieldset': { borderColor: '#4caf50' }, '&.Mui-focused fieldset': { borderColor: '#4caf50' } }, '& .MuiSelect-icon': { color: '#9e9e9e' } };
const submitButtonStyle = { width: '100%', backgroundColor: '#4caf50', color: 'white', fontSize: '1rem', padding: '10px', borderRadius: '8px', margin: '20px 0 0', display: 'block', '&:hover': { backgroundColor: '#388e3c' }, '&:disabled': { backgroundColor: '#2a2a2a', color: '#555' } };

export default AddApplication;