import React from "react";

import { TrainerService } from "@/shared/services";

import { AuthState, IAuthContext } from "./types";
import { useLocalStorage } from "@/hooks/useLocalStorage";

export const AuthContext = React.createContext({} as any as IAuthContext);

export const AuthProvider: React.FC<React.PropsWithChildren> = ({
  children,
}) => {
  const [localUser, setLocalUser] = useLocalStorage<any>("user", undefined);
  const [state, setState] = React.useState<AuthState>({
    loading: false,
    user: localUser ? JSON.parse(localUser) : undefined,
  });

  const login = async (trainerName: string) => {
    setState({ ...state, loading: true });
    try {
      let trainer = await TrainerService.getTrainerById(trainerName);

      if (!trainer) {
        trainer = await TrainerService.addTrainer(trainerName);
      }

      setLocalUser(JSON.stringify(trainer));
      setState({ user: trainer, loading: false });

      return { error: null };
    } catch (err: any) {
      setState({ ...state, loading: false });
      return { error: "An error occurred. Please try again." };
    }
  };

  const logout = async () => {
    setState({ user: undefined, loading: false });
  };

  const isAuthenticated = () => {
    if (state.user === undefined) return false;

    return true;
  };

  return (
    <AuthContext.Provider
      value={{
        state,
        login,
        logout,
        isAuthenticated,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = React.useContext(AuthContext);

  if (context === undefined)
    throw new Error("useAuth must be used within an AuthProvider");

  return context;
};
