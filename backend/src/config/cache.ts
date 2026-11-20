interface CacheEntry<T> {
  value: T;
  expiresAt: number | null;
}

export class InMemoryCache<T> {
  private readonly store = new Map<string, CacheEntry<T>>();

  public get(key: string): T | undefined {
    const entry = this.store.get(key);
    if (!entry) return undefined;

    if (entry.expiresAt !== null && Date.now() > entry.expiresAt) {
      this.store.delete(key);
      return undefined;
    }

    return entry.value;
  }

  public set(key: string, value: T, ttlMs?: number): void {
    this.store.set(key, {
      value,
      expiresAt: ttlMs !== undefined ? Date.now() + ttlMs : null,
    });
  }

  public clear(): void {
    this.store.clear();
  }
}
