import { useNavigate } from 'react-router';
import { Box, Typography } from '@mui/material';
import { useAuthContext } from '../context/AuthContext.jsx';

export default function Home() {
    const navigate = useNavigate();
    const { isSuperUser, isAuthenticated } = useAuthContext();

    const cardMeta = [
        { label: 'Compare', path: '/compare/', description: 'Compare players side by side' },
        { label: 'Players', path: '/player/', description: 'View all players' },
        { label: 'Raids', path: '/raid/', description: 'Browse raid history' },
        { label: 'Items Awarded', path: '/item_awarded/', description: 'Browse loot drops' },
        { label: 'Approval', path: '/ra_approval_pending/', description: 'Approve raids' },
        { label: 'Roaster', path: '/roster/', description: 'Class roster' },
    ];

    function Card({ path, label, description }) {
        return (
            <Box
                key={path}
                onClick={() => navigate(path)}
                sx={{
                    width: 200,
                    padding: 3,
                    backgroundColor: 'rgba(255, 255, 255, 0.03)',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    borderRadius: 2,
                    cursor: 'pointer',
                    transition: 'all 0.15s ease',
                    '&:hover': {
                        backgroundColor: 'rgba(255, 255, 255, 0.06)',
                        borderColor: 'rgba(255, 255, 255, 0.2)',
                    },
                }}
            >
                <Typography sx={{ fontWeight: 600, mb: 1 }}>{label}</Typography>
                <Typography sx={{ fontSize: '0.8rem', color: 'gray' }}>{description}</Typography>
            </Box>
        );
    }

    const getCardComponent = card => {
        const cardComponent = (
            <Card path={card.path} label={card.label} description={card.description} />
        );
        if (!isAuthenticated) return <></>;
        if (card.label === 'Approval' && isSuperUser && isAuthenticated) return cardComponent;
        else if (card.label !== 'Approval' && isAuthenticated) return cardComponent;
        else return <></>;
    };

    const cardsToRender = cardMeta.map(getCardComponent);

    return (
        <Box sx={{ padding: 4 }}>
            <Typography variant="h4" sx={{ mb: 4, fontWeight: 600 }}>
                Dashboard
            </Typography>
            <Box
                sx={{
                    display: 'flex',
                    flexWrap: 'wrap',
                    gap: 3,
                    justifyContent: 'center',
                }}
            >
                {!isSuperUser && !isAuthenticated ? <>Please log in.</> : cardsToRender}
            </Box>
        </Box>
    );
}
