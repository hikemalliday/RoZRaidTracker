import { Table, TableBody, TableCell, TableHead, TableRow, Box } from '@mui/material';
import { Link } from 'react-router';
import React, { useEffect, useState, useRef } from 'react';
import { IMAGE_PATH } from '../config.js';
import { fixLinks, getItemInfo } from '../views/utils.jsx';

export function HoverTooltipCell({ val, itemId }) {
    const [itemHtml, setItemHtml] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [hovered, setHovered] = useState(false);
    const [tooltipStyle, setTooltipStyle] = useState({ top: 0, left: 0 });
    const wrapperRef = useRef(null);
    const tooltipRef = useRef(null);

    const handleMouseEnter = async () => {
        setHovered(true);
        if (!itemHtml && !isLoading) {
            setIsLoading(true);
            const html = await getItemInfo(itemId);
            setItemHtml(fixLinks(html));
            setIsLoading(false);
        }
    };

    const handleMouseLeave = () => {
        setHovered(false);
    };

    useEffect(() => {
        if (hovered && (itemHtml || isLoading) && wrapperRef.current && tooltipRef.current) {
            const calculatePosition = () => {
                if (!wrapperRef.current || !tooltipRef.current) return;
                
                const wrapperRect = wrapperRef.current.getBoundingClientRect();
                const tooltipRect = tooltipRef.current.getBoundingClientRect();
                const viewportWidth = window.innerWidth;
                const margin = 10; // Minimum margin from viewport edge
                
                // Calculate top position: below the cell
                const top = wrapperRect.bottom + 5;
                
                // Calculate left position: center it by default
                const centerX = wrapperRect.left + wrapperRect.width / 2;
                const tooltipHalfWidth = tooltipRect.width / 2;
                let left = centerX - tooltipHalfWidth;
                
                // Check for overflow and adjust
                if (left < margin) {
                    // Would overflow left, align to left edge with margin
                    left = margin;
                } else if (left + tooltipRect.width > viewportWidth - margin) {
                    // Would overflow right, align to right edge with margin
                    left = viewportWidth - tooltipRect.width - margin;
                }
                
                setTooltipStyle({ top, left });
            };
            
            // Initial calculation
            const rafId = requestAnimationFrame(() => {
                setTimeout(calculatePosition, 0);
            });
            
            // Recalculate on scroll and resize
            const handleScroll = () => calculatePosition();
            const handleResize = () => calculatePosition();
            
            window.addEventListener('scroll', handleScroll, true);
            window.addEventListener('resize', handleResize);
            
            return () => {
                cancelAnimationFrame(rafId);
                window.removeEventListener('scroll', handleScroll, true);
                window.removeEventListener('resize', handleResize);
            };
        }
    }, [hovered, itemHtml, isLoading]);

    return (
        <TableCell
            ref={wrapperRef}
            className="tooltip-wrapper"
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
        >
            {val}
            {hovered && itemHtml && (
                <div 
                    ref={tooltipRef}
                    className="tooltip-content"
                    style={tooltipStyle}
                    dangerouslySetInnerHTML={{ __html: itemHtml }} 
                />
            )}
            {hovered && !itemHtml && (
                <div 
                    ref={tooltipRef}
                    className="tooltip-content"
                    style={tooltipStyle}
                >
                    Loading...
                </div>
            )}
        </TableCell>
    );
}

export const getLinkCell = (val, route, extraText) => {
    return (
        <TableCell id="clickable-cell">
            <Link to={route}>{val}</Link>
            <span id={extraText?.id}>{extraText?.text}</span>
        </TableCell>
    );
};

export const getCell = val => {
    return <TableCell id="non-clickable-cell">{val}</TableCell>;
};

export const getItemIconCell = iconId => {
    return (
        <TableCell id="non-clickable-cell">
            <img id="item-icon" src={`${IMAGE_PATH}/item_${iconId}.png`} alt={'null'} />
        </TableCell>
    );
};

export const getCheckboxCell = changeHandler => {
    return (
        <TableCell>
            <input type="checkbox" onChange={e => changeHandler(e)} />
        </TableCell>
    );
};

export const getCheckboxCellControlled = (changeHandler, state) => {
    return (
        <TableCell>
            <input type="checkbox" checked={state} onChange={e => changeHandler(e)} />
        </TableCell>
    );
};

