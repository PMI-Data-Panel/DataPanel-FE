import { useState } from "react";
import Button from "../components/common/Button";
import InputForm from "../components/common/InputForm";
import LandingText from "../components/common/LandingText";

const SearchPage = () => {
  const [search, setSearch] = useState("");

  return (
    <div className="flex flex-col p-10 mt-10 gap-10">
      <LandingText
        titleText1="실제 사람들에게서"
        titleTextSpan="새로운 인사이트"
        titleTextBack="를 발견하세요"
        subText1="포괄적인 소비자 데이터와 행동 인사이트를 활용하여"
        subText2="비즈니스 의사결정에 확신을 더하세요."
      />
      {/* <div className="p-8 bg-blue-200 rounded-3xl shadow-md inset-shadow-2xl">
        <div className="flex items-center gap-2">
          <Search size={25} />
          <span className="text-xl font-bold">응답자 검색</span>
        </div>        
      </div> */}

      <InputForm
        type="search"
        setValue={() => setSearch(search)}
        labelOnOff={false}
      />

      <div className="flex flex-col justify-center items-center text-sm text-gray-600 mt-4 gap-2">
        <div>이런 검색어로 시작해보세요</div>
        <div className="space-x-2">
          <Button
            variant="secondary"
            text="서울 중구에 사는 전문직 여성"
            size="sm"
          />
          <Button
            variant="secondary"
            text="1980년생이고 미혼인 20대"
            size="sm"
          />
        </div>
      </div>
    </div>
  );
};

export default SearchPage;
