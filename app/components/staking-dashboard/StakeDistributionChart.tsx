import React, { useState } from "react";
import { Book } from "../../utils/programUtils";
import { PieChart, Pie, Cell, ResponsiveContainer, Sector } from "recharts";

interface StakeDistributionChartProps {
  selectedBook: Book;
}

const COLORS = ["#8ecae6", "#219ebc", "#023047", "#ffb703", "#fb8500"];

const StakeDistributionChart: React.FC<StakeDistributionChartProps> = ({
  selectedBook,
}) => {
  const [activeIndex, setActiveIndex] = useState(0);

  const prepareStakeDistributionData = (book: Book) => {
    return book.stakes.map((stake) => ({
      name: stake.staker.slice(0, 4) + "..." + stake.staker.slice(-4),
      value: stake.amount / 1e9, // Convert lamports to SOL
    }));
  };

  const renderActiveShape = (props: any) => {
    // ... (keep the existing renderActiveShape function)
  };

  const onPieEnter = (_: any, index: number) => {
    setActiveIndex(index);
  };

  return (
    <div className="mb-6 bg-white p-4 rounded-lg shadow-lg">
      <h3 className="text-lg font-semibold mb-2 text-[#1D3557]">
        Stake Distribution
      </h3>
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie
            activeIndex={activeIndex}
            activeShape={renderActiveShape}
            data={prepareStakeDistributionData(selectedBook)}
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={80}
            fill="#8884d8"
            dataKey="value"
            onMouseEnter={onPieEnter}
          >
            {prepareStakeDistributionData(selectedBook).map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={COLORS[index % COLORS.length]}
              />
            ))}
          </Pie>
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

export default StakeDistributionChart;
