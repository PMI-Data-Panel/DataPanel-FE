import LandingText from "../components/common/LandingText";
import SearchForm from "../components/SearchPage/SearchForm";
import Sidebar from "../components/SearchPage/Sidebar";
import MobileSidebar from "../components/SearchPage/MobileSidebar";
import { useSearch } from "../hooks/useSearch";
import usePostSearch from "../hooks/queries/usePostSearch";
import { useNavigate } from "react-router-dom";
import { useEffect, useRef } from "react";
import Loading from "../components/SearchPage/Loading";
import SearchKeywords from "../components/SearchPage/SearchKeywords";

// 예시 검색 키워드
const example1 = "서울에 사는 ott 구독자";
const example2 = "술담배 좋아하는 30대";

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

    // 검색어를 context에 저장
    await setQuery(searchQuery);

    // 검색 내역에 추가
    addSearchHistory(searchQuery);

    // API 호출 (첫 페이지, 페이지 크기 30000 - 전체 데이터를 받아옴)
    const requestBody = { 
      query: searchQuery, 
      use_vector_search: true, 
      page: 1,
      page_size: 30000
    };
    console.log("🔴 SearchPage - 요청 Body:", JSON.stringify(requestBody, null, 2));
    console.log("🔴 SearchPage - page_size 값:", requestBody.page_size);
    mutate(requestBody);
  };

  return (
    <div className="flex h-screen bg-gray-50 relative w-full max-w-full overflow-hidden">
      {/* 좌측에 호버하면 나오는 사이드바 (데스크탑만) */}
      <div className="hidden md:block">
        <Sidebar open={true} />
      </div>

      {/* 검색중이라면 로딩화면 */}
      {isPending ? (
        <Loading />
      ) : (
        // 검색 메인화면
        <div className="flex-1 flex items-center justify-center overflow-hidden md:overflow-auto">
          <div className="flex flex-col items-center justify-center w-full px-4 md:px-8 lg:px-10 -mt-10 md:-mt-16">
            {/* 검색 메인창 타이틀 */}
            <LandingText
              titleText1="패널 분석 AI"
              subText1="분석하고 싶은 패널 조건을 자연어로 입력하세요."
              titleTextSize="4xl"
              subTextSize="md"
            />

            {/* 검색 폼 */}
            <div className="w-full max-w-2xl mt-8 md:mt-10 lg:mt-13">
              <SearchForm
                searchQuery={query}
                setSearchQuery={setQuery}
                onSearch={handleSearch}
                isSearching={isPending}
              />
            </div>

            {/* 예시 검색 키워드 */}
            <div className="mt-3 flex justify-center gap-3">
              <SearchKeywords
                placeholder={example1}
                setKeyword={() => setQuery(example1)}
              />
              <SearchKeywords
                placeholder={example2}
                setKeyword={() => setQuery(example2)}
              />
            </div>

            {/* 모바일 사이드바 (검색 히스토리) */}
            <MobileSidebar />
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchPage;
