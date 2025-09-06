import React, { useState, useEffect } from 'react';
import { Box, Typography, Avatar, Paper, Divider, Button, CircularProgress, IconButton, TextField, Snackbar, Alert } from '@mui/material';
import { Edit, Save, Lock, Email, Person, Badge, Work } from '@mui/icons-material';
import axios from 'axios';

const UserProfile = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editMode, setEditMode] = useState(false);
  const [editData, setEditData] = useState({});
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        // const response = await axios.get('http://localhost:8081/api/users/profile/current', { withCredentials: true });
        const response = await axios.get('https://jobapp-spring.onrender.com/api/users/profile/current', { withCredentials: true });
       
        setEditData(response.data);
      } catch (err) {
        setSnackbar({ open: true, message: err.response?.data?.message || err.message || 'Failed to fetch profile', severity: 'error' });
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  const handleSave = async () => {
    try {
      setLoading(true);
      const response = await axios.put('http://localhost:8081/api/users/edit/profile', editData, { withCredentials: true });
      setProfile(response.data);
      setEditMode(false);
      setSnackbar({ open: true, message: 'Profile updated!', severity: 'success' });
    } catch (err) {
      setSnackbar({ open: true, message: err.response?.data?.message || 'Update failed', severity: 'error' });
    } finally {
      setLoading(false);
    }
  };

  if (loading && !profile) return (
    <Box display="flex" justifyContent="center" alignItems="center" minHeight="80vh">
      <CircularProgress size={60} />
      <Typography variant="body1" sx={{ ml: 2 }}>Loading...</Typography>
    </Box>
  );

  if (!profile) return (
    <Box display="flex" justifyContent="center" alignItems="center" minHeight="80vh">
      <Typography color="error" variant="h6">{snackbar.message}</Typography>
      <Button variant="contained" color="primary" onClick={() => window.location.reload()} sx={{ ml: 2 }}>Retry</Button>
    </Box>
  );

  return (
    <Box sx={{ maxWidth: 800, mx: 'auto', my: 4 }}>
      <Paper elevation={3} sx={{ p: 4, borderRadius: 3 }}>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
          <Typography variant="h4" sx={{ fontWeight: 'bold', background: 'linear-gradient(45deg, #6a1b9a, #9c27b0)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            My Profile
          </Typography>
          {!editMode && (
            <Button variant="contained" startIcon={<Edit />} onClick={() => setEditMode(true)} sx={{ background: 'linear-gradient(45deg, #6a1b9a, #9c27b0)', '&:hover': { background: 'linear-gradient(45deg, #9c27b0, #6a1b9a)' } }}>
              Edit
            </Button>
          )}
        </Box>

        <Box display="flex" flexDirection={{ xs: 'column', md: 'row' }} gap={4}>
          <Box flex={1} display="flex" flexDirection="column" alignItems="center">
            <Avatar sx={{ width: 150, height: 150, fontSize: 60, mb: 2, bgcolor: '#6a1b9a', boxShadow: '0 4px 20px rgba(106, 27, 154, 0.3)' }}>
              {profile.fullname?.charAt(0).toUpperCase()}
            </Avatar>
            <Typography variant="h5" sx={{ fontWeight: 'bold', mb: 1, color: 'green' }}>{profile.fullname}</Typography>
            <Typography variant="body1" sx={{ px: 2, py: 1, borderRadius: 2, bgcolor: profile.role === 'EMPLOYER' ? '#e3f2fd' : '#e8f5e9', color: profile.role === 'EMPLOYER' ? '#1976d2' : '#2e7d32', fontWeight: 'bold' }}>
              {profile.role}
            </Typography>
          </Box>

          <Box flex={2}>
            {editMode ? (
              <>
                {['fullname', 'username', 'email'].map(field => (
                  <TextField
                    key={field}
                    fullWidth
                    label={field.charAt(0).toUpperCase() + field.slice(1)}
                    name={field}
                    value={editData[field] || ''}
                    onChange={(e) => setEditData({...editData, [e.target.name]: e.target.value})}
                    variant="outlined"
                    sx={{ mb: 2, '& .MuiOutlinedInput-root': { '& fieldset': { borderColor: '#4caf50' }, '&:hover fieldset': { borderColor: '#388e3c' }, '&.Mui-focused fieldset': { borderColor: '#2e7d32' } }, '& .MuiInputBase-input': { color: '#ffffff' } }}
                    InputProps={{ startAdornment: field === 'fullname' ? <Person sx={{ mr: 1, color: 'green' }} /> : field === 'username' ? <Badge sx={{ mr: 1, color: 'green' }} /> : <Email sx={{ mr: 1, color: 'green' }} /> }}
                  />
                ))}
                <Box display="flex" justifyContent="flex-end" gap={2}>
                  <Button variant="outlined" onClick={() => { setEditMode(false); setEditData(profile); }}>Cancel</Button>
                  <Button variant="contained" startIcon={<Save />} onClick={handleSave} disabled={loading} sx={{ background: 'linear-gradient(45deg, #6a1b9a, #9c27b0)', '&:hover': { background: 'linear-gradient(45deg, #9c27b0, #6a1b9a)' } }}>
                    {loading ? <CircularProgress size={24} /> : 'Save'}
                  </Button>
                </Box>
              </>
            ) : (
              <>
                {[
                  { icon: <Person sx={{ color: '#ffffff' }} />, label: 'Full Name', value: profile.fullname },
                  { icon: <Badge sx={{ color: '#ffffff' }} />, label: 'Username', value: profile.username },
                  { icon: <Email sx={{ color: '#ffffff' }} />, label: 'Email', value: profile.email },
                  { icon: <Work sx={{ color: '#ffffff' }} />, label: 'Role', value: profile.role }
                ].map((item, i) => (
                  <Box key={item.label}>
                    <Box display="flex" alignItems="center" gap={2}>
                      <IconButton disabled sx={{ color: 'inherit' }}>{item.icon}</IconButton>
                      <Box>
                        <Typography variant="body2" color="textSecondary">{item.label}</Typography>
                        <Typography variant="body1" sx={{ fontWeight: 'medium', color: '#ffffff' }}>{item.value}</Typography>
                      </Box>
                    </Box>
                    {i < 3 && <Divider sx={{ my: 2, bgcolor: '#4caf50' }} />}
                  </Box>
                ))}
              </>
            )}
          </Box>
        </Box>
      </Paper>

      <Snackbar open={snackbar.open} autoHideDuration={6000} onClose={() => setSnackbar({...snackbar, open: false})} anchorOrigin={{ vertical: 'top', horizontal: 'center' }}>
        <Alert severity={snackbar.severity} onClose={() => setSnackbar({...snackbar, open: false})} sx={{ width: '100%' }}>{snackbar.message}</Alert>
      </Snackbar>
    </Box>
  );
};

export default UserProfile;