import type { NextAuthConfig } from "next-auth"

export const authEdgeConfig = {
  providers: [], // intentionally empty here — real providers live in the full config
  callbacks: {
    // keep only callbacks that don't touch the database,
    // e.g. session/jwt shaping logic if it's pure
  },
} satisfies NextAuthConfig