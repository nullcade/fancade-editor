import { createContext } from "react";

const fileContext = createContext<ArrayBuffer | null>(null);

export const FileProvider = fileContext.Provider;
export const FileContext = fileContext;