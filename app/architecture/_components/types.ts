export type ThemeMode = "dark" | "light";

export type DataLayer = "atmosphere" | "ocean" | "ice" | "biosphere";

export type TimeRange = "24h" | "7d" | "30d";

export type EonetEvent = {
  id: string;
  title: string;
  link?: string;
  categories: string[];
  status?: string;
  updatedAt?: string;
  geometryDate?: string;
};

export type Product = {
  name: string;
  version: string;
  desc: string;
  tags: string[];
  accent: "green" | "blue" | "orange" | "cyan";
  icon: "bezier" | "nexus" | "pulsar" | "gridos";
};
