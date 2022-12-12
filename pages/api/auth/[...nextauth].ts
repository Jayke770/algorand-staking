import NextAuth from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
export default NextAuth({
    providers: [
        CredentialsProvider({
            name: "Account",
            credentials: {
                username: { label: "Username", type: "text", placeholder: "jsmith" },
                password: { label: "Password", type: "password" }
            },
            authorize(credentials, req) {
                if (credentials?.username === process.env.ADMIN_USERNAME && credentials?.password === process.env.ADMIN_PASSWORD) {
                    return { id: 'admin', name: 'admin', image: '/assets/logo.png' }
                } else {
                    return null
                }
            },
        })
    ],
    secret: process.env.NEXTAUTH_SECRET,
    session: {
        strategy: 'jwt',
        maxAge: 15 * 24 * 60 * 60,
        updateAge: 24 * 60 * 60
    },
    callbacks: {
        async session({ session, user, token }) {
            return session
        }
    },
    pages: {
        signIn: '/auth'
    }
})