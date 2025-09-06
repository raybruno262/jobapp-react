import React, { useEffect, useState } from 'react';
import { 
  Container, Typography, Table, TableBody, TableCell, TableContainer, 
  TableHead, TableRow, Paper, Button, TextField, Pagination, 
  FormControl, InputLabel, Select, MenuItem, Box, Snackbar, Alert 
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AddJobCategory from './AddJobCategory';
import EditJobCategory from './EditJobCategory';
import { getPaginatedJobCategories, deleteJobCategory } from '../services/apiService';

const JobCategory = () => {
  const [state, setState] = useState({
    jobCategories: [],
    isAddModalOpen: false,
    isEditModalOpen: false,
    editingJobCategoryId: null,
    page: 1,
    rowsPerPage: 5,
    totalPages: 1,
    filters: { jobCategoryId: '', categoryName: '', description: '' },
    alert: { open: false, message: '', severity: 'info' }
  });

  useEffect(() => {
    fetchData();
  }, [state.page, state.rowsPerPage]);

  const fetchData = async () => {
    try {
      const result = await getPaginatedJobCategories(state.page - 1, state.rowsPerPage);
      setState(prev => ({
        ...prev,
        jobCategories: result.content || [],
        totalPages: result.totalPages
      }));
    } catch (error) {
      console.error('Error fetching job categories:', error);
      setState(prev => ({
        ...prev,
        alert: { open: true, message: 'Failed to load job categories', severity: 'error' }
      }));
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteJobCategory(id);
      setState(prev => ({
        ...prev,
        alert: { open: true, message: 'Job category deleted successfully', severity: 'success' }
      }));
      fetchData();
    } catch (error) {
      console.error('Error deleting job category:', error);
      setState(prev => ({
        ...prev,
        alert: {
          open: true,
          message: error.response?.data?.message || 'Failed to delete job category',
          severity: 'error'
        }
      }));
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name in state.filters) {
      setState(prev => ({
        ...prev,
        filters: { ...prev.filters, [name]: value }
      }));
    }
  };

  const handlePageChange = (_, value) => {
    setState(prev => ({ ...prev, page: value }));
  };

  const handleRowsPerPageChange = (e) => {
    setState(prev => ({
      ...prev,
      rowsPerPage: e.target.value,
      page: 1
    }));
  };

  const filteredJobCategories = state.jobCategories.filter(category =>
    category.jobCategoryId.toString().includes(state.filters.jobCategoryId) &&
    category.categoryName.toLowerCase().includes(state.filters.categoryName.toLowerCase()) &&
    category.description.toLowerCase().includes(state.filters.description.toLowerCase())
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
        Job Categories
      </Typography>

      <Box sx={{ p: 3 }}>
        <Button
          variant="contained"
          onClick={() => setState(prev => ({ ...prev, isAddModalOpen: true }))}
          sx={{
            borderRadius: '8px',
            p: '10px 20px',
            bgcolor: 'green',
            '&:hover': { bgcolor: 'darkgreen' },
            mb: 2,
            mt:-7,
            ml:-15
          }}
        >
          Add Job Category
        </Button>

        <AddJobCategory
          open={state.isAddModalOpen}
          onClose={() => setState(prev => ({ ...prev, isAddModalOpen: false }))}
          onAdd={fetchData}
        />

        <EditJobCategory
          open={state.isEditModalOpen}
          onClose={() => setState(prev => ({ ...prev, isEditModalOpen: false }))}
          jobCategoryId={state.editingJobCategoryId}
          onUpdate={fetchData}
        />

        <TableContainer component={Paper} sx={{ boxShadow: 3, borderRadius: '12px', overflow: 'hidden', mb: 4 , width: '1000px', ml:-15}}>
          <Table sx={{ bgcolor: 'rgba(230, 239, 240, 0.67)' }} size="small">
            <TableHead>
              <TableRow>
                {Object.keys(state.filters).map(key => (
                  <TableCell key={key} sx={{ fontWeight: 'bold', color: '#333' }}>
                    <TextField
                      label={`Search ${key.charAt(0).toUpperCase() + key.slice(1)}`}
                      name={key}
                      variant="outlined"
                      value={state.filters[key]}
                      onChange={handleChange}
                      fullWidth
                      margin="dense"
                      size="small"
                    />
                  </TableCell>
                ))}
                <TableCell sx={{ fontWeight: 'bold', color: '#333' }}>Modify</TableCell>
              </TableRow>
              <TableRow sx={{ bgcolor: '#9c27b0' }}>
                {['Category ID', 'Category Name', 'Description', 'Modify'].map(header => (
                  <TableCell key={header} sx={{ color: '#ffffff' }}>{header}</TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredJobCategories.map(category => (
                <TableRow key={category.jobCategoryId} hover>
                  <TableCell>{category.jobCategoryId}</TableCell>
                  <TableCell>{category.categoryName}</TableCell>
                  <TableCell>{category.description}</TableCell>
                  <TableCell align="right">
                    <Box display="inline-flex">
                      <Button
                        color="primary"
                        startIcon={<EditIcon />}
                        onClick={() => setState(prev => ({
                          ...prev,
                          editingJobCategoryId: category.jobCategoryId,
                          isEditModalOpen: true
                        }))}
                        sx={{
                          mr: 1,
                          borderRadius: '8px',
                          color: 'white',
                          bgcolor: 'green',
                          '&:hover': { bgcolor: 'green' }
                        }}
                        size="small"
                      >
                        Edit
                      </Button>
                      <Button
                        startIcon={<DeleteIcon />}
                        onClick={() => handleDelete(category.jobCategoryId)}
                        sx={{
                          borderRadius: '8px',
                          bgcolor: '#f44336',
                          color: '#ffffff',
                          '&:hover': { bgcolor: '#d32f2f' }
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
          <FormControl variant="outlined" sx={{ minWidth: 120 }}>
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
          anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        >
          <Alert
            onClose={() => setState(prev => ({ ...prev, alert: { ...prev.alert, open: false } }))}
            severity={state.alert.severity}
            sx={{ width: '100%' }}
          >
            {state.alert.message}
          </Alert>
        </Snackbar>
      </Box>
    </Container>
  );
};

export default JobCategory;
