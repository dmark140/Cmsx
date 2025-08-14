import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}


export function limitText(text: string, maxChars: number): string {
  if (text.length <= maxChars) return text;
  return text.slice(0, maxChars) + '...';
}


// export const runQuery = async (queryName: string, params: any[] = []) => {
//   const res = await fetch("/api/sql", {
//     method: "POST",
//     headers: { "Content-Type": "application/json" },
//     body: JSON.stringify({ queryName, params }),
//   });

//   const data = await res.json();
//   if (!res.ok) throw new Error(data.message);

//   if(data.data === undefined) return data
//   return data.data
// };

export const runQuery = async (
  queryName: string,
  params: any[] = [],
  options?: {
    paginate?: boolean;
    page?: number;
    limit?: number;
  }
) => {
  const res = await fetch("/api/sql", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ queryName, params, options }),
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data.message);

  return data;
};

export const canProceed = (...params: (string | number | null | undefined)[]): boolean => {
  return !params.some(param => param === null || param === undefined || param === '');
};


export const onlyDate = (isoString: string) => isoString.split('T')[0];


export function generateFormattedNumber(header: number, number: number, numberLength: number): string {
  const numberStr = number.toString().padStart(numberLength, '0');
  return `${header}${numberStr}`;
}


export function getDatePart(dateInput: string | Date, option: "month" | "year" | "day" | "dayOfWeek"): string {
  const date = typeof dateInput === "string" ? new Date(dateInput) : dateInput;

  switch (option) {
    case "month":
      return String(date.getMonth() + 1).padStart(2, "0");
    case "year":
      return String(date.getFullYear());
    case "day":
      return String(date.getDate()).padStart(2, "0");
    case "dayOfWeek":
      return date.toLocaleString("en-US", { weekday: "short" }).toUpperCase();
    default:
      throw new Error("Invalid option");
  }
}
