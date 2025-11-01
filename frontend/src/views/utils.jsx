export const renderErrors = (errorsList) => {
    return (
        <div id="errors-list">
            {errorsList.map((err) => {
                return (<div>
                    {err.message}
                </div>)
            })}
        </div>
    )
}
