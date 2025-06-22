import { jobsData } from '@/assets/assets';
import { createContext, useEffect, useState } from 'react';

export const AppContext = createContext();

export const AppContextProvider = (props) => {
  const [searchFilter, setSearchFilter] = useState({
    title: '',
    location: '',
  });

  const [isSearched, setIsSearched] = useState(false);

  const [jobs, setJobs] = useState([])

  // fetch jobs
  const fetchJobs = async () => {
    setJobs(jobsData)
  }

  useEffect(() => {
    fetchJobs()
  }, [])

  const value = {
    setSearchFilter,
    searchFilter,
    setIsSearched,
    isSearched,
    setJobs,
    jobs
  };

  return (
    <AppContext.Provider value={value}>{props.children}</AppContext.Provider>
  );
};
