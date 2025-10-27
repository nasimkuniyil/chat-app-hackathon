import React, { useState, useEffect } from 'react';
import { useAuth } from '../../features/useAuth';
import { getRooms, getMessages } from '../../services/rocketchat';
import Header from './components/Header';
import Content from './components/Content';
// import MessageList from './MessageList';
// import MessageInput from './MessageInput';

const ChatLayout = () => {
  const { authToken, userId, user } = useAuth();
  const [rooms, setRooms] = useState([]);
  const [currentRoom, setCurrentRoom] = useState(null);
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Load rooms on mount and when needed
  const loadRooms = async () => {
    if (!authToken || !userId) return;
    try {
      const result = await getRooms(authToken, userId);
      console.log('rooms : ', result.rooms)
      if (result.success) {
        setRooms(result.rooms);
        if (result.rooms.length > 0) {
          setCurrentRoom(result.rooms[0]);
        }
      } else {
        setError(result.error);
      }
    } catch (err) {
      setError('Failed to load rooms');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadRooms();
  }, [authToken, userId]);

  // Handler to refresh rooms after channel creation
  const handleChannelCreated = () => {
    loadRooms();
  };

  // Load messages when room changes
  useEffect(() => {
    const loadMessages = async () => {
      if (!currentRoom || !authToken || !userId) return;
      try {
        const result = await getMessages(currentRoom._id, authToken, userId);
        if (result.success) {
          setMessages(result.messages.reverse());
        } else {
          setError(result.error);
        }
      } catch (err) {
        setError('Failed to load messages');
      }
    };
    loadMessages();
  }, [currentRoom, authToken, userId]);

  // Poll for new messages every 3 seconds
  // useEffect(() => {
  //   if (!currentRoom || !authToken || !userId) return;
  //   const pollMessages = async () => {
  //     try {
  //       const result = await getMessages(currentRoom._id, authToken, userId);
  //       if (result.success) {
  //         const newMessages = result.messages.reverse();
  //         setMessages(prevMessages => {
  //           if (newMessages.length !== prevMessages.length) {
  //             return newMessages;
  //           }
  //           return prevMessages;
  //         });
  //       }
  //     } catch (err) {
  //       console.error('Error polling messages:', err);
  //     }
  //   };
  //   pollMessages();
  //   // const interval = setInterval(pollMessages, 3000);
  //   // return () => clearInterval(interval);
  // }, [currentRoom, authToken, userId]);

  const handleRoomSelect = (room) => {
    setCurrentRoom(room);
    console.log("-- > ",room)
    setMessages([]);
  };

  const handleNewMessage = (message) => {
    setMessages(prevMessages => [...prevMessages, message]);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="flex flex-col items-center gap-6">
          <div className="w-16 h-16 border-4 border-gray-300 border-t-gray-900 rounded-full animate-spin"></div>
          <div className="text-center">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Loading chat...</h3>
            <p className="text-gray-500 text-sm">Setting up your workspace</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 px-4">
        <div className="bg-white/80 backdrop-blur-xl p-8 rounded-3xl shadow-2xl border border-gray-200/50 text-center max-w-md w-full">
          <div className="w-16 h-16 bg-red-100 rounded-2xl mx-auto mb-6 flex items-center justify-center">
            <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h2 className="text-xl font-semibold text-gray-900 mb-3 tracking-tight">Connection Error</h2>
          <p className="text-gray-600 mb-6 text-sm leading-relaxed">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="bg-gray-900 text-white py-3 px-6 rounded-xl hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:ring-offset-2 transition-all duration-200 font-medium shadow-sm hover:shadow-md"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-gray-50 to-gray-100">
      <Header user={user}/>
      <Content
        rooms={rooms}
        currentRoom={currentRoom}
        handleRoomSelect={handleRoomSelect}
        messages={messages}
        onChannelCreated={handleChannelCreated}
      />
    </div>
  );
};

export default ChatLayout;