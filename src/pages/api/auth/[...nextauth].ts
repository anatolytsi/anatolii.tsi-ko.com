import NextAuth, { Session, User } from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials";
import { JWT } from "next-auth/jwt";
import { Role } from "@/nextauth.d";

export const authOptions = {
  secret: process.env.AUTH_SECRET,
  // Configure one or more authentication providers
  providers: [
    CredentialsProvider({
      name: "Credentials",
      id: "credentials",

      credentials: {
        username: { label: "Username", type: "text" },
        password: { label: "Password", type: "password" }
      },

      async authorize(credentials, _req) {
        if (!(process.env.USER_FULL_NAME && process.env.USER_EMAIL) &&
            !(credentials?.username === process.env.USER_USERNAME && credentials?.password === process.env.USER_PASSWORD)) {
          return null;
        }
        const user: User = { id: "1", name: process.env.USER_FULL_NAME, email: process.env.USER_EMAIL, role: Role.admin };
        return user;
      }
    })
    // GithubProvider({
    //   clientId: process.env.GITHUB_ID,
    //   clientSecret: process.env.GITHUB_SECRET,
    // }),
    // ...add more providers here
  ],
  callbacks: {
    async jwt({ token, user }: {token: JWT, user: User}) {
      /* Step 1: update the token based on the user object */
      if (user) {
        token.role = user.role;
      }
      return token;
    },

    session({ session, token }: {session: Session, token: JWT}) {
      /* Step 2: update the session.user based on the token object */
      if (token && session.user) {
        session.user.role = token.role;
      }
      return session;
    },
  },
}

export default NextAuth(authOptions)
