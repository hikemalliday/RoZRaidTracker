import { useParams } from 'react-router';
import { useDetail, useList } from '../hooks/requests.js';
import { Container, Typography } from '@mui/material';
import { RaidAttendanceListTable } from '../components/RaidAttendanceListTable.jsx';
import { ItemAwardedListTable } from '../components/ItemAwardedListTable.jsx';
import { renderErrors } from './utils.jsx';

export function RaidDetailView() {
    const { id } = useParams();
    const { isPending, data, error } = useDetail('raids', '/raids/', id);
    const {
        isPending: isRaPending,
        data: raData,
        error: raError,
    } = useList('raid_attendance', '/raid_attendance/', { raid: id });
    const {
        isPending: isItemAwardedPending,
        data: itemAwardedData,
        error: itemAwardedError,
    } = useList('items_awarded', '/items_awarded/', { raid: id });

    const pendingList = [isPending, isRaPending, isItemAwardedPending];
    const errorList = [error, raError, itemAwardedError];

    if (pendingList.some(Boolean)) return <>LOADING...</>;
    if (errorList.some(Boolean)) return <>{renderErrors(errorList)}</>;

    return (
        <Container>
            <Typography sx={{ mt: 5 }} variant="h5">
                {data?.name}
            </Typography>
            <Container>
                <Typography>
                    <strong>Zone:</strong> {data?.zone?.name}
                </Typography>
                <strong>Date:</strong> {data?.created_at}
            </Container>
            <Typography sx={{ mt: 5 }} variant="h6">
                Items Awarded - Total: {itemAwardedData.count}
            </Typography>
            <Container>
                <ItemAwardedListTable data={itemAwardedData.results} />
            </Container>
            <Typography sx={{ mt: 5 }} variant="h6">
                Attendees - Total: {raData.count}
            </Typography>
            <Container>
                <RaidAttendanceListTable
                    data={raData.results}
                    rowStyles={{
                        '& .MuiTableCell-root': {
                            padding: '4px',
                        },
                        height: '36px',
                    }}
                />
            </Container>
        </Container>
    );
}
