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
import { Textarea } from '@/components/ui/textarea';
import { PlusCircle, Pencil, Trash } from 'lucide-react';

interface Flashcard {
  id: string;
  areaId: string;
  vocabulary: string;
  example: string;
  imageUrl?: string;
  audioUrl?: string;
}

const FlashcardsPage = () => {
  const [flashcards, setFlashcards] = useState<Flashcard[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [editingCard, setEditingCard] = useState<Flashcard | null>(null);

  // This would come from your API/database
  const areas = [
    { id: '1', name: 'Greetings' },
    { id: '2', name: 'Business Meeting' },
  ];

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const cardData = {
      id: editingCard?.id || Date.now().toString(),
      areaId: formData.get('areaId') as string,
      vocabulary: formData.get('vocabulary') as string,
      example: formData.get('example') as string,
      imageUrl: formData.get('imageUrl') as string || undefined,
      audioUrl: formData.get('audioUrl') as string || undefined,
    };

    if (editingCard) {
      setFlashcards(flashcards.map((f) => (f.id === editingCard.id ? cardData : f)));
    } else {
      setFlashcards([...flashcards, cardData]);
    }

    setIsOpen(false);
    setEditingCard(null);
  };

  const handleDelete = (id: string) => {
    setFlashcards(flashcards.filter((card) => card.id !== id));
  };

  const handleEdit = (card: Flashcard) => {
    setEditingCard(card);
    setIsOpen(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Flashcards</h1>
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Button>
              <PlusCircle className="mr-2 h-4 w-4" />
              Add Flashcard
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {editingCard ? 'Edit Flashcard' : 'Add New Flashcard'}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="areaId">Area</Label>
                <Select
                  name="areaId"
                  defaultValue={editingCard?.areaId}
                  required
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select an area" />
                  </SelectTrigger>
                  <SelectContent>
                    {areas.map((area) => (
                      <SelectItem key={area.id} value={area.id}>
                        {area.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="vocabulary">Vocabulary</Label>
                <Input
                  id="vocabulary"
                  name="vocabulary"
                  defaultValue={editingCard?.vocabulary}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="example">Example</Label>
                <Textarea
                  id="example"
                  name="example"
                  defaultValue={editingCard?.example}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="imageUrl">Image URL (optional)</Label>
                <Input
                  id="imageUrl"
                  name="imageUrl"
                  type="url"
                  defaultValue={editingCard?.imageUrl}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="audioUrl">Audio URL (optional)</Label>
                <Input
                  id="audioUrl"
                  name="audioUrl"
                  type="url"
                  defaultValue={editingCard?.audioUrl}
                />
              </div>
              <Button type="submit" className="w-full">
                {editingCard ? 'Update' : 'Create'} Flashcard
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Area</TableHead>
            <TableHead>Vocabulary</TableHead>
            <TableHead>Example</TableHead>
            <TableHead>Image</TableHead>
            <TableHead>Audio</TableHead>
            <TableHead className="w-[100px]">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {flashcards.map((card) => (
            <TableRow key={card.id}>
              <TableCell>
                {areas.find((a) => a.id === card.areaId)?.name}
              </TableCell>
              <TableCell>{card.vocabulary}</TableCell>
              <TableCell>{card.example}</TableCell>
              <TableCell>
                {card.imageUrl && (
                  <img
                    src={card.imageUrl}
                    alt={card.vocabulary}
                    className="h-10 w-10 rounded object-cover"
                  />
                )}
              </TableCell>
              <TableCell>
                {card.audioUrl && (
                  <audio controls src={card.audioUrl} className="h-8" />
                )}
              </TableCell>
              <TableCell>
                <div className="flex space-x-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleEdit(card)}
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleDelete(card.id)}
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

export default FlashcardsPage; 