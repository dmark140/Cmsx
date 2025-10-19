// components/lib.ts

'use client'
import { useGlobalContext } from "@/context/GlobalContext";
const { ID, setID, userName } = useGlobalContext();
export function UserName() {
    return userName;
}


// // userStore 
// let _userName: string | null = null;
// export const setUserNameGlobal = (name: string) => { _userName = name; };
// export const getUserNameGlobal = () => _userName;


 


export function formatDate(dateString: string): string {
  const date = new Date(dateString);
  // Converts to YYYY-MM-DD format
  return date.toISOString().split('T')[0];
}