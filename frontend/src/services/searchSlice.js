// features/search/searchSlice.js
import { createSlice } from '@reduxjs/toolkit';

export const searchSlice = createSlice({
    name: 'search',
    initialState: {
        searchResults: [],
    },
    reducers: {
        setSearchResults: (state, action) => {
            state.searchResults = action.payload;
        },
    },
});

// Export actions
export const { setSearchResults } = searchSlice.actions;

// Export reducer
export default searchSlice.reducer;
