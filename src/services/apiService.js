import axios from 'axios';

// const API_BASE_URL = 'http://localhost:8081/api';

const API_BASE_URL = 'https://jobapp-backend-xyz.onrender.com/api';
// Helper function for error handling
const handleApiError = (error, context) => {
  console.error(`Error ${context}:`, {
    url: error.config?.url,
    method: error.config?.method,
    status: error.response?.status,
    data: error.response?.data,
    headers: error.config?.headers
  });
  throw error;
};

// Helper function to get auth headers
const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  return {
    'Content-Type': 'application/json',
    ...(token ? { 'Authorization': `Bearer ${token}` } : {})
  };
};






// Dashboard APIs
export const DashboardAPI = {
  getSummary: async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/dashboard/summary`, {
        headers: getAuthHeaders(),
        withCredentials: true
      });
      return response.data;
    } catch (error) {
      handleApiError(error, "fetching dashboard summary");
    }
  },

  getJobCategories: async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/dashboard/job-categories`, {
        headers: getAuthHeaders(),
        withCredentials: true
      });
      return response.data;
    } catch (error) {
      handleApiError(error, "fetching job categories");
    }
  },

  getApplicationStatus: async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/dashboard/application-status`, {
        headers: getAuthHeaders(),
        withCredentials: true
      });
      return response.data;
    } catch (error) {
      handleApiError(error, "fetching application status");
    }
  },

  getMessageActivity: async (days = 30) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/dashboard/message-activity`, {
        headers: getAuthHeaders(),
        withCredentials: true,
        params: { days }
      });
      return response.data;
    } catch (error) {
      handleApiError(error, "fetching message activity");
    }
  },

  getRecentActivities: async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/dashboard/recent-activities`, {
        headers: getAuthHeaders(),
        withCredentials: true
      });
      return response.data;
    } catch (error) {
      handleApiError(error, "fetching recent activities");
    }
  }
};





// Global Search API
export const globalSearch = async (query) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/globalSearch`, {
      params: { q: query },
      headers: getAuthHeaders(),
      withCredentials: true
    });
    return response.data;
  } catch (error) {
    handleApiError(error, "performing global search");
  }
};






// Message APIs
export const sendMessage = async (receiverId, messageText) => {
  try {
    const response = await axios.post(
      `${API_BASE_URL}/messages/send/${receiverId}`,
      { messageText },
      { 
        headers: getAuthHeaders(),
        withCredentials: true 
      }
    );
    return response.data;
  } catch (error) {
    handleApiError(error, "sending message");
  }
};

export const updateMessage = async (messageId, messageText) => {
  try {
    const response = await axios.put(
      `${API_BASE_URL}/messages/${messageId}`,
      { messageText },
      { 
        headers: getAuthHeaders(),
        withCredentials: true 
      }
    );
    return response.data;
  } catch (error) {
    handleApiError(error, "updating message");
  }
};

export const deleteMessage = async (messageId) => {
  try {
    await axios.delete(
      `${API_BASE_URL}/messages/${messageId}`,
      { 
        headers: getAuthHeaders(),
        withCredentials: true 
      }
    );
  } catch (error) {
    handleApiError(error, "deleting message");
  }
};

export const getAllJobSeekers = async () => {
  try {
    const response = await axios.get(
      `${API_BASE_URL}/messages/jobseekers`,
      { 
        headers: getAuthHeaders(),
        withCredentials: true 
      }
    );
    return response.data;
  } catch (error) {
    handleApiError(error, "fetching job seekers");
  }
};


export const broadcastToEmployers = async (messageText) => {
  try {
    const response = await axios.post(
      `${API_BASE_URL}/messages/jobseeker/broadcast-to-employers`,
      { messageText },
      { 
        headers: getAuthHeaders(),
        withCredentials: true 
      }
    );
    return response.data;
  } catch (error) {
    handleApiError(error, "broadcasting to employers");
  }
};



export const getMessageById = async (messageId) => {
  try {
    const response = await axios.get(
      `${API_BASE_URL}/messages/${messageId}`,
      { 
        headers: getAuthHeaders(),
        withCredentials: true 
      }
    );
    return response.data;
  } catch (error) {
    handleApiError(error, "fetching message");
  }
};



