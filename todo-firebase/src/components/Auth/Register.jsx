import React, {useState} from 'react';
import { useForm } from 'react-hook-form';
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { auth, db } from '../../config';
import { useDispatch } from 'react-redux';
import { setUser } from '../../store/authSlice';
import { Button, Center, Input, Text, VStack } from '@chakra-ui/react';
import { doc, setDoc } from 'firebase/firestore';

const Register = () => {
  const { register, handleSubmit, reset } = useForm();
  const dispatch = useDispatch();
  const [errorMsg, setErrorMsg] = useState('');

  const onSubmit = async (data) => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, data.email, data.password);
      await updateProfile(userCredential.user, { displayName: data.fullName });
      
      // Store user's full name in Firestore
      await setDoc(doc(db, 'users', userCredential.user.uid), {
        fullName: data.fullName,
      });

      dispatch(setUser(userCredential.user));
      reset();
    } catch (error) {
      if (error.code === 'auth/email-already-in-use') {
        setErrorMsg('This email is already registered. Please use a different email or try logging in.');
      } else {
        setErrorMsg('An error occurred during registration. Please try again.');
      }
      console.error('Error registering:', error);
    }
  };

  return (
    <VStack spacing={4}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Input
        size="lg"
        color="black"
        borderColor="gray.300"
        _hover={{ borderColor: 'gray.800', outline: 'none' }}
        _focus={{ borderColor: 'gray.800', boxShadow: 'inset 0 0 0 1px violet', outline: 'none' }}
        mb={4}
         {...register('fullName')} placeholder="Full Name" />
        
        <Input 
        size="lg"
        color="black"
        borderColor="gray.300"
        _hover={{ borderColor: 'gray.800', outline: 'none' }}
        _focus={{ borderColor: 'gray.800', boxShadow: 'inset 0 0 0 1px violet', outline: 'none' }}
        mb={4}
        {...register('email')} type="email" placeholder="Email" />
        
        <Input 
        size="lg"
        color="black"
        borderColor="gray.300"
        _hover={{ borderColor: 'gray.800', outline: 'none' }}
        _focus={{ borderColor: 'gray.800', boxShadow: 'inset 0 0 0 1px violet', outline: 'none' }}
        mb={4}
        {...register('password')} type="password" placeholder="Password" />
        
        <br/>

        <Center>
        {errorMsg && (
          <Text padding={1} borderRadius="0.5rem" backgroundColor="gray.100" color="red.500" fontSize="md" fontWeight="650">
            {errorMsg}
          </Text>
        )}
        </Center>
        <br/>

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
            }}>Register</Button>
        </Center>
      
      </form>
    </VStack>
  );
};

export default Register;