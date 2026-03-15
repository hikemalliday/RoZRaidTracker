import { MageloPlayer } from '../components/MageloPlayer.jsx';
import { Box } from '@mui/material';

export function MageloCompareView() {
    return (
        <Box
            sx={{
                display: 'flex',
                justifyContent: 'center',
                flexWrap: 'wrap',
                gap: 3,
                marginTop: 3,
            }}
        >
            <MageloPlayer defaultPlayerId={1} />
            <MageloPlayer defaultPlayerId={2} />
            <MageloPlayer defaultPlayerId={3} />
        </Box>
    );
}
