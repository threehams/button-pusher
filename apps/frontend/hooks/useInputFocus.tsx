import { useEffect, useContext } from "react";
import { CommandContext } from "@botnet/commands";

export const useInputFocus = (
  onSubmit: () => void,
  inputRef: React.RefObject<HTMLInputElement>,
) => {
  const { setNextCommand, setPrevCommand } = useContext(CommandContext);
  useEffect(() => {
    const focusInput = (event: KeyboardEvent): void => {
      // don't interfere with accessibility
      if (event.key === "Tab") {
        return;
      }

      inputRef.current?.focus();
      if (event.key === "Enter") {
        return onSubmit();
      }
      if (event.key === "ArrowUp") {
        // prevent scrolling, that would be bad
        event.preventDefault();
        setPrevCommand();
        return;
      }
      if (event.key === "ArrowDown") {
        // prevent scrolling, that would be bad
        event.preventDefault();
        setNextCommand();
        return;
      }
    };
    document.addEventListener("keydown", focusInput);

    return () => {
      document.removeEventListener("keydown", focusInput);
    };
  }, [inputRef, onSubmit, setNextCommand, setPrevCommand]);
};
