import {useNavigate} from "react-router";

export function ListView({title, accessor, data}) {
    const navigate = useNavigate();
    return (
        <div>
            <h1>{title}</h1>
            <div id="list-view-links">
                {data.map((element, i) => {
                    const elementToRender = element[accessor];
                    return (
                        <a
                            id="list-view-link"
                            key={i}
                            onClick={
                                (_) => navigate(`${element.id}`)}
                        >
                            {elementToRender ? elementToRender : "could not access object"}
                        </a>
                    )
                })}
            </div>
        </div>
    )
}
