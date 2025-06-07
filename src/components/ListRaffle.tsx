
import { useState } from "react";
import confetti from "canvas-confetti";
import { List, RefreshCw, Copy, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

const ListRaffle = () => {
  const [itemsList, setItemsList] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [avoidDuplicates, setAvoidDuplicates] = useState(true);
  const [results, setResults] = useState<string[]>([]);
  const [isAnimating, setIsAnimating] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [usedItems, setUsedItems] = useState<Set<string>>(new Set());
  const [animationText, setAnimationText] = useState("");

  const getItems = () => {
    return itemsList
      .split('\n')
      .map(item => item.trim())
      .filter(item => item.length > 0);
  };

  const generateRandomText = (items: string[]) => {
    return items[Math.floor(Math.random() * items.length)];
  };

  const drawItems = () => {
    const items = getItems();
    
    if (items.length === 0) {
      alert("Por favor, adicione pelo menos um item à lista!");
      return;
    }

    if (avoidDuplicates && quantity > items.length) {
      alert("Quantidade solicitada é maior que o número de itens disponíveis!");
      return;
    }

    setIsAnimating(true);
    setShowResults(true);

    // Animação de texto rolando
    const animationInterval = setInterval(() => {
      setAnimationText(generateRandomText(items));
    }, 100);

    // Para a animação e mostra resultado
    setTimeout(() => {
      clearInterval(animationInterval);
      
      const availableItems = avoidDuplicates 
        ? items.filter(item => !usedItems.has(item))
        : items;

      const newResults: string[] = [];
      const itemsToSelect = [...availableItems];

      for (let i = 0; i < quantity && itemsToSelect.length > 0; i++) {
        const randomIndex = Math.floor(Math.random() * itemsToSelect.length);
        const selectedItem = itemsToSelect[randomIndex];
        newResults.push(selectedItem);
        
        if (avoidDuplicates) {
          itemsToSelect.splice(randomIndex, 1);
        }
      }

      setResults(newResults);
      
      if (avoidDuplicates) {
        setUsedItems(prev => new Set([...prev, ...newResults]));
      }
      
      setIsAnimating(false);
      setAnimationText("");

      // Confetes!
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      });
    }, 2000);
  };

  const resetRaffle = () => {
    setResults([]);
    setUsedItems(new Set());
    setShowResults(false);
  };

  const copyResults = () => {
    navigator.clipboard.writeText(results.join("\n"));
    alert("Resultado copiado!");
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target?.result as string;
      setItemsList(text);
    };
    reader.readAsText(file);
  };

  return (
    <div className="max-w-2xl mx-auto">
      <Card className="p-8 bg-gradient-to-br from-green-50 to-blue-50 border-2 border-green-200">
        <div className="text-center mb-8">
          <List className="w-16 h-16 mx-auto mb-4 text-green-600 animate-wiggle" />
          <h2 className="text-3xl font-bold text-green-800 mb-2">Sorteio de Lista</h2>
          <p className="text-green-600">Cole sua lista e deixe a sorte decidir!</p>
        </div>

        <div className="space-y-6 mb-8">
          <div>
            <Label htmlFor="items-list" className="text-green-700 font-medium">
              Lista de Itens (um por linha)
            </Label>
            <Textarea
              id="items-list"
              value={itemsList}
              onChange={(e) => setItemsList(e.target.value)}
              placeholder="João Silva&#10;Maria Santos&#10;Pedro Oliveira&#10;Ana Costa"
              className="mt-2 min-h-[150px] border-green-200 focus:border-green-400"
            />
            <p className="text-sm text-green-600 mt-2">
              {getItems().length} itens na lista
            </p>
          </div>

          <div className="flex gap-4 items-end">
            <div className="flex-1">
              <Label htmlFor="quantity-list" className="text-green-700 font-medium">
                Quantos itens sortear?
              </Label>
              <Input
                id="quantity-list"
                type="number"
                min="1"
                value={quantity}
                onChange={(e) => setQuantity(Number(e.target.value))}
                className="mt-2 border-green-200 focus:border-green-400"
              />
            </div>

            <div>
              <Label htmlFor="file-upload" className="sr-only">Upload de arquivo</Label>
              <Button
                variant="outline"
                className="border-green-300 text-green-600 hover:bg-green-50"
                onClick={() => document.getElementById('file-upload')?.click()}
              >
                <Upload className="w-4 h-4 mr-2" />
                Upload
              </Button>
              <input
                id="file-upload"
                type="file"
                accept=".txt,.csv"
                onChange={handleFileUpload}
                className="hidden"
              />
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="avoid-duplicates-list"
              checked={avoidDuplicates}
              onCheckedChange={(checked) => setAvoidDuplicates(checked as boolean)}
            />
            <Label htmlFor="avoid-duplicates-list" className="text-green-700">
              Evitar repetições
            </Label>
          </div>
        </div>

        <div className="flex gap-4 justify-center">
          <Button
            onClick={drawItems}
            disabled={isAnimating || getItems().length === 0}
            className="bg-green-600 hover:bg-green-700 text-white px-8 py-3 text-lg font-bold"
          >
            {isAnimating ? (
              <>
                <RefreshCw className="w-5 h-5 mr-2 animate-spin" />
                Sorteando...
              </>
            ) : (
              <>
                <List className="w-5 h-5 mr-2" />
                Sortear Agora!
              </>
            )}
          </Button>

          {results.length > 0 && (
            <Button
              onClick={resetRaffle}
              variant="outline"
              className="border-green-300 text-green-600 hover:bg-green-50"
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Resetar
            </Button>
          )}
        </div>
      </Card>

      {/* Modal de Resultado */}
      <Dialog open={showResults} onOpenChange={setShowResults}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="text-center text-2xl font-bold text-green-800">
              🎉 Resultado do Sorteio! 🎉
            </DialogTitle>
          </DialogHeader>
          
          <div className="text-center py-6">
            {isAnimating ? (
              <div className="space-y-4">
                <div className="text-2xl font-bold animate-number-roll text-green-600 min-h-[60px] flex items-center justify-center">
                  {animationText}
                </div>
                <p className="text-lg text-gray-600">Sorteando...</p>
              </div>
            ) : (
              <div className="space-y-6">
                <div className="text-center">
                  <div className="space-y-3 mb-6">
                    {results.map((result, index) => (
                      <div 
                        key={index}
                        className="text-2xl font-bold text-green-600 p-3 bg-green-50 rounded-lg animate-flip"
                      >
                        {result}
                      </div>
                    ))}
                  </div>
                  <p className="text-lg text-gray-600 mb-6">
                    {quantity === 1 ? "Item sorteado:" : "Itens sorteados:"}
                  </p>
                </div>

                <div className="flex gap-3 justify-center">
                  <Button
                    onClick={copyResults}
                    variant="outline"
                    className="flex items-center gap-2"
                  >
                    <Copy className="w-4 h-4" />
                    Copiar
                  </Button>
                  
                  <Button
                    onClick={() => setShowResults(false)}
                    className="bg-green-600 hover:bg-green-700"
                  >
                    Fechar
                  </Button>
                </div>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ListRaffle;
