import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { RotateCcw, Eraser, Search } from 'lucide-react';

const DrawingCanvas = () => {
  const canvasRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [strokes, setStrokes] = useState([]);
  const [currentStroke, setCurrentStroke] = useState([]);
  const [recognitionResults, setRecognitionResults] = useState([]);
  const [isRecognizing, setIsRecognizing] = useState(false);
  const [hanziLookupReady, setHanziLookupReady] = useState(false);

  useEffect(() => {
    // Initialize HanziLookup when component mounts
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

  const getCoordinates = (e) => {
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;

    if (e.touches) {
      // Touch event
      return {
        x: (e.touches[0].clientX - rect.left) * scaleX,
        y: (e.touches[0].clientY - rect.top) * scaleY
      };
    } else {
      // Mouse event
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
    const ctx = canvas.getContext('2d');
    const coords = getCoordinates(e);

    // Add point to current stroke
    setCurrentStroke(prev => [...prev, coords]);

    // Draw line
    ctx.lineWidth = 3;
    ctx.lineCap = 'round';
    ctx.strokeStyle = '#374151';

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
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    setStrokes([]);
    setCurrentStroke([]);
    setRecognitionResults([]);
  };

  const undoLastStroke = () => {
    if (strokes.length === 0) return;

    const newStrokes = strokes.slice(0, -1);
    setStrokes(newStrokes);
    
    // Redraw canvas
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    ctx.lineWidth = 3;
    ctx.lineCap = 'round';
    ctx.strokeStyle = '#374151';

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

  const recognizeCharacter = () => {
    if (!hanziLookupReady || strokes.length === 0) return;

    setIsRecognizing(true);
    
    try {
      // Convert strokes to HanziLookup format
      const hanziStrokes = strokes.map(stroke => 
        stroke.map(point => [point.x, point.y])
      );

      // Create analyzed character
      const analyzedChar = new window.HanziLookup.AnalyzedCharacter(hanziStrokes);
      
      // Try recognition with MMAH data first
      const matcherMMAH = new window.HanziLookup.Matcher("mmah");
      matcherMMAH.match(analyzedChar, 8, (matches) => {
        setRecognitionResults(matches || []);
        setIsRecognizing(false);
      });
    } catch (error) {
      console.error('Recognition error:', error);
      setIsRecognizing(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold text-gray-800">Character Drawing Recognition</h1>
        <p className="text-gray-600">Draw a Chinese character and get instant recognition</p>
      </div>

      {!hanziLookupReady && (
        <Card className="border-yellow-200 bg-yellow-50">
          <CardContent className="p-4 text-center">
            <p className="text-yellow-800">Loading character recognition data...</p>
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Drawing Area */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Search className="w-5 h-5" />
              Drawing Canvas
            </CardTitle>
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
                onClick={recognizeCharacter} 
                disabled={strokes.length === 0 || !hanziLookupReady || isRecognizing}
                className="flex-1"
              >
                <Search className="w-4 h-4 mr-2" />
                {isRecognizing ? 'Recognizing...' : 'Recognize'}
              </Button>
              <Button 
                variant="outline" 
                onClick={undoLastStroke}
                disabled={strokes.length === 0}
              >
                <Eraser className="w-4 h-4 mr-2" />
                Undo
              </Button>
              <Button 
                variant="outline" 
                onClick={clearCanvas}
                disabled={strokes.length === 0}
              >
                <RotateCcw className="w-4 h-4 mr-2" />
                Clear
              </Button>
            </div>

            <div className="text-xs text-gray-500 space-y-1">
              <p>• Draw characters stroke by stroke</p>
              <p>• Use proper stroke order for best results</p>
              <p>• Works with mouse or touch input</p>
            </div>
          </CardContent>
        </Card>

        {/* Recognition Results */}
        <Card>
          <CardHeader>
            <CardTitle>Recognition Results</CardTitle>
          </CardHeader>
          <CardContent>
            {recognitionResults.length === 0 ? (
              <div className="text-center py-12 text-gray-500">
                <Search className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>Draw a character to see recognition results</p>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="text-sm text-gray-600 mb-4">
                  Found {recognitionResults.length} possible matches:
                </div>
                
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {recognitionResults.map((result, index) => (
                    <Card key={index} className="hover:shadow-md transition-shadow cursor-pointer">
                      <CardContent className="p-4 text-center">
                        <div 
                          className="text-4xl font-bold mb-2" 
                          style={{fontFamily: 'Noto Sans CJK SC, serif'}}
                        >
                          {result.character}
                        </div>
                        <Badge variant="secondary" className="text-xs">
                          {Math.round(result.score * 100)}% match
                        </Badge>
                      </CardContent>
                    </Card>
                  ))}
                </div>

                {recognitionResults.length > 0 && (
                  <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                    <h4 className="font-semibold text-blue-800 mb-2">Best Match:</h4>
                    <div className="flex items-center gap-4">
                      <div 
                        className="text-6xl font-bold" 
                        style={{fontFamily: 'Noto Sans CJK SC, serif'}}
                      >
                        {recognitionResults[0].character}
                      </div>
                      <div className="flex-1">
                        <div className="text-sm text-blue-700">
                          <div><strong>Character:</strong> {recognitionResults[0].character}</div>
                          <div><strong>Confidence:</strong> {Math.round(recognitionResults[0].score * 100)}%</div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Instructions */}
      <Card>
        <CardHeader>
          <CardTitle>How to Use</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
            <div>
              <h4 className="font-semibold text-gray-800 mb-2">Drawing Tips:</h4>
              <ul className="text-gray-600 space-y-1">
                <li>• Follow proper stroke order when possible</li>
                <li>• Draw strokes clearly and completely</li>
                <li>• Use the full canvas area</li>
                <li>• Don't lift your finger/mouse mid-stroke</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-gray-800 mb-2">Recognition:</h4>
              <ul className="text-gray-600 space-y-1">
                <li>• Results are ordered by confidence score</li>
                <li>• Higher scores indicate better matches</li>
                <li>• Try redrawing if results aren't accurate</li>
                <li>• Complex characters may need more precision</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DrawingCanvas;

