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

export const textFieldStyles = {
    '& .MuiOutlinedInput-root': {
        width: 600,
        color: 'white',
        '& fieldset': {
            borderColor: 'rgba(255,255,255,0.4)',
        },
        '&:hover fieldset': {
            borderColor: 'rgba(255,255,255,0.7)',
        },
        '&.Mui-focused fieldset': {
            borderColor: '#66b2ff', // same as MUI docs
            borderWidth: 2,
        },
    },
    '& .MuiInputLabel-root': {
        color: 'rgba(255,255,255,0.7)',
    },
    '& label.Mui-focused': {
        color: '#66b2ff',
    },
};

export const listBoxStyles = {
    backgroundColor: '#121212',
    color: 'white',
    border: '1px solid rgba(255,255,255,0.2)',
    '& .MuiAutocomplete-option': {
        padding: '8px 12px',
        '&.Mui-focused': {
            backgroundColor: 'rgba(255,255,255,0.12)',
        },
        '&.Mui-selected': {
            backgroundColor: 'rgba(102,178,255,0.25)',
        },
        '&.Mui-selected:hover': {
            backgroundColor: 'rgba(102,178,255,0.35)',
        },
    },
};
