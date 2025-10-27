import React, { useState, useEffect } from 'react';
import Modal from './Modal';
import { getThreadReplies, replyToThread } from '../services/rocketchat';
import { useAuth } from '../features/useAuth';
import { formatDistanceToNow } from 'date-fns';
import { ButtonSM } from './buttons';

const ThreadModal = ({ isOpen, onClose, message, roomId }) => {
  const { authToken, userId } = useAuth();
  const [replies, setReplies] = useState([]);
  const [replyText, setReplyText] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (isOpen && message?._id) {
      loadReplies();
    }
  }, [isOpen, message?._id]);

  const loadReplies = async () => {
    setIsLoading(true);
    try {
      const result = await getThreadReplies(message._id, authToken, userId);
      if (result.success) {
        setReplies(result.messages);
      } else {
        setError('Failed to load replies');
      }
    } catch (err) {
      setError('Error loading replies');
    } finally {
      setIsLoading(false);
    }
  };

  const handleReply = async (e) => {
    e.preventDefault();
    if (!replyText.trim()) return;

    try {
      const result = await replyToThread(
        roomId,
        replyText,
        message._id,
        authToken,
        userId
      );
      if (result.success) {
        setReplyText('');
        loadReplies(); // Reload replies after sending
      } else {
        setError('Failed to send reply');
      }
    } catch (err) {
      setError('Error sending reply');
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Thread" size="md">
      <div className="space-y-4">
        {/* Original message */}
        {message && (
          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-sm font-semibold">
                {message.u.name.split(" ")[0][0]}
              </div>
              <div>
                <div className="font-medium text-gray-900">{message.u.name}</div>
                <div className="text-xs text-gray-500">
                  {formatDistanceToNow(new Date(message.ts), { addSuffix: true })}
                </div>
              </div>
            </div>
            <p className="text-gray-700">{message.msg}</p>
          </div>
        )}

        {/* Replies section */}
        <div className="space-y-4 max-h-[400px] overflow-y-auto">
          {isLoading ? (
            <div className="text-center py-4">Loading replies...</div>
          ) : replies.length > 0 ? (
            replies.map((reply) => (
              <div key={reply._id} className="pl-4 border-l-2 border-gray-200">
                <div className="flex items-center gap-2 mb-1">
                  <div className="w-6 h-6 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-xs font-semibold">
                    {reply.u.name.split(" ")[0][0]}
                  </div>
                  <div className="text-sm font-medium text-gray-900">
                    {reply.u.name}
                  </div>
                  <div className="text-xs text-gray-500">
                    {formatDistanceToNow(new Date(reply.ts), { addSuffix: true })}
                  </div>
                </div>
                <p className="text-gray-700 text-sm ml-8">{reply.msg}</p>
              </div>
            ))
          ) : (
            <div className="text-center text-gray-500">No replies yet</div>
          )}
        </div>

        {/* Reply form */}
        <form onSubmit={handleReply} className="space-y-3">
          {error && (
            <div className="text-sm text-red-600 bg-red-50 p-2 rounded">
              {error}
            </div>
          )}
          <textarea
            value={replyText}
            onChange={(e) => setReplyText(e.target.value)}
            placeholder="Write a reply..."
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 min-h-[80px]"
          />
          <div className="flex justify-end gap-2">
            <ButtonSM
              onClick={onClose}
              className="!bg-gray-100 !text-gray-800 hover:!bg-gray-200"
            >
              Cancel
            </ButtonSM>
            <ButtonSM
              type="submit"
              disabled={!replyText.trim()}
            >
              Reply
            </ButtonSM>
          </div>
        </form>
      </div>
    </Modal>
  );
};

export default ThreadModal;