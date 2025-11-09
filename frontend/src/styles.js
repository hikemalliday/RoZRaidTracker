export const buttonStyles = {
    color: 'white',
    margin: 0.5,
    backgroundColor: 'black',
    '&::after': {
        content: '""',
        position: 'absolute',
        left: 0,
        top: 0,
        right: 0,
        bottom: 0,
        boxShadow: '0 0 0 2px rgba(255,255,255,1)',
        opacity: 0,
        pointerEvents: 'none',
        transition: 'opacity 220ms ease-in-out',
    },
    '&:hover::after, &:focus-visible::after': {
        opacity: 1,
    },
};

export const selectComponentProps = {
    variant: 'standard',
    sx: {
        marginTop: 1,
        backgroundColor: 'gray',
        width: 125,
        height: 32,
        padding: 1,
        '&:before': {
            borderBottomColor: 'white',
        },
        '&:after': {
            borderBottomColor: 'white',
        },
        borderTopLeftRadius: 1,
        borderTopRightRadius: 1,
    },
    MenuProps: {
        disableScrollLock: true,
    },
};
