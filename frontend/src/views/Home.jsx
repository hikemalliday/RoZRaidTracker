import { useNavigate } from 'react-router';
import { useAuthContext } from '../context/AuthContext.jsx';

export default function Home() {
    const { isSuperUser } = useAuthContext();
    const navigate = useNavigate();

    return (
        <>
            <h1>Home / Dashboard</h1>
            <div
                style={{
                    display: 'flex',
                    flexDirection: 'column',
                    cursor: 'pointer',
                }}
            >
                {isSuperUser && (
                    <>
                        <a onClick={_ => navigate('/ra_approval/')}>Approval</a>
                    </>
                )}
                <a onClick={_ => navigate('/compare/')}>Compare</a>
                <a onClick={_ => navigate('/player/')}>Players</a>
                <a onClick={_ => navigate('/raid/')}>Raids</a>
                <a onClick={_ => navigate('/item_awarded/')}>Items Awarded</a>
            </div>
        </>
    );
}
