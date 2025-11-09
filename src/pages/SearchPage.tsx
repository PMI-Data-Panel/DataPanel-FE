import LandingText from "../components/common/LandingText";
import SearchForm from "../components/SearchPage/SearchForm";
import Sidebar from "../components/SearchPage/Sidebar";
import { useSearch } from "../hooks/useSearch";
import usePostSearch from "../hooks/queries/usePostSearch";
import { useNavigate } from "react-router-dom";
import { useEffect, useRef } from "react";

const SearchPage = () => {
  const { query, setQuery, task_id } = useSearch();
  const { mutate, isPending, isSuccess, reset } = usePostSearch();
  const navigate = useNavigate();
  const isInitialized = useRef(false);

  // 페이지 마운트 시 한 번만 검색어 초기화
  useEffect(() => {
    if (!isInitialized.current) {
      setQuery("");
      isInitialized.current = true;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSearch = async (searchQuery: string) => {
    console.log("사용자가 입력한 검색어: ", searchQuery);
    // 전에 성공했었다면 리셋
    if (isSuccess) {
      reset();
    }
    mutate({ query: searchQuery });
  };

  useEffect(() => {
    // mutate가 성공하고, 그로 인해 task_id가 생겼다면 로딩페이지로 navigate
    if (isSuccess && task_id) {
      navigate(`/search/status/${task_id}`); // 백엔드 api 개발 이후, status_url로 변경 예정
    }
  }, [isSuccess, task_id, navigate]);

  return (
    <div className="flex min-h-screen bg-gray-50 relative">
      {/* 좌측에 호버하면 나오는 사이드바 */}
      <Sidebar />

      {/* 검색 메인화면 */}
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
    </div>
  );
};

export default SearchPage;
