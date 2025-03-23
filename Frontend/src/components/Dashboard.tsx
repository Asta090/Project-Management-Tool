import React from "react";
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import "./Dashboard.css";

interface Task {
  id: number;
  title: string;
  completed: boolean;
}

interface DashboardProps {
  incomplete: Task[];
  completed: Task[];
  inReview: Task[];
  backlog: Task[];
}

const Dashboard: React.FC<DashboardProps> = ({
  incomplete,
  completed,
  inReview,
  backlog,
}) => {
  const totalTasks =
    incomplete.length + completed.length + inReview.length + backlog.length;
  const tasksCompleted = completed.length;
  const tasksInProgress = incomplete.length + inReview.length;
  const tasksInBacklog = backlog.length;

  const taskDistributionData = [
    { name: "TO DO", value: incomplete.length },
    { name: "DONE", value: completed.length },
    { name: "IN REVIEW", value: inReview.length },
    { name: "BACKLOG", value: backlog.length },
  ];

  const taskProgressData = [
    { name: "Completed", tasks: tasksCompleted },
    { name: "In Progress", tasks: tasksInProgress },
    { name: "Backlog", tasks: tasksInBacklog },
  ];

  const COLORS = ["#007bff", "#28a745", "#ffc107", "#dc3545"];

  return (
    <div className="dashboard-container">
      
      <video autoPlay loop muted className="background-videos">
        <source src="/background2.mp4" type="video/mp4" />
        Your browser does not support the video tag.
      </video>

      <div className="page-content">
        
        <div className="overview-section">
          <div className="overview-card">
            <h2>Total Tasks</h2>
            <p>{totalTasks}</p>
          </div>
          <div className="overview-card">
            <h2>Tasks Completed</h2>
            <p>{tasksCompleted}</p>
          </div>
          <div className="overview-card">
            <h2>Tasks In Progress</h2>
            <p>{tasksInProgress}</p>
          </div>
          <div className="overview-card">
            <h2>Tasks in Backlog</h2>
            <p>{tasksInBacklog}</p>
          </div>
        </div>

        
        <div className="charts-section">
          
          <div className="chart-container">
            <h2>Task Distribution</h2>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={taskDistributionData}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  label
                >
                  {taskDistributionData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>

          
          <div className="chart-container">
            <h2>Task Progress</h2>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={taskProgressData}>
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="tasks" fill="#007bff" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
