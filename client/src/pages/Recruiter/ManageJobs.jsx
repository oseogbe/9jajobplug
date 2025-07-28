import React, { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Briefcase } from 'lucide-react';
import moment from 'moment';
import toast from 'react-hot-toast';

import { AuthContext } from '@/context/AuthContext';
import { API_BASE_URL } from '@/utils/api';

const ManageJobs = () => {
  const [jobs, setJobs] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalJobs, setTotalJobs] = useState(0);
  const { accessToken } = useContext(AuthContext);
  const navigate = useNavigate();
  const jobsPerPage = 10;

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const response = await fetch(
          `${API_BASE_URL}/jobs/recruiter-jobs?page=${currentPage}&limit=${jobsPerPage}`,
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );
        if (!response.ok) {
          throw new Error('Failed to fetch jobs');
        }
        const data = await response.json();
        setJobs(data.data.jobs);
        setTotalJobs(data.data.total);
      } catch (error) {
        setJobs([]);
        setTotalJobs(0);
        toast.error(error.message || 'Error fetching jobs. Try again later.');
      }
    };

    fetchJobs();
  }, [currentPage, accessToken]);

  const totalPages = Math.ceil(totalJobs / jobsPerPage);

  if (jobs.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-center">
        <Briefcase className="w-16 h-16 text-gray-400 mb-6" />
        <h2 className="text-2xl font-semibold text-gray-700 mb-4">No Jobs Found</h2>
        <p className="text-gray-500 mb-6">You haven't created any jobs yet. Start by adding a new job to attract talents.</p>
        <button
          onClick={() => navigate('/dashboard/manage-jobs/add')}
          className="px-6 py-3 bg-primary text-white rounded-lg font-medium hover:bg-primary-dark transition"
        >
          Add New Job
        </button>
      </div>
    );
  }

  return (
    <div className="container">
      <table className="w-full bg-white rounded-xl shadow max-sm:text-sm">
        <thead>
          <tr>
            <th className="py-2 px-4 border-b text-left max-sm:hidden">#</th>
            <th className="py-2 px-4 border-b text-left">Job Title</th>
            <th className="py-2 px-4 border-b text-left">Level</th>
            <th className="py-2 px-4 border-b text-left max-sm:hidden">Date</th>
            <th className="py-2 px-4 border-b text-left max-sm:hidden">Location</th>
            <th className="py-2 px-4 border-b text-center">Applicants</th>
            <th className="py-2 px-4 border-b text-left">Visible</th>
          </tr>
        </thead>
        <tbody>
          {jobs.map((job, i) => (
            <tr key={job.id} className="text-gray-700">
              <td className="py-2 px-4 border-b max-sm:hidden">{i + 1}</td>
              <td className="py-2 px-4 border-b">{job.title}</td>
              <td className="py-2 px-4 border-b">{job.level}</td>
              <td className="py-2 px-4 border-b max-sm:hidden">
                {moment(job.createdAt).format('ll')}
              </td>
              <td className="py-2 px-4 border-b max-sm:hidden">{job.location}</td>
              <td className="py-2 px-4 border-b text-center">{job.applicants || 0}</td>
              <td className="py-2 px-4 border-b">
                <input type="checkbox" className="scale-125 ml-4" defaultChecked={job.isVisible} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="mt-4 flex justify-between items-center">
        <button
          disabled={currentPage === 1}
          onClick={() => setCurrentPage((prev) => prev - 1)}
          className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-400 transition disabled:opacity-50"
        >
          Previous
        </button>
        <span>
          Page {currentPage} of {totalPages}
        </span>
        <button
          disabled={currentPage === totalPages}
          onClick={() => setCurrentPage((prev) => prev + 1)}
          className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-400 transition disabled:opacity-50"
        >
          Next
        </button>
      </div>
      <div className="mt-4 flex justify-end">
        <button
          onClick={() => navigate('/dashboard/manage-jobs/add')}
          className="px-4 py-2 bg-primary text-white rounded-lg font-medium hover:bg-primary-dark transition"
        >
          Add new job
        </button>
      </div>
    </div>
  );
};

export default ManageJobs;
