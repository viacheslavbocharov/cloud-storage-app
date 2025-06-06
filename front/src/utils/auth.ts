import axios from 'axios';

export const authGetMe = async () => {
  try {
    const res = await axios.get('http://localhost:3000/api/users/me', {
      withCredentials: true,
      headers: {
        Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
      },
    });

    if (!res?.data?.email) throw new Error('Unauthorized');
    return res.data;
  } catch (err) {
    console.error('[authGetMe] ❌ Error while getting user profile:', err);
    throw err;
  }
};
