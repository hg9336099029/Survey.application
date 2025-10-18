import React, { useState, useEffect } from 'react';
import { DashboardLayout } from '../../components/layout/dashboardLayout';
import FilterDropdown from '../../components/layout/filter';
import { axiosInstance } from '../../utils/axiosInstance';
import { API_PATH } from '../../utils/apipath';
import { FaRegBookmark, FaBookmark } from 'react-icons/fa';
import { toast } from 'react-toastify';

const Home = () => {
  const [polls, setPolls] = useState([]);
  const [filteredPolls, setFilteredPolls] = useState([]);
  const [selectedFilter, setSelectedFilter] = useState('All-polls');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPolls = async () => {
      try {
        setLoading(true);
        const response = await axiosInstance.get(API_PATH.AUTH.GET_POLLS);
        const fetchedPolls = response.data.polls || [];
        setPolls(fetchedPolls);
        setFilteredPolls(fetchedPolls);
      } catch (error) {
        console.error('Error fetching polls:', error);
        toast.error('Failed to load polls');
      } finally {
        setLoading(false);
      }
    };
    fetchPolls();
  }, []);

  const handleVote = async (pollId, optionIndex) => {
    try {
      const response = await axiosInstance.patch(`${API_PATH.AUTH.VOTE_POLL}/${pollId}`, { optionIndex });
      const updatedPoll = response.data.poll;

      setPolls((prevPolls) =>
        prevPolls.map((poll) => (poll._id === updatedPoll._id ? updatedPoll : poll))
      );
      setFilteredPolls((prevPolls) =>
        prevPolls.map((poll) => (poll._id === updatedPoll._id ? updatedPoll : poll))
      );
      toast.success('Vote recorded!');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to vote');
    }
  };

  const handleBookmark = async (pollId) => {
    try {
      const response = await axiosInstance.post(`${API_PATH.AUTH.BOOKMARK_POLL}/${pollId}`);
      const updatedPoll = response.data.poll;
      setPolls((prevPolls) =>
        prevPolls.map((poll) => (poll._id === updatedPoll._id ? updatedPoll : poll))
      );
      setFilteredPolls((prevPolls) =>
        prevPolls.map((poll) => (poll._id === updatedPoll._id ? updatedPoll : poll))
      );
      toast.success('Poll bookmarked!');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to bookmark');
    }
  };

  const handleFilterSelect = (filter) => {
    setSelectedFilter(filter);
    if (filter === 'All-polls') {
      setFilteredPolls(polls);
    } else {
      const typeMap = {
        'Yes/No': 'yesno',
        'Single choice': 'single choice',
        'Rating': 'rating',
        'Image-based': 'imagebased',
        'Open-Ended': 'open ended',
      };
      const filterType = typeMap[filter];
      setFilteredPolls(polls.filter((poll) => poll.pollType === filterType));
    }
  };

  const getTotalVotes = (poll) => {
    return poll.options.reduce((sum, opt) => sum + opt.votes, 0);
  };

  const getVotePercentage = (votes, total) => {
    return total > 0 ? ((votes / total) * 100).toFixed(1) : 0;
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-screen">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading polls...</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="flex-1 overflow-auto bg-gradient-to-br from-gray-50 to-gray-100 p-6">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-gray-900">Explore Polls</h1>
            <p className="text-gray-600 mt-2">Discover and vote on community polls</p>
          </div>

          {/* Filter */}
          <div className="mb-8">
            <FilterDropdown onFilterSelect={handleFilterSelect} />
          </div>

          {/* Polls Grid */}
          {filteredPolls.length === 0 ? (
            <div className="text-center py-16">
              <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <p className="text-gray-600 text-lg">No polls found</p>
              <p className="text-gray-500">Try adjusting your filters</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-1 gap-6">
              {filteredPolls.map((poll) => {
                const totalVotes = getTotalVotes(poll);
                return (
                  <div key={poll._id} className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow border border-gray-200">
                    {/* Poll Header */}
                    <div className="p-6 border-b border-gray-200 flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-lg">
                            {poll.createdBy?.username?.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <p className="font-semibold text-gray-900">@{poll.createdBy?.username}</p>
                            <p className="text-xs text-gray-500">{new Date(poll.createdAt).toLocaleDateString()}</p>
                          </div>
                        </div>
                      </div>
                      <button
                        onClick={() => handleBookmark(poll._id)}
                        className="text-2xl text-gray-400 hover:text-orange-500 transition-colors"
                      >
                        <FaRegBookmark />
                      </button>
                    </div>

                    {/* Poll Question */}
                    <div className="p-6">
                      <h3 className="text-xl font-bold text-gray-900 mb-4">{poll.question}</h3>

                      {/* Vote Stats */}
                      <div className="mb-4 flex gap-4">
                        <div className="bg-blue-50 rounded-lg px-3 py-1">
                          <p className="text-xs text-gray-600">Total Votes</p>
                          <p className="text-lg font-bold text-blue-600">{totalVotes}</p>
                        </div>
                        <div className="bg-purple-50 rounded-lg px-3 py-1">
                          <p className="text-xs text-gray-600">Poll Type</p>
                          <p className="text-sm font-bold text-purple-600 capitalize">{poll.pollType}</p>
                        </div>
                      </div>

                      {/* Options */}
                      <div className="space-y-3">
                        {poll.pollType === 'yesno' && (
                          <>
                            {poll.options.map((option, idx) => (
                              <button
                                key={idx}
                                onClick={() => handleVote(poll._id, idx)}
                                className="w-full p-4 bg-gray-50 hover:bg-blue-50 border-2 border-gray-200 hover:border-blue-400 rounded-lg transition-all group"
                              >
                                <div className="flex items-center justify-between">
                                  <span className="font-semibold text-gray-800 group-hover:text-blue-600">{option.text}</span>
                                  <div className="flex items-center gap-2">
                                    <div className="bg-blue-600 h-2 rounded-full" style={{ width: `${getVotePercentage(option.votes, totalVotes)}px`, maxWidth: '120px' }}></div>
                                    <span className="text-sm font-bold text-gray-600">{getVotePercentage(option.votes, totalVotes)}%</span>
                                  </div>
                                </div>
                              </button>
                            ))}
                          </>
                        )}

                        {poll.pollType === 'single choice' && (
                          <>
                            {poll.options.map((option, idx) => (
                              <button
                                key={idx}
                                onClick={() => handleVote(poll._id, idx)}
                                className="w-full p-4 bg-gray-50 hover:bg-blue-50 border-2 border-gray-200 hover:border-blue-400 rounded-lg transition-all group"
                              >
                                <div className="flex items-center justify-between">
                                  <span className="font-semibold text-gray-800 group-hover:text-blue-600">{option.text}</span>
                                  <div className="flex items-center gap-2">
                                    <div className="bg-blue-600 h-2 rounded-full" style={{ width: `${getVotePercentage(option.votes, totalVotes)}px`, maxWidth: '120px' }}></div>
                                    <span className="text-sm font-bold text-gray-600">{option.votes} votes</span>
                                  </div>
                                </div>
                              </button>
                            ))}
                          </>
                        )}

                        {poll.pollType === 'rating' && (
                          <div className="flex gap-1 p-4 bg-gray-50 rounded-lg">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <button
                                key={star}
                                onClick={() => handleVote(poll._id, star - 1)}
                                className="p-2 hover:bg-yellow-200 rounded transition-colors"
                              >
                                <svg className={`w-8 h-8 ${star <= poll.rating ? 'text-yellow-400' : 'text-gray-300'}`} fill="currentColor" viewBox="0 0 20 20">
                                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                </svg>
                              </button>
                            ))}
                          </div>
                        )}

                        {poll.pollType === 'imagebased' && poll.images && (
                          <div className="grid grid-cols-2 gap-3">
                            {poll.images.map((img, idx) => (
                              <button
                                key={idx}
                                onClick={() => handleVote(poll._id, idx)}
                                className="relative h-40 rounded-lg overflow-hidden group border-2 border-gray-200 hover:border-blue-400 transition-all"
                              >
                                <img src={img} alt={`Option ${idx + 1}`} className="w-full h-full object-cover group-hover:scale-110 transition-transform" />
                                <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-20 transition-opacity flex items-center justify-center">
                                  <span className="text-white font-bold">Vote</span>
                                </div>
                              </button>
                            ))}
                          </div>
                        )}

                        {poll.pollType === 'open ended' && (
                          <textarea
                            placeholder="Share your thoughts..."
                            className="w-full p-4 border-2 border-gray-200 rounded-lg focus:border-blue-400 focus:outline-none resize-none"
                            rows="3"
                          />
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Home;