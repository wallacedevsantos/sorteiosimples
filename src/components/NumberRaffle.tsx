
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
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
  const [history, setHistory] = useState<{ min: number; max: number; results: number[]; timestamp: Date }[]>([]);
  const { toast } = useToast();

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
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="text-center mb-8">
        <Dice1 className="w-16 h-16 mx-auto mb-4 text-blue-600" />
        <h2 className="text-4xl font-bold text-blue-800 mb-2">Sorteio de Números</h2>
        <p className="text-lg text-gray-600">Configure os parâmetros e boa sorte! 🍀</p>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        <Card className="p-6">
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

            <div className="flex gap-3">
              <Button
                onClick={performRaffle}
                disabled={isRaffling}
                className="flex-1 text-lg py-6 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 transform hover:scale-105 transition-all"
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
              
              {results.length > 0 && (
                <Button
                  onClick={resetRaffle}
                  variant="outline"
                  className="px-6"
                >
                  <RotateCcw className="w-5 h-5" />
                </Button>
              )}
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <h3 className="text-2xl font-bold mb-6 text-center">🎯 Resultado</h3>
          
          {isRaffling && (
            <div className="text-center py-12">
              <div className="text-6xl font-bold text-blue-600 animate-number-roll mb-4">
                {Math.floor(Math.random() * 100)}
              </div>
              <p className="text-lg text-gray-600 animate-pulse">
                Preparando o número da sorte... 🎲
              </p>
            </div>
          )}

          {results.length > 0 && !isRaffling && (
            <div className="text-center animate-flip">
              <div className="mb-6">
                <p className="text-lg text-gray-600 mb-4">🎉 Parabéns! Aqui está o(s) número(s) sorteado(s):</p>
                <div className="flex flex-wrap justify-center gap-4">
                  {results.map((number, index) => (
                    <div
                      key={index}
                      className="bg-gradient-to-r from-green-400 to-blue-500 text-white text-4xl font-bold py-4 px-6 rounded-full shadow-lg animate-bounce-slow"
                    >
                      {number}
                    </div>
                  ))}
                </div>
              </div>
              
              <Button
                onClick={copyResults}
                variant="outline"
                className="flex items-center gap-2 mx-auto"
              >
                <Copy className="w-4 h-4" />
                Copiar Resultado
              </Button>
            </div>
          )}

          {results.length === 0 && !isRaffling && (
            <div className="text-center py-12 text-gray-500">
              <Dice1 className="w-16 h-16 mx-auto mb-4 opacity-50" />
              <p>Configure os parâmetros e clique em "Sortear Agora!" para ver o resultado aqui! ✨</p>
            </div>
          )}
        </Card>
      </div>

      {history.length > 0 && (
        <Card className="mt-8 p-6">
          <h3 className="text-xl font-bold mb-4">📚 Histórico (Sessão Atual)</h3>
          <div className="space-y-2 max-h-40 overflow-y-auto">
            {history.slice(-5).reverse().map((entry, index) => (
              <div key={index} className="flex justify-between items-center bg-gray-50 p-3 rounded">
                <span>Intervalo: {entry.min} - {entry.max}</span>
                <span className="font-bold text-blue-600">Resultado: {entry.results.join(', ')}</span>
                <span className="text-xs text-gray-500">
                  {entry.timestamp.toLocaleTimeString()}
                </span>
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
};

export default NumberRaffle;
