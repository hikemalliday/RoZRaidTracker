import { getCell, getItemIconCell, getLinkCell, TableList } from './Tables.jsx';
import { TableRow } from '@mui/material';

export function ItemAwardedListTable({ data, highlight21Day = false }) {
    const veryDarkGray = '#333';

    const rowStyles = {
        backgroundColor: veryDarkGray,
    };

    const getIs21Day = dateString => {
        if (!dateString) return false;

        // Regex for MM-DD-YY
        const regex = /^(\d{2})-(\d{2})-(\d{2})$/;
        if (!regex.test(dateString)) {
            console.error('Invalid date format. Expected MM-DD-YY');
            return false;
        }

        // Parse month, day, year
        const [month, day, year] = dateString.split('-').map(Number);

        // Adjust two-digit year (e.g., 25 -> 2025)
        const fullYear = year < 50 ? 2000 + year : 1900 + year;
        const inputDate = new Date(fullYear, month - 1, day); // Month is 0-based in JS

        // Check if the date is valid
        if (isNaN(inputDate.getTime())) {
            console.error('Invalid date');
            return false;
        }

        // Get current date
        const currentDate = new Date();

        // Calculate time difference
        const timeDifference = currentDate - inputDate;
        const twentyOneDaysInMs = 21 * 24 * 60 * 60 * 1000;

        // Return true if within 21 days and not in the future
        return timeDifference >= 0 && timeDifference <= twentyOneDaysInMs;
    };

    const getItemAwardedRows = data => {
        return data.map((row, i) => {
            const is21Day = getIs21Day(row?.raid?.created_at);
            return (
                <TableRow key={i} sx={is21Day && highlight21Day ? rowStyles : {}}>
                    {getItemIconCell(row?.item?.icon_id)}
                    {getCell(row?.item?.name)}
                    {getLinkCell(row?.player?.name, `/player/${row?.player?.id}`)}
                    {getLinkCell(row?.raid?.name, `/raid/${row?.raid?.id}`)}
                    {getCell(row?.raid?.created_at)}
                </TableRow>
            );
        });
    };

    // Null vals means col is not sortable
    const headerMap = {
        '': null,
        Name: 'item.name',
        Player: 'player.name',
        Raid: 'raid.name',
        Date: 'raid.created_at',
    };
    return <TableList headerMap={headerMap} data={data} getTableRows={getItemAwardedRows} />;
}
