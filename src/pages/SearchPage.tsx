import LandingText from "../components/common/LandingText";
import SearchForm from "../components/SearchPage/SearchForm";
import Sidebar from "../components/SearchPage/Sidebar";
import { useSearch } from "../hooks/useSearch";
import usePostSearch from "../hooks/queries/usePostSearch";
import { useNavigate } from "react-router-dom";
import { useEffect, useRef } from "react";
import Loading from "../components/SearchPage/Loading";

const SearchPage = () => {
  const { query, setQuery, addSearchHistory, setSearchResults } = useSearch();
  const { mutate, isPending, isSuccess, data, reset } = usePostSearch();
  const navigate = useNavigate();
  const isInitialized = useRef(false);

  // 페이지 마운트시 검색어 초기화
  useEffect(() => {
    if (!isInitialized.current) {
      setQuery("");
      isInitialized.current = true;
    }
  }, [setQuery]);

  // 검색 성공 시 결과를 context에 저장하고 페이지 이동
  useEffect(() => {
    if (isSuccess && data) {
      console.log("🔴 검색 성공, 결과 저장 후 navigate", data);
      setSearchResults(data);
      navigate("/search/results");
    }
  }, [isSuccess, data, setSearchResults, navigate]);

  const handleSearch = async (searchQuery: string) => {
    console.log("🔴 사용자가 입력한 검색어: ", searchQuery);
    // 전에 성공했었다면 리셋
    if (isSuccess) {
      reset();
    }

    // 검색 내역에 추가
    addSearchHistory(searchQuery);

    mutate({ query: query, use_vector_search: true, page: 1 });
  };

  return (
    <div className="flex min-h-screen bg-gray-50 relative">
      {/* 좌측에 호버하면 나오는 사이드바 */}
      <Sidebar />

      {/* 검색중이라면 로딩화면 */}
      {isPending ? (
        <Loading />
      ) : (
        // 검색 메인화면
        <div className="flex-1 flex flex-col transition-all duration-300">
          <div className="flex-1 flex flex-col items-center mt-60 px-10">
            {/* 검색 메인창 타이틀 */}
            <LandingText
              titleText1="패널 분석 AI"
              subText1="분석하고 싶은 패널 조건을 자연어로 입력하세요."
              titleTextSize="4xl"
              subTextSize="md"
            />

            {/* 검색 폼 */}
            <div className="w-full max-w-2xl mt-13">
              <SearchForm
                searchQuery={query}
                setSearchQuery={setQuery}
                onSearch={handleSearch}
                isSearching={isPending}
              />
              <p className="text-xs text-gray-500 mt-5 text-center">
                '20대 여성 중 냉장고 보유자'와 같이 입력해 보세요.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchPage;
