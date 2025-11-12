// src/pages/Profile.tsx
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/hooks/useAuth";
import { useCart } from "@/hooks/useCart";
import { useFavorites } from "@/hooks/useFavorites";
import { User, Mail, Calendar, Heart, ShoppingCart, BookOpen, Package, Star } from "lucide-react";
import { toast } from "sonner";

const Profile = () => {
  const { user, updateUser } = useAuth();
  const { cart } = useCart();
  const { favoriteCount } = useFavorites();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: ""
  });
  const [isLoading, setIsLoading] = useState(false);

  // Inicializar formData quando o usuário carrega
  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name,
        email: user.email
      });
    }
  }, [user]);

  const handleSave = async () => {
    if (!user) return;

    setIsLoading(true);
    try {
      // Usar a função updateUser do hook useAuth
      await updateUser({
        name: formData.name,
        email: formData.email
      });
      
      toast.success("Perfil atualizado com sucesso!");
      setIsEditing(false);
    } catch (error) {
      console.error('Erro ao atualizar perfil:', error);
      toast.error("Erro ao atualizar perfil. Tente novamente.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    if (user) {
      setFormData({
        name: user.name,
        email: user.email
      });
    }
    setIsEditing(false);
  };

  // Calcular estatísticas - CORRIGIDO
  const cartItemsCount = cart?.items.reduce((total, item) => total + item.quantity, 0) || 0;
  const cartTotal = cartItemsCount > 0 ? (cart?.total || 0) : 0; // Só mostra total se houver itens
  
  // Estatísticas simuladas (em um sistema real, viriam do backend)
  const booksRead = 0;
  const reviewsCount = 0;
  const ordersCount = 0;

  if (!user) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <p className="text-muted-foreground">Usuário não encontrado</p>
            <Link to="/auth">
              <Button className="mt-4">Fazer Login</Button>
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-1 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-serif font-bold mb-2">Meu Perfil</h1>
          <p className="text-muted-foreground">
            Gerencie suas informações pessoais e acompanhe sua atividade
          </p>
        </div>

        <div className="grid gap-6">
          {/* Informações Pessoais */}
          <Card>
            <CardHeader>
              <CardTitle>Informações Pessoais</CardTitle>
              <CardDescription>
                Suas informações de cadastro na plataforma
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center">
                  <User className="h-8 w-8 text-primary-foreground" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg">{user.name}</h3>
                  <p className="text-muted-foreground">{user.email}</p>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4 pt-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Nome completo</Label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      disabled={!isEditing}
                      className="pl-10"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({...formData, email: e.target.value})}
                      disabled={!isEditing}
                      className="pl-10"
                    />
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Calendar className="h-4 w-4" />
                <span>Membro desde {new Date(user.createdAt).toLocaleDateString('pt-BR')}</span>
              </div>

              <div className="flex gap-3 pt-4">
                {isEditing ? (
                  <>
                    <Button 
                      onClick={handleCancel} 
                      variant="outline"
                      disabled={isLoading}
                    >
                      Cancelar
                    </Button>
                    <Button 
                      onClick={handleSave}
                      className="bg-primary hover:bg-primary/90"
                      disabled={isLoading || !formData.name.trim() || !formData.email.trim()}
                    >
                      {isLoading ? "Salvando..." : "Salvar Alterações"}
                    </Button>
                  </>
                ) : (
                  <Button onClick={() => setIsEditing(true)} variant="outline">
                    Editar Perfil
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Estatísticas em Tempo Real */}
          <Card>
            <CardHeader>
              <CardTitle>Minha Atividade</CardTitle>
              <CardDescription>
                Sua atividade atual na plataforma ReBook
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center p-4 bg-primary/10 rounded-lg">
                  <div className="text-2xl font-bold text-primary">{favoriteCount}</div>
                  <div className="text-sm text-muted-foreground">Favoritos</div>
                </div>
                <div className="text-center p-4 bg-accent/10 rounded-lg">
                  <div className="text-2xl font-bold text-accent">{cartItemsCount}</div>
                  <div className="text-sm text-muted-foreground">Itens no Carrinho</div>
                </div>
                <div className="text-center p-4 bg-green-100 rounded-lg">
                  <div className="text-2xl font-bold text-green-700">
                    R$ {cartTotal.toFixed(2)}
                  </div>
                  <div className="text-sm text-muted-foreground">Total no Carrinho</div>
                </div>
                <div className="text-center p-4 bg-purple-100 rounded-lg">
                  <div className="text-2xl font-bold text-purple-700">{ordersCount}</div>
                  <div className="text-sm text-muted-foreground">Pedidos</div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Carrinho Atual - CORRIGIDO: só mostra se houver itens */}
          {cartItemsCount > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Meu Carrinho</CardTitle>
                <CardDescription>
                  Itens atualmente no seu carrinho de compras
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">{cartItemsCount} ite{n(cartItemsCount)}</p>
                      <p className="text-sm text-muted-foreground">
                        Total: R$ {cartTotal.toFixed(2)}
                      </p>
                    </div>
                    <Link to="/cart">
                      <Button size="sm">
                        <ShoppingCart className="h-4 w-4 mr-2" />
                        Ver Carrinho
                      </Button>
                    </Link>
                  </div>
                  
                  {/* Lista rápida dos itens no carrinho */}
                  <div className="space-y-2 max-h-32 overflow-y-auto">
                    {cart?.items.slice(0, 3).map((item) => (
                      <div key={item.id} className="flex items-center gap-3 p-2 bg-secondary/50 rounded-lg">
                        <div className="w-8 h-8 bg-primary/10 rounded flex items-center justify-center">
                          <Package className="h-4 w-4 text-primary" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium truncate">{item.book.title}</p>
                          <p className="text-xs text-muted-foreground">
                            {item.quantity} x R$ {item.book.price.toFixed(2)}
                          </p>
                        </div>
                      </div>
                    ))}
                    {cartItemsCount > 3 && (
                      <p className="text-xs text-muted-foreground text-center">
                        +{cartItemsCount - 3} mais itens...
                      </p>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Ações Rápidas */}
          <Card>
            <CardHeader>
              <CardTitle>Ações Rápidas</CardTitle>
              <CardDescription>
                Acesse rapidamente as principais funcionalidades
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                <Link to="/favorites">
                  <Button variant="outline" className="w-full h-auto p-4 flex flex-col gap-2">
                    <Heart className="h-6 w-6" />
                    <span>Meus Favoritos</span>
                    <span className="text-xs text-muted-foreground">
                      {favoriteCount} livro{favoriteCount !== 1 ? 's' : ''}
                    </span>
                  </Button>
                </Link>
                
                <Link to="/catalog">
                  <Button variant="outline" className="w-full h-auto p-4 flex flex-col gap-2">
                    <BookOpen className="h-6 w-6" />
                    <span>Continuar Comprando</span>
                    <span className="text-xs text-muted-foreground">
                      Explorar catálogo
                    </span>
                  </Button>
                </Link>
                
                <Link to="/cart">
                  <Button variant="outline" className="w-full h-auto p-4 flex flex-col gap-2">
                    <ShoppingCart className="h-6 w-6" />
                    <span>Ver Carrinho</span>
                    <span className="text-xs text-muted-foreground">
                      {cartItemsCount} ite{n(cartItemsCount)}
                    </span>
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>

          {/* Favoritos Recentes */}
          {favoriteCount > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Meus Favoritos</CardTitle>
                <CardDescription>
                  Livros que você marcou como favoritos
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground">
                    Você tem {favoriteCount} livro{favoriteCount !== 1 ? 's' : ''} nos favoritos
                  </p>
                  <Link to="/favorites">
                    <Button variant="outline" size="sm">
                      <Heart className="h-4 w-4 mr-2" />
                      Ver Todos os Favoritos
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Histórico (Placeholder para futuras implementações) */}
          <Card>
            <CardHeader>
              <CardTitle>Histórico de Atividade</CardTitle>
              <CardDescription>
                Sua atividade recente na plataforma
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <Star className="h-12 w-12 text-muted-foreground/50 mx-auto mb-4" />
                <p className="text-muted-foreground mb-2">
                  Em breve: histórico completo de sua atividade
                </p>
                <p className="text-sm text-muted-foreground">
                  Visualize seus pedidos, avaliações e muito mais
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>

      <Footer />
    </div>
  );
};

// Função helper para pluralização
function n(count: number): string {
  return count !== 1 ? 'ns' : 'm';
}

export default Profile;