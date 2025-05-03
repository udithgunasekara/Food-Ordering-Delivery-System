import React from 'react';
import { LucideIcon } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  change: string;
  isPositive: boolean;
}

const StatCard: React.FC<StatCardProps> = ({ title, value, icon, change, isPositive }) => {
  return (
    <div className="bg-white rounded-lg shadow-md p-5">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-gray-500 text-sm">{title}</p>
          <h3 className="text-2xl font-bold mt-1">{value}</h3>
          <p className={`text-sm mt-1 ${isPositive ? 'text-green-500' : 'text-red-500'}`}>
            {isPositive ? '+' : '-'}{change} from previous period
          </p>
        </div>
        <div className="p-3 bg-blue-100 rounded-lg">
          {icon}
        </div>
      </div>
    </div>
  );
};

export default StatCard;