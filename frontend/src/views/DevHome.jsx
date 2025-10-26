import {useState, useEffect} from "react";
import {useAxios} from "../hooks/useAxios.jsx";

export default function DevHome() {
    const [players, setPlayers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const client = useAxios("http://127.0.0.1:8000/api/");

    async function getPlayers() {
        try {
            setLoading(true);
            const resp = await client.get("players/");
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


    if (loading) return <>
        LOADING...
    </>
    return (
        <>

            <div>{players.map((player, i) => {
                return <div key={i}>{player.name}</div>
            })}</div>
            <div>{error ?? error}</div>
        </>
    );
}
