import React, { useState, useEffect } from 'react';
import { ThemeProvider, CssBaseline, Box, Typography, Button, TextField, AppBar, Toolbar, IconButton, Badge, Paper, Popper, List, ListItem, ListItemText, Divider, ClickAwayListener, CircularProgress } from '@mui/material';
import { BrowserRouter as Router, Route, Routes, Link, useNavigate, Navigate, useLocation } from 'react-router-dom';
import theme from './theme';
import axios from 'axios';
import CloseIcon from '@mui/icons-material/Close';
import { useHotkeys } from 'react-hotkeys-hook';
import { globalSearch } from './services/apiService';
import Login from './components/Login';
import User from './components/User';
import Application from './components/Application';
import JobListing from './components/JobListing';
import EmployerMessage from './components/EmployerMessage';
import JobseekerMessage from './components/JobseekerMessage';
import JobCategory from './components/JobCategory';
import MyApplication from './components/MyApplication';
import Dashboard from './components/Dashboard';
import Signup from './components/Signup';
import UserProfile from './components/UserProfile';
import ForgotPassword from './components/ForgotPassword';

const App = () => {
    const [role, setRole] = useState(null);
    const [notificationsCount] = useState(3);

    useEffect(() => {
        const userRole = localStorage.getItem('role');
        setRole(userRole);
    }, []);

    const handleLogin = (userData) => {
        localStorage.setItem('role', userData.role);
        setRole(userData.role);
    };

    return (
        <ThemeProvider theme={theme}>
            <CssBaseline />
            <Router>
                <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                    <TopBar role={role} notificationsCount={notificationsCount} />
                    <Box component="main" sx={{ flexGrow: 1, p: 3, marginTop: '64px' }}>
                        <Routes>
                            <Route path="/" element={role === 'EMPLOYER' ? <Dashboard /> : <Navigate to="/login" />} />
                            <Route path="/userprofile" element={role ? <UserProfile /> : <Navigate to="/login" />} />
                            <Route path="/jobcategory" element={role === 'EMPLOYER' ? <JobCategory /> : <Navigate to="/login" />} />
                            <Route path="/joblisting" element={role === 'EMPLOYER' ? <JobListing /> : <Navigate to="/login" />} />
                            <Route path="/joblisting/:jobId" element={role === 'EMPLOYER' ? <JobListing /> : <Navigate to="/login" />} />
                            <Route path="/application" element={role === 'EMPLOYER' ? <Application /> : <Navigate to="/login" />} />
                            <Route path="/application/:applicationId" element={role === 'EMPLOYER' ? <Application /> : <Navigate to="/login" />} />
                            <Route path="/user" element={role === 'EMPLOYER' ? <User /> : <Navigate to="/login" />} />
                            <Route path="/myapplication" element={role === 'JOBSEEKER' ? <MyApplication /> : <Navigate to="/login" />} />
                            <Route path="/employermessage" element={role === 'EMPLOYER' ? <EmployerMessage /> : <Navigate to="/login" />} />
                            <Route path="/jobseekermessage" element={role === 'JOBSEEKER' ? <JobseekerMessage /> : <Navigate to="/login" />} />
                            <Route path="/signup" element={<Signup />} />
                            <Route path="/login" element={<Login onLogin={handleLogin} />} />
                            <Route path="/forgot-password" element={<ForgotPassword />} />
                            <Route path="*" element={<Navigate to="/login" />} />
                        </Routes>
                    </Box>
                </Box>
            </Router>
        </ThemeProvider>
    );
};

