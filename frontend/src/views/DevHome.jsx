import {useState, useEffect} from "react";
import axios from "axios";

export default function DevHome() {
    const [players, setPlayers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    async function getPlayers() {
        try {
            setLoading(true);
            const resp = await axios.get("http://127.0.0.1:8000/api/players/");
            console.log(resp.data);
            setPlayers(resp.data);
        } catch (err) {
            console.error(err);
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        void getPlayers();
    }, []);

    function renderPlayers(playersList) {
        return playersList.map((player) => {
            const playerName = player.name;
            return <div>{playerName}</div>;
        });
    }

    if (loading) return <>
        LOADING...
    </>
    return (
        <>

            <div>{players.map((player) => {
                return <div>{player.name}</div>
            })}</div>
            <div>{error ?? error}</div>
        </>
    );
}
