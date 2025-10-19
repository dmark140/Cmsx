let globalUserName: string = "system";

export function setGlobalUserName(name: string) {
  globalUserName = name;
  if (typeof window !== "undefined") {
    localStorage.setItem("globalUserName", name);
  }
}

export function getGlobalUserName(): string {
  if (typeof window !== "undefined") {
    const stored = localStorage.getItem("globalUserName");
    if (stored) globalUserName = stored;
  }
  return globalUserName;
}
