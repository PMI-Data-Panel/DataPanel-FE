import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface ImageCarouselProps {
  images: string[];
}

const ImageCarousel = ({ images }: ImageCarouselProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);

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
    <div className="relative w-full mx-auto px-4 mt-8">
      {/* 이미지 컨테이너 */}
      <div className="flex items-center justify-center gap-8">
        {/* 왼쪽 이미지 (작게) */}
        <div className="transition-all duration-500 opacity-40 hover:opacity-60">
          <img
            src={images[getImageIndex(-1)]}
            className="w-48 h-36 md:w-64 md:h-48 object-cover rounded-lg shadow-md"
            alt="이전 이미지"
          />
        </div>

        {/* 중앙 이미지 (크게) */}
        <div className="transition-all duration-500 scale-110 z-10">
          <img
            src={images[currentIndex]}
            className="w-64 h-48 md:w-96 md:h-72 object-cover rounded-lg shadow-2xl"
            alt="현재 이미지"
          />
        </div>

        {/* 오른쪽 이미지 (작게) */}
        <div className="transition-all duration-500 opacity-40 hover:opacity-60">
          <img
            src={images[getImageIndex(1)]}
            className="w-48 h-36 md:w-64 md:h-48 object-cover rounded-lg shadow-md"
            alt="다음 이미지"
          />
        </div>
      </div>

      {/* 왼쪽 버튼 */}
      <button
        onClick={goToPrevious}
        className="absolute left-4 top-1/2 -translate-y-1/2 z-20 p-2 rounded-full bg-white/80 hover:bg-white shadow-lg transition-all"
        aria-label="이전 이미지"
      >
        <ChevronLeft size={15} className="text-gray-800" />
      </button>

      {/* 오른쪽 버튼 */}
      <button
        onClick={goToNext}
        className="absolute right-4 top-1/2 -translate-y-1/2 z-20 p-2 rounded-full bg-white/80 hover:bg-white shadow-lg transition-all"
        aria-label="다음 이미지"
      >
        <ChevronRight size={15} className="text-gray-800" />
      </button>

      {/* 하단에 어디있는지 표시용도 */}
      <div className="flex justify-center gap-2 mt-6">
        {images.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentIndex(index)}
            className={`w-2 h-2 rounded-full transition-all ${
              index === currentIndex
                ? "bg-blue-600 w-8"
                : "bg-gray-300 hover:bg-gray-400"
            }`}
            aria-label={`${index + 1}번 이미지로 이동`}
          />
        ))}
      </div>
    </div>
  );
};

export default ImageCarousel;
