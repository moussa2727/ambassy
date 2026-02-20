// src/types/jsonwebtoken.d.ts
declare module 'jsonwebtoken' {
  export interface SignOptions {
    algorithm?: string;
    expiresIn?: string | number;
    notBefore?: string | number;
    audience?: string | string[];
    subject?: string;
    issuer?: string;
    jwtid?: string;
    keyid?: string;
    noTimestamp?: boolean;
    header?: object;
    encoding?: string;
    mutatePayload?: boolean;
  }

  export function sign(
    payload: string | object | Buffer,
    secretOrPrivateKey: jwt.Secret,
    options?: SignOptions
  ): string;

  export function verify<T = any>(
    token: string,
    secretOrPublicKey: jwt.Secret,
    options?: VerifyOptions
  ): T;

}