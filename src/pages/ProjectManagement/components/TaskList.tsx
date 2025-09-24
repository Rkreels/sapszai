
import React from 'react';
import { Card } from '../../../components/ui/card';
import { Checkbox } from '../../../components/ui/checkbox';
import { Badge } from '../../../components/ui/badge';
import { Button } from '../../../components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../../components/ui/table';
import { CalendarClock, Clock, User, ArrowUpRight } from 'lucide-react';

interface Task {
  id: string;
  name: string;
  dueDate: string;
  assignee: string;
  status: string;
  priority: string;
  completed: boolean;
}

interface TaskListProps {
  tasks: Task[];
  onTaskStatusChange?: (taskId: string, completed: boolean) => void;
}

const TaskList: React.FC<TaskListProps> = ({ tasks, onTaskStatusChange = () => {} }) => {
  return (
    <Card className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">Project Tasks</h2>
        <Button variant="default" size="sm">
          Add New Task
        </Button>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-12">Status</TableHead>
            <TableHead>Task</TableHead>
            <TableHead>Due Date</TableHead>
            <TableHead>Assignee</TableHead>
            <TableHead>Priority</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {tasks.map((task) => (
            <TableRow key={task.id}>
              <TableCell>
                <Checkbox 
                  checked={task.completed} 
                  onCheckedChange={(checked) => onTaskStatusChange(task.id, Boolean(checked))}
                />
              </TableCell>
              <TableCell>
                <div className="font-medium">{task.name}</div>
                <div className="text-sm text-gray-500">
                  <Badge variant={
                    task.status === 'In Progress' ? 'secondary' : 
                    task.status === 'Completed' ? 'default' : 
                    task.status === 'On Hold' ? 'outline' : 
                    'destructive'
                  }>
                    {task.status}
                  </Badge>
                </div>
              </TableCell>
              <TableCell>
                <div className="flex items-center">
                  <CalendarClock className="h-4 w-4 text-gray-400 mr-2" />
                  <span>{task.dueDate}</span>
                </div>
              </TableCell>
              <TableCell>
                <div className="flex items-center">
                  <User className="h-4 w-4 text-gray-400 mr-2" />
                  <span>{task.assignee}</span>
                </div>
              </TableCell>
              <TableCell>
                <Badge variant={
                  task.priority === 'High' ? 'destructive' : 
                  task.priority === 'Medium' ? 'secondary' : 
                  'outline'
                }>
                  {task.priority}
                </Badge>
              </TableCell>
              <TableCell className="text-right">
                <Button variant="ghost" size="sm">
                  <ArrowUpRight className="h-4 w-4" />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Card>
  );
};

export default TaskList;
