import axios from 'axios';
import { setUserData } from '@/store/fileManagerSlice';
import { AppDispatch } from '@/store';

export const authGetMe = async (dispatch: AppDispatch) => {
  try {
    const res = await axios.get('http://localhost:3000/api/user/me', {
      withCredentials: true,
      headers: {
        Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
      },
    });

    const { id, email, firstName, lastName } = res.data;

    if (!email) throw new Error('Unauthorized');

    // 👇 сохраняем в Redux
    dispatch(setUserData({ id, email, firstName, lastName }));

    return res.data;
  } catch (err) {
    console.error('[authGetMe] ❌ Error while getting user profile:', err);
    throw err;
  }
};

