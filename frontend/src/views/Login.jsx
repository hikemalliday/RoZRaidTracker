import {useState} from "react";
import axios from "axios";

export default function Login() {
    const [username, setUsername] = useState(null);
    const [password, setPassword] = useState(null);
    const [access, setAccess] = useState(null);
    const [refresh, setRefresh] = useState(null);
    const [error, setError] = useState(null);

    async function login(e) {
        e.preventDefault();
        try {
            const resp = await axios.post("http://127.0.0.1:8000/api/token/", {username, password});
            console.log(resp);
            if (resp.status === 200) {
                setAccess(resp.data["access"]);
                setRefresh(resp.data["refresh"]);
            }
        } catch (err) {
            console.error(err);
            setError(err.response?.data?.detail || err.response?.data?.non_field_errors?.[0] || 'Invalid Credentials');
        }
    };

    return (<div>
            <h3>LOG IN</h3>
            {error ?? <p>{error}</p>}
            <form onSubmit={(e) => login(e)}>
                <div>
                    <input
                        type="text"
                        placeholder="Username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <input
                        type="text"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </div>
                <button>
                    SUBMIT
                </button>
            </form>
            {access ?? (<div style={{display: "flex", justifyContent: "center", flexDirection: "column"}}>
                    <p><strong>Access:</strong>{access}</p>
                    <p><strong>Refresh:</strong>{refresh}</p>
                </div>)}
        </div>)

}