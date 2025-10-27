import axios from 'axios';

const BASE_URL = import.meta.env.VITE_ROCKETCHAT_URL;

const api = axios.create({
  baseURL: `${BASE_URL}/api/v1`,
});

// Helper function to get auth headers
const getAuthHeaders = (authToken, userId) => ({
  'X-Auth-Token': authToken,
  'X-User-Id': userId,
  'Content-Type': 'application/json',
});

// Authentication
export const login = async (username, password) => {
  try {
    console.log('login called')
    const response = await api.post('/login', {
      user: username,
      password: password,
    });
    
    if (response.data.status === 'success') {
      return {
        success: true,
        authToken: response.data.data.authToken,
        userId: response.data.data.userId,
        user: response.data.data.me,
      };
    } else {
      return {
        success: false,
        error: response.data.error || 'Login failed',
      };
    }
  } catch (error) {
    return {
      success: false,
      error: error.response?.data?.error || 'Network error during login',
    };
  }
};

// Get user info
export const getUserInfo = async (authToken, userId) => {
  try {
    console.log('getuserinfo called')

    const response = await api.get('/me', {
      headers: getAuthHeaders(authToken, userId),
    });
    return {
      success: true,
      user: response.data,
    };
  } catch (error) {
    return {
      success: false,
      error: error.response?.data?.error || 'Failed to get user info',
    };
  }
};

// Get rooms/channels
export const getRooms = async (authToken, userId) => {
  try {
    console.log('getrooms called')

    const response = await api.get('/rooms.get', {
      headers: getAuthHeaders(authToken, userId),
    });
    console.log('res : ', response.data)
    return {
      success: true,
      rooms: response.data.update || [],
    };
  } catch (error) {
    return {
      success: false,
      error: error.response?.data?.error || 'Failed to get rooms',
    };
  }
};

// Get messages for a room
export const getMessages = async (roomId, authToken, userId, count = 50) => {
  try {
    console.log('getmessages called')
    const response = await api.get(`/channels.history?roomId=${roomId}&count=${count}`, {
      headers: getAuthHeaders(authToken, userId),
    });
    return {
      success: true,
      messages: response.data.messages || [],
    };
  } catch (error) {
    return {
      success: false,
      error: error.response?.data?.error || 'Failed to get messages',
    };
  }
};

// Create a new Channel
export const createChannel = async (name, authToken, userId) => {
  try {
    console.log('createChannel called')
    const response = await api.post('/channels.create', {
      name: name,
    }, {
      headers: getAuthHeaders(authToken, userId),
    });
    return {
      success: true,
      channel: response.data.channel,
    };
  } catch (error) {
    return {
      success: false,
      error: error.response?.data?.error || 'Failed to create channel',
    };
  }
};  

// Send a message
export const sendMessage = async (roomId, message, authToken, userId) => {
  try {
    console.log('sendMessage called')
    const response = await api.post('/chat.sendMessage', {
      message: {
        rid: roomId,
        msg: message,
      },
    }, {
      headers: getAuthHeaders(authToken, userId),
    });
    return {
      success: true,
      message: response.data,
    };
  } catch (error) {
    return {
      success: false,
      error: error.response?.data?.error || 'Failed to send message',
    };
  }
};

// Get room info
export const getRoomInfo = async (roomId, authToken, userId) => {
  try {
    console.log('getRoomInfo called')
    const response = await api.get(`/rooms.info?roomId=${roomId}`, {
      headers: getAuthHeaders(authToken, userId),
    });
    return {
      success: true,
      room: response.data.room,
    };
  } catch (error) {
    return {
      success: false,
      error: error.response?.data?.error || 'Failed to get room info',
    };
  }
};

// Get thread messages
export const getThreadReplies = async (messageId, authToken, userId) => {
  try {
    const response = await api.get(`/chat.getThreadMessages?tmid=${messageId}`, {
      headers: getAuthHeaders(authToken, userId),
    });
    return {
      success: true,
      messages: response.data.messages || [],
    };
  } catch (error) {
    return {
      success: false,
      error: error.response?.data?.error || 'Failed to get thread messages',
    };
  }
};

// Reply to a thread
export const replyToThread = async (roomId, message, threadMessageId, authToken, userId) => {
  try {
    const response = await api.post('/chat.sendMessage', {
      message: {
        rid: roomId,
        msg: message,
        tmid: threadMessageId, // thread message ID
      },
    }, {
      headers: getAuthHeaders(authToken, userId),
    });
    return {
      success: true,
      message: response.data.message,
    };
  } catch (error) {
    return {
      success: false,
      error: error.response?.data?.error || 'Failed to send thread reply',
    };
  }
};

// Join a channel by roomId or roomName
export const joinChannel = async ({ roomId, roomName }, authToken, userId) => {
  try {
    const body = {};
    if (roomId) body.roomId = roomId;
    if (roomName) body.roomName = roomName;
    const response = await api.post('/channels.join', body, {
      headers: getAuthHeaders(authToken, userId),
    });
    return {
      success: true,
      room: response.data.channel || response.data.room || null,
    };
  } catch (error) {
    return {
      success: false,
      error: error.response?.data?.error || 'Failed to join channel',
    };
  }
};

// Logout
export const logout = async (authToken, userId) => {
  try {
    console.log('logout called')
    await api.post('/logout', {}, {
      headers: getAuthHeaders(authToken, userId),
    });
    return { success: true };
  } catch (error) {
    return {
      success: false,
      error: error.response?.data?.error || 'Logout failed',
    };
  }
};

