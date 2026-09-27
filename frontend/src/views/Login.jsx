import { useState } from 'react';
import axios from 'axios';
import { useAuthContext } from '../context/AuthContext.jsx';
import { useNavigate } from 'react-router';
import { useMessage } from '../context/MessageContext.jsx';
import { buttonStyles } from '../styles.js';
import { Box, Button } from '@mui/material';

const BASE_URL = import.meta.env.VITE_BASE_URL;

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
            const resp = await axios.post(`${BASE_URL}/token/`, {
                username: username.toLowerCase().trim(),
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
        <Box>
            <h3>LOG IN</h3>
            {error && <p>{error}</p>}
            <form onSubmit={e => getTokenPair(e)}>
                <Box>
                    <input
                        type="text"
                        placeholder="Username"
                        value={username}
                        onChange={e => setUsername(e.target.value)}
                        required
                    />
                </Box>
                <Box>
                    <input
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={e => setPassword(e.target.value)}
                        required
                    />
                </Box>
                <Button type="submit" style={buttonStyles}>SUBMIT</Button>
            </form>
            {loginSuccess && <LoginSuccessMessage />}
        </Box>
    );
}
