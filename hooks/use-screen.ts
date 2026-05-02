"use client";

import { useState } from "react";

export function useScreen(initialScreen = "home") {
  const [screen, setScreen] = useState(initialScreen);
  const [stack, setStack] = useState<string[]>([]);

  function push(nextScreen: string) {
    setStack(current => [...current, screen]);
    setScreen(nextScreen);
  }

  function back() {
    setStack(current => {
      const next = [...current];
      setScreen(next.pop() || "home");
      return next;
    });
  }

  return { screen, push, back };
}

