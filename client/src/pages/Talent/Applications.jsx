import { assets, jobsApplied } from '@/assets/assets';
import moment from 'moment';
import React, { useState } from 'react';

const Applications = () => {
  const [isEditResume, setIsEditResume] = useState(false);
  const [resume, setResume] = useState(null);
  
  return (
    <div className="container px-4 min-h-[65vh] 2xl:px-20 mx-auto my-10">
      <h2 className="text-xl font-semibold">Your Resume</h2>
      <div className="flex gap-2 mb-6 mt-6">
        {isEditResume ? (
          <>
            <label className="flex items-center" htmlFor="resumeUpload">
              <p className="bg-primary/15 text-primary px-4 py-2 rounded-lg mr-2">
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
              onClick={() => setIsEditResume(false)}
              className="bg-green-100 border border-green-400 rounded-lg px-4 py-2"
            >Save</button>
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
          {jobsApplied.map((job, i) =>
            true ? (
              <tr>
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
                  <span className={`${job.status === 'Accepted' ? 'bg-green-100' : job.status === 'Rejected' ? 'bg-red-100' : 'bg-yellow-100/70'} px-4 py-1.5 rounded`}>
                  {job.status}
                  </span>
                </td>
              </tr>
            ) : null,
          )}
        </tbody>
      </table>
    </div>
  );
};

export default Applications;
