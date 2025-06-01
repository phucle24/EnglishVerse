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
import { Textarea } from '@/components/ui/textarea';
import { PlusCircle, Pencil, Trash } from 'lucide-react';

interface Journey {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
}

const JourneysPage = () => {
  const [journeys, setJourneys] = useState<Journey[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [editingJourney, setEditingJourney] = useState<Journey | null>(null);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const journeyData = {
      id: editingJourney?.id || Date.now().toString(),
      title: formData.get('title') as string,
      description: formData.get('description') as string,
      imageUrl: formData.get('imageUrl') as string,
    };

    if (editingJourney) {
      setJourneys(journeys.map((j) => (j.id === editingJourney.id ? journeyData : j)));
    } else {
      setJourneys([...journeys, journeyData]);
    }

    setIsOpen(false);
    setEditingJourney(null);
  };

  const handleDelete = (id: string) => {
    setJourneys(journeys.filter((journey) => journey.id !== id));
  };

  const handleEdit = (journey: Journey) => {
    setEditingJourney(journey);
    setIsOpen(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Journeys</h1>
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Button>
              <PlusCircle className="mr-2 h-4 w-4" />
              Add Journey
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {editingJourney ? 'Edit Journey' : 'Add New Journey'}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  name="title"
                  defaultValue={editingJourney?.title}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  name="description"
                  defaultValue={editingJourney?.description}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="imageUrl">Image URL</Label>
                <Input
                  id="imageUrl"
                  name="imageUrl"
                  type="url"
                  defaultValue={editingJourney?.imageUrl}
                  required
                />
              </div>
              <Button type="submit" className="w-full">
                {editingJourney ? 'Update' : 'Create'} Journey
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Title</TableHead>
            <TableHead>Description</TableHead>
            <TableHead>Image</TableHead>
            <TableHead className="w-[100px]">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {journeys.map((journey) => (
            <TableRow key={journey.id}>
              <TableCell>{journey.title}</TableCell>
              <TableCell>{journey.description}</TableCell>
              <TableCell>
                <img
                  src={journey.imageUrl}
                  alt={journey.title}
                  className="h-10 w-10 rounded object-cover"
                />
              </TableCell>
              <TableCell>
                <div className="flex space-x-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleEdit(journey)}
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleDelete(journey.id)}
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

export default JourneysPage; 