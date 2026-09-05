import { Box, Container, Skeleton, TextField, Typography } from '@mui/material';
import { usePlayersList } from '../hooks/requests.js';
import { labelStyles } from '../styles.js';
import { useState } from 'react';

export function RosterView() {
    const [numOfDays, setNumOfDays] = useState(21);
    const [raPercentage, setRaPercentage] = useState(50);
    const { data: playersList, isPending } = usePlayersList({
        num_of_days: numOfDays,
        ra_percentage: raPercentage,
    });
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

    const getCharsByClass = results => {
        const _filterChars = charClass => results.filter(char => char.char_class === charClass);
        return Object.fromEntries(charClasses.map(c => [c, _filterChars(c)]));
    };
    const allChars = isPending ? [] : playersList.flatMap(player => player.characters);
    const reducedChars = getCharsByClass(allChars);

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

    const fieldSx = {
        width: 140,
        '& .MuiInputBase-input': { color: 'white', fontSize: '0.875rem' },
        '& .MuiInputLabel-root': { color: 'rgba(255,255,255,0.5)', fontSize: '0.875rem' },
        '& .MuiInputLabel-root.Mui-focused': { color: 'rgba(255,255,255,0.8)' },
        '& .MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(255,255,255,0.15)' },
        '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(255,255,255,0.35)' },
        '& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline': {
            borderColor: 'rgba(255,255,255,0.6)',
        },
    };

    return (
        <Container sx={{ mt: 2 }}>
            <Typography variant="h5" sx={{ mb: 2, fontWeight: 600 }}>
                Roster
            </Typography>
            <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
                <TextField
                    label="Days"
                    type="number"
                    size="small"
                    value={numOfDays}
                    onChange={e => setNumOfDays(Number(e.target.value))}
                    sx={fieldSx}
                />
                <TextField
                    label="Min RA %"
                    type="number"
                    size="small"
                    value={raPercentage}
                    onChange={e => setRaPercentage(Number(e.target.value))}
                    sx={fieldSx}
                />
            </Box>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
                {isPending
                    ? Array.from({ length: 8 }).map((_, i) => (
                          <Skeleton
                              key={i}
                              variant="rounded"
                              width={220}
                              height={160}
                              sx={{ bgcolor: 'rgba(255,255,255,0.06)', flex: '1 1 200px', maxWidth: 280 }}
                          />
                      ))
                    : Object.entries(reducedChars)
                          .filter(([, charList]) => charList.length > 0)
                          .map(([charClass, charList]) => (
                              <ClassCard key={charClass} charClass={charClass} data={charList} />
                          ))}
            </Box>
        </Container>
    );
}
