import { useState, useEffect } from "react";
import { Link, useSearchParams } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import BookCard from "@/components/BookCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Filter, Search, X } from "lucide-react";
import { useBooks } from "@/hooks/useBooks";

const Catalog = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const searchQuery = searchParams.get('search') || '';
  
  const [priceRange, setPriceRange] = useState([0, 100]);
  const [showFilters, setShowFilters] = useState(false);
  const [sortBy, setSortBy] = useState("relevance");
  const [conditionFilter, setConditionFilter] = useState("all");
  const [localSearchQuery, setLocalSearchQuery] = useState(searchQuery);
  
  const { books, loading, error, searchBooks, loadBooks } = useBooks();

  // Efeito para carregar livros baseado na busca - CORRIGIDO
  useEffect(() => {
    console.log('🔍 useEffect executado, searchQuery:', searchQuery);
    
    if (searchQuery) {
      console.log('📚 Executando busca por:', searchQuery);
      searchBooks(searchQuery);
    } else {
      console.log('📚 Carregando todos os livros');
      loadBooks();
    }
  }, [searchQuery]); // Removidas as dependências desnecessárias

  // Sincroniza o localSearchQuery quando searchQuery muda
  useEffect(() => {
    setLocalSearchQuery(searchQuery);
  }, [searchQuery]);

  // Função para lidar com busca local no catálogo
  const handleLocalSearch = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('🔍 Busca local submetida:', localSearchQuery);
    
    if (localSearchQuery.trim()) {
      setSearchParams({ search: localSearchQuery.trim() });
    } else {
      setSearchParams({});
    }
  };

  // Função para limpar busca
  const clearSearch = () => {
    console.log('🧹 Limpando busca');
    setLocalSearchQuery('');
    setSearchParams({});
  };

  // Filtrar e ordenar livros
  const filteredAndSortedBooks = books
    .filter(book => {
      // Filtro por condição
      if (conditionFilter === "excellent" && book.condition !== "Ótimo Estado") return false;
      if (conditionFilter === "good" && book.condition !== "Bom Estado") return false;
      
      // Filtro por preço
      if (book.price < priceRange[0] || book.price > priceRange[1]) return false;
      
      return true;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case "price-asc":
          return a.price - b.price;
        case "price-desc":
          return b.price - a.price;
        case "title":
          return a.title.localeCompare(b.title);
        case "relevance":
        default:
          return 0;
      }
    });

  console.log('📊 Estado atual:', {
    searchQuery,
    localSearchQuery,
    booksCount: books.length,
    filteredCount: filteredAndSortedBooks.length,
    loading,
    error
  });

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex justify-center items-center h-64">
            <p className="text-muted-foreground">
              {searchQuery ? `Buscando por "${searchQuery}"...` : "Carregando livros..."}
            </p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex justify-center items-center h-64">
            <p className="text-destructive">Erro ao carregar livros: {error}</p>
            <Button onClick={() => window.location.reload()} className="ml-4">
              Recarregar
            </Button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8 animate-fade-in">
          <h1 className="text-4xl font-serif font-bold mb-2">
            {searchQuery ? `Resultados para "${searchQuery}"` : "Catálogo de Livros"}
          </h1>
          <p className="text-muted-foreground">
            {searchQuery 
              ? `Encontramos ${filteredAndSortedBooks.length} livro(s) para sua busca`
              : "Explore nossa coleção de livros usados em excelente estado"
            }
          </p>
        </div>

        {/* Barra de busca local no catálogo */}
        <div className="mb-6">
          <form onSubmit={handleLocalSearch} className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Buscar no catálogo..."
              value={localSearchQuery}
              onChange={(e) => setLocalSearchQuery(e.target.value)}
              className="pl-10 pr-20"
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  handleLocalSearch(e);
                }
              }}
            />
            <div className="absolute right-1 top-1/2 transform -translate-y-1/2 flex gap-1">
              {localSearchQuery && (
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={clearSearch}
                  className="h-7 px-2"
                >
                  <X className="h-3 w-3" />
                </Button>
              )}
              <Button
                type="submit"
                size="sm"
                className="h-7 px-3"
                disabled={!localSearchQuery.trim()}
              >
                Buscar
              </Button>
            </div>
          </form>
        </div>

        {/* Filters and Sort */}
        <div className="mb-8 flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center animate-slide-up">
          <Button
            variant="outline"
            onClick={() => setShowFilters(!showFilters)}
            className="sm:hidden"
          >
            <Filter className="h-4 w-4 mr-2" />
            Filtros
          </Button>

          <div className="flex flex-wrap gap-4 items-center">
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Ordenar por" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="relevance">Relevância</SelectItem>
                <SelectItem value="price-asc">Menor Preço</SelectItem>
                <SelectItem value="price-desc">Maior Preço</SelectItem>
                <SelectItem value="title">Título A-Z</SelectItem>
              </SelectContent>
            </Select>

            <Select value={conditionFilter} onValueChange={setConditionFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Condição" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas</SelectItem>
                <SelectItem value="excellent">Ótimo Estado</SelectItem>
                <SelectItem value="good">Bom Estado</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <span className="text-sm text-muted-foreground">
            {filteredAndSortedBooks.length} {filteredAndSortedBooks.length === 1 ? 'livro encontrado' : 'livros encontrados'}
          </span>
        </div>

        {/* Filters Sidebar - Mobile */}
        {showFilters && (
          <div className="sm:hidden mb-6 p-4 bg-card rounded-lg border border-border animate-slide-up">
            <h3 className="font-semibold mb-4">Faixa de Preço</h3>
            <div className="space-y-4">
              <Slider
                value={priceRange}
                onValueChange={setPriceRange}
                max={100}
                step={5}
                className="w-full"
              />
              <div className="flex justify-between text-sm text-muted-foreground">
                <span>R$ {priceRange[0]}</span>
                <span>R$ {priceRange[1]}</span>
              </div>
            </div>
          </div>
        )}

        {/* Books Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 animate-fade-in">
          {filteredAndSortedBooks.map((book) => (
            <BookCard key={book.id} {...book} />
          ))}
        </div>

        {filteredAndSortedBooks.length === 0 && (
          <div className="text-center py-12">
            {searchQuery ? (
              <div className="space-y-4">
                <p className="text-muted-foreground">
                  Nenhum livro encontrado para "<strong>{searchQuery}</strong>"
                </p>
                <Button onClick={clearSearch} variant="outline">
                  Limpar Busca
                </Button>
              </div>
            ) : (
              <p className="text-muted-foreground">
                Nenhum livro encontrado com os filtros selecionados.
              </p>
            )}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default Catalog;