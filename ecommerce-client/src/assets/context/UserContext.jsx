import React, { useState, createContext, useEffect } from 'react'

export const UserContextData = createContext()

function UserContext({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  // Default user structure with all important fields
  const defaultUser = {
    id: null,
    fullname: '',
    email: '',
    phone: '',
    address: '',
    profileImage: null,
    createdAt: null,
  }

  // Load user from localStorage on component mount
  useEffect(() => {
    const storedUser = localStorage.getItem('user')
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser))
      } catch (error) {
        console.error('Failed to parse stored user:', error)
        clearUser()
      }
    }
    setLoading(false)
  }, [])

  // Update user information and save to localStorage
  const updateUser = (newUser) => {
    const updatedUser = { ...defaultUser, ...user, ...newUser }
    setUser(updatedUser)
    localStorage.setItem('user', JSON.stringify(updatedUser))
  }

  // Update specific user fields
  const updateUserField = (field, value) => {
    updateUser({ [field]: value })
  }

  // Clear user data (logout)
  const clearUser = () => {
    setUser(null)
    localStorage.removeItem('user')
    localStorage.removeItem('token')
    localStorage.removeItem('rememberMe')
  }

  // Check if user is logged in
  const isLoggedIn = () => {
    return user !== null && user.id !== null
  }

  const value = {
    user,
    loading,
    updateUser,
    updateUserField,
    clearUser,
    isLoggedIn,
  }

  return (
    <UserContextData.Provider value={value}>
      {children}
    </UserContextData.Provider>
  )
}

export default UserContext