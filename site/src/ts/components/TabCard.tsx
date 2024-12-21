import React from "react";

interface TabCardProps {
  children: React.ReactNode;
}

const TabCard = ({ children }: TabCardProps) => (
  <div className="border-start border-end border-bottom">{children}</div>
);

export default TabCard;
