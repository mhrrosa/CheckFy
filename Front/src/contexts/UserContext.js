import React, { createContext, useState, useEffect } from 'react';

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [userId, setUserId] = useState(() => sessionStorage.getItem('userId'));
  const [userType, setUserType] = useState(() => sessionStorage.getItem('userType'));

  useEffect(() => {
    if (userId) {
      sessionStorage.setItem('userId', userId);
    } else {
      sessionStorage.removeItem('userId');
    }
  }, [userId]);

  useEffect(() => {
    if (userType) {
      sessionStorage.setItem('userType', userType);
    } else {
      sessionStorage.removeItem('userType');
    }
  }, [userType]);

  return (
    <UserContext.Provider value={{ userId, setUserId, userType, setUserType }}>
      {children}
    </UserContext.Provider>
  );
};