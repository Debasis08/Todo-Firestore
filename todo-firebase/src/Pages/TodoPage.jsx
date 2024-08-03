import { Button, Heading, Box, Center, ChakraProvider, useColorMode } from '@chakra-ui/react'
import theme from '../theme/theme';
import TodoForm from '../components/Todo/TodoForm';
import TodoList from '../components/Todo/TodoList';
import { auth } from '../config';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';


function TodoPage() {

  const navigate = useNavigate()
  const { toggleColorMode } = useColorMode()
  const [editTask, setEditTask] = useState(null);


  const handleLogout = () => {
    auth.signOut();
    navigate("/")
  };

  const handleEditTask = (task) => {
    setEditTask(task);
  };

  return (
    <ChakraProvider theme={theme}>
    
      <Center>
      <Heading
      userSelect="none"
      marginBottom="3rem"
      padding="1rem 2.5rem"
      fontSize="2rem"
      borderRadius="0.7rem"
      letterSpacing="0.2rem"
      backgroundColor="#cc99cc"
      width="fit-content"
      textAlign="center"
      mt={20}>Vipani Delat</Heading>
      </Center>

      <Center>
      <Button 
      position="absolute"
      top="-3"
      left="5"
      size="lg"
      width="20vw"
      color="red"
      marginTop="2rem"
      backgroundColor="#e6cce6"
      borderColor="gray.300"
      _hover={{ border: "2px" ,borderColor: 'red', color: 'white', backgroundColor: 'red' }}
      mb={20}
      onClick={handleLogout}>Logout</Button>
      </Center>
      
      <Center>
      <Button
      position="absolute"
      top="5"
      right="5"
      color="red"
      backgroundColor="gray.300"
      marginBottom="5rem"
      size='sm' onClick={toggleColorMode}>
        Toggle Theme
      </Button>
      
      </Center>
      
      <Box>
        <TodoForm task={editTask} onClose={() => setEditTask(null)} />
      </Box>
      <Box>
        <TodoList onEditTask={handleEditTask} />
      </Box>
    {/* </VStack> */}
  </ChakraProvider>
  )
}

export default TodoPage
