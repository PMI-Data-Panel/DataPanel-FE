import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface ImageCarouselProps {
  images: string[];
  autoPlayInterval?: number; // 자동 재생 간격 (ms)
}

const ImageCarousel = ({
  images,
  autoPlayInterval = 3500,
}: ImageCarouselProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  // 자동 슬라이드 기능
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prevIndex) =>
        prevIndex === images.length - 1 ? 0 : prevIndex + 1
      );
    }, autoPlayInterval);

    // 컴포넌트 언마운트 시 타이머 정리
    return () => clearInterval(timer);
  }, [images.length, autoPlayInterval]);

  const goToPrevious = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? images.length - 1 : prevIndex - 1
    );
  };

  const goToNext = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === images.length - 1 ? 0 : prevIndex + 1
    );
  };

  const getImageIndex = (offset: number) => {
    const index = currentIndex + offset;
    if (index < 0) return images.length + index;
    if (index >= images.length) return index - images.length;
    return index;
  };

  return (
    <div className="relative w-full max-w-full py-5 mx-auto px-2 md:px-4 md:py-10 mt-4 md:mt-8 overflow-hidden">
      {/* 이미지 컨테이너 */}
      <div className="flex items-center justify-center gap-2 md:gap-4 lg:gap-8">
        {/* 왼쪽 이미지 (작게) */}
        <div className="transition-all duration-700 ease-in-out opacity-40 hover:opacity-60 flex-shrink-0 transform">
          <img
            src={images[getImageIndex(-1)]}
            className="w-25 h-18 sm:w-32 sm:h-24 md:w-48 md:h-36 lg:w-64 lg:h-48 object-cover rounded-md md:rounded-lg shadow-md transition-all duration-700 ease-in-out"
            alt="이전 이미지"
          />
        </div>

        {/* 중앙 이미지 (크게) */}
        <div className="transition-all duration-700 ease-in-out scale-105 md:scale-110 z-10 flex-shrink-0 transform">
          <img
            src={images[currentIndex]}
            className="w-35 h-28 sm:w-48 sm:h-36 md:w-64 md:h-48 lg:w-96 lg:h-72 object-cover rounded-md md:rounded-lg shadow-xl md:shadow-2xl transition-all duration-700 ease-in-out"
            alt="현재 이미지"
          />
        </div>

        {/* 오른쪽 이미지 (작게) */}
        <div className="transition-all duration-700 ease-in-out opacity-40 hover:opacity-60 flex-shrink-0 transform">
          <img
            src={images[getImageIndex(1)]}
            className="w-25 h-18 sm:w-32 sm:h-24 md:w-48 md:h-36 lg:w-64 lg:h-48 object-cover rounded-md md:rounded-lg shadow-md transition-all duration-700 ease-in-out"
            alt="다음 이미지"
          />
        </div>
      </div>

      {/* 왼쪽 버튼 */}
      <button
        onClick={goToPrevious}
        className="absolute left-1 md:left-4 top-1/2 -translate-y-1/2 z-20 p-1.5 md:p-2 rounded-full bg-white/80 hover:bg-white shadow-lg transition-all"
        aria-label="이전 이미지"
      >
        <ChevronLeft
          size={15}
          className="w-3 h-3 md:w-4 md:h-4 text-gray-800"
        />
      </button>

      {/* 오른쪽 버튼 */}
      <button
        onClick={goToNext}
        className="absolute right-1 md:right-4 top-1/2 -translate-y-1/2 z-20 p-1.5 md:p-2 rounded-full bg-white/80 hover:bg-white shadow-lg transition-all"
        aria-label="다음 이미지"
      >
        <ChevronRight
          size={15}
          className="w-3 h-3 md:w-4 md:h-4 text-gray-800"
        />
      </button>

      {/* 하단에 어디있는지 표시용도 */}
      <div className="flex justify-center gap-1.5 md:gap-2 mt-4 md:mt-6">
        {images.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentIndex(index)}
            className={`h-1.5 md:h-2 rounded-full transition-all ${
              index === currentIndex
                ? "bg-blue-600 w-6 md:w-8"
                : "w-1.5 md:w-2 bg-gray-300 hover:bg-gray-400"
            }`}
            aria-label={`${index + 1}번 이미지로 이동`}
          />
        ))}
      </div>
    </div>
  );
};

export default ImageCarousel;
