import { useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogDescription,
} from '@/components/ui/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Progress } from '@/components/ui/progress';
import { Eye, RotateCcw } from 'lucide-react';

interface UserProgress {
  journeyId: string;
  areaId: string;
  completedLessons: number;
  totalLessons: number;
}

interface User {
  id: string;
  email: string;
  name: string;
  progress: UserProgress[];
  lastActive: string;
}

const UsersPage = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isProgressOpen, setIsProgressOpen] = useState(false);

  // This would come from your API/database
  const journeys = [
    { id: '1', title: 'Basic Conversation' },
    { id: '2', title: 'Business English' },
  ];

  const areas = [
    { id: '1', name: 'Greetings', journeyId: '1' },
    { id: '2', name: 'Business Meeting', journeyId: '2' },
  ];

  const handleViewProgress = (user: User) => {
    setSelectedUser(user);
    setIsProgressOpen(true);
  };

  const handleResetProgress = async (userId: string, journeyId?: string, areaId?: string) => {
    // In a real application, you would call your API here
    setUsers(users.map((user) => {
      if (user.id !== userId) return user;

      return {
        ...user,
        progress: user.progress.map((p) => {
          if (
            (journeyId && p.journeyId !== journeyId) ||
            (areaId && p.areaId !== areaId)
          ) {
            return p;
          }
          return { ...p, completedLessons: 0 };
        }),
      };
    }));
  };

  const getProgressPercentage = (completed: number, total: number) => {
    return Math.round((completed / total) * 100);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Users</h1>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Last Active</TableHead>
            <TableHead>Overall Progress</TableHead>
            <TableHead className="w-[100px]">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {users.map((user) => {
            const totalLessons = user.progress.reduce((acc, p) => acc + p.totalLessons, 0);
            const completedLessons = user.progress.reduce((acc, p) => acc + p.completedLessons, 0);
            const overallProgress = getProgressPercentage(completedLessons, totalLessons);

            return (
              <TableRow key={user.id}>
                <TableCell>{user.name}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>{new Date(user.lastActive).toLocaleDateString()}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Progress value={overallProgress} className="w-[60%]" />
                    <span className="text-sm text-muted-foreground">
                      {overallProgress}%
                    </span>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex space-x-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleViewProgress(user)}
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <RotateCcw className="h-4 w-4" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Reset User Progress</AlertDialogTitle>
                          <AlertDialogDescription>
                            Are you sure you want to reset all progress for this user?
                            This action cannot be undone.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => handleResetProgress(user.id)}
                          >
                            Reset All Progress
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>

      <Dialog open={isProgressOpen} onOpenChange={setIsProgressOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>User Progress - {selectedUser?.name}</DialogTitle>
            <DialogDescription>
              Detailed progress across all journeys and areas
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-6">
            {journeys.map((journey) => (
              <div key={journey.id} className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold">{journey.title}</h3>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="outline" size="sm">
                        Reset Journey Progress
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Reset Journey Progress</AlertDialogTitle>
                        <AlertDialogDescription>
                          Are you sure you want to reset progress for this journey?
                          This action cannot be undone.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={() =>
                            selectedUser &&
                            handleResetProgress(selectedUser.id, journey.id)
                          }
                        >
                          Reset Journey Progress
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
                <div className="space-y-2">
                  {areas
                    .filter((area) => area.journeyId === journey.id)
                    .map((area) => {
                      const progress = selectedUser?.progress.find(
                        (p) => p.areaId === area.id,
                      );
                      const percentage = progress
                        ? getProgressPercentage(
                            progress.completedLessons,
                            progress.totalLessons,
                          )
                        : 0;

                      return (
                        <div
                          key={area.id}
                          className="flex items-center justify-between gap-4 rounded-lg border p-4"
                        >
                          <div className="flex-1">
                            <div className="flex items-center justify-between">
                              <span className="font-medium">{area.name}</span>
                              <span className="text-sm text-muted-foreground">
                                {percentage}%
                              </span>
                            </div>
                            <Progress value={percentage} className="mt-2" />
                          </div>
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button variant="ghost" size="icon">
                                <RotateCcw className="h-4 w-4" />
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>
                                  Reset Area Progress
                                </AlertDialogTitle>
                                <AlertDialogDescription>
                                  Are you sure you want to reset progress for this
                                  area? This action cannot be undone.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction
                                  onClick={() =>
                                    selectedUser &&
                                    handleResetProgress(
                                      selectedUser.id,
                                      journey.id,
                                      area.id,
                                    )
                                  }
                                >
                                  Reset Area Progress
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </div>
                      );
                    })}
                </div>
              </div>
            ))}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default UsersPage; 