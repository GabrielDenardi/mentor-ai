import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";

export const authOptions = {
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID!,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
            authorization: {
                params: {
                    scope: "openid email profile https://www.googleapis.com/auth/calendar.events",
                    access_type: "offline",
                    prompt: "consent",
                },
            },
        }),
    ],
    callbacks: {
        async session({ session, token }) {
            session.accessToken = token.accessToken
            return session
        },
        async jwt({ token, account }) {
            if (account) {
                token.accessToken = account.access_token
                token.refreshToken = account.refresh_token
                token.expiresAt = account.expires_at * 1000
            }

            if (Date.now() < (token.expiresAt || 0)) return token

            if (token.refreshToken) {
                try {
                    const url = "https://oauth2.googleapis.com/token"
                    const res = await fetch(url, {
                        method: "POST",
                        headers: { "Content-Type": "application/x-www-form-urlencoded" },
                        body: new URLSearchParams({
                            client_id: process.env.GOOGLE_CLIENT_ID!,
                            client_secret: process.env.GOOGLE_CLIENT_SECRET!,
                            grant_type: "refresh_token",
                            refresh_token: token.refreshToken,
                        }),
                    })

                    const refreshedTokens = await res.json()

                    if (!res.ok) throw refreshedTokens

                    token.accessToken = refreshedTokens.access_token
                    token.expiresAt = Date.now() + refreshedTokens.expires_in * 1000
                } catch (error) {
                    console.error("Erro ao renovar access token", error)
                    return { ...token, error: "RefreshAccessTokenError" }
                }
            }

            return token
        }
    },
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
