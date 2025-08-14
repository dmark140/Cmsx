"use client";
import React, { createContext, useContext, useState, ReactNode } from "react";
// Define the shape of your global state
type GlobalContextType = {
  user: string;
  setUser: (user: string) => void;
  type: string;
  settype: (type: string) => void;
  ID: number;
  setID: (type: number) => void;

  FormIdRequested: number;
  setFormIdRequested: (type: number) => void;


  EvaluationId: number;
  setEvaluationId: (type: number) => void;



  loading: boolean;
  setloading: (type: boolean) => void;
};
// Provide default values (can be empty strings or undefined if optional)
const GlobalContext = createContext<GlobalContextType>({
  user: "",
  setUser: () => { },
  type: "",
  settype: () => { },
  ID: 0,
  setID: () => { },
  FormIdRequested: 0,
  setFormIdRequested: () => { },
  EvaluationId: 0,
  setEvaluationId: () => { },
  loading: false,
  setloading: () => { },
});

// Wrap your app in this provider
export const GlobalProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState("");
  const [type, settype] = useState("");
  const [ID, setID] = useState(0);
  const [loading, setloading] = useState(false);
  const [EvaluationId, setEvaluationId] = useState(0);
  const [FormIdRequested, setFormIdRequested] = useState(0);
  return (
    <GlobalContext.Provider value={{ user, setUser, type, settype, ID, setID, FormIdRequested, setFormIdRequested, loading, setloading, EvaluationId, setEvaluationId, }}>
      {children}
    </GlobalContext.Provider>
  );
};

// Helper hook to use the context
export const useGlobalContext = () => useContext(GlobalContext);
