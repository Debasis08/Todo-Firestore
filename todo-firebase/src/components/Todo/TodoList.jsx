//TodoList.jsx

import { useEffect, useMemo, useCallback, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { setTasks, updateTask, deleteTask } from '../../store/todoSlice';
import { db } from '../../config';
import { collection, query, where, onSnapshot, updateDoc, deleteDoc, doc, getDocs } from 'firebase/firestore';
import { Checkbox, Button, VStack, HStack, Text, Box, Grid, Select, Switch, FormControl, FormLabel, Table, Thead, Tbody, Tr, Th, Td } from '@chakra-ui/react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { useReactTable, getCoreRowModel, flexRender } from '@tanstack/react-table';

const StrictModeDroppable = ({ children, ...props }) => {
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
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
  const [viewMode, setViewMode] = useState('card');
  const dispatch = useDispatch();
  const tasks = useSelector((state) => state.tasks?.tasks || []);
  const user = useSelector((state) => state.auth.user);
  const [filter, setFilter] = useState('all');
  const [showMyTasks, setShowMyTasks] = useState(true);
  const [sortOrder, setSortOrder] = useState('All');
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
    if (user && user.uid) {
      const q = showMyTasks
        ? query(collection(db, 'tasks'), where('userId', '==', user.uid))
        : query(collection(db, 'tasks'));

      const unsubscribe = onSnapshot(q, (querySnapshot) => {
        const tasksData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        dispatch(setTasks(tasksData));
        setTotalTasks(tasksData.length);
      }, (error) => {
        console.error("Error fetching tasks:", error);
      });

      return () => unsubscribe();
    } else {
      dispatch(setTasks([]));
      setTotalTasks(0);
    }
  }, [dispatch, user, showMyTasks]);

  // console.log("Rendering tasks:", tasks);

  useEffect(() => {
    const fetchAllTasks = async () => {
      const q = query(collection(db, 'tasks'));
      const querySnapshot = await getDocs(q);
      setAllUsersTasks(querySnapshot.size);
    };
    fetchAllTasks();
  }, []);

  const handleStatusChange = useCallback(async (taskId, newTask) => {
    try {
      await updateDoc(doc(db, 'tasks', taskId), {
        status: newTask,
        updatedAt: new Date(),
      });
      dispatch(updateTask({ id: taskId, status: newTask }));
    } catch (error) {
      console.error('Error saving task:', error);
    }
  }, [dispatch]);

  const handleDeleteTask = useCallback(async (taskId) => {
    try {
      await deleteDoc(doc(db, 'tasks', taskId));
      dispatch(deleteTask(taskId));
    } catch (error) {
      console.error('Error deleting task:', error);
    }
  }, [dispatch]);

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

  const filteredTasks = useMemo(() => {
    return tasks
      .filter(task => {
        if (filter === 'all') return true;
        if (filter === 'done') return task.status;
        if (filter === 'notDone') return !task.status;
        return false;
      })
      .sort((a, b) => {
        if (sortOrder === 'asc') {
          return a.createdAt?.toDate() - b.createdAt?.toDate();
        } else if (sortOrder === 'desc') {
          return b.createdAt?.toDate() - a.createdAt?.toDate();
        } else {
          return 0;
        }
      });
  }, [tasks, filter, sortOrder]);


    const columns = useMemo(
      () => [
        {
          accessorKey: 'status',
          header: 'Status',
          cell: ({ row }) => (
            <Checkbox
              isChecked={row.original.status}
              onChange={(e) => handleStatusChange(row.original.id, e.target.checked)}
              colorScheme="purple"
            />
          ),
        },
        {
          accessorKey: 'taskName',
          header: 'Task',
        },
        {
          accessorKey: 'subTitle',
          header: 'Subtitle',
        },
        {
          accessorKey: 'subtasks',
          header: 'Subtasks',
          cell: ({ row }) => (
            <VStack align="start">
              {row.original.subtasks && row.original.subtasks.map((subtask, idx) => (
                <Text key={idx}>{subtask.name}</Text>
              ))}
            </VStack>
          ),
        },
        {
          accessorKey: 'userName',
          header: 'Username',
        },
        {
          id: 'actions',
          header: 'Actions',
          cell: ({ row }) => (
            <HStack>
              <Button size="sm" colorScheme="purple" onClick={() => onEditTask(row.original)}>Edit</Button>
              <Button size="sm" colorScheme="red" onClick={() => handleDeleteTask(row.original.id)}>Delete</Button>
            </HStack>
          ),
        },
      ],
      []
    );
  
    const table = useReactTable({
      data: filteredTasks,
      columns,
      getCoreRowModel: getCoreRowModel(),
    });

    
  return (
    <>
      {!isOnline ? 
      (
        <Box bg="red.500" color="white" p={2} mb={4} textAlign="center">
          You are currently offline. Changes will be synced when you&apos;re back online.
        </Box>
      ) : (
        <Box bg="green.500" color="white" p={2} mb={4} textAlign="center">
          Online
        </Box>
      )}

      <HStack paddingX="1rem" spacing={4} mb={4}>
      
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
          <option value="all">Sort By Random</option>
          <option value="asc">Ascending</option>
          <option value="desc">Descending</option>
        </Select>

        <FormControl display="flex" alignItems="center">
          <Switch
            id="show-my-tasks"
            marginX="1rem"
            isChecked={showMyTasks}
            onChange={(e) => setShowMyTasks(e.target.checked)}
          />
          <FormLabel
            border= "3px solid purple"
            padding="0.25rem"
            borderRadius="md"
            htmlFor="show-my-tasks" mb="0">
            {showMyTasks ? "My Tasks" : "All Users' Tasks" }
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

        <Switch
          position="absolute"
          right="10rem"
          id="view-mode"
          isChecked={viewMode === 'table'}
          onChange={(e) => setViewMode(e.target.checked ? 'table' : 'card')}
        />

        <FormLabel
          position="absolute"
          border= "3px solid purple"
          padding="0.25rem"
          borderRadius="md"
          right="13rem" htmlFor="view-mode" mb="0">
          {viewMode === 'card' ? "Card View" : "Table View"}
        </FormLabel>

      </HStack>


      <Box paddingX="1rem">
        {viewMode === 'card' ? (
        <DragDropContext onDragEnd={onDragEnd}>
          <StrictModeDroppable droppableId="taskList">
            {(provided) => (
              <Grid
                {...provided.droppableProps}
                ref={provided.innerRef}
                templateColumns="repeat(auto-fill, minmax(250px, 1fr))"
                gap={4}
                width="100%">

                { filteredTasks.map((task, index) => (
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
                        
                        {task.userId === user.uid && (
                        <>
                        <Checkbox
                          isChecked={task.status}
                          onChange={(e) => handleStatusChange(task.id, e.target.checked)}
                          colorScheme="purple">
                          Done
                        </Checkbox>

                        <Button size="md" colorScheme="purple" variant="outline" onClick={() => onEditTask(task)}>Edit</Button>
                        <Button size="md" colorScheme="red" variant="outline" onClick={() => handleDeleteTask(task.id)}>Delete</Button>
                        </>
                        )}
                      </HStack>
                      </Box>
                    )}
                  </Draggable>
                )) }
                  
                {provided.placeholder}
              </Grid>
            )}
          </StrictModeDroppable>
        </DragDropContext>

        ) : (

          <Table>
            <Thead>
              {table.getHeaderGroups().map((headerGroup) => (
                <Tr key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <Th key={header.id}>
                      {flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}
                    </Th>
                  ))}
                </Tr>
              ))}
            </Thead>
            <Tbody>
              {table.getRowModel().rows.map((row) => (
                <Tr key={row.id}>
                  {row.getVisibleCells().map((cell) => (
                    <Td key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </Td>
                  ))}
                </Tr>
              ))}
            </Tbody>
          </Table>
        )}
      </Box>
    </>
  );
};

export default TodoList;