export const getMyMessages = async (page = 0, size = 10, sort = "date,desc") => {
  try {
    const response = await axios.get(
      `${API_BASE_URL}/messages/my-messages`,
      { 
        params: { page, size, sort },
        headers: getAuthHeaders(),
        withCredentials: true 
      }
    );
    return response.data;
  } catch (error) {
    handleApiError(error, "fetching my messages");
  }
};

export const getEmployerConversations = async (page = 0, size = 10) => {
  try {
    const response = await axios.get(
      `${API_BASE_URL}/messages/employer/conversations`,
      { 
        params: { page, size },
        headers: getAuthHeaders(),
        withCredentials: true 
      }
    );
    return response.data;
  } catch (error) {
    handleApiError(error, "fetching employer conversations");
  }
};

export const getJobSeekerConversations = async (page = 0, size = 10) => {
  try {
    const response = await axios.get(
      `${API_BASE_URL}/messages/jobseeker/conversations`,
      { 
        params: { page, size },
        headers: getAuthHeaders(),
        withCredentials: true 
      }
    );
    return response.data;
  } catch (error) {
    handleApiError(error, "fetching job seeker conversations");
  }
};

export const getAllMessagesAdmin = async (page = 0, size = 10) => {
  try {
    const response = await axios.get(
      `${API_BASE_URL}/messages/admin/all`,
      { 
        params: { page, size },
        headers: getAuthHeaders(),
        withCredentials: true 
      }
    );
    return response.data;
  } catch (error) {
    handleApiError(error, "fetching all messages (admin)");
  }
};
export const sendMessageToJobSeeker = async (jobSeekerId, messageText) => {
  try {
    const response = await axios.post(
      `${API_BASE_URL}/messages/employer/send-to-jobseeker/${jobSeekerId}`,
      { messageText },
      {
        headers: getAuthHeaders(),
        withCredentials: true,
      }
    );
    return response.data;
  } catch (error) {
    handleApiError(error, "sending message to job seeker");
  }
};







// Application APIs
export const applyForJob = async (jobId, request = null) => {
  try {
    const response = await axios.post(
      `${API_BASE_URL}/applications/jobs/${jobId}/applications`,
      request,
      { 
        headers: getAuthHeaders(),
        withCredentials: true 
      }
    );
    return response.data;
  } catch (error) {
    handleApiError(error, "applying for job");
  }
};

export const checkIfApplied = async (jobId) => {
  try {
    const response = await axios.get(
      `${API_BASE_URL}/api/applications/has-applied/${jobId}`,
      { 
        headers: {
          ...getAuthHeaders(),
          'Accept': 'application/json',
        },
        withCredentials: true
      }
    );
    
    // Validate response structure
    if (response.data && typeof response.data.hasApplied === 'boolean') {
      return response.data.hasApplied;
    }
    console.warn('Unexpected response format:', response.data);
    return false;
    
  } catch (error) {
    // Handle specific error cases
    if (error.response) {
      if (error.response.status === 401) {
        console.warn('Authentication required');
        throw new Error('Please login to check application status');
      }
      if (error.response.status === 404) {
        
        console.warn('Endpoint not found - ensure backend is properly configured');
      }
    }
    
    console.warn('Application check failed, assuming not applied', error.message);
    return false; // Graceful fallback
  }
};

export const getAllApplicationsPaginated = async (page = 0, size = 10) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/applications/pagination`, {
      params: { page, size },
      headers: getAuthHeaders(),
      withCredentials: true
    });
    return response.data;
  } catch (error) {
    handleApiError(error, "fetching paginated applications");
  }
};

export const getApplicationById = async (id) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/applications/${id}`, {
      headers: getAuthHeaders(),
      withCredentials: true
    });
    return response.data;
  } catch (error) {
    handleApiError(error, "fetching application by ID");
  }
};

export const updateApplication = async (id, applicationDetails) => {
  try {
    const response = await axios.put(
      `${API_BASE_URL}/applications/${id}`,
      applicationDetails,
      { 
        headers: getAuthHeaders(),
        withCredentials: true 
      }
    );
    return response.data;
  } catch (error) {
    handleApiError(error, "updating application");
  }
};

export const deleteApplication = async (id) => {
  try {
    await axios.delete(`${API_BASE_URL}/applications/${id}`, {
      headers: getAuthHeaders(),
      withCredentials: true
    });
  } catch (error) {
    handleApiError(error, "deleting application");
  }
};

export const getMyApplications = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/applications/my-applications`, {
      headers: getAuthHeaders(),
      withCredentials: true
    });
    return response.data;
  } catch (error) {
    handleApiError(error, "fetching current user's applications");
  }
};

export const getMyApplicationsPaginated = async (page = 0, size = 10) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/applications/my-applications/paginated`, {
      params: { page, size },
      headers: getAuthHeaders(),
      withCredentials: true
    });
    return response.data;
  } catch (error) {
    handleApiError(error, "fetching paginated user applications");
  }
};

export const getApplicationsByJob = async (jobId) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/applications/job/${jobId}`, {
      headers: getAuthHeaders(),
      withCredentials: true
    });
    return response.data;
  } catch (error) {
    handleApiError(error, "fetching applications by job ID");
  }
};

export const updateApplicationStatus = async (id, status) => {
  try {
    const response = await axios.put(
      `${API_BASE_URL}/applications/${id}/status`,
      null,
      {
        params: { status },
        headers: getAuthHeaders(),
        withCredentials: true
      }
    );
    return response.data;
  } catch (error) {
    handleApiError(error, "updating application status");
  }
};








// User CRUD Operations
export const createUser = async (user) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/users`, user, {
      headers: getAuthHeaders()
    });
    return response.data;
  } catch (error) {
    handleApiError(error, "creating user");
  }
};

export const createJobSeeker = async (user) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/users/jobseeker`, user, {
      headers: getAuthHeaders()
    });
    return response.data;
  } catch (error) {
    handleApiError(error, "creating job seeker");
  }
};

export const getUserById = async (userId) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/users/${userId}`, {
      headers: getAuthHeaders()
    });
    return response.data;
  } catch (error) {
    handleApiError(error, "fetching user");
  }
};

export const getAllUsers = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/users`, {
      headers: getAuthHeaders()
    });
    return response.data;
  } catch (error) {
    handleApiError(error, "fetching users");
  }
};

export const getPaginatedUsers = async (page = 0, size = 10) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/users/paginated`, {
      params: { page, size },
      headers: getAuthHeaders()
    });
    return response.data;
  } catch (error) {
    handleApiError(error, "fetching paginated users");
  }
};

export const updateUser = async (userId, user) => {
  try {
    const response = await axios.put(`${API_BASE_URL}/users/${userId}`, user, {
      headers: getAuthHeaders()
    });
    return response.data;
  } catch (error) {
    handleApiError(error, "updating user");
  }
};

export const deleteUser = async (userId) => {
  try {
    await axios.delete(`${API_BASE_URL}/users/${userId}`, {
      headers: getAuthHeaders()
    });
  } catch (error) {
    handleApiError(error, "deleting user");
  }
};

// Authentication Operations
export const login = async (email, password) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/users/login`, null, {
      params: { email, password },
      headers: { 'Content-Type': 'application/json' }
    });
    return response.data;
  } catch (error) {
    handleApiError(error, "logging in");
  }
};

export const logout = async () => {
  try {
    const response = await axios.post(`${API_BASE_URL}/users/logout`, null, {
      headers: getAuthHeaders(),
      withCredentials: true,
      validateStatus: (status) => status === 204 || status === 200
    });
    return { success: true, data: response.data };
  } catch (error) {
    const errorResponse = {
      success: false,
      message: error.response?.data?.message || 'Logout failed',
      status: error.response?.status,
      error: error.message
    };
    console.error('Detailed logout error:', errorResponse);
    throw errorResponse;
  }
};

// OTP Operations
// export const sendLoginOtp = async (email) => {
//   try {
//     await axios.post(`${API_BASE_URL}/users/otp/login`, null, {
//       params: { email },
//       headers: { 'Content-Type': 'application/json' }
//     });
//   } catch (error) {
//     handleApiError(error, "sending login OTP");
//   }
// };

// export const verifyLoginOtp = async (email, otpEmail, verificationCode, password) => {
//   try {
//     const response = await axios.post(`${API_BASE_URL}/users/otp/login/verify`, null, {
//       params: { email, otpEmail, verificationCode, password },
//       headers: { 'Content-Type': 'application/json' },
//       withCredentials: true
//     });
//     return response.data;
//   } catch (error) {
//     handleApiError(error, "verifying login OTP");
//   }
// };

// Password Reset Operations
// export const sendPasswordResetOtp = async (email, otpEmail) => {
//   try {
//     await axios.post(`${API_BASE_URL}/users/password/reset/otp`, null, {
//       params: { email, otpEmail },
//       headers: { 'Content-Type': 'application/json' }
//     });
//   } catch (error) {
//     handleApiError(error, "sending password reset OTP");
//   }
// };

export const resetPassword = async (email, otpEmail, verificationCode, newPassword) => {
  try {
    await axios.post(`${API_BASE_URL}/users/password/reset`, null, {
      params: { email, otpEmail, verificationCode, newPassword },
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    handleApiError(error, "resetting password");
  }
};

// Utility Operations
export const getUserByUsername = async (username) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/users/username/${username}`, {
      headers: getAuthHeaders()
    });
    return response.data;
  } catch (error) {
    handleApiError(error, "fetching user by username");
  }
};

