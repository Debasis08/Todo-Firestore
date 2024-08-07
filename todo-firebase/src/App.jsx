import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { auth, generateToken, messaging } from './config';
import { onAuthStateChanged } from 'firebase/auth';
import { setUser, clearUser } from './store/authSlice';
import { onMessage } from "firebase/messaging";
import AuthPage from './Pages/AuthPage';
import { useNavigate } from 'react-router-dom';


function App() {
  const dispatch = useDispatch();
  const navigate = useNavigate()
  const user = useSelector((state) => state.auth.user);

  useEffect (() => {
    generateToken();
    onMessage(messaging, (payload) => {
      console.log('Message received. ', payload);
    })
  }, []);
 

  useEffect(() => {
    // requestPermission();
    
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        dispatch(setUser(user));
        navigate("/vipani-Delat")
      } else {
        dispatch(clearUser());
        navigate("/")
      }
      // console.log("Current user in App:", user);
    });

    return () => unsubscribe();

  }, [dispatch]);


  if (!user) {
    return (
      
      <AuthPage />
      
    );
  } else navigate("/vipani-Delat");

}

export default App