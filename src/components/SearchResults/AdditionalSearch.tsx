//import usePostSearchRefine from "../../hooks/queries/usePostSearchRefine";

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
  //const { data, isPending } = usePostSearchRefine();

  return (
    <>
      <div className="bg-gray-50 rounded-lg p-3 md:p-6 border border-gray-200">
        <h3 className="text-base md:text-lg font-bold text-gray-900 mb-3 md:mb-4">
          이 패널들 중에서 추가 검색
        </h3>
        <div className="flex flex-col sm:flex-row gap-2 md:gap-3 w-full">
          <input
            type="text"
            value={additionalQuery}
            onChange={(e) => setAdditionalQuery(e.target.value)}
            onKeyPress={(e) => {
              if (e.key === "Enter") {
                handleAdditionalSearch();
              }
            }}
            placeholder="이 사람들 중 아이폰 사용자는?"
            className="flex-1 px-3 md:px-4 py-2 md:py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm md:text-base"
          />
          <button
            onClick={handleAdditionalSearch}
            className="w-full sm:w-auto px-3 md:px-6 py-2 md:py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium whitespace-nowrap text-sm md:text-base"
          >
            추가 분석
          </button>
        </div>
      </div>
    </>
  );
};

export default AdditionalSearch;
