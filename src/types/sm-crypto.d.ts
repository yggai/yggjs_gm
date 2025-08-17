declare module 'sm-crypto' {
  export const sm2: {
    generateKeyPairHex: () => { privateKey: string; publicKey: string };
    doEncrypt: (plaintext: string, publicKey: string, cipherMode?: 0 | 1) => string;
    doDecrypt: (ciphertext: string, privateKey: string, cipherMode?: 0 | 1) => string;
  };
}

