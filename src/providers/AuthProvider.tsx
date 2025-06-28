"use client"

import { createContext, useContext, useEffect, useState } from 'react'

type User = {
  id: string
  email: string
  name: string
  role: string
}

type AuthContextType = {
  user: User | null
  token: string | null
  isLoading: boolean
  signIn: (token: string, user: User) => void
  signOut: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [token, setToken] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    try {
      const storedUser = localStorage.getItem('user')
      const storedToken = localStorage.getItem('token')
      
      if (storedToken) {
        setToken(storedToken)
      }
      
      if (storedUser) {
        // Vérifier si storedUser est bien un JSON valide
        const parsedUser = JSON.parse(storedUser)
        if (parsedUser && typeof parsedUser === 'object') {
          setUser(parsedUser)
        } else {
          console.warn('Données utilisateur invalides dans le localStorage')
          localStorage.removeItem('user')
        }
      }
    } catch (error) {
      console.error('Erreur lors du parsing des données utilisateur:', error)
      // En cas d'erreur, on nettoie le localStorage
      localStorage.removeItem('user')
      localStorage.removeItem('token')
    } finally {
      setIsLoading(false)
    }
  }, [])

  const signIn = (newToken: string, userData: User) => {
    localStorage.setItem('token', newToken)
    localStorage.setItem('user', JSON.stringify(userData))
    setToken(newToken)
    setUser(userData)
  }

  const signOut = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, token, isLoading, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
