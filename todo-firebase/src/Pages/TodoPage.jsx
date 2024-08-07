//TodoPage.jsx

import { Button, Heading, Box, Center, ChakraProvider, useColorMode } from '@chakra-ui/react'
import theme from '../theme/theme';
import TodoForm from '../components/Todo/TodoForm';
import TodoList from '../components/Todo/TodoList';
import { auth } from '../config';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import TasksChart from '../components/Todo/TasksChart';
import { Modal, ModalOverlay, ModalContent, ModalCloseButton, ModalHeader, ModalBody, useDisclosure, } from '@chakra-ui/react';


function TodoPage() {
  const { isOpen, onOpen, onClose } = useDisclosure();

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

      <Button
          position="absolute"
          top="425"
          right="5"
          width="fit-content"
          height="fit-content"
          padding="0.3rem 0.75rem"
          color="#d675d6"
          backgroundColor="#fdf3fd"
          border="3px solid"
          borderColor="#d675d6"
          fontSize="1rem"
          marginY="1rem"
          _hover={{ backgroundColor: '#d675d6', color: '#fdf3fd' }}
          onClick={onOpen}>
          Tasks Chart
        </Button>


      <Modal isOpen={isOpen} onClose={onClose} size="5xl">
        <ModalOverlay />
        <ModalContent>

          <ModalHeader>Tasks by Users</ModalHeader>
          <ModalCloseButton backgroundColor="red" />

          <ModalBody>
          <Box>
        <TasksChart />
          </Box>
          </ModalBody>

        </ModalContent>
      </Modal>

      
      <Box>
        <TodoForm task={editTask} onClose={() => setEditTask(null)} />
      </Box>
      <Box>
        <TodoList onEditTask={handleEditTask} />
      </Box>
  </ChakraProvider>
  )
}

export default TodoPage
