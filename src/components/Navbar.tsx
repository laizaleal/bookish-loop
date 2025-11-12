// src/components/Navbar.tsx
import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { BookOpen, Search, Heart, ShoppingCart, Menu, X, User, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useCart } from "@/hooks/useCart";
import { useFavorites } from "@/hooks/useFavorites";
import { useAuth } from "@/hooks/useAuth";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const { getItemCount } = useCart();
  const { favoriteCount } = useFavorites();
  const { user, isAuthenticated, logout } = useAuth();
  const cartItemCount = getItemCount();
  const navigate = useNavigate();
  const location = useLocation();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/catalog?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery("");
      setIsMenuOpen(false);
    }
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    handleSearch(e);
  };

  const handleLogout = async () => {
    try {
      await logout();
      setIsMenuOpen(false);
    } catch (error) {
      console.error('Erro ao fazer logout:', error);
    }
  };

  const handleAdminClick = () => {
    navigate('/admin/inventory');
    setIsMenuOpen(false);
  };

  return (
    <nav className="sticky top-0 z-50 bg-card/95 backdrop-blur-sm border-b border-border shadow-soft">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <div className="p-2 bg-primary rounded-lg group-hover:scale-110 transition-transform">
              <BookOpen className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="text-xl font-serif font-bold text-foreground">
              ReBook
            </span>
          </Link>

          {/* Search Bar - Desktop */}
          <div className="hidden md:flex flex-1 max-w-md mx-8">
            <form onSubmit={handleSearchSubmit} className="relative w-full">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Buscar por título, autor ou editora..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-background border-border"
              />
              <Button
                type="submit"
                size="sm"
                className="absolute right-1 top-1/2 transform -translate-y-1/2 h-7 px-3"
                disabled={!searchQuery.trim()}
              >
                Buscar
              </Button>
            </form>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-4">
            <Link to="/catalog">
              <Button variant="ghost" className="font-medium">
                Catálogo
              </Button>
            </Link>

            {/* Admin Link - Sempre visível para simplificar */}
            <Button 
              variant="ghost" 
              className="font-medium"
              onClick={handleAdminClick}
            >
              Admin
            </Button>

            {/* Favoritos */}
            <Link to="/favorites">
              <Button variant="ghost" size="icon" className="relative">
                <Heart className="h-5 w-5" />
                {favoriteCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-accent text-accent-foreground text-xs rounded-full h-4 w-4 flex items-center justify-center">
                    {favoriteCount > 9 ? '9+' : favoriteCount}
                  </span>
                )}
              </Button>
            </Link>

            {/* Carrinho */}
            <Link to="/cart">
              <Button variant="ghost" size="icon" className="relative">
                <ShoppingCart className="h-5 w-5" />
                {cartItemCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-accent text-accent-foreground text-xs rounded-full h-4 w-4 flex items-center justify-center">
                    {cartItemCount > 9 ? '9+' : cartItemCount}
                  </span>
                )}
              </Button>
            </Link>

            {/* Área do Usuário */}
            {isAuthenticated ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative">
                    <User className="h-5 w-5 mr-2" />
                    {user?.name}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel>
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none">{user?.name}</p>
                      <p className="text-xs leading-none text-muted-foreground">
                        {user?.email}
                      </p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link to="/profile" className="w-full cursor-pointer">
                      <User className="h-4 w-4 mr-2" />
                      Meu Perfil
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link to="/favorites" className="w-full cursor-pointer">
                      <Heart className="h-4 w-4 mr-2" />
                      Meus Favoritos
                      {favoriteCount > 0 && (
                        <span className="ml-auto bg-accent text-accent-foreground text-xs rounded-full h-5 w-5 flex items-center justify-center">
                          {favoriteCount}
                        </span>
                      )}
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem 
                    onClick={handleLogout}
                    className="text-destructive cursor-pointer"
                  >
                    <LogOut className="h-4 w-4 mr-2" />
                    Sair
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Link to="/auth">
                <Button className="bg-primary hover:bg-primary/90">
                  Entrar
                </Button>
              </Link>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 rounded-lg hover:bg-secondary"
          >
            {isMenuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </button>
        </div>

        {/* Mobile Search */}
        <div className="md:hidden pb-4">
          <form onSubmit={handleSearchSubmit} className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Buscar livros..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-background border-border"
            />
            <Button
              type="submit"
              size="sm"
              className="absolute right-1 top-1/2 transform -translate-y-1/2 h-7 px-3"
              disabled={!searchQuery.trim()}
            >
              Buscar
            </Button>
          </form>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden border-t border-border bg-card animate-slide-up">
          <div className="px-4 py-4 space-y-3">
            <Link to="/catalog" onClick={() => setIsMenuOpen(false)}>
              <Button variant="ghost" className="w-full justify-start font-medium">
                Catálogo
              </Button>
            </Link>

            <Button 
              variant="ghost" 
              className="w-full justify-start font-medium"
              onClick={handleAdminClick}
            >
              Admin
            </Button>

            <Link to="/favorites" onClick={() => setIsMenuOpen(false)}>
              <Button variant="ghost" className="w-full justify-start relative">
                <Heart className="h-5 w-5 mr-2" />
                Favoritos
                {favoriteCount > 0 && (
                  <span className="absolute right-4 bg-accent text-accent-foreground text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {favoriteCount}
                  </span>
                )}
              </Button>
            </Link>

            <Link to="/cart" onClick={() => setIsMenuOpen(false)}>
              <Button variant="ghost" className="w-full justify-start relative">
                <ShoppingCart className="h-5 w-5 mr-2" />
                Carrinho
                {cartItemCount > 0 && (
                  <span className="absolute right-4 bg-accent text-accent-foreground text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {cartItemCount}
                  </span>
                )}
              </Button>
            </Link>

            {/* Área do Usuário - Mobile */}
            {isAuthenticated ? (
              <>
                <div className="pt-3 border-t border-border">
                  <div className="px-2 py-2 text-sm text-muted-foreground">
                    Logado como: {user?.name}
                  </div>
                  <Link to="/profile" onClick={() => setIsMenuOpen(false)}>
                    <Button variant="ghost" className="w-full justify-start">
                      <User className="h-4 w-4 mr-2" />
                      Meu Perfil
                    </Button>
                  </Link>
                  <Button 
                    variant="ghost" 
                    className="w-full justify-start text-destructive"
                    onClick={handleLogout}
                  >
                    <LogOut className="h-4 w-4 mr-2" />
                    Sair
                  </Button>
                </div>
              </>
            ) : (
              <div className="pt-3 border-t border-border">
                <Link to="/auth" onClick={() => setIsMenuOpen(false)}>
                  <Button className="w-full bg-primary hover:bg-primary/90">
                    Entrar
                  </Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;