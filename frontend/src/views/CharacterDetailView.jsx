import {DetailView} from "./generic/DetailView.jsx";
import {useParams} from "react-router";
import {getCharacter} from "../hooks/requests.js";

export function CharacterDetailView() {
    const { id } = useParams();
    const { isPending, data, error } = getCharacter(id);

    if (isPending) return <>LOADING...</>;
    if (error) return <>{error.message}</>;

    return <DetailView data={data} accessor="name"/>
}