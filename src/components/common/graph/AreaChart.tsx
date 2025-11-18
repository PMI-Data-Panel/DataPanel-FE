import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";
import type { Distribution } from "../../../types/search";

interface AreaChartComponentProps {
  data: Distribution[];
  title?: string;
  dataKey?: string;
  xAxisKey?: string;
  color?: string;
  areaType?: "monotone" | "linear" | "step";
}

const AreaChartComponent = ({
  data,
  title,
  dataKey = "value",
  xAxisKey = "label",
  color = "#3b82f6",
  areaType = "monotone",
}: AreaChartComponentProps) => {
  return (
    <div className="bg-blue-50 rounded-lg shadow-sm p-6">
      {title && (
        <h3 className="text-lg font-semibold text-gray-900 mb-4">{title}</h3>
      )}
      <AreaChart
        style={{
          width: "100%",
          maxWidth: "700px",
          maxHeight: "70vh",
          aspectRatio: 1.618,
        }}
        data={data}
        margin={{
          top: 20,
          right: 30,
          left: 0,
          bottom: 0,
        }}
      >
        <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
        <XAxis
          dataKey={xAxisKey}
          stroke="#6b7280"
          style={{ fontSize: "12px" }}
        />
        <YAxis width={60} stroke="#6b7280" style={{ fontSize: "12px" }} />
        <Tooltip
          contentStyle={{
            backgroundColor: "#fff",
            border: "1px solid #e5e7eb",
            borderRadius: "0.5rem",
            padding: "8px 12px",
          }}
        />
        <Area
          type={areaType}
          dataKey={dataKey}
          stroke={color}
          fill={color}
          fillOpacity={0.6}
        />
      </AreaChart>
    </div>
  );
};

export default AreaChartComponent;
