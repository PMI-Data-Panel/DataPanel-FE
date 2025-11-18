import { useNavigate } from "react-router-dom";
import Button from "../common/Button";
import ImageCarousel from "../common/ImageCarousel";
import LandingText from "../common/LandingText";

const carouselImages = [
  "/LandingPageImage.png",
  "/LandingPageImage2.png",
  "/LandingPageImage3.png",
];

const LandingPage = () => {
  const navigate = useNavigate();

  return (
    <>
      <section className="flex flex-col items-center justify-center min-h-[66.67vh] lg:min-h-screen px-4 gap-5">
        <LandingText
          titleText1="AI 기반 패널데이터 검색으로"
          titleTextFront="시장의 "
          titleTextSpan="새로운 미래 비전"
          titleTextBack="을 탐색해보세요"
          subText1="통합 데이터 분석 솔루션과 컨설팅 서비스를 제공하여"
          subText2="고객의 비즈니스 의사 결정에 기여합니다."
        />

        <Button
          variant="primary"
          text="시작하기"
          onClick={() => navigate("/search")}
        />

        {/* 이미지 디스플레이용 */}
        <ImageCarousel images={carouselImages} />
      </section>
    </>
  );
};

export default LandingPage;
