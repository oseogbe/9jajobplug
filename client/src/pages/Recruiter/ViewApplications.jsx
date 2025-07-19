import React from 'react';

import { assets, viewApplicationsPageData } from '@/assets/assets';

const ViewApplications = () => {
  return (
    <div className="container">
      <table className="w-full bg-white rounded-xl shadow max-sm:text-sm">
        <thead>
          <tr className="border-b">
            <th className="py-2 px-4 text-left">#</th>
            <th className="py-2 px-4 text-left">Talent</th>
            <th className="py-2 px-4 text-left max-sm:hidden">Job Title</th>
            <th className="py-2 px-4 text-left max-sm:hidden">Location</th>
            <th className="py-2 px-4 text-left">Resume</th>
            <th className="py-2 px-4 text-left">Action</th>
          </tr>
        </thead>
        <tbody>
          {viewApplicationsPageData.map((applicant, i) => (
            <tr key={i} className="text-gray-700">
              <td className="py-2 px-4 border-b">{i + 1}</td>
              <td className="py-2 px-4 border-b text-center flex">
                <img
                  src={applicant.imgSrc}
                  alt=""
                  className="w-10 h-10 rounded-full mr-3 max-sm:hidden"
                />
                <span>{applicant.name}</span>
              </td>
              <td className="py-2 px-4 border-b max-sm:hidden">
                {applicant.jobTitle}
              </td>
              <td className="py-2 px-4 border-b max-sm:hidden">
                {applicant.location}
              </td>
              <td className="py-2 px-4 border-b">
                <a
                  href=""
                  target="_blank"
                  className="bg-primary-light/15 text-primary/80 px-3 py-1 rounded inline-flex items-center gap-2"
                >
                  Resume <img src={assets.resume_download_icon} alt="" />
                </a>
              </td>
              <td className="py-2 px-4 border-b relative">
                <div className="relative inline-block text-left group">
                  <button className="text-gray-500 action-button">...</button>
                  <div className="z-10 hidden absolute right-0 md:left-0 top-0 mt-2 w-32 bg-white border border-gray-200 rounded shadow group-hover:block">
                    <button className="block w-full text-left px-4 py-2 text-primary hover:bg-gray-100">
                      Accept
                    </button>
                    <button className="block w-full text-left px-4 py-2 text-red-500 hover:bg-gray-100">
                      Reject
                    </button>
                  </div>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ViewApplications;
