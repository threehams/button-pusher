import useStateMachine from "@cassiozen/usestatemachine";

export const useResetMachine = () => {
  return useStateMachine()({
    initial: "error",
    states: {
      error: {
        on: { RESET: "needsConfirmation" },
      },
      needsConfirmation: {
        on: { CONFIRM: { target: "reset" } },
      },
      reset: {
        effect() {
          localStorage.clear();
          location.reload();
        },
      },
    },
  });
};
