import { useNavigate, useLocation } from 'react-router';
import { useAuthContext } from '../context/AuthContext.jsx';
import { useRef, useState } from 'react';
import { Box, Drawer, IconButton, List, ListItem, ListItemText } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';

export function NavBar() {
    const navigate = useNavigate();
    const location = useLocation();
    const { isAuthenticated, isSuperUser, logout } = useAuthContext();
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const dropdownRef = useRef(null);

    const handleLinkClick = route => {
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
        { label: 'ROSTER', path: '/roster' },
    ];

    const navBarLinks = () => {
        const currentPath = location.pathname;
        const isActive = path => {
            if (path === 'item_awarded') return currentPath === '/item_awarded';
            if (path === 'screenshots') return currentPath === '/screenshots';
            if (path === 'ra_approval_pending') return currentPath === '/ra_approval_pending';
            return currentPath === path;
        };

        return (
            <>
                <a
                    id="nav-bar-link"
                    onClick={() => handleLinkClick('/compare')}
                    className={isActive('/compare') ? 'active' : ''}
                >
                    COMPARE
                </a>
                {isAuthenticated && isSuperUser && (
                    <a
                        id="nav-bar-link"
                        onClick={() => handleLinkClick('ra_approval_pending')}
                        className={isActive('ra_approval_pending') ? 'active' : ''}
                    >
                        APPROVAL
                    </a>
                )}
                <a
                    id="nav-bar-link"
                    onClick={() => handleLinkClick('/player')}
                    className={isActive('/player') ? 'active' : ''}
                >
                    PLAYERS
                </a>
                <a
                    id="nav-bar-link"
                    onClick={() => handleLinkClick('/raid')}
                    className={isActive('/raid') ? 'active' : ''}
                >
                    RAIDS
                </a>
                <a
                    id="nav-bar-link"
                    onClick={() => handleLinkClick('item_awarded')}
                    className={isActive('item_awarded') ? 'active' : ''}
                >
                    ITEMS AWARDED
                </a>
                <a
                    id="nav-bar-link"
                    onClick={() => handleLinkClick('screenshots')}
                    className={isActive('screenshots') ? 'active' : ''}
                >
                    SCREENSHOTS
                </a>
                <a
                    id="nav-bar-link"
                    onClick={() => handleLinkClick('roster')}
                    className={isActive('roster') ? 'active' : ''}
                >
                    ROSTER
                </a>
                {isAuthenticated ? (
                    <a id="nav-bar-link" onClick={() => logout()}>
                        LOG OUT
                    </a>
                ) : (
                    <a id="nav-bar-link" onClick={() => handleLinkClick('/login')}>
                        LOG IN
                    </a>
                )}
            </>
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
        <Box sx={{ maxWidth: '1400px', margin: '0 auto', padding: '0 20px' }} data-navbar-box>
            <div id="nav-bar-main">
                <div id="nav-bar-logo" onClick={() => navigate('/')}>
                    <span style={{ fontSize: '24px' }}>ZEK</span>
                    <span style={{ fontSize: '12px', marginLeft: '8px' }}>Raid Tools</span>
                </div>
                <Box
                    sx={{ display: { xs: 'none', md: 'flex' } }}
                    id="nav-bar-links"
                    ref={dropdownRef}
                >
                    {navBarLinks()}
                </Box>
                <Box sx={{ display: { xs: 'flex', md: 'none' }, paddingRight: 1 }}>
                    <IconButton onClick={() => setMobileMenuOpen(true)} sx={{ color: 'white' }}>
                        <MenuIcon />
                    </IconButton>
                </Box>
                {mobileDrawer()}
            </div>
        </Box>
    );
}
