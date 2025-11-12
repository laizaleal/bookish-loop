import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Plus, Search, Pencil, Trash2, Package, Save, X } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { useAdminBooks } from "@/hooks/useAdminBooks"; // MUDEI AQUI
import { Book } from "@/types/book";

const AdminInventory = () => {
  const { books, loading, error, loadAllBooks, createBook, updateBook, deleteBook } = useAdminBooks(); // MUDEI AQUI
  const [searchQuery, setSearchQuery] = useState("");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingBook, setEditingBook] = useState<Book | null>(null);
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    title: "",
    author: "",
    publisher: "",
    price: "",
    stock: "",
    condition: "Ótimo Estado",
    isbn: "",
    description: "",
    category: "",
    imageUrl: "",
  });

  const [editFormData, setEditFormData] = useState({
    title: "",
    author: "",
    publisher: "",
    price: "",
    stock: "",
    condition: "Ótimo Estado",
    isbn: "",
    description: "",
    category: "",
    imageUrl: "",
  });

  useEffect(() => {
    loadAllBooks(); // MUDEI AQUI
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const newBook: Book = {
        id: Date.now().toString(),
        title: formData.title,
        author: formData.author,
        publisher: formData.publisher,
        price: parseFloat(formData.price),
        originalPrice: parseFloat(formData.price) * 1.8,
        stock: parseInt(formData.stock),
        condition: formData.condition,
        isbn: formData.isbn,
        description: formData.description,
        category: formData.category,
        imageUrl: formData.imageUrl || "/src/assets/book1.jpg",
      };

      await createBook(newBook);
      
      toast({
        title: "Livro adicionado!",
        description: `${newBook.title} foi adicionado ao estoque com sucesso.`,
      });

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
        description: "",
        category: "",
        imageUrl: "",
      });
    } catch (error) {
      toast({
        title: "Erro",
        description: "Erro ao adicionar livro",
        variant: "destructive",
      });
    }
  };

  const handleEdit = (book: Book) => {
    setEditingBook(book);
    setEditFormData({
      title: book.title,
      author: book.author,
      publisher: book.publisher,
      price: book.price.toString(),
      stock: book.stock.toString(),
      condition: book.condition,
      isbn: book.isbn || "",
      description: book.description || "",
      category: book.category || "",
      imageUrl: book.imageUrl,
    });
    setIsEditDialogOpen(true);
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!editingBook) return;

    try {
      const updatedBook: Book = {
        ...editingBook,
        title: editFormData.title,
        author: editFormData.author,
        publisher: editFormData.publisher,
        price: parseFloat(editFormData.price),
        originalPrice: parseFloat(editFormData.price) * 1.8,
        stock: parseInt(editFormData.stock),
        condition: editFormData.condition,
        isbn: editFormData.isbn,
        description: editFormData.description,
        category: editFormData.category,
        imageUrl: editFormData.imageUrl,
      };

      await updateBook(editingBook.id, updatedBook);
      
      toast({
        title: "Livro atualizado!",
        description: `${updatedBook.title} foi atualizado com sucesso.`,
      });

      setIsEditDialogOpen(false);
      setEditingBook(null);
    } catch (error) {
      toast({
        title: "Erro",
        description: "Erro ao atualizar livro",
        variant: "destructive",
      });
    }
  };

  const handleDelete = async (id: string) => {
    const book = books.find(b => b.id === id);
    
    if (!book) return;

    if (!confirm(`Tem certeza que deseja remover "${book.title}" do estoque?`)) {
      return;
    }

    try {
      await deleteBook(id);
      
      toast({
        title: "Livro removido",
        description: `${book.title} foi removido do estoque.`,
        variant: "destructive",
      });
    } catch (error) {
      toast({
        title: "Erro",
        description: "Erro ao remover livro",
        variant: "destructive",
      });
    }
  };

  const handleStockUpdate = async (bookId: string, newStock: number) => {
    try {
      const book = books.find(b => b.id === bookId);
      if (!book) return;

      const updatedBook = { ...book, stock: newStock };
      await updateBook(bookId, updatedBook);
      
      toast({
        title: "Estoque atualizado!",
        description: `Estoque de ${book.title} atualizado para ${newStock} unidades.`,
      });
    } catch (error) {
      toast({
        title: "Erro",
        description: "Não foi possível atualizar o estoque.",
        variant: "destructive",
      });
    }
  };

  const filteredBooks = books.filter(book =>
    book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    book.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
    book.publisher.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalStock = books.reduce((acc, book) => acc + book.stock, 0);
  const lowStockCount = books.filter(book => book.stock < 3 && book.stock > 0).length;
  const outOfStockCount = books.filter(book => book.stock === 0).length;

  // Função para determinar a variante do badge baseado no estoque
  const getStockBadgeVariant = (stock: number) => {
    if (stock === 0) return "destructive";
    if (stock < 3) return "secondary";
    return "outline";
  };

  // Função para determinar a variante do badge baseado na condição
  const getConditionBadgeVariant = (condition: string) => {
    switch (condition) {
      case "Ótimo Estado": return "default";
      case "Novo": return "secondary";
      default: return "outline";
    }
  };

  if (loading && books.length === 0) {
    return (
      <div className="space-y-6">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-serif font-bold">Gestão de Estoque</h2>
          <p className="text-sm text-muted-foreground">
            Cadastre e atualize os livros disponíveis na loja - {books.length} livros no total
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
                  <Label htmlFor="category">Categoria</Label>
                  <Input
                    id="category"
                    value={formData.category}
                    onChange={(e) => setFormData({...formData, category: e.target.value})}
                    placeholder="Fantasia, Ficção, etc."
                  />
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="isbn">ISBN</Label>
                  <Input
                    id="isbn"
                    value={formData.isbn}
                    onChange={(e) => setFormData({...formData, isbn: e.target.value})}
                    placeholder="978-XXXXXXXXXX"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="imageUrl">URL da Imagem</Label>
                  <Input
                    id="imageUrl"
                    value={formData.imageUrl}
                    onChange={(e) => setFormData({...formData, imageUrl: e.target.value})}
                    placeholder="/src/assets/book.jpg"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Descrição</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  placeholder="Descrição do livro..."
                  rows={3}
                />
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
                      <SelectItem value="Novo">Novo</SelectItem>
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

        {/* Edit Dialog */}
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Editar Livro</DialogTitle>
              <DialogDescription>
                Atualize as informações do livro
              </DialogDescription>
            </DialogHeader>
            
            <form onSubmit={handleUpdate} className="space-y-4 mt-4">
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-title">Título *</Label>
                  <Input
                    id="edit-title"
                    value={editFormData.title}
                    onChange={(e) => setEditFormData({...editFormData, title: e.target.value})}
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="edit-author">Autor *</Label>
                  <Input
                    id="edit-author"
                    value={editFormData.author}
                    onChange={(e) => setEditFormData({...editFormData, author: e.target.value})}
                    required
                  />
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-publisher">Editora *</Label>
                  <Input
                    id="edit-publisher"
                    value={editFormData.publisher}
                    onChange={(e) => setEditFormData({...editFormData, publisher: e.target.value})}
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="edit-category">Categoria</Label>
                  <Input
                    id="edit-category"
                    value={editFormData.category}
                    onChange={(e) => setEditFormData({...editFormData, category: e.target.value})}
                    placeholder="Fantasia, Ficção, etc."
                  />
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-isbn">ISBN</Label>
                  <Input
                    id="edit-isbn"
                    value={editFormData.isbn}
                    onChange={(e) => setEditFormData({...editFormData, isbn: e.target.value})}
                    placeholder="978-XXXXXXXXXX"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="edit-imageUrl">URL da Imagem</Label>
                  <Input
                    id="edit-imageUrl"
                    value={editFormData.imageUrl}
                    onChange={(e) => setEditFormData({...editFormData, imageUrl: e.target.value})}
                    placeholder="/src/assets/book.jpg"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit-description">Descrição</Label>
                <Textarea
                  id="edit-description"
                  value={editFormData.description}
                  onChange={(e) => setEditFormData({...editFormData, description: e.target.value})}
                  placeholder="Descrição do livro..."
                  rows={3}
                />
              </div>

              <div className="grid sm:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-price">Preço (R$) *</Label>
                  <Input
                    id="edit-price"
                    type="number"
                    step="0.01"
                    min="0"
                    value={editFormData.price}
                    onChange={(e) => setEditFormData({...editFormData, price: e.target.value})}
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="edit-stock">Quantidade *</Label>
                  <Input
                    id="edit-stock"
                    type="number"
                    min="0"
                    value={editFormData.stock}
                    onChange={(e) => setEditFormData({...editFormData, stock: e.target.value})}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="edit-condition">Condição *</Label>
                  <Select value={editFormData.condition} onValueChange={(value) => setEditFormData({...editFormData, condition: value})}>
                    <SelectTrigger id="edit-condition">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Ótimo Estado">Ótimo Estado</SelectItem>
                      <SelectItem value="Bom Estado">Bom Estado</SelectItem>
                      <SelectItem value="Estado Regular">Estado Regular</SelectItem>
                      <SelectItem value="Novo">Novo</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4">
                <Button type="button" variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                  Cancelar
                </Button>
                <Button type="submit" className="bg-primary hover:bg-primary/90">
                  <Save className="h-4 w-4 mr-2" />
                  Salvar Alterações
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
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
            <div className="text-2xl font-bold">{totalStock}</div>
            <p className="text-xs text-muted-foreground">unidades disponíveis</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Estoque Baixo</CardTitle>
            <Package className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{lowStockCount}</div>
            <p className="text-xs text-muted-foreground">menos de 3 unidades</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Fora de Estoque</CardTitle>
            <Package className="h-4 w-4 text-destructive" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{outOfStockCount}</div>
            <p className="text-xs text-muted-foreground">sem unidades</p>
          </CardContent>
        </Card>
      </div>

      {/* Search */}
      <Card>
        <CardHeader>
          <CardTitle>Livros Cadastrados</CardTitle>
          <CardDescription>
            Gerencie o estoque de livros disponíveis - {filteredBooks.length} de {books.length} livros
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
                          <Badge variant={getConditionBadgeVariant(book.condition)}>
                            {book.condition}
                          </Badge>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center justify-center gap-2">
                          <Button
                            size="icon"
                            variant="ghost"
                            className="h-6 w-6"
                            onClick={() => handleStockUpdate(book.id, Math.max(0, book.stock - 1))}
                            disabled={book.stock <= 0}
                          >
                            <X className="h-3 w-3" />
                          </Button>
                          <Badge variant={getStockBadgeVariant(book.stock)}>
                            {book.stock} un.
                          </Badge>
                          <Button
                            size="icon"
                            variant="ghost"
                            className="h-6 w-6"
                            onClick={() => handleStockUpdate(book.id, book.stock + 1)}
                          >
                            <Plus className="h-3 w-3" />
                          </Button>
                        </div>
                      </td>
                      <td className="py-3 px-4 text-right font-semibold">
                        R$ {book.price.toFixed(2)}
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex justify-center gap-2">
                          <Button 
                            size="icon" 
                            variant="ghost"
                            onClick={() => handleEdit(book)}
                          >
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