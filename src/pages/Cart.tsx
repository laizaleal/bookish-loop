// src/pages/Cart.tsx
import { useState } from "react";
import { Link } from "react-router-dom";
import { Trash2, Plus, Minus, ShoppingBag, CreditCard, FileText } from "lucide-react";
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
import Invoice from "@/components/Invoice";

// Se houver erro na importação, use este tipo local como fallback
interface Cart {
  id: string;
  items: Array<{
    id: string;
    book: {
      id: string;
      title: string;
      author: string;
      publisher: string;
      price: number;
      originalPrice?: number;
      condition: string;
      imageUrl: string;
      stock: number;
      isbn?: string;
      description?: string;
      category?: string;
    };
    quantity: number;
  }>;
  total: number;
  subtotal: number;
  shipping: number;
}

const Cart = () => {
  const { cart, loading, updateQuantity, removeFromCart, finalizePurchase } = useCart();
  const [showCheckout, setShowCheckout] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showInvoice, setShowInvoice] = useState(false);
  const [orderId, setOrderId] = useState("");
  const [purchasedCart, setPurchasedCart] = useState<Cart | null>(null);
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
      const result = await finalizePurchase();
      
      setOrderId(result.orderId);
      setPurchasedCart(result.cart);
      setShowCheckout(false);
      setShowSuccess(true);
    } catch (error) {
      toast({
        title: "Erro ao finalizar compra",
        description: error instanceof Error ? error.message : "Erro ao processar pagamento",
        variant: "destructive",
      });
    }
  };

  const handleViewInvoice = () => {
    setShowInvoice(true);
    setShowSuccess(false);
  };

  const handleBackFromInvoice = () => {
    setShowInvoice(false);
    setPurchasedCart(null);
  };

  const handleContinueShopping = () => {
    setShowSuccess(false);
    setPurchasedCart(null);
  };

  // Se estiver mostrando a nota fiscal E temos um carrinho comprado
  if (showInvoice && purchasedCart) {
    return <Invoice orderId={orderId} cart={purchasedCart} onBack={handleBackFromInvoice} />;
  }

  // Se o carrinho atual estiver vazio MAS temos uma compra recente
  if ((!cart || cart.items.length === 0) && !purchasedCart && !showSuccess) {
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

  // Carrinho atual (antes da compra) ou carrinho comprado (após a compra)
  const currentCart = purchasedCart || cart;

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 container mx-auto px-4 py-12">
        <h1 className="text-4xl font-serif font-bold mb-8">
          {purchasedCart ? "Compra Finalizada! 🎉" : "Meu Carrinho"}
        </h1>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {currentCart?.items.map(item => (
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
                        {!purchasedCart && (
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleRemoveItem(item.id)}
                            disabled={loading}
                          >
                            <Trash2 className="w-4 h-4 text-destructive" />
                          </Button>
                        )}
                      </div>

                      <div className="flex items-center justify-between mt-4">
                        <div className="flex items-center gap-3">
                          {!purchasedCart ? (
                            <>
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
                            </>
                          ) : (
                            <span className="text-lg font-medium">Qtd: {item.quantity}</span>
                          )}
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
                <CardTitle>
                  {purchasedCart ? "Resumo da Compra" : "Resumo do Pedido"}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Subtotal ({currentCart?.items.reduce((sum, item) => sum + item.quantity, 0)} itens)</span>
                  <span>R$ {currentCart?.subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Frete</span>
                  <span>{currentCart?.shipping === 0 ? "Grátis" : `R$ ${currentCart?.shipping.toFixed(2)}`}</span>
                </div>
                {currentCart?.shipping === 0 && (
                  <p className="text-xs text-green-600">
                    🎉 Você ganhou frete grátis!
                  </p>
                )}
                {!purchasedCart && currentCart && currentCart.subtotal < 100 && currentCart.subtotal > 0 && (
                  <p className="text-xs text-muted-foreground">
                    Faltam R$ {(100 - currentCart.subtotal).toFixed(2)} para frete grátis
                  </p>
                )}
                <Separator />
                <div className="flex justify-between text-lg font-bold">
                  <span>Total</span>
                  <span className="text-primary">R$ {currentCart?.total.toFixed(2)}</span>
                </div>
              </CardContent>
              <CardFooter>
                {!purchasedCart ? (
                  <Button 
                    className="w-full" 
                    size="lg" 
                    onClick={handleCheckout}
                    disabled={loading}
                  >
                    <CreditCard className="w-4 h-4 mr-2" />
                    {loading ? "Processando..." : "Finalizar Compra"}
                  </Button>
                ) : (
                  <div className="w-full space-y-2">
                    <Button 
                      className="w-full" 
                      size="lg"
                      onClick={handleViewInvoice}
                    >
                      <FileText className="w-4 h-4 mr-2" />
                      Ver Nota Fiscal
                    </Button>
                    <Link to="/catalog" className="w-full">
                      <Button variant="outline" className="w-full" size="lg">
                        Continuar Comprando
                      </Button>
                    </Link>
                  </div>
                )}
              </CardFooter>
            </Card>

            <Card className="mt-4">
              <CardContent className="p-4">
                <p className="text-sm text-muted-foreground">
                  💚 Comprando livros usados, você contribui para um futuro mais sustentável
                </p>
                {purchasedCart && (
                  <p className="text-sm text-green-600 mt-2">
                    ✅ Estoque atualizado com sucesso!
                  </p>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </main>

      {/* Checkout Dialog - Só aparece se não for compra finalizada */}
      {!purchasedCart && (
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
                    <div className="text-2xl font-bold">R$ {currentCart?.total.toFixed(2)}</div>
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
      )}

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
            <p className="text-sm text-muted-foreground mb-2">
              <strong>Nº do Pedido:</strong> {orderId}
            </p>
            <p className="text-sm text-muted-foreground">
              Sua compra foi finalizada com sucesso!
            </p>
            <p className="text-xs text-green-600 mt-2">
              ✅ Estoque atualizado com sucesso!
            </p>
          </div>
          <div className="flex gap-2">
            <Button 
              className="flex-1" 
              onClick={() => {
                setShowSuccess(false);
                setShowInvoice(true);
              }}
            >
              <FileText className="w-4 h-4 mr-2" />
              Ver Nota Fiscal
            </Button>
            <Button 
              variant="outline" 
              className="flex-1"
              onClick={handleContinueShopping}
            >
              Continuar Comprando
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <Footer />
    </div>
  );
};

export default Cart;