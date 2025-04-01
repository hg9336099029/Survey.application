import React, { useState, useEffect } from 'react';
import { DashboardLayout } from '../../components/layout/dashboardLayout';
import FilterDropdown from '../../components/layout/filter';
import { axiosInstance } from '../../utils/axiosInstance';
import { API_PATH } from '../../utils/apipath';
import { FaRegBookmark } from 'react-icons/fa';

const Bookmark = () => {
  const [bookmarkedPolls, setBookmarkedPolls] = useState([]);
  const [filteredPolls, setFilteredPolls] = useState([]);

  useEffect(() => {
    const fetchBookmarkedPolls = async () => {
      try {
        const response = await axiosInstance.get(API_PATH.AUTH.GET_BOOOKMARK_POLLS);
        const fetchedPolls = response.data.bookmarkedPolls || [];
        setBookmarkedPolls(fetchedPolls);
        setFilteredPolls(fetchedPolls);
      } catch (error) {
        console.error('Error fetching bookmarked polls:', error);
      }
    };

    fetchBookmarkedPolls();
  }, []);

  const handleVote = async (pollId, optionIndex) => {
    try {
      const response = await axiosInstance.patch(`${API_PATH.AUTH.VOTE_POLL}/${pollId}`, { optionIndex });
      const updatedPoll = response.data.poll;

      if (response.data.message === "You have already voted on this poll") {
        alert("You have already voted on this poll");
        return;
      }

      setBookmarkedPolls((prevPolls) =>
        prevPolls.map((poll) => (poll._id === updatedPoll._id ? updatedPoll : poll))
      );

      setFilteredPolls((prevPolls) =>
        prevPolls.map((poll) => (poll._id === updatedPoll._id ? updatedPoll : poll))
      );
    } catch (error) {
      console.error('Error voting on poll:', error.response?.data || error.message);
      alert(error.response?.data?.message || "An error occurred while voting on the poll.");
    }
  };

  const handleCommentSubmit = async (pollId, comment) => {
    try {
      const response = await axiosInstance.patch(`${API_PATH.AUTH.VOTE_POLL}/${pollId}`, { comment });
      const updatedPoll = response.data.poll;

      setBookmarkedPolls((prevPolls) =>
        prevPolls.map((poll) => (poll._id === updatedPoll._id ? updatedPoll : poll))
      );

      setFilteredPolls((prevPolls) =>
        prevPolls.map((poll) => (poll._id === updatedPoll._id ? updatedPoll : poll))
      );
    } catch (error) {
      console.error('Error submitting comment:', error.response?.data || error.message);
      alert(error.response?.data?.message || "An error occurred while submitting the comment.");
    }
  };

  return (
    <DashboardLayout>
      <div className="flex-1 flex-col items-center justify-center mx-auto w-screen sm:w-full">
        <FilterDropdown onFilterSelect={(filter) => {
          if (filter === 'All-polls') {
            setFilteredPolls(bookmarkedPolls);
          } else {
            const filtered = bookmarkedPolls.filter((poll) => poll.pollType === filter);
            setFilteredPolls(filtered);
          }
        }} />
        <div className="flex flex-col mt-4 mx-auto w-full">
          {filteredPolls.length === 0 ? (
            <p className="text-center text-gray-500">No bookmarked polls found</p>
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
                      className="absolute top-4 right-4 w-6 h-6 transition-transform transform hover:scale-110 cursor-pointer"
                    >
                      <FaRegBookmark className="w-full h-full text-blue-500" />
                    </div>
                  </div>

                  <p className="font-medium text-lg mb-2">{poll.question}</p>

                  {poll.pollType === "yesno" && (
                    <div className="space-y-2">
                      <button
                        className="w-full text-left border rounded-md py-2 px-4 bg-gray-100 hover:bg-gray-200 cursor-pointer"
                        onClick={() => handleVote(poll._id, 0)}
                      >
                        Yes
                      </button>
                      <button
                        className="w-full text-left border rounded-md py-2 px-4 bg-gray-100 hover:bg-gray-200 cursor-pointer"
                        onClick={() => handleVote(poll._id, 1)}
                      >
                        No
                      </button>
                    </div>
                  )}

                  {poll.pollType === "rating" && (
                    <div className="space-y-2">
                      {[...Array(5)].map((_, index) => (
                        <svg
                          key={index}
                          className={`w-4 h-4 ${poll.rating > index ? 'text-yellow-300' : 'text-gray-300'} me-1 cursor-pointer`}
                          onClick={() => handleVote(poll._id, index + 1)}
                        >
                          <path d="M20.924 7.625a1.523 1.523 0 0 0-1.238-1.044l-5.051-.734-2.259-4.577a1.534 1.534 0 0 0-2.752 0L7.365 5.847l-5.051.734A1.535 1.535 0 0 0 1.463 9.2l3.656 3.563-.863 5.031a1.532 1.532 0 0 0 2.226 1.616L11 17.033l4.518 2.375a1.534 1.534 0 0 0 2.226-1.617l-.863-5.03L20.537 9.2a1.523 1.523 0 0 0 .387-1.575Z" />
                        </svg>
                      ))}
                    </div>
                  )}

                  {poll.pollType === "single choice" && (
                    <div className="space-y-2">
                      {poll.options.map((option, index) => (
                        <button
                          key={index}
                          className="w-full text-left border rounded-md py-2 px-4 bg-gray-100"
                          onClick={() => handleVote(poll._id, index)}
                        >
                          {option.text}
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
                          const updatedPolls = bookmarkedPolls.map((p) =>
                            p._id === poll._id ? { ...p, comment: e.target.value } : p
                          );
                          setBookmarkedPolls(updatedPolls);

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
                </div>
              )
            ))
          )}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Bookmark;