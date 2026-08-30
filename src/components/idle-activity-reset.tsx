"use client";

import { useEffect } from "react";

export function IdleActivityReset() {
  useEffect(() => {
    window.localStorage.setItem("happylife-last-activity", String(Date.now()));
    window.localStorage.removeItem("happylife-had-session");
  }, []);

  return null;
}
