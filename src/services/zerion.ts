import { ZERION_CONFIG } from "../config";

export class ZerionService {
  constructor(
    private readonly apiKey: string,
    private readonly env?: string
  ) {}

  // Utility function to make API requests with error handling
  async fetchFromZerion<T>(endpoint: string): Promise<T> {
    const headers = {
      accept: "application/json",
      authorization: `Basic ${this.apiKey}`,
      // Optionally add the "X-Env" header for testnet or other environments
      ...(this.env ? { "X-Env": this.env } : {}),
    };

    const response = await fetch(`${ZERION_CONFIG.BASE_URL}${endpoint}`, {
      headers,
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch ${endpoint}: ${response.statusText}`);
    }
    const data = await response.json();
    return data as T;
  }
}
