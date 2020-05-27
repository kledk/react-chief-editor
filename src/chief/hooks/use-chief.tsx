import { useContext } from "react";
import { ChiefContext } from "../chief-context";

export function useChief() {
  const ctx = useContext(ChiefContext);
  if (!ctx) {
    throw new Error(
      'Chief context not found. Wrap your <Chief.Editor/> in a <Chief/> before using "useChief()"'
    );
  }
  return ctx;
}
