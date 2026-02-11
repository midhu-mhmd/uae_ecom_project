// import { useEffect } from 'react';
import { BrowserRouter } from 'react-router-dom';
// import { useAppDispatch, useAppSelector } from './app/hooks';
// import { setAuth, finishInitializing } from './features/auth/authSlice';
// import api from './services/api';
import { AppRoutes } from './routes/AppRoutes';

function App() {
  // const dispatch = useAppDispatch();
  // const { isInitializing } = useAppSelector((state) => state.auth);

  // useEffect(() => {
  //   const initAuth = async () => {
  //     try {
  //       // Automatically sends session cookies via withCredentials: true
  //       const response = await api.get('/auth/me'); 
  //       dispatch(setAuth(response.data));
  //     } catch (err) {
  //       // No session found or error, stop the loading state
  //       dispatch(finishInitializing());
  //     }
  //   };
  //   initAuth();
  // }, [dispatch]);

  // if (isInitializing) {
  //   return (
  //     <div className="flex items-center justify-center h-screen">
  //       <p>Loading Store...</p>
  //     </div>
  //   );
  // }

  return (
    <BrowserRouter>
      <AppRoutes />
    </BrowserRouter>
  );
}

export default App;