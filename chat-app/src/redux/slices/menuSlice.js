import { createSlice } from '@reduxjs/toolkit';

   const menuSlice = createSlice({
     name: 'menu',
     initialState: {
       isMenuOpen: false,
       selectedAction: null,
     },
     reducers: {
       toggleMenu: (state) => {
         state.isMenuOpen = !state.isMenuOpen;
       },
       setSelectedAction: (state, action) => {
         state.selectedAction = action.payload;
         state.isMenuOpen = false;
       },
       closeMenu: (state) => {
         state.isMenuOpen = false;
       },
     },
   });

   export const { toggleMenu, setSelectedAction, closeMenu } = menuSlice.actions;
   export default menuSlice.reducer;    