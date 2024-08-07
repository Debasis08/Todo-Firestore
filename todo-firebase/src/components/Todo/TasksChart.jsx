// TasksChart.jsx

import { useState, useEffect } from 'react';
import { BarChart } from '@tremor/react';
import { collection, query, getDocs } from 'firebase/firestore';
import { db } from '../../config';

const TasksChart = () => {
  const [chartData, setChartData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const q = query(collection(db, 'tasks'));
      const querySnapshot = await getDocs(q);
      
      const tasksByUser = {};
      querySnapshot.forEach((doc) => {
        const task = doc.data();
        const userName = task.userName || 'Unknown User';
        tasksByUser[userName] = (tasksByUser[userName] || 0) + 1;
      });

      const data = Object.entries(tasksByUser).map(([userName, taskCount]) => ({
        "Name": userName,
        'Number of Tasks': taskCount,
      }));

      setChartData(data);
      console.log(data);
    };

    fetchData();
  }, []);
  console.log('Tasks', chartData);

  
  return (
      <BarChart
        className="h-[50vh] w-[50vw] chartModal rounded-2xl mx-auto my-auto p-[2.5vw] "
        data={chartData}
        index="Name"
        color="fuchsia"
        categories={['Number of Tasks', 'Name']}
        yAxisWidth={50}
        xAxisLabel="User"
        colors={["purple", "#ffcc33"]}
        yAxisLabel="Number of Tasks"
      />

  );
};

export default TasksChart;
