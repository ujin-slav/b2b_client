import { useState, useEffect } from 'react';
import noImage from "../icons/noImage.svg"
import MyImage from '../components/MyImage'

export default function HoverPreview({
    images,
    children,
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
            className="relative inline-block"
            onMouseEnter={() => { setIsHovered(true) }}
            onMouseLeave={() => {
                setIsHovered(false);
                setCurrentIndex(0); // сбрасываем на первую при уходе курсора
            }}
        >
            {children}

            {isHovered && (
                <div
                    className="position-absolute"
                >
                        <img
                            style={{ width: size, height: size }}
                            src={getSrc()}
                            className="object-contain rounded-5"
                        />

                    {limitedImages.length > 1 && (
                        <div
                            className="
                absolute bottom-0.5 right-0.5
                bg-black/60 text-white text-[9px] px-1 rounded
                leading-none
              "
                        >
                            {limitedImages.length > 4
                                ? `+${limitedImages.length - 1}`
                                : `${currentIndex + 1}/${limitedImages.length}`}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}