const TopBar = ({ role, notificationsCount }) => {
    const location = useLocation();
    const navigate = useNavigate();
    const isLogin = ['/login', '/signup', '/forgot-password'].includes(location.pathname);
    const [searchQuery, setSearchQuery] = useState('');
    const [results, setResults] = useState({});
    const [loading, setLoading] = useState(false);
    const [timer, setTimer] = useState(null);
    const [anchorEl, setAnchorEl] = useState(null);
    const [openSearch, setOpenSearch] = useState(false);
    const searchRef = React.useRef(null);

    useHotkeys('esc', () => {
        setOpenSearch(false);
        setSearchQuery('');
        setResults({});
    });

    const handleLogout = async () => {
        try {
            await axios.post(`https://jobapp-backend-xyz.onrender.com/api/users/logout`, null, { withCredentials: true });
            //  await axios.post(`http://localhost:8081/api/users/logout`, null, { withCredentials: true });
            

            localStorage.clear();
            sessionStorage.clear();
            delete axios.defaults.headers.common['Authorization'];
            navigate('/login', { state: { message: 'Logged out successfully' } });
            window.location.reload();
        } catch (error) {
            console.error('Logout error:', error);
            localStorage.clear();
            sessionStorage.clear();
            delete axios.defaults.headers.common['Authorization'];
            navigate('/login', { state: { error: 'Logged out locally' } });
            window.location.reload();
        }
    };

    const handleSearchClick = (event) => {
        setAnchorEl(event.currentTarget);
        setOpenSearch(true);
    };

    const handleClickAway = () => {
        if (openSearch) {
            setOpenSearch(false);
            setSearchQuery('');
            setResults({});
        }
    };

    const handleSearchOnChange = async (e) => {
        setSearchQuery(e.target.value);
        if (timer) clearTimeout(timer);
        if (!e.target.value) {
            setResults({});
            return;
        }
        setLoading(true);
        setTimer(setTimeout(async () => {
            try {
                const response = await globalSearch(e.target.value);
                setResults(response);
                setLoading(false);
            } catch (error) {
                setLoading(false);
                console.error('Error fetching search results:', error);
            }
        }, 500));
    };

    const capitalizeFirstLetter = (string) => string.charAt(0).toUpperCase() + string.slice(1);

    const getStatusColor = (status) => {
        switch (status?.toUpperCase()) {
            case 'PENDING': return '#ff9800';
            case 'APPROVED': return '#4caf50';
            case 'REJECTED': return '#f44336';
            default: return '#9e9e9e';
        }
    };

    const renderItemContent = (entity, item) => {
        switch (entity.toLowerCase()) {
            case 'joblisting':
                return (
                    <Box sx={{ width: '100%' }}>
                        <Typography variant="subtitle1" sx={{ fontWeight: 'bold', color: '#6a1b9a' }}>
                            {item.title || 'No title available'}
                        </Typography>
                        <Box sx={{ display: 'flex', gap: 2, mt: 0.5 }}>
                            {item.salary && (
                                <Typography variant="body2" sx={{ color: '#2e7d32', fontWeight: 'bold' }}>
                                    {item.salary.toLocaleString()}Rwf /month
                                </Typography>
                            )}
                            <Typography variant="body2" sx={{ color: '#555' }}>
                                <span style={{ fontWeight: 'bold' }}>Category:</span> {item.jobCategory?.categoryName || 'Uncategorized'}
                            </Typography>
                        </Box>
                        <Box sx={{ display: 'flex', gap: 2, mt: 0.5 }}>
                            <Typography variant="body2" sx={{ color: '#555' }}>
                                <span style={{ fontWeight: 'bold' }}>Location:</span> {item.location || 'Remote'}
                            </Typography>
                        </Box>
                        <Typography variant="caption" sx={{ color: '#555', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden', textOverflow: 'ellipsis', mt: 0.5 }}>
                            <Typography variant="body2" sx={{ color: '#555' }}>
                                <span style={{ fontWeight: 'bold' }}>Description:</span> {item.description || 'No description'}
                            </Typography>
                        </Typography>
                    </Box>
                );
            case 'application':
                return (
                    <Box sx={{ width: '100%' }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <Typography variant="subtitle1" sx={{ fontWeight: 'bold', color: '#6a1b9a' }}>
                                #{item.applicationId} - {item.job?.title || 'No job title'}
                            </Typography>
                            <Box sx={{ backgroundColor: getStatusColor(item.status), color: 'white', px: 1, py: 0.5, borderRadius: '4px', fontSize: '0.75rem', fontWeight: 'bold' }}>
                                {item.status || 'UNKNOWN'}
                            </Box>
                        </Box>
                        <Typography variant="body2" sx={{ color: '#555', mt: 0.5 }}>
                            Applicant Name: {item.user?.username || 'Unknown user'}
                        </Typography>
                        <Typography variant="body2" sx={{ color: '#555', mt: 0.5 }}>
                            Email: {item.user?.email || 'Unknown email'}
                        </Typography>
                    </Box>
                );
            default:
                return <Typography variant="subtitle1">{JSON.stringify(item)}</Typography>;
        }
    };

    const handleItemClick = (entity, item) => {
        setOpenSearch(false);
        setSearchQuery('');
        setResults({});
        switch (entity.toLowerCase()) {
            case 'joblisting': navigate(`/joblisting/${item.jobId}`, { state: { fromSearch: true } }); break;
            case 'application': navigate(`/application/${item.applicationId}`, { state: { fromSearch: true } }); break;
            default: break;
        }
    };

    if (isLogin) return null;

    return (
        <AppBar position="fixed" sx={{ background: 'linear-gradient(135deg,rgb(62, 175, 90) 0%,rgb(56, 165, 123) 100%)', boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)', zIndex: (theme) => theme.zIndex.drawer + 1, backdropFilter: 'blur(10px)', borderBottom: '1px solid rgba(255,255,255,0.2)' }}>
            <Toolbar sx={{ justifyContent: 'space-between', minHeight: '70px !important' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
                    <Typography variant="h4" component="div" sx={{ fontFamily: "'Pacifico', cursive", fontWeight: 'normal', color: 'white', textShadow: '2px 2px 4px rgba(0,0,0,0.2)', fontSize: '1.4rem', mr: 3 }}>
                        🚀 JobPortal Mgt Sytem
                    </Typography>
                    <Box sx={{ display: 'flex', gap: 1, '& .MuiButton-root': { transition: 'all 0.3s ease' } }}>
                        {role === 'EMPLOYER' && (
                            <>
                                <NavButton to="/" emoji="🏠" label="Dashboard" />
                                <NavButton to="/userprofile" emoji="🪪" label="Profile" />
                                <NavButton to="/jobcategory" emoji="🗂️" label="Categories" />
                                <NavButton to="/joblisting" emoji="💼" label="Jobs" />
                                <NavButton to="/application" emoji="📝 " label="Applications" />
                                <NavButton to="/employermessage" emoji="📩" label="Messages" />
                                <NavButton to="/user" emoji="👩‍💼" label="Users" />
                            </>
                        )}
                        {role === 'JOBSEEKER' && (
                            <>
                                <NavButton to="/userprofile" emoji="🪪" label="Profile" />
                                <NavButton to="/myapplication" emoji="📝" label="My Applications" />
                                <NavButton to="/jobseekermessage" emoji="📩" label="Messages" />
                            </>
                        )}
                    </Box>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, position: 'relative' }}>
                    {role === 'EMPLOYER' && (
                        <ClickAwayListener onClickAway={handleClickAway}>
                            <Box>
                                <Box ref={searchRef} sx={{ display: 'flex', alignItems: 'center', background: 'rgba(255,255,255,0.25)', borderRadius: '25px', px: 2, py: 0.5, transition: 'all 0.3s ease', '&:hover': { background: 'rgba(255,255,255,0.35)' } }}>
                                    <TextField variant="standard" placeholder="Search applications, jobs..." size="small" value={searchQuery} onChange={handleSearchOnChange} onClick={handleSearchClick} sx={{ width: 250, '& .MuiInputBase-input': { color: 'white', fontSize: '0.9rem', '&::placeholder': { color: 'rgba(255,255,255,0.8)', opacity: 1 } }, '& .MuiInput-underline:before': { borderBottomColor: 'rgba(255,255,255,0.5)' }, '& .MuiInput-underline:hover:not(.Mui-disabled):before': { borderBottomColor: 'white' }, '& .MuiSvgIcon-root': { color: 'white' } }} />
                                </Box>
                                <Popper open={openSearch && (searchQuery.length > 0 || Object.keys(results).length > 0)} anchorEl={searchRef.current} placement="bottom-end" sx={{ zIndex: 1300, width: '550px', maxHeight: '70vh', overflowY: 'auto', mt: 1, '& .MuiPaper-root': { borderRadius: '12px', boxShadow: '0 8px 20px rgba(0,0,0,0.15)' } }}>
                                    <Paper elevation={6} sx={{ p: 0, background: 'linear-gradient(to bottom, #ffffff, #f9f9f9)' }}>
                                        <Box sx={{ p: 2, borderBottom: '1px solid #eee', background: '#6a1b9a', color: 'white', borderTopLeftRadius: '12px', borderTopRightRadius: '12px' }}>
                                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                                <Typography variant="h6" sx={{ fontWeight: 'bold' }}>🔍 Search Results</Typography>
                                                <IconButton size="small" onClick={handleClickAway} sx={{ color: 'white' }}><CloseIcon fontSize="small" /></IconButton>
                                            </Box>
                                            <Typography variant="caption" sx={{ display: 'block', mt: 0.5 }}>Showing results for: "{searchQuery}"</Typography>
                                        </Box>
                                        {loading && (
                                            <Box sx={{ p: 3, textAlign: 'center' }}>
                                                <CircularProgress size={24} sx={{ color: '#6a1b9a' }} />
                                                <Typography variant="body2" sx={{ mt: 1 }}>Searching database...</Typography>
                                            </Box>
                                        )}
                                        <Box sx={{ maxHeight: '60vh', overflowY: 'auto' }}>
                                            {Object.entries(results).map(([entity, items]) => (
                                                <Box key={entity} sx={{ mb: 2 }}>
                                                    <Box sx={{ p: 2, backgroundColor: '#f5f5f5', position: 'sticky', top: 0, zIndex: 1 }}>
                                                        <Typography variant="subtitle1" sx={{ fontWeight: 'bold', color: '#6a1b9a', display: 'flex', alignItems: 'center', gap: 1 }}>
                                                            {entity === 'joblisting' ? '💼' : '📝'}
                                                            {capitalizeFirstLetter(entity)} ({items.length})
                                                        </Typography>
                                                    </Box>
                                                    {items.length === 0 ? (
                                                        <Box sx={{ p: 2, textAlign: 'center' }}>
                                                            <Typography variant="body2" sx={{ color: '#777', fontStyle: 'italic' }}>No {entity.toLowerCase()} found matching your search</Typography>
                                                        </Box>
                                                    ) : (
                                                        <List dense sx={{ p: 0 }}>
                                                            {items.map((item, index) => (
                                                                <React.Fragment key={index}>
                                                                    <ListItem button onClick={() => handleItemClick(entity, item)} sx={{ p: 2, transition: 'all 0.2s', '&:hover': { backgroundColor: '#f0f0f0', transform: 'translateX(2px)' } }}>
                                                                        <ListItemText primary={renderItemContent(entity, item)} sx={{ m: 0 }} />
                                                                    </ListItem>
                                                                    {index < items.length - 1 && <Divider sx={{ mx: 2, borderColor: '#eee' }} />}
                                                                </React.Fragment>
                                                            ))}
                                                        </List>
                                                    )}
                                                </Box>
                                            ))}
                                        </Box>
                                    </Paper>
                                </Popper>
                            </Box>
                        </ClickAwayListener>
                    )}
                    <Button variant="contained" onClick={handleLogout} sx={{ ml: 1, background: 'rgba(255,255,255,0.25)', borderRadius: '25px', px: 3, py: 1, color: 'white', textTransform: 'none', fontSize: '0.9rem', fontWeight: 500, boxShadow: 'none', transition: 'all 0.3s ease', '&:hover': { background: 'rgba(255,255,255,0.35)', boxShadow: '0 2px 10px rgba(0,0,0,0.1)' } }}>
                        <span role="img" aria-label="logout" style={{ marginRight: '8px', fontSize: '1.1rem' }}>👋</span>Sign Out
                    </Button>
                </Box>
            </Toolbar>
        </AppBar>
    );
};

const NavButton = ({ to, emoji, label }) => (
    <Button color="inherit" component={Link} to={to} sx={{ borderRadius: '25px', px: 2.5, py: 1, color: 'white', textTransform: 'none', fontSize: '0.95rem', fontWeight: 500, '&:hover': { background: 'rgba(255,255,255,0.2)', transform: 'translateY(-2px)' } }}>
        <span role="img" aria-label={label.toLowerCase()} style={{ marginRight: '8px', fontSize: '1.1rem' }}>{emoji}</span>{label}
    </Button>
);

export default App;