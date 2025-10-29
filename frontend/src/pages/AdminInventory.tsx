import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Plus, Search, Pencil, Trash2, Package } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";

interface Book {
  id: string;
  title: string;
  author: string;
  publisher: string;
  price: number;
  stock: number;
  condition: string;
  isbn?: string;
}

const initialBooks: Book[] = [
  {
    id: "1",
    title: "O Senhor dos Anéis: A Sociedade do Anel",
    author: "J.R.R. Tolkien",
    publisher: "Martins Fontes",
    price: 45.90,
    stock: 3,
    condition: "Ótimo Estado",
    isbn: "978-8533613379",
  },
  {
    id: "2",
    title: "1984",
    author: "George Orwell",
    publisher: "Companhia das Letras",
    price: 35.90,
    stock: 5,
    condition: "Bom Estado",
    isbn: "978-8535914849",
  },
];

const AdminInventory = () => {
  const [books, setBooks] = useState<Book[]>(initialBooks);
  const [searchQuery, setSearchQuery] = useState("");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    title: "",
    author: "",
    publisher: "",
    price: "",
    stock: "",
    condition: "Ótimo Estado",
    isbn: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const newBook: Book = {
      id: Date.now().toString(),
      title: formData.title,
      author: formData.author,
      publisher: formData.publisher,
      price: parseFloat(formData.price),
      stock: parseInt(formData.stock),
      condition: formData.condition,
      isbn: formData.isbn,
    };

    setBooks([...books, newBook]);
    setIsAddDialogOpen(false);
    
    // Reset form
    setFormData({
      title: "",
      author: "",
      publisher: "",
      price: "",
      stock: "",
      condition: "Ótimo Estado",
      isbn: "",
    });

    toast({
      title: "Livro adicionado!",
      description: `${newBook.title} foi adicionado ao estoque com sucesso.`,
    });
  };

  const handleDelete = (id: string) => {
    const book = books.find(b => b.id === id);
    setBooks(books.filter(b => b.id !== id));
    
    toast({
      title: "Livro removido",
      description: `${book?.title} foi removido do estoque.`,
      variant: "destructive",
    });
  };

  const filteredBooks = books.filter(book =>
    book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    book.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
    book.publisher.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-serif font-bold">Gestão de Estoque</h2>
          <p className="text-sm text-muted-foreground">
            Cadastre e atualize os livros disponíveis na loja
          </p>
        </div>
        
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-primary hover:bg-primary/90">
              <Plus className="h-4 w-4 mr-2" />
              Adicionar Livro
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Adicionar Novo Livro</DialogTitle>
              <DialogDescription>
                Preencha as informações do livro para adicioná-lo ao estoque
              </DialogDescription>
            </DialogHeader>
            
            <form onSubmit={handleSubmit} className="space-y-4 mt-4">
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Título *</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => setFormData({...formData, title: e.target.value})}
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="author">Autor *</Label>
                  <Input
                    id="author"
                    value={formData.author}
                    onChange={(e) => setFormData({...formData, author: e.target.value})}
                    required
                  />
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="publisher">Editora *</Label>
                  <Input
                    id="publisher"
                    value={formData.publisher}
                    onChange={(e) => setFormData({...formData, publisher: e.target.value})}
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="isbn">ISBN</Label>
                  <Input
                    id="isbn"
                    value={formData.isbn}
                    onChange={(e) => setFormData({...formData, isbn: e.target.value})}
                    placeholder="978-XXXXXXXXXX"
                  />
                </div>
              </div>

              <div className="grid sm:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="price">Preço (R$) *</Label>
                  <Input
                    id="price"
                    type="number"
                    step="0.01"
                    min="0"
                    value={formData.price}
                    onChange={(e) => setFormData({...formData, price: e.target.value})}
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="stock">Quantidade *</Label>
                  <Input
                    id="stock"
                    type="number"
                    min="0"
                    value={formData.stock}
                    onChange={(e) => setFormData({...formData, stock: e.target.value})}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="condition">Condição *</Label>
                  <Select value={formData.condition} onValueChange={(value) => setFormData({...formData, condition: value})}>
                    <SelectTrigger id="condition">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Ótimo Estado">Ótimo Estado</SelectItem>
                      <SelectItem value="Bom Estado">Bom Estado</SelectItem>
                      <SelectItem value="Estado Regular">Estado Regular</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4">
                <Button type="button" variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                  Cancelar
                </Button>
                <Button type="submit" className="bg-primary hover:bg-primary/90">
                  Adicionar ao Estoque
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Livros</CardTitle>
            <Package className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{books.length}</div>
            <p className="text-xs text-muted-foreground">títulos cadastrados</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Estoque Total</CardTitle>
            <Package className="h-4 w-4 text-accent" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {books.reduce((acc, book) => acc + book.stock, 0)}
            </div>
            <p className="text-xs text-muted-foreground">unidades disponíveis</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Estoque Baixo</CardTitle>
            <Package className="h-4 w-4 text-destructive" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {books.filter(book => book.stock < 3).length}
            </div>
            <p className="text-xs text-muted-foreground">livros com menos de 3 unidades</p>
          </CardContent>
        </Card>
      </div>

      {/* Search */}
      <Card>
        <CardHeader>
          <CardTitle>Livros Cadastrados</CardTitle>
          <CardDescription>
            Gerencie o estoque de livros disponíveis
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar por título, autor ou editora..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>

            {/* Books Table */}
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left py-3 px-4 font-medium">Título</th>
                    <th className="text-left py-3 px-4 font-medium">Autor</th>
                    <th className="text-left py-3 px-4 font-medium">Editora</th>
                    <th className="text-center py-3 px-4 font-medium">Condição</th>
                    <th className="text-center py-3 px-4 font-medium">Estoque</th>
                    <th className="text-right py-3 px-4 font-medium">Preço</th>
                    <th className="text-center py-3 px-4 font-medium">Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredBooks.map((book) => (
                    <tr key={book.id} className="border-b border-border hover:bg-muted/50 transition-colors">
                      <td className="py-3 px-4 font-medium">{book.title}</td>
                      <td className="py-3 px-4 text-muted-foreground">{book.author}</td>
                      <td className="py-3 px-4 text-muted-foreground">{book.publisher}</td>
                      <td className="py-3 px-4">
                        <div className="flex justify-center">
                          <Badge variant={book.condition === "Ótimo Estado" ? "default" : "secondary"}>
                            {book.condition}
                          </Badge>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex justify-center">
                          <Badge variant={book.stock < 3 ? "destructive" : "outline"}>
                            {book.stock} un.
                          </Badge>
                        </div>
                      </td>
                      <td className="py-3 px-4 text-right font-semibold">
                        R$ {book.price.toFixed(2)}
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex justify-center gap-2">
                          <Button size="icon" variant="ghost">
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button 
                            size="icon" 
                            variant="ghost"
                            onClick={() => handleDelete(book.id)}
                          >
                            <Trash2 className="h-4 w-4 text-destructive" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              
              {filteredBooks.length === 0 && (
                <div className="text-center py-12 text-muted-foreground">
                  <Package className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>Nenhum livro encontrado</p>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminInventory;
