## yggjs_gm

A modern TypeScript/JavaScript implementation of Chinese National Cryptography (GM) algorithms focused on SM2, with a simple API and cross-language interoperability in mind.

### Project status

- Personal research project by the author. Not accepting code merges/PRs. Issues are welcome.
- Noncommercial open source under PolyForm Noncommercial License 1.0.0. Commercial use requires a separate written license from the author (see COMMERCIAL_LICENSE.md).

### Relationship to yggpy_gm (Python)

This project is the JavaScript/TypeScript counterpart to the Python project at https://github.com/yggai/yggpy_gm. They are designed to interoperate and be mutually convertible:

- Key material and ciphertext are hex-encoded and compatible across both projects.
- SM2 encryption/decryption parameters are aligned for cross-language conversion. Ensure the same cipher mode and encodings are used on both sides.
- Typical flow: data encrypted in JS via yggjs_gm can be decrypted in Python via yggpy_gm, and vice versa.

### Features

- SM2 keypair generation, encryption, and decryption (via sm-crypto under the hood)
- TypeScript types and tree-shakeable build
- Cross-language compatibility guidance with Python (yggpy_gm)

### Installation

- npm: npm install yggjs-gm
- pnpm: pnpm add yggjs-gm
- yarn: yarn add yggjs-gm

### Quick start

```ts
import gggm from 'yggjs-gm';

// 1) Generate keypair
const { privateKey, publicKey } = gggm.getKey();

// 2) Encrypt with public key
const ciphertext = gggm.sm2Encrypt(publicKey, 'hello world');

// 3) Decrypt with private key
const plaintext = gggm.sm2Decrypt(privateKey, ciphertext);
```

Notes

- Public keys are uncompressed, starting with 04, hex-encoded.
- Ciphertext is hex-encoded. When integrating with Python, make sure both sides use the same SM2 cipher mode and encoding. This library currently uses cipherMode = 0 (C1C2C3) for sm-crypto.

### API

- getKey(): { privateKey: string; publicKey: string }
  - Generates a 64-hex private key and 04-prefixed uncompressed public key.
- sm2Encrypt(publicKey: string, text: string): string
  - Returns hex ciphertext. Throws on invalid public key.
- sm2Decrypt(privateKey: string, encryptedText: string): string
  - Returns plaintext string; returns '' if decryption fails.

### Interoperability with yggpy_gm (Python)

- Repository: https://github.com/yggai/yggpy_gm
- Ensure both sides agree on:
  - Cipher mode (C1C2C3 vs C1C3C2). This project defaults to C1C2C3 (cipherMode = 0) with sm-crypto.
  - Hex encodings for keys and ciphertext.
- With aligned settings, data encrypted in one language can be decrypted in the other.

### License

- PolyForm Noncommercial License 1.0.0. See LICENSE for the full text.
- Commercial licensing: see COMMERCIAL_LICENSE.md.

Author and Contact

- Author: 源滚滚
- Email: 1156956636.com

### Contributing

- This is a personal research project; pull requests are not accepted.
- Please open an issue for bug reports, questions, or feature requests.
