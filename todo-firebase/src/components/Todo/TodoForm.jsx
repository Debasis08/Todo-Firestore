import React from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { Button, Input, VStack, HStack, Box } from '@chakra-ui/react';
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
      <VStack spacing={4}>
        <Input {...register('taskName')} 
        border="3px solid"
        fontSize="1.3rem"
        letterSpacing="1px"
        borderColor="#d675d6"
        _focus={{ borderColor: 'transparent' }}
        placeholder="Task Name" />

        <Input {...register('subTitle')} 
        border="3px solid"
        borderColor="#d675d6"
        fontSize="1.3rem"
        letterSpacing="1px"
        _focus={{ borderColor: 'transparent' }}
        placeholder="Subtitle" />
        {/* <Input {...register('customField.numberValue')} type="number" placeholder="Numeric Digit" /> */}
        
        {fields.map((field, index) => (
          <HStack key={field.id}>
            <Input {...register(`subtasks.${index}.name`)}
            border="3px solid"
            borderColor="#d675d6"
            fontSize="1.3rem"
            letterSpacing="1px"
            placeholder="Subtask" />
            <Button onClick={() => remove(index)}>Remove</Button>
          </HStack>
        ))}
        
        <Button
        color="#d675d6"
        backgroundColor="#fdf3fd"
        border="3px solid"
        borderColor="#d675d6"
        fontSize="1.2rem"
        marginY="1rem"
        _hover={{ backgroundColor: '#d675d6', color: '#fdf3fd' }}
        onClick={() => append({ name: '' })}>Add Subtask</Button>
        
        <Button
        width="10rem"
        height="4rem"
        fontSize="1.3rem"
        color="#d675d6"
        backgroundColor="#fdf3fd"
        border="3px solid"
        borderColor="#d675d6"
        marginBottom="5rem"
        _hover={{ backgroundColor: '#d675d6', color: '#fdf3fd' }}
        type="submit">{task ? 'Update' : 'Add'} Task</Button>
      </VStack>
    </form>
  );
};

export default TodoForm;