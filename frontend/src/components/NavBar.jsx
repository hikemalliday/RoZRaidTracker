import { useNavigate } from 'react-router';
import { useAuthContext } from '../context/AuthContext.jsx';
import { useEffect, useRef, useState } from 'react';

export function NavBar() {
    const navigate = useNavigate();
    const { isAuthenticated, isSuperUser, logout } = useAuthContext();
    const [approvalOpen, setApprovalOpen] = useState(false);
    const dropdownRef = useRef(null);

    // TODO: Ref to close the dropdown if we click anywhere that does NOT contain the ref
    // TODO: We have placed the ref in the dropdown menu, therefore clicking outside of it will set to false
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
        navigate(route);
    };

    const navBarLinks = () => {
        return (
            <div
                ref={
                    dropdownRef
                } /* Why is the dropdownRef in the parent here? How can we handle different refs for different dropdowns?*/
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
                        <a id="nav-bar-link" onClick={() => setApprovalOpen(prev => !prev)}>
                            APPROVAL
                        </a>
                        {approvalOpen && (
                            <div
                                style={{
                                    position: 'absolute',
                                    left: '75px',
                                    background: '#222',
                                    padding: '8px',
                                    borderRadius: '4px',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    minWidth: '120px',
                                    zIndex: 10,
                                }}
                            >
                                <a onClick={() => handleLinkClick('ra_approval_pending')}>
                                    Pending
                                </a>
                                <a onClick={() => handleLinkClick('ra_approval_history')}>
                                    History
                                </a>
                            </div>
                        )}
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

    return (
        <div id="nav-bar-main">
            <div id="nav-bar-logo" onClick={() => navigate('/')}>
                ZEK
            </div>
            <div id="nav-bar-links">{navBarLinks()}</div>
        </div>
    );
}
