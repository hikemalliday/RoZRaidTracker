import {useParams} from "react-router";
import {useItemAwardedList, useRaid, useRaidAttendanceList} from "../hooks/requests.js";
import {Container, Typography} from "@mui/material";
import {getCell, getItemIconCell, getLinkCell, TableList} from "../components/Tables.jsx";

export function RaidDetailView() {
    const {id} = useParams();
    const {isPending, data, error} = useRaid(id);
    const {isPending: isRaPending, data: raData, error: raError} = useRaidAttendanceList({"raid": id});
    const {isPending: isItemAwardedPending, data: itemAwardedData, error:itemAwardedError} = useItemAwardedList({"raid": id});

    const renderErrors = (errorsList) => {
        return (
            <div id="errors-list">
                {errorsList.map((err) => {
                    return (<div>
                        {err.message}
                    </div>)
                })}
            </div>
        )
    }

    const pendingList = [isPending, isRaPending, isItemAwardedPending];
    const errorList = [error, raError, itemAwardedError];

    if (pendingList.some(Boolean)) return <>LOADING...</>;
    if (errorList.some(Boolean)) return <>{renderErrors(errorList)}</>;

    const getRaCells = (data) => {
        return data.map((row) => {
            return [
                getLinkCell(row?.raid?.name, `/raid/${row?.raid?.id}`),
                getCell(row?.raid.zone?.name),
                getLinkCell(row?.player?.name, `/player/${row?.player?.id}`),
                getCell(row?.created_at),
            ]
        });
    }

    const raHeaders = ["Raid", "Zone", "Player", "Date"];

    const getItemAwardedCells = (data) => {
        return data.map((row) => {
            return [
                getItemIconCell(row?.item?.icon_id),
                getCell(row?.item?.name),
                getLinkCell(row?.player?.name, `/player/${row?.player?.id}`),
                getLinkCell(row?.raid?.name, `/raid/${row?.raid?.id}`),
                getCell(row?.created_at),
            ]
        });
    };

    const itemAwardedHeaders = ["", "Name", "Player", "Raid", "Date"];

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
                Attendees
            </Typography>
            <Container>
                <TableList headers={raHeaders} reducedData={getRaCells(raData)}/>
            </Container>
            <Typography sx={{mt: 5}} variant="h6">
                Items Awarded
            </Typography>
            <Container>
                <TableList headers={itemAwardedHeaders} reducedData={getItemAwardedCells(itemAwardedData)}/>
            </Container>
        </Container>
    )

}
