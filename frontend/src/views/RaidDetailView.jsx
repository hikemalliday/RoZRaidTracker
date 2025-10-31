import {DetailView} from "./generic/DetailView.jsx";
import {useParams} from "react-router";
import {useRaid} from "../hooks/requests.js";

export function RaidDetailView() {
    const { id } = useParams();
    const { isPending, data, error } = useRaid(id);

    if (isPending) return <>LOADING...</>;
    if (error) return <>{error.message}</>;

    return <DetailView data={data} accessor="name"/>
}
