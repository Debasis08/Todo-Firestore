import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { auth, generateToken, messaging } from './config';
import { onAuthStateChanged } from 'firebase/auth';
import { setUser, clearUser } from './store/authSlice';
import { onMessage } from "firebase/messaging";
import TodoPage from './Pages/TodoPage';
import AuthPage from './Pages/AuthPage';
import { Center, Heading } from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';
// import { Center, ChakraProvider } from '@chakra-ui/react';
// import Login from './components/Auth/Login';
// import Register from './components/Auth/Register';
// import { Button, VStack, Heading } from '@chakra-ui/react';
// import { Auth } from 'firebase-admin/auth';
// import TodoForm from './components/Todo/TodoForm';
// import TodoList from './components/Todo/TodoList';
// import theme from './theme/theme';


function App() {
  const dispatch = useDispatch();
  const navigate = useNavigate()
  const user = useSelector((state) => state.auth.user);
  // const [showLogin, setShowLogin] = useState(true);
  // const [editTask, setEditTask] = useState(null);
  // const { colorMode, toggleColorMode } = useColorMode()


  // const { toggleColorMode } = useColorMode()

  // const bg = useColorModeValue('red.500', 'red.200')
  // const color = useColorModeValue('white', 'gray.800')


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

  // const handleLogout = () => {
  //   auth.signOut();
  // };

  // const handleEditTask = (task) => {
  //   setEditTask(task);
  // };

  if (!user) {
    return (
      
      <AuthPage />
      
      
      // <ChakraProvider>
      // <Center height="100vh">
      //   <VStack 
      //   spacing={4}
      //   align="center"
      //   justify="center"
      //   height="55vh"
      //   p={38}
      //   borderRadius="2rem"
      //   bgGradient="linear(to-tr, #b366b3 70%, #993399 20%)">
      //     <Heading>{showLogin ? 'Login' : 'Register'}</Heading>
      //       {showLogin ? <Login /> : <Register />}
      //     <Button onClick={() => setShowLogin(!showLogin)}>
      //       {showLogin ? 'Need to register?' : 'Already have an account?'}
      //     </Button>
      //   </VStack>
      //   </Center>
      // </ChakraProvider>
    );
  }

  // return (
  //   <>
      
  //     <Center>
  //     <Heading
  //     padding="1rem 2.5rem"
  //     fontSize="2rem"
  //     borderRadius="0.7rem"
  //     letterSpacing="0.2rem"
  //     backgroundColor="#cc99cc"
  //     width="fit-content"
  //     textAlign="center"
  //     mt={20}>Vipani Delat</Heading>
  //     </Center>

  //     <TodoPage />

  //   </>

  //   /*
  //     <ChakraProvider theme={theme}>
  //     <Center>
  //     <Button
  //     color="red"
  //     backgroundColor="gray.300"
  //     marginY="2.5rem"
  //     size='sm' onClick={toggleColorMode}>
  //       Toggle Theme
  //     </Button>
  //     </Center>
        
  //       <Center>
  //       <Heading>Todo App</Heading>
  //       </Center>

  //       <br/>

  //       <Center>
  //       <Button 
  //       size="lg"
  //       width="50vw"
  //       color="red"
  //       backgroundColor="#e6cce6"
  //       borderColor="gray.300"
  //       _hover={{ border: "2px" ,borderColor: 'red'}}
  //       mb={20}
  //       onClick={handleLogout}>Logout</Button>
  //       </Center>
  //       <Box>
  //         <TodoForm task={editTask} onClose={() => setEditTask(null)} />
  //       </Box>
  //       <Box>
  //         <TodoList onEditTask={handleEditTask} />
  //       </Box>
  //     </ChakraProvider>
  //   */
  // );
}

export default App
