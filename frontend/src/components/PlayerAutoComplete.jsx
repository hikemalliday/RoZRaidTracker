import { getPlayersOptions } from '../views/utils.jsx';
import { Autocomplete, TextField } from '@mui/material';

export function PlayerAutoComplete({ playersData, playerId, playerIdSetter }) {
    const optionsList = getPlayersOptions(playersData);

    const _getOptionsValue = (options, playerId) => {
        return options.find(option => option.id === playerId);
    };

    return (
        <Autocomplete
            disableClearable
            sx={{
                width: '200px',
                margin: '0 auto',
            }}
            options={optionsList}
            value={_getOptionsValue(optionsList, playerId)}
            onChange={(_, option) => {
                playerIdSetter(option.id);
            }}
            isOptionEqualToValue={(option, value) => option.id === value.id}
            renderInput={params => (
                <TextField
                    {...params}
                    variant="outlined"
                    size="small"
                    placeholder="Select player"
                    sx={{
                        '& .MuiOutlinedInput-root': {
                            color: 'white',
                            backgroundColor: 'rgba(255, 255, 255, 0.05)',
                            borderRadius: '6px',
                            '& fieldset': {
                                borderColor: 'rgba(255, 255, 255, 0.1)',
                            },
                            '&:hover fieldset': {
                                borderColor: 'rgba(255, 255, 255, 0.2)',
                            },
                            '&.Mui-focused fieldset': {
                                borderColor: 'white',
                            },
                        },
                        input: {
                            textAlign: 'center',
                        },
                    }}
                />
            )}
        />
    );
}
