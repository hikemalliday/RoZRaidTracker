import { useEffect, useMemo, useRef, useState } from 'react';
import { useScreenshotsList } from '../hooks/requests.js';
import { Typography } from '@mui/material';


function ImageItem({ src }) {
    const [visible, setVisible] = useState(false);
    const ref = useRef(null);

    useEffect(() => {
        const obs = new IntersectionObserver(([entry]) => {
            if (entry.isIntersecting) {
                setVisible(true);
                obs.disconnect();
            }
        });

        obs.observe(ref.current);
        return () => obs.disconnect();
    }, []);

    return <div ref={ref}>{visible && <img src={src} />}</div>;
}

export function Screenshots() {
    const { data: screenshotsList, isPending, error } = useScreenshotsList();
    const loadMoreRef = useRef(null);

    const PAGE_SIZE = 5;
    const S3_ASSETS_URL = import.meta.env.VITE_S3_ASSETS_URL;
    const s3ImageUrls = (screenshotsList ?? []).map((screenshot) => {
       return `${S3_ASSETS_URL}/${screenshot.object_key}`;
    });

    const [page, setPage] = useState(1);

    const visibleImages = useMemo(
        () => s3ImageUrls.slice(0, page * PAGE_SIZE),
        [page, s3ImageUrls]
    );

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setPage(p => p + 1);
                }
            },
            {
                rootMargin: '200px', // preload before reaching bottom
            }
        );

        if (loadMoreRef.current) observer.observe(loadMoreRef.current);

        return () => observer.disconnect();
    }, []);

    if (isPending) return <Typography>Loading screenshots...</Typography>;
    if (error) return <Typography>Could not load screenshots.</Typography>;
    if (s3ImageUrls.length === 0) return <Typography>No screenshots have been uploaded yet.</Typography>;
    return (
        <>
            {visibleImages.map(src => (
                <ImageItem key={src} src={src} />
            ))}
            <div ref={loadMoreRef} />
        </>
    );
}
