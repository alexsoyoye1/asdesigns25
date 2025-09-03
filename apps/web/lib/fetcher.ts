export async function api<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`http://localhost:4000${path}`, init);
  if (!res.ok) throw new Error(`API ${res.status}`);
  return (await res.json()) as T;
}
