import { createTheme } from '@mui/material/styles';

const theme = createTheme({
    palette: {
        primary: {
            main: '#232323', // Deep dark gray for structure
        },
        secondary: {
            main: '#4caf50', // Green accent for highlights
        },
        background: {
            default: '#121212', // Deep black base
            paper: '#1c1c1c', // Slightly lighter shade for clarity
        },
        text: {
            primary: '#000000', // Bright white for readability
            secondary: '#9e9e9e', // Soft gray for subtle accents
            purple: '#9c27b0', 
        },
        purple: {
            main: '#9c27b0',
          },
    },
    typography: {
        h1: {
            fontFamily: 'Poppins, sans-serif',
            fontWeight: 700,
            fontSize: '3rem',
            color: '#ffffff',
        },
        h2: {
            fontFamily: 'Poppins, sans-serif',
            fontWeight: 500,
            fontSize: '2rem',
            color: '#9e9e9e',
        },
        body1: {
            fontFamily: 'Poppins, sans-serif',
            fontSize: '1rem',
            color: '#f5f5f5',
        },
    },
    components: {
        MuiTable: {
            styleOverrides: {
                root: {
                    borderRadius: '10px',
                    backgroundColor: '#1c1c1c',
                    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.5)',
                },
            },
        },
        MuiTableCell: {
            styleOverrides: {
                root: {
                    padding: '14px',
                    fontSize: '1rem',
                    color: '#ffffff',
                    borderBottom: '1px solid #333',
                    backgroundColor: '#2a2a2a', // Slightly lighter for visibility
                },
                head: {
                    fontWeight: 'bold',
                    backgroundColor: '#333',
                    color: '#4caf50', // Green header accent
                    textTransform: 'uppercase',
                },
            },
        },
        MuiTableRow: {
            styleOverrides: {
                root: {
                    '&:nth-of-type(odd)': {
                        backgroundColor: '#252525', // Alternating for better contrast
                    },
                    '&:hover': {
                        backgroundColor: '#373737', // Pop effect when hovered
                    },
                    transition: 'background-color 0.3s ease',
                },
            },
        },
        MuiIconButton: {
            styleOverrides: {
                root: {
                    color: '#ffffff', // White icons for clear visibility
                    '&:hover': {
                        color: '#4caf50', // Green on hover for contrast
                    },
                },
            },
        },
        MuiSelect: {
            styleOverrides: {
                root: {
                    padding: '12px',
                    background: '#333', // Dark but distinct filter dropdown
                    borderRadius: '8px',
                    fontSize: '1rem',
                    color: '#ffffff', // Clear white text
                    border: '2px solid #4caf50', // Green border to make filters stand out
                },
                icon: {
                    color: '#ffffff', // White dropdown icon for better visibility
                },
            },
        },
        MuiButton: {
            styleOverrides: {
                root: {
                    backgroundColor: '#4caf50',
                    color: 'white',
                    fontSize: '1rem',
                    padding: '12px',
                    borderRadius: '8px',
                    margin: '10px 0',
                    textTransform: 'none',
                    fontWeight: '600',
                    boxShadow: '0 2px 5px rgba(0, 0, 0, 0.3)',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                        backgroundColor: '#388e3c',
                    },
                },
            },
        },
    },
});

export default theme;