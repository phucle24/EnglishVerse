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
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { PlusCircle, Pencil, Trash } from 'lucide-react';

interface Area {
  id: string;
  journeyId: string;
  name: string;
  icon: string;
  displayOrder: number;
  unlockCondition: string;
}

const AreasPage = () => {
  const [areas, setAreas] = useState<Area[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [editingArea, setEditingArea] = useState<Area | null>(null);

  // This would come from your API/database
  const journeys = [
    { id: '1', title: 'Basic Conversation' },
    { id: '2', title: 'Business English' },
  ];

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const areaData = {
      id: editingArea?.id || Date.now().toString(),
      journeyId: formData.get('journeyId') as string,
      name: formData.get('name') as string,
      icon: formData.get('icon') as string,
      displayOrder: parseInt(formData.get('displayOrder') as string),
      unlockCondition: formData.get('unlockCondition') as string,
    };

    if (editingArea) {
      setAreas(areas.map((a) => (a.id === editingArea.id ? areaData : a)));
    } else {
      setAreas([...areas, areaData]);
    }

    setIsOpen(false);
    setEditingArea(null);
  };

  const handleDelete = (id: string) => {
    setAreas(areas.filter((area) => area.id !== id));
  };

  const handleEdit = (area: Area) => {
    setEditingArea(area);
    setIsOpen(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Areas</h1>
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Button>
              <PlusCircle className="mr-2 h-4 w-4" />
              Add Area
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {editingArea ? 'Edit Area' : 'Add New Area'}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="journeyId">Journey</Label>
                <Select
                  name="journeyId"
                  defaultValue={editingArea?.journeyId}
                  required
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a journey" />
                  </SelectTrigger>
                  <SelectContent>
                    {journeys.map((journey) => (
                      <SelectItem key={journey.id} value={journey.id}>
                        {journey.title}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  name="name"
                  defaultValue={editingArea?.name}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="icon">Icon</Label>
                <Input
                  id="icon"
                  name="icon"
                  defaultValue={editingArea?.icon}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="displayOrder">Display Order</Label>
                <Input
                  id="displayOrder"
                  name="displayOrder"
                  type="number"
                  defaultValue={editingArea?.displayOrder}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="unlockCondition">Unlock Condition</Label>
                <Input
                  id="unlockCondition"
                  name="unlockCondition"
                  defaultValue={editingArea?.unlockCondition}
                  required
                />
              </div>
              <Button type="submit" className="w-full">
                {editingArea ? 'Update' : 'Create'} Area
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Journey</TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Icon</TableHead>
            <TableHead>Display Order</TableHead>
            <TableHead>Unlock Condition</TableHead>
            <TableHead className="w-[100px]">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {areas.map((area) => (
            <TableRow key={area.id}>
              <TableCell>
                {journeys.find((j) => j.id === area.journeyId)?.title}
              </TableCell>
              <TableCell>{area.name}</TableCell>
              <TableCell>{area.icon}</TableCell>
              <TableCell>{area.displayOrder}</TableCell>
              <TableCell>{area.unlockCondition}</TableCell>
              <TableCell>
                <div className="flex space-x-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleEdit(area)}
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleDelete(area.id)}
                  >
                    <Trash className="h-4 w-4" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default AreasPage; 