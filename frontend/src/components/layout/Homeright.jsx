import React, { useState, useEffect } from 'react';
import uiElements from "../../assets/images/ui-element.png";
import img from "../../assets/images/woman-with-long-brown-hair.jpg";
import { axiosInstance } from '../../utils/axiosInstance';
import { API_PATH } from '../../utils/apipath';

const Homeright = () => {
  const [user, setUser] = useState(null);
  const [pollsCreated, setPollsCreated] = useState(0);
  const [trendingPolls, setTrendingPolls] = useState([]);

  useEffect(() => {
    // Fetch user data
    const fetchUserData = async () => {
      try {
        const response = await axiosInstance.get(API_PATH.AUTH.GET_USER);
        setUser(response.data.user);
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    // Fetch polls created by the user
    const fetchUserPolls = async () => {
      try {
        const response = await axiosInstance.get(API_PATH.AUTH.GET_USERPOLLS);
        setPollsCreated(response.data.polls.length);
      } catch (error) {
        console.error('Error fetching user polls:', error);
      }
    };

    // Fetch trending polls
    const fetchTrendingPolls = async () => {
      try {
        const response = await axiosInstance.get(API_PATH.AUTH.TRENDING_POLLS);
        // Set fallback to an empty array if undefined
        setTrendingPolls(response.data.trendingPolls || []);
      } catch (error) {
        console.error('Error fetching trending polls:', error);
      }
    };

    fetchUserData();
    fetchUserPolls();
    fetchTrendingPolls();
  }, []);

  return (
    <div className="w-full h-[50%] shadow-lg border-2 border-gray-200 rounded-lg">
      {/* for user profile */}
      <div className="relative">
        <img src={uiElements} alt="user" className="w-full h-32 object-cover" />
        <div className="absolute left-1/2 -bottom-10 transform -translate-x-1/2">
          <img
            src={user && user.profileImageUrl ? user.profileImageUrl : img}
            alt="profile"
            className="w-20 h-20 rounded-full border-4 border-white"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = img;
            }}
          />
        </div>
      </div>
      <div className="p-2 mt-14 text-center">
        <h3 className="font-semibold text-lg">{user ? user.fullname : 'Loading...'}</h3>
        <p className="text-gray-500">@{user ? user.username : 'Loading...'}</p>

        <div className="flex justify-center space-x-4">
          <div className="text-center">
            <p className="font-semibold">{pollsCreated}</p>
            <p className="text-sm text-gray-500">Polls Created</p>
          </div>
          {/* other user data */}
        </div>

        <div className="mt-16 px-6 py-6">
          <h4 className="text-left font-semibold mb-4">Trending</h4>
          <div className="flex flex-col space-y-4">
            {(trendingPolls && trendingPolls.length > 0) ? (
              trendingPolls.map((poll) => (
                <div key={poll._id} className="text-sm">
                  <h5 className="font-semibold text-gray-700">{poll._id}</h5>
                  <ul className="ml-4 list-disc">
                    {poll.options.map((option, index) => (
                      <li key={index} className="text-gray-600">
                        {option.optionText}: {option.votes} votes
                      </li>
                    ))}
                  </ul>
                  <p className="text-gray-500 mt-1">Total Votes: {poll.totalVotes}</p>
                </div>
              ))
            ) : (
              <p className="text-gray-500">No trending polls available</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Homeright;