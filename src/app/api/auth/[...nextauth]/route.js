import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import dbConnect from "@/app/lib/db";
import User from "@/app/models/userSchema/UserSchema";
import bcrypt from "bcryptjs";
import GoogleProvider from "next-auth/providers/google";
import TwitterProvider from "next-auth/providers/twitter";

export const authOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),

    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        await dbConnect();
        const user = await User.findOne({ email: credentials.email });
        if (user && bcrypt.compareSync(credentials.password, user.password)) {
          return {
            id: user._id,
            name: user.name,
            email: user.email,
            banned: user?.isBanned,
          };
        }
        return null;
      },
    }),
  ],
  session: {
    strategy: "jwt",
    maxAge: 60 * 60 * 24,
    updateAge: 60 * 1,
  },
  callbacks: {
    async jwt({ token, user }) {
      // Create user if logging in with Google
      if (user?.email) {
        await dbConnect();

        const existingUser = await User.findOne({ email: user.email });
        if (!existingUser) {
          const newUser = await User.create({
            name: user.name,
            email: user.email,
            image: user.image,
            password: null, // or omit if not needed
            provider: "google",
          });
          token.id = newUser._id;
          token.image = newUser.image;
          token.verified = newUser.emailVerified;
          token.isBanned = newUser.isBanned;
        } else {
          if (
            (user.image && existingUser.image == null) ||
            existingUser.image == undefined
          ) {
            existingUser.image = user.image;
            await existingUser.save();
          }
          token.id = existingUser._id;
          token.walletIndex = existingUser.walletIndex;
          token.image = existingUser.image;
          token.verified = existingUser.emailVerified;
          token.isBanned = existingUser.isBanned;
        }
      }
      return token;
    },

    async session({ session, token }) {
      if (token?.id) {
        session.user.id = token.id;
        session.user.walletIndex = token.walletIndex;
        session.user.image = token.image;
        session.user.verified = token.verified;
        session.user.isBanned = token.isBanned;
      }
      return session;
    },
    async redirect({ url, baseUrl, action }) {
      if (action === "signOut") {
        // Send all logged‑out users to /login
        return `${baseUrl}/login`;
      }
      // Default behavior for signIn, etc.
      if (url.startsWith("/")) return `${baseUrl}${url}`;
      if (new URL(url).origin === baseUrl) return url;
      return baseUrl;
    },
  },

  secret: process.env.NEXTAUTH_SECRET,
  pages: {
    signIn: "/login",
    newUser: "/auth/register",
    error: "/login", // New users land here on first sign‑in
  },
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };

// import NextAuth from 'next-auth';
// import CredentialsProvider from 'next-auth/providers/credentials';
// import dbConnect from '@/app/lib/db';
// import User from '@/app/models/userSchema/UserSchema';
// import bcrypt from 'bcryptjs';
// import GoogleProvider from "next-auth/providers/google";
// import TwitterProvider from "next-auth/providers/twitter";
// import { redis } from '@/app/lib/redis';

// export const authOptions = {
//   providers: [
//     GoogleProvider({
//       clientId: process.env.GOOGLE_CLIENT_ID,
//       clientSecret: process.env.GOOGLE_CLIENT_SECRET,
//     }),

//     CredentialsProvider({
//       name: 'Credentials',
//       credentials: {
//         email: { label: 'Email', type: 'email' },
//         password: { label: 'Password', type: 'password' },
//       },
//       async authorize(credentials) {
//         await dbConnect();
//         const user = await User.findOne({ email: credentials.email });
//         if (user && bcrypt.compareSync(credentials.password, user.password)) {
//           return { id: user._id, name: user.name, email: user.email };
//         }
//         return null;
//       },
//     }),
//   ],
//   session: {
//     strategy: 'jwt',
//   },
//   callbacks: {
//     async jwt({ token, user }) {

