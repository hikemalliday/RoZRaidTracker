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

export const _getReducedRaidsList = results => {
    if (!results) return [];
    return results.map(res => {
        return { id: res.id, label: `${res.name} ${res.created_at}` };
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

export const getRaidsListFinal = results => {
    return _getReducedRaidsList(results);
};

export function joinAndTruncate(array, truncateLength = 50) {
    return array.join(', ').slice(0, truncateLength) + '...';
}

export function getLootType(itemObj) {
    let lootType = '';
    // Preferred
    if (itemObj.preferred && !itemObj.alt_loot) lootType = 'Preferred';
    // Magelo and main
    else if (itemObj.magelo && !itemObj.alt_loot) lootType = 'Main, Magelo';
    // Main
    else if (!itemObj.alt_loot && !itemObj.magelo) lootType = 'Main';
    // Alt + Magelo
    else if (itemObj.alt_loot && itemObj.magelo) lootType = 'Alt, Magelo';
    // Alt
    else if (itemObj.alt_loot && !itemObj.magelo) lootType = 'Alt';
    return lootType;
}

export function sortItemsByType(results) {
    if (!results) return [];

    return [...results].sort((a, b) => {
        if (a.preferred !== b.preferred) {
            return a.preferred ? -1 : 1;
        }

        if (a.magelo !== b.magelo) {
            return a.magelo ? -1 : 1;
        }

        if (a.alt_loot !== b.alt_loot) {
            return a.alt_loot ? -1 : 1;
        }

        return 0;
    });
}
