const Footer = () => {
  return (
    <>
      <footer className="bg-gray-900 text-white scroll-py-80 w-full max-w-full overflow-x-hidden">
        <div className="mx-auto px-4 md:px-6 lg:px-10">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 lg:gap-10 py-6 md:py-8 lg:py-10">
            {/* Sniffle */}
            <div className="text-center md:text-left">
              <h3 className="text-lg md:text-xl font-bold mb-3 md:mb-4">
                Sniffle
              </h3>
              <p className="text-xs text-left md:text-sm text-gray-400 leading-relaxed px-2 md:px-0">
                종합적인 소비자 인사이트와 데이터 분석을 통해 기업이 정보에
                입각한 의사 결정을 내리고 성장을 촉진할 수 있도록 지원합니다.
              </p>
            </div>

            <div className="grid grid-cols-2 md:">
              {/* BE & DB */}
              <div className="text-left px-5">
                <h4 className="text-base md:text-lg font-bold mb-3 md:mb-4">
                  BE & DB
                </h4>
                <ul className="space-y-1.5 md:space-y-2 text-xs md:text-sm text-gray-400">
                  <li>OpenSearch</li>
                  <li>Qdrant</li>
                  <li>Fast API</li>
                  <li>RRF</li>
                </ul>
              </div>

              {/* FE */}
              <div className="text-left px-5">
                <h4 className="text-base md:text-lg font-bold mb-3 md:mb-4">
                  FE
                </h4>
                <ul className="space-y-1.5 md:space-y-2 text-xs md:text-sm text-gray-400">
                  <li>React</li>
                  <li>Tailwindcss</li>
                </ul>
              </div>
            </div>
          </div>

          <div className="border-t border-gray-800 text-center text-xs md:text-sm text-gray-400 py-3 md:py-4">
            © 2025 Sniffle, All rights reserved.
          </div>
        </div>
      </footer>
    </>
  );
};

export default Footer;
