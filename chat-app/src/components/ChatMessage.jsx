import React, { useState } from 'react';
import { formatDistanceToNow } from 'date-fns';
import PropTypes from 'prop-types';
import ThreadModal from './ThreadModal';

const ChatMessage = ({ message, currentUserId }) => {
    const [isThreadOpen, setThreadOpen] = useState(false);
    const { _id, t, msg, u, ts, md } = message;
    const isSystemMessage = t === 'uj';
    const isOwnMessage = u._id === currentUserId;

    const formattedTime = formatDistanceToNow(new Date(ts), { addSuffix: true });

    // Render message content
    const renderContent = () => {
        if (isSystemMessage) {
            return (
                <div className={`p-5 rounded-md text-sm text-gray-500 italic text-center`}>
                    {u.name} joined the channel
                </div>
            );
        }

        const content = md?.[0]?.value?.[0]?.value || msg;

        return (
            <div className='flex'>
                <div className={` text-sm w-fit shadow-sm text-gray-800 break-words px-3 py-2 rounded-lg ${isOwnMessage
                    ? 'bg-white ml-auto'
                    : 'bg-purple-100 mr-auto'}`}>
                    {content}
                </div>
                {/* Thread icon for starting a new thread */}
                {!isSystemMessage && !isOwnMessage && !message.tcount && (
                    <button
                        onClick={() => setThreadOpen(true)}
                        className=" p-2 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                        title="Start thread"
                    >
                        <svg className="w-5 h-5 text-gray-400 hover:text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                        </svg>
                    </button>
                )}
            </div>
        );
    };

    return (
        <div
            className={`flex group relative ${isSystemMessage ? 'justify-center' : isOwnMessage ? 'justify-end' : 'justify-start'} mb-5 w-full`}
            data-message-id={_id}
        >
            { !isOwnMessage && !isSystemMessage && <div className='h-6 w-6 flex items-center justify-center mr-2 text-white bg-gradient-to-br from-blue-500 to-purple-600  rounded-full'>
                    <p className='font-semibold text-xs'>{u.name.split(" ")[0][0]}</p>
                </div>}
            <div
                className={`max-w-[70%] ${isSystemMessage && 'bg-gray-100 text-center'
                    }`}
            >
                {!isSystemMessage && (
                    <div className="ml-1 mb-1 text-xs font-semibold text-gray-400">
                        {!isOwnMessage && u.name}
                    </div>
                )}
                {renderContent()}
                <div className="flex items-center justify-end gap-4 mt-1">
                    {message.tcount > 0 && (
                        <button
                            onClick={() => setThreadOpen(true)}
                            className="text-xs text-blue-500 hover:text-blue-600"
                        >
                            {message.tcount} {message.tcount === 1 ? 'reply' : 'replies'}
                        </button>
                    )}
                    <div className="text-xs text-gray-400">
                        {formattedTime}
                    </div>
                </div>
            </div>

            {/* Thread Modal */}
            <ThreadModal
                isOpen={isThreadOpen}
                onClose={() => setThreadOpen(false)}
                message={message}
                roomId={message.rid}
            />
        </div>
    );
};

ChatMessage.propTypes = {
    message: PropTypes.shape({
        _id: PropTypes.string.isRequired,
        t: PropTypes.string,
        msg: PropTypes.string,
        u: PropTypes.shape({
            _id: PropTypes.string.isRequired,
            username: PropTypes.string.isRequired,
            name: PropTypes.string.isRequired,
        }).isRequired,
        ts: PropTypes.string.isRequired,
        md: PropTypes.arrayOf(
            PropTypes.shape({
                type: PropTypes.string,
                value: PropTypes.arrayOf(
                    PropTypes.shape({
                        type: PropTypes.string,
                        value: PropTypes.string,
                    })
                ),
            })
        ),
    }).isRequired,
    currentUserId: PropTypes.string.isRequired,
};

export default ChatMessage;