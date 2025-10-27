import React, { useState } from "react";
import RoomList from "../../RoomList";
import MessageInput from "../../MessageInput";
import { BsChatDots } from "react-icons/bs";
import ChatMessage from "../../../components/ChatMessage";
import { useAuth } from "../../../features/useAuth";
import { LuUserRoundPlus } from "react-icons/lu";
import Modal from "../../../components/Modal";

const Content = ({ rooms, currentRoom, handleRoomSelect, messages, onChannelCreated }) => {
  const {userId, authToken} = useAuth();
  const [isInviteOpen, setInviteOpen] = useState(false);

  const baseUrl = import.meta.env.VITE_ROCKETCHAT_URL || '';
  // Determine if the current user is the creator of the room.
  // Rooms from Rocket.Chat may expose the creator as `createdBy`, `creator` or sometimes `u`.
  const creatorId = currentRoom?.createdBy?._id || currentRoom?.creator?._id || currentRoom?.u?._id || currentRoom?.ownerId || currentRoom?.userId || null;
  const isCreator = Boolean(creatorId && userId && creatorId === userId);
  // Extract a display name for the creator if available
  const creatorName = currentRoom?.createdBy?.name || currentRoom?.creator?.name || currentRoom?.u?.name || currentRoom?.ownerName || currentRoom?.createdBy?.username || null;
  console.log("message : ", messages)
  return (
    <div className="flex-1 flex flex-col md:flex-row bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Sidebar */}
      <div className="md:w-80 bg-white/80 backdrop-blur-xl border-r border-gray-100/50 shadow-sm">
        <RoomList
          rooms={rooms}
          currentRoom={currentRoom}
          onRoomSelect={handleRoomSelect}
          onChannelCreated={onChannelCreated}
        />
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col justify-between">
        {currentRoom ? (
          <>
            {/* Chat Header */}
            <div className="bg-white/80 backdrop-blur-xl px-6 py-4 border-b border-gray-100/50 shadow-sm">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-sm">
                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 20l4-16m2 16l4-16M6 9h14M4 15h14" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 tracking-tight">
                      #{currentRoom.name}
                    </h3>
                    {/* <p className="text-gray-500 text-sm">{currentRoom.topic || "No topic set"}</p> */}
                    {creatorName && (
                      <div className="text-sm text-gray-500 mt-1">Created by {creatorName}</div>
                    )}
                  </div>
                </div>
                
                {/* Room Actions */}
                <div className="flex items-center space-x-2">
                  {isCreator ? (
                    <button onClick={() => setInviteOpen(true)} className="p-2 rounded-xl hover:bg-gray-100 transition-colors duration-200 group">
                      <LuUserRoundPlus />
                    </button>
                  ) : (
                    <button disabled title="Only the channel creator can invite" className="p-2 rounded-xl opacity-50 cursor-not-allowed">
                      <LuUserRoundPlus />
                    </button>
                  )}
                  {/* <button className="p-2 rounded-xl hover:bg-gray-100 transition-colors duration-200 group">
                    <svg className="w-5 h-5 text-gray-500 group-hover:text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </button> */}
                </div>
              </div>
            </div>

            {/* Invite Modal */}
            <Modal isOpen={isInviteOpen} onClose={() => setInviteOpen(false)} title="Invite to channel">
              <div className="space-y-4">
                <p className="text-sm text-gray-600">Share this link to invite others to <span className="font-medium">#{currentRoom?.name}</span></p>
                <div className="flex gap-2">
                  <input readOnly value={`${baseUrl}/channel-invite?roomId=${currentRoom?._id}`} className="flex-1 px-3 py-2 border border-gray-300 rounded-lg bg-gray-50" />
                  <button onClick={async () => {
                    try {
                      await navigator.clipboard.writeText(`${baseUrl}/channel-invite?roomId=${currentRoom?._id}`);
                      alert('Invite link copied to clipboard!');
                    } catch (err) {
                      console.error('Copy failed', err);
                    }
                  }} className="px-4 py-2 bg-gray-900 text-white rounded-lg">Copy</button>
                </div>
                <p className="text-xs text-gray-400">Recipients can paste the link in their profile modal to join the channel.</p>
              </div>
            </Modal>

            {/* Messages Area */}
            <div className="relative flex flex-col items-center   text-gray-500 overflow-y-auto p-8 h-[calc(100vh-280px)]">
            {messages.length <= 0 ? (
              <div className="flex-1 overflow-y-auto p-6 bg-gradient-to-b from-white/50 to-gray-50/50">
              {/* Placeholder for messages */}
                <div className="w-20 h-20 bg-gray-100 rounded-3xl flex items-center justify-center mb-4">
                  <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  </svg>
                </div>
                <h4 className="text-lg font-medium text-gray-700 mb-2">Start the conversation</h4>
                <p className="text-sm text-gray-500 text-center max-w-sm">
                  Messages will appear here when you start chatting in #{currentRoom.name}
                </p>
              </div>
            ):(
              messages.map((msg)=><ChatMessage key={msg._id} currentUserId={userId} message={msg}/>)
            )}
            </div>

            {/* Message Input */}
            <MessageInput
              roomId={currentRoom._id}
              onNewMessage={null}
            />
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center bg-gradient-to-br from-white/50 to-gray-50/50">
            <div className="text-center max-w-md">
              <div className="w-24 h-24 bg-gradient-to-br from-blue-100 to-purple-100 rounded-3xl mx-auto mb-6 flex items-center justify-center">
                <BsChatDots className="w-10 h-10 text-blue-500"/>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3 tracking-tight">
                Select a channel to start chatting
              </h3>
              <p className="text-gray-500 text-sm leading-relaxed">
                Choose a channel from the sidebar to view messages and start conversations with your team.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Content;
