import React, { useEffect, useState } from 'react';
import { getJobSeekerConversations } from '../services/apiService';
import {
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  Paper, Button, TextField, Pagination, Box, FormControl, InputLabel,
  Select, MenuItem, Container, Typography
} from '@mui/material';
import BroadcastToEmployers from './BroadcastToEmployers';

const JobseekerMessage = () => {
    const [state, setState] = useState({
        messages: [],
        page: 1,
        totalPages: 1,
        rowsPerPage: 5,
        filters: { sender: '', receiver: '', messageText: '', date: '' },
        isBroadcastModalOpen: false
    });

    useEffect(() => {
        fetchData();
    }, [state.page, state.rowsPerPage, state.filters]);

    const fetchData = async () => {
        try {
            const res = await getJobSeekerConversations(state.page - 1, state.rowsPerPage);
            setState(prev => ({ ...prev, messages: res.content || [], totalPages: res.totalPages }));
        } catch (error) {
            console.error("Error loading messages", error);
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

    const filteredMessages = state.messages.filter(msg =>
        Object.entries(state.filters).every(([key, val]) =>
            !val || (msg[key]?.toString().toLowerCase().includes(val.toLowerCase()) ||
            (key === 'date' && msg[key]?.includes(val)))
        )
    );

    return (
        <Container maxWidth="lg" sx={{ mt: 4 }}>
            <Typography variant="h4" align="center" sx={{
                fontFamily: 'Verdana, sans-serif',
                fontSize: '2.5rem',
                fontWeight: 'bold',
                color: '#2e7d32',
                textAlign: 'center',
                mb: '20px',
                textShadow: '1px 1px 2px rgba(0, 0, 0, 0.2)'
            }}>
                My Messages
            </Typography>

            <Box sx={{ p: 3 }}>
                <Box display="flex" justifyContent="space-between" mb={3}>
                    <Button
                        variant="contained"
                        onClick={() => setState(prev => ({ ...prev, isBroadcastModalOpen: true }))}
                        sx={{ borderRadius: '8px', padding: '10px 20px', backgroundColor: 'green', '&:hover': { backgroundColor: 'darkgreen' } }}
                    >
                        Broadcast to Employers
                    </Button>
                </Box>

                <BroadcastToEmployers
                    open={state.isBroadcastModalOpen}
                    onClose={() => setState(prev => ({ ...prev, isBroadcastModalOpen: false }))}
                    onSend={() => {
                        fetchData();
                        setState(prev => ({ ...prev, isBroadcastModalOpen: false }));
                    }}
                />

                <TableContainer component={Paper} sx={{ boxShadow: 3, borderRadius: '12px', width: '100%', overflow: 'hidden' }}>
                    <Table sx={{ backgroundColor: 'rgba(230, 239, 240, 0.67)' }}>
                        <TableHead>
                            <TableRow>
                                {Object.keys(state.filters).map(key => (
                                    <TableCell key={key} sx={{ fontWeight: 'bold' }}>
                                        <TextField
                                            label={`Search ${key.charAt(0).toUpperCase() + key.slice(1)}`}
                                            name={key}
                                            variant="outlined"
                                            value={state.filters[key]}
                                            onChange={handleFilterChange}
                                            fullWidth
                                            margin="dense"
                                            sx={{ borderRadius: '8px', input: { color: '#fff' } }}
                                        />
                                    </TableCell>
                                ))}
                            </TableRow>
                            <TableRow sx={{ backgroundColor: '#4caf50' }}>
                                {['Sender', 'Receiver', 'Message', 'Date'].map(h => (
                                    <TableCell key={h} sx={{ fontWeight: 'bold', color: '#fff' }}>{h}</TableCell>
                                ))}
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {filteredMessages.map((msg, i) => (
                                <TableRow key={i} hover sx={{ backgroundColor: i % 2 === 0 ? '#252525' : '#2f2f2f' }}>
                                    <TableCell>{msg.sender?.fullname || 'Unknown Sender'}</TableCell>
                                    <TableCell>{msg.receiver?.fullname || 'Unknown Receiver'}</TableCell>
                                    <TableCell>{msg.messageText}</TableCell>
                                    <TableCell>
                                        {new Date(msg.date).toLocaleDateString(undefined, {
                                            year: 'numeric',
                                            month: 'short',
                                            day: 'numeric',
                                            hour: '2-digit',
                                            minute: '2-digit'
                                        })}
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
                            color: '#fff',
                            backgroundColor: '#2a2a2a',
                            borderRadius: '8px',
                            padding: '10px',
                            '& .MuiPaginationItem-root': {
                                color: '#fff',
                                '&.Mui-selected': { backgroundColor: '#4caf50' },
                                '&:hover': { backgroundColor: '#388e3c' }
                            }
                        }}
                    />
                </Box>
            </Box>
        </Container>
    );
};

export default JobseekerMessage;