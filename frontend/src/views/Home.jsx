import { useNavigate } from 'react-router';
import { Box, Typography } from '@mui/material';

export default function Home() {
    const navigate = useNavigate();

    const cards = [
        { label: 'Compare', path: '/compare/', description: 'Compare players side by side' },
        { label: 'Players', path: '/player/', description: 'View all players' },
        { label: 'Raids', path: '/raid/', description: 'Browse raid history' },
        { label: 'Items Awarded', path: '/item_awarded/', description: 'Browse loot drops' },
    ];

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
                {cards.map(card => (
                    <Box
                        key={card.path}
                        onClick={() => navigate(card.path)}
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
                        <Typography sx={{ fontWeight: 600, mb: 1 }}>{card.label}</Typography>
                        <Typography sx={{ fontSize: '0.8rem', color: 'gray' }}>
                            {card.description}
                        </Typography>
                    </Box>
                ))}
            </Box>
        </Box>
    );
}
