import {useRaidAttendanceList} from "../hooks/requests.js";
import {useNavigate} from "react-router";
import {getRaRows, getRaTable} from "./utils.jsx";

export function RaidAttendanceListView() {
    const navigate = useNavigate();
    const {data: raData, isPending, error} = useRaidAttendanceList();

    if (isPending) return <>LOADING...</>;

    if (error) return <>{error.message}</>

    const handleClick = (view, id) => {
        return navigate(`/${view}/${id}`, {replace: true});
    }

    const raRows = getRaRows(raData);
    const raTable = getRaTable(raRows, handleClick);

    return <>
        {raTable}
    </>
}
