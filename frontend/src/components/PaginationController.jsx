import { Button, Container } from '@mui/material';
import { buttonStyles } from '../styles.js';

export function PaginationController({ setPage, previous, next, styles = {} }) {
    const leftCarrot = '<';
    const rightCarrot = '>';

    return (
        <Container sx={{ ...styles, marginBottom: 3 }}>
            <Button
                disabled={!previous}
                sx={buttonStyles}
                onClick={_ => (previous ? setPage(prev => prev - 1) : null)}
            >
                {leftCarrot}
            </Button>
            <Button
                disabled={!next}
                sx={buttonStyles}
                onClick={_ => (next ? setPage(prev => prev + 1) : null)}
            >
                {rightCarrot}
            </Button>
        </Container>
    );
}
