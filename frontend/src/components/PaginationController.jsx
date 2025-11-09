import { Button, Container } from '@mui/material';

export function PaginationController({ setPage, previous, next, styles = {} }) {
    const leftCarrot = '<';
    const rightCarrot = '>';

    return (
        <Container sx={styles}>
            <Button
                disabled={!previous}
                sx={{ color: 'white' }}
                onClick={_ => (previous ? setPage(prev => prev - 1) : null)}
            >
                {leftCarrot}
            </Button>
            <Button
                disabled={!next}
                sx={{ color: 'white' }}
                onClick={_ => (next ? setPage(prev => prev + 1) : null)}
            >
                {rightCarrot}
            </Button>
        </Container>
    );
}
