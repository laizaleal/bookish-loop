// src/components/Invoice.tsx
import { useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download, Printer, ArrowLeft } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

// Tipo local para evitar problemas de importação
interface CartItem {
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
}

interface Cart {
  id: string;
  items: CartItem[];
  total: number;
  subtotal: number;
  shipping: number;
}

interface InvoiceProps {
  orderId: string;
  cart: Cart;
  onBack: () => void;
}

const Invoice = ({ orderId, cart, onBack }: InvoiceProps) => {
  const { toast } = useToast();
  const invoiceRef = useRef<HTMLDivElement>(null);

  // Dados da empresa (fictícios)
  const companyInfo = {
    name: "ReBook Livraria",
    cnpj: "12.345.678/0001-90",
    address: "Rua dos Livros, 123 - Centro, São Paulo - SP",
    phone: "(11) 9999-9999",
    email: "contato@rebook.com.br"
  };

  // Data de emissão
  const issueDate = new Date().toLocaleDateString('pt-BR');
  const issueTime = new Date().toLocaleTimeString('pt-BR', { 
    hour: '2-digit', 
    minute: '2-digit' 
  });

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadPDF = async () => {
    if (!invoiceRef.current) return;

    try {
      const canvas = await html2canvas(invoiceRef.current, {
        scale: 2,
        useCORS: true,
        logging: false,
      });

      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      pdf.save(`nota-fiscal-${orderId}.pdf`);

      toast({
        title: "PDF baixado!",
        description: "A nota fiscal foi salva em PDF.",
      });
    } catch (error) {
      console.error('Erro ao gerar PDF:', error);
      toast({
        title: "Erro",
        description: "Não foi possível gerar o PDF.",
        variant: "destructive",
      });
    }
  };

  // Se não tiver cart, mostra mensagem de erro
  if (!cart) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card>
          <CardContent className="pt-6">
            <p>Erro ao carregar nota fiscal.</p>
            <Button onClick={onBack} className="mt-4">
              Voltar
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background print:bg-white">
      {/* Controles - esconder na impressão */}
      <div className="container mx-auto px-4 py-6 print:hidden">
        <div className="flex justify-between items-center mb-6">
          <Button variant="outline" onClick={onBack}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Voltar para o Carrinho
          </Button>
          <div className="flex gap-2">
            <Button variant="outline" onClick={handlePrint}>
              <Printer className="w-4 h-4 mr-2" />
              Imprimir
            </Button>
            <Button onClick={handleDownloadPDF}>
              <Download className="w-4 h-4 mr-2" />
              Baixar PDF
            </Button>
          </div>
        </div>
      </div>

      {/* Nota Fiscal */}
      <div ref={invoiceRef} className="container mx-auto px-4 py-6 print:px-0 print:py-0">
        <Card className="print:shadow-none print:border-0">
          <CardContent className="p-6 print:p-8">
            {/* Cabeçalho */}
            <div className="text-center mb-8 border-b pb-6 print:pb-4">
              <h1 className="text-3xl font-bold text-primary mb-2">ReBook Livraria</h1>
              <p className="text-muted-foreground">{companyInfo.address}</p>
              <p className="text-muted-foreground">
                CNPJ: {companyInfo.cnpj} | Tel: {companyInfo.phone}
              </p>
            </div>

            {/* Informações da Nota */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <div>
                <h3 className="font-semibold text-lg mb-4">Dados da Nota Fiscal</h3>
                <div className="space-y-2">
                  <p><strong>Nº do Pedido:</strong> {orderId}</p>
                  <p><strong>Data de Emissão:</strong> {issueDate}</p>
                  <p><strong>Hora:</strong> {issueTime}</p>
                </div>
              </div>
              
              <div>
                <h3 className="font-semibold text-lg mb-4">Informações do Cliente</h3>
                <div className="space-y-2">
                  <p><strong>Nome:</strong> Cliente ReBook</p>
                  <p><strong>CPF:</strong> 123.456.789-00</p>
                  <p><strong>Email:</strong> cliente@rebook.com.br</p>
                </div>
              </div>
            </div>

            {/* Itens da Compra */}
            <div className="mb-8">
              <h3 className="font-semibold text-lg mb-4">Itens da Compra</h3>
              <div className="border rounded-lg overflow-hidden">
                <table className="w-full">
                  <thead className="bg-muted">
                    <tr>
                      <th className="text-left p-3 font-semibold">Descrição</th>
                      <th className="text-center p-3 font-semibold">Qtd</th>
                      <th className="text-right p-3 font-semibold">Valor Unit.</th>
                      <th className="text-right p-3 font-semibold">Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    {cart.items.map((item, index) => (
                      <tr key={item.id} className={index % 2 === 0 ? 'bg-background' : 'bg-muted/30'}>
                        <td className="p-3">
                          <div>
                            <p className="font-medium">{item.book.title}</p>
                            <p className="text-sm text-muted-foreground">
                              {item.book.author} • {item.book.condition}
                            </p>
                          </div>
                        </td>
                        <td className="p-3 text-center">{item.quantity}</td>
                        <td className="p-3 text-right">R$ {item.book.price.toFixed(2)}</td>
                        <td className="p-3 text-right font-semibold">
                          R$ {(item.book.price * item.quantity).toFixed(2)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Resumo Financeiro */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <div>
                <h3 className="font-semibold text-lg mb-4">Resumo do Pagamento</h3>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Subtotal:</span>
                    <span>R$ {cart.subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Frete:</span>
                    <span>{cart.shipping === 0 ? 'Grátis' : `R$ ${cart.shipping.toFixed(2)}`}</span>
                  </div>
                  <div className="flex justify-between border-t pt-2 font-bold text-lg">
                    <span>Total:</span>
                    <span className="text-primary">R$ {cart.total.toFixed(2)}</span>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="font-semibold text-lg mb-4">Informações de Pagamento</h3>
                <div className="space-y-2">
                  <p><strong>Forma de Pagamento:</strong> PIX</p>
                  <p><strong>Status:</strong> ✅ Pagamento Aprovado</p>
                  <p><strong>Data do Pagamento:</strong> {issueDate}</p>
                </div>
              </div>
            </div>

            {/* Rodapé */}
            <div className="border-t pt-6 text-center text-muted-foreground">
              <p className="mb-2">
                🎉 Obrigado por comprar na ReBook! Sua compra ajuda a promover a sustentabilidade.
              </p>
              <p className="text-sm">
                Em caso de dúvidas, entre em contato: {companyInfo.email} | {companyInfo.phone}
              </p>
              <p className="text-xs mt-4">
                Esta nota fiscal foi gerada automaticamente e não necessita de assinatura.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Estilos para impressão */}
      <style>{`
        @media print {
          body {
            background: white !important;
          }
          .print\\:hidden {
            display: none !important;
          }
          .print\\:px-0 {
            padding-left: 0 !important;
            padding-right: 0 !important;
          }
          .print\\:py-0 {
            padding-top: 0 !important;
            padding-bottom: 0 !important;
          }
          .print\\:p-8 {
            padding: 2rem !important;
          }
          .print\\:shadow-none {
            box-shadow: none !important;
          }
          .print\\:border-0 {
            border: none !important;
          }
          .print\\:pb-4 {
            padding-bottom: 1rem !important;
          }
        }
      `}</style>
    </div>
  );
};

export default Invoice;