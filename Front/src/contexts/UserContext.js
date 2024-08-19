import React, { createContext, useState, useEffect } from 'react';

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [userType, setUserType] = useState(() => {
    const storedUserType = localStorage.getItem('userType');
    const parsedUserType = storedUserType ? parseInt(storedUserType) : null;
    console.log('Valor inicial de userType:', parsedUserType);
    return parsedUserType;
  });

  useEffect(() => {
    console.log('userType atualizado:', userType);
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