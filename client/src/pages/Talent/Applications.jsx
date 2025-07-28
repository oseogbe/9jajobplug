import React, { useState, useContext } from 'react';
import moment from 'moment';
import toast from 'react-hot-toast';

import { API_BASE_URL } from '@/utils/api';
import { AuthContext } from '@/context/AuthContext';
import Spinner from '@/components/Spinner';

import { assets, jobsApplied } from '@/assets/assets';

const Applications = () => {
  const [resume, setResume] = useState(null);
  const [isEditResume, setIsEditResume] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const { accessToken } = useContext(AuthContext);

  const handleUploadResume = async () => {
    if (!resume) {
      toast.error('Please select a resume to upload.');
      return;
    }

    const formData = new FormData();
    formData.append('resume', resume);

    setIsUploading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/talents/resume/upload`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Failed to upload resume');
      }

      toast.success('Resume uploaded successfully!');
      clearFileSelected();
    } catch (error) {
      toast.error(
        error.message || 'An error occurred while uploading the resume.',
      );
    } finally {
      setIsUploading(false);
    }
  };

  const clearFileSelected = () => {
    setIsEditResume(false);
    setResume(null);
  }

  return (
    <div className="container px-4 min-h-[65vh] 2xl:px-20 mx-auto my-10">
      <h2 className="text-xl font-semibold">Your Resume</h2>
      <div className='my-6'>
        {isEditResume ? (
          <>
            <div className="flex gap-2">
              <label className="flex items-center" htmlFor="resumeUpload">
                <p className="bg-primary/15 text-primary px-4 py-2 rounded-lg mr-2 cursor-pointer">
                  Select Resume
                </p>
                <input
                  id="resumeUpload"
                  type="file"
                  accept="application/pdf"
                  onChange={(e) => setResume(e.target.files[0])}
                  hidden
                />
                <img src={assets.profile_upload_icon} alt="" />
              </label>
              <button
                onClick={handleUploadResume}
                className="bg-green-100 border border-green-400 rounded-lg px-4 py-2"
                disabled={isUploading}
              >
                {isUploading ? <Spinner /> : 'Save'}
              </button>
              <button
                onClick={clearFileSelected}
                className="bg-gray-100 border border-gray-400 rounded-lg px-4 py-2"
                disabled={isUploading}
              >
                Cancel
              </button>
            </div>
            <div>
              {resume && (
                <p className="block text-sm text-gray-600 mt-2">
                  {resume.name}
                </p>
              )}
            </div>
          </>
        ) : (
          <div className="flex gap-2">
            <a
              href=""
              className="bg-primary/15 text-primary px-4 py-2 rounded-lg"
            >
              Resume
            </a>
            <button
              onClick={() => setIsEditResume(true)}
              className="text-gray-500 border border-gray-300 rounded-lg px-4 py-2"
            >
              Edit
            </button>
          </div>
        )}
      </div>
      <h2 className="text-xl font-semibold mb-4">Jobs Applied</h2>
      <table className="min-w-full bg-white border rounded-lg">
        <thead>
          <tr>
            <th className="py-3 px-4 border-b text-left">Business</th>
            <th className="py-3 px-4 border-b text-left">Job Title</th>
            <th className="py-3 px-4 border-b text-left max-sm:hidden">
              Location
            </th>
            <th className="py-3 px-4 border-b text-left max-sm:hidden">Date</th>
            <th className="py-3 px-4 border-b text-left">Status</th>
          </tr>
        </thead>
        <tbody>
          {jobsApplied.map((job, i) => (
            <tr key={i}>
              <td className="py-3 px-4 flex items-center gap-2 border-b">
                <img src={job.logo} alt="" className="w-8 h-8" />
                {job.business}
              </td>
              <td className="py-2 px-4 border-b">{job.title}</td>
              <td className="py-2 px-4 border-b">{job.location}</td>
              <td className="py-2 px-4 border-b">
                {moment(job.date).format('ll')}
              </td>
              <td className="py-2 px-4 border-b">
                <span
                  className={`${job.status === 'Accepted'
                    ? 'bg-green-100'
                    : job.status === 'Rejected'
                      ? 'bg-red-100'
                      : 'bg-yellow-100/70'
                    } px-4 py-1.5 rounded`}
                >
                  {job.status}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Applications;
