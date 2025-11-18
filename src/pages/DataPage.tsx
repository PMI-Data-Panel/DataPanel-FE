import useGetVisualization from "../hooks/queries/useGetVisualization";

const DataPage = () => {
  const { data } = useGetVisualization();

  console.log(data);

  return (
    <div className="min-h-screen">
      <div className="flex items-center justify-center mt-15 text-3xl font-bold">
        전체 패널 데이터
      </div>
      <div>
        {data?.gender_distribution.map((result, idx) => (
          <div key={idx}>
            {" "}
            {result.label}: {result.percentage}
          </div>
        ))}
      </div>
    </div>
  );
};

export default DataPage;
