import {DetailView} from "./generic/DetailView.jsx";
import {useParams} from "react-router";
import {getPlayer} from "../hooks/requests.js";

export function PlayerDetailView() {
    const { id } = useParams();
    const { isPending, data, error } = getPlayer(id);

    if (isPending) return <>LOADING...</>;
    if (error) return <>{error.message}</>;

    return <DetailView data={data} accessor="name"/>
}
