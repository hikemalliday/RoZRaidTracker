export const renderErrors = errorsList => {
    return (
        <div id="errors-list">
            {errorsList.map(err => {
                return <div>{err.message}</div>;
            })}
        </div>
    );
};

export const handleAscDesc = (orderBy, sortBy) => {
    return orderBy === 'desc' ? `-${sortBy}` : sortBy;
};
