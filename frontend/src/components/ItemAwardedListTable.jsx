import { getLinkCell, getLootTypeBadgeCell, TableList } from './Tables.jsx';
import { TableRow, TableCell, Box } from '@mui/material';
import { get21DayStyles } from '../styles.js';
import { getLootType } from '../views/utils.jsx';
import { IMAGE_PATH } from '../config.js';
import { useState, useRef, useEffect } from 'react';
import { getItemInfo, fixLinks } from '../views/utils.jsx';

export function ItemAwardedListTable({
    data,
    highlight21Day = false,
    styledRows = false,
    enableToolTip = true,
    dataTestId = null,
    ...rest
}) {
    const ItemNameCell = ({ item, enableToolTip }) => {
        const [itemHtml, setItemHtml] = useState(null);
        const [isLoading, setIsLoading] = useState(false);
        const [hovered, setHovered] = useState(false);
        const [tooltipStyle, setTooltipStyle] = useState({ top: 0, left: 0 });
        const wrapperRef = useRef(null);
        const tooltipRef = useRef(null);

        const handleMouseEnter = async () => {
            if (!enableToolTip) return;
            setHovered(true);
            if (!itemHtml && !isLoading && item?.eq_item_id) {
                setIsLoading(true);
                const html = await getItemInfo(item.eq_item_id);
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
                id="non-clickable-cell" 
                className={enableToolTip ? "tooltip-wrapper" : ""}
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
            >
                <Box sx={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <img 
                        id="item-icon" 
                        src={`${IMAGE_PATH}/item_${item?.icon_id}.png`} 
                        alt={'null'} 
                    />
                    <Box sx={{ color: '#fff', fontWeight: 500 }}>
                        {item?.name}
                    </Box>
                </Box>
                {enableToolTip && hovered && itemHtml && (
                    <div 
                        ref={tooltipRef}
                        className="tooltip-content"
                        style={tooltipStyle}
                        dangerouslySetInnerHTML={{ __html: itemHtml }} 
                    />
                )}
                {enableToolTip && hovered && !itemHtml && isLoading && (
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
    };

    const getItemAwardedRows = data => {
        return data.map((row, i) => {
            const styles21Day = get21DayStyles(row);
            // Removed getRowStyles to eliminate colored borders for cleaner, minimalistic appearance
            const rowStyles = styles21Day;
            return (
                <TableRow key={i} sx={rowStyles}>
                    <ItemNameCell item={row?.item} enableToolTip={enableToolTip} />
                    {getLinkCell(row?.player?.name, `/player/${row?.player?.id}`)}
                    {getLinkCell(row?.raid?.name, `/raid/${row?.raid?.id}`)}
                    <TableCell id="non-clickable-cell" sx={{ color: '#9ca3af', whiteSpace: 'nowrap' }}>
                        {row?.raid?.created_at}
                    </TableCell>
                    {getLootTypeBadgeCell(getLootType(row))}
                </TableRow>
            );
        });
    };

    // Null vals means col is not sortable (frontend table sorting)
    const headerMap = {
        Name: 'item.name',
        Player: 'player.name',
        Raid: 'raid.name',
        Date: 'raid.created_at',
        Type: null,
    };

    if (data.length === 0) return <>No items found.</>;

    return (
        <TableList
            headerMap={headerMap}
            data={data}
            getTableRows={getItemAwardedRows}
            styledRows={styledRows}
            dataTestId={dataTestId}
            {...rest}
        />
    );
}
