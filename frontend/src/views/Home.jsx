import {useNavigate} from "react-router";

export default function Home() {
    const navigate = useNavigate();

    return (
        <>
            <h1>Home / Dashboard</h1>
            <div style={{
                "display": "flex",
                "flexDirection": "column",
                "cursor": "pointer",
            }}>
                <a onClick={(_) => navigate("/player/")}>Players</a>
                <a onClick={(_) => navigate("/raid/")}>Raids</a>
                <a onClick={(_) => navigate("/item_awarded/")}>Items Awarded</a>
                <a onClick={(_) => navigate("/raid_attendance/")}>Raid Attendance</a>
            </div>
        </>
    );
}
