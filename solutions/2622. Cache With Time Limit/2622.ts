// For private class member
// ref: https://google.github.io/styleguide/tsguide.html#class-members

type Value = { value: number; expiredAt: number };

class TimeLimitedCache {
  private map: Map<number, Value>;

  constructor() {
    this.map = new Map();
  }

  set(key: number, value: number, duration: number): boolean {
    const now = Date.now();
    const exists = this.getValue(now, key) !== undefined;
    this.map.set(key, { value, expiredAt: now + duration });
    return exists;
  }

  get(key: number): number {
    const val = this.getValue(Date.now(), key);
    return val === undefined ? -1 : val.value;
  }

  count(): number {
    const now = Date.now();
    for (const key of this.map.keys())
      if (this.getValue(now, key) === undefined) {
        this.map.delete(key);
      }
    return this.map.size;
  }

  private getValue(now: number, key: number): Value | undefined {
    const val = this.map.get(key);
    return val && now <= val.expiredAt ? val : undefined;
  }
}
