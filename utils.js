import { clsx } from "clsx";
import { twMerge } from "tailwind-merge"

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

// Simulated data for the prototype
export const mockUser = {
  id: "user-001",
  name: "Alex Rodriguez",
  rank: "Sergeant",
  serviceBranch: "army",
  deployments: [
    { location: "Afghanistan", year: "2018-2019" },
    { location: "Iraq", year: "2020-2021" }
  ],
  preferences: {
    monitoring: true,
    notifications: true,
    peerMatching: true
  },
  emergencyContacts: [
    { name: "Maria Rodriguez", phone: "(555) 123-4567", relation: "Spouse" }
  ],
  milestones: [
    { date: "2024-03-15", type: "deployment_anniversary", description: "Afghanistan deployment anniversary" },
    { date: "2024-12-25", type: "holiday", description: "Christmas" }
  ]
};

export const mockMissions = [
  {
    id: "mission-001",
    type: "gratitude",
    title: "3 Gratitude Targets",
    description: "Identify three things you're grateful for today",
    difficulty: "easy",
    status: "available",
    progress: 0,
    points: 10
  },
  {
    id: "mission-002",
    type: "breathing",
    title: "Tactical Breathing Drill",
    description: "Complete a 5-minute guided breathing exercise",
    difficulty: "easy",
    status: "active",
    progress: 60,
    points: 15
  },
  {
    id: "mission-003",
    type: "comms",
    title: "Comms Check",
    description: "Reach out to a battle buddy you haven't talked to in a while",
    difficulty: "medium",
    status: "available",
    progress: 0,
    points: 25
  },
  {
    id: "mission-004",
    type: "sitrep",
    title: "Daily Situation Report",
    description: "Complete your daily mood and wellness check-in",
    difficulty: "easy",
    status: "completed",
    progress: 100,
    points: 10
  }
];

export const mockBiometricData = [
  { timestamp: new Date('2024-01-08'), heartRate: 72, sleepHours: 7.5, activityLevel: 8, stressLevel: 3 },
  { timestamp: new Date('2024-01-07'), heartRate: 75, sleepHours: 6.2, activityLevel: 6, stressLevel: 5 },
  { timestamp: new Date('2024-01-06'), heartRate: 78, sleepHours: 8.1, activityLevel: 9, stressLevel: 2 },
  { timestamp: new Date('2024-01-05'), heartRate: 80, sleepHours: 5.8, activityLevel: 4, stressLevel: 7 },
  { timestamp: new Date('2024-01-04'), heartRate: 73, sleepHours: 7.8, activityLevel: 7, stressLevel: 4 }
];

export const mockAIResponses = [
  "Roger that, battle buddy. I've noticed your sleep patterns have been a bit off lately. Want to try a quick wind-down drill?",
  "Outstanding work on completing your daily sitrep! Your consistency is showing real progress.",
  "Hey there, warrior. I see you've been pushing hard lately. Remember, taking care of your mental health is just as important as physical fitness.",
  "Mission update: You're doing great with your breathing exercises. Keep up the excellent work!",
  "I've got your six. If you need to talk or want to connect with a fellow veteran, just give me the word.",
  "Solid copy on your gratitude targets today. Those positive thoughts are powerful ammunition against stress.",
  "Time for a comms check - when's the last time you reached out to your support network?"
];

export function getRandomAIResponse() {
  return mockAIResponses[Math.floor(Math.random() * mockAIResponses.length)];
}

export function formatMilitaryTime(date) {
  return date.toLocaleTimeString('en-US', { 
    hour12: false, 
    hour: '2-digit', 
    minute: '2-digit' 
  });
}

export function getMissionStatusColor(status) {
  const colors = {
    available: "text-green-400",
    active: "text-yellow-400",
    completed: "text-blue-400",
    failed: "text-red-400"
  };
  return colors[status] || colors.available;
}

