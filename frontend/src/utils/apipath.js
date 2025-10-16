// Detect environment and set base URL accordingly
const BASE_URL = process.env.REACT_APP_API_URL || 
  (typeof window !== 'undefined' && window.location.hostname === 'localhost' 
    ? 'http://localhost:8000'
    : 'https://your-render-backend.onrender.com');

export const API_PATH = {
    AUTH: {
        LOGIN: `${BASE_URL}/api/v1/auth/login`,
        REGISTER: `${BASE_URL}/api/v1/auth/register`,
        GET_USER: `${BASE_URL}/api/v1/auth/getuser`,
        CREATE_POLL: `${BASE_URL}/api/v1/auth/create-poll`,
        GET_POLLS: `${BASE_URL}/api/v1/auth/getpolls`,
        GET_USERPOLLS: `${BASE_URL}/api/v1/auth/userpoll`,
        DELETE_POLL: `${BASE_URL}/api/v1/auth/delete-poll`,
        VOTE_POLL: `${BASE_URL}/api/v1/auth/votepoll`,
        GET_VOTED_POLLS: `${BASE_URL}/api/v1/auth/getvotedpolls`,
        BOOKMARK_POLL: `${BASE_URL}/api/v1/auth/bookmarkpoll`,
        GET_BOOOKMARK_POLLS: `${BASE_URL}/api/v1/auth/getbookmarkedpolls`,
    },
    IMAGE: {
        UPLOAD: `${BASE_URL}/api/v1/image/upload-image`,
    },
};