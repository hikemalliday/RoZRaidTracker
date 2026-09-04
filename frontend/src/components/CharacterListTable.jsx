import { CellNonClickable, LinkCell, TableList } from './Tables.jsx';
import { TableRow } from '@mui/material';

export function CharacterListTable({ data }) {

    const getCharacterRows = sorted => {
        return sorted.map((row, i) => {
            return (
                <TableRow key={i}>
                    <CellNonClickable val={row?.name} />
                    <CellNonClickable val={row?.char_class} />
                    <CellNonClickable val={row?.type} />
                    <LinkCell val={row?.player.name} route={`/player/${row?.player?.id}`} />
                </TableRow>
            );
        });
    };

    // Null vals here means cols are not sortable
    const headerMap = {
        Name: null,
        Class: null,
        Status: null,
        Player: null,
    };

    if (data.length === 0) return <>No characters found.</>;

    return <TableList data={data} getTableRows={getCharacterRows} headerMap={headerMap} />;
}
