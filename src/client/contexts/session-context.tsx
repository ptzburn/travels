import { createContext, useContext } from "solid-js";

import type { Session, User } from "~/shared/types.ts";
import { AccessorWithLatest } from "@solidjs/router";
import { ParentProps } from "solid-js";

const SessionContext = createContext<
  AccessorWithLatest<
    | {
      session: Session;
      user: User;
    }
    | null
    | undefined
  >
>();

export function SessionProvider(
  props: ParentProps & {
    session: AccessorWithLatest<
      | {
        session: Session;
        user: User;
      }
      | null
      | undefined
    >;
  },
) {
  return (
    <SessionContext.Provider
      value={props.session}
    >
      {props.children}
    </SessionContext.Provider>
  );
}

export function useSession() {
  const context = useContext(SessionContext);

  if (!context) {
    throw new Error("useSession must be used within SessionProvider");
  }

  return context;
}
