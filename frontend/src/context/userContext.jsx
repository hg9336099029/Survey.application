import React, { createContext, useState } from 'react';

// Create and export the context in one line
export const UserContext = createContext(null);

// Export the provider as a named export instead of default
function UserProvider({ children }) {
    const [user, setUser] = useState(null);

    // set user details example when user login
    const setUserDetails = (userData) => {
        setUser(userData);
    }

    // clear user details example when user logout
    const clearUserDetails = () => {
        setUser(null);
    }

    // get user details example when user login and user details is stored in local storage
    return (
        <UserContext.Provider value={{ user, setUserDetails, clearUserDetails }}>
            {children}
        </UserContext.Provider>
    );
}

export default UserProvider;