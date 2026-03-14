import { useEffect, useRef, useState } from 'react';
import { Box, TableCell } from '@mui/material';
import { IMAGE_PATH } from '../config.js';
import { fixLinks, getItemInfo } from '../views/utils.jsx';

export const ItemToolTip = ({ item, isCell = true }) => {
    const [itemHtml, setItemHtml] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [hovered, setHovered] = useState(false);
    const [tooltipStyle, setTooltipStyle] = useState({ top: 0, left: 0 });
    const wrapperRef = useRef(null);
    const tooltipRef = useRef(null);

    const handleMouseEnter = async () => {
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

    // Means to determine if we wanna render this in tables or Magelo UI page.
    const Wrapper = isCell ? TableCell : Box;

    return (
        <Wrapper
            ref={wrapperRef}
            id="non-clickable-cell"
            className={'tooltip-wrapper'}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
        >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <img id="item-icon" src={`${IMAGE_PATH}/item_${item?.icon_id}.png`} alt={'null'} />
                {isCell && <Box sx={{ color: '#fff', fontWeight: 500 }}>{item?.name}</Box>}
            </Box>
            {hovered && itemHtml && (
                <div
                    ref={tooltipRef}
                    className="tooltip-content"
                    style={tooltipStyle}
                    dangerouslySetInnerHTML={{ __html: itemHtml }}
                />
            )}
            {hovered && !itemHtml && isLoading && (
                <div ref={tooltipRef} className="tooltip-content" style={tooltipStyle}>
                    Loading...
                </div>
            )}
        </Wrapper>
    );
};
