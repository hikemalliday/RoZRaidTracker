export function ListView({title, accessor, data}) {
    return (
        <div>
            <h1>{title}</h1>
            {data.map((element, i) => {
                const elementToRender = element[accessor];
                return (
                    <div key={i}>{ elementToRender ? elementToRender : "could not access object" }</div>
                )
            })}
        </div>
    )
}
