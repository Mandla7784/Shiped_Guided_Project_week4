declare module "clsx" {
  type ClassValue = string | number | boolean | undefined | null | ClassValue[] | Record<string, boolean | undefined | null>
  function clsx(...inputs: ClassValue[]): string
  export { clsx, type ClassValue }
}
