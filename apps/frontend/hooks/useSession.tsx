import { useCookies } from "react-cookie";
import { useCallback } from "react";

/**
 * Keep track of the username, as it's handled client-side.
 */
export const useSession = () => {
  const [cookies, setCookie] = useCookies();

  const username = cookies.username ?? "";
  const setUsername = useCallback(
    (name: string) => {
      const oneYearFromNow = new Date();
      oneYearFromNow.setFullYear(oneYearFromNow.getFullYear() + 1);
      setCookie("username", name, {
        expires: oneYearFromNow,
      });
    },
    [setCookie],
  );
  return [username, setUsername];
};
