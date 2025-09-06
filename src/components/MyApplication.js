import React, { useEffect, useState } from 'react';
import {
  Container, Typography, Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, Paper, Button, TextField, Pagination,
  FormControl, InputLabel, Select, MenuItem, Box, Chip
} from '@mui/material';
import { getMyApplicationsPaginated } from '../services/apiService';
import AddApplication from './AddApplication';

const statusColors = {
  ACCEPTED: { bg: '#4caf50', text: '#fff' },
  REJECTED: { bg: '#f44336', text: '#fff' },
  PENDING: { bg: 'purple', text: '#fff' }
};

const MyApplication = () => {
  const [state, setState] = useState({
    applications: [],
    page: 1,
    totalPages: 1,
    rowsPerPage: 5,
    filters: { jobTitle: '', status: '' },
    isApplyModalOpen: false
  });

  useEffect(() => {
    fetchApplications();
  }, [state.page, state.rowsPerPage, state.filters]);

  const fetchApplications = async () => {
    try {
      const result = await getMyApplicationsPaginated(state.page - 1, state.rowsPerPage, state.filters);
      setState(prev => ({ ...prev, applications: result.content || [], totalPages: result.totalPages }));
    } catch (error) {
      console.error("Error loading applications", error);
    }
  };

  const handlePageChange = (_, value) => {
    setState(prev => ({ ...prev, page: value }));
  };

  const handleRowsPerPageChange = (e) => {
    setState(prev => ({
      ...prev,
      rowsPerPage: parseInt(e.target.value, 10),
      page: 1 // Reset pagination when changing rows per page
    }));
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setState(prev => ({
      ...prev,
      filters: { ...prev.filters, [name]: value },
      page: 1 // Reset page when filtering
    }));
  };

  const filteredApplications = state.applications.filter(app =>
    (app.job?.title || '').toLowerCase().includes(state.filters.jobTitle.toLowerCase()) &&
    (app.status || '').toLowerCase().includes(state.filters.status.toLowerCase())
  );

  return (
    <Container maxWidth="md" sx={{ mt: 4 }}>
      <Typography variant="h4" align="center" sx={{
        fontFamily: 'Verdana, sans-serif',
        fontSize: '2.5rem',
        fontWeight: 'bold',
        color: '#2e7d32',
        mb: -1.25,
        textShadow: '1px 1px 2px rgba(0,0,0,0.2)'
      }}>
        My Applications
      </Typography>

      <Box display="flex" justifyContent="space-between" mb={3}>
        <Button variant="contained" onClick={() => setState(prev => ({ ...prev, isApplyModalOpen: true }))}
          sx={{ mb: 3, borderRadius: '8px', p: '10px 20px', bgcolor: 'green', '&:hover': { bgcolor: 'darkgreen' } }}>
          Apply For Job
        </Button>
      </Box>

      <AddApplication
        open={state.isApplyModalOpen}
        onClose={() => setState(prev => ({ ...prev, isApplyModalOpen: false }))}
        onSuccess={() => { setState(prev => ({ ...prev, page: 1 })); fetchApplications(); }}
      />

      <TableContainer component={Paper} sx={{ mb: 4, boxShadow: 3, borderRadius: '12px', width: '100%', overflow: 'hidden' }}>
        <Table sx={{ backgroundColor: 'rgba(230, 239, 240, 0.67)' }}>
          <TableHead>
            <TableRow>
              {Object.keys(state.filters).map(field => (
                <TableCell key={field} sx={{ fontWeight: 'bold' }}>
                  <TextField label={`Search ${field === 'jobTitle' ? 'Job Title' : 'Status'}`} name={field}
                    value={state.filters[field]} onChange={handleFilterChange} fullWidth margin="dense"
                    sx={{ borderRadius: '8px', input: { color: '#fff' } }} />
                </TableCell>
              ))}
            </TableRow>
            <TableRow sx={{ backgroundColor: '#9c27b0' }}>
              {['Job Title', 'Status'].map(header => (
                <TableCell key={header} sx={{ color: '#fff' }}>{header}</TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredApplications.map((app, index) => (
              <TableRow key={index}>
                <TableCell>{app.job?.title || 'N/A'}</TableCell>
                <TableCell>
                  <Chip label={app.status || 'N/A'} sx={{
                    backgroundColor: statusColors[app.status?.toUpperCase()]?.bg || '#9e9e9e',
                    color: statusColors[app.status?.toUpperCase()]?.text || '#fff',
                    fontWeight: 'bold',
                    minWidth: 100
                  }} />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Box display="flex" justifyContent="space-between" alignItems="center" mt={2}>
        <FormControl variant="outlined" sx={{ minWidth: 120 }}>
          <InputLabel>Rows per page</InputLabel>
          <Select value={state.rowsPerPage} onChange={handleRowsPerPageChange} label="Rows per page">
            {[5, 10, 20].map(size => <MenuItem key={size} value={size}>{size}</MenuItem>)}
          </Select>
        </FormControl>
        <Pagination count={state.totalPages} page={state.page}
          onChange={handlePageChange}
          sx={{
            color: '#ffffff', backgroundColor: '#2a2a2a', borderRadius: '8px', padding: '10px',
            '& .MuiPaginationItem-root': {
              color: '#ffffff',
              '&.Mui-selected': { backgroundColor: '#4caf50' },
              '&:hover': { backgroundColor: '#388e3c' }
            }
          }} />
      </Box>
    </Container>
  );
};

export default MyApplication;