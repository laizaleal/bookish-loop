import { useState, useEffect } from "react";
import { Link, useSearchParams } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import BookCard from "@/components/BookCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Filter, Search, X, ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from "lucide-react";
import { useBooks } from "@/hooks/useBooks";

const Catalog = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const searchQuery = searchParams.get('search') || '';
  
  const [priceRange, setPriceRange] = useState([0, 100]);
  const [showFilters, setShowFilters] = useState(false);
  const [sortBy, setSortBy] = useState("relevance");
  const [conditionFilter, setConditionFilter] = useState("all");
  const [genreFilter, setGenreFilter] = useState("all");
  const [localSearchQuery, setLocalSearchQuery] = useState(searchQuery);
  const [currentPage, setCurrentPage] = useState(1);
  const [booksPerPage] = useState(12);
  
  const { books, loading, error, searchBooks, loadBooks, pagination } = useBooks();

  const availableGenres = [
    "Todos",
    "Fantasia",
    "Ficção Científica",
    "Literatura Clássica",
    "Drama",
    "Infantil",
    "Literatura Brasileira",
    "Romance",
    "Fábula / Política",
    "História / Não-Ficção",
    "Suspense / Mistério",
    "Fantasia Épica",
    "Terror / Gótico",
    "Ficção Espiritual",
    "Mistério / Policial",
    "Ficção Existencial",
    "Drama Social",
    "Autoajuda / Desenvolvimento Pessoal",
    "Aventura / Clássico",
    "Romance Gótico",
    "Filosofia / Ficção",
    "Romance Histórico / Mistério",
    "Clássico / Drama",
    "Terror"
  ];

  // Efeito para carregar livros baseado na busca
  useEffect(() => {
    console.log('🔍 useEffect executado, searchQuery:', searchQuery);
    
    if (searchQuery) {
      console.log('📚 Executando busca por:', searchQuery);
      searchBooks(searchQuery, currentPage, booksPerPage);
    } else {
      console.log('📚 Carregando todos os livros');
      loadBooks(currentPage, booksPerPage);
    }
  }, [searchQuery, currentPage, booksPerPage, searchBooks, loadBooks]);

  // Sincroniza o localSearchQuery quando searchQuery muda
  useEffect(() => {
    setLocalSearchQuery(searchQuery);
  }, [searchQuery]);

  // Reset para página 1 quando os filtros mudam
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, sortBy, conditionFilter, genreFilter, priceRange]);

  // Função para lidar com busca local no catálogo
  const handleLocalSearch = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('🔍 Busca local submetida:', localSearchQuery);
    
    if (localSearchQuery.trim()) {
      setSearchParams({ search: localSearchQuery.trim() });
    } else {
      setSearchParams({});
    }
    setCurrentPage(1);
  };

  // Função para limpar busca
  const clearSearch = () => {
    console.log('🧹 Limpando busca');
    setLocalSearchQuery('');
    setSearchParams({});
    setCurrentPage(1);
  };

  // Função para limpar todos os filtros
  const clearAllFilters = () => {
    setConditionFilter("all");
    setGenreFilter("all");
    setPriceRange([0, 100]);
    setSortBy("relevance");
    setCurrentPage(1);
  };

  // Filtrar e ordenar livros
  const filteredAndSortedBooks = books
    .filter(book => {
      // Filtro por condição
      if (conditionFilter === "excellent" && book.condition !== "Ótimo Estado") return false;
      if (conditionFilter === "good" && book.condition !== "Bom Estado") return false;
      
      // Filtro por gênero
      if (genreFilter !== "all" && book.category !== genreFilter) return false;
      
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

  // Funções de paginação
  const totalPages = pagination.totalPages || 1;
  const totalBooks = pagination.total || books.length;

  const goToPage = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const goToNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const goToPrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const goToFirstPage = () => {
    setCurrentPage(1);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const goToLastPage = () => {
    setCurrentPage(totalPages);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Gerar array de páginas para mostrar na paginação
  const getPageNumbers = () => {
    if (totalPages <= 1) return [1];
    
    const maxVisiblePages = 5;
    const calculatedStartPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    const calculatedEndPage = Math.min(totalPages, calculatedStartPage + maxVisiblePages - 1);
    const finalStartPage = calculatedEndPage - calculatedStartPage + 1 < maxVisiblePages 
      ? Math.max(1, calculatedEndPage - maxVisiblePages + 1)
      : calculatedStartPage;
    
    const pages = [];
    for (let i = finalStartPage; i <= calculatedEndPage; i++) {
      pages.push(i);
    }
    
    return pages;
  };

  // Calcular índices dos livros sendo mostrados
  const startIndex = (currentPage - 1) * booksPerPage;
  const endIndex = Math.min(startIndex + booksPerPage, totalBooks);
  const showingText = `Mostrando ${startIndex + 1}-${endIndex} de ${totalBooks} livros`;

  // Verificar se há filtros ativos
  const hasActiveFilters = conditionFilter !== "all" || genreFilter !== "all" || priceRange[0] > 0 || priceRange[1] < 100;

  console.log('📊 Estado atual:', {
    searchQuery,
    localSearchQuery,
    currentPage,
    booksPerPage,
    totalPages,
    totalBooks,
    booksCount: books.length,
    filteredCount: filteredAndSortedBooks.length,
    genreFilter,
    conditionFilter,
    priceRange,
    loading,
    error
  });

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex justify-center items-center h-64">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
              <p className="text-muted-foreground">
                {searchQuery ? `Buscando por "${searchQuery}"...` : "Carregando livros..."}
              </p>
            </div>
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
            <div className="text-center">
              <p className="text-destructive mb-4">Erro ao carregar livros: {error}</p>
              <Button onClick={() => window.location.reload()}>
                Recarregar
              </Button>
            </div>
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
              ? `Encontramos ${totalBooks} livro(s) para sua busca`
              : `Explore nossa coleção de ${totalBooks} livros usados em excelente estado`
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

        {/* Filters and Sort - LAYOUT CORRIGIDO */}
        <div className="mb-8 flex flex-col gap-4 animate-slide-up">
          {/* Primeira linha: Botões móveis e info */}
          <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
            <div className="flex items-center gap-4">
              <Button
                variant="outline"
                onClick={() => setShowFilters(!showFilters)}
                className="sm:hidden"
              >
                <Filter className="h-4 w-4 mr-2" />
                Filtros
                {hasActiveFilters && (
                  <span className="ml-2 bg-primary text-primary-foreground rounded-full h-5 w-5 text-xs flex items-center justify-center">
                    !
                  </span>
                )}
              </Button>

              {hasActiveFilters && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={clearAllFilters}
                  className="text-muted-foreground"
                >
                  <X className="h-4 w-4 mr-1" />
                  Limpar Filtros
                </Button>
              )}
            </div>

            <span className="text-sm text-muted-foreground">
              Página {currentPage} de {totalPages} • {filteredAndSortedBooks.length} de {totalBooks} livros
            </span>
          </div>

          {/* Segunda linha: Filtros desktop */}
          <div className="hidden sm:flex flex-wrap gap-4 items-center">
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

            {/* Novo Filtro por Gênero */}
            <Select value={genreFilter} onValueChange={setGenreFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Gênero" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos os Gêneros</SelectItem>
                {availableGenres
                  .filter(genre => genre !== "Todos")
                  .map((genre) => (
                    <SelectItem key={genre} value={genre}>
                      {genre}
                    </SelectItem>
                  ))
                }
              </SelectContent>
            </Select>

            {/* Filtro de Preço no Desktop */}
            <div className="flex items-center gap-4 ml-4">
              <span className="text-sm text-muted-foreground whitespace-nowrap">Preço:</span>
              <div className="w-32">
                <Slider
                  value={priceRange}
                  onValueChange={setPriceRange}
                  max={100}
                  step={5}
                  className="w-full"
                />
              </div>
              <div className="text-sm text-muted-foreground whitespace-nowrap">
                R$ {priceRange[0]} - R$ {priceRange[1]}
              </div>
            </div>
          </div>
        </div>

        {/* Filters Sidebar - Mobile */}
        {showFilters && (
          <div className="sm:hidden mb-6 p-4 bg-card rounded-lg border border-border animate-slide-up">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-semibold">Filtros</h3>
              {hasActiveFilters && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={clearAllFilters}
                  className="text-muted-foreground"
                >
                  <X className="h-4 w-4 mr-1" />
                  Limpar
                </Button>
              )}
            </div>
            
            <div className="space-y-6">
              <div>
                <h4 className="font-medium mb-3">Ordenar por</h4>
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger>
                    <SelectValue placeholder="Ordenar por" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="relevance">Relevância</SelectItem>
                    <SelectItem value="price-asc">Menor Preço</SelectItem>
                    <SelectItem value="price-desc">Maior Preço</SelectItem>
                    <SelectItem value="title">Título A-Z</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <h4 className="font-medium mb-3">Condição</h4>
                <Select value={conditionFilter} onValueChange={setConditionFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="Condição" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todas</SelectItem>
                    <SelectItem value="excellent">Ótimo Estado</SelectItem>
                    <SelectItem value="good">Bom Estado</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <h4 className="font-medium mb-3">Gênero</h4>
                <Select value={genreFilter} onValueChange={setGenreFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione um gênero" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos os Gêneros</SelectItem>
                    {availableGenres
                      .filter(genre => genre !== "Todos")
                      .map((genre) => (
                        <SelectItem key={genre} value={genre}>
                          {genre}
                        </SelectItem>
                      ))
                    }
                  </SelectContent>
                </Select>
              </div>

              <div>
                <h4 className="font-medium mb-3">Faixa de Preço</h4>
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
            </div>
          </div>
        )}

        {/* Books Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 animate-fade-in">
          {filteredAndSortedBooks.map((book) => (
            <BookCard key={book.id} {...book} />
          ))}
        </div>

        {/* Paginação */}
        {totalPages > 1 && (
          <div className="mt-12 flex flex-col sm:flex-row items-center justify-between gap-4 animate-fade-in">
            <div className="text-sm text-muted-foreground">
              {showingText}
            </div>
            
            <div className="flex items-center gap-2">
              {/* Primeira página */}
              <Button
                variant="outline"
                size="icon"
                onClick={goToFirstPage}
                disabled={currentPage === 1}
                className="h-9 w-9"
              >
                <ChevronsLeft className="h-4 w-4" />
              </Button>

              {/* Página anterior */}
              <Button
                variant="outline"
                size="icon"
                onClick={goToPrevPage}
                disabled={currentPage === 1}
                className="h-9 w-9"
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>

              {/* Números das páginas */}
              <div className="flex gap-1">
                {getPageNumbers().map((page) => (
                  <Button
                    key={page}
                    variant={currentPage === page ? "default" : "outline"}
                    size="icon"
                    onClick={() => goToPage(page)}
                    className="h-9 w-9"
                  >
                    {page}
                  </Button>
                ))}
              </div>

              {/* Próxima página */}
              <Button
                variant="outline"
                size="icon"
                onClick={goToNextPage}
                disabled={currentPage === totalPages}
                className="h-9 w-9"
              >
                <ChevronRight className="h-4 w-4" />
              </Button>

              {/* Última página */}
              <Button
                variant="outline"
                size="icon"
                onClick={goToLastPage}
                disabled={currentPage === totalPages}
                className="h-9 w-9"
              >
                <ChevronsRight className="h-4 w-4" />
              </Button>
            </div>

            {/* Seletor de página */}
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">Ir para:</span>
              <Select
                value={currentPage.toString()}
                onValueChange={(value) => goToPage(Number(value))}
              >
                <SelectTrigger className="w-20">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                    <SelectItem key={page} value={page.toString()}>
                      {page}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        )}

        {filteredAndSortedBooks.length === 0 && (
          <div className="text-center py-12">
            {searchQuery || hasActiveFilters ? (
              <div className="space-y-4">
                <p className="text-muted-foreground">
                  {searchQuery && hasActiveFilters 
                    ? `Nenhum livro encontrado para "${searchQuery}" com os filtros selecionados.`
                    : searchQuery 
                    ? `Nenhum livro encontrado para "${searchQuery}"`
                    : "Nenhum livro encontrado com os filtros selecionados."
                  }
                </p>
                <div className="flex gap-2 justify-center">
                  {(searchQuery || hasActiveFilters) && (
                    <Button onClick={clearAllFilters} variant="outline">
                      Limpar Filtros
                    </Button>
                  )}
                  {searchQuery && (
                    <Button onClick={clearSearch}>
                      Limpar Busca
                    </Button>
                  )}
                </div>
              </div>
            ) : (
              <p className="text-muted-foreground">
                Nenhum livro disponível no momento.
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