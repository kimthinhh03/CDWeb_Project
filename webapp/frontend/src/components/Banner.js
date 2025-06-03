import React, { useState, useEffect, useRef } from 'react';
import '../css/Banner.css';

const bannerImages = [
    '../img/banner_1.jpg',
    '../img/banner_2.jpg',
    '../img/banner_3.jpg',

];

const Banner = () => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isPlaying, setIsPlaying] = useState(true);
    const intervalRef = useRef(null);

    useEffect(() => {
        if (isPlaying) {
            intervalRef.current = setInterval(() => {
                setCurrentIndex((prev) => (prev + 1) % bannerImages.length);
            }, 5000);
        }
        return () => clearInterval(intervalRef.current);
    }, [isPlaying]);

    const goToPrevious = () => {
        setCurrentIndex((prev) =>
            prev === 0 ? bannerImages.length - 1 : prev - 1
        );
    };

    const goToNext = () => {
        setCurrentIndex((prev) => (prev + 1) % bannerImages.length);
    };

    const togglePlay = () => setIsPlaying((prev) => !prev);

    return (
        <div className="banner-container">
            <div
                className="banner-slider"
                style={{
                    transform: `translateX(-${currentIndex * 100}%)`,
                }}
            >
                {bannerImages.map((img, index) => (
                    <img
                        key={index}
                        src={img}
                        alt={`Banner ${index + 1}`}
                        className="banner-image"
                    />
                ))}
            </div>

            <div className="banner-controls-wrapper">
                <div className="banner-controls">
                    <button onClick={goToPrevious} className="circle-button">‹</button>
                    <span className="slide-indicator">
            {currentIndex + 1} / {bannerImages.length}
          </span>
                    <button onClick={goToNext} className="circle-button">›</button>
                </div>
                <button onClick={togglePlay} className="pause-button">
                    {isPlaying ? '❚❚' : '▶'}
                </button>
            </div>
        </div>
    );
};
export default Banner;