import React, { useEffect, useState } from 'react';
import { 
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, 
  Paper, Button, TextField, Pagination, Box, FormControl, InputLabel, 
  Select, MenuItem, Snackbar, Alert, Container, Typography 
} from '@mui/material';
import { getEmployerConversations, getAllJobSeekers } from '../services/apiService';
import SendMessageToJobSeekers from './SendMessageToJobSeekers';
import * as XLSX from 'xlsx';

const EmployerMessage = () => {
  const [messages, setMessages] = useState([]);
  const [jobSeekers, setJobSeekers] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [isMessageModalOpen, setIsMessageModalOpen] = useState(false);
  const [filters, setFilters] = useState({ sender: '', receiver: '', messageText: '', date: '' });
  const [alert, setAlert] = useState({ open: false, message: '', severity: 'info' });

  useEffect(() => { fetchMessages(page, rowsPerPage); fetchJobSeekers(); }, [page, rowsPerPage, filters]);

  const fetchMessages = async (page, size) => {
    try {
      const result = await getEmployerConversations(page - 1, size);
      setMessages(result.content || []); setTotalPages(result.totalPages);
    } catch (error) {
      console.error("Error loading messages", error);
      setAlert({ open: true, message: 'Failed to load messages', severity: 'error' });
    }
  };

  const fetchJobSeekers = async () => {
    try { setJobSeekers(await getAllJobSeekers()); } catch (error) {
      console.error("Error loading job seekers", error);
      setAlert({ open: true, message: 'Failed to load job seekers', severity: 'error' });
    }
  };

  const handleCloseAlert = () => setAlert(prev => ({ ...prev, open: false }));
  const handlePageChange = (_, value) => setPage(value);
  const handleRowsPerPageChange = (e) => { setRowsPerPage(e.target.value); setPage(1); };
  const handleFilterChange = (e) => { const { name, value } = e.target; setFilters(prev => ({ ...prev, [name]: value })); };

  const filteredMessages = messages.filter(msg =>
    (msg.sender?.fullname || '').toLowerCase().includes(filters.sender.toLowerCase()) &&
    (msg.receiver?.fullname || '').toLowerCase().includes(filters.receiver.toLowerCase()) &&
    (msg.messageText || '').toLowerCase().includes(filters.messageText.toLowerCase()) &&
    (!filters.date || (msg.date ? msg.date.includes(filters.date) : false))
  );

  const formatDate = (dateString) => new Date(dateString).toLocaleDateString(undefined, { 
    year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' 
  });

  const exportToExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(filteredMessages.map(msg => ({
      'Sender': msg.sender?.fullname || 'Unknown', 'Receiver': msg.receiver?.fullname || 'Unknown',
      'Message': msg.messageText, 'Date': formatDate(msg.date)
    })));
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Messages');
    XLSX.writeFile(workbook, 'EmployerMessages.xlsx');
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 1 }}>
      <Typography variant="h4" align="center" sx={{
        fontFamily: 'Verdana, sans-serif', fontSize: '2.5rem', fontWeight: 'bold',
        color: '#2e7d32', textAlign: 'center', mb: '20px', textShadow: '1px 1px 2px rgba(0, 0, 0, 0.2)'
      }}>Jobseekers Messages</Typography>

      <Box sx={{ p: 3 }}>
        <Box display="flex" justifyContent="space-between" mb={3}>
          <Button variant="contained" onClick={() => setIsMessageModalOpen(true)} sx={{ 
            borderRadius: '8px', padding: '10px 20px', backgroundColor: 'green', 
            '&:hover': { backgroundColor: 'darkgreen' }, mr: 2 }}>Message Job Seekers</Button>
          <Button variant="contained" onClick={exportToExcel} sx={{
            borderRadius: '8px', padding: '10px 20px', backgroundColor: '#2e7d32',
            '&:hover': { backgroundColor: '#1b5e20' }, mr: 2 }}>Export to Excel</Button>
        </Box>

        <SendMessageToJobSeekers open={isMessageModalOpen} jobSeekers={jobSeekers}
          onClose={() => setIsMessageModalOpen(false)}
          onSend={() => { fetchMessages(page, rowsPerPage); setIsMessageModalOpen(false); }} />

        <TableContainer component={Paper} sx={{ boxShadow: 3, borderRadius: '12px', width: '100%', overflow: 'hidden' }}>
          <Table sx={{ backgroundColor: 'rgba(230, 239, 240, 0.67)' }}>
            <TableHead sx={{ backgroundColor: 'rgba(230, 239, 240, 0.67)' }}>
              <TableRow>
                {Object.keys(filters).map(key => (
                  <TableCell key={key} sx={{ fontWeight: 'bold', color: '#333' }}>
                    <TextField label={`Search ${key.charAt(0).toUpperCase() + key.slice(1)}`} name={key}
                      variant="outlined" value={filters[key]} onChange={handleFilterChange} fullWidth margin="dense"
                      sx={{ borderRadius: '8px', input: { color: '#ffffff' } }} />
                  </TableCell>
                ))}
              </TableRow>
              <TableRow sx={{ backgroundColor: '#4caf50' }}> 
                <TableCell sx={{ fontWeight: 'bold', color: '#ffffff' }}>Sender</TableCell>
                <TableCell sx={{ fontWeight: 'bold', color: '#ffffff' }}>Receiver</TableCell>
                <TableCell sx={{ fontWeight: 'bold', color: '#ffffff' }}>Message</TableCell>
                <TableCell sx={{ fontWeight: 'bold', color: '#ffffff' }}>Date</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredMessages.map((message, index) => (
                <TableRow key={index} hover sx={{ backgroundColor: index % 2 === 0 ? '#252525' : '#2f2f2f' }}>
                  <TableCell>{message.sender?.fullname || 'Unknown Sender'}</TableCell>
                  <TableCell>{message.receiver?.fullname || 'Unknown Receiver'}</TableCell>
                  <TableCell>{message.messageText}</TableCell>
                  <TableCell>{formatDate(message.date)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        <Box display="flex" justifyContent="space-between" alignItems="center" mt={2}>
          <FormControl variant="outlined" sx={{ minWidth: 120 }}>
            <InputLabel>Rows per page</InputLabel>
            <Select value={rowsPerPage} onChange={handleRowsPerPageChange} label="Rows per page">
              {[5, 10, 20].map(size => <MenuItem key={size} value={size}>{size}</MenuItem>)}
            </Select>
          </FormControl>
          <Pagination count={totalPages} page={page} onChange={handlePageChange} sx={{
            color: '#ffffff', backgroundColor: '#2a2a2a', borderRadius: '8px', padding: '10px',
            '& .MuiPaginationItem-root': { color: '#ffffff', '&.Mui-selected': { backgroundColor: '#4caf50', color: '#ffffff' },
            '&:hover': { backgroundColor: '#388e3c' } } }} />
        </Box>

        <Snackbar open={alert.open} autoHideDuration={6000} onClose={handleCloseAlert} anchorOrigin={{ vertical: 'top', horizontal: 'center' }}>
          <Alert onClose={handleCloseAlert} severity={alert.severity} sx={{ width: '100%' }}>{alert.message}</Alert>
        </Snackbar>
      </Box>
    </Container>
  );
};

export default EmployerMessage;