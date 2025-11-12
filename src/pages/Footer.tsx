const Footer = () => {
  return (
    <>
      <footer className=" bg-gray-900 text-white scroll-py-80">
        <div className="mx-auto px-10">
          <div className="grid grid-cols-3 gap-10 py-5">
            <div>
              <h3 className="font-bold mb-4">Sniffle</h3>
              <p className="text-sm text-gray-400">
                종합적인 소비자 인사이트와 데이터 분석을 통해 기업이 정보에
                입각한 의사 결정을 내리고 성장을 촉진할 수 있도록 지원합니다.
              </p>
            </div>

            <div>
              <h4 className="font-bold mb-4">BE & DB</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li>OpenSearch</li>
                <li>Qdrant</li>
                <li>Fast API</li>
                <li>RRF</li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold mb-4">FE</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li>React</li>
                <li>Tailwindcss</li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-800 text-center text-sm text-gray-400 py-3">
            © 2025 Sniffle, All rights reserved.
          </div>
        </div>
      </footer>
    </>
  );
};

export default Footer;
