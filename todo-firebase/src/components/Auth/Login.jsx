import React from 'react';
import { useForm } from 'react-hook-form';
import { signInWithEmailAndPassword, signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import { auth } from '../../config';
import { useDispatch } from 'react-redux';
import { setUser } from '../../store/authSlice';
import { Button, Center, Input, VStack } from '@chakra-ui/react';
import '../../index.css';

const Login = () => {
  const { register, handleSubmit, reset } = useForm();
  const dispatch = useDispatch();

  const onSubmit = async (data) => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, data.email, data.password);
      dispatch(setUser(userCredential.user));
      reset();
    } catch (error) {
      console.error('Error logging in:', error);
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      dispatch(setUser(result.user));
    } catch (error) {
      console.error('Error signing in with Google:', error);
    }
  };

  return (
    <VStack 
    spacing={50}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Input {...register('email')} type="email" placeholder="Email" 
        size="lg"
        color="black"
        borderColor="gray.300"
        _hover={{ borderColor: 'gray.800', outline: 'none' }}
        _focus={{ borderColor: 'gray.800', boxShadow: 'inset 0 0 0 1px violet', outline: 'none' }}
        mb={4}
        />
        
        <Input {...register('password')} type="password" placeholder="Password" 
        mb={4}
        size="lg"
        color="black"
        borderColor="gray.300"
        _hover={{ borderColor: 'gray.800', outline: 'none' }}
        _focus={{ borderColor: 'gray.800', boxShadow: '0 0 0 1px violet', outline: 'none' }}
        />

        <Center>
          <Button
            type="submit"
            sx={{
              backgroundColor: '#e6cce6', // Violet color
              color: 'black',
              fontSize: '1.3rem',
              transition: 'background-color 0.3s ease, box-shadow 0.3s ease',
              '&:hover': {
                color: 'white',
                backgroundColor: '#800080', // Darker violet for hover
                outline: 'none', // Remove default outline
              },
              '&:focus': {
                boxShadow: '0 0 0 1px #993399', // Light violet for focus
                outline: 'none', // Remove default outline
              },
            }}>
            Login
          </Button>
        </Center>
        

      </form>
      <Button
      onClick={handleGoogleSignIn}
      sx={{
              backgroundColor: '#EA4335', // Violet color
              color: 'white',
              border: 'none',
              transition: 'background-color 0.3s ease, box-shadow 0.3s ease',
              '&:hover': {
              color: '#EA4335',
                backgroundColor: 'white', // Darker violet for hover
                outline: 'none', // Remove default outline
              },
              '&:focus': {
                boxShadow: '0 0 0 1px #993399', // Light violet for focus
                outline: 'none' // Remove default outline
              }}}>

              Sign in with Google</Button>
    </VStack>
  );
};

export default Login;