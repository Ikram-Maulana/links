import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { type FC, type ReactNode } from "react";

interface CardOverviewProps {
  title: string;
  value: number;
  icon: ReactNode;
}

export const CardOverview: FC<CardOverviewProps> = ({ title, value, icon }) => {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        {icon}
      </CardHeader>
      <CardContent>
        <div className="text-xl font-bold">{value}</div>
      </CardContent>
    </Card>
  );
};
