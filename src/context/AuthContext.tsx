import { createContext, useContext, useEffect, useState } from "react";
import {User} from "@supabase/supabase-js";
import { supabase } from "../supabase-client";
interface AuthContextType{
    user: User | null
    signInWithGitHub: ()=>void
    signOut: ()=>void
}
const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const AuthProvider = ({children}:{children:React.ReactNode}) => {
    const [user, setUser] = useState<User | null>(null)
    
    useEffect(()=>{
        supabase.auth.getSession().then(({data: {session}})=>{
            setUser(session?.user ?? null)
        })

        const {data: listener} = supabase.auth.onAuthStateChange((_, session)=>{
            setUser(session?.user ?? null)
        })

        return () => {
            listener.subscription.unsubscribe();
        }
    }, [])
    
    function signInWithGitHub(){
        supabase.auth.signInWithOAuth({provider: 'github'})
    }
    function signOut(){
        supabase.auth.signOut()
    }
    return <AuthContext.Provider value={{user, signInWithGitHub, signOut}}>{children}</AuthContext.Provider>
}

export const useAuth = ():AuthContextType => {
    const context = useContext(AuthContext)
    if(context === undefined){
        throw new Error('User must use useAuth with AuthProvider')
    }
    return context 
}