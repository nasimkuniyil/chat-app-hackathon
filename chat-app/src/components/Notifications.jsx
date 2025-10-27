import React from 'react'

const Notifications = () => {
    const notifications = []; 
    return (
        <div className="flex flex-col gap-4">
            <div>
                {notifications.length === 0 ? (
                    <p className="text-gray-600">No new notifications</p>
                ) : (
                    notifications.map((notification) => (
                        <div key={notification.id} className="p-4 border-b border-gray-200">
                            <p className="font-semibold">{notification.title}</p>
                            <p className="text-sm text-gray-500">{notification.message}</p>
                        </div>
                    ))
                )}
            </div>
            <div>
                {notifications.length > 0 && (
                    <button className="w-full bg-blue-600 text-white py-2 rounded-xl hover:bg-blue-500">Clear All</button>
                )}
            </div>
        </div>
    )
}

export default Notifications