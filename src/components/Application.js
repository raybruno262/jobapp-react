import React, { useEffect, useState, useCallback } from 'react'; import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button, TextField, Pagination, FormControl, InputLabel, Select, MenuItem, Box, Snackbar, Alert, CircularProgress, Chip, Modal, Typography } from '@mui/material'; import { Edit as EditIcon, Delete as DeleteIcon } from '@mui/icons-material'; import { getAllApplicationsPaginated, deleteApplication, updateApplicationStatus } from '../services/apiService'; import * as XLSX from 'xlsx';

const statusOptions = ['PENDING', 'ACCEPTED', 'REJECTED'];

const Applications = () => {
    const [applications, setApplications] = useState([]); const [isEditModalOpen, setIsEditModalOpen] = useState(false); const [editingApplicationId, setEditingApplicationId] = useState(null); const [page, setPage] = useState(1); const [totalPages, setTotalPages] = useState(1); const [rowsPerPage, setRowsPerPage] = useState(5); const [filters, setFilters] = useState({ applicationId: '', jobTitle: '', applicantName: '', status: '' }); const [alert, setAlert] = useState({ open: false, message: '', severity: 'info' }); const [selectedStatus, setSelectedStatus] = useState('PENDING'); const [isLoading, setIsLoading] = useState(false);

    const fetchData = useCallback(async (page, rowsPerPage) => {
        setIsLoading(true); try { const result = await getAllApplicationsPaginated(page - 1, rowsPerPage); setApplications(result.content.map(app => ({ ...app, jobTitle: app.job?.title || 'N/A', applicantName: app.user?.fullname || 'N/A' }))); setTotalPages(result.totalPages); } catch (error) { console.error('Error fetching applications:', error); setAlert({ open: true, message: 'Failed to fetch applications', severity: 'error' }); } finally { setIsLoading(false); }
    }, []);

    useEffect(() => { fetchData(page, rowsPerPage); }, [page, rowsPerPage, fetchData]);

    const handleDelete = async (id) => {
        setIsLoading(true); try { await deleteApplication(id); const result = await getAllApplicationsPaginated(page - 1, rowsPerPage); setApplications(result.content.map(app => ({ ...app, jobTitle: app.job?.title || 'N/A', applicantName: app.user?.fullname || 'N/A' }))); setTotalPages(result.totalPages); if (result.content.length === 0 && page > 1) { setPage(page - 1); } } catch (error) { setAlert({ open: true, message: error.response?.data?.message || error.message || 'Failed to delete application', severity: 'error' }); } finally { setIsLoading(false); }
    };

    const handleStatusUpdate = async () => {
        setIsLoading(true); try { const result = await updateApplicationStatus(editingApplicationId, selectedStatus); setApplications(applications.map(app => app.applicationId === result.applicationId ? { ...result, jobTitle: app.jobTitle, applicantName: app.applicantName } : app)); setIsEditModalOpen(false); setAlert({ open: true, message: 'Application status updated successfully', severity: 'success' }); } catch (error) { console.error("Error updating application status:", error); setAlert({ open: true, message: error.response?.data?.message || error.message || 'Failed to update application status', severity: 'error' }); } finally { setIsLoading(false); }
    };

    const handleCloseAlert = () => { setAlert(prev => ({ ...prev, open: false })); };
    const handleFilterChange = (e) => { const { name, value } = e.target; setFilters((prev) => ({ ...prev, [name]: value })); };
    const handlePageChange = (event, value) => setPage(value);
    const handleRowsPerPageChange = (event) => { setRowsPerPage(event.target.value); setPage(1); };

    const filteredApplications = applications.filter(app => {
        const appId = app.applicationId?.toString()?.toLowerCase() || '';
        const jobTitle = app.jobTitle?.toLowerCase() || '';
        const applicantName = app.applicantName?.toLowerCase() || '';
        const status = app.status?.toLowerCase() || '';
        return (appId.includes(filters.applicationId.toLowerCase()) && jobTitle.includes(filters.jobTitle.toLowerCase()) && applicantName.includes(filters.applicantName.toLowerCase()) && status.includes(filters.status.toLowerCase()));
    });

    const exportToExcel = () => {
        const worksheet = XLSX.utils.json_to_sheet(filteredApplications.map((app) => ({ 'Application ID': app.applicationId, 'Job Title': app.jobTitle, 'Applicant Name': app.applicantName, 'Status': app.status })));
        const workbook = XLSX.utils.book_new(); XLSX.utils.book_append_sheet(workbook, worksheet, 'Applications'); XLSX.writeFile(workbook, 'Applications.xlsx');
    };

    const getStatusColor = (status) => { switch(status) { case 'ACCEPTED': return 'success'; case 'REJECTED': return 'error'; case 'PENDING': return 'purple'; } };

    return (
        <Box sx={{ width: '1405px', ml: '190px', my: -1 }}>
            <Typography variant="h4" align="center" style={{ fontFamily: 'Verdana, sans-serif', fontSize: '2.5rem', fontWeight: 'bold', color: '#2e7d32', textAlign: 'center', marginBottom: '-10px', textShadow: '1px 1px 2px rgba(0, 0, 0, 0.2)' }}>All Applications</Typography>
            <Box display="flex" justifyContent="flex-end" mb={0}>
                <Button variant="contained" color="success" onClick={exportToExcel} sx={{ mb: 3, borderRadius: '8px', padding: '10px 20px', backgroundColor: '#2e7d32', '&:hover': { backgroundColor: '#1b5e20' } }} disabled={isLoading}>Export to Excel</Button>
            </Box>

            <TableContainer component={Paper} sx={{ mb: 4, boxShadow: 3, borderRadius: '12px', width: '100%', overflow: 'hidden', maxHeight: '60vh' }}>
                <Table sx={{ backgroundColor: 'rgba(230, 239, 240, 0.67)', minWidth: 1200 }} size="small">
                    <TableHead sx={{ backgroundColor: 'rgba(230, 239, 240, 0.67)' }}>
                        <TableRow>
                            {['applicationId', 'jobTitle', 'applicantName', 'status'].map((field) => (
                                <TableCell key={field} sx={{ fontWeight: 'bold', backgroundColor: 'rgba(230, 239, 240, 0.67)' }}>
                                    <TextField label={`Search ${field}`} name={field} variant="outlined" value={filters[field]} onChange={handleFilterChange} fullWidth margin="dense" size="small" sx={{ borderRadius: '8px' }} disabled={isLoading} />
                                </TableCell>
                            ))}
                            <TableCell sx={{ fontWeight: 'bold', backgroundColor: 'rgba(230, 239, 240, 0.67)' }}></TableCell>
                        </TableRow>
                        <TableRow sx={{ backgroundColor: '#9c27b0' }}>
                            {['App ID', 'Job Title', 'Applicant', 'Status', 'Modify'].map((header) => (<TableCell key={header} sx={{ color: '#fff' }}>{header}</TableCell>))}
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {isLoading ? (<TableRow><TableCell colSpan={5} align="center"><CircularProgress /></TableCell></TableRow>) : 
                         filteredApplications.length > 0 ? (filteredApplications.map((app) => (
                            <TableRow key={app.applicationId} hover>
                                <TableCell sx={{ py: 1 }}>{app.applicationId}</TableCell>
                                <TableCell sx={{ py: 1 }}>{app.jobTitle}</TableCell>
                                <TableCell sx={{ py: 1 }}>{app.applicantName}</TableCell>
                                <TableCell sx={{ py: 1 }}><Chip label={app.status} color={getStatusColor(app.status)} variant="outlined" size="small" /></TableCell>
                                <TableCell align="right" sx={{ py: 1 }}>
                                    <Box display="inline-flex" justifyContent="flex-start" alignItems="center">
                                        <Button color="primary" startIcon={<EditIcon fontSize="small" />} onClick={() => { setEditingApplicationId(app.applicationId); setSelectedStatus(app.status); setIsEditModalOpen(true); }} sx={{ mr: 1, borderRadius: '8px' }} size="small" disabled={isLoading}>Edit</Button>
                                        <Button startIcon={<DeleteIcon fontSize="small" />} onClick={() => handleDelete(app.applicationId)} sx={{ borderRadius: '8px', backgroundColor: '#f44336', color: '#ffffff', '&:hover': { backgroundColor: '#d32f2f' } }} size="small" disabled={isLoading}>Delete</Button>
                                    </Box>
                                </TableCell>
                            </TableRow>
                        ))) : (<TableRow><TableCell colSpan={5} align="center">No applications found</TableCell></TableRow>)}
                    </TableBody>
                </Table>
            </TableContainer>

            <Box display="flex" justifyContent="space-between" alignItems="center" mt={2}>
                <FormControl variant="outlined" sx={{ minWidth: 120 }} size="small">
                    <InputLabel>Rows per page</InputLabel>
                    <Select value={rowsPerPage} onChange={handleRowsPerPageChange} label="Rows per page" size="small" disabled={isLoading}>
                        {[5, 10, 20].map((size) => (<MenuItem key={size} value={size}>{size}</MenuItem>))}
                    </Select>
                </FormControl>
                <Pagination count={totalPages} page={page} onChange={handlePageChange} sx={{ color: '#ffffff', backgroundColor: '#2a2a2a', borderRadius: '8px', padding: '10px', '& .MuiPaginationItem-root': { color: '#ffffff', '&.Mui-selected': { backgroundColor: '#4caf50', color: '#ffffff' }, '&:hover': { backgroundColor: '#388e3c' } } }} size="small" disabled={isLoading} />
            </Box>

            <Modal open={isEditModalOpen} onClose={() => setIsEditModalOpen(false)}>
                <Box sx={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: 400, bgcolor: 'background.paper', boxShadow: 24, p: 4, borderRadius: '12px' }}>
                    <Typography variant="h6" component="h2" sx={{ mb: 2 }}>Update Application Status</Typography>
                    <FormControl fullWidth sx={{ mb: 3 }}>
                        <InputLabel>Status</InputLabel>
                        <Select value={selectedStatus} onChange={(e) => setSelectedStatus(e.target.value)} label="Status">
                            {statusOptions.map(status => (<MenuItem key={status} value={status}>{status}</MenuItem>))}
                        </Select>
                    </FormControl>
                    <Box display="flex" justifyContent="flex-end">
                        <Button onClick={() => setIsEditModalOpen(false)} sx={{ mr: 2 }}>Cancel</Button>
                        <Button onClick={handleStatusUpdate} variant="contained" disabled={isLoading} sx={{ backgroundColor: '#4caf50', '&:hover': { backgroundColor: '#388e3c' } }}>{isLoading ? <CircularProgress size={24} /> : 'Update'}</Button>
                    </Box>
                </Box>
            </Modal>

            <Snackbar open={alert.open} autoHideDuration={1000} onClose={handleCloseAlert} anchorOrigin={{ vertical: 'top', horizontal: 'center' }}>
                <Alert onClose={handleCloseAlert} severity={alert.severity} sx={{ width: '100%' }}>{alert.message}</Alert>
            </Snackbar>
        </Box>
    );
};

export default Applications;