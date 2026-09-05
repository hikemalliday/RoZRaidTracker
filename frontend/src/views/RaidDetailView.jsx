import { useNavigate, useParams } from 'react-router';
import { useItemsAwardedList, useRaidAttendanceList, useRaidDetail } from '../hooks/requests.js';
import { Box, Container, Typography } from '@mui/material';
import { RaidAttendanceListTable } from '../components/RaidAttendanceListTable.jsx';
import { ItemAwardedListTable } from '../components/ItemAwardedListTable.jsx';
import { getItemAwardedMetaDataEditable, renderErrors } from './utils.jsx';
import { useAuthContext } from '../context/AuthContext.jsx';
import { compactTableRowStyles, labelStyles, tableBox } from '../styles.js';
import React, { useMemo, useRef } from 'react';
import { DataField } from '../components/DataField.jsx';

export function RaidDetailView() {
    const { id } = useParams();
    const { isSuperUser, isAuthenticated } = useAuthContext();
    const navigate = useNavigate();
    const containerRef = useRef(null);
    const tableBoxRef = useRef(null);
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

    const sortedPlayers = useMemo(() => {
        return raData?.sort((a, b) => a.player.name.localeCompare(b.player.name));
    }, [raData]);

    const pendingList = [isPending, isRaPending, isItemAwardedPending];
    const errorList = [error, raError, itemAwardedError];

    if (pendingList.some(Boolean)) return <>LOADING...</>;
    if (errorList.some(Boolean)) return <>{renderErrors(errorList)}</>;

    return (
        <Container
            ref={containerRef}
            sx={{
                maxWidth: '1400px',
                margin: '0 auto',
                padding: '20px',
            }}
        >
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
            {getItemAwardedMetaDataEditable(
                itemAwardedData,
                isAuthenticated,
                isSuperUser,
                () => navigate('edit')
            )}
            <Box ref={tableBoxRef} sx={tableBox}>
                <ItemAwardedListTable data={itemAwardedData} styledRows={false} />
            </Box>
            <Typography sx={labelStyles}>Attendees - Total: {raData.length}</Typography>
            <Container>
                <Box sx={{ ...tableBox, mt: 4 }}>
                    <RaidAttendanceListTable
                        data={sortedPlayers}
                        rowStyles={compactTableRowStyles}
                        sortable
                    />
                </Box>
            </Container>
        </Container>
    );
}
