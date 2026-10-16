import { AddItemAwardedField } from "./components/AddItemAwardedField";

export const VERY_DARK_GRAY = '#333';

export const buttonStyles = {
        color: 'white',
        backgroundColor: 'rgba(255, 255, 255, 0.05)',
        border: '1px solid rgba(255, 255, 255, 0.12)',
        borderRadius: 2,
        width: 40,
        height: 40,
        transition: 'all 0.2s ease-in-out',
        '&:hover': {
            backgroundColor: 'rgba(102, 178, 255, 0.15)',
            borderColor: '#66b2ff',
        },
        '&.Mui-disabled': {
            color: 'rgba(255, 255, 255, 0.3)',
            borderColor: 'rgba(255, 255, 255, 0.05)',
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
// Used in editable version of meta data component
export const metaDataLabel = {
    color: '#6b7280',
    fontSize: '12px',
    marginBottom: '4px',
};

export const metaDataText = {
    color: '#fff',
    fontSize: '18px',
    fontWeight: 600,
};

export const dataLabel = {
    color: '#9ca3af',
    fontSize: '12px',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
    marginBottom: '4px',
};

export const tableBox = {
    background: '#1a1a1a',
    border: '1px solid #2a2a2a',
    borderRadius: '8px',
    overflow: 'hidden',
    marginBottom: '30px',
    width: 'calc(100% + 80px)',
    marginLeft: '-20px',
    marginRight: '-20px',
};

export const fieldCardStyles = {
    background: '#1a1a1a',
    border: '1px solid #2a2a2a',
    borderRadius: '8px',
    padding: '20px',
    width: 'calc(100% + 80px)',
    marginLeft: '-20px',
    marginRight: '-20px',
    boxSizing: 'border-box',
};

export const fieldCardTypographyStyles = {
    color: '#9ca3af',
    fontSize: '13px',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
    marginBottom: '12px',
};

export const compactTableRowStyles = {
    '& .MuiTableCell-root': {
        padding: '4px',
    },
    height: '36px',
};

export const listItemStyles = {
    cursor: 'pointer',

    '&:hover': {
        backgroundColor: 'rgba(255,255,255,0.05)',
    },
};

export const messageContainerStyles = {
     position: 'fixed',
                bottom: 24,
                left: '50%',
                transform: 'translateX(-50%)',
                width: { xs: 'calc(100% - 32px)', sm: 420 },
                zIndex: theme => theme.zIndex.snackbar
}

export const boxEffectStyles = {
    display: 'flex',
    alignItems: 'flex-start',
    gap: 2
}

export const styles_map = {
        "preferred": {
            background: 'rgba(234, 179, 8, 0.15)',
            color: '#facc15',
            border: '1px solid rgba(234, 179, 8, 0.3)',
        },
        "preferred_magelo": {
            background: 'rgba(245, 158, 11, 0.15)',
            color: '#fbbf24',
            border: '1px solid rgba(245, 158, 11, 0.3)',
        },
        "main_magelo": {
            background: 'rgba(239, 68, 68, 0.15)',
            color: '#f87171',
            border: '1px solid rgba(239, 68, 68, 0.3)',
        },
        "alt_magelo": {
            background: 'rgba(249, 115, 22, 0.15)',
            color: '#fb923c',
            border: '1px solid rgba(249, 115, 22, 0.3)',
        },
        "alt": {
            background: 'rgba(139, 92, 246, 0.15)',
            color: '#a78bfa',
            border: '1px solid rgba(139, 92, 246, 0.3)',
        },
        "main": {
            background: 'rgba(107, 114, 128, 0.15)',
            color: '#9ca3af',
            border: '1px solid rgba(107, 114, 128, 0.3)',
        },
        "main_alt": {
            background: 'rgba(139, 92, 246, 0.15)',
            color: '#a78bfa',
            border: '1px solid rgba(139, 92, 246, 0.3)',
        }
    }

    export const tableStylesSmall = {
                    color: 'white', // text color
                    '.MuiOutlinedInput-notchedOutline': {
                        borderColor: 'white',
                    },
                    '&:hover .MuiOutlinedInput-notchedOutline': {
                        borderColor: 'white',
                    },
                    '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                        borderColor: 'white',
                    },
                    '.MuiSvgIcon-root': {
                        color: 'white', // dropdown arrow
                    },
                }

    export const nonClickableCellStyles = (badgeStyle) => ({

        display: 'inline-block',
                    padding: '4px 10px',
                    borderRadius: '4px',
                    border: badgeStyle.border,
                    background: badgeStyle.background,
                    color: badgeStyle.color,
                    fontSize: '12px',
                    textTransform: 'uppercase',
                    fontWeight: 500,
                    letterSpacing: '0.3px',

    }) 
                    
                

    export const lootSelectStyles = {
                        width: '150px',
                        color: 'white', // text color
                        '.MuiOutlinedInput-notchedOutline': {
                            borderColor: 'white',
                        },
                        '&:hover .MuiOutlinedInput-notchedOutline': {
                            borderColor: 'white',
                        },
                        '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                            borderColor: 'white',
                        },
                        '.MuiSvgIcon-root': {
                            color: 'white', // dropdown arrow
                        },
                    }