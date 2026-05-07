import NextAuth from "next-auth"
import Credentials from "next-auth/providers/credentials"
import Google from "next-auth/providers/google"
import connectdb from "./lib/db"
import User from "./models/user.model"
import bcrypt from "bcryptjs"
export const { handlers, signIn, signOut, auth } = NextAuth({
    providers: [
        Credentials({
            credentials: {
                email: { label: "email", type: "email" },
                password: { label: "password", type: "password" }
            },
            async authorize(credentials, request) {
                await connectdb()
                const email = credentials.email;
                const password = credentials.password as string
                const user = await User.findOne({ email })
                if (!user) {
                    throw new Error("User does not exist")
                }
                const isMatch = await bcrypt.compare(password, user.password)
                if (!isMatch) {
                    throw new Error("Password does not match")
                }
                return {
                    id: user._id,
                    email: user.email,
                    name: user.name,
                    role:user.role,
                    mobile:user.mobile
                }
            }
        }),
        Google({
            clientId:process.env.CLIENTID,
            clientSecret:process.env.CLIENTSECRET
        })
    ],
    callbacks:{
        async signIn({user,account}) {
            if(account?.provider=="google")
            {
                await connectdb()
                let dbUser=await User.findOne({email:user.email})
                if(!dbUser){
                    dbUser=await User.create({
                        name:user.name,
                        email:user.email,
                        image:user.image,
                        role:"user"
                    })
                }
                user.id=dbUser._id.toString()
                user.role=dbUser.role
                user.mobile=dbUser.mobile
            }
            return true
        },
        jwt({token,user,trigger,session}) {
            if(user){
                token.id=user.id,
                token.name=user.name,
                token.email=user.email,
                token.role=user.role,
                token.mobile=user.mobile
            }
            if(trigger=="update"){
                token.role=session.role
            }
            return token
        },
        session({session,token}) {
            if(session.user){
                session.user.id=token.id as string,
                session.user.name=token.name as string,
                session.user.email=token.email as string,
                session.user.role=token.role as string,
                session.user.mobile=token.mobile as string
            }
            return session
        },
    },
    pages:{
        signIn:"/login",
        error:"/login"
    },
    session:{
        strategy:"jwt",
        maxAge:10*24*60*60
    },
    secret:process.env.AUTH_SECRET
})