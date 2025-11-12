import { useState } from "react";
import { Link } from "react-router-dom";
import { Trash2, Plus, Minus, ShoppingBag, CreditCard } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useCart } from "@/hooks/useCart";
import { useToast } from "@/hooks/use-toast";

const Cart = () => {
  const { cart, loading, updateQuantity, removeFromCart, clearCart } = useCart();
  const [showCheckout, setShowCheckout] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const { toast } = useToast();

  const handleUpdateQuantity = async (itemId: string, newQuantity: number) => {
    try {
      await updateQuantity(itemId, newQuantity);
      toast({
        title: "Carrinho atualizado!",
        description: "Quantidade alterada com sucesso.",
      });
    } catch (error) {
      toast({
        title: "Erro",
        description: error instanceof Error ? error.message : "Erro ao atualizar quantidade",
        variant: "destructive",
      });
    }
  };

  const handleRemoveItem = async (itemId: string) => {
    try {
      await removeFromCart(itemId);
      toast({
        title: "Item removido",
        description: "O livro foi removido do carrinho.",
      });
    } catch (error) {
      toast({
        title: "Erro",
        description: error instanceof Error ? error.message : "Erro ao remover item",
        variant: "destructive",
      });
    }
  };

  const handleCheckout = () => {
    setShowCheckout(true);
  };

  const handlePayment = async () => {
    try {
      await clearCart();
      setShowCheckout(false);
      setShowSuccess(true);
      setTimeout(() => {
        setShowSuccess(false);
        toast({
          title: "Compra finalizada! 🎉",
          description: "Nota fiscal enviada para seu e-mail.",
        });
      }, 3000);
    } catch (error) {
      toast({
        title: "Erro",
        description: error instanceof Error ? error.message : "Erro ao finalizar compra",
        variant: "destructive",
      });
    }
  };

  if (!cart || cart.items.length === 0) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1 container mx-auto px-4 py-12">
          <div className="text-center py-20">
            <ShoppingBag className="w-24 h-24 mx-auto text-muted-foreground mb-6" />
            <h1 className="text-3xl font-serif font-bold mb-4">Seu carrinho está vazio</h1>
            <p className="text-muted-foreground mb-8">
              Adicione alguns livros incríveis ao seu carrinho!
            </p>
            <Link to="/catalog">
              <Button size="lg">Explorar Catálogo</Button>
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
      <main className="flex-1 container mx-auto px-4 py-12">
        <h1 className="text-4xl font-serif font-bold mb-8">Meu Carrinho</h1>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {cart.items.map(item => (
              <Card key={item.id}>
                <CardContent className="p-6">
                  <div className="flex gap-6">
                    <img
                      src={item.book.imageUrl}
                      alt={item.book.title}
                      className="w-24 h-32 object-cover rounded"
                    />
                    <div className="flex-1">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h3 className="font-semibold text-lg">{item.book.title}</h3>
                          <p className="text-sm text-muted-foreground">{item.book.author}</p>
                          <p className="text-xs text-muted-foreground mt-1">
                            Condição: {item.book.condition}
                          </p>
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleRemoveItem(item.id)}
                          disabled={loading}
                        >
                          <Trash2 className="w-4 h-4 text-destructive" />
                        </Button>
                      </div>

                      <div className="flex items-center justify-between mt-4">
                        <div className="flex items-center gap-3">
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={() => handleUpdateQuantity(item.id, item.quantity - 1)}
                            disabled={loading || item.quantity <= 1}
                          >
                            <Minus className="w-4 h-4" />
                          </Button>
                          <span className="w-8 text-center font-medium">{item.quantity}</span>
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={() => handleUpdateQuantity(item.id, item.quantity + 1)}
                            disabled={loading}
                          >
                            <Plus className="w-4 h-4" />
                          </Button>
                        </div>
                        <p className="text-xl font-bold text-primary">
                          R$ {(item.book.price * item.quantity).toFixed(2)}
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Order Summary */}
          <div>
            <Card className="sticky top-24">
              <CardHeader>
                <CardTitle>Resumo do Pedido</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Subtotal ({cart.items.reduce((sum, item) => sum + item.quantity, 0)} itens)</span>
                  <span>R$ {cart.subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Frete</span>
                  <span>{cart.shipping === 0 ? "Grátis" : `R$ ${cart.shipping.toFixed(2)}`}</span>
                </div>
                {cart.shipping === 0 && (
                  <p className="text-xs text-green-600">
                    🎉 Você ganhou frete grátis!
                  </p>
                )}
                {cart.subtotal < 100 && cart.subtotal > 0 && (
                  <p className="text-xs text-muted-foreground">
                    Faltam R$ {(100 - cart.subtotal).toFixed(2)} para frete grátis
                  </p>
                )}
                <Separator />
                <div className="flex justify-between text-lg font-bold">
                  <span>Total</span>
                  <span className="text-primary">R$ {cart.total.toFixed(2)}</span>
                </div>
              </CardContent>
              <CardFooter>
                <Button 
                  className="w-full" 
                  size="lg" 
                  onClick={handleCheckout}
                  disabled={loading}
                >
                  <CreditCard className="w-4 h-4 mr-2" />
                  {loading ? "Processando..." : "Finalizar Compra"}
                </Button>
              </CardFooter>
            </Card>

            <Card className="mt-4">
              <CardContent className="p-4">
                <p className="text-sm text-muted-foreground">
                  💚 Comprando livros usados, você contribui para um futuro mais sustentável
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>

      {/* Checkout Dialog */}
      <Dialog open={showCheckout} onOpenChange={setShowCheckout}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Finalizar Pagamento</DialogTitle>
            <DialogDescription>
              Escaneie o QR Code para realizar o pagamento via PIX
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-6 py-4">
            <div className="bg-white p-8 rounded-lg flex justify-center">
              <div className="w-48 h-48 bg-gray-900 rounded-lg flex items-center justify-center">
                <div className="text-white text-center text-xs">
                  <div className="mb-2">QR CODE PIX</div>
                  <div className="text-2xl font-bold">R$ {cart?.total.toFixed(2)}</div>
                </div>
              </div>
            </div>
            
            <div>
              <Label htmlFor="pix-code">Código PIX (Copia e Cola)</Label>
              <Input
                id="pix-code"
                value="00020126580014br.gov.bcb.pix..."
                readOnly
                className="font-mono text-xs mt-2"
              />
            </div>

            <Button className="w-full" size="lg" onClick={handlePayment} disabled={loading}>
              {loading ? "Processando..." : "Confirmar Pagamento"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Success Dialog */}
      <Dialog open={showSuccess} onOpenChange={setShowSuccess}>
        <DialogContent className="max-w-md text-center">
          <DialogHeader>
            <DialogTitle className="text-2xl">Pagamento Confirmado! 🎉</DialogTitle>
            <DialogDescription>
              Seu pedido foi processado com sucesso
            </DialogDescription>
          </DialogHeader>
          <div className="py-6">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <ShoppingBag className="w-10 h-10 text-green-600" />
            </div>
            <p className="text-sm text-muted-foreground">
              A nota fiscal será enviada para seu e-mail em instantes.
            </p>
          </div>
        </DialogContent>
      </Dialog>

      <Footer />
    </div>
  );
};

export default Cart;