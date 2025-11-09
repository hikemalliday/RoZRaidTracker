// import {DetailView} from "./generic/DetailView.jsx";
// import {useParams} from "react-router";
// import {useItemAwarded} from "../hooks/requests.js";
//
// export function ItemAwardedDetailView() {
//     const { id } = useParams();
//     const { isPending, data, error } = useItemAwarded(id);
//
//     if (isPending) return <>LOADING...</>;
//     if (error) return <>{error.message}</>;
//
//     return <DetailView data={data} accessor="name"/>
// }
