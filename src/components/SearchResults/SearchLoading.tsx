const SearchLoading = ({ query }: { query: string }) => {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50">
      <div className="text-3xl font-medium text-gray-800">
        "{query || ""}"에 매칭되는 패널을 찾는 중
        <span className="inline-flex ml-1 text-4xl">
          <span className="animate-wave-1">.</span>
          <span className="animate-wave-2">.</span>
          <span className="animate-wave-3">.</span>
        </span>
      </div>
    </div>
  );
};

export default SearchLoading;
