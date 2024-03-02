import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import GithubProvider from "next-auth/providers/github";

import { connectToDB } from "@utils/database";
import User from "@models/user";

const handler = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_ID ?? "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET ?? "",
    }),
    GithubProvider({
      clientId: process.env.GITHUB_ID ?? "",
      clientSecret: process.env.GITHUB_CLIENT_SECRET ?? "",
    }),
  ],
  callbacks: {
    async signIn({ profile }) {
      try {
        await connectToDB();
        const userExists = await User.findOne({ email: profile?.email });
        if (!userExists) {
          await User.create({
            email: profile?.email,
            username: profile?.name?.replace(" ", "").toLowerCase(),
            image: profile?.picture,
          });
        }
        return true;
      } catch (error) {
        console.error("Error: ", error?.message);
        return false;
      }
    },
    async jwt({ token }) {
      await connectToDB();
      const currentUserRecord = await User.findOne({ email: token?.email });

      if (currentUserRecord) {
        token.userId = currentUserRecord._id.toString();
      }
      return token;
    },
    async session({ session, token }) {
      session.user.userId = token?.userId;
      return session;
    },
  },
});

export { handler as GET, handler as POST };
