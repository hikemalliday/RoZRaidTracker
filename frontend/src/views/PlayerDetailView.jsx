import {DetailView} from "./generic/DetailView.jsx";
import {useNavigate, useParams} from "react-router";
import {useItemAwardedList, usePlayer, useRaidAttendance, useRaidAttendanceList} from "../hooks/requests.js";
import {getItemAwardedRows, getItemAwardedTable} from "./utils.jsx";

export function PlayerDetailView() {
    const navigate = useNavigate();
    const {id} = useParams();
    const {isPending: isPlayerPending, data: playerData, error: playerError} = usePlayer(id);
    const {isPending: isRaPending, data: raData, error: raError} = useRaidAttendanceList({player: id});
    const {
        isPending: isItemsAwardedPending,
        data: itemsAwardedData,
        error: itemsAwardedError
    } = useItemAwardedList({player: id});

    const handleClick = (view, id) => {
        return navigate(`/${view}/${id}`, {replace: true});
    }

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


    if (isPlayerPending || isRaPending || isItemsAwardedPending) return <>LOADING...</>;
    if (playerError || raError || itemsAwardedError) return renderErrors([playerError, raError,]);


    const itemAwardedRows = getItemAwardedRows(itemsAwardedData);
    const itemAwardedTable = getItemAwardedTable(itemAwardedRows, handleClick);

    return (
        <>
            {itemAwardedTable}
        </>
    )
}
