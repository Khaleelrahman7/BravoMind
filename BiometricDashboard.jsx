import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { Heart, Moon, Activity, Brain, TrendingUp, TrendingDown, AlertTriangle } from 'lucide-react';
import { TacticalCard, StatusIndicator, MilitaryButton } from './military-theme';
import { mockBiometricData } from './utils';

const BiometricDashboard = () => {
  const [timeRange, setTimeRange] = useState('7d');
  const [data, setData] = useState([]);
  const [currentStats, setCurrentStats] = useState({});

  useEffect(() => {
    // Generate more comprehensive biometric data
    const generateData = () => {
      const days = timeRange === '7d' ? 7 : timeRange === '30d' ? 30 : 90;
      const newData = [];
      
      for (let i = days - 1; i >= 0; i--) {
        const date = new Date();
        date.setDate(date.getDate() - i);
        
        // Simulate realistic biometric patterns
        const baseHeartRate = 72;
        const heartRateVariation = Math.sin(i * 0.3) * 8 + Math.random() * 6;
        const heartRate = Math.round(baseHeartRate + heartRateVariation);
        
        const baseSleep = 7.5;
        const sleepVariation = Math.sin(i * 0.2) * 1.5 + (Math.random() - 0.5) * 2;
        const sleepHours = Math.max(4, Math.min(10, baseSleep + sleepVariation));
        
        const baseActivity = 7;
        const activityVariation = Math.sin(i * 0.4) * 3 + Math.random() * 2;
        const activityLevel = Math.max(1, Math.min(10, baseActivity + activityVariation));
        
        const baseStress = 4;
        const stressVariation = Math.sin(i * 0.5) * 2 + Math.random() * 2;
        const stressLevel = Math.max(1, Math.min(10, baseStress + stressVariation));
        
        newData.push({
          date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
          heartRate: heartRate,
          sleepHours: Math.round(sleepHours * 10) / 10,
          activityLevel: Math.round(activityLevel),
          stressLevel: Math.round(stressLevel),
          timestamp: date
        });
      }
      
      return newData;
    };

    const newData = generateData();
    setData(newData);
    
    // Calculate current stats
    const latest = newData[newData.length - 1];
    const previous = newData[newData.length - 2];
    
    setCurrentStats({
      heartRate: {
        current: latest.heartRate,
        trend: latest.heartRate > previous.heartRate ? 'up' : 'down',
        change: Math.abs(latest.heartRate - previous.heartRate)
      },
      sleep: {
        current: latest.sleepHours,
        trend: latest.sleepHours > previous.sleepHours ? 'up' : 'down',
        change: Math.abs(latest.sleepHours - previous.sleepHours).toFixed(1)
      },
      activity: {
        current: latest.activityLevel,
        trend: latest.activityLevel > previous.activityLevel ? 'up' : 'down',
        change: Math.abs(latest.activityLevel - previous.activityLevel)
      },
      stress: {
        current: latest.stressLevel,
        trend: latest.stressLevel < previous.stressLevel ? 'up' : 'down', // Lower stress is better
        change: Math.abs(latest.stressLevel - previous.stressLevel)
      }
    });
  }, [timeRange]);

  const getStatusColor = (value, type) => {
    switch (type) {
      case 'heartRate':
        return value >= 60 && value <= 80 ? 'text-green-400' : value > 80 ? 'text-yellow-400' : 'text-red-400';
      case 'sleep':
        return value >= 7 && value <= 9 ? 'text-green-400' : value >= 6 ? 'text-yellow-400' : 'text-red-400';
      case 'activity':
        return value >= 7 ? 'text-green-400' : value >= 5 ? 'text-yellow-400' : 'text-red-400';
      case 'stress':
        return value <= 3 ? 'text-green-400' : value <= 6 ? 'text-yellow-400' : 'text-red-400';
      default:
        return 'text-slate-400';
    }
  };

  const getStatusIndicator = (value, type) => {
    const color = getStatusColor(value, type);
    if (color.includes('green')) return 'online';
    if (color.includes('yellow')) return 'warning';
    return 'offline';
  };

  const StatCard = ({ title, value, unit, icon: Icon, trend, change, type }) => (
    <div className="bg-slate-800/50 border border-slate-600 rounded-lg p-4">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <Icon className="w-5 h-5 text-green-400" />
          <span className="text-slate-300 text-sm font-medium">{title}</span>
        </div>
        <StatusIndicator status={getStatusIndicator(value, type)} />
      </div>
      <div className="flex items-end justify-between">
        <div>
          <div className={`text-2xl font-bold ${getStatusColor(value, type)}`}>
            {value}{unit}
          </div>
          <div className="flex items-center gap-1 text-xs">
            {trend === 'up' ? (
              <TrendingUp className="w-3 h-3 text-green-400" />
            ) : (
              <TrendingDown className="w-3 h-3 text-red-400" />
            )}
            <span className="text-slate-400">±{change}{unit}</span>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Time Range Selector */}
      <div className="flex gap-2">
        {['7d', '30d', '90d'].map(range => (
          <MilitaryButton
            key={range}
            onClick={() => setTimeRange(range)}
            variant={timeRange === range ? 'primary' : 'secondary'}
            size="sm"
          >
            {range === '7d' ? '7 Days' : range === '30d' ? '30 Days' : '90 Days'}
          </MilitaryButton>
        ))}
      </div>

      {/* Current Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Heart Rate"
          value={currentStats.heartRate?.current}
          unit=" BPM"
          icon={Heart}
          trend={currentStats.heartRate?.trend}
          change={currentStats.heartRate?.change}
          type="heartRate"
        />
        <StatCard
          title="Sleep"
          value={currentStats.sleep?.current}
          unit=" hrs"
          icon={Moon}
          trend={currentStats.sleep?.trend}
          change={currentStats.sleep?.change}
          type="sleep"
        />
        <StatCard
          title="Activity"
          value={currentStats.activity?.current}
          unit="/10"
          icon={Activity}
          trend={currentStats.activity?.trend}
          change={currentStats.activity?.change}
          type="activity"
        />
        <StatCard
          title="Stress Level"
          value={currentStats.stress?.current}
          unit="/10"
          icon={Brain}
          trend={currentStats.stress?.trend}
          change={currentStats.stress?.change}
          type="stress"
        />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Heart Rate & Sleep Chart */}
        <TacticalCard title="Heart Rate & Sleep Patterns" status="active">
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis dataKey="date" stroke="#9CA3AF" />
              <YAxis stroke="#9CA3AF" />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#1F2937', 
                  border: '1px solid #22C55E',
                  borderRadius: '8px'
                }}
              />
              <Line 
                type="monotone" 
                dataKey="heartRate" 
                stroke="#22C55E" 
                strokeWidth={2}
                name="Heart Rate (BPM)"
              />
              <Line 
                type="monotone" 
                dataKey="sleepHours" 
                stroke="#3B82F6" 
                strokeWidth={2}
                name="Sleep (hours)"
              />
            </LineChart>
          </ResponsiveContainer>
        </TacticalCard>

        {/* Activity & Stress Chart */}
        <TacticalCard title="Activity & Stress Levels" status="active">
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={data}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis dataKey="date" stroke="#9CA3AF" />
              <YAxis stroke="#9CA3AF" />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#1F2937', 
                  border: '1px solid #22C55E',
                  borderRadius: '8px'
                }}
              />
              <Bar dataKey="activityLevel" fill="#22C55E" name="Activity Level" />
              <Bar dataKey="stressLevel" fill="#EF4444" name="Stress Level" />
            </BarChart>
          </ResponsiveContainer>
        </TacticalCard>
      </div>

      {/* AI Insights */}
      <TacticalCard title="AI Health Insights" status="active">
        <div className="space-y-4">
          <div className="flex items-start gap-3 p-3 bg-blue-400/10 border border-blue-400/30 rounded-lg">
            <Brain className="w-5 h-5 text-blue-400 mt-0.5" />
            <div>
              <h4 className="text-blue-400 font-bold text-sm">Sleep Pattern Analysis</h4>
              <p className="text-slate-300 text-sm">
                Your sleep quality has improved by 15% this week. Consider maintaining your current bedtime routine.
              </p>
            </div>
          </div>
          
          <div className="flex items-start gap-3 p-3 bg-yellow-400/10 border border-yellow-400/30 rounded-lg">
            <AlertTriangle className="w-5 h-5 text-yellow-400 mt-0.5" />
            <div>
              <h4 className="text-yellow-400 font-bold text-sm">Stress Alert</h4>
              <p className="text-slate-300 text-sm">
                Elevated stress levels detected on Tuesday. Consider scheduling a tactical breathing session.
              </p>
            </div>
          </div>
          
          <div className="flex items-start gap-3 p-3 bg-green-400/10 border border-green-400/30 rounded-lg">
            <Activity className="w-5 h-5 text-green-400 mt-0.5" />
            <div>
              <h4 className="text-green-400 font-bold text-sm">Activity Recommendation</h4>
              <p className="text-slate-300 text-sm">
                Great job maintaining consistent activity levels! Your cardiovascular health is trending positive.
              </p>
            </div>
          </div>
        </div>
      </TacticalCard>
    </div>
  );
};

export default BiometricDashboard;

