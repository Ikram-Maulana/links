"use client";

import { useState, type FC } from "react";

interface UserAgentAccordionProps {
  userAgent: string;
}

const UserAgentAccordion: FC<UserAgentAccordionProps> = ({ userAgent }) => {
  const [isClicked, setIsClicked] = useState(false);
  const displayUserAgent = isClicked
    ? userAgent
    : userAgent.length > 50
      ? `${userAgent.substring(0, 50)}...`
      : userAgent;

  return (
    <span onClick={() => setIsClicked(!isClicked)} className="cursor-pointer">
      {displayUserAgent}
    </span>
  );
};

export default UserAgentAccordion;
