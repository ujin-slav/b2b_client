import { useState, useEffect } from 'react';
import noImage from "../icons/noImage.svg"
import MyImage from './MyImage'

export default function HoverPreviewBig({
    images,
    size = 60,
}) {
    const [isHovered, setIsHovered] = useState(false);
    const [currentIndex, setCurrentIndex] = useState(0);

    const limitedImages = images.slice(0, 5)
    // Авто-переключение только если фото ≤ 4 и есть hover
    useEffect(() => {
        if (!isHovered || limitedImages.length <= 1) {
            return;
        }

        const interval = setInterval(() => {
            setCurrentIndex((prev) => (prev + 1) % limitedImages.length);
        }, 1500);

        return () => clearInterval(interval);
    }, [isHovered, limitedImages.length]);

    const getSrc = () => {
        if (limitedImages?.length > 0) {
            return (
                process.env.REACT_APP_API_URL + `getpic/` + limitedImages[currentIndex]
            )
        } else {
            return (
                noImage
            )
        }
    }

    return (
        <div
            onMouseEnter={() => { setIsHovered(true) }}
            onMouseLeave={() => {
                setIsHovered(false);
                setCurrentIndex(0); 
            }}
        >
            <img
                style={{ width: size, height: size }}
                className='foto'
                src={getSrc()}
            />
        </div>
    );
}