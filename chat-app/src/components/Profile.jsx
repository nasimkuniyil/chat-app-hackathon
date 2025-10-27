import React, { useState } from 'react'
import { joinChannel } from '../services/rocketchat';
import { useAuth } from '../features/useAuth';

const Profile = ({ user, handleLogout, setProfileOpen }) => {
    const { authToken, userId } = useAuth();
    const [inviteLink, setInviteLink] = useState('');
    const [joining, setJoining] = useState(false);
    const [joinError, setJoinError] = useState('');
    return (
        <div className="flex flex-col gap-4">
            <div className="flex items-center space-x-4">
                <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center shadow-sm">
                    <span className="text-white font-semibold text-xl">{(user?.name || user?.username || "U").charAt(0).toUpperCase()}</span>
                </div>
                <div>
                    <h4 className="text-lg font-semibold text-gray-900">{user?.name || user?.username}</h4>
                    <p className="text-sm text-gray-500">{user?.email}</p>
                </div>
            </div>

            <div className="pt-4 border-t border-gray-100">
                <h4 className="text-sm font-medium text-gray-900 mb-2">Join channel by invite link</h4>
                <div className="flex gap-2">
                    <input value={inviteLink} onChange={(e)=>setInviteLink(e.target.value)} placeholder="Paste invite link here" className="flex-1 px-3 py-2 border border-gray-300 rounded-lg" />
                    <button disabled={joining} onClick={async ()=>{
                        setJoining(true); setJoinError('');
                        try{
                            // parse roomId from simple query param ?roomId=...
                            const url = new URL(inviteLink);
                            const roomId = url.searchParams.get('roomId');
                            if(!roomId) throw new Error('Invalid invite link');
                            const res = await joinChannel({ roomId }, authToken, userId);
                            if(res.success){
                                setInviteLink('');
                                setProfileOpen(false);
                            } else {
                                setJoinError(res.error || 'Failed to join channel');
                            }
                        }catch(err){
                            setJoinError(err.message || 'Failed to join channel');
                        }finally{setJoining(false)}
                    }} className="px-4 py-2 bg-gray-900 text-white rounded-lg">Join</button>
                </div>
                {joinError && <p className="text-sm text-red-600 mt-2">{joinError}</p>}
            </div>


            <div className="flex gap-3">
                <button onClick={() => { handleLogout(); setProfileOpen(false); }} className="flex-1 bg-red-600 text-white py-2 rounded-xl hover:bg-red-500">Sign out</button>
                <button onClick={() => setProfileOpen(false)} className="flex-1 bg-gray-100 text-gray-800 py-2 rounded-xl hover:bg-gray-200">Close</button>
            </div>
        </div>
    )
}

export default Profile