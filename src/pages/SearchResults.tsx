import usePollingSearch from "../hooks/queries/usePollingSearch";
import { useSearch } from "../hooks/useSearch";
import NotFoundPage from "./NotFoundPage";
import SearchLoading from "../components/SearchPage/SearchLoading";

const SearchResults = () => {
  const { query } = useSearch();
  const { data, isError, isSuccess, isPending } = usePollingSearch();

  // 에러 발생 시 NotFoundPage 표시
  if (isError) {
    return <NotFoundPage />;
  }

  if (isPending) {
    return <SearchLoading query={query} />;
  }

  return (
    <div className="min-h-screen w-full">
      {isSuccess && data && data.state === "SUCCESS" && (
        <div>
          {`총 ${data.result.results.length}개 패널이 검색되었습니다.`}
          {/* 검색 결과 표시 컴포넌트 */}
          <h1 className="text-2xl font-bold mb-4">검색 결과</h1>
          <pre className="bg-gray-100 p-4 rounded text-xs overflow-x-auto">
            {JSON.stringify(data.result, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
};

export default SearchResults;
