import {useNavigate} from "react-router";
import {useAuthContext} from "../context/AuthContext.jsx";

export function NavBar() {
    const navigate = useNavigate();
    const { isAuthenticated } = useAuthContext();
    const navBarLinks = () => {
      if (!isAuthenticated) return <div></div>
        return (
            <>
            <a id="nav-bar-players-link" onClick={() => navigate("/player")}>
                PLAYERS
            </a>
            -
            <a id="nav-bar-raids-link" onClick={() => navigate("/raid")}>
                RAIDS
            </a>
            -
            <a id="nav-bar-items-awarded-link" onClick={() => navigate("/item_awarded")}>
                ITEMS AWARDED
            </a>
        </>
        )
    };

    return (
        <div id="nav-bar-main">
            <div id="nav-bar-logo" onClick={() => navigate("/")}>
                ZEK
            </div>
            <div id="nav-bar-links">
                {navBarLinks()}
            </div>
        </div>
    )
}