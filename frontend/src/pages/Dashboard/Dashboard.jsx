import React, { useState, useEffect } from 'react';
import { DashboardLayout } from '../../components/layout/dashboardLayout';
import { axiosInstance } from '../../utils/axiosInstance';
import { API_PATH } from '../../utils/apipath';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalPolls: 0,
    totalVotes: 0,
    userPolls: 0,
    votedPolls: 0,
    bookmarkedPolls: 0,
  });

  const [recentPolls, setRecentPolls] = useState([]);
  const [trendingPolls, setTrendingPolls] = useState([]);
  const [pollTypeData, setPollTypeData] = useState([]);
  const [sentimentData, setSentimentData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem('accessToken');

        // Fetch all polls (public)
        const pollsResponse = await axiosInstance.get(API_PATH.AUTH.GET_POLLS);
        const allPolls = pollsResponse.data.polls || [];

        let userPolls = [];
        let votedPolls = [];
        let bookmarkedPolls = [];

        if (token) {
          try {
            // Fetch user polls
            const userPollsResponse = await axiosInstance.get(API_PATH.AUTH.GET_USERPOLLS);
            userPolls = userPollsResponse.data.polls || [];

            // Fetch voted polls
            const votedPollsResponse = await axiosInstance.get(API_PATH.AUTH.GET_VOTED_POLLS);
            votedPolls = votedPollsResponse.data.votedPolls || [];

            // Fetch bookmarked polls
            const bookmarkedResponse = await axiosInstance.get(API_PATH.AUTH.GET_BOOOKMARK_POLLS);
            bookmarkedPolls = bookmarkedResponse.data.bookmarkedPolls || [];
          } catch (authError) {
            console.error('Error fetching authenticated data:', authError);
          }
        }

        // Calculate total votes
        const totalVotes = allPolls.reduce((sum, poll) => {
          return sum + poll.options.reduce((optSum, opt) => optSum + opt.votes, 0);
        }, 0);

        // Update stats
        setStats({
          totalPolls: allPolls.length,
          totalVotes: totalVotes,
          userPolls: userPolls.length,
          votedPolls: votedPolls.length,
          bookmarkedPolls: bookmarkedPolls.length,
        });

        // Set recent polls (last 5)
        setRecentPolls(allPolls.slice(0, 5));

        // Set trending polls (sorted by votes)
        const trending = [...allPolls]
          .sort((a, b) => {
            const aVotes = a.options.reduce((sum, opt) => sum + opt.votes, 0);
            const bVotes = b.options.reduce((sum, opt) => sum + opt.votes, 0);
            return bVotes - aVotes;
          })
          .slice(0, 5);
        setTrendingPolls(trending);

        // Poll type distribution
        const typeCounts = {};
        allPolls.forEach(poll => {
          typeCounts[poll.pollType] = (typeCounts[poll.pollType] || 0) + 1;
        });

        const typeData = Object.entries(typeCounts).map(([type, count]) => ({
          name: type.charAt(0).toUpperCase() + type.slice(1),
          value: count,
        }));
        setPollTypeData(typeData);

        // Sentiment analysis (based on poll types)
        const sentimentMap = {
          yesno: 'Positive',
          'single choice': 'Neutral',
          rating: 'Mixed',
          imagebased: 'Engaging',
          'open ended': 'Insightful',
        };

        const sentiments = {};
        allPolls.forEach(poll => {
          const sentiment = sentimentMap[poll.pollType] || 'Unknown';
          sentiments[sentiment] = (sentiments[sentiment] || 0) + 1;
        });

        const sentimentChartData = Object.entries(sentiments).map(([type, count]) => ({
          name: type,
          value: count,
        }));
        setSentimentData(sentimentChartData);

      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const COLORS = ['#3b82f6', '#ef4444', '#10b981', '#f59e0b', '#8b5cf6', '#ec4899'];

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-screen">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading dashboard...</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="flex-1 overflow-auto bg-gradient-to-br from-gray-50 to-gray-100 p-6">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-gray-900">Analytics Dashboard</h1>
            <p className="text-gray-600 mt-2">Monitor your polling activity and insights</p>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
            {/* Total Polls */}
            <div className="bg-white rounded-lg shadow-lg p-6 border-l-4 border-blue-600 hover:shadow-xl transition-shadow">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm font-medium">Total Polls</p>
                  <p className="text-3xl font-bold text-gray-900 mt-2">{stats.totalPolls}</p>
                </div>
                <div className="bg-blue-100 rounded-full p-3">
                  <svg className="w-6 h-6 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M2 11a1 1 0 011-1h2a1 1 0 011 1v5a1 1 0 01-1 1H3a1 1 0 01-1-1v-5zM8 7a1 1 0 011-1h2a1 1 0 011 1v9a1 1 0 01-1 1H9a1 1 0 01-1-1V7zM14 4a1 1 0 011-1h2a1 1 0 011 1v12a1 1 0 01-1 1h-2a1 1 0 01-1-1V4z" />
                  </svg>
                </div>
              </div>
            </div>

            {/* Total Votes */}
            <div className="bg-white rounded-lg shadow-lg p-6 border-l-4 border-green-600 hover:shadow-xl transition-shadow">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm font-medium">Total Votes</p>
                  <p className="text-3xl font-bold text-gray-900 mt-2">{stats.totalVotes}</p>
                </div>
                <div className="bg-green-100 rounded-full p-3">
                  <svg className="w-6 h-6 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M2 11a1 1 0 011-1h2a1 1 0 011 1v5a1 1 0 01-1 1H3a1 1 0 01-1-1v-5zM8 7a1 1 0 011-1h2a1 1 0 011 1v9a1 1 0 01-1 1H9a1 1 0 01-1-1V7zM14 4a1 1 0 011-1h2a1 1 0 011 1v12a1 1 0 01-1 1h-2a1 1 0 01-1-1V4z" />
                  </svg>
                </div>
              </div>
            </div>

            {/* My Polls */}
            <div className="bg-white rounded-lg shadow-lg p-6 border-l-4 border-purple-600 hover:shadow-xl transition-shadow">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm font-medium">My Polls</p>
                  <p className="text-3xl font-bold text-gray-900 mt-2">{stats.userPolls}</p>
                </div>
                <div className="bg-purple-100 rounded-full p-3">
                  <svg className="w-6 h-6 text-purple-600" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M4 4a2 2 0 00-2 2v4a2 2 0 002 2V6h10a2 2 0 00-2-2H4zm2 6a2 2 0 012-2h8a2 2 0 012 2v4a2 2 0 01-2 2H8a2 2 0 01-2-2v-4z" />
                  </svg>
                </div>
              </div>
            </div>

            {/* Voted Polls */}
            <div className="bg-white rounded-lg shadow-lg p-6 border-l-4 border-orange-600 hover:shadow-xl transition-shadow">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm font-medium">Voted Polls</p>
                  <p className="text-3xl font-bold text-gray-900 mt-2">{stats.votedPolls}</p>
                </div>
                <div className="bg-orange-100 rounded-full p-3">
                  <svg className="w-6 h-6 text-orange-600" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M5.5 12a3.5 3.5 0 01-.369-6.98 4 4 0 117.753-1.3A4.5 4.5 0 1113.5 12H11V9.413l1.293 1.293a1 1 0 001.414-1.414l-3-3a1 1 0 00-1.414 0l-3 3a1 1 0 001.414 1.414L9 9.414V12H5.5z" />
                  </svg>
                </div>
              </div>
            </div>

            {/* Bookmarked Polls */}
            <div className="bg-white rounded-lg shadow-lg p-6 border-l-4 border-red-600 hover:shadow-xl transition-shadow">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm font-medium">Bookmarked</p>
                  <p className="text-3xl font-bold text-gray-900 mt-2">{stats.bookmarkedPolls}</p>
                </div>
                <div className="bg-red-100 rounded-full p-3">
                  <svg className="w-6 h-6 text-red-600" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M5 4a2 2 0 012-2h6a2 2 0 012 2v14l-5-2.5L5 18V4z" />
                  </svg>
                </div>
              </div>
            </div>
          </div>

          {/* Charts Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            {/* Poll Type Distribution */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Poll Type Distribution</h2>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={pollTypeData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, value }) => `${name}: ${value}`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {pollTypeData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>

            {/* Sentiment Analysis */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Sentiment Analysis</h2>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={sentimentData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="value" fill="#3b82f6" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Recent and Trending */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Recent Polls */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Recent Polls</h2>
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {recentPolls.length > 0 ? (
                  recentPolls.map((poll) => (
                    <div key={poll._id} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors">
                      <h3 className="font-semibold text-gray-900 text-sm mb-2 line-clamp-2">{poll.question}</h3>
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-gray-600">
                          By <span className="font-medium">@{poll.createdBy?.username}</span>
                        </span>
                        <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                          {poll.pollType}
                        </span>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-500 text-center py-8">No polls yet</p>
                )}
              </div>
            </div>

            {/* Trending Polls */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">🔥 Trending Polls</h2>
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {trendingPolls.length > 0 ? (
                  trendingPolls.map((poll, index) => {
                    const totalVotes = poll.options.reduce((sum, opt) => sum + opt.votes, 0);
                    return (
                      <div key={poll._id} className="border border-gray-200 rounded-lg p-4 hover:bg-gradient-to-r hover:from-orange-50 hover:to-red-50 transition-colors">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <span className="text-lg font-bold text-orange-600">#{index + 1}</span>
                              <h3 className="font-semibold text-gray-900 text-sm line-clamp-2">{poll.question}</h3>
                            </div>
                            <div className="flex items-center justify-between">
                              <span className="text-xs text-gray-600">
                                By <span className="font-medium">@{poll.createdBy?.username}</span>
                              </span>
                              <span className="bg-orange-100 text-orange-800 text-xs px-2 py-1 rounded-full font-bold">
                                {totalVotes} votes
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <p className="text-gray-500 text-center py-8">No trending polls yet</p>
                )}
              </div>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="mt-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg shadow-lg p-8 text-white">
            <h2 className="text-2xl font-bold mb-4">Quick Insights</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <p className="text-blue-100 text-sm mb-2">Engagement Rate</p>
                <p className="text-3xl font-bold">
                  {stats.totalPolls > 0 ? ((stats.totalVotes / (stats.totalPolls * 10)) * 100).toFixed(1) : 0}%
                </p>
              </div>
              <div>
                <p className="text-blue-100 text-sm mb-2">Avg Votes Per Poll</p>
                <p className="text-3xl font-bold">
                  {stats.totalPolls > 0 ? (stats.totalVotes / stats.totalPolls).toFixed(1) : 0}
                </p>
              </div>
              <div>
                <p className="text-blue-100 text-sm mb-2">Participation Rate</p>
                <p className="text-3xl font-bold">
                  {stats.totalPolls > 0 ? ((stats.votedPolls / stats.totalPolls) * 100).toFixed(1) : 0}%
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Dashboard;