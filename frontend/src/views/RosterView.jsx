import { useState } from 'react';
import { Container, Table, TableBody, TableCell, TableRow } from '@mui/material';
import { useCharacterList } from '../hooks/requests.js';

export function RosterView() {
    const [shownChars, setShownChars] = useState({
        BRD: true,
        BST: true,
        CLR: true,
        DRU: true,
        ENC: true,
        MAG: true,
        MNK: true,
        NEC: true,
        PAL: true,
        RNG: true,
        ROG: true,
        SHD: true,
        SHM: true,
        WAR: true,
        WIZ: true,
    });

    const { data: characterList, isPending } = useCharacterList();
    const charClasses = [
        'BRD',
        'BST',
        'CLR',
        'DRU',
        'ENC',
        'MAG',
        'MNK',
        'NEC',
        'PAL',
        'RNG',
        'ROG',
        'SHD',
        'SHM',
        'WAR',
        'WIZ',
    ];

    if (isPending) return <>LOADING...</>;

    const getCharsByClass = results => {
        const _filterChars = charClass => {
            return results.filter(char => char.char_class === charClass);
        };
        return {
            BRD: _filterChars('BRD'),
            BST: _filterChars('BST'),
            CLR: _filterChars('CLR'),
            DRU: _filterChars('DRU'),
            ENC: _filterChars('ENC'),
            MAG: _filterChars('MAG'),
            MNK: _filterChars('MNK'),
            NEC: _filterChars('NEC'),
            PAL: _filterChars('PAL'),
            RNG: _filterChars('RNG'),
            ROG: _filterChars('ROG'),
            SHD: _filterChars('SHD'),
            SHM: _filterChars('SHM'),
            WAR: _filterChars('WAR'),
            WIZ: _filterChars('WIZ'),
        };
    };

    const reducedChars = getCharsByClass(characterList.results);

    function ClassCard({ data }) {
        return (
            <Table>
                <TableBody>
                    {data.map((char, i) => {
                        return (
                            <TableRow key={i} sx={{ color: 'white !important' }}>
                                <TableCell sx={{ color: 'white !important' }}>
                                    {char.name}
                                </TableCell>
                                <TableCell sx={{ color: 'white !important' }}>
                                    {char.player.name}
                                </TableCell>
                            </TableRow>
                        );
                    })}
                </TableBody>
            </Table>
        );
    }

    return (
        <Container>
            {Object.entries(reducedChars).map(([charClass, charList]) => {
                console.log(charList);
                return <ClassCard data={charList} />;
            })}
        </Container>
    );
}
