// src/pages/Profile.tsx
import { useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/hooks/useAuth";
import { User, Mail, Calendar, Heart, ShoppingCart, BookOpen } from "lucide-react";

const Profile = () => {
  const { user } = useAuth();
  const [isEditing, setIsEditing] = useState(false);

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
                      defaultValue={user.name}
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
                      defaultValue={user.email}
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
                    <Button onClick={() => setIsEditing(false)} variant="outline">
                      Cancelar
                    </Button>
                    <Button className="bg-primary hover:bg-primary/90">
                      Salvar Alterações
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

          {/* Estatísticas */}
          <Card>
            <CardHeader>
              <CardTitle>Minha Atividade</CardTitle>
              <CardDescription>
                Sua atividade na plataforma ReBook
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center p-4 bg-primary/10 rounded-lg">
                  <div className="text-2xl font-bold text-primary">{user.favorites.length}</div>
                  <div className="text-sm text-muted-foreground">Favoritos</div>
                </div>
                <div className="text-center p-4 bg-accent/10 rounded-lg">
                  <div className="text-2xl font-bold text-accent">0</div>
                  <div className="text-sm text-muted-foreground">Pedidos</div>
                </div>
                <div className="text-center p-4 bg-green-100 rounded-lg">
                  <div className="text-2xl font-bold text-green-700">0</div>
                  <div className="text-sm text-muted-foreground">Livros Lidos</div>
                </div>
                <div className="text-center p-4 bg-purple-100 rounded-lg">
                  <div className="text-2xl font-bold text-purple-700">0</div>
                  <div className="text-sm text-muted-foreground">Avaliações</div>
                </div>
              </div>
            </CardContent>
          </Card>

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
                      {user.favorites.length} livros
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
                      Meus itens
                    </span>
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>

          {/* Favoritos Recentes */}
          {user.favorites.length > 0 && (
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
                    Você tem {user.favorites.length} livro(s) nos favoritos
                  </p>
                  <Link to="/favorites">
                    <Button variant="outline" size="sm">
                      Ver Todos os Favoritos
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Profile;