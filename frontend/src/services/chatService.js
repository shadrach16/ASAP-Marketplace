import api from './api';

/**
 * Fetches message history for a specific booking.
 * @param {string} bookingId - The ID of the booking.
 * @returns {Promise<Array>} - An array of message objects.
 */
const getMessages = async (bookingId) => {
  try {
    const response = await api.get(`/chats/${bookingId}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

/**
 * Sends a chat message (text, or file/text combo) via REST API.
 * Uses FormData for file upload compatibility.
 * @param {string} bookingId - The ID of the booking.
 * @param {string} message - The message content.
 * @param {File | null} file - Optional File object to upload.
 * @returns {Promise<object>} - The sent message object.
 */
const sendMessage = async (bookingId, message, file = null) => {
  const formData = new FormData();
  
  if (message) {
    formData.append('message', message);
  }
  
  if (file) {
    // 'file' must match the field name used in multer middleware (upload.single('file'))
    formData.append('file', file, file.name); 
  }
  
  try {
    const response = await api.post(`/chats/${bookingId}`, formData, {
        headers: {
            'Content-Type': 'multipart/form-data', // Essential for file uploads
        },
    });
    return response.data;
  } catch (error) {
    const errorMessage = error.response?.data?.message || error.message || 'An unknown error occurred';
    throw new Error(errorMessage);
  }
};

/**
 * Edits an existing chat message.
 * @param {string} messageId - The ID of the message to edit.
 * @param {string} newMessage - The new message content.
 * @returns {Promise<object>} - The updated message object.
 */
const editMessage = async (messageId, newMessage) => {
    try {
        const response = await api.put(`/chats/${messageId}`, { newMessage });
        return response.data;
    } catch (error) {
        const errorMessage = error.response?.data?.message || error.message || 'An unknown error occurred during edit';
        throw new Error(errorMessage);
    }
};


/**
 * Fetches a list of all chat threads (bookings) for the current user.
 * NOTE: This requires a new backend route (e.g., /api/chats/my-threads) to be implemented.
 * @returns {Promise<Array>} - An array of chat/booking summary objects.
 */
const getChatList = async () => {
  try {
    const response = await api.get('/chats/my-threads'); 
    return response.data;
  } catch (error) {
    const errorMessage = error.response?.data?.message || error.message || 'Failed to fetch chat list.';
    throw new Error(errorMessage);
  }
};


/**
 * Marks all messages in a specific booking chat thread as read for the current user.
 * @param {string} bookingId - The ID of the booking/chat thread.
 * @returns {Promise<void>}
 */
const markChatAsRead = async (bookingId) => {
  try {
    // Send a PUT request to the new endpoint
    const response = await api.put(`/chats/${bookingId}/read`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};


/**
 * Fetches the booking details for a given proposal ID.
 * @param {string} proposalId - The ID of the proposal.
 * @returns {Promise<object | null>} - The Booking object or null if 404.
 */
const getBookingByProposalId = async (proposalId) => {
  try {
    const response = await api.get(`/chats/booking-by-proposal/${proposalId}`);
    return response.data; 
  } catch (error) {
    // Return null if the booking hasn't been created for the proposal yet
    if (error.response && error.response.status === 404) {
      return null;
    }
    throw error.response?.data || error;
  }
};


const chatService = {
  getMessages,
  sendMessage,
  editMessage, 
  getChatList,
  markChatAsRead,
  getBookingByProposalId
};

export default chatService;