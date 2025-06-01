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

interface ChatScript {
  id: string;
  areaId: string;
  dialogueText: string;
  order: number;
  role: 'A' | 'B';
  audioUrl?: string;
}

const ChatScriptsPage = () => {
  const [chatScripts, setChatScripts] = useState<ChatScript[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [editingScript, setEditingScript] = useState<ChatScript | null>(null);

  // This would come from your API/database
  const areas = [
    { id: '1', name: 'Greetings' },
    { id: '2', name: 'Business Meeting' },
  ];

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const scriptData = {
      id: editingScript?.id || Date.now().toString(),
      areaId: formData.get('areaId') as string,
      dialogueText: formData.get('dialogueText') as string,
      order: parseInt(formData.get('order') as string),
      role: formData.get('role') as 'A' | 'B',
      audioUrl: formData.get('audioUrl') as string || undefined,
    };

    if (editingScript) {
      setChatScripts(chatScripts.map((s) => (s.id === editingScript.id ? scriptData : s)));
    } else {
      setChatScripts([...chatScripts, scriptData]);
    }

    setIsOpen(false);
    setEditingScript(null);
  };

  const handleDelete = (id: string) => {
    setChatScripts(chatScripts.filter((script) => script.id !== id));
  };

  const handleEdit = (script: ChatScript) => {
    setEditingScript(script);
    setIsOpen(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Chat Scripts</h1>
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Button>
              <PlusCircle className="mr-2 h-4 w-4" />
              Add Chat Script
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {editingScript ? 'Edit Chat Script' : 'Add New Chat Script'}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="areaId">Area</Label>
                <Select
                  name="areaId"
                  defaultValue={editingScript?.areaId}
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
                <Label htmlFor="dialogueText">Dialogue Text</Label>
                <Textarea
                  id="dialogueText"
                  name="dialogueText"
                  defaultValue={editingScript?.dialogueText}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="order">Order</Label>
                <Input
                  id="order"
                  name="order"
                  type="number"
                  defaultValue={editingScript?.order}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="role">Role</Label>
                <Select name="role" defaultValue={editingScript?.role} required>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="A">Role A</SelectItem>
                    <SelectItem value="B">Role B</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="audioUrl">Audio URL (optional)</Label>
                <Input
                  id="audioUrl"
                  name="audioUrl"
                  type="url"
                  defaultValue={editingScript?.audioUrl}
                />
              </div>
              <Button type="submit" className="w-full">
                {editingScript ? 'Update' : 'Create'} Chat Script
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Area</TableHead>
            <TableHead>Dialogue Text</TableHead>
            <TableHead>Order</TableHead>
            <TableHead>Role</TableHead>
            <TableHead>Audio</TableHead>
            <TableHead className="w-[100px]">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {chatScripts.map((script) => (
            <TableRow key={script.id}>
              <TableCell>
                {areas.find((a) => a.id === script.areaId)?.name}
              </TableCell>
              <TableCell>{script.dialogueText}</TableCell>
              <TableCell>{script.order}</TableCell>
              <TableCell>Role {script.role}</TableCell>
              <TableCell>
                {script.audioUrl && (
                  <audio controls src={script.audioUrl} className="h-8" />
                )}
              </TableCell>
              <TableCell>
                <div className="flex space-x-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleEdit(script)}
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleDelete(script.id)}
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

export default ChatScriptsPage; 