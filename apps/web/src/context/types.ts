export interface ReducerAction<T = any, P = any> {
  type: T;
  payload: P;
}
