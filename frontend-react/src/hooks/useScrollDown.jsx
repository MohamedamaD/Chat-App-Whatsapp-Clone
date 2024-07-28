import { useCallback, useEffect } from "react";

export const useScrollDown = (messages, messagesRef) => {
  const scrollDown = useCallback(() => {
    if (messagesRef.current) {
      messagesRef.current.scrollTo({
        behavior: "smooth",
        top: messagesRef.current.scrollHeight,
      });
    }
  }, [messagesRef]);

  useEffect(() => {
    scrollDown();
  }, [messages]);
};
