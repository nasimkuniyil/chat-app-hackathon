import React from 'react';
   import { useMenu } from '../features/useMenu';
import { BsThreeDots, BsThreeDotsVertical } from 'react-icons/bs';
import { ButtonSM, ButtonXL } from './buttons';
import { useAuth } from '../features/useAuth';

   const ThreeDotMenu = () => {
     const { isMenuOpen, handleToggleMenu, handleSelectAction, handleCloseMenu } = useMenu();
     const {logout} = useAuth();

     const menuActions = [
       { label: 'DND', action: 'edit' },
       { label: <ButtonXL onClick={logout}>Logout</ButtonXL>, action:null},
     ];

     return (
       <div className="relative">
         {/* Three-dot icon (assuming you have it; using a simple SVG for demo) */}
         <button
           className="p-2 text-gray-600 hover:text-gray-800 focus:outline-none cursor-pointer"
           onClick={handleToggleMenu}
         >
           <BsThreeDotsVertical />
         </button>

         {/* Menu */}
         {isMenuOpen && (
           <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-md shadow-lg z-100">
             <div className="py-1">
               {menuActions.map(({ label, action }) => (
                 <button
                   key={action}
                   className="w-full text-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 focus:outline-none cursor-pointer"
                   onClick={() => {
                     handleSelectAction(action);
                     handleCloseMenu();
                   }}
                 >
                   {label}
                 </button>
               ))}
             </div>
           </div>
         )}
       </div>
     );
   };

   export default ThreeDotMenu;