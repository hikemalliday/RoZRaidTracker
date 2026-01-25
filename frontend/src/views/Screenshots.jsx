import { useEffect, useMemo, useRef, useState } from 'react';

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

export function Screenshots({}) {
    const images = import.meta.glob('../screenshots/*.{jpg,jpeg,png}', { eager: true });
    const imageList = Object.values(images).map(m => m.default);
    const loadMoreRef = useRef(null);
    const PAGE_SIZE = 5;

    const [page, setPage] = useState(1);

    const visibleImages = useMemo(() => imageList.slice(0, page * PAGE_SIZE), [page, imageList]);

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

    return (
        <>
            {visibleImages.map(src => (
                <ImageItem key={src} src={src} />
            ))}

            <div ref={loadMoreRef} />
        </>
    );
}
