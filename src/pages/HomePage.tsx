import { useNavigate } from "react-router-dom";
import Button from "../components/common/Button";
import LandingText from "../components/common/LandingText";

const HomePage = () => {
  const navigate = useNavigate();

  return (
    <>
      <div className="flex flex-col items-center justify-center space-y-10 mt-20">
        {/* 랜딩페이지 중앙 홍보문구 */}
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
      </div>
    </>
  );
};

export default HomePage;
