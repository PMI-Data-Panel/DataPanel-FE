interface AdditionalSearchProps {
  additionalQuery: string;
  setAdditionalQuery: (query: string) => void;
  handleAdditionalSearch: () => void;
}

const AdditionalSearch = ({
  additionalQuery,
  setAdditionalQuery,
  handleAdditionalSearch,
}: AdditionalSearchProps) => {
  return (
    <>
      <div className="bg-white rounded-xl shadow-sm p-4 md:p-4">
        <h3 className="text-sm md:text-base font-bold text-[#191f28] mb-3 md:mb-3">
          이 패널들 중에서 추가 검색
        </h3>
        <div className="flex flex-col sm:flex-row gap-2 w-full">
          <input
            type="text"
            value={additionalQuery}
            onChange={(e) => setAdditionalQuery(e.target.value)}
            onKeyPress={(e) => {
              if (e.key === "Enter") {
                handleAdditionalSearch();
              }
            }}
            placeholder="예: '이 사람들 중 아이폰 사용자는?'"
            className="flex-1 px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3182f6] focus:border-[#3182f6] text-xs md:text-sm bg-white transition-all duration-200"
          />
          <button
            onClick={handleAdditionalSearch}
            className="w-full sm:w-auto px-4 py-2 bg-[#3182f6] text-white rounded-lg hover:bg-[#1b64da] transition-all duration-200 font-semibold whitespace-nowrap text-xs md:text-sm shadow-sm hover:shadow-md active:scale-[0.98]"
          >
            추가 분석
          </button>
        </div>
      </div>
    </>
  );
};

export default AdditionalSearch;
