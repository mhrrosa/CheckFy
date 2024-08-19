import React, { createContext, useState, useEffect } from 'react';

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [userType, setUserType] = useState(() => {
    const storedUserType = localStorage.getItem('userType');
    const parsedUserType = storedUserType ? parseInt(storedUserType) : null;
    return parsedUserType;
  });

  useEffect(() => {
    if (userType !== null) {
      localStorage.setItem('userType', userType);
    } else {
      localStorage.removeItem('userType');
    }
  }, [userType]);

  return (
    <UserContext.Provider value={{ userType, setUserType }}>
      {children}
    </UserContext.Provider>
  );
};