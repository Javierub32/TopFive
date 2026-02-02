import React, { createContext, useState, useEffect, useContext } from 'react';
import { supabase } from '../lib/supabase';

const CollectionContext = createContext();

export const CollectionProvider = ({ children }) => {
	return (
		<CollectionContext.Provider value={{ }}>
			{children}
		</CollectionContext.Provider>
	);
};

export const useCollection = () => useContext(CollectionContext);