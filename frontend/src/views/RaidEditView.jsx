import { useParams } from 'react-router';
import {
    useItemsAwardedList,
    useRaidAttendanceDelete,
    useRaidAttendanceList,
    useRaidDetail,
} from '../hooks/requests.js';
import { useAuthContext } from '../context/AuthContext.jsx';
import { Box, Container } from '@mui/material';
import { renderErrors } from './utils.jsx';
import React, { useMemo, useState } from 'react';
import { ItemAwardedListTableEditable } from '../components/ItemAwardedListTableEditable.jsx';
import { AddItemAwardedField } from '../components/AddItemAwardedField.jsx';
import { AddPlayerField } from '../components/AddPlayerField.jsx';
import { RemoveSelectedPlayersTable } from '../components/RemoveSelectedPlayersTable.jsx';
import { DataField } from '../components/DataField.jsx';

export function RaidEditView() {
    const { id } = useParams();
    const { isSuperUser } = useAuthContext();
    const { isPending, data, error } = useRaidDetail(id);
    const {
        isPending: isRaPending,
        data: raData,
        error: raError,
    } = useRaidAttendanceList({ raid: id });
    const {
        isPending: isItemAwardedPending,
        data: itemAwardedData,
        error: itemAwardedError,
    } = useItemsAwardedList({ raid: id });
    const { mutate } = useRaidAttendanceDelete();
    const [raRowsToDelete, setRaRowsToDelete] = useState([]);

    const pendingList = [isPending, isRaPending, isItemAwardedPending];
    const errorList = [error, raError, itemAwardedError];

    const playersToRender = useMemo(() => {
        return raData?.results
            ?.map(ra => ({ name: ra.player.name, id: ra.id }))
            .sort((a, b) => a.name.localeCompare(b.name));
    }, [raData]);

    if (pendingList.some(Boolean)) return <>LOADING...</>;
    if (errorList.some(Boolean)) return <>{renderErrors(errorList)}</>;
    if (!isSuperUser) return <>Unauthorized.</>;
    if (!playersToRender) return <>LOADING...</>;

    const handleRemovePlayersSubmit = async () => {
        if (raRowsToDelete.length === 0) return;
        const promises = raRowsToDelete.map(id => mutate(id));
        await Promise.allSettled(promises);
        setRaRowsToDelete([]);
    };

    return (
        <Container>
            <Box
                sx={{
                    textAlign: 'center',
                    marginBottom: '40px',
                    display: 'flex',
                    justifyContent: 'center',
                    gap: '40px',
                }}
            >
                <DataField label="Raid" value={data?.name} />
                <DataField label="Date" value={data?.created_at} />
            </Box>
            <AddItemAwardedField raidId={id} />
            {itemAwardedData.results.length > 0 && (
                <ItemAwardedListTableEditable data={itemAwardedData.results} styledRows={true} />
            )}
            <DataField label="Attendees" value={raData.count} sx={{ mb: 3 }} />
            <AddPlayerField raidId={id} styles={{ mb: 2 }} />
            <RemoveSelectedPlayersTable
                playersToRender={playersToRender}
                selectedRows={raRowsToDelete}
                setSelectedRows={setRaRowsToDelete}
                onSubmit={handleRemovePlayersSubmit}
            />
        </Container>
    );
}
