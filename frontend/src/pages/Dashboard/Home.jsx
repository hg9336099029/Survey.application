import React, { useState, useEffect } from 'react';
import { DashboardLayout } from '../../components/layout/dashboardLayout';
import FilterDropdown from '../../components/layout/filter';
import { axiosInstance } from '../../utils/axiosInstance';
import { API_PATH } from '../../utils/apipath';

const Home = () => {
  const [polls, setPolls] = useState([]);
  const [filteredPolls, setFilteredPolls] = useState([]);
  const [selectedFilter, setSelectedFilter] = useState('All-polls');

  useEffect(() => {
    const fetchPolls = async () => {
      try {
        const response = await axiosInstance.get(API_PATH.AUTH.GET_POLLS);
        const fetchedPolls = response.data.polls || []; // Fallback to an empty array
        setPolls(fetchedPolls);
        setFilteredPolls(fetchedPolls);
      } catch (error) {
        console.error('Error fetching polls:', error);
      }
    };

    fetchPolls();
  }, []);

  const handleVote = async (pollId, optionIndex) => {
    try {
      const response = await axiosInstance.patch(`${API_PATH.AUTH.VOTE_POLL}/${pollId}`, { optionIndex });
      const updatedPoll = response.data.poll;

      if (response.data.message === "You have already voted on this poll") {
        alert("You have already voted on this poll");
        return;
      }

      setPolls((prevPolls) =>
        prevPolls.map((poll) => (poll._id === updatedPoll._id ? updatedPoll : poll))
      );

      setFilteredPolls((prevPolls) =>
        prevPolls.map((poll) => (poll._id === updatedPoll._id ? updatedPoll : poll))
      );
    } catch (error) {
      console.error('Error voting on poll:', error.response?.data || error.message);
    }
  };

  const handleFilterSelect = (filter) => {
    setSelectedFilter(filter);
    if (filter === "Yes/No") {
      setFilteredPolls(polls.filter((poll) => poll.pollType === "yesno"));
    } else if (filter === "Single choice") {
      setFilteredPolls(polls.filter((poll) => poll.pollType === "single choice"));
    } else if (filter === "Rating") {
      setFilteredPolls(polls.filter((poll) => poll.pollType === "rating"));
    } else if (filter === "Image-based") {
      setFilteredPolls(polls.filter((poll) => poll.pollType === "imagebased"));
    } else if (filter === "Open-Ended") {
      setFilteredPolls(polls.filter((poll) => poll.pollType === "open ended"));
    } else {
      setFilteredPolls(polls);
    }
  };

  return (
    <DashboardLayout>
      <div className="flex-1 flex-col items-center justify-center mx-auto w-screen sm:w-full">
        <FilterDropdown onFilterSelect={handleFilterSelect} />
        <div className="flex flex-col mt-4 mx-auto w-full">
          {polls.length === 0 ? (
            <p className="text-center text-gray-500">No poll exists</p>
          ) : (
            filteredPolls.map((poll) => (
              poll && (
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
                        <button
                          className="w-full text-left border rounded-md py-2 px-4 bg-gray-100 hover:bg-gray-200 cursor-pointer"
                          onClick={() => handleVote(poll._id, 0)}
                        >
                          Yes
                        </button>
                      </div>

                      <div className="flex items-center">
                        <button
                          className="w-full text-left border rounded-md py-2 px-4 bg-gray-100 hover:bg-gray-200 cursor-pointer"
                          onClick={() => handleVote(poll._id, 1)}
                        >
                          No
                        </button>
                      </div>
                    </div>
                  )}

                  {poll.pollType === "rating" && (
                    <div className="space-y-2">
                      <div className="flex items-center mb-2">
                        {[...Array(5)].map((_, index) => (
                          <svg
                            key={index}
                            className={`w-4 h-4 ${poll.rating > index ? 'text-yellow-300' : 'text-gray-300'} me-1 cursor-pointer`}
                            aria-hidden="true"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="currentColor"
                            viewBox="0 0 22 20"
                            onClick={() => handleVote(poll._id, index + 1)} // Send rating (1 to 5)
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
                        <button key={index} className="w-full text-left border rounded-md py-2 px-4 bg-gray-100" onClick={() => handleVote(poll._id, index)}>
                          {option.text}
                        </button>
                      ))}
                    </div>
                  )}

                  {poll.pollType === "open ended" && (
                    <div className="h-auto space-y-2">
                      <textarea name="" id="" placeholder='please comment here' className='flex flex-col justify-center items-center w-1/2 h-auto bg-slate-50 border-2 border-gray-200 rounded-xl p-2'></textarea>
                      <button className="bg-sky-400 hover:transition-transform transform hover:scale-105  text-white font-sans py-1 px-3 rounded-full" >
                        Submit
                      </button>
                    </div>
                  )}

                  {poll.pollType === "imagebased" && (
                    <div className="grid grid-cols-2 gap-2">
                      {poll.images.map((image, index) => (
                        <button key={index} className="relative w-full h-40 border rounded-md overflow-hidden">
                          <img src={image} alt={`Option ${index + 1}`} className="w-full h-full object-cover" />
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              )
            ))
          )}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Home;