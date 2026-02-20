// src/types/next.d.ts
declare module 'next/server' {
  export class NextResponse {
    static next(config?: { request?: any }): NextResponse
    static redirect(url: string | URL, init?: number | ResponseInit): NextResponse
    static rewrite(destination: string | URL, init?: ResponseInit): NextResponse
    static json(body: any, init?: ResponseInit): NextResponse
  }

  export interface NextRequest {
    nextUrl: {
      pathname: string
      search: string
      clone(): NextUrl
    }
    cookies: {
      get(name: string): { value: string } | undefined
    }
    url: string
    method: string
    headers: Headers
  }

  export interface NextUrl {
    pathname: string
    search: string
    href: string
    origin: string
    protocol: string
    host: string
    hostname: string
    port: string
    searchParams: URLSearchParams
    toString(): string
  }
}