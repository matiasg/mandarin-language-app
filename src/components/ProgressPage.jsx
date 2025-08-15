import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Trophy, Target, Clock, TrendingUp, BookOpen, PenTool } from 'lucide-react';

const ProgressPage = () => {
  // Mock data - in a real app, this would come from localStorage or a backend
  const stats = {
    totalCharacters: 1000,
    learnedCharacters: 156,
    quizAccuracy: 78,
    totalQuizzes: 45,
    correctAnswers: 234,
    totalAnswers: 300,
    studyTime: 12.5, // hours
    streak: 7, // days
    achievements: [
      { name: 'First Steps', description: 'Completed first quiz', earned: true },
      { name: 'Quick Learner', description: 'Answered 100 questions correctly', earned: true },
      { name: 'Consistent', description: '7-day study streak', earned: true },
      { name: 'Character Master', description: 'Learn 500 characters', earned: false },
    ]
  };

  const progressPercentage = (stats.learnedCharacters / stats.totalCharacters) * 100;

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold text-gray-800">Your Learning Progress</h1>
        <p className="text-gray-600">Track your journey in mastering Chinese characters</p>
      </div>

      {/* Main Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6 text-center">
            <BookOpen className="w-8 h-8 text-blue-600 mx-auto mb-3" />
            <div className="text-3xl font-bold text-gray-800">{stats.learnedCharacters}</div>
            <div className="text-sm text-gray-600">Characters Learned</div>
            <div className="text-xs text-gray-500 mt-1">of {stats.totalCharacters}</div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6 text-center">
            <Target className="w-8 h-8 text-green-600 mx-auto mb-3" />
            <div className="text-3xl font-bold text-gray-800">{stats.quizAccuracy}%</div>
            <div className="text-sm text-gray-600">Quiz Accuracy</div>
            <div className="text-xs text-gray-500 mt-1">{stats.correctAnswers}/{stats.totalAnswers} correct</div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6 text-center">
            <Clock className="w-8 h-8 text-purple-600 mx-auto mb-3" />
            <div className="text-3xl font-bold text-gray-800">{stats.studyTime}h</div>
            <div className="text-sm text-gray-600">Study Time</div>
            <div className="text-xs text-gray-500 mt-1">Total time spent</div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6 text-center">
            <TrendingUp className="w-8 h-8 text-orange-600 mx-auto mb-3" />
            <div className="text-3xl font-bold text-gray-800">{stats.streak}</div>
            <div className="text-sm text-gray-600">Day Streak</div>
            <div className="text-xs text-gray-500 mt-1">Keep it up!</div>
          </CardContent>
        </Card>
      </div>

      {/* Progress Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Trophy className="w-5 h-5 text-yellow-600" />
            Overall Progress
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Characters Mastered</span>
              <span>{stats.learnedCharacters} / {stats.totalCharacters}</span>
            </div>
            <Progress value={progressPercentage} className="h-3" />
            <div className="text-xs text-gray-500 text-center">
              {Math.round(progressPercentage)}% Complete
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">{stats.totalQuizzes}</div>
              <div className="text-sm text-blue-800">Quizzes Completed</div>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <div className="text-2xl font-bold text-green-600">{stats.correctAnswers}</div>
              <div className="text-sm text-green-800">Correct Answers</div>
            </div>
            <div className="text-center p-4 bg-purple-50 rounded-lg">
              <div className="text-2xl font-bold text-purple-600">{Math.round(stats.studyTime * 60)}</div>
              <div className="text-sm text-purple-800">Minutes Studied</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Achievements */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Trophy className="w-5 h-5 text-yellow-600" />
            Achievements
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {stats.achievements.map((achievement, index) => (
              <div 
                key={index}
                className={`p-4 rounded-lg border-2 ${
                  achievement.earned 
                    ? 'border-yellow-200 bg-yellow-50' 
                    : 'border-gray-200 bg-gray-50'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <h4 className={`font-semibold ${
                    achievement.earned ? 'text-yellow-800' : 'text-gray-600'
                  }`}>
                    {achievement.name}
                  </h4>
                  <Badge variant={achievement.earned ? 'default' : 'secondary'}>
                    {achievement.earned ? 'Earned' : 'Locked'}
                  </Badge>
                </div>
                <p className={`text-sm ${
                  achievement.earned ? 'text-yellow-700' : 'text-gray-500'
                }`}>
                  {achievement.description}
                </p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Study Tips */}
      <Card>
        <CardHeader>
          <CardTitle>Study Tips</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <h4 className="font-semibold text-gray-800 mb-2">Effective Learning:</h4>
              <ul className="text-gray-600 space-y-1">
                <li>• Practice a little bit every day</li>
                <li>• Focus on characters you find difficult</li>
                <li>• Use both quiz and drawing modes</li>
                <li>• Review previously learned characters</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-gray-800 mb-2">Memory Techniques:</h4>
              <ul className="text-gray-600 space-y-1">
                <li>• Create stories with character meanings</li>
                <li>• Practice writing characters by hand</li>
                <li>• Learn character components and radicals</li>
                <li>• Use spaced repetition for review</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProgressPage;

