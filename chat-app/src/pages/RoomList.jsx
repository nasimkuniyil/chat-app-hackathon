import React, { useState } from 'react';
import { BsHash, BsLayers } from 'react-icons/bs';
import { IoLockClosedOutline } from 'react-icons/io5';
import { FaRegUser } from 'react-icons/fa';
import { IconButton } from '../components/buttons';
import Modal from '../components/Modal';
import { ButtonSM } from '../components/buttons';
import { createChannel } from '../services/rocketchat';
import { useAuth } from '../features/useAuth';

const RoomList = ({ rooms, currentRoom, onRoomSelect, onChannelCreated }) => {
  const { authToken, userId } = useAuth();
  const [isCreateModalOpen, setCreateModalOpen] = useState(false);
  const [newChannelName, setNewChannelName] = useState('');
  const [isCreating, setIsCreating] = useState(false);
  const [error, setError] = useState('');
  return (
    <div className="flex flex-col h-full bg-white/80 backdrop-blur-xl">
      {/* Header */}
      <div className="px-6 py-4 border-b border-gray-100/50">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <h3 className="text-lg font-semibold text-gray-900 tracking-tight">Channels</h3>
            <div className="bg-gray-100 rounded-full px-3 py-1">
              <span className="text-sm text-gray-600 font-medium">{rooms.length}</span>
            </div>
          </div>
          <div>
            <IconButton onClick={() => setCreateModalOpen(true)}>+</IconButton>
          </div>
        </div>
      </div>

      {/* Create Channel Modal */}
      <Modal
        isOpen={isCreateModalOpen}
        onClose={() => {
          setCreateModalOpen(false);
          setNewChannelName('');
        }}
        title="Create New Channel"
        size="sm"
      >
        <form onSubmit={async (e) => {
          e.preventDefault();
          if (!newChannelName.trim()) return;
          
          setIsCreating(true);
          setError('');
          try {
            const response = await createChannel(newChannelName.trim(), authToken, userId);
            if (response.success) {
              setCreateModalOpen(false);
              setNewChannelName('');
              // Refresh the rooms list in parent
              if (onChannelCreated) {
                onChannelCreated();
              }
              if (onRoomSelect && response.channel) {
                onRoomSelect(response.channel);
              }
            } else {
              setError(response.error || 'Failed to create channel');
            }
          } catch (error) {
            console.error('Failed to create channel:', error);
            setError('Failed to create channel. Please try again.');
          } finally {
            setIsCreating(false);
          }
        }}>
          <div className="space-y-4">
            <div>
              <label htmlFor="channelName" className="block text-sm font-medium text-gray-700 mb-1">
                Channel Name
              </label>
              <input
                type="text"
                id="channelName"
                value={newChannelName}
                onChange={(e) => setNewChannelName(e.target.value)}
                placeholder="e.g., general"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                disabled={isCreating}
              />
              <p className="mt-1 text-xs text-gray-500">
                Channel names can't contain spaces. Use hyphens or underscores instead.
              </p>
              {error && (
                <p className="mt-2 text-sm text-red-600">
                  {error}
                </p>
              )}
            </div>
            
            <div className="flex gap-3 pt-2">
              <ButtonSM
                onClick={() => setCreateModalOpen(false)}
                className="flex-1 !bg-gray-100 !text-gray-800 hover:!bg-gray-200"
                disabled={isCreating}
              >
                Cancel
              </ButtonSM>
              <ButtonSM
                type="submit"
                className="flex-1"
                disabled={!newChannelName.trim() || isCreating}
              >
                {isCreating ? 'Creating...' : 'Create Channel'}
              </ButtonSM>
            </div>
          </div>
        </form>
      </Modal>

      {/* Room List */}
      <div className="flex-1 overflow-y-auto px-3 py-2">
        {rooms.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-gray-500">
            <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mb-4">
              <BsLayers className="w-8 h-8 text-gray-400" />
            </div>
            <p className="text-sm font-medium">No channels available</p>
            <p className="text-xs text-gray-400 mt-1">Channels will appear here when available</p>
          </div>
        ) : (
          <div className="space-y-1">
            {rooms.map((room) => (
              <div
                key={room._id}
                className={`group relative flex items-center p-3 rounded-xl cursor-pointer transition-all duration-200 ${currentRoom?._id === room._id
                    ? 'bg-blue-50 border border-blue-200 shadow-sm'
                    : 'hover:bg-gray-50 hover:shadow-sm'
                  }`}
                onClick={() => {
                  console.log(room)
                  onRoomSelect(room);
                }}
              >
                {/* Room Icon */}
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center mr-3 transition-colors ${currentRoom?._id === room._id
                    ? 'bg-blue-100 text-blue-600'
                    : 'bg-gray-100 text-gray-500 group-hover:bg-gray-200'
                  }`}>
                  {room.t === 'c' ? (
                    <BsHash className="w-5 h-5" />
                  ) : room.t === 'd' ? (
                    <FaRegUser className='w-5 h-5' />
                  ) : (
                    <IoLockClosedOutline className='w-5 h-5' />
                  )}
                </div>

                {/* Room Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <h4 className={`font-medium truncate ${currentRoom?._id === room._id ? 'text-blue-900' : 'text-gray-900'
                      }`}>
                      {room.name || room.fname || 'Unnamed Room'}
                    </h4>
                    {room.unread > 0 && (
                      <div className="ml-2 bg-red-500 text-white text-xs font-semibold rounded-full px-2 py-1 min-w-[20px] text-center">
                        {room.unread}
                      </div>
                    )}
                  </div>
                  <p className={`text-sm truncate mt-1 ${currentRoom?._id === room._id ? 'text-blue-600' : 'text-gray-500'
                    }`}>
                    {room.topic || room.lastMessage?.msg || 'No recent messages'}
                  </p>
                </div>

                {/* Active indicator */}
                {currentRoom?._id === room._id && (
                  <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default RoomList;