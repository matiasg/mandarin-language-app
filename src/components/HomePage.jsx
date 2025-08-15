import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BookOpen, PenTool, Target, Users } from 'lucide-react';

const HomePage = ({ setCurrentView }) => {
  return (
    <div className="max-w-6xl mx-auto p-6 space-y-8">
      {/* Hero Section */}
      <div className="text-center space-y-6">
        <h1 className="text-5xl font-bold text-gray-800 mb-4">
          Learn Chinese Characters
          <div className="text-3xl mt-2" style={{fontFamily: 'Noto Sans CJK SC, serif'}}>
            学汉字
          </div>
        </h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          Master the 1000 most common Chinese characters through interactive quizzes and handwriting recognition. 
          Perfect for beginners and intermediate learners.
        </p>
      </div>

      {/* Features Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => setCurrentView('quiz')}>
          <CardHeader>
            <CardTitle className="flex items-center gap-3">
              <BookOpen className="w-6 h-6 text-blue-600" />
              Character Recognition Quiz
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600 mb-4">
              Test your knowledge of Chinese characters with interactive multiple-choice quizzes. 
              Practice character-to-meaning and character-to-pinyin recognition.
            </p>
            <Button className="w-full" onClick={() => setCurrentView('quiz')}>
              Start Quiz
            </Button>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => setCurrentView('draw')}>
          <CardHeader>
            <CardTitle className="flex items-center gap-3">
              <PenTool className="w-6 h-6 text-green-600" />
              Handwriting Recognition
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600 mb-4">
              Draw Chinese characters with your mouse or finger and get instant recognition feedback. 
              Perfect for practicing stroke order and character formation.
            </p>
            <Button className="w-full" variant="outline" onClick={() => setCurrentView('draw')}>
              Start Drawing
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Stats Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardContent className="p-6 text-center">
            <Target className="w-8 h-8 text-blue-600 mx-auto mb-3" />
            <div className="text-3xl font-bold text-gray-800">1000</div>
            <div className="text-gray-600">Most Common Characters</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6 text-center">
            <BookOpen className="w-8 h-8 text-green-600 mx-auto mb-3" />
            <div className="text-3xl font-bold text-gray-800">2</div>
            <div className="text-gray-600">Learning Modes</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6 text-center">
            <Users className="w-8 h-8 text-purple-600 mx-auto mb-3" />
            <div className="text-3xl font-bold text-gray-800">∞</div>
            <div className="text-gray-600">Practice Sessions</div>
          </CardContent>
        </Card>
      </div>

      {/* About Section */}
      <Card>
        <CardHeader>
          <CardTitle>About This Learning Tool</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-gray-600">
            This application helps you learn the 1000 most common Chinese characters, which form the foundation 
            of Chinese literacy. These characters appear in approximately 80% of modern Chinese texts, making 
            them essential for reading comprehension.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <h4 className="font-semibold text-gray-800 mb-2">Quiz Mode Features:</h4>
              <ul className="text-gray-600 space-y-1">
                <li>• Character to meaning recognition</li>
                <li>• Character to pinyin recognition</li>
                <li>• Progress tracking and statistics</li>
                <li>• Immediate feedback and explanations</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-gray-800 mb-2">Drawing Mode Features:</h4>
              <ul className="text-gray-600 space-y-1">
                <li>• Real-time handwriting recognition</li>
                <li>• Character lookup by drawing</li>
                <li>• Stroke order practice</li>
                <li>• Touch and mouse support</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default HomePage;

