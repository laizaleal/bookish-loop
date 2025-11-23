import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Download, TrendingUp, DollarSign, ShoppingBag, Users, TrendingDown } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from "recharts";
import { useAdminBooks } from "@/hooks/useAdminBooks";
import { useState, useMemo, useRef } from "react";
import { useToast } from "@/hooks/use-toast";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

const AdminReports = () => {
  const { books } = useAdminBooks();
  const [period, setPeriod] = useState("6months");
  const [isExporting, setIsExporting] = useState(false);
  const { toast } = useToast();
  const reportRef = useRef<HTMLDivElement>(null);

  // Dados simulados baseados nos livros reais
  const salesData = useMemo(() => {
    const months = ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun", "Jul", "Ago", "Set", "Out", "Nov", "Dez"];
    const currentMonth = new Date().getMonth();
    
    return months.slice(0, 6).map((month, index) => {
      const monthIndex = (currentMonth - 5 + index + 12) % 12;
      const baseSales = books.length * 2 + Math.random() * 10;
      const sales = Math.floor(baseSales + (index * 3));
      const revenue = sales * 45; // Preço médio estimado
      
      return {
        month,
        vendas: revenue,
        livros: sales,
        mes: monthIndex
      };
    });
  }, [books, period]);

  const topBooks = useMemo(() => {
    return books
      .slice(0, 5)
      .map((book, index) => ({
        title: book.title.length > 20 ? book.title.substring(0, 20) + "..." : book.title,
        vendas: Math.floor(Math.random() * 20) + 5, // Vendas simuladas
        receita: (Math.floor(Math.random() * 20) + 5) * book.price,
      }))
      .sort((a, b) => b.vendas - a.vendas);
  }, [books]);

  const categoryData = useMemo(() => {
    const categories: { [key: string]: number } = {};
    
    books.forEach(book => {
      const category = book.category || "Outros";
      categories[category] = (categories[category] || 0) + 1;
    });

    return Object.entries(categories).map(([name, value], index) => ({
      name,
      value,
      color: COLORS[index % COLORS.length]
    }));
  }, [books]);

  // KPIs calculados
  const kpis = useMemo(() => {
    const totalRevenue = salesData.reduce((sum, month) => sum + month.vendas, 0);
    const totalBooksSold = salesData.reduce((sum, month) => sum + month.livros, 0);
    const averageTicket = totalBooksSold > 0 ? totalRevenue / totalBooksSold : 0;
    const revenueGrowth = salesData.length > 1 ? 
      ((salesData[salesData.length - 1].vendas - salesData[salesData.length - 2].vendas) / salesData[salesData.length - 2].vendas) * 100 : 0;

    return {
      totalRevenue,
      totalBooksSold,
      averageTicket,
      revenueGrowth,
      newCustomers: Math.floor(totalBooksSold * 0.3) // Estimativa
    };
  }, [salesData]);

  const handleExportPDF = async () => {
    if (!reportRef.current) return;

    setIsExporting(true);
    
    try {
      const canvas = await html2canvas(reportRef.current, {
        scale: 2,
        useCORS: true,
        logging: false,
      });

      const imgData = canvas.toDataURL('image/png');
      
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      
      pdf.setFontSize(20);
      pdf.setTextColor(40, 40, 40);
      pdf.text('Relatório de Vendas - ReBook', pdfWidth / 2, 20, { align: 'center' });
      
      pdf.setFontSize(12);
      pdf.setTextColor(100, 100, 100);
      pdf.text(`Gerado em: ${new Date().toLocaleDateString('pt-BR')}`, pdfWidth / 2, 28, { align: 'center' });
      
      const imgWidth = pdfWidth - 20;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      
      let heightLeft = imgHeight;
      let position = 40;
      let page = 1;

      pdf.addImage(imgData, 'PNG', 10, position, imgWidth, imgHeight);
      heightLeft -= (pdfHeight - position - 10);

      while (heightLeft >= 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        page++;
        pdf.addImage(imgData, 'PNG', 10, position, imgWidth, imgHeight);
        heightLeft -= pdfHeight;
      }

      const totalPages = pdf.getNumberOfPages();
      for (let i = 1; i <= totalPages; i++) {
        pdf.setPage(i);
        pdf.setFontSize(10);
        pdf.setTextColor(150, 150, 150);
        pdf.text(`Página ${i} de ${totalPages}`, pdfWidth / 2, pdfHeight - 10, { align: 'center' });
      }

      pdf.save(`relatorio-rebook-${new Date().toISOString().split('T')[0]}.pdf`);
      
      toast({
        title: "Relatório exportado!",
        description: "O relatório foi baixado em formato PDF.",
      });
    } catch (error) {
      console.error('Erro ao exportar PDF:', error);
      toast({
        title: "Erro ao exportar",
        description: "Não foi possível exportar o relatório. Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setIsExporting(false);
    }
  };

  const inventoryStats = useMemo(() => {
    const totalStock = books.reduce((acc, book) => acc + book.stock, 0);
    const lowStockCount = books.filter(book => book.stock < 3 && book.stock > 0).length;
    const outOfStockCount = books.filter(book => book.stock === 0).length;
    const totalValue = books.reduce((acc, book) => acc + (book.price * book.stock), 0);

    return {
      totalStock,
      lowStockCount,
      outOfStockCount,
      totalValue
    };
  }, [books]);

  return (
    <div className="space-y-4 p-3 sm:p-4 md:p-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
        <div className="flex-1 min-w-0">
          <h2 className="text-xl sm:text-2xl md:text-3xl font-serif font-bold truncate">Relatórios de Vendas</h2>
          <p className="text-xs sm:text-sm text-muted-foreground mt-1">
            Acompanhe o desempenho da sua loja com dados em tempo real
          </p>
        </div>
        <div className="flex flex-col xs:flex-row gap-2 w-full sm:w-auto">
          <Select value={period} onValueChange={setPeriod}>
            <SelectTrigger className="w-full xs:w-[140px] sm:w-[160px] text-sm">
              <SelectValue placeholder="Período" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1month" className="text-sm">Último mês</SelectItem>
              <SelectItem value="3months" className="text-sm">Últimos 3 meses</SelectItem>
              <SelectItem value="6months" className="text-sm">Últimos 6 meses</SelectItem>
              <SelectItem value="1year" className="text-sm">Último ano</SelectItem>
            </SelectContent>
          </Select>
          <Button 
            onClick={handleExportPDF} 
            disabled={isExporting} 
            className="w-full xs:w-auto text-sm"
            size="sm"
          >
            <Download className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
            {isExporting ? "Exportando..." : "Exportar PDF"}
          </Button>
        </div>
      </div>

      {/* Conteúdo do relatório com ref para exportação */}
      <div ref={reportRef} className="space-y-4 sm:space-y-6">
        {/* KPI Cards */}
        <div className="grid grid-cols-1 xs:grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-3">
          <Card className="min-w-0">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 p-3 sm:p-4">
              <CardTitle className="text-xs sm:text-sm font-medium">Receita Total</CardTitle>
              <DollarSign className="h-3 w-3 sm:h-4 sm:w-4 text-primary" />
            </CardHeader>
            <CardContent className="p-3 sm:p-4 pt-0">
              <div className="text-base sm:text-lg md:text-xl font-bold truncate">
                R$ {kpis.totalRevenue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
              </div>
              <p className={`text-xs flex items-center mt-1 ${
                kpis.revenueGrowth >= 0 ? 'text-primary' : 'text-destructive'
              }`}>
                {kpis.revenueGrowth >= 0 ? (
                  <TrendingUp className="h-3 w-3 mr-1 flex-shrink-0" />
                ) : (
                  <TrendingDown className="h-3 w-3 mr-1 flex-shrink-0" />
                )}
                {Math.abs(kpis.revenueGrowth).toFixed(1)}% vs período anterior
              </p>
            </CardContent>
          </Card>

          <Card className="min-w-0">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 p-3 sm:p-4">
              <CardTitle className="text-xs sm:text-sm font-medium">Livros Vendidos</CardTitle>
              <ShoppingBag className="h-3 w-3 sm:h-4 sm:w-4 text-accent" />
            </CardHeader>
            <CardContent className="p-3 sm:p-4 pt-0">
              <div className="text-base sm:text-lg md:text-xl font-bold">{kpis.totalBooksSold}</div>
              <p className="text-xs text-muted-foreground flex items-center mt-1">
                <TrendingUp className="h-3 w-3 mr-1 text-accent flex-shrink-0" />
                +{(kpis.totalBooksSold * 0.15).toFixed(0)}% vs período anterior
              </p>
            </CardContent>
          </Card>

          <Card className="min-w-0">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 p-3 sm:p-4">
              <CardTitle className="text-xs sm:text-sm font-medium">Ticket Médio</CardTitle>
              <DollarSign className="h-3 w-3 sm:h-4 sm:w-4 text-primary" />
            </CardHeader>
            <CardContent className="p-3 sm:p-4 pt-0">
              <div className="text-base sm:text-lg md:text-xl font-bold truncate">
                R$ {kpis.averageTicket.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
              </div>
              <p className="text-xs text-muted-foreground flex items-center mt-1">
                <TrendingUp className="h-3 w-3 mr-1 text-primary flex-shrink-0" />
                +4.1% vs período anterior
              </p>
            </CardContent>
          </Card>

          <Card className="min-w-0">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 p-3 sm:p-4">
              <CardTitle className="text-xs sm:text-sm font-medium">Novos Clientes</CardTitle>
              <Users className="h-3 w-3 sm:h-4 sm:w-4 text-accent" />
            </CardHeader>
            <CardContent className="p-3 sm:p-4 pt-0">
              <div className="text-base sm:text-lg md:text-xl font-bold">{kpis.newCustomers}</div>
              <p className="text-xs text-muted-foreground flex items-center mt-1">
                <TrendingUp className="h-3 w-3 mr-1 text-accent flex-shrink-0" />
                +15.3% vs período anterior
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 sm:gap-4 md:gap-6">
          <Card className="min-w-0">
            <CardHeader className="p-3 sm:p-4 md:p-6">
              <CardTitle className="text-base sm:text-lg md:text-xl">Receita Mensal</CardTitle>
              <CardDescription className="text-xs sm:text-sm">Evolução da receita nos últimos meses</CardDescription>
            </CardHeader>
            <CardContent className="p-3 sm:p-4 md:p-6 pt-0">
              <div className="h-48 sm:h-56 md:h-64 lg:h-72">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={salesData}>
                    <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                    <XAxis dataKey="month" className="text-xs" />
                    <YAxis className="text-xs" />
                    <Tooltip 
                      formatter={(value) => [`R$ ${Number(value).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`, "Receita"]}
                      contentStyle={{ 
                        backgroundColor: "hsl(var(--card))",
                        border: "1px solid hsl(var(--border))",
                        borderRadius: "8px",
                        fontSize: "12px"
                      }}
                    />
                    <Bar dataKey="vendas" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          <Card className="min-w-0">
            <CardHeader className="p-3 sm:p-4 md:p-6">
              <CardTitle className="text-base sm:text-lg md:text-xl">Livros Vendidos</CardTitle>
              <CardDescription className="text-xs sm:text-sm">Evolução das vendas nos últimos meses</CardDescription>
            </CardHeader>
            <CardContent className="p-3 sm:p-4 md:p-6 pt-0">
              <div className="h-48 sm:h-56 md:h-64 lg:h-72">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={salesData}>
                    <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                    <XAxis dataKey="month" className="text-xs" />
                    <YAxis className="text-xs" />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: "hsl(var(--card))",
                        border: "1px solid hsl(var(--border))",
                        borderRadius: "8px",
                        fontSize: "12px"
                      }}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="livros" 
                      stroke="hsl(var(--accent))" 
                      strokeWidth={2}
                      dot={{ fill: "hsl(var(--accent))", r: 3 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 sm:gap-4 md:gap-6">
          {/* Top Books Table */}
          <Card className="min-w-0">
            <CardHeader className="p-3 sm:p-4 md:p-6">
              <CardTitle className="text-base sm:text-lg md:text-xl">Livros Mais Vendidos</CardTitle>
              <CardDescription className="text-xs sm:text-sm">Top 5</CardDescription>
            </CardHeader>
            <CardContent className="p-3 sm:p-4 md:p-6 pt-0">
              <div className="overflow-x-auto">
                <table className="w-full min-w-[280px]">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="text-left py-2 px-2 font-medium text-xs">Pos</th>
                      <th className="text-left py-2 px-2 font-medium text-xs">Título</th>
                      <th className="text-center py-2 px-2 font-medium text-xs">Vendas</th>
                      <th className="text-right py-2 px-2 font-medium text-xs">Receita</th>
                    </tr>
                  </thead>
                  <tbody>
                    {topBooks.map((book, index) => (
                      <tr key={book.title} className="border-b border-border hover:bg-muted/50 transition-colors">
                        <td className="py-2 px-2">
                          <div className="flex items-center justify-center w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-primary/10 text-primary font-bold text-xs">
                            {index + 1}
                          </div>
                        </td>
                        <td className="py-2 px-2 font-medium text-xs truncate max-w-[80px] sm:max-w-[120px]" title={book.title}>
                          {book.title}
                        </td>
                        <td className="py-2 px-2 text-center text-xs">{book.vendas}</td>
                        <td className="py-2 px-2 text-right font-semibold text-primary text-xs whitespace-nowrap">
                          R$ {book.receita.toFixed(2)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>

          {/* Categories Chart */}
          <Card className="min-w-0">
            <CardHeader className="p-3 sm:p-4 md:p-6">
              <CardTitle className="text-base sm:text-lg md:text-xl">Distribuição por Categoria</CardTitle>
              <CardDescription className="text-xs sm:text-sm">Proporção de livros por categoria</CardDescription>
            </CardHeader>
            <CardContent className="p-3 sm:p-4 md:p-6 pt-0">
              <div className="h-48 sm:h-56 md:h-64 lg:h-72">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={categoryData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${(percent * 100).toFixed(0)}%`}
                      outerRadius={60}
                      innerRadius={30}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {categoryData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip 
                      formatter={(value, name) => [value, name]}
                      contentStyle={{ 
                        backgroundColor: "hsl(var(--card))",
                        border: "1px solid hsl(var(--border))",
                        borderRadius: "8px",
                        fontSize: "12px"
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="mt-3 flex flex-wrap gap-2 justify-center">
                {categoryData.map((entry, index) => (
                  <div key={entry.name} className="flex items-center text-xs">
                    <div 
                      className="w-3 h-3 rounded-sm mr-1" 
                      style={{ backgroundColor: entry.color }}
                    />
                    <span className="truncate max-w-[80px]">{entry.name}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Inventory Summary */}
        <Card className="min-w-0">
          <CardHeader className="p-3 sm:p-4 md:p-6">
            <CardTitle className="text-base sm:text-lg md:text-xl">Resumo do Estoque</CardTitle>
            <CardDescription className="text-xs sm:text-sm">Visão geral do inventário atual</CardDescription>
          </CardHeader>
          <CardContent className="p-3 sm:p-4 md:p-6 pt-0">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3">
              <div className="text-center p-2 sm:p-3 bg-primary/10 rounded-lg">
                <div className="text-base sm:text-lg md:text-xl font-bold text-primary">{books.length}</div>
                <div className="text-xs text-muted-foreground">Total de Livros</div>
              </div>
              <div className="text-center p-2 sm:p-3 bg-accent/10 rounded-lg">
                <div className="text-base sm:text-lg md:text-xl font-bold text-accent">
                  {inventoryStats.totalStock}
                </div>
                <div className="text-xs text-muted-foreground">Unidades em Estoque</div>
              </div>
              <div className="text-center p-2 sm:p-3 bg-yellow-100 rounded-lg">
                <div className="text-base sm:text-lg md:text-xl font-bold text-yellow-700">
                  {inventoryStats.lowStockCount}
                </div>
                <div className="text-xs text-muted-foreground">Estoque Baixo</div>
              </div>
              <div className="text-center p-2 sm:p-3 bg-destructive/10 rounded-lg">
                <div className="text-base sm:text-lg md:text-xl font-bold text-destructive">
                  {inventoryStats.outOfStockCount}
                </div>
                <div className="text-xs text-muted-foreground">Fora de Estoque</div>
              </div>
            </div>
            
            <div className="mt-3 sm:mt-4 p-3 sm:p-4 bg-green-50 rounded-lg border border-green-200">
              <div className="text-center">
                <div className="text-base sm:text-lg md:text-xl font-bold text-green-700">
                  R$ {inventoryStats.totalValue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </div>
                <div className="text-xs text-muted-foreground">Valor Total do Estoque</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Condition Distribution */}
        <Card className="min-w-0">
          <CardHeader className="p-3 sm:p-4 md:p-6">
            <CardTitle className="text-base sm:text-lg md:text-xl">Distribuição por Condição</CardTitle>
            <CardDescription className="text-xs sm:text-sm">Estado dos livros no estoque</CardDescription>
          </CardHeader>
          <CardContent className="p-3 sm:p-4 md:p-6 pt-0">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3">
              {Object.entries(
                books.reduce((acc, book) => {
                  acc[book.condition] = (acc[book.condition] || 0) + 1;
                  return acc;
                }, {} as Record<string, number>)
              ).map(([condition, count]) => (
                <div key={condition} className="text-center p-2 sm:p-3 bg-card rounded-lg border border-border">
                  <div className="text-base sm:text-lg md:text-xl font-bold text-primary">{count}</div>
                  <div className="text-xs text-muted-foreground truncate" title={condition}>
                    {condition}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminReports;