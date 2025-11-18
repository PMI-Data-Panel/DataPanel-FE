import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
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
    <div className="bg-blue-50 rounded-lg shadow-sm p-3 md:p-6 w-full max-w-full overflow-hidden">
      {title && (
        <h3 className="text-base md:text-lg font-semibold text-gray-900 mb-2 md:mb-4">
          {title}
        </h3>
      )}
      <ResponsiveContainer width="100%" height={300} maxHeight={500}>
        <AreaChart
          data={data}
          margin={{
            top: 10,
            right: 10,
            left: 0,
            bottom: 0,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
          <XAxis
            dataKey={xAxisKey}
            stroke="#6b7280"
            style={{ fontSize: "11px" }}
            angle={-15}
            textAnchor="end"
            height={60}
          />
          <YAxis width={50} stroke="#6b7280" style={{ fontSize: "11px" }} />
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
      </ResponsiveContainer>
    </div>
  );
};

export default AreaChartComponent;
