import { SearchResult } from "@/Add/adapters/searchResultsAdapter";
import { ResourceType } from "hooks/useResource";
import { createContext, useContext, useState } from "react";


interface SearchContextType {
  // --- Buscador de Contenido (Add Tab) ---
  contentQuery: string;
  setContentQuery: (query: string) => void;
  contentCategory: ResourceType;
  setContentCategory: (category: ResourceType) => void;
  contentResults: SearchResult[];
  setContentResults: (results: SearchResult[]) => void;
  clearContentSearch: () => void;

  // --- Buscador de Usuarios ---
  userQuery: string;
  setUserQuery: (query: string) => void;
  userResults: any[];
  setUserResults: (results: any[]) => void;
  activeUserSearch: string;
  setActiveUserSearch: (search: string) => void;
  clearUserSearch: () => void;
}

const SearchContext = createContext<SearchContextType | undefined>(undefined);



export const SearchProvider = ({ children }: any) => {
  const[contentQuery, setContentQuery] = useState('');
  const [contentCategory, setContentCategory] = useState<ResourceType>('pelicula');
  const [contentResults, setContentResults] = useState<SearchResult[]>([]);

  const[userQuery, setUserQuery] = useState('');
  const [userResults, setUserResults] = useState<any[]>([]);
  const [activeUserSearch, setActiveUserSearch] = useState('');

  const clearContentSearch = () => {
    setContentQuery('');
    setContentResults([]);
  };

  const clearUserSearch = () => {
    setUserQuery('');
    setUserResults([]);
    setActiveUserSearch('');
  };

  return (
	<SearchContext.Provider
	  value={{
		contentQuery,
		setContentQuery,
		contentCategory,
		setContentCategory,
		contentResults,
		setContentResults,
		userQuery,
		setUserQuery,
		activeUserSearch,
		setActiveUserSearch,
		userResults,
		setUserResults,
		clearContentSearch,
		clearUserSearch
	  }}>

	  {children}
	</SearchContext.Provider>
  );
};

export const useSearch = () => {
  const context = useContext(SearchContext);
  if (!context) {
    throw new Error('useSearch debe ser usado dentro de un SearchProvider');
  }
  return context;
};