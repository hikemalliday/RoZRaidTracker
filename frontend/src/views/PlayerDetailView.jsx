import { useParams } from 'react-router';
import { useCharacterList, useItemAwardedList, usePlayer } from '../hooks/requests.js';
import { Container, Typography } from '@mui/material';
import { renderErrors } from './utils.jsx';
import { ItemAwardedListTable } from '../components/ItemAwardedListTable.jsx';
import { CharacterListTable } from '../components/CharacterListTable.jsx';

export function PlayerDetailView() {
    const { id } = useParams();
    const { isPending: isPlayerPending, data: playerData, error: playerError } = usePlayer(id);
    const {
        isPending: isItemAwardedPending,
        data: itemAwardedData,
        error: itemAwardedError,
    } = useItemAwardedList({ player: id });
    const {
        isPending: isCharacterPending,
        data: characterData,
        error: characterError,
    } = useCharacterList({ player: id });

    if (isPlayerPending || isItemAwardedPending || isCharacterPending) return <>LOADING...</>;

    const errorList = [playerError, itemAwardedError, characterError];
    if (errorList.some(Boolean)) return renderErrors(errorList);

    return (
        <Container>
            <Typography sx={{ mt: 5 }} variant="h5">
                Player: {playerData.name}
            </Typography>
            <Container>
                <Typography sx={{ mt: 1 }}>Lifetime RA: {playerData?.lifetime_ra}%</Typography>
            </Container>
            <Container>
                <Typography sx={{ mt: 5 }} variant="h6">
                    Items Awarded - Total: {itemAwardedData.count}
                </Typography>
                <ItemAwardedListTable data={itemAwardedData.results} />
            </Container>
            <Container sx={{ mt: 9 }}>
                <Typography variant="h6">Characters</Typography>
                <CharacterListTable data={characterData.results} />
            </Container>
        </Container>
    );
}
