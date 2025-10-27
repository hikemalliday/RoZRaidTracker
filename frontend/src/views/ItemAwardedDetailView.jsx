import {DetailView} from "./generic/DetailView.jsx";
import {useParams} from "react-router";
import {getItemAwarded} from "../hooks/requests.js";

export function ItemAwardedDetailView() {
    const { id } = useParams();
    const { isPending, data, error } = getItemAwarded(id);

    if (isPending) return <>LOADING...</>;
    if (error) return <>{error.message}</>;

    return <DetailView data={data} accessor="name"/>
}