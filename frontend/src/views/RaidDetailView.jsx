import {useParams} from "react-router";
import {useItemAwardedList, useRaid, useRaidAttendanceList} from "../hooks/requests.js";
import {Container, Typography} from "@mui/material";
import {RaidAttendanceListTable} from "../components/RaidAttendanceListTable.jsx";
import {ItemAwardedListTable} from "../components/ItemAwardedListTable.jsx";
import {renderErrors} from "./utils.jsx";

export function RaidDetailView() {
    const {id} = useParams();
    const {isPending, data, error} = useRaid(id);
    const {isPending: isRaPending, data: raData, error: raError} = useRaidAttendanceList({"raid": id});
    const {isPending: isItemAwardedPending, data: itemAwardedData, error:itemAwardedError} = useItemAwardedList({"raid": id});

    const pendingList = [isPending, isRaPending, isItemAwardedPending];
    const errorList = [error, raError, itemAwardedError];

    if (pendingList.some(Boolean)) return <>LOADING...</>;
    if (errorList.some(Boolean)) return <>{renderErrors(errorList)}</>;

    return (
        <Container>
            <Typography sx={{mt: 5}} variant="h5">{data?.name}</Typography>
            <Container>
                <Typography>
                    <strong>Zone:</strong> {data?.zone?.name}
                </Typography>
                    <strong>Date:</strong> {data?.created_at}
            </Container>
            <Typography sx={{mt: 5}} variant="h6">
                Items Awarded
            </Typography>
            <Container>
                <ItemAwardedListTable data={itemAwardedData}/>
            </Container>
            <Typography sx={{mt: 5}} variant="h6">
                Attendees
            </Typography>
            <Container>
                <RaidAttendanceListTable data={raData}/>
            </Container>

        </Container>
    )
}