export const getLootTypeBadgeCell = (lootType) => {
    const getBadgeStyle = (type) => {
        if (!type) return null;
        const typeUpper = type.toUpperCase();
        // Main, Magelo -> blue
        if (typeUpper.includes('MAIN') && typeUpper.includes('MAGELO')) {
            return { 
                background: 'rgba(59, 130, 246, 0.15)',
                color: '#60a5fa', 
                border: '1px solid rgba(59, 130, 246, 0.3)' 
            };
        }
        // Alt, Magelo -> purple
        if (typeUpper.includes('ALT') && typeUpper.includes('MAGELO')) {
            return { 
                background: 'rgba(168, 85, 247, 0.15)',
                color: '#a78bfa', 
                border: '1px solid rgba(168, 85, 247, 0.3)' 
            };
        }
        // Alt -> purple
        if (typeUpper.includes('ALT')) {
            return { 
                background: 'rgba(139, 92, 246, 0.15)',
                color: '#a78bfa', 
                border: '1px solid rgba(139, 92, 246, 0.3)' 
            };
        }
        // Preferred -> green
        if (typeUpper.includes('PREFERRED')) {
            return { 
                background: 'rgba(34, 197, 94, 0.15)',
                color: '#4ade80', 
                border: '1px solid rgba(34, 197, 94, 0.3)' 
            };
        }
        // Main (without Magelo) -> blue
        if (typeUpper.includes('MAIN')) {
            return { 
                background: 'rgba(59, 130, 246, 0.15)',
                color: '#60a5fa', 
                border: '1px solid rgba(59, 130, 246, 0.3)' 
            };
        }
        return null;
    };

    const badgeStyle = getBadgeStyle(lootType);
    
    if (!badgeStyle) {
        return (
            <TableCell id="non-clickable-cell">
                {lootType}
            </TableCell>
        );
    }

    return (
        <TableCell id="non-clickable-cell">
            <Box
                sx={{
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
                }}
            >
                {lootType}
            </Box>
        </TableCell>
    );
};

// Order of keys in 'headerMap' matters, as the keys are used for rendering cols / headers
export function TableList({
    data,
    getTableRows,
    headerMap = {},
    sortable = false,
    styledRows = false,
    dataTestId = null,
}) {
    const [sorted, setSorted] = useState(data);
    const [sortDirection, setSortDirection] = useState('asc');
    const reducedData = getTableRows(sorted);

    useEffect(() => {
        setSorted(data);
    }, [data]);

    const _getNestedValue = (obj, path) => {
        return path.split('.').reduce((current, key) => {
            return current && typeof current === 'object' ? current[key] : undefined;
        }, obj);
    };

    const _sortByCol = header => {
        if (!header) return;
        const colToSortBy = headerMap[header];

        if (!colToSortBy) return;

        const newSorted = [...sorted].sort((a, b) => {
            const valA = _getNestedValue(a, colToSortBy);
            const valB = _getNestedValue(b, colToSortBy);

            if (valA == null || valB == null) {
                return valA == null ? 1 : -1;
            }

            const sortMapString = {
                asc: () => {
                    setSortDirection('desc');
                    return valB.localeCompare(valA);
                },
                desc: () => {
                    setSortDirection('asc');
                    return valA.localeCompare(valB);
                },
            };

            const sortMapNumber = {
                asc: () => {
                    setSortDirection('desc');
                    return valB - valA;
                },
                desc: () => {
                    setSortDirection('asc');
                    return valA - valB;
                },
            };

            const dataType = typeof valA;
            return dataType === 'string'
                ? sortMapString[sortDirection]()
                : sortMapNumber[sortDirection]();
        });
        return setSorted(newSorted);
    };

    const _getHeaderId = header => {
        const headerMapVal = headerMap[header];
        return headerMapVal && sortable ? 'table-header-sortable' : 'table-header';
    };

    return (
        <Table
            sx={{
                width: '100%',
                borderCollapse: 'collapse',
            }}
            data-testid={dataTestId ? `table-list-${dataTestId}` : `table-list-test-id`}
        >
            <TableHead>
                <TableRow>
                    {Object.entries(headerMap).map(([header, _], i) => {
                        return (
                            <TableCell
                                key={i}
                                id={_getHeaderId(header)}
                                onClick={_ => (sortable ? _sortByCol(header) : null)}
                            >
                                {header}
                            </TableCell>
                        );
                    })}
                </TableRow>
            </TableHead>
            <TableBody>
                {reducedData.map(row => {
                    return row;
                })}
            </TableBody>
        </Table>
    );
}
