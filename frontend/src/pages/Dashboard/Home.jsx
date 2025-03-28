import React, { useState, useEffect } from 'react';
import { DashboardLayout } from '../../components/layout/dashboardLayout';
import FilterDropdown from '../../components/layout/filter';
import { axiosInstance } from '../../utils/axiosInstance';
import { API_PATH } from '../../utils/apipath';
import { FaRegBookmark } from "react-icons/fa";
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
      // Find the poll and validate the optionIndex
      const poll = polls.find((p) => p._id === pollId);
      if (!poll || !poll.options || !poll.options[optionIndex]) {
        alert("Invalid option selected");
        return;
      }

      const response = await axiosInstance.patch(`${API_PATH.AUTH.VOTE_POLL}/${pollId}`, { optionIndex });
      const updatedPoll = response.data.poll;

      if (response.data.message === "You have already voted on this poll") {
        alert("You have already voted on this poll");
        return;
      }

      // Update polls and filteredPolls with the updated poll
      setPolls((prevPolls) =>
        prevPolls.map((poll) => (poll._id === updatedPoll._id ? updatedPoll : poll))
      );

      setFilteredPolls((prevPolls) =>
        prevPolls.map((poll) => (poll._id === updatedPoll._id ? updatedPoll : poll))
      );

      // Show "+1" indicator for the selected option
      const tempPolls = [...polls];
      const pollIndex = tempPolls.findIndex((poll) => poll._id === pollId);
      if (pollIndex !== -1) {
        const tempOptions = [...tempPolls[pollIndex].options];
        if (tempOptions[optionIndex]) {
          tempOptions[optionIndex] = {
            ...tempOptions[optionIndex],
            showPlusOne: true, // Add a temporary flag for "+1"
          };
          tempPolls[pollIndex].options = tempOptions;
          setPolls(tempPolls);

          // Remove the "+1" indicator after 2 seconds
          setTimeout(() => {
            const updatedTempPolls = [...tempPolls];
            updatedTempPolls[pollIndex].options[optionIndex] = {
              ...updatedTempPolls[pollIndex].options[optionIndex],
              showPlusOne: false,
            };
            setPolls(updatedTempPolls);
          }, 2000);
        }
      }
    } catch (error) {
      console.error('Error voting on poll:', error.response?.data || error.message);
      alert(error.response?.data?.message || "An error occurred while voting on the poll.");
    }
  };

  const handleCommentSubmit = async (pollId, comment) => {
    try {
      if(!comment) {
        alert("Comment cannot be empty");
        return;
      }
      // Find the poll and validate the comment
      const response = await axiosInstance.patch(`${API_PATH.AUTH.VOTE_POLL}/${pollId}`, { comment });
      const updatedPoll = response.data.poll;

      if (response.data.message === "You have already commented on this poll") {
        alert("You have already commented on this poll");
        return;
      }

      setPolls((prevPolls) =>
        prevPolls.map((poll) => (poll._id === updatedPoll._id ? updatedPoll : poll))
      );

      setFilteredPolls((prevPolls) =>
        prevPolls.map((poll) => (poll._id === updatedPoll._id ? updatedPoll : poll))
      );
    } catch (error) {
      console.error('Error submitting comment:', error.response?.data || error.message);
    }
  };

  const handleBookmark = async (pollId) => {
    try{
       const response = await axiosInstance.post(`${API_PATH.AUTH.BOOKMARK_POLL}/${pollId}`);

       const updatedPoll = response.data.poll;
        if (response.data.message === "Poll already bookmarked") {
          alert("Poll already bookmarked");
          return;
        }
       setPolls((prevPolls) =>
         prevPolls.map((poll) => (poll._id === updatedPoll._id ? updatedPoll : poll))
       );
        // Update filteredPolls as well
       setFilteredPolls((prevPolls) =>
         prevPolls.map((poll) => (poll._id === updatedPoll._id ? updatedPoll : poll))
       );

    }
    catch (error) {
      console.error('Error bookmarking poll:', error.response?.data || error.message);
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
                <div key={poll._id} className="relative h-auto m-2 border-2 border-gray-100 bg-white rounded-md p-5 shadow-2xl w-full">
                  <div className="flex items-center mb-2">
                    <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center font-bold">
                      {poll.createdBy && poll.createdBy.username && poll.createdBy.username.charAt(0)}
                    </div>
                    <div className="ml-3">
                      <p className="font-semibold">{"@" + (poll.createdBy && poll.createdBy.username)}</p>
                      <p className="text-sm text-gray-500">{new Date(poll.createdAt).toLocaleString()}</p>
                    </div>
                    <div
                      className="absolute top-4 right-4 w-4 h-4 transition-transform transform hover:scale-110 cursor-pointer"
                      onClick={() => handleBookmark(poll._id)}
                    >
                      <FaRegBookmark className="w-full h-full text-gray-500 hover:text-blue-500" />
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
                          {option.showPlusOne && <span className="text-green-500 ml-2">+1</span>} {/* Show "+1" indicator */}
                        </button>
                      ))}
                    </div>
                  )}

                  {poll.pollType === "open ended" && (
                    <div className="h-auto space-y-2">
                      <textarea
                        name={`comment-${poll._id}`}
                        id={`comment-${poll._id}`}
                        placeholder="Please comment here"
                        className="flex flex-col justify-center items-center w-1/2 h-auto bg-slate-50 border-2 border-gray-200 rounded-xl p-2"
                        value={poll.comment || ""}
                        onChange={(e) => {
                          const updatedPolls = polls.map((p) =>
                            p._id === poll._id ? { ...p, comment: e.target.value } : p
                          );
                          setPolls(updatedPolls);

                          // Also update the filteredPolls state to reflect the change
                          const updatedFilteredPolls = filteredPolls.map((p) =>
                            p._id === poll._id ? { ...p, comment: e.target.value } : p
                          );
                          setFilteredPolls(updatedFilteredPolls);
                        }}
                      ></textarea>
                      <button
                        className="bg-sky-400 hover:transition-transform transform hover:scale-105 text-white font-sans py-1 px-3 rounded-full"
                        onClick={() => handleCommentSubmit(poll._id, poll.comment)}
                      >
                        Submit
                      </button>
                    </div>
                  )}

                  {poll.pollType === "imagebased" && poll.options && (
                    <div className="grid grid-cols-2 gap-2">
                      {poll.images.map((image, index) => (
                        <div key={index} className="relative w-full h-40 border rounded-md overflow-hidden">
                          <button
                            className="relative w-full h-full"

                            onClick={() => handleVote(poll._id, index)}
                          >
                            <img src={image} alt={`Option ${index + 1}`} className="w-full h-full object-cover" />
                            {poll.options[index]?.showPlusOne && (
                              <span className="absolute top-2 right-2 bg-green-500 text-white text-sm font-bold px-2 py-1 rounded-full">
                                +1
                              </span>
                            )}
                          </button>
                        </div>
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