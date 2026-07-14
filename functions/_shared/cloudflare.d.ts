export {};

declare global {
  interface EventContext<Env> {
    request: Request;
    env: Env;
    params: Record<string, string | string[]>;
    data: Record<string, unknown>;
    next(): Promise<Response>;
    waitUntil(promise: Promise<unknown>): void;
  }

  type PagesFunction<Env = unknown> = (context: EventContext<Env>) => Response | Promise<Response>;

  interface D1Result<T = unknown> {
    results: T[];
    success: boolean;
    meta: Record<string, unknown>;
    error?: string;
  }

  interface D1PreparedStatement {
    bind(...values: unknown[]): D1PreparedStatement;
    first<T = Record<string, unknown>>(columnName?: string): Promise<T | null>;
    all<T = Record<string, unknown>>(): Promise<D1Result<T>>;
    run<T = Record<string, unknown>>(): Promise<D1Result<T>>;
  }

  interface D1Database {
    prepare(query: string): D1PreparedStatement;
    batch<T = unknown>(statements: D1PreparedStatement[]): Promise<D1Result<T>[]>;
  }

  interface R2PutOptions {
    httpMetadata?: { contentType?: string };
    customMetadata?: Record<string, string>;
  }

  interface R2Bucket {
    put(key: string, value: ReadableStream | ArrayBuffer | Blob, options?: R2PutOptions): Promise<unknown>;
  }
}
