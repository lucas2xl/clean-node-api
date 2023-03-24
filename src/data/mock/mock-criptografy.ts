import { Decrypter } from '@/data/protocols/criptography/decrypter';
import { Encrypter } from '@/data/protocols/criptography/encrypter';
import { HashComparer } from '@/data/protocols/criptography/hash-comparer';
import { Hasher } from '@/data/protocols/criptography/hasher';

export function mockHasher(): Hasher {
  class HasherStub implements Hasher {
    async hash(): Promise<string> {
      return 'hashed-password';
    }
  }

  return new HasherStub();
}

export function mockHashComparer(): HashComparer {
  class HashCompareStub implements HashComparer {
    async compare(): Promise<boolean> {
      return Promise.resolve(true);
    }
  }

  return new HashCompareStub();
}

export function mockEncrypter(): Encrypter {
  class EncrypterStub implements Encrypter {
    async encrypt(): Promise<string> {
      return Promise.resolve('any-token');
    }
  }

  return new EncrypterStub();
}

export function mockDecrypter(): Decrypter {
  class DecrypterStub implements Decrypter {
    async decrypt(): Promise<string> {
      return Promise.resolve('any-value');
    }
  }

  return new DecrypterStub();
}
