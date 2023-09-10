import { createSlice } from '@reduxjs/toolkit';
import axios from '../../utils/axios';

const initialState = {
  isLoading: false,
  error: false,
  userList: []
};

const slice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    startLoading(state) {
      state.isLoading = true;
    },

    hasError(state, action) {
      state.isLoading = false;
      state.error = action.payload;
    },

    getUserListSuccess(state, action) {
      state.isLoading = false;
      state.userList = action.payload;
    }
  }
});

export default slice.reducer;

export function getUserList() {
  return async (dispatch) => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await axios.get('/api/account/list');

      response.data.sort(
        (o1, o2) =>
          o1.school === o2.school &&
          parseInt(`${o1.grade}${o1.clazz.toString().padStart(2, '0')}${o1.stdId.toString().padStart(2, '0')}}`, 10) -
            parseInt(`${o2.grade}${o2.clazz.toString().padStart(2, '0')}${o2.stdId.toString().padStart(2, '0')}}`, 10)
      );

      dispatch(slice.actions.getUserListSuccess(response.data));
    } catch (error) {
      dispatch(slice.actions.hasError(error));
    }
  };
}
