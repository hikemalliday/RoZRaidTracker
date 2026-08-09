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

export function Screenshots() {
    const images = import.meta.glob('../screenshots/*.{jpg,jpeg,png,webp}', { eager: true });
    const imageList = Object.values(images).map(m => m.default);
    const loadMoreRef = useRef(null);
    const PAGE_SIZE = 5;

    const [imageListState, setImageListState] = useState(imageList);
    const [page, setPage] = useState(1);

    useEffect(() => {
        // Randomize images list (Fisher-Yates shuffle)
        // Note that Math.random() always returns a num from 0 to 1, exclusive. Its going to be either a zero or a decimal val, but NEVER 1.
        // We loop backwards down the array, in order to not swap elements twice. I think this has to do with the fact that
        // Math.floor() is always 0 - 1, but im not 100% sure.
        setImageListState(prev => {
            for (let i = prev.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [prev[i], prev[j]] = [prev[j], prev[i]];
            }
            return prev;
        });
    }, []);

    const visibleImages = useMemo(
        () => imageListState.slice(0, page * PAGE_SIZE),
        [page, imageListState]
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

    return (
        <>
            {visibleImages.map(src => (
                <ImageItem key={src} src={src} />
            ))}

            <div ref={loadMoreRef} />
        </>
    );
}
