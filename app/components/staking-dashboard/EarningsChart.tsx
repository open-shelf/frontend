import React, { useState } from "react";
import { Book } from "../../utils/programUtils";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Cell,
  ResponsiveContainer,
} from "recharts";
import { WalletContextState } from "@solana/wallet-adapter-react";

interface EarningsChartProps {
  selectedBook: Book;
  wallet: WalletContextState;
}

const COLORS = ["#8ecae6", "#219ebc", "#023047", "#ffb703", "#fb8500"];

const EarningsChart: React.FC<EarningsChartProps> = ({
  selectedBook,
  wallet,
}) => {
  const [sortByEarnings, setSortByEarnings] = useState(false);

  const prepareEarningsData = (book: Book) => {
    const data = book.stakes.map((stake) => ({
      name: stake.staker.slice(0, 4) + "..." + stake.staker.slice(-4),
      earnings: stake.earnings / 1e9, // Convert to SOL
    }));

    if (sortByEarnings) {
      data.sort((a, b) => b.earnings - a.earnings);
    }

    return data;
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow-lg">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold text-[#1D3557]">
          Earnings by Staker
        </h3>
        <button
          className="px-3 py-1 bg-[#457B9D] text-white rounded hover:bg-[#1D3557] transition-colors"
          onClick={() => setSortByEarnings(!sortByEarnings)}
        >
          {sortByEarnings ? "Sort by Staker" : "Sort by Earnings"}
        </button>
      </div>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart
          data={prepareEarningsData(selectedBook)}
          margin={{ top: 20, right: 30, left: 65, bottom: 5 }}
        >
          <XAxis
            dataKey="name"
            tick={{ fill: "#1D3557" }}
            axisLine={{ stroke: "#A8DADC" }}
            tickLine={{ stroke: "#A8DADC" }}
          />
          <YAxis
            tick={{ fill: "#1D3557" }}
            axisLine={{ stroke: "#A8DADC" }}
            tickLine={{ stroke: "#A8DADC" }}
            label={{
              value: "Earnings (SOL)",
              angle: -90,
              position: "insideLeft",
              fill: "#1D3557",
              offset: -50,
            }}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: "white",
              color: "#1D3557",
              border: "1px solid #A8DADC",
              borderRadius: "4px",
            }}
            formatter={(value: number) => [
              `${value.toFixed(4)} SOL`,
              "Earnings",
            ]}
          />
          <Bar
            dataKey="earnings"
            fill="#457B9D"
            animationDuration={1000}
            animationEasing="ease-out"
          >
            {prepareEarningsData(selectedBook).map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={COLORS[index % COLORS.length]}
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default EarningsChart;
