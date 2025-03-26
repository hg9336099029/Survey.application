import React, { useState, useEffect } from 'react';
import { DashboardLayout } from '../../components/layout/dashboardLayout';
import FilterDropdown from '../../components/layout/filter';
import { axiosInstance } from '../../utils/axiosInstance';
import { API_PATH } from '../../utils/apipath';

const Home = () => {
  // State to store all polls
  const [polls, setPolls] = useState([]);
  // State to store filtered polls based on the selected filter
  const [filteredPolls, setFilteredPolls] = useState([]);
  // State to store the currently selected filter
  const [selectedFilter, setSelectedFilter] = useState('All-polls');
  
  // useEffect hook to fetch polls when the component mounts
  useEffect(() => {
    // Fetch polls from the backend
    const fetchPolls = async () => {
      try {
        const response = await axiosInstance.get(API_PATH.AUTH.GET_POLLS);
        const fetchedPolls = response.data.polls;
        // Set the fetched polls to the polls state
        setPolls(fetchedPolls);
        // Initially, set the filtered polls to be the same as all polls
        setFilteredPolls(fetchedPolls);
      } catch (error) {
        console.error('Error fetching polls:', error);
      }
    };

    fetchPolls();
  }, []);
  
  // Function to handle filter selection
  const handleFilterSelect = (filter) => {
    // Update the selected filter state
    setSelectedFilter(filter);
    // Filter the polls based on the selected filter
    if (filter === "Yes/No") {
      setFilteredPolls(polls.filter(poll => poll.pollType === "yesno"));
    } else if (filter === "Single choice") {
      setFilteredPolls(polls.filter(poll => poll.pollType === "single choice"));
    } else if (filter === "Rating") {
      setFilteredPolls(polls.filter(poll => poll.pollType === "rating"));
    } else if (filter === "Image-based") {
      setFilteredPolls(polls.filter(poll => poll.pollType === "imagebased"));
    } else if (filter === "Open-Ended") {
      setFilteredPolls(polls.filter(poll => poll.pollType === "open ended"));
    } else {
      // If no specific filter is selected, show all polls
      setFilteredPolls(polls);
    }
  };

  return (
    <DashboardLayout>
      <div className="flex-1 flex-col items-center justify-center mx-auto w-screen sm:w-full">
        {/* Pass the handleFilterSelect function to the FilterDropdown component */}
        <FilterDropdown onFilterSelect={handleFilterSelect} />
        <div className="flex flex-col mt-4 mx-auto w-full">
          {polls.length === 0 ? (
            <p className="text-center text-gray-500">No poll exists</p>
          ) : (
            filteredPolls.map((poll) => (
              <div key={poll._id} className="h-auto m-2 border-2 border-gray-100 bg-white rounded-md p-5 shadow-2xl w-full">
                <div className="flex items-center mb-2">
                  <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center font-bold">
                    {poll.createdBy && poll.createdBy.username && poll.createdBy.username.charAt(0)}
                  </div>
                  <div className="ml-3">
                    <p className="font-semibold">{"@" + (poll.createdBy && poll.createdBy.username)}</p>
                    <p className="text-sm text-gray-500">{new Date(poll.createdAt).toLocaleString()}</p>
                  </div>
                </div>

                <p className="font-medium text-lg mb-2">{poll.question}</p>

                {poll.pollType === "yesno" && (
                  <div className="space-y-2">
                    <div className="flex items-center mb-4">
                      <input disabled id="disabled-radio-1" type="radio" value="" name="disabled-radio" className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600 cursor-pointer" />
                      <label htmlFor="disabled-radio-1" className="ms-2 text-sm font-medium text-gray-400 dark:text-gray-500">Yes</label>
                    </div>

                    <div className="flex items-center">
                      <input disabled checked id="disabled-radio-2" type="radio" value="" name="disabled-radio" className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600 cursor-pointer" />
                      <label htmlFor="disabled-radio-2" className="ms-2 text-sm font-medium text-gray-400 dark:text-gray-500">No</label>
                    </div>
                  </div>
                )}

                {poll.pollType === "rating" && (
                  <div className="space-y-2">
                    <div className="flex items-center mb-2">
                      {[...Array(5)].map((_, index) => (
                        <svg
                          key={index}
                          className={`w-4 h-4 ${index < poll.rating ? 'text-yellow-300' : 'text-gray-300'} me-1 cursor-pointer`}
                          aria-hidden="true"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="currentColor"
                          viewBox="0 0 22 20"
                        >
                          <path d="M20.924 7.625a1.523 1.523 0 0 0-1.238-1.044l-5.051-.734-2.259-4.577a1.534 1.534 0 0 0-2.752 0L7.365 5.847l-5.051.734A1.535 1.535 0 0 0 1.463 9.2l3.656 3.563-.863 5.031a1.532 1.532 0 0 0 2.226 1.616L11 17.033l4.518 2.375a1.534 1.534 0 0 0 2.226-1.617l-.863-5.03L20.537 9.2a1.523 1.523 0 0 0 .387-1.575Z" />
                        </svg>
                      ))}
                      <p className="ms-1 text-sm font-medium text-gray-500 dark:text-gray-400">{poll.rating}</p>
                      <p className="ms-1 text-sm font-medium text-gray-500 dark:text-gray-400">out of</p>
                      <p className="ms-1 text-sm font-medium text-gray-500 dark:text-gray-400">5</p>
                    </div>
                  </div>
                )}

                {poll.pollType === "single choice" && (
                  <div className="space-y-2">
                    {poll.options.map((option, index) => (
                      <button key={index} className="w-full text-left border rounded-md py-2 px-4 bg-gray-100">
                        {option.text}
                      </button>
                    ))}
                  </div>
                )}

                {poll.pollType === "open ended" && (
                  <div className="h-auto space-y-2">
                    <textarea name="" id="" placeholder='please comment here' className='flex flex-col justify-center items-center w-1/2 h-auto bg-slate-50 border-2 border-gray-200 rounded-xl p-2'></textarea>
                    <button class="bg-sky-400 hover:transition-transform transform hover:scale-105  text-white font-sans py-1 px-3 rounded-full">
                      Submit
                    </button>
                  </div>
                )}

                {poll.pollType === "imagebased" &&(
                  <div className="grid grid-cols-2 gap-2">
                    {poll.images.map((image, index) => (
                      <button key={index} className="relative w-full h-40 border rounded-md overflow-hidden">
                        <img src={image} alt={`Option ${index + 1}`} className="w-full h-full object-cover" />
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Home;