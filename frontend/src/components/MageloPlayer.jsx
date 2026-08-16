import { Box } from '@mui/material';
import { MageloGrid } from './MageloGrid.jsx';
import { useItemsAwardedList, usePlayerDetail, usePlayersList } from '../hooks/requests.js';
import React, { useState } from 'react';
import { PlayerAutoComplete } from './PlayerAutoComplete.jsx';
// TODO: Page still relies on the deprecated bool fields for 'Character' model. Modern approach is 'type' field.
export function MageloPlayer({ defaultPlayerId = 1 }) {
    const { isPending: isPlayersPending, data: playersData } = usePlayersList();
    const [playerId, setPlayerId] = useState(defaultPlayerId);
    const { data: playerDetailData, isPending: isPlayerDetailPending } = usePlayerDetail(playerId);
    const { isPending: isItemsPending, data: itemAwardedData } = useItemsAwardedList({
        player: playerId,
    });

    if (isPlayersPending || isItemsPending || isPlayerDetailPending)
        return (
            <Box sx={{ color: '#888888', fontSize: '0.75rem', letterSpacing: '0.1em', padding: 2 }}>
                LOADING...
            </Box>
        );

    const _getMainMageloItems = results => {
        if (!results) return [];
        return results.filter(item => item.type === 'main_magelo');
    };

    const _getAltMageloItems = results => {
        if (!results) return [];
        return results.filter(item => item.type === 'alt_magelo');
    };

    const _getMainChar = results => {
        if (!results) return {};
        return results.find(char => char.is_main === true);
    };

    const _getAltChar = results => {
        if (!results) return {};
        return results.find(char => char.is_main_alt === true);
    };

    const mainItems = _getMainMageloItems(itemAwardedData?.results ?? []);
    const altItems = _getAltMageloItems(itemAwardedData?.results ?? []);

    const getPlayerMeta = char => {
        return (
            <Box
                sx={{
                    fontSize: '0.75rem',
                    fontWeight: 600,
                    letterSpacing: '0.1em',
                    textTransform: 'uppercase',
                    color: '#9ca3af',
                    paddingLeft: '17px',
                    marginTop: '5px',
                }}
            >
                {char?.name ?? 'Unnamed'}
            </Box>
        );
    };

    return (
        <Box
            sx={{
                display: 'flex',
                flexDirection: 'column',
                gap: 1.5,
                backgroundColor: '#1a1a1a',
                border: '1px solid rgba(255,255,255,0.08)',
                borderRadius: '8px',
                padding: 2,
            }}
        >
            <PlayerAutoComplete
                playersData={playersData}
                playerId={playerId}
                playerIdSetter={setPlayerId}
            />
            {mainItems.length > 0 && getPlayerMeta(_getMainChar(playerDetailData.characters))}
            {mainItems.length > 0 && <MageloGrid data={mainItems} />}
            {altItems.length > 0 && getPlayerMeta(_getAltChar(playerDetailData.characters))}
            {altItems.length > 0 && <MageloGrid data={altItems} />}
        </Box>
    );
}