//       // Create user if logging in with Google
//       if (user?.email) {
//         await dbConnect();
//         const cachedUser = await redis.get(`user:${user.email}`);
//         if (cachedUser) {
//           const parsed = JSON.parse(cachedUser);
//           token.id = parsed._id;
//           token.walletIndex = parsed.walletIndex;
//           token.image = parsed.image;
//         } else {
//           const existingUser = await User.findOne({ email: user.email });

//           if (!existingUser) {
//             const newUser = await User.create({
//               name: user.name,
//               email: user.email,
//               image: user.image,
//               provider: "google",
//             });
//             token.id = newUser._id;
//             token.image = newUser.image;

//             await redis.set(`user:${newUser.email}`, JSON.stringify(newUser), 'EX', 900);
//           } else {
//             if (user.image && (!existingUser.image)) {
//               existingUser.image = user.image;
//               await existingUser.save();
//             }

//             token.id = existingUser._id;
//             token.walletIndex = existingUser.walletIndex;
//             token.image = existingUser.image;

//             await redis.set(`user:${existingUser.email}`, JSON.stringify(existingUser), 'EX', 900);
//           }
//         }
//       }

//       return token;
//     },

//     async session({ session, token }) {
//       if (token?.id) {
//         session.user.id = token.id;
//         session.user.walletIndex = token.walletIndex;
//         session.user.image = token.image;
//       }
//       return session;
//     },
//     async redirect({ url, baseUrl, action }) {
//       if (action === "signOut") {
//         // Send all logged‑out users to /login
//         return `${baseUrl}/login`;
//       }
//       // Default behavior for signIn, etc.
//       if (url.startsWith("/")) return `${baseUrl}${url}`;
//       if (new URL(url).origin === baseUrl) return url;
//       return baseUrl;
//     }
//   },

//   secret: process.env.NEXTAUTH_SECRET,
//   pages: {
//     signIn: "/login",
//     newUser: "/auth/register",
//     error: "/login"  // New users land here on first sign‑in
//   },
// };

// const handler = NextAuth(authOptions);
// export { handler as GET, handler as POST };

/*
import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import dbConnect from '@/app/lib/db';
import User from '@/app/models/userSchema/UserSchema';
import bcrypt from 'bcryptjs';
import GoogleProvider from "next-auth/providers/google";
import TwitterProvider from "next-auth/providers/twitter";



export const authOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),

    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        await dbConnect();
        const user = await User.findOne({ email: credentials.email });
        if (user && bcrypt.compareSync(credentials.password, user.password)) {
          return { id: user._id, name: user.name, email: user.email };
        }
        return null;
      },
    }),
  ],
  session: {
    strategy: 'jwt',
  },
  callbacks: {
    async jwt({ token, user }) {

      // Create user if logging in with Google
      if (user?.email) {
        await dbConnect();

        const existingUser = await User.findOne({ email: user.email });
        if (!existingUser) {
          const newUser = await User.create({
            name: user.name,
            email: user.email,
            image: user.image,
            password: null, // or omit if not needed
            provider: "google",
          });
          token.id = newUser._id;
          token.image = newUser.image;
        } else {
          if (user.image && existingUser.image == null || existingUser.image == undefined) {
            existingUser.image = user.image
            await existingUser.save()
          }
          token.id = existingUser._id;
          token.walletIndex = existingUser.walletIndex;
          token.image = existingUser.image;
        }
      }
      return token;
    },

    async session({ session, token }) {
      if (token?.id) {
        session.user.id = token.id;
        session.user.walletIndex = token.walletIndex;
        session.user.image = token.image;
      }
      return session;
    },
    async redirect({ url, baseUrl, action }) {
      if (action === "signOut") {
        // Send all logged‑out users to /login
        return `${baseUrl}/login`;
      }
      // Default behavior for signIn, etc.
      if (url.startsWith("/")) return `${baseUrl}${url}`;
      if (new URL(url).origin === baseUrl) return url;
      return baseUrl;
    }
  },

  secret: process.env.NEXTAUTH_SECRET,
  pages: {
    signIn: "/login",
    newUser: "/auth/register",
    error: "/login"  // New users land here on first sign‑in
  },
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };


*/
