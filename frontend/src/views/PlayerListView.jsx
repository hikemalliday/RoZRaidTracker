import {ListView} from "./generic/ListView.jsx";
import {usePlayers} from "../hooks/requests.js";
import {useNavigate} from "react-router";

export function PlayerListView() {
    const navigate = useNavigate();
    const {data, isPending, error} = usePlayers("/players/");

    if (isPending) return <>LOADING...</>;

    if (error) return <>{error.message}</>;

    // console.log('data, players list payload:');
    // console.log(data);

    const getPlayersRows = (playersData) => {
        return playersData.map((player) => {
            return {
                "name": player.name,
                "id": player.id,
                "main": player.characters.find((char) => char.is_main === true),
                "mainAlt": player.characters.find((char) => char.is_main_alt === true),
            }
        })
    }
    console.log('getPlayersRows:');
    console.log(getPlayersRows(data));

    const handleClick = (view, id) => {
        return navigate(`/${view}/${id}`, {replace: true});
    }

    const table = (rows) => {
        return (
            <table>
                <thead>
                <tr>
                    <th>Name</th>
                    <th>Main</th>
                    <th>Alt</th>
                </tr>
                </thead>
                <tbody>
                {rows.map((row) => {
                    return (
                        <tr>
                            <td id="players-list-cell" onClick={(_) => handleClick("players", row?.id)}>{row?.name}</td>
                            <td id="players-list-cell" onClick={(_) => handleClick("characters", row?.main?.id)}>{row?.main?.name || "null"}</td>
                            <td id="players-list-cell" onClick={(_) => handleClick("characters", row?.mainAlt?.id)}>{row?.mainAlt?.name || "null"}</td>
                        </tr>
                    )
                })}
                </tbody>
            </table>
        )
    }
    return table(getPlayersRows(data));

    return <ListView title="Players" accessor="name" data={data}/>
}
