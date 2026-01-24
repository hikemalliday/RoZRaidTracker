import { useNavigate } from 'react-router';
import { useAuthContext } from '../context/AuthContext.jsx';
import { useEffect, useRef, useState } from 'react';
import { Box, Drawer, IconButton, List, ListItem, ListItemText } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';

export function NavBar() {
    const navigate = useNavigate();
    const { isAuthenticated, isSuperUser, logout } = useAuthContext();
    const [approvalOpen, setApprovalOpen] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const dropdownRef = useRef(null);

    useEffect(() => {
        function handleClickOutside(e) {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
                setApprovalOpen(false);
            }
        }
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleLinkClick = route => {
        setApprovalOpen(false);
        setMobileMenuOpen(false);
        navigate(route);
    };

    const handleLogout = () => {
        setMobileMenuOpen(false);
        logout();
    };

    const navLinks = [
        { label: 'COMPARE', path: '/compare' },
        { label: 'PLAYERS', path: '/player' },
        { label: 'RAIDS', path: '/raid' },
        { label: 'ITEMS AWARDED', path: '/item_awarded' },
        { label: 'SCREENSHOTS', path: '/screenshots' },
    ];

    const navBarLinks = () => {
        return (
            <div
                ref={dropdownRef}
                style={{
                    display: 'inline-block',
                    position: 'relative',
                }}
            >
                <a id="nav-bar-link" onClick={() => handleLinkClick('/compare')}>
                    COMPARE
                </a>
                -
                {isAuthenticated && isSuperUser && (
                    <>
                        <a id="nav-bar-link" onClick={() => handleLinkClick('ra_approval_pending')}>
                            APPROVAL
                        </a>
                        -
                    </>
                )}
                <a id="nav-bar-link" onClick={() => handleLinkClick('/player')}>
                    PLAYERS
                </a>
                -
                <a id="nav-bar-link" onClick={() => handleLinkClick('/raid')}>
                    RAIDS
                </a>
                -
                <a id="nav-bar-link" onClick={() => handleLinkClick('item_awarded')}>
                    ITEMS AWARDED
                </a>
                -
                <a id="nav-bar-link" onClick={() => handleLinkClick('screenshots')}>
                    SCREENSHOTS
                </a>
                -
                {isAuthenticated ? (
                    <a id="nav-bar-link" onClick={() => logout()}>
                        LOG OUT
                    </a>
                ) : (
                    <a id="nav-bar-link" onClick={() => handleLinkClick('/login')}>
                        LOG IN
                    </a>
                )}
            </div>
        );
    };

    const mobileDrawer = () => (
        <Drawer
            anchor="right"
            open={mobileMenuOpen}
            onClose={() => setMobileMenuOpen(false)}
            PaperProps={{
                sx: {
                    backgroundColor: '#111',
                    color: 'white',
                    width: 200,
                },
            }}
        >
            <List>
                {navLinks.map(link => (
                    <ListItem
                        key={link.path}
                        onClick={() => handleLinkClick(link.path)}
                        sx={{
                            cursor: 'pointer',
                            '&:hover': { backgroundColor: 'rgba(255,255,255,0.05)' },
                        }}
                    >
                        <ListItemText primary={link.label} />
                    </ListItem>
                ))}
                {isAuthenticated && isSuperUser && (
                    <>
                        <ListItem
                            onClick={() => handleLinkClick('/ra_approval_pending')}
                            sx={{
                                cursor: 'pointer',
                                '&:hover': { backgroundColor: 'rgba(255,255,255,0.05)' },
                            }}
                        >
                            <ListItemText primary="APPROVAL - PENDING" />
                        </ListItem>
                        <ListItem
                            onClick={() => handleLinkClick('/ra_approval_history')}
                            sx={{
                                cursor: 'pointer',
                                '&:hover': { backgroundColor: 'rgba(255,255,255,0.05)' },
                            }}
                        >
                            <ListItemText primary="APPROVAL - HISTORY" />
                        </ListItem>
                    </>
                )}
                <ListItem
                    onClick={isAuthenticated ? handleLogout : () => handleLinkClick('/login')}
                    sx={{
                        cursor: 'pointer',
                        '&:hover': { backgroundColor: 'rgba(255,255,255,0.05)' },
                    }}
                >
                    <ListItemText primary={isAuthenticated ? 'LOG OUT' : 'LOG IN'} />
                </ListItem>
            </List>
        </Drawer>
    );

    return (
        <div id="nav-bar-main">
            <div id="nav-bar-logo" onClick={() => navigate('/')}>
                ZEK
            </div>
            <Box sx={{ display: { xs: 'none', md: 'flex' } }} id="nav-bar-links">
                {navBarLinks()}
            </Box>
            <Box sx={{ display: { xs: 'flex', md: 'none' }, paddingRight: 1 }}>
                <IconButton onClick={() => setMobileMenuOpen(true)} sx={{ color: 'white' }}>
                    <MenuIcon />
                </IconButton>
            </Box>
            {mobileDrawer()}
        </div>
    );
}
