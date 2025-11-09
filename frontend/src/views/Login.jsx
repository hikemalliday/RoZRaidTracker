import { useState } from 'react';
import axios from 'axios';
import { useAuthContext } from '../context/AuthContext.jsx';
import { useNavigate } from 'react-router';
import { useMessage } from '../context/MessageContext.jsx';
import { buttonStyles } from '../styles.js';

export default function Login() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [loginSuccess, setLoginSuccess] = useState(false);
    const [error, setError] = useState(null);
    const { login } = useAuthContext();
    const { addMessage } = useMessage();

    const navigate = useNavigate();

    async function getTokenPair(e) {
        e.preventDefault();
        try {
            const resp = await axios.post('http://127.0.0.1:8000/api/token/', {
                username,
                password,
            });
            if (resp.status === 200) {
                setLoginSuccess(true);
                login({
                    access: resp.data['access'],
                    refresh: resp.data['refresh'],
                });
                addMessage('Successfully logged in.');
            }
        } catch (err) {
            console.error(err);
            setError(
                err.response?.data?.detail ||
                    err.response?.data?.non_field_errors?.[0] ||
                    'Invalid Credentials'
            );
            setLoginSuccess(false);
        }
    }

    const LoginSuccessMessage = () => {
        navigate('/');
        return (
            <div>
                Login successful. If you are not automatically redirect, click
                <a onClick={() => navigate('/')}>here</a>
            </div>
        );
    };

    return (
        <div>
            <h3>LOG IN</h3>
            {error && <p>{error}</p>}
            <form onSubmit={e => getTokenPair(e)}>
                <div>
                    <input
                        type="text"
                        placeholder="Username"
                        value={username}
                        onChange={e => setUsername(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <input
                        type="text"
                        placeholder="Password"
                        value={password}
                        onChange={e => setPassword(e.target.value)}
                        required
                    />
                </div>
                <button style={buttonStyles}>SUBMIT</button>
            </form>
            {loginSuccess && <LoginSuccessMessage />}
        </div>
    );
}
