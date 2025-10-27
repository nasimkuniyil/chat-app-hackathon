import { useSelector, useDispatch } from 'react-redux';
   import { toggleMenu, setSelectedAction, closeMenu } from '../redux/slices/menuSlice';

   export const useMenu = () => {
     const dispatch = useDispatch();
     const isMenuOpen = useSelector((state) => state.menu.isMenuOpen);
     const selectedAction = useSelector((state) => state.menu.selectedAction);

     const handleToggleMenu = () => {
       dispatch(toggleMenu());
     };

     const handleSelectAction = (action) => {
       dispatch(setSelectedAction(action));
     };

     const handleCloseMenu = () => {
       dispatch(closeMenu());
     };

     return {
       isMenuOpen,
       selectedAction,
       handleToggleMenu,
       handleSelectAction,
       handleCloseMenu,
     };
   };