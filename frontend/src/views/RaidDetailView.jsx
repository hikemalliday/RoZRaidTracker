import { useNavigate, useParams } from 'react-router';
import { useItemsAwardedList, useRaidAttendanceList, useRaidDetail } from '../hooks/requests.js';
import { Container, Typography } from '@mui/material';
import { RaidAttendanceListTable } from '../components/RaidAttendanceListTable.jsx';
import { ItemAwardedListTable } from '../components/ItemAwardedListTable.jsx';
import { renderErrors } from './utils.jsx';
import { useAuthContext } from '../context/AuthContext.jsx';
import { labelStyles } from '../styles.js';

export function RaidDetailView() {
    const { id } = useParams();
    const { isSuperUser, isAuthenticated } = useAuthContext();
    const navigate = useNavigate();
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
        <Container>
            {isAuthenticated && isSuperUser === true ? (
                <>
                    <button style={{ marginTop: 5 }} onClick={_ => navigate('edit')}>
                        EDIT RAID
                    </button>
                </>
            ) : (
                <></>
            )}
            <Typography sx={{ mt: 5 }} variant="h5">
                {data?.name}
            </Typography>
            <Container sx={{ mt: 1 }}>
                <strong>Date:</strong> {data?.created_at}
            </Container>
            <Typography sx={labelStyles}>Items Awarded - Total: {itemAwardedData.count}</Typography>
            <Container>
                <ItemAwardedListTable data={itemAwardedData.results} styledRows />
            </Container>
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
