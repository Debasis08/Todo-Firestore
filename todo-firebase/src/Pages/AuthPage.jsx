import { Button, Center, ChakraProvider, Heading, VStack } from '@chakra-ui/react'
import { useState } from 'react'
import Login from '../components/Auth/Login'
import Register from '../components/Auth/Register'

function AuthPage() {

  const [showLogin, setShowLogin] = useState(true);


  return (
    <ChakraProvider>

      <Center>
      <Heading
      padding="1rem 2.5rem"
      fontSize="2rem"
      borderRadius="0.7rem"
      letterSpacing="0.2rem"
      backgroundColor="#cc99cc"
      width="fit-content"
      textAlign="center"
      mt={20}>Vipani Delat</Heading>
      </Center>

      <Center height="75vh">
        <VStack 
        spacing={4}
        align="center"
        justify="center"
        height="55vh"
        p={38}
        borderRadius="2rem"
        bgGradient="linear(to-tr, #b366b3 70%, #993399 20%)">
          <Heading>{showLogin ? 'Login' : 'Register'}</Heading>
            {showLogin ? <Login /> : <Register />}
          <Button onClick={() => setShowLogin(!showLogin)}>
            {showLogin ? 'Need to register?' : 'Already have an account?'}
          </Button>
        </VStack>
        </Center>
      </ChakraProvider>
  )
}

export default AuthPage
