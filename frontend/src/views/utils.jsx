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

export const _getReduceItemAwardedResults = results => {
    if (!results) return [];
    let counter = 1;
    return results.map(item => {
        if (item.name === 'Cloak of Destruction') {
            console.log(item);
            console.log(counter);
            counter += 1;
        }
        return { id: item.id, label: item.name };
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

export const getItemOptionsListFinal = results => {
    return _getReduceItemAwardedResults(results);
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
// TODO: 1/17/26: Decided against this post-sorting for now. Could implemented at a later date, if desired.
export function sortItemsByType(results) {
    if (!results) return [];

    const score = item =>
        (item.preferred ? 100 : 0) + (item.magelo ? 10 : 0) - (item.alt_loot ? 1 : 0);

    return [...results].sort((a, b) => score(b) - score(a));
}

export async function getItemInfo(itemId) {
    try {
        const res = await fetch(`https://www.pqdi.cc/get-item-tooltip/${itemId}`);
        const html = await res.text();
        return html;
    } catch (err) {
        console.error(err);
    }
}

export function fixLinks(htmlString, baseUrl = 'https://www.pqdi.cc/') {
    // Parse the HTML
    const parser = new DOMParser();
    const doc = parser.parseFromString(htmlString, 'text/html');

    // Find all <a> tags
    const links = doc.querySelectorAll('a');
    links.forEach(link => {
        const href = link.getAttribute('href');

        // Prepend baseUrl if link is relative (doesn't start with http or #)
        if (href && !href.startsWith('http') && !href.startsWith('#')) {
            // Remove any leading slashes in href to avoid double slashes
            const cleanHref = href.replace(/^\/+/, '');
            link.setAttribute('href', `${baseUrl}${cleanHref}`);
        }

        // Make link open in new tab safely
        link.setAttribute('target', '_blank');
        link.setAttribute('rel', 'noopener noreferrer');
    });

    return doc.body.innerHTML;
}
