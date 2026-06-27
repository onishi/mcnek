import React from "react";

export const MapContainer = ({ children }: { children: React.ReactNode }) =>
  React.createElement("div", { "data-testid": "map-container" }, children);

export const TileLayer = () => null;

export const Marker = ({
  children,
  eventHandlers,
}: {
  children?: React.ReactNode;
  eventHandlers?: Record<string, () => void>;
  position?: [number, number];
  icon?: unknown;
}) => {
  void eventHandlers;
  return React.createElement("div", null, children);
};

export const Popup = ({ children }: { children: React.ReactNode }) =>
  React.createElement("div", null, children);
