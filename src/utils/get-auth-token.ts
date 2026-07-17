"use client";

export function getAuthToken() {
  const appStore = localStorage.getItem("app-store");
  const token = appStore ? JSON.parse(appStore)?.state?.token : null;
  return token;
}