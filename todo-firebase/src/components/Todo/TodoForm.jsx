import React from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { Button, Input, VStack, HStack, Box, Center } from '@chakra-ui/react';
import { useDispatch, useSelector } from 'react-redux';
import { addTask, updateTask } from '../../store/todoSlice';
import { db } from '../../config';
import { collection, addDoc, updateDoc, doc } from 'firebase/firestore';

const TodoForm = ({ task, onClose }) => {
  const { register, control, handleSubmit, reset } = useForm({
    defaultValues: task || {
      taskName: '',
      status: false,
      subtasks: [],
      subTitle: [],
    },
  });
  const { fields, append, remove } = useFieldArray({
    control,
    name: 'subtasks',
  });
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);

  const onSubmit = async (data) => {
    try {

      const taskData = {
        taskName: data.taskName,
        subTitle: data.subTitle,
        status: data.status,
        subtasks: data.subtasks,
      };

      if (task) {
        // Update existing task
        await updateDoc(doc(db, 'tasks', task.id), {
          ...data,
          updatedAt: new Date(),
        });
        dispatch(updateTask({ id: task.id, ...taskData }));
      } else {
        // Add new task
        const newTask = {
          createdAt: new Date(),
          userId: user.uid,
          userName: user.displayName,
          ...taskData,
        };
        const docRef = await addDoc(collection(db, 'tasks'), newTask);
        dispatch(addTask({ id: docRef.id, ...newTask }));
      }
      reset();
      onClose();
    } catch (error) {
      console.error('Error saving task:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Center>
      <VStack
        border="1.7px solid"
        height="fit-content"
        width="fit-content"
        paddingX="2rem"
        paddingTop="3rem"
        borderRadius="0.4rem"
        borderColor="#d675d6"
        marginBottom="5rem"
        spacing={4} >

        <Input {...register('taskName')}
        width="35vw"
        height="2rem"
        border="1.7px solid"
        fontSize="1rem"
        letterSpacing="0.75px"
        borderColor="#d675d6"
        _focus={{ borderColor: 'transparent' }}
        placeholder="Task Name" />

        <Input {...register('subTitle')} 
        width="35vw"
        height="2rem"
        border="1.7px solid"
        borderColor="#d675d6"
        fontSize="0.9rem"
        letterSpacing="0.75px"
        _focus={{ borderColor: 'transparent' }}
        placeholder="Subtitle" />
        {/* <Input {...register('customField.numberValue')} type="number" placeholder="Numeric Digit" /> */}
        
        {fields.map((field, index) => (
          <HStack key={field.id}>
            <Input {...register(`subtasks.${index}.name`)}
            width="20vw"
            height="1.75rem"
            border="3px solid"
            borderColor="#d675d6"
            fontSize="0.75rem"
            letterSpacing="1px"
            placeholder="Subtask" />
            
            <Button
            backgroundColor="#ff8080"
            width="10vw"
            height="1.5rem"
            fontSize="0.8rem"
            _hover={{ backgroundColor: '#ff4d4d' }}
            onClick={() => remove(index)}>Remove</Button>
          </HStack>
        ))}
        
        <Button
        width="fit-content"
        height="fit-content"
        padding="0.3rem 0.75rem"
        color="#d675d6"
        backgroundColor="#fdf3fd"
        border="3px solid"
        borderColor="#d675d6"
        fontSize="0.8rem"
        marginY="1rem"
        _hover={{ backgroundColor: '#d675d6', color: '#fdf3fd' }}
        onClick={() => append({ name: '' })}>Add Subtask</Button>
        
        <Button
        width="35vw"
        maxWidth="20rem"
        top="2.5rem"
        height="fit-content"
        padding="0.7rem 1rem"
        fontSize="1rem"
        color="#d675d6"
        backgroundColor="#fdf3fd"
        border="3px solid"
        borderColor="#d675d6"
        marginBottom="5rem"
        _hover={{ backgroundColor: '#d675d6', color: '#fdf3fd' }}
        type="submit">{task ? 'Update' : 'Add'} Task</Button>
      </VStack>
      </Center>
    </form>
  );
};

export default TodoForm;