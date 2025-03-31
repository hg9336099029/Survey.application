const BASE_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:8000";

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
        LOGOUT: `${BASE_URL}/api/v1/auth/logout`, // Added logout endpoint
    },
    IMAGE: {
        UPLOAD: `${BASE_URL}/api/v1/image/upload-image`,
    },
};
