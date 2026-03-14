import { Box } from '@mui/material';
import { MageloGrid } from './MageloGrid.jsx';
import { useItemsAwardedList, usePlayerDetail, usePlayersList } from '../hooks/requests.js';
import React, { useState } from 'react';
import { PlayerAutoComplete } from './PlayerAutoComplete.jsx';

export function MageloPlayer({ defaultPlayerId = 1 }) {
    const { isPending: isPlayersPending, data: playersData } = usePlayersList();
    const [playerId, setPlayerId] = useState(defaultPlayerId);
    const { data: playerDetailData, isPending: isPlayerDetailPending } = usePlayerDetail(playerId);
    const { isPending: isItemsPending, data: itemAwardedData } = useItemsAwardedList({
        player: playerId,
    });

    if (isPlayersPending || isItemsPending || isPlayerDetailPending) return <>LOADING...</>;

    const _getMainMageloItems = results => {
        if (!results) return [];
        return results.filter(item => !item.alt_loot && item.magelo);
    };

    const _getAltMageloItems = results => {
        if (!results) return [];
        return results.filter(item => item.alt_loot && item.magelo);
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
        return <Box>{char?.name ?? 'Un-named Character'}</Box>;
    };

    return (
        <Box
            sx={{
                display: 'flex',
                flexDirection: 'column',
                gap: 3,
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
