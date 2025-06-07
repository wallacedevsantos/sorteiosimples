
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { List, RotateCcw, Copy, Upload } from "lucide-react";
import confetti from "canvas-confetti";
import { useToast } from "@/hooks/use-toast";

const ListRaffle = () => {
  const [itemsList, setItemsList] = useState<string>("");
  const [quantity, setQuantity] = useState<string>("1");
  const [avoidRepeats, setAvoidRepeats] = useState(true);
  const [isRaffling, setIsRaffling] = useState(false);
  const [results, setResults] = useState<string[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [currentAnimation, setCurrentAnimation] = useState<string>("");
  const [history, setHistory] = useState<{ items: string[]; results: string[]; timestamp: Date }[]>([]);
  const { toast } = useToast();

  const triggerConfetti = () => {
    confetti({
      particleCount: 150,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#10B981', '#F59E0B', '#3B82F6', '#EF4444', '#8B5CF6']
    });
  };

  const getItems = () => {
    return itemsList
      .split('\n')
      .map(item => item.trim())
      .filter(item => item.length > 0);
  };

  const performRaffle = async () => {
    const items = getItems();
    const qty = parseInt(quantity);

    if (items.length === 0) {
      toast({
        title: "Ops! 🤔",
        description: "Por favor, adicione pelo menos um item na lista.",
        variant: "destructive"
      });
      return;
    }

    if (isNaN(qty) || qty < 1) {
      toast({
        title: "Ops! 🤔",
        description: "Por favor, informe quantos itens sortear (mínimo 1).",
        variant: "destructive"
      });
      return;
    }

    if (avoidRepeats && qty > items.length) {
      toast({
        title: "Ops! 🤔",
        description: "Não há itens suficientes na lista para evitar repetições.",
        variant: "destructive"
      });
      return;
    }

    setIsRaffling(true);
    setResults([]);
    setShowModal(true);

    // Animação de suspense com nomes girando
    const animationItems = [...items];
    for (let i = 0; i < 20; i++) {
      const randomItem = animationItems[Math.floor(Math.random() * animationItems.length)];
      setCurrentAnimation(randomItem);
      await new Promise(resolve => setTimeout(resolve, 100));
    }

    let raffleResults: string[] = [];
    let availableItems = [...items];

    for (let i = 0; i < qty; i++) {
      if (avoidRepeats) {
        const randomIndex = Math.floor(Math.random() * availableItems.length);
        raffleResults.push(availableItems[randomIndex]);
        availableItems.splice(randomIndex, 1);
      } else {
        const randomIndex = Math.floor(Math.random() * items.length);
        raffleResults.push(items[randomIndex]);
      }
    }

    setResults(raffleResults);
    setHistory(prev => [...prev, { items: [...items], results: raffleResults, timestamp: new Date() }]);
    setCurrentAnimation("");
    setIsRaffling(false);
    triggerConfetti();
    
    toast({
      title: "🎉 Resultado revelado!",
      description: `Sorteado(s): ${raffleResults.join(', ')}`
    });
  };

  const copyResults = () => {
    navigator.clipboard.writeText(results.join('\n'));
    toast({
      title: "📋 Copiado!",
      description: "Resultado copiado para a área de transferência."
    });
  };

  const resetRaffle = () => {
    setResults([]);
    setIsRaffling(false);
    setCurrentAnimation("");
    setShowModal(false);
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const content = e.target?.result as string;
        if (file.name.endsWith('.csv')) {
          const lines = content.split('\n').map(line => line.split(',')[0].trim()).filter(Boolean);
          setItemsList(lines.join('\n'));
        } else {
          setItemsList(content);
        }
        toast({
          title: "📁 Arquivo carregado!",
          description: `${file.name} foi importado com sucesso.`
        });
      };
      reader.readAsText(file);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="text-center mb-8">
        <List className="w-16 h-16 mx-auto mb-4 text-green-600" />
        <h2 className="text-4xl font-bold text-green-800 mb-2">Sorteio de Lista</h2>
        <p className="text-lg text-gray-600">Cole a lista abaixo e boa sorte! 🍀</p>
      </div>

      <Card className="p-6 mb-8">
        <h3 className="text-2xl font-bold mb-6 text-center">📝 Lista de Itens</h3>
        
        <div className="space-y-6">
          <div>
            <Label htmlFor="items">Itens (um por linha)</Label>
            <Textarea
              id="items"
              placeholder={`João Silva\nMaria Santos\nPedro Oliveira\nAna Costa\n\nOu cole sua lista aqui...`}
              value={itemsList}
              onChange={(e) => setItemsList(e.target.value)}
              className="min-h-[200px] text-base"
            />
            <p className="text-sm text-gray-500 mt-2">
              Total de itens: {getItems().length}
            </p>
          </div>

          <div>
            <Label htmlFor="file-upload" className="cursor-pointer">
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:border-green-400 transition-colors">
                <Upload className="w-8 h-8 mx-auto mb-2 text-gray-400" />
                <span className="text-sm text-gray-600">
                  Clique para carregar arquivo (.txt, .csv)
                </span>
              </div>
            </Label>
            <Input
              id="file-upload"
              type="file"
              accept=".txt,.csv"
              onChange={handleFileUpload}
              className="hidden"
            />
          </div>

          <div>
            <Label htmlFor="quantity">Quantos itens sortear?</Label>
            <Input
              id="quantity"
              type="number"
              min="1"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              className="text-lg"
            />
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="avoid-repeats"
              checked={avoidRepeats}
              onCheckedChange={(checked) => setAvoidRepeats(checked as boolean)}
            />
            <Label htmlFor="avoid-repeats" className="text-sm font-medium">
              Evitar repetições
            </Label>
          </div>

          <Button
            onClick={performRaffle}
            disabled={isRaffling || getItems().length === 0}
            className="w-full text-lg py-6 bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 transform hover:scale-105 transition-all"
          >
            {isRaffling ? (
              <>
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white mr-2"></div>
                Sorteando...
              </>
            ) : (
              <>
                <List className="w-6 h-6 mr-2" />
                Sortear Agora!
              </>
            )}
          </Button>
        </div>
      </Card>

      {/* Modal de Resultado */}
      <Dialog open={showModal} onOpenChange={setShowModal}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="text-center text-2xl font-bold text-green-800">
              🎯 Resultado do Sorteio
            </DialogTitle>
            <DialogDescription className="text-center">
              {isRaffling ? "Girando a roleta..." : "Parabéns! Aqui está o resultado:"}
            </DialogDescription>
          </DialogHeader>
          
          <div className="text-center py-6">
            {isRaffling ? (
              <div>
                <div className="text-2xl font-bold text-green-600 animate-bounce mb-4 h-8">
                  {currentAnimation}
                </div>
                <p className="text-lg text-gray-600 animate-pulse">
                  Girando a roleta... 🎰
                </p>
              </div>
            ) : results.length > 0 ? (
              <div className="animate-flip">
                <div className="space-y-3 mb-6">
                  {results.map((item, index) => (
                    <div
                      key={index}
                      className="bg-gradient-to-r from-green-400 to-blue-500 text-white text-xl font-bold py-3 px-6 rounded-lg shadow-lg animate-bounce-slow"
                    >
                      🏆 {item}
                    </div>
                  ))}
                </div>
                
                <div className="flex gap-2 justify-center">
                  <Button
                    onClick={copyResults}
                    variant="outline"
                    className="flex items-center gap-2"
                  >
                    <Copy className="w-4 h-4" />
                    Copiar
                  </Button>
                  
                  <Button
                    onClick={resetRaffle}
                    variant="outline"
                    className="flex items-center gap-2"
                  >
                    <RotateCcw className="w-4 h-4" />
                    Novo Sorteio
                  </Button>
                </div>
              </div>
            ) : null}
          </div>
        </DialogContent>
      </Dialog>

      {/* Histórico */}
      {history.length > 0 && (
        <Card className="p-6">
          <h3 className="text-xl font-bold mb-4">📚 Histórico (Sessão Atual)</h3>
          <div className="space-y-3 max-h-48 overflow-y-auto">
            {history.slice(-5).reverse().map((entry, index) => (
              <div key={index} className="bg-gray-50 p-4 rounded-lg">
                <div className="flex justify-between items-start mb-2">
                  <span className="text-sm text-gray-600">
                    Lista com {entry.items.length} item(s)
                  </span>
                  <span className="text-xs text-gray-500">
                    {entry.timestamp.toLocaleTimeString()}
                  </span>
                </div>
                <div className="font-bold text-green-600">
                  Resultado: {entry.results.join(', ')}
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
};

export default ListRaffle;
