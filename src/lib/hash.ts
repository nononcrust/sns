import argon2 from "argon2";

export const hash = {
  create: async (input: string) => {
    return argon2.hash(input);
  },
  verify: async (hash: string, input: string) => {
    return argon2.verify(hash, input);
  },
};
