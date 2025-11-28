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

export const _getReducedResults = results => {
    if (!results) return [];
    return results.map(res => {
        return { id: res.id, label: res.name };
    });
};

const _sortReducedList = results => {
    return results.sort((a, b) => {
        const valA = a.label;
        const valB = b.label;
        return valA.localeCompare(valB);
    });
};

export const getPlayersListFinal = results => {
    const reducedList = _getReducedResults(results);
    return _sortReducedList(reducedList);
};

export function joinAndTruncate(array, truncateLength = 50) {
    return array.join(', ').slice(0, truncateLength) + '...';
}
