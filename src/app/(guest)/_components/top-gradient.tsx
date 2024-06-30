import { type FC } from "react";

export const TopGradient: FC = () => {
  return (
    <div className="absolute inset-0 -z-10 max-w-none overflow-hidden">
      <div className="top-0 h-screen w-screen bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(120,119,198,0.3),rgba(255,255,255,0))]"></div>
    </div>
  );
};
