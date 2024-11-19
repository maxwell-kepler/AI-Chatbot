import React, { createContext, useContext, useState } from 'react';

const TabBarVisibilityContext = createContext();

export const useTabBarVisibility = () => {
    const context = useContext(TabBarVisibilityContext);
    if (!context) {
        throw new Error('useTabBarVisibility must be used within a TabBarVisibilityProvider');
    }
    return context;
};

export const TabBarVisibilityProvider = ({ children }) => {
    const [isTabBarVisible, setIsTabBarVisible] = useState(true);

    return (
        <TabBarVisibilityContext.Provider value={{ isTabBarVisible, setIsTabBarVisible }}>
            {children}
        </TabBarVisibilityContext.Provider>
    );
};

export default TabBarVisibilityProvider;