import { Trainer } from "@/shared/services/TrainerService";

export type AuthState = {
  loading: boolean;
  user?: Trainer;
};

export interface IAuthContext {
  state: AuthState;
  logout: () => Promise<void>;
  isAuthenticated: () => boolean;
  login: (trainerName: string) => Promise<{ error: string | null }>;
}
