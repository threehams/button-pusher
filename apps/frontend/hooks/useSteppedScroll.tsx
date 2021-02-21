import { useEffect, useCallback } from "react";
import { debounce } from "lodash";

export const useSteppedScroll = () => {
  useEffect(() => {
    const onScroll = debounce(() => {
      // console.log("scroll");
    }, 500);

    // never scrolljack. unless it's for aesthetic, then it's perfectly fine
    window.addEventListener("scroll", onScroll);

    return () => {
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  const scrollToBottom = useCallback(() => {
    window.scroll({ top: document.body.scrollHeight });
  }, []);

  return scrollToBottom;
};
