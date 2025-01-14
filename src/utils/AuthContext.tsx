import React, { createContext, useContext, useReducer, ReactNode, useEffect } from "react";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";

// state type
export interface AuthState {
    isSignedIn: boolean;
    }

// action type
export type AuthAction = { type: "signin"} | { type: "logout" };

// context type
interface AuthContextType {
    state: AuthState;
    dispatch: React.Dispatch<AuthAction>;
}

// context creation
const AuthContext = createContext<AuthContextType | undefined>(undefined);


// reducer function
const authReducer = (state: AuthState, action: AuthAction): AuthState => {
    switch (action.type) {
        case "signin":
            return { isSignedIn: true };
        case "logout":
            return { isSignedIn: false };
        default:
            return state;
    }
};

// provider props
interface AuthProviderProps {
    children: ReactNode;
}

// provider component
export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
    const authToken = Cookies.get("authToken");
    const initialAuthState: AuthState = {
        isSignedIn: authToken? true : false,
    };
    const [state, dispatch] = useReducer(authReducer, initialAuthState);
    const router = useRouter();
    
    useEffect(() => {
        
        if (!state.isSignedIn) {
            router.push('/authentication/signin');
        }
    }, [state.isSignedIn, router]);

    
    return (

        <AuthContext.Provider value={{ state, dispatch }}>
            {children}
        </AuthContext.Provider>

    );
}


export const useAuth = (): AuthContextType => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error("useAuth must be used within a AuthProvider");
    }
    return context;
};