export const validateCredentials = async (email, password) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/users/validate`, {
      params: { email, password },
      headers: { 'Content-Type': 'application/json' }
    });
    return response.data;
  } catch (error) {
    handleApiError(error, "validating credentials");
  }
};









// Job Listing APIs
export const createJobListing = async (jobListingData) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/job-listings`, jobListingData, {
      headers: getAuthHeaders()
    });
    return response.data;
  } catch (error) {
    handleApiError(error, "creating job listing");
  }
};

export const getAllJobListings = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/job-listings`, {
      headers: getAuthHeaders()
    });
    return response.data;
  } catch (error) {
    handleApiError(error, "fetching all job listings");
  }
};




export const getPaginatedJobListings = async (page = 0, size = 10) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/job-listings/paginated`, {
      params: { page, size },
      headers: getAuthHeaders()
    });
    return response.data;
  } catch (error) {
    handleApiError(error, "fetching paginated job listing");
  }
};







export const getJobListingById = async (id) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/job-listings/${id}`, {
      headers: getAuthHeaders()
    });
    return response.data;
  } catch (error) {
    handleApiError(error, "fetching job listing by ID");
  }
};

export const updateJobListing = async (id, jobListingData) => {
  try {
    const response = await axios.put(`${API_BASE_URL}/job-listings/${id}`, jobListingData, {
      headers: getAuthHeaders()
    });
    return response.data;
  } catch (error) {
    handleApiError(error, "updating job listing");
  }
};


export const deleteJobListing = async (id) => {
  console.group('[API] DELETE Job Listing');
  try {
      console.log('Making request to:', `${API_BASE_URL}/job-listings/${id}`);
      const response = await axios.delete(`${API_BASE_URL}/job-listings/${id}`, {
          headers: getAuthHeaders(),
          withCredentials: true
      });
      
      console.log('Response received:', {
          status: response.status,
          data: response.data
      });
      
      return response.data;
  } catch (error) {
      console.error('Error details:', {
          status: error.response?.status,
          data: error.response?.data,
          config: error.config
      });
      throw error;
  } finally {
      console.groupEnd();
  }
};






// Job Category APIs
export const postJobCategory = async (jobCategoryData) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/jobcategories`, jobCategoryData, {
      headers: getAuthHeaders()
    });
    return response.data;
  } catch (error) {
    handleApiError(error, "creating job category");
  }
};

export const getAllJobCategories = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/jobcategories`, {
      headers: getAuthHeaders()
    });
    return response.data;
  } catch (error) {
    handleApiError(error, "fetching job categories");
  }
};

export const getPaginatedJobCategories = async (page = 0, size = 10) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/jobcategories/paginated`, {
      params: { page, size },
      headers: getAuthHeaders()
    });
    return response.data;
  } catch (error) {
    handleApiError(error, "fetching paginated job categories");
  }
};

export const getJobCategoryById = async (id) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/jobcategories/${id}`, {
      headers: getAuthHeaders()
    });
    return response.data;
  } catch (error) {
    handleApiError(error, `fetching job category with ID ${id}`);
  }
};

export const updateJobCategory = async (id, jobCategoryData) => {
  try {
    const response = await axios.put(`${API_BASE_URL}/jobcategories/${id}`, jobCategoryData, {
      headers: getAuthHeaders()
    });
    return response.data;
  } catch (error) {
    handleApiError(error, `updating job category with ID ${id}`);
  }
};

export const deleteJobCategory = async (id) => {
  try {
    const response = await axios.delete(`${API_BASE_URL}/jobcategories/${id}`, {
      headers: getAuthHeaders()
    });
    return response.data;
  } catch (error) {
    handleApiError(error, `deleting job category with ID ${id}`);
  }
};


