import React from 'react';
import { useNavigate } from 'react-router-dom';

import moment from 'moment';

import { manageJobsData } from '@/assets/assets';

const ManageJobs = () => {
  const navigate = useNavigate();

  return (
    <div className="container">
      <table className="w-full bg-white rounded-xl shadow max-sm:text-sm">
        <thead>
          <tr>
            <th className="py-2 px-4 border-b text-left max-sm:hidden">#</th>
            <th className="py-2 px-4 border-b text-left">Job Title</th>
            <th className="py-2 px-4 border-b text-left max-sm:hidden">Date</th>
            <th className="py-2 px-4 border-b text-left max-sm:hidden">
              Location
            </th>
            <th className="py-2 px-4 border-b text-center">Applicants</th>
            <th className="py-2 px-4 border-b text-left">Visible</th>
          </tr>
        </thead>
        <tbody>
          {manageJobsData.map((job, i) => (
            <tr key={i} className="text-gray-700">
              <td className="py-2 px-4 border-b max-sm:hidden">{i + 1}</td>
              <td className="py-2 px-4 border-b">{job.title}</td>
              <td className="py-2 px-4 border-b max-sm:hidden">
                {moment(job.date).format('ll')}
              </td>
              <td className="py-2 px-4 border-b max-sm:hidden">
                {job.location}
              </td>
              <td className="py-2 px-4 border-b text-center">
                {job.applicants}
              </td>
              <td className="py-2 px-4 border-b">
                <input type="checkbox" className="scale-125 ml-4" />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="mt-4 flex justify-end">
        <button
          onClick={() => navigate('/dashboard/add-job')}
          className="bg-black text-white py-2 px-4 rounded"
        >
          Add new job
        </button>
      </div>
    </div>
  );
};

export default ManageJobs;
