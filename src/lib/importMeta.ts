export type ImportSourceMeta = {
  fetchedAt: string;
  count: number;
};

export type ImportMeta = {
  mlit: ImportSourceMeta | null;
  michinoeki: ImportSourceMeta | null;
};
