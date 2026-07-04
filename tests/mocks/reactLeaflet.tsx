import React from "react";

export const MapContainer = ({ children }: { children: React.ReactNode }) =>
  React.createElement("div", { "data-testid": "map-container" }, children);

export const TileLayer = () => null;

export const Marker = ({
  children,
  eventHandlers,
  icon,
}: {
  children?: React.ReactNode;
  eventHandlers?: Record<string, () => void>;
  position?: [number, number];
  icon?: { options?: { className?: string } };
}) => {
  void eventHandlers;
  const iconClass = icon?.options?.className;
  return React.createElement(
    "div",
    iconClass ? { "data-icon-class": iconClass } : undefined,
    children,
  );
};

export const Popup = ({ children }: { children: React.ReactNode }) =>
  React.createElement("div", null, children);
