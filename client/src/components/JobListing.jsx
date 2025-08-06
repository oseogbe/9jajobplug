import React, { useContext, useEffect, useState } from 'react';
import { ListFilter, ChevronDown, ChevronUp } from 'lucide-react';
import toast from 'react-hot-toast';

import JobCard from './JobCard';
import { AppContext } from '@/context/AppContext';
import { API_BASE_URL } from '@/utils/api';

import { assets, JobCategories, JobLocations } from '@/assets/assets';

const JobListing = () => {
  const { isSearched, searchFilter, setSearchFilter } = useContext(AppContext);

  const [showFilter, setShowFilter] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const jobsPerPage = 12;
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [selectedLocations, setSelectedLocations] = useState([]);
  const [jobs, setJobs] = useState([]);
  const [filteredJobs, setFilteredJobs] = useState(jobs);
  const [isLoading, setIsLoading] = useState(true);
  const [expandedSections, setExpandedSections] = useState({
    categories: true,
    locations: false
  });

  useEffect(() => {
    const fetchJobs = async () => {
      setIsLoading(true);
      try {
        const response = await fetch(`${API_BASE_URL}/jobs/all?page=${currentPage}&limit=${jobsPerPage}`);
        if (!response.ok) {
          throw new Error('Failed to fetch jobs');
        }
        const data = await response.json();
        setJobs(data.data.jobs);
      } catch (error) {
        setJobs([]);
        setFilteredJobs([]);
        toast.error(error.message || 'Error fetching jobs. Try again later.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchJobs();
  }, [currentPage]);

  useEffect(() => {
    const matchesCategory = (job) =>
      selectedCategories.length === 0 || selectedCategories.includes(job.category);

    const matchesLocation = (job) =>
      selectedLocations.length === 0 || selectedLocations.includes(job.location);

    const matchesTitle = (job) =>
      searchFilter.title === '' || job.title.toLowerCase().includes(searchFilter.title.toLowerCase());

    const matchesSearchLocation = (job) =>
      searchFilter.location === '' || job.location.toLowerCase().includes(searchFilter.location.toLowerCase());

    const newFilteredJobs = jobs
      .slice()
      .reverse()
      .filter(
        (job) =>
          matchesCategory(job) &&
          matchesLocation(job) &&
          matchesTitle(job) &&
          matchesSearchLocation(job)
      );

    setFilteredJobs(newFilteredJobs);
    setCurrentPage(1);
  }, [jobs, selectedCategories, selectedLocations, searchFilter]);

  const handleCategoryChange = (category) => {
    setSelectedCategories((prev) =>
      prev.includes(category)
        ? prev.filter((c) => c !== category)
        : [...prev, category]
    );
  };

  const handleLocationChange = (location) => {
    setSelectedLocations((prev) =>
      prev.includes(location)
        ? prev.filter((c) => c !== location)
        : [...prev, location]
    );
  };

  return (
    <div className="container 2xl:px-20 mx-auto flex flex-col lg:flex-row max-lg:space-y-8 py-8">
      {/* sidebar */}
      <div className="w-full lg:w-1/4 bg-white px-4">
        {/* filter values from hero search form */}
        {isSearched &&
          (searchFilter.title !== '' || searchFilter.location !== '') && (
            <>
              <h3 className="font-medium text-lg mb-4">Current Search</h3>
              <div className="mb-4 text-gray-600">
                {searchFilter.title && (
                  <span className="inline-flex items-center gap-2.5 bg-primary/10 border border-primary-light px-4 py-1.5 rounded">
                    {searchFilter.title}
                    <img
                      src={assets.cross_icon}
                      className="cursor-pointer"
                      alt=""
                      onClick={() =>
                        setSearchFilter((prev) => ({ ...prev, title: '' }))
                      }
                    />
                  </span>
                )}
                {searchFilter.location && (
                  <span className="ml-2 inline-flex items-center gap-2.5 bg-red-50 border border-red-200 px-4 py-1.5 rounded">
                    {searchFilter.location}
                    <img
                      src={assets.cross_icon}
                      className="cursor-pointer"
                      alt=""
                      onClick={() =>
                        setSearchFilter((prev) => ({ ...prev, location: '' }))
                      }
                    />
                  </span>
                )}
              </div>
            </>
          )}

        <button
          onClick={() => setShowFilter((prev) => !prev)}
          className="px-4 py-1.5 rounded border border-gray-400 lg:hidden"
        >
          <ListFilter className="inline-block" />
        </button>

        {/* category filter */}
        <div className={showFilter ? '' : 'max-lg:hidden'}>
          <button 
            onClick={() => setExpandedSections(prev => ({ ...prev, categories: !prev.categories }))}
            className="w-full flex items-center font-medium text-lg py-4"
          >
            <span className='mr-3'>Search by Categories</span>
            {expandedSections.categories ? <ChevronUp size={20} className='mt-1' /> : <ChevronDown size={20} className='mt-1' />}
          </button>
          <ul className={`space-y-4 text-gray-600 transition-all duration-300 ${expandedSections.categories ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0 overflow-hidden'}`}>
            {JobCategories.map((category, i) => (
              <li key={i} className="flex gap-3 items-center">
                <input
                  type="checkbox"
                  className="scale-125"
                  onChange={() => handleCategoryChange(category)}
                  checked={selectedCategories.includes(category)}
                />
                {category}
              </li>
            ))}
          </ul>
        </div>

        {/* location filter */}
        <div className={showFilter ? '' : 'max-lg:hidden'}>
          <button 
            onClick={() => setExpandedSections(prev => ({ ...prev, locations: !prev.locations }))}
            className="w-full flex items-center font-medium text-lg py-4 pt-14"
          >
            <span className='mr-3'>Search by State</span>
            {expandedSections.locations ? <ChevronUp size={20} className='mt-1' /> : <ChevronDown size={20} className='mt-1' />}
          </button>
          <ul className={`space-y-4 text-gray-600 transition-all duration-300 ${expandedSections.locations ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0 overflow-hidden'}`}>
            {JobLocations.map((location, i) => (
              <li key={i} className="flex gap-3 items-center">
                <input
                  type="checkbox"
                  className="scale-125"
                  onChange={() => handleLocationChange(location)}
                  checked={selectedLocations.includes(location)}
                />
                {location}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* job listings */}
      <section className="w-full lg:w-3/4 text-gray-800 max-lg:px-4">
        <h3 className="font-medium text-3xl py-2" id="job-list">
          Latest jobs
        </h3>
        <p className="mb-8">Get your desired job from top companies</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
          {isLoading
            ? Array.from({ length: jobsPerPage }).map((_, i) => (
              <JobCard key={i} isLoading={true} />
            ))
            : filteredJobs
              .slice((currentPage - 1) * jobsPerPage, currentPage * jobsPerPage)
              .map((job, i) => <JobCard key={i} job={job} />)}
        </div>

        {/* pagination */}
        {filteredJobs.length > 0 && !isLoading && (
          <div className="flex items-center justify-center space-x-2 mt-10">
            <a
              href="#job-list"
              onClick={() => setCurrentPage(Math.max(currentPage - 1, 1))}
            >
              <img src={assets.left_arrow_icon} alt="" />
            </a>
            {Array.from({ length: Math.ceil(filteredJobs.length / jobsPerPage) }).map(
              (_, i) => (
                <a key={i} href="#job-list">
                  <button
                    onClick={() => setCurrentPage(i + 1)}
                    className={`w-10 h-10 items-center justify-center border border-gray-300 rounded ${currentPage === i + 1 ? 'bg-primary-light/30 text-primary' : 'text-gray-500'}`}
                  >
                    {i + 1}
                  </button>
                </a>
              )
            )}
            <a
              href="#job-list"
              onClick={() =>
                setCurrentPage(
                  Math.min(
                    currentPage + 1,
                    Math.ceil(filteredJobs.length / jobsPerPage)
                  )
                )
              }
            >
              <img src={assets.right_arrow_icon} alt="" />
            </a>
          </div>
        )}
      </section>
    </div>
  );
};

export default JobListing;
