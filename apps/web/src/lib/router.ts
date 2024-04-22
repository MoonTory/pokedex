import { LoaderFunctionArgs } from "react-router";

export type LoaderFunction<T, C> = (
  context: C
) => (args: LoaderFunctionArgs) => Promise<T>;

export function combineLoaders<T, C>(
  context: C,
  loaders: LoaderFunction<any, any>[]
): (params?: LoaderFunctionArgs) => Promise<T> {
  return async (params?: any) => {
    const results = await Promise.all(
      loaders.map((loader) => loader(context)(params))
    );

    return Object.assign({}, ...results);
  };
}
