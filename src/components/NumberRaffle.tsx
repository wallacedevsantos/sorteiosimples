
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Dice1, RotateCcw, Copy } from "lucide-react";
import confetti from "canvas-confetti";
import { useToast } from "@/hooks/use-toast";

const NumberRaffle = () => {
  const [minNumber, setMinNumber] = useState<string>("1");
  const [maxNumber, setMaxNumber] = useState<string>("100");
  const [quantity, setQuantity] = useState<string>("1");
  const [avoidRepeats, setAvoidRepeats] = useState(true);
  const [isRaffling, setIsRaffling] = useState(false);
  const [results, setResults] = useState<number[]>([]);
  const [displayNumber, setDisplayNumber] = useState<number | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [history, setHistory] = useState<{ min: number; max: number; results: number[]; timestamp: Date }[]>([]);
  const { toast } = useToast();

  // Efeito para a animação de rolagem de números
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isRaffling) {
      interval = setInterval(() => {
        const min = parseInt(minNumber);
        const max = parseInt(maxNumber);
        if (!isNaN(min) && !isNaN(max) && max >= min) {
          setDisplayNumber(Math.floor(Math.random() * (max - min + 1)) + min);
        } else {
          setDisplayNumber(Math.floor(Math.random() * 100)); // Fallback if min/max are invalid
        }
      }, 100); // Atualiza a cada 100ms
    } else {
      if (results.length > 0) {
        setDisplayNumber(results[0]); // Exibe o primeiro resultado quando o sorteio termina
      } else {
        setDisplayNumber(null);
      }
    }

    return () => clearInterval(interval);
  }, [isRaffling, minNumber, maxNumber, results]);

  const triggerConfetti = () => {
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6']
    });
  };

  const performRaffle = async () => {
    const min = parseInt(minNumber);
    const max = parseInt(maxNumber);
    const qty = parseInt(quantity);

    if (isNaN(min) || isNaN(max) || isNaN(qty)) {
      toast({
        title: "Ops! 🤔",
        description: "Por favor, preencha todos os campos com números válidos.",
        variant: "destructive"
      });
      return;
    }

    if (min >= max) {
      toast({
        title: "Ops! 🤔",
        description: "O número mínimo deve ser menor que o máximo.",
        variant: "destructive"
      });
      return;
    }

    if (avoidRepeats && qty > (max - min + 1)) {
      toast({
        title: "Ops! 🤔",
        description: "Não há números suficientes no intervalo para evitar repetições.",
        variant: "destructive"
      });
      return;
    }

    setIsRaffling(true);
    setResults([]);
    setShowModal(true);
    setDisplayNumber(null); // Reset display number at the start of raffle

    // Animação de suspense
    await new Promise(resolve => setTimeout(resolve, 2000));

    let raffleResults: number[] = [];
    let availableNumbers = Array.from({ length: max - min + 1 }, (_, i) => min + i);

    for (let i = 0; i < qty; i++) {
      if (avoidRepeats) {
        const randomIndex = Math.floor(Math.random() * availableNumbers.length);
        raffleResults.push(availableNumbers[randomIndex]);
        availableNumbers.splice(randomIndex, 1);
      } else {
        const randomNumber = Math.floor(Math.random() * (max - min + 1)) + min;
        raffleResults.push(randomNumber);
      }
    }

    setResults(raffleResults);
    setHistory(prev => [...prev, { min, max, results: raffleResults, timestamp: new Date() }]);
    setIsRaffling(false);
    triggerConfetti();
    
    toast({
      title: "🎉 Resultado revelado!",
      description: `Número(s) sorteado(s): ${raffleResults.join(', ')}`
    });
  };

  const copyResults = () => {
    navigator.clipboard.writeText(results.join(', '));
    toast({
      title: "📋 Copiado!",
      description: "Resultado copiado para a área de transferência."
    });
  };

  const resetRaffle = () => {
    setResults([]);
    setIsRaffling(false);
    setShowModal(false);
  };

  return (
    <div className="max-w-6xl mx-auto px-4">
      <div className="text-center mb-8">
        <h2 className="text-4xl font-bold text-blue-800 mb-2">Sorteio de Números</h2>
        <p className="text-lg text-gray-600">Configure os parâmetros e boa sorte! 🍀</p>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        <Card className="p-6 mb-8 lg:mb-0 lg:flex-1">
          <h3 className="text-2xl font-bold mb-6 text-center">⚙️ Configurações</h3>
          
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="min">Número Mínimo</Label>
                <Input
                  id="min"
                  type="number"
                  value={minNumber}
                  onChange={(e) => setMinNumber(e.target.value)}
                  className="text-lg"
                />
              </div>
              <div>
                <Label htmlFor="max">Número Máximo</Label>
                <Input
                  id="max"
                  type="number"
                  value={maxNumber}
                  onChange={(e) => setMaxNumber(e.target.value)}
                  className="text-lg"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="quantity">Quantos números sortear?</Label>
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
              disabled={isRaffling}
              className="w-full text-lg py-6 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 transform hover:scale-105 transition-all"
            >
              {isRaffling ? (
                <>
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white mr-2"></div>
                  Sorteando...
                </>
              ) : (
                <>
                  <Dice1 className="w-6 h-6 mr-2" />
                  Sortear Agora!
                </>
              )}
            </Button>
          </div>
        </Card>

        {/* Histórico */}
         <Card className="p-6 lg:flex-1">
          <h3 className="text-xl font-bold mb-4">📚 Histórico (Sessão Atual)</h3>
          {history.length > 0 ? (
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {history.slice(-10).reverse().map((entry, index) => (
                <div key={index} className="bg-gray-50 p-4 rounded-lg">
                  <div className="flex justify-between items-start mb-2">
                    <span className="text-sm text-gray-600">
                      Intervalo: {entry.min} - {entry.max}
                    </span>
                    <span className="text-xs text-gray-500">
                      {entry.timestamp.toLocaleTimeString()}
                    </span>
                  </div>
                  <div className="font-bold text-blue-600">
                    Resultado: {entry.results.join(', ')}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 text-center py-8">Nenhum sorteio realizado ainda.</p>
          )}
        </Card>
      </div>

      {/* Modal de Resultado */}
      <Dialog open={showModal} onOpenChange={setShowModal}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="text-center text-2xl font-bold text-blue-800">
              🎯 Resultado do Sorteio
            </DialogTitle>
            <DialogDescription className="text-center">
              {isRaffling ? "Preparando o número da sorte..." : "Parabéns! Aqui está o resultado:"}
            </DialogDescription>
          </DialogHeader>
          
          <div className="text-center py-6">
            {isRaffling ? (
              <div>
                <div className="text-6xl font-bold text-blue-600 animate-number-roll mb-4">
                  {displayNumber !== null ? displayNumber : Math.floor(Math.random() * 100)}
                </div>
                <p className="text-lg text-gray-600 animate-pulse">
                  Preparando o número da sorte... 🎲
                </p>
              </div>
            ) : results.length > 0 ? (
              <div className="animate-flip">
                <div className="flex flex-wrap justify-center gap-4 mb-6">
                  {results.map((number, index) => (
                    <div
                      key={index}
                      className="bg-gradient-to-r from-green-400 to-blue-500 text-white text-4xl font-bold py-4 px-6 rounded-full shadow-lg animate-bounce-slow"
                    >
                      {number}
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


    </div>
  );
};

export default NumberRaffle;
