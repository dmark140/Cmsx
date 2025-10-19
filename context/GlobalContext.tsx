"use client";
import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";

type GlobalContextType = {
  user: string;
  setUser: (user: string) => void;
  userName: string;
  setUserName: (user: string) => void;
  type: string;
  settype: (type: string) => void;
  ID: number;
  setID: (id: number) => void;
  UserLevel: number;
  setUserLevel: (level: number) => void;
  FormIdRequested: number;
  setFormIdRequested: (id: number) => void;
  EvaluationId: number;
  setEvaluationId: (id: number) => void;
  loading: boolean;
  setloading: (state: boolean) => void;
};

const GlobalContext = createContext<GlobalContextType>({
  user: "",
  setUser: () => { },
  userName: "",
  setUserName: () => { },
  type: "",
  settype: () => { },
  ID: 0,
  setID: () => { },
  UserLevel: 0,
  setUserLevel: () => { },
  FormIdRequested: 0,
  setFormIdRequested: () => { },
  EvaluationId: 0,
  setEvaluationId: () => { },
  loading: false,
  setloading: () => { },
});

export const GlobalProvider = ({ children }: { children: ReactNode }) => {
  // Default states
  const [user, setUser] = useState("");
  const [userName, setUserName] = useState("");
  const [type, settype] = useState("");
  const [ID, setID] = useState(0);
  const [UserLevel, setUserLevel] = useState(0);
  const [FormIdRequested, setFormIdRequested] = useState(0);
  const [EvaluationId, setEvaluationId] = useState(0);
  const [loading, setloading] = useState(false);

  // Load saved values only on client
  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedUser = localStorage.getItem("user");
      const savedUserName = localStorage.getItem("userName");
      const savedType = localStorage.getItem("type");
      const savedID = localStorage.getItem("ID");
      const savedUserLevel = localStorage.getItem("UserLevel");
      const savedFormIdRequested = localStorage.getItem("FormIdRequested");
      const savedEvaluationId = localStorage.getItem("EvaluationId");

      if (savedUser) setUser(savedUser);
      if (savedUserName) setUserName(savedUserName);
      if (savedType) settype(savedType);
      if (savedID) setID(Number(savedID));
      if (savedUserLevel) setUserLevel(Number(savedUserLevel));
      if (savedFormIdRequested) setFormIdRequested(Number(savedFormIdRequested));
      if (savedEvaluationId) setEvaluationId(Number(savedEvaluationId));
    }
  }, []);

  // Save to localStorage whenever values change
  useEffect(() => {
    if (typeof window !== "undefined") localStorage.setItem("user", user);
  }, [user]);
  useEffect(() => {
    if (typeof window !== "undefined") localStorage.setItem("userName", userName);
  }, [userName]);


  useEffect(() => {
    if (typeof window !== "undefined") localStorage.setItem("type", type);
  }, [type]);

  useEffect(() => {
    if (typeof window !== "undefined") localStorage.setItem("ID", String(ID));
  }, [ID]);

  useEffect(() => {
    if (typeof window !== "undefined")
      localStorage.setItem("UserLevel", String(UserLevel));
  }, [UserLevel]);

  useEffect(() => {
    if (typeof window !== "undefined")
      localStorage.setItem("FormIdRequested", String(FormIdRequested));
  }, [FormIdRequested]);

  useEffect(() => {
    if (typeof window !== "undefined")
      localStorage.setItem("EvaluationId", String(EvaluationId));
  }, [EvaluationId]);

  return (
    <GlobalContext.Provider
      value={{
        user,
        setUser,
        userName,
        setUserName,
        type,
        settype,
        ID,
        setID,
        UserLevel,
        setUserLevel,
        FormIdRequested,
        setFormIdRequested,
        EvaluationId,
        setEvaluationId,
        loading,
        setloading,
      }}
    >
      {children}
    </GlobalContext.Provider>
  );
};

export const useGlobalContext = () => useContext(GlobalContext);
