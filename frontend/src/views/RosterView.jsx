import { Box, Container, Typography } from '@mui/material';
import { useCharacterList } from '../hooks/requests.js';
import { labelStyles } from '../styles.js';

export function RosterView() {
    const { data: characterList, isPending } = useCharacterList({ player__active: true });
    const charClasses = [
        'BRD',
        'BST',
        'CLR',
        'DRU',
        'ENC',
        'MAG',
        'MNK',
        'NEC',
        'PAL',
        'RNG',
        'ROG',
        'SHD',
        'SHM',
        'WAR',
        'WIZ',
    ];

    if (isPending) return <>LOADING...</>;

    const getCharsByClass = results => {
        const _filterChars = charClass => results.filter(char => char.char_class === charClass);
        return Object.fromEntries(charClasses.map(c => [c, _filterChars(c)]));
    };

    const reducedChars = getCharsByClass(characterList.results);

    function ClassCard({ charClass, data }) {
        return (
            <Box
                sx={{
                    flex: '1 1 200px',
                    maxWidth: 280,
                    backgroundColor: 'rgba(255, 255, 255, 0.03)',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    borderRadius: 2,
                    padding: 2,
                }}
            >
                <Typography
                    sx={{
                        ...labelStyles,
                        mt: 0,
                        mb: 1.5,
                        pb: 1,
                        borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
                        display: 'flex',
                        justifyContent: 'space-between',
                    }}
                >
                    {charClass}
                    <span style={{ color: 'gray', fontWeight: 400 }}>{data.length}</span>
                </Typography>
                {data.map((char, i) => (
                    <Box
                        key={i}
                        sx={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'baseline',
                            py: 0.4,
                            borderBottom: '1px solid rgba(255,255,255,0.04)',
                            '&:last-child': { borderBottom: 'none' },
                        }}
                    >
                        <Typography sx={{ color: 'white', fontSize: '0.875rem' }}>
                            {char.name}
                        </Typography>
                        <Typography sx={{ color: 'gray', fontSize: '0.75rem', ml: 1 }}>
                            {char.player.name}
                        </Typography>
                    </Box>
                ))}
            </Box>
        );
    }

    return (
        <Container sx={{ mt: 2 }}>
            <Typography variant="h5" sx={{ mb: 3, fontWeight: 600 }}>
                Roster
            </Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
                {Object.entries(reducedChars)
                    .filter(([, charList]) => charList.length > 0)
                    .map(([charClass, charList]) => (
                        <ClassCard key={charClass} charClass={charClass} data={charList} />
                    ))}
            </Box>
        </Container>
    );
}
