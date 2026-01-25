import { useNavigate, useParams } from 'react-router';
import { useItemsAwardedList, useRaidAttendanceList, useRaidDetail } from '../hooks/requests.js';
import { Box, Container, Typography } from '@mui/material';
import { RaidAttendanceListTable } from '../components/RaidAttendanceListTable.jsx';
import { ItemAwardedListTable } from '../components/ItemAwardedListTable.jsx';
import { getItemAwardedMetaDataEditable, renderErrors } from './utils.jsx';
import { useAuthContext } from '../context/AuthContext.jsx';
import { labelStyles } from '../styles.js';
import React, { useEffect, useRef } from 'react';

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

    const _sortPlayers = data => {
        return data.sort((a, b) => {
            const valA = a.player.name;
            const valB = b.player.name;
            return valA.localeCompare(valB);
        });
    };

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
                }}
            >
                <Box
                    sx={{
                        display: 'flex',
                        justifyContent: 'center',
                        gap: '40px',
                    }}
                >
                    <Box sx={{ fontSize: '16px' }}>
                        <Box
                            sx={{
                                color: '#9ca3af',
                                fontSize: '12px',
                                textTransform: 'uppercase',
                                letterSpacing: '0.5px',
                                marginBottom: '4px',
                            }}
                        >
                            Raid
                        </Box>
                        <Box sx={{ color: '#fff', fontWeight: 600 }}>{data?.name}</Box>
                    </Box>
                    <Box sx={{ fontSize: '16px' }}>
                        <Box
                            sx={{
                                color: '#9ca3af',
                                fontSize: '12px',
                                textTransform: 'uppercase',
                                letterSpacing: '0.5px',
                                marginBottom: '4px',
                            }}
                        >
                            Date
                        </Box>
                        <Box sx={{ color: '#fff', fontWeight: 600 }}>{data?.created_at}</Box>
                    </Box>
                </Box>
            </Box>

            {getItemAwardedMetaDataEditable(
                itemAwardedData?.results,
                isAuthenticated,
                isSuperUser,
                () => navigate('edit')
            )}
            <Box
                ref={tableBoxRef}
                sx={{
                    background: '#1a1a1a',
                    border: '1px solid #2a2a2a',
                    borderRadius: '8px',
                    overflow: 'hidden',
                    marginBottom: '30px',
                    width: 'calc(100% + 80px)',
                    marginLeft: '-20px',
                    marginRight: '-20px',
                }}
            >
                <ItemAwardedListTable data={itemAwardedData.results} styledRows={false} />
            </Box>
            <Typography sx={labelStyles}>Attendees - Total: {raData.count}</Typography>
            <Container>
                <RaidAttendanceListTable
                    data={_sortPlayers(raData.results)}
                    rowStyles={{
                        '& .MuiTableCell-root': {
                            padding: '4px',
                        },
                        height: '36px',
                    }}
                    sortable
                />
            </Container>
        </Container>
    );
}
