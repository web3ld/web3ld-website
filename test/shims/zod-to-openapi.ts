// test/shims/zod-to-openapi.ts
// Minimal shim for tests: add a no-op `.openapi()` to Zod types.
export function extendZodWithOpenApi(z: any) {
  const proto = z?.ZodType?.prototype;
  if (proto && typeof proto.openapi !== 'function') {
    Object.defineProperty(proto, 'openapi', {
      configurable: true,
      writable: true,
      enumerable: false,
      value: function openapi(..._args: any[]) {
        return this; // keep chainability
      },
    });
  }
}
