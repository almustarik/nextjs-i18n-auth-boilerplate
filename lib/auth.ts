import { type NextAuthOptions, getServerSession } from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import GitHubProvider from 'next-auth/providers/github';
import FacebookProvider from 'next-auth/providers/facebook';
import type { SessionUser } from '@/types/auth';

export const authOptions: NextAuthOptions = {
  providers: [
    ...(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET
      ? [
          GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
          }),
        ]
      : []),
    ...(process.env.GITHUB_ID && process.env.GITHUB_SECRET
      ? [
          GitHubProvider({
            clientId: process.env.GITHUB_ID,
            clientSecret: process.env.GITHUB_SECRET,
          }),
        ]
      : []),
    ...(process.env.FACEBOOK_CLIENT_ID && process.env.FACEBOOK_CLIENT_SECRET
      ? [
          FacebookProvider({
            clientId: process.env.FACEBOOK_CLIENT_ID,
            clientSecret: process.env.FACEBOOK_CLIENT_SECRET,
          }),
        ]
      : []),
  ],
  session: {
    strategy: 'jwt',
  },
  callbacks: {
    async signIn({ account, profile }) {
      console.log('signIn callback account:', account);
      console.log('signIn callback profile:', profile);
      /*
      if (account?.provider === "google") {
        const id_token = account.id_token;
        
        // This is a placeholder for your backend endpoint
        const backendUrl = "https://your-backend.com/verify-token";

        try {
          const response = await fetch(backendUrl, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "Authorization": `Bearer ${id_token}`
            },
          });

          if (response.ok) {
            const data = await response.json();
            // Assuming your backend returns { approved: boolean }
            if (data.approved) {
              return true; // Allow sign in
            } else {
              // You can redirect to a custom error page
              // return '/unauthorized'
              return false; // Deny sign in
            }
          } else {
            // Handle non-ok responses from your backend
            return false;
          }
        } catch (error) {
          console.error("Error verifying token with backend:", error);
          return false;
        }
      }
      */
      return true; // Allow sign in by default for other providers or if the logic is commented out
    },
    async jwt({ token, user }) {
      console.log('JWT callback token:', token);
      if (user) {
        token.role = (user as any).role || 'user';
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        (session.user as SessionUser).id = token.sub!;
        (session.user as SessionUser).role =
          (token.role as 'user' | 'admin') || 'user';
      }
      return session;
    },
    async redirect({ url, baseUrl }) {
      console.log('Redirect callback URL:', url);
      console.log('Redirect callback Base URL:', baseUrl);
      return url;
    },
  },
  pages: {
    signIn: '/sign-in',
  },
};

export const getServerAuthSession = () => getServerSession(authOptions);
