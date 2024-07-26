import { useState,  useContext, createContext } from "react";

const SearchContext = createContext();
const SearchProvider = ({ children }) => {
  const [auth, setAuth] = useState({
    keyword:"",
    results:[],
  });

  //default axios
  
  return (
    <SearchContext.Provider value={[auth, setAuth]}>
      {children}
    </SearchContext.Provider>
  );
};

// custom hook
const useSearch = () => useContext(SearchContext);

export { useSearch, SearchProvider };