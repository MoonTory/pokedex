export default function PreviewAsJSON<T = any>({ data }: { data: T }) {
  return <pre>{JSON.stringify(data, null, 2)}</pre>;
}
