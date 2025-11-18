import AreaChart from "../components/common/graph/AreaChart";
import BarChart from "../components/common/graph/BarChart";
import PieChart from "../components/common/graph/PieChart";
import TreeMap from "../components/common/graph/TreeMap";
import useGetVisualization from "../hooks/queries/useGetVisualization";

const DataPage = () => {
  const { data } = useGetVisualization();

  console.log(data);

  return (
    <div className="min-h-screen w-full max-w-full overflow-x-hidden">
      <div className="flex items-center justify-center my-8 md:my-15 px-4 text-2xl md:text-3xl font-bold">
        전체 패널 데이터
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-5 px-3 md:px-5 py-5">
        {data?.gender_distribution ? (
          <PieChart data={data.gender_distribution} title="성별" />
        ) : null}
        {data?.drinker_distribution ? (
          <PieChart data={data.drinker_distribution} title="음주" />
        ) : null}
        {data?.smoker_distribution ? (
          <PieChart data={data.smoker_distribution} title="흡연" />
        ) : null}
        {data?.vehicle_distribution ? (
          <PieChart data={data.vehicle_distribution} title="차량 보유" />
        ) : null}
        {data?.marital_status_distribution ? (
          <PieChart data={data.marital_status_distribution} title="결혼" />
        ) : null}
        {data?.age_distribution ? (
          <BarChart data={data.age_distribution} title="연령대" />
        ) : null}
        {data?.family_size_distribution ? (
          <BarChart data={data.family_size_distribution} title="가족수" />
        ) : null}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-5 px-3 md:px-5 pb-5">
        {data?.region_distribution ? (
          <TreeMap data={data.region_distribution} title="거주지" />
        ) : null}
        {data?.income_distribution ? (
          <AreaChart data={data.income_distribution} title="수입" />
        ) : null}
      </div>
    </div>
  );
};

export default DataPage;
