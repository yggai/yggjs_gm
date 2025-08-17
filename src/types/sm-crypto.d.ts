declare module 'sm-crypto' {
  export interface SM2KeyPair {
    privateKey: string;
    publicKey: string;
  }

  export interface SM2 {
    generateKeyPairHex(): SM2KeyPair;
    doEncrypt(msg: string, publicKey: string, cipherMode?: number): string;
    doDecrypt(encryptData: string, privateKey: string, cipherMode?: number): string;
    doSignature(msg: string, privateKey: string, options?: any): string;
    doVerifySignature(msg: string, signData: string, publicKey: string, options?: any): boolean;
  }

  export interface SM3 {
    sm3(msg: string): string;
  }

  export interface SM4 {
    encrypt(msg: string, key: string, options?: any): string;
    decrypt(encryptData: string, key: string, options?: any): string;
  }

  export const sm2: SM2;
  export const sm3: SM3;
  export const sm4: SM4;
}
