import React from 'react';
import { MainContainerProps } from '../types';

const MainContainer: React.FC<MainContainerProps> = ({ children }) => {
  return (
    <main className="container mx-auto px-4 py-8">
      {children}
    </main>
  );
};

export default MainContainer;
