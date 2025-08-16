import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { RotateCcw, CheckCircle, XCircle } from 'lucide-react';
import charactersData from '@/assets/characters.json';

const DrawFromDefinition = () => {
  const canvasRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [strokes, setStrokes] = useState([]);
  const [currentStroke, setCurrentStroke] = useState([]);
  const [currentCharacter, setCurrentCharacter] = useState(null);
  const [hanziLookupReady, setHanziLookupReady] = useState(false);
  const [recognitionResult, setRecognitionResult] = useState(null);
  const [showResult, setShowResult] = useState(false);

  useEffect(() => {
    if (window.HanziLookup) {
      let loadedCount = 0;
      const checkReady = () => {
        loadedCount++;
        if (loadedCount >= 2) {
          setHanziLookupReady(true);
        }
      };
      window.HanziLookup.init("mmah", "/mmah.json", checkReady);
      window.HanziLookup.init("orig", "/orig.json", checkReady);
    }
  }, []);

  useEffect(() => {
    generateNewCharacter();
  }, [hanziLookupReady]);

  const generateNewCharacter = () => {
    if (charactersData.length === 0) return;
    const randomIndex = Math.floor(Math.random() * charactersData.length);
    setCurrentCharacter(charactersData[randomIndex]);
    clearCanvas();
    setRecognitionResult(null);
    setShowResult(false);
  };

  const getCoordinates = (e) => {
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;

    if (e.touches) {
      return {
        x: (e.touches[0].clientX - rect.left) * scaleX,
        y: (e.touches[0].clientY - rect.top) * scaleY
      };
    } else {
      return {
        x: (e.clientX - rect.left) * scaleX,
        y: (e.clientY - rect.top) * scaleY
      };
    }
  };

  const startDrawing = (e) => {
    e.preventDefault();
    setIsDrawing(true);
    const coords = getCoordinates(e);
    setCurrentStroke([coords]);
  };

  const draw = (e) => {
    if (!isDrawing) return;
    e.preventDefault();

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    const coords = getCoordinates(e);

    setCurrentStroke(prev => [...prev, coords]);

    ctx.lineWidth = 3;
    ctx.lineCap = "round";
    ctx.strokeStyle = "#374151";

    if (currentStroke.length > 0) {
      const lastPoint = currentStroke[currentStroke.length - 1];
      ctx.beginPath();
      ctx.moveTo(lastPoint.x, lastPoint.y);
      ctx.lineTo(coords.x, coords.y);
      ctx.stroke();
    }
  };

  const stopDrawing = (e) => {
    if (!isDrawing) return;
    e.preventDefault();
    setIsDrawing(false);
    
    if (currentStroke.length > 0) {
      setStrokes(prev => [...prev, currentStroke]);
      setCurrentStroke([]);
    }
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    setStrokes([]);
    setCurrentStroke([]);
  };

  const undoLastStroke = () => {
    if (strokes.length === 0) return;

    const newStrokes = strokes.slice(0, -1);
    setStrokes(newStrokes);
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    ctx.lineWidth = 3;
    ctx.lineCap = "round";
    ctx.strokeStyle = "#374151";

    newStrokes.forEach(stroke => {
      if (stroke.length > 1) {
        ctx.beginPath();
        ctx.moveTo(stroke[0].x, stroke[0].y);
        for (let i = 1; i < stroke.length; i++) {
          ctx.lineTo(stroke[i].x, stroke[i].y);
        }
        ctx.stroke();
      }
    });
  };

  const checkCharacter = () => {
    if (!hanziLookupReady || strokes.length === 0 || !currentCharacter) return;

    try {
      const hanziStrokes = strokes.map(stroke => 
        stroke.map(point => [point.x, point.y])
      );
      const analyzedChar = new window.HanziLookup.AnalyzedCharacter(hanziStrokes);
      const matcherMMAH = new window.HanziLookup.Matcher("mmah");
      matcherMMAH.match(analyzedChar, 1, (matches) => {
        if (matches && matches.length > 0) {
          const bestMatch = matches[0];
          const isCorrect = bestMatch.character === currentCharacter.simplified || bestMatch.character === currentCharacter.traditional;
          setRecognitionResult({
            character: bestMatch.character,
            score: Math.round(bestMatch.score),
            isCorrect: isCorrect
          });
        } else {
          setRecognitionResult({ character: 
            "N/A", score: 0, isCorrect: false });
        }
        setShowResult(true);
      });
    } catch (error) {
      console.error("Recognition error:", error);
      setRecognitionResult({ character: "Error", score: 0, isCorrect: false });
      setShowResult(true);
    }
  };

  if (!currentCharacter) {
    return <div className="flex justify-center items-center h-64">Loading character...</div>;
  }

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold text-gray-800">Draw from Definition</h1>
        <p className="text-gray-600">Draw the Chinese character that matches the definition below.</p>
      </div>

      {!hanziLookupReady && (
        <Card className="border-yellow-200 bg-yellow-50">
          <CardContent className="p-4 text-center">
            <p className="text-yellow-800">Loading character recognition data...</p>
          </CardContent>
        </Card>
      )}

      <Card className="border-2">
        <CardHeader className="text-center">
          <CardTitle className="text-lg">Definition</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="text-center">
            <p className="text-4xl font-bold text-green-600 mb-4">
              {currentCharacter.meaning}
            </p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Your Drawing</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="relative">
            <canvas
              ref={canvasRef}
              width={400}
              height={400}
              className="border-2 border-gray-300 rounded-lg cursor-crosshair touch-none bg-white"
              style={{ width: '100%', maxWidth: '400px', aspectRatio: '1' }}
              onMouseDown={startDrawing}
              onMouseMove={draw}
              onMouseUp={stopDrawing}
              onMouseLeave={stopDrawing}
              onTouchStart={startDrawing}
              onTouchMove={draw}
              onTouchEnd={stopDrawing}
            />
            <div className="absolute top-2 right-2 text-xs text-gray-500 bg-white px-2 py-1 rounded">
              Strokes: {strokes.length}
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            <Button 
              onClick={checkCharacter} 
              disabled={strokes.length === 0 || !hanziLookupReady || showResult}
              className="flex-1"
            >
              Check Drawing
            </Button>
            <Button 
              variant="outline" 
              onClick={undoLastStroke}
              disabled={strokes.length === 0 || showResult}
            >
              <RotateCcw className="w-4 h-4 mr-2" />
              Undo
            </Button>
            <Button 
              variant="outline" 
              onClick={clearCanvas}
              disabled={strokes.length === 0 || showResult}
            >
              <RotateCcw className="w-4 h-4 mr-2" />
              Clear
            </Button>
          </div>

          {showResult && recognitionResult && (
            <div className={`p-4 rounded-lg ${recognitionResult.isCorrect ? 'bg-green-50' : 'bg-red-50'} text-center`}>
              <h3 className="text-lg font-semibold mb-2">
                {recognitionResult.isCorrect ? 'Correct!' : 'Incorrect'}
              </h3>
              <p className="text-sm">
                You drew: <span className="font-bold text-xl" style={{ fontFamily: 'Noto Sans CJK SC, serif' }}>{recognitionResult.character}</span>
              </p>
              <p className="text-sm">Confidence: {recognitionResult.score}%</p>
              <p className="text-sm">Correct Character: <span className="font-bold text-xl" style={{ fontFamily: 'Noto Sans CJK SC, serif' }}>{currentCharacter.simplified}</span></p>
              <p className="text-sm">Pinyin: {currentCharacter.pinyin}</p>
              <p className="text-sm">Meaning: {currentCharacter.meaning}</p>
              <Button onClick={generateNewCharacter} className="mt-4">
                Next Character
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default DrawFromDefinition;

