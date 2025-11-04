import {DetailView} from "./generic/DetailView.jsx";
import {useParams} from "react-router";
import {useCharacter} from "../hooks/requests.js";

export function CharacterDetailView() {
    const { id } = useParams();
    const { isPending, data, error } = useCharacter(id);

    if (isPending) return <>LOADING...</>;
    if (error) return <>{error.message}</>;

    return <DetailView data={data} accessor="name"/>
}
