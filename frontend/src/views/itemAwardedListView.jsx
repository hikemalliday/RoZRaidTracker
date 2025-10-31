import {useItemAwardedList} from "../hooks/requests.js";
import {useNavigate} from "react-router";
import {getItemAwardedRows, getItemAwardedTable} from "./utils.jsx";

export function ItemAwardedListView() {
    const navigate = useNavigate();
    const {data, isPending, error} = useItemAwardedList();

    const handleClick = (view, id) => {
        return navigate(`/${view}/${id}`, {replace: true});
    }


    if (isPending) return <>LOADING...</>;

    if (error) return <>{error.message}</>;

    return getItemAwardedTable(getItemAwardedRows(data), handleClick);
}
