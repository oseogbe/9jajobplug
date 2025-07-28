import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import kConvert from 'k-convert';
import moment from 'moment';
import toast from 'react-hot-toast';

import Loading from '@/components/Loading';
import JobCard from '@/components/JobCard';
import { API_BASE_URL } from '@/utils/api';

import { assets } from '@/assets/assets';

const ApplyJob = () => {
  const { slug } = useParams();

  const [JobData, setJobData] = useState(null);
  const [relatedJobs, setRelatedJobs] = useState([]);

  useEffect(() => {
    const fetchJob = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/jobs/single/${slug}`);
        if (!response.ok) {
          throw new Error('Failed to fetch job');
        }
        const data = await response.json();
        setJobData(data.data.job);

        // Fetch related jobs from the new endpoint
        const related = await fetch(
          `${API_BASE_URL}/jobs/related?businessId=${data.data.job.business.id}&excludeSlug=${slug}`,
        );
        if (related.ok) {
          const relatedData = await related.json();
          setRelatedJobs(relatedData.data.jobs);
        } else {
          throw new Error('Failed to fetch related jobs');
        }
      } catch (error) {
        toast.error(error.message || 'An error occurred. Try again later.');
        setJobData(null);
        setRelatedJobs([]);
      }
    };

    fetchJob();
  }, [slug]);

  return JobData ? (
    <div className="min-h-screen flex flex-col py-10 container px-4 2xl:px-20 mx-auto">
      <div className="bg-white text-black rounded-lg w-full">
        <div className="flex justify-center md:justify-between flex-wrap gap-8 px-14 py-20 mb-6 bg-primary/15 border border-primary/80 rounded-xl">
          <div className="flex flex-col md:flex-row items-center">
            <img
              src={JobData.business.logo || assets.company_icon}
              alt=""
              className="h-24 bg-white rounded-lg mr-4 max-md:mb-4 border"
            />
            <div className="text-center md:text-left text-neutral-700">
              <h1 className="text-2xl sm:text-4xl font-medium">
                {JobData.title}
              </h1>
              <div className="flex flex-row flex-wrap max-md:justify-center gap-y-2 gap-6 items-center text-gray-600 mt-2">
                <span className="flex items-center gap-1">
                  <img src={assets.suitcase_icon} alt="" />
                  {JobData.business.name}
                </span>
                <span className="flex items-center gap-1">
                  <img src={assets.location_icon} alt="" />
                  {JobData.location}
                </span>
                <span className="flex items-center gap-1">
                  <img src={assets.person_icon} alt="" />
                  {JobData.level}
                </span>
                <span className="flex items-center gap-1">
                  <img src={assets.money_icon} alt="" />
                  CTC: {kConvert.convertTo(JobData.salary)}
                </span>
              </div>
            </div>
          </div>
          <div className="flex flex-col justify-center text-end text-sm max-md:mx-auto max-md:text-center">
            <button className="bg-primary p-2.5 px-10 text-white rounded">
              Apply now
            </button>
            <p className="mt-1 text-gray-600">
              Posted {moment(JobData.date).fromNow()}
            </p>
          </div>
        </div>
        <div className="flex flex-col lg:flex-row justify-between items-start">
          <div className="w-full lg:w-2/3">
            <h2 className="font-bold text-2xl mb-4">Job description</h2>
            <div
              className="rich-text"
              dangerouslySetInnerHTML={{ __html: JobData.description }}
            ></div>
            <button className="bg-primary p-2.5 px-10 text-white rounded mt-10">
              Apply now
            </button>
          </div>
          {/* right section more jobs */}
          <div className="w-full lg:w-1/3 mt-8 lg:mt-0 lg:ml-8 space-y-5">
            <h2 className="font-medium text-lg">
              More jobs from {JobData.business.name}
            </h2>
            {relatedJobs.slice(0, 4).map((job, i) => (
              <JobCard key={i} job={job} />
            ))}
          </div>
        </div>
      </div>
    </div>
  ) : (
    <Loading />
  );
};

export default ApplyJob;
