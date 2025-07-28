import React from 'react';
import { useNavigate } from 'react-router-dom';

import { assets } from '@/assets/assets';

const JobCard = ({ job, isLoading }) => {
  const navigate = useNavigate();

  if (isLoading) {
    return (
      <div className="border p-6 shadow rounded animate-pulse">
        <div className="flex justify-between items-center">
          <div className="h-8 w-8 bg-gray-300 rounded"></div>
        </div>
        <div className="h-6 bg-gray-300 rounded mt-2"></div>
        <div className="flex items-center gap-3 mt-2">
          <div className="h-4 w-20 bg-gray-300 rounded"></div>
          <div className="h-4 w-20 bg-gray-300 rounded"></div>
        </div>
        <div className="h-4 bg-gray-300 rounded mt-4"></div>
        <div className="h-4 bg-gray-300 rounded mt-2"></div>
        <div className="mt-4 flex gap-4">
          <div className="h-10 w-24 bg-gray-300 rounded"></div>
          <div className="h-10 w-24 bg-gray-300 rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="border p-6 shadow rounded">
      <div className="flex justify-between items-center">
        <img src={assets.company_icon} alt="" className="h-8" />
      </div>
      <h4 className="font-medium text-xl mt-2">{job.title}</h4>
      <div className="flex items-center gap-3 mt-2 text-xs">
        <span className="bg-primary-light/15 border border-primary-light px-4 py-1.5 rounded">{job.location}</span>
        <span className="bg-red-50 border border-red-200 px-4 py-1.5 rounded">{job.level}</span>
      </div>
      <p dangerouslySetInnerHTML={{ __html: job.description.slice(0, 250) + '...' }} className="text-gray-500 text-sm mt-4"></p>
      <div className="mt-4 flex gap-4 text-sm">
        <button onClick={() => { navigate(`/apply-job/${job.slug}`); scrollTo(0, 0); }} className="bg-primary/80 text-white px-4 py-2 rounded">Apply now</button>
        <button onClick={() => { navigate(`/apply-job/${job.slug}`); scrollTo(0, 0); }} className="text-gray-500 border border-gray-500 px-4 py-2 rounded">Learn more</button>
      </div>
    </div>
  );
};

export default JobCard;
