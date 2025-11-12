import Button from "../common/Button";

const AboutSniffle = () => {
  return (
    <>
      <div id="about">
        <section className="py-4 px-4 bg-gray-50">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-4">About Sniffle</h2>
            <p className="text-gray-600">
              온라인 패널 설문조사 데이터를 기업의 비즈니스 인사이트로 전환하는
              <br />
              데이터 분석 플랫폼입니다
            </p>
          </div>
        </section>

        <section className="py-10 px-20">
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-3xl font-bold mb-6">Our Mission</h2>
                <p className="text-gray-600 leading-relaxed mb-6">
                  DataPanel은 5,000명 이상의 온라인 패널로부터 수집된 35개
                  분야의 설문조사 응답 데이터를 분석하여, 다양한 기업체에게
                  시각적 분석 결과를 제공하는 데이터 분석 서비스입니다. 복잡한
                  설문조사 데이터를 직관적인 시각화로 변환하고, 기존 체크박스
                  방식 대신 자연어 기반 검색 시스템을 통해 높은 검색 정확도와
                  편리한 사용성을 제공합니다. 이를 통해 기업의 명확한 데이터
                  분석과 효과적인 의사결정을 지원합니다.
                </p>
                <Button variant="primary" text="자세히 보기" size="sm" />
              </div>
              <img
                src="/LandingPageImage.png"
                className="w-full h-auto rounded-2xl shadow-lg"
              />
            </div>
          </div>
        </section>
      </div>
    </>
  );
};

export default AboutSniffle;
