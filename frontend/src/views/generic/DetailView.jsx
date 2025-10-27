export function DetailView({data, accessor}) {

    const renderData = () => {
        return Object.entries(data).map(([key, val], i) => {
            return (
                <div key={i}>
                    <strong>{key}:</strong> {val}
                </div>
            )
        });
    }


    return (
        <div id="detail-view-main">
            <h3>{data[accessor]}</h3>
            <div id="detail-view-data">{renderData()}</div>
        </div>
    )
}