import React, { useEffect, useState } from 'react';
import AddJobListing from './AddJobListing';
import EditJobListing from './EditJobListing';
import {
  Container, Typography, Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, Paper, Button, TextField, Pagination,
  FormControl, InputLabel, Select, MenuItem, Box, Snackbar, Alert
} from '@mui/material';
import { Edit as EditIcon, Delete as DeleteIcon } from '@mui/icons-material';
import { getPaginatedJobListings, deleteJobListing } from '../services/apiService';

const JobListing = () => {
  const [state, setState] = useState({
    jobs: [],
    isAddModalOpen: false,
    isEditModalOpen: false,
    editingJobId: null,
    page: 1,
    rowsPerPage: 5, // Default to 5 rows per page
    totalPages: 1,
    filters: { jobId: '', title: '', description: '', location: '', salary: '', jobCategory: '' },
    alert: { open: false, message: '', severity: 'info' }
  });

  useEffect(() => {
    fetchData();
  }, [state.page, state.rowsPerPage]);

  const fetchData = async () => {
    try {
      const result = await getPaginatedJobListings(state.page - 1, state.rowsPerPage);
      setState(prev => ({
        ...prev,
        jobs: result.content || [],
        totalPages: result.totalPages
      }));
    } catch (error) {
      console.error('Error fetching jobs:', error);
      setState(prev => ({
        ...prev,
        alert: { open: true, message: 'Failed to load jobs', severity: 'error' }
      }));
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteJobListing(id);
      fetchData();
    } catch (error) {
      setState(prev => ({
        ...prev,
        alert: { open: true, message: 'Failed to delete job listing', severity: 'error' }
      }));
    }
  };

  const handlePageChange = (_, value) => {
    setState(prev => ({ ...prev, page: value }));
  };

  const handleRowsPerPageChange = (e) => {
    setState(prev => ({
      ...prev,
      rowsPerPage: parseInt(e.target.value, 10),
      page: 1 // Reset to first page when changing rows per page
    }));
  };
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setState(prev => ({
      ...prev,
      filters: { ...prev.filters, [name]: value }
    }));
  };


  const filteredJobs = state.jobs.filter(job =>
    Object.entries(state.filters).every(([key, value]) =>
      !value || job[key]?.toString().toLowerCase().includes(value.toLowerCase()) ||
      (key === 'jobCategory' && job[key]?.categoryName?.toLowerCase().includes(value.toLowerCase()))
    )
  );
  return (
    <Container maxWidth="md" sx={{ mt: -1 }}>
          <Typography variant="h4" align="center" sx={{
            fontFamily: 'Verdana, sans-serif',
            fontSize: '2.5rem',
            fontWeight: 'bold',
            color: '#2e7d32',
            mb: 1,
            textShadow: '1px 1px 2px rgba(0,0,0,0.2)'
          }}>
            Job Listings
          </Typography>
      <Box display="flex" justifyContent="space-between" mb={3}>
        <Button
          variant="contained"
          onClick={() => setState(prev => ({ ...prev, isAddModalOpen: true }))}
          sx={{ backgroundColor: 'green', '&:hover': { backgroundColor: 'darkgreen' } ,ml:-25,}}
        >
          Add Job Listing
        </Button>
      </Box>

      <AddJobListing
        open={state.isAddModalOpen}
        onClose={() => setState(prev => ({ ...prev, isAddModalOpen: false }))}
        onAdd={fetchData}
      />

      <EditJobListing
        open={state.isEditModalOpen}
        onClose={() => setState(prev => ({ ...prev, isEditModalOpen: false }))}
        jobId={state.editingJobId}
        onUpdate={fetchData}
      />


      <TableContainer component={Paper} sx={{ mb: 4, boxShadow: 3,mt:2, borderRadius: '12px',width:1200,ml:-25, overflow: 'hidden' }}>
        <Table size="small">
          <TableHead>
          <TableRow>
              {Object.keys(state.filters).map((field) => (
                <TableCell key={field}>
                  <TextField
                    label={`Search ${field}`}
                    name={field}
                    variant="outlined"
                    value={state.filters[field]}
                    onChange={handleFilterChange}
                    fullWidth
                    margin="dense"
                    size="small"
                    
                  />
                </TableCell>
                
              ))}

            </TableRow>

            <TableRow sx={{ backgroundColor: '#9c27b0' }}>
              {['Job ID', 'Title', 'Description', 'Location', 'Salary', 'Category', 'Modify'].map(header => (
                <TableCell key={header} sx={{ color: '#fff' }}>{header}</TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredJobs.map(job => (
              <TableRow key={job.jobId} hover>
                <TableCell>{job.jobId}</TableCell>
                <TableCell>{job.title}</TableCell>
                <TableCell>{job.description}</TableCell>
                <TableCell>{job.location}</TableCell>
                <TableCell>{job.salary}</TableCell>
                <TableCell>{job.jobCategory?.categoryName}</TableCell>
                <TableCell align="right">
                  <Box display="inline-flex">
                    <Button
                      color="primary"
                      startIcon={<EditIcon fontSize="small" />}
                      onClick={() => setState(prev => ({ ...prev, editingJobId: job.jobId, isEditModalOpen: true }))}
                      sx={{ mr: 1, borderRadius: '8px' }}
                      size="small"
                    >
                      Edit
                    </Button>
                    <Button
                      startIcon={<DeleteIcon fontSize="small" />}
                      onClick={() => handleDelete(job.jobId)}
                      sx={{
                        borderRadius: '8px',
                        backgroundColor: '#f44336',
                        color: '#ffffff',
                        '&:hover': { backgroundColor: '#d32f2f' }
                      }}
                      size="small"
                    >
                      Delete
                    </Button>
                  </Box>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Box display="flex" justifyContent="space-between" alignItems="center" mt={2}>
        <FormControl variant="outlined" sx={{ minWidth: 120 }} size="small">
          <InputLabel>Rows per page</InputLabel>
          <Select
            value={state.rowsPerPage}
            onChange={handleRowsPerPageChange}
            label="Rows per page"
          >
            {[5, 10, 20].map(size => (
              <MenuItem key={size} value={size}>{size}</MenuItem>
            ))}
          </Select>
        </FormControl>
        <Pagination
          count={state.totalPages}
          page={state.page}
          onChange={handlePageChange}
          size="small"
          sx={{ 
            color: '#ffffff', 
            bgcolor: '#2a2a2a', 
            borderRadius: '8px', 
            p: '10px', 
            '& .MuiPaginationItem-root': { 
              color: '#ffffff', 
              '&.Mui-selected': { bgcolor: '#4caf50' }, 
              '&:hover': { bgcolor: '#388e3c' } 
            } 
          }} 
        />
      </Box>

      <Snackbar
        open={state.alert.open}
        autoHideDuration={1000}
        onClose={() => setState(prev => ({ ...prev, alert: { ...prev.alert, open: false } }))}
      >
        <Alert severity={state.alert.severity} sx={{ width: '100%' }}>
          {state.alert.message}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default JobListing;
