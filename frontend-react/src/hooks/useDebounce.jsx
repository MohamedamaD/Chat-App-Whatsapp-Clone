import { useEffect, useState } from "react";

export const useDebounce = (searchTerm, interval) => {
  const [debounce, setDebounce] = useState("");
  useEffect(() => {
    const timeout = setTimeout(() => {
      setDebounce(searchTerm);
    }, interval);
    return () => {
      clearTimeout(timeout);
    };
  }, [searchTerm, interval]);

  return debounce;
};
