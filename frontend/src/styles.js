export const VERY_DARK_GRAY = '#333';

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

export const getTextFieldStyles = (width = 600) => {
    return {
        '& .MuiOutlinedInput-root': {
            width: width,
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
};

export const textFieldStyles = {
    '& .MuiOutlinedInput-root': {
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

export const getIs21Day = dateString => {
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
    return Math.abs(timeDifference) <= twentyOneDaysInMs;
};

export const get21DayStyles = itemObj => {
    const is21day = getIs21Day(itemObj?.created_at);
    return is21day ? { backgroundColor: VERY_DARK_GRAY } : {};
};

export const labelStyles = {
    mt: 4,
    mb: 1,
    fontSize: '0.75rem',
    fontWeight: 600,
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
    color: 'white',
};
