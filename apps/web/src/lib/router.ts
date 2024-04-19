import { QueryClient } from "@tanstack/react-query";
import { LoaderFunctionArgs } from "react-router";

export type LoaderFunction<T> = (
  queryClient: QueryClient
) => (args: LoaderFunctionArgs) => Promise<T>;

export function combineLoaders<T>(
  queryClient: QueryClient,
  loaders: LoaderFunction<any>[]
): (params?: LoaderFunctionArgs) => Promise<T> {
  return async (params?: any) => {
    const results = await Promise.all(
      loaders.map((loader) => loader(queryClient)(params))
    );

    return Object.assign({}, ...results);
  };
}
