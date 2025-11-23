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
      <div className="bg-white rounded-3xl shadow-sm p-5 md:p-6">
        <h3 className="text-lg md:text-xl font-bold text-[#191f28] mb-4 md:mb-5">
          이 패널들 중에서 추가 검색
        </h3>
        <div className="flex flex-col sm:flex-row gap-3 w-full">
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
            className="flex-1 px-4 py-3 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#3182f6] focus:border-[#3182f6] text-sm md:text-base bg-white transition-all duration-200"
          />
          <button
            onClick={handleAdditionalSearch}
            className="w-full sm:w-auto px-6 py-3 bg-[#3182f6] text-white rounded-2xl hover:bg-[#1b64da] transition-all duration-200 font-semibold whitespace-nowrap text-sm md:text-base shadow-sm hover:shadow-md active:scale-[0.98]"
          >
            추가 분석
          </button>
        </div>
      </div>
    </>
  );
};

export default AdditionalSearch;
