export const API_BASE_URL = "https://dummyjson.com";

export class HttpError extends Error {
  constructor(
    public readonly status: number,
    message: string,
  ) {
    super(message);
  }
}

export async function requestJson<T>(
  path: string,
  init?: RequestInit,
): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...init,
    headers: { "Content-Type": "application/json", ...init?.headers },
  });
  if (!response.ok) {
    throw new HttpError(
      response.status,
      `Requête ${path} en échec (${response.status})`,
    );
  }
  return (await response.json()) as T;
}
