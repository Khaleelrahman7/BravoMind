# Bravo Mind Component Hierarchy

## App Structure
```
App.jsx (Main Router & State Management)
├── Layout/
│   ├── Header.jsx (Navigation, notifications)
│   ├── Sidebar.jsx (Quick access menu)
│   └── Footer.jsx (Status indicators)
├── Pages/
│   ├── Onboarding/
│   │   ├── Welcome.jsx
│   │   ├── ServiceBranch.jsx
│   │   ├── Preferences.jsx
│   │   └── InitialAssessment.jsx
│   ├── Dashboard/
│   │   ├── Dashboard.jsx (Main hub)
│   │   ├── AICompanion.jsx (Chat interface)
│   │   └── StatusOverview.jsx (Health metrics)
│   ├── Missions/
│   │   ├── MissionCenter.jsx
│   │   ├── MissionCard.jsx
│   │   ├── ActiveMissions.jsx
│   │   └── MissionHistory.jsx
│   ├── RallyPoint/
│   │   ├── PeerMatching.jsx
│   │   ├── ChatRoom.jsx
│   │   └── ConnectionRequests.jsx
│   └── Profile/
│       ├── Settings.jsx
│       ├── EmergencyContacts.jsx
│       └── Milestones.jsx
└── Components/
    ├── UI/ (shadcn/ui components)
    ├── Military/
    │   ├── MilitaryButton.jsx
    │   ├── TacticalCard.jsx
    │   └── StatusIndicator.jsx
    ├── Chat/
    │   ├── ChatMessage.jsx
    │   ├── ChatInput.jsx
    │   └── TypingIndicator.jsx
    ├── Missions/
    │   ├── GratitudeTargets.jsx
    │   ├── TacticalBreathing.jsx
    │   ├── CommsCheck.jsx
    │   └── SituationReport.jsx
    └── Monitoring/
        ├── BiometricChart.jsx
        ├── SleepTracker.jsx
        └── StressIndicator.jsx
```

## Key Features by Component

### Dashboard.jsx
- AI companion chat interface
- Current mission cards
- Health status overview
- Quick action buttons
- Proactive notifications

### MissionCenter.jsx
- Available missions list
- Progress tracking
- Mission difficulty levels
- Completion rewards

### AICompanion.jsx
- Military-context chat
- Proactive check-ins
- Personalized responses
- Crisis detection

### PeerMatching.jsx
- Anonymous matching algorithm
- Service background filters
- Shared experience groups
- Connection requests

### BiometricChart.jsx
- Sleep pattern visualization
- Heart rate trends
- Activity levels
- Stress indicators

## Data Models

### User Profile
```javascript
{
  id: string,
  serviceBranch: 'army' | 'navy' | 'airforce' | 'marines' | 'coastguard',
  rank: string,
  deployments: Array,
  preferences: {
    monitoring: boolean,
    notifications: boolean,
    peerMatching: boolean
  },
  emergencyContacts: Array,
  milestones: Array
}
```

### Mission
```javascript
{
  id: string,
  type: 'gratitude' | 'breathing' | 'comms' | 'sitrep',
  title: string,
  description: string,
  difficulty: 'easy' | 'medium' | 'hard',
  status: 'available' | 'active' | 'completed',
  progress: number,
  completedAt: Date
}
```

### Biometric Data
```javascript
{
  timestamp: Date,
  heartRate: number,
  sleepHours: number,
  activityLevel: number,
  stressLevel: number
}
```

## Routing Structure
- `/` - Dashboard (main hub)
- `/onboarding` - Initial setup flow
- `/missions` - Mission center
- `/rally-point` - Peer connections
- `/profile` - Settings and preferences
- `/crisis` - Emergency protocols

