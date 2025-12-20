import { type Accessor, createContext, type JSX, useContext } from "solid-js";

import type { Session, User } from "~/shared/types.ts";

export type SessionContextValue = {
  user: Accessor<User | undefined>;
  session: Accessor<Session | undefined>;
};

const SessionContext = createContext<SessionContextValue>();

export function SessionProvider(props: {
  user: Accessor<User | undefined>;
  session: Accessor<Session | undefined>;
  children: JSX.Element;
}) {
  return (
    <SessionContext.Provider
      value={{ user: props.user, session: props.session }}
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
