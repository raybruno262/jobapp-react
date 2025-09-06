import React, { useEffect, useState } from 'react';
import {
  Container, Typography, Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, Paper, Button, TextField, Pagination,
  FormControl, InputLabel, Select, MenuItem, Box, Snackbar, Alert
} from '@mui/material';
import { Edit as EditIcon, Delete as DeleteIcon } from '@mui/icons-material';
import { getPaginatedUsers, deleteUser } from '../services/apiService';
import AddUser from './AddUser';
import EditUser from './EditUser';

const User = () => {
  const [state, setState] = useState({
    users: [],
    isAddModalOpen: false,
    isEditModalOpen: false,
    editingUserId: null,
    page: 1,
    rowsPerPage: 5,
    totalPages: 1,
    filters: { userId: '', fullname: '', username: '', email: '', role: '' },
    alert: { open: false, message: '', severity: 'info' }
  });

  useEffect(() => { fetchData(); }, [state.page, state.rowsPerPage]);

  const fetchData = async () => {
    try {
      const result = await getPaginatedUsers(state.page - 1, state.rowsPerPage);
      setState(prev => ({ 
        ...prev, 
        users: result.content || [], 
        totalPages: result.totalPages 
      }));
    } catch (error) {
      console.error('Error fetching users:', error);
      setState(prev => ({ 
        ...prev, 
        alert: { open: true, message: 'Failed to load users', severity: 'error' } 
      }));
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteUser(id);
      setState(prev => ({
        ...prev,
        alert: { open: true, message: 'User deleted successfully', severity: 'success' }
      }));
      fetchData();
    } catch (error) {
      console.error('Error deleting user:', error);
      setState(prev => ({
        ...prev,
        alert: { 
          open: true, 
          message: error.response?.data?.message || error.message || 'Failed to delete user', 
          severity: 'error' 
        }
      }));
    }
  };

  const filteredUsers = state.users.filter(user =>
    user.userId.toString().includes(state.filters.userId) &&
    user.fullname.toLowerCase().includes(state.filters.fullname.toLowerCase()) && 
    user.username.toLowerCase().includes(state.filters.username.toLowerCase()) &&
    user.email.toLowerCase().includes(state.filters.email.toLowerCase()) &&
    user.role.toLowerCase().includes(state.filters.role.toLowerCase())
  );

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name in state.filters) {
      setState(prev => ({ ...prev, filters: { ...prev.filters, [name]: value } }));
    }
  };

  return (
    <Container maxWidth="md" sx={{ mt: 0 }}>
      <Typography variant="h4" align="center" sx={{
        fontFamily: 'Verdana, sans-serif',
        fontSize: '2.5rem',
        fontWeight: 'bold',
        color: '#2e7d32',
        mb: 1,
        textShadow: '1px 1px 2px rgba(0,0,0,0.2)'
      }}>
        Users
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
            ml:-28 
          }}
        >
          Add User
        </Button>

        {/* AddUser component should be imported or implemented here */}
         <AddUser 
          open={state.isAddModalOpen} 
          onClose={() => setState(prev => ({ ...prev, isAddModalOpen: false }))} 
          onAdd={fetchData} 
        /> 

        {/* EditUser component should be imported or implemented here */}
         <EditUser 
          open={state.isEditModalOpen} 
          onClose={() => setState(prev => ({ ...prev, isEditModalOpen: false }))} 
          userId={state.editingUserId} 
          onUpdate={fetchData} 
        /> 

        <TableContainer component={Paper} sx={{ boxShadow: 3, borderRadius: '12px', overflow: 'hidden' ,width: '1300px',ml:-30,mb: 4}}>
          <Table sx={{ bgcolor: 'rgba(230, 239, 240, 0.67)' }}>
            <TableHead sx={{ bgcolor: 'rgba(230, 239, 240, 0.67)' }}>
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
                    />
                  </TableCell>
                ))}
                <TableCell sx={{ fontWeight: 'bold', color: '#333' }}>Actions</TableCell>
              </TableRow>
              <TableRow sx={{ bgcolor: '#4caf50' }}>
                {['User ID', 'Full Name', 'Username', 'Email', 'Role', 'Actions'].map(head => (
                  <TableCell key={head} sx={{ fontWeight: 'bold', color: '#ffffff' }}>{head}</TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredUsers.map((user, index) => (
                <TableRow key={user.userId} hover sx={{ bgcolor: index % 2 === 0 ? '#252525' : '#2f2f2f' }}>
                  {['userId', 'fullname', 'username', 'email', 'role'].map(field => (
                    <TableCell key={field}>{user[field]}</TableCell>
                  ))}
                  <TableCell align="right">
                    <Box display="inline-flex">
                      <Button 
                        color="primary" 
                        startIcon={<EditIcon />} 
                        onClick={() => setState(prev => ({ 
                          ...prev, 
                          editingUserId: user.userId, 
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
                        onClick={() => handleDelete(user.userId)} 
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
              onChange={(e) => setState(prev => ({ 
                ...prev, 
                rowsPerPage: e.target.value, 
                page: 1 
              }))} 
              label="Rows per page"
            >
              {[5, 10, 20].map(size => <MenuItem key={size} value={size}>{size}</MenuItem>)}
            </Select>
          </FormControl>
          <Pagination 
            count={state.totalPages} 
            page={state.page} 
            onChange={(_, value) => setState(prev => ({ ...prev, page: value }))}
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

export default User;