export async function api<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`https://asdesigns.pro/api${path}`, init);
  if (!res.ok) throw new Error(`API ${res.status}`);
  return (await res.json()) as T;
}
