//TodoList.jsx

import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { setTasks, updateTask, deleteTask } from '../../store/todoSlice';
import { db } from '../../config';
import { collection, query, where, onSnapshot, updateDoc, deleteDoc, doc, getDocs } from 'firebase/firestore';
import { Checkbox, Button, VStack, HStack, Text, Box, Grid, Select, Switch, FormControl, FormLabel } from '@chakra-ui/react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';


const StrictModeDroppable = ({ children, ...props }) => {
  const [enabled, setEnabled] = React.useState(false);

  React.useEffect(() => {
    const animation = requestAnimationFrame(() => setEnabled(true));
    return () => {
      cancelAnimationFrame(animation);
      setEnabled(false);
    };
  }, []);

  if (!enabled) {
    return null;
  }

  return <Droppable {...props}>{children}</Droppable>;
};

const TodoList = ({ onEditTask }) => {
  const dispatch = useDispatch();
  const tasks = useSelector((state) => state.tasks?.tasks || []);
  const user = useSelector((state) => state.auth.user);
  const [filter, setFilter] = useState('all');
  const [showMyTasks, setShowMyTasks] = useState(true);
  const [sortOrder, setSortOrder] = useState('asc');
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [totalTasks, setTotalTasks] = useState(0);
  const [allUsersTasks, setAllUsersTasks] = useState(0);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  useEffect(() => {
    // console.log("TodoList useEffect triggered");
    console.log("Current user:", user);

    if (user && user.uid) {
      console.log("Fetching tasks for user:", user.uid);
      const q = query(collection(db, 'tasks'), where('userId', '==', user.uid));
      const unsubscribe = onSnapshot(q, (querySnapshot) => {
        // console.log("Snapshot received");
        const tasksData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        console.log("Fetched tasks:", tasksData);
        dispatch(setTasks(tasksData));
        setTotalTasks(tasksData.length);
      }, (error) => {
        console.error("Error fetching tasks:", error);
      });
  
      return () => unsubscribe();
    } else {
      console.log("No user authenticated");
      dispatch(setTasks([]));
      setTotalTasks(0);
    }
  }, [dispatch, user]);

  // console.log("Rendering tasks:", tasks);

  const fetchAllTasks = async () => {
    const q = query(collection(db, 'tasks'));
    const querySnapshot = await getDocs(q);
    return querySnapshot.size;
  };

  useEffect(() => {
    const getAllTasks = async () => {
      const count = await fetchAllTasks();
      setAllUsersTasks(count);
    };
    getAllTasks();
  }, []);

  const handleStatusChange = async (taskId, newStatus) => {
    try {
      await updateDoc(doc(db, 'tasks', taskId), { status: newStatus });
      dispatch(updateTask({ id: taskId, status: newStatus }));
    } catch (error) {
      console.error('Error updating task status:', error);
    }
  };

  const handleDeleteTask = async (taskId) => {
    try {
      await deleteDoc(doc(db, 'tasks', taskId));
      dispatch(deleteTask(taskId));
    } catch (error) {
      console.error('Error deleting task:', error);
    }
  };

  const onDragEnd = async(result) => {
    if (!result.destination) return;

    const newTasks = Array.from(tasks);
    const [reorderedItem] = newTasks.splice(result.source.index, 1);
    newTasks.splice(result.destination.index, 0, reorderedItem);

    dispatch(setTasks(newTasks));

    try {
      const batch = db.batch();
      newTasks.forEach((task, index) => {
        const taskRef = doc(db, 'tasks', task.id);
        batch.update(taskRef, { order: index });
      });
      await batch.commit();
    } catch (error) {
      console.error('Error updating task order in Firestore:', error);
    }
  };

  const filteredTasks = tasks
    .filter(task => {
      if (!showMyTasks || task.userId === user.uid) {
        if (filter === 'all') return true;
        if (filter === 'done') return task.status;
        if (filter === 'notDone') return !task.status;
      }
      return false;
    })
    .sort((a, b) => {
      if (sortOrder === 'asc') {
        return a.createdAt?.toDate() - b.createdAt?.toDate();
      } else {
        return b.createdAt?.toDate() - a.createdAt?.toDate();
      }
    });

  return (
    <>
      {!isOnline ? 
      (
        <Box bg="red.500" color="white" p={2} mb={4} textAlign="center">
          You are currently offline. Changes will be synced when you&apos;re back online.
        </Box>
      ) 
       :
      (
        <Box bg="green.500" color="white" p={2} mb={4} textAlign="center">
          Online
        </Box>
      )
      }

      <HStack spacing={4} mb={4}>
        <Select
          value={filter} 
          onChange={(e) => setFilter(e.target.value)}
          width="200px">
          <option value="all">All Tasks</option>
          <option value="done">Done Tasks</option>
          <option value="notDone">Not Done Tasks</option>
        </Select>

        <Select
          value={sortOrder}
          onChange={(e) => setSortOrder(e.target.value)}
          width="200px">
          <option value="asc">Ascending</option>
          <option value="desc">Descending</option>
        </Select>

        <FormControl display="flex" alignItems="center">
          <FormLabel
            border={showMyTasks ? "3px solid purple" : null}
            padding="0.25rem"
            borderRadius="md"
            position="fixed"
            right="41vw"
            htmlFor="show-my-tasks" mb="0">
            {showMyTasks ? "My Tasks" : null}
          </FormLabel>
          <Switch
            position="fixed"
            right="47.5vw"
            id="show-my-tasks"
            marginX="1rem"
            isChecked={showMyTasks}
            onChange={(e) => setShowMyTasks(e.target.checked)}
          />
          <FormLabel
            border={!showMyTasks ? "3px solid purple" : null}
            padding="0.25rem"
            borderRadius="md"
            position="fixed"
            right="51vw"
            htmlFor="show-my-tasks" mb="0">
            {!showMyTasks ? "All Users' Tasks" : null }
          </FormLabel>
        </FormControl>


        <Box
          position="absolute"
          right="1rem"
          width="8rem"
          borderWidth={1}
          backgroundColor={showMyTasks ? "purple.800" : "purple.200"}
          borderRadius="md"
          p={2}
          color={showMyTasks ? "white" : "purple.800"}
          fontWeight="bold"
        >
          Tasks: {showMyTasks ? totalTasks : allUsersTasks}
        </Box>
      </HStack>

      <DragDropContext onDragEnd={onDragEnd}>
        <StrictModeDroppable droppableId="taskList">
          {(provided) => (
            <Grid
              {...provided.droppableProps}
              ref={provided.innerRef}
              templateColumns="repeat(auto-fill, minmax(250px, 1fr))"
              gap={4}
              width="100%"
            >
              {filteredTasks.map((task, index) => (
                <Draggable key={task.id} draggableId={task.id} index={index}>
                  {(provided, snapshot) => (
                    <Box
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                      width="100%"
                      height="100%"
                      bg="rgba(128, 0, 128, 0.5)"
                      backdropFilter="blur(10px)"
                      borderRadius="lg"
                      boxShadow="0 4px 6px rgba(0, 0, 0, 0.1)"
                      p={4}
                      transition="all 0.2s"
                      _hover={{ transform: "translateY(-2px)", boxShadow: "0 6px 8px rgba(0, 0, 0, 0.15)" }}
                      transform={snapshot.isDragging ? "rotate(3deg)" : ""}
                      minHeight="250px"
                      display="flex"
                      flexDirection="column"
                      position="relative"
                    >

                    <Text fontSize="md" color="white" position="absolute" top={2} left={5}>
                      {task.userName && task.userName ? task.userName.toLocaleString() : 'Unknown'}
                    </Text>

                    <Text fontSize="sm" color="white" position="absolute" top={2} right={2}>
                      {task.createdAt && task.createdAt.toDate ? task.createdAt.toDate().toLocaleString() : 'Unknown'}
                    </Text>
                    <VStack align="stretch" spacing={2} mt={6}>
                      <Text fontWeight="bold" fontSize="1.6rem">{task.taskName}</Text>
                      <Text fontSize="lg" marginBottom="1rem" fontWeight="semibold" fontStyle= "italic" color="white">{task.subTitle}</Text>
                      <Box>
                        <Text
                        fontSize="lg"
                        fontWeight="bold"
                        mb={1}>Subtasks:</Text>
                        <VStack
                        fontSize="md"
                        align="stretch" pl={2}>
                          {task.subtasks && task.subtasks.map((subtask, idx) => (
                            <Text key={idx}
                            fontSize="lg"
                            >{subtask.name}</Text>
                          ))}
                        </VStack>
                      </Box>
                    </VStack>
                    <HStack justify="space-between" mt="auto" pt={2}>
                      <Checkbox
                        isChecked={task.status}
                        onChange={(e) => handleStatusChange(task.id, e.target.checked)}
                        colorScheme="purple"
                      >
                        Done
                      </Checkbox>
                      <Button size="md" colorScheme="purple" variant="outline" onClick={() => onEditTask(task)}>Edit</Button>
                      <Button size="md" colorScheme="red" variant="outline" onClick={() => handleDeleteTask(task.id)}>Delete</Button>
                    </HStack>
                    </Box>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </Grid>
          )}
        </StrictModeDroppable>
      </DragDropContext>
    </>
  );
};

export default TodoList;