import React, { useEffect, useRef, useState } from 'react';

import Quill from 'quill';

import { JobCategories, JobLocations } from '@/assets/assets';

const AddJob = () => {
  const [title, setTitle] = useState('');
  const [location, setLocation] = useState('Abuja');
  const [category, setCategory] = useState('Programming');
  const [level, setLevel] = useState('Beginner level');
  const [salary, setSalary] = useState(0);

  const editorRef = useRef(null);
  const quillRef = useRef(null);

  useEffect(() => {
    // initiate quill once
    if (!quillRef.current && editorRef.current) {
      quillRef.current = new Quill(editorRef.current, {
        theme: 'snow',
      });
      // Add Tailwind classes to the Quill toolbar
      const container = quillRef.current.root.parentElement;
      const toolbar = container.previousSibling;
      if (toolbar && toolbar.classList.contains('ql-toolbar')) {
        toolbar.classList.add('!border-2', '!border-gray-300', 'rounded-t');
      }
      // Add Tailwind classes to the Quill editor container
      quillRef.current.root.parentElement.classList.add(
        'min-h-[200px]',
        '!border-2',
        '!border-gray-300',
        'rounded-b'
      );
    }
  }, []);

  return (
    <div className="container">
      <div className='w-full bg-white rounded-xl shadow max-sm:text-sm p-4'>
        <form className="flex flex-col items-start gap-3">
          <div className="w-full">
            <p className="mb-2">Job Title</p>
            <input
              type="text"
              placeholder="Type here"
              onChange={(e) => setTitle(e.target.value)}
              value={title}
              className="w-full max-w-lg px-3 py-2 border-2 border-gray-300 rounded"
            />
          </div>

          <div className="w-full max-w-lg">
            <p className="my-2">Job Description</p>
            <div ref={editorRef}></div>
          </div>

          <div className="flex flex-col sm:flex-row gap-2 w-full sm:gap-8">
            <div>
              <p className="my-2">Job Category</p>
              <select
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-3 py-2 bg-white border-2 border-gray-300 rounded"
              >
                {JobCategories.map((category, i) => (
                  <option key={i} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <p className="my-2">Job Location</p>
              <select
                onChange={(e) => setLocation(e.target.value)}
                className="w-full px-3 py-2 bg-white border-2 border-gray-300 rounded"
              >
                {JobLocations.map((location, i) => (
                  <option key={i} value={location}>
                    {location}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <p className="my-2">Job Level</p>
              <select
                onChange={(e) => setLevel(e.target.value)}
                className="w-full px-3 py-2 bg-white border-2 border-gray-300 rounded"
              >
                <option value="Beginner Level">Beginner Level</option>
                <option value="Intermediate Level">Intermediate Level</option>
                <option value="Senior Level">Senior Level</option>
              </select>
            </div>
          </div>

          <div>
            <p className="my-2">Job Salary</p>
            <input
              type="number"
              placeholder="0"
              min={0}
              onChange={(e) => setSalary(e.target.value)}
              className="w-full px-3 py-2 border-2 border-gray-300 sm:w-[145px] rounded"
            />
          </div>

          <button className="w-28 py-3 mt-4 bg-black text-white uppercase rounded">
            Add
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddJob;
