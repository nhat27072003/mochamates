import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { Provider } from 'react-redux';
import { store } from './redux/store';
import { jwtDecode } from 'jwt-decode';
import { refreshToken, restoreSession } from './redux/userSlice';
import { setStore } from './services/axiosClient';

setStore(() => store);
const initializeAuth = async () => {
  const accessToken = localStorage.getItem('accessToken');
  const user = localStorage.getItem('user');

  if (accessToken && user) {
    try {
      const decoded = jwtDecode(accessToken);
      const currentTime = Math.floor(Date.now() / 1000);
      if (decoded.exp > currentTime) {
        store.dispatch(restoreSession({
          token: accessToken,
          user: JSON.parse(user),
        }));
      } else {
        // Token hết hạn, thử refresh
        const result = await store.dispatch(refreshToken());
        if (!refreshToken.fulfilled.match(result)) {
          // Refresh thất bại, xóa dữ liệu
          localStorage.removeItem('accessToken');
          localStorage.removeItem('user');
        }
      }
    } catch (error) {
      // Token không hợp lệ, xóa dữ liệu
      localStorage.removeItem('accessToken');
      localStorage.removeItem('user');
    }
  }
};

initializeAuth().then(() => {
  const root = ReactDOM.createRoot(document.getElementById('root'));
  root.render(
    <React.StrictMode>
      <Provider store={store}>
        <App />
      </Provider>
    </React.StrictMode>
  );
});

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
