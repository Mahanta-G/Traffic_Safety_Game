import { TrafficSign, QuizQuestion } from '../types/game';

export const trafficSigns: TrafficSign[] = [
  { id: '1', name: 'No Parking', image: '/Traffic Signs/No Parking.png', matched: false },
  { id: '2', name: 'No Horn', image: '/Traffic Signs/no-horn-traffic-sign.jpg', matched: false },
  { id: '3', name: 'Petrol Pump', image: '/Traffic Signs/Petrol pump.jpg', matched: false },
  { id: '4', name: 'Stop', image: '/Traffic Signs/Stop.jpg', matched: false },
  { id: '5', name: 'Speed Limit', image: '/Traffic Signs/speed-limit-sign-board.jpg', matched: false },
  { id: '6', name: 'No Overtaking', image: '/Traffic Signs/no-overtaking-1024x1024.jpeg', matched: false },
  { id: '7', name: 'Prohibit Changing Lane', image: '/Traffic Signs/prohibit-changing lane.jpg', matched: false },
  { id: '8', name: 'No Stopping', image: '/Traffic Signs/no stopping.jpg', matched: false },
  { id: '9', name: 'Narrow Road Ahead', image: '/Traffic Signs/narrow-road-ahead-sign.jpg', matched: false },
  { id: '10', name: 'School Zone', image: '/Traffic Signs/school.jpg', matched: false },
  { id: '11', name: 'Speed Breaker', image: '/Traffic Signs/speed breaker.jpg', matched: false },
  { id: '12', name: 'Dangerous Dip', image: '/Traffic Signs/Dangerous dip.jpg', matched: false },
  { id: '13', name: 'Parking Both Sides', image: '/Traffic Signs/parking both side.jpg', matched: false },
  { id: '14', name: 'Falling Rocks', image: '/Traffic Signs/falling rocks.png', matched: false },
  { id: '15', name: 'Give Way', image: '/Traffic Signs/Give way.jpg', matched: false },
  { id: '16', name: 'Road Crossing', image: '/Traffic Signs/road crossing.jpg', matched: false },
];

export const quizQuestions: QuizQuestion[] = [
  {
    id: '1',
    question: 'Why are you playing this game of road safety?',
    type: 'multiple-choice',
    options: ['To protect people from accidents and injuries', 'To ensure vehicles are well maintained'],
    correctAnswer: 0
  },
  {
    id: '2',
    question: 'What does road safety mean to you?',
    type: 'multiple-choice',
    options: ['To follow road signs and signals', 'Only drive at well-paved roads'],
    correctAnswer: 0
  },
  {
    id: '3',
    question: 'Traffic light turns yellow:',
    type: 'animated-scenario',
    options: ['Speed up before it turns red', 'Wait for green light'],
    correctAnswer: 1,
    animation: {
      type: 'traffic-light',
      scenario: 'yellow-warning'
    }
  },
  {
    id: '4',
    question: 'Traffic light stops working:',
    type: 'animated-scenario',
    options: ['Proceed without stopping', 'Stop and yield to other vehicles'],
    correctAnswer: 1,
    animation: {
      type: 'traffic-light',
      scenario: 'broken-light'
    }
  },
  {
    id: '5',
    question: 'A vehicle with flashing lights and siren appears:',
    type: 'animated-scenario',
    options: ['Pull over to side and stop', 'Speed up and clear the way'],
    correctAnswer: 0,
    animation: {
      type: 'car-scenario',
      scenario: 'emergency-vehicle'
    }
  },
  {
    id: '6',
    question: 'Your vehicle will stop working on busy road:',
    type: 'animated-scenario',
    options: ['Stay inside with hazard lights on & call for assistance', 'Leave car and walk to service station'],
    correctAnswer: 0,
    animation: {
      type: 'car-scenario',
      scenario: 'vehicle-breakdown'
    }
  },
  {
    id: '7',
    question: 'A road accident happens in front of you:',
    type: 'animated-scenario',
    options: ['Take photographs and leave immediately', 'Report it to authorities and assist if possible'],
    correctAnswer: 1,
    animation: {
      type: 'car-scenario',
      scenario: 'accident-scene'
    }
  },
  {
    id: '8',
    question: 'The person from accident is bleeding:',
    type: 'animated-scenario',
    options: ['Remove any embedded objects from wound', 'Ensure safety and call emergency services'],
    correctAnswer: 1,
    animation: {
      type: 'medical-scenario',
      scenario: 'bleeding-victim'
    }
  },
  {
    id: '9',
    question: 'When should you apply tourniquet to control bleeding?',
    type: 'multiple-choice',
    options: ['When bleeding is from limb & can\'t be controlled by pressure', 'Immediately after arriving at the scene'],
    correctAnswer: 0
  },
  {
    id: '10',
    question: 'The person in accident also has fracture in the leg:',
    type: 'animated-scenario',
    options: ['Immobilize the injured area', 'Apply pressure to it'],
    correctAnswer: 0,
    animation: {
      type: 'medical-scenario',
      scenario: 'fracture-care'
    }
  },
  {
    id: '11',
    question: 'How will you immobilize the fracture?',
    type: 'multiple-choice',
    options: ['Use a splint', 'Tell the person not to move'],
    correctAnswer: 0
  },
  {
    id: '12',
    question: 'Why is it important to check his pulse?',
    type: 'multiple-choice',
    options: ['To determine need for CPR', 'To determine need for oxygen'],
    correctAnswer: 0
  },
  {
    id: '13',
    question: 'Chest compression: Rescue breaths in adult CPR:',
    type: 'multiple-choice',
    options: ['30:2', '20:1'],
    correctAnswer: 0
  },
  {
    id: '14',
    question: 'You see that the patient\'s limb is cut off:',
    type: 'animated-scenario',
    options: ['Put the cut-off part in clean bag', 'Throw away the part to avoid infection'],
    correctAnswer: 0,
    animation: {
      type: 'medical-scenario',
      scenario: 'severed-limb'
    }
  },
  {
    id: '15',
    question: 'If the person had minor external injury:',
    type: 'multiple-choice',
    options: ['Raise the wounded part so as to reduce blood flow', 'Keep the wounded part low to increase blood supply'],
    correctAnswer: 0
  },
  {
    id: '16',
    question: 'What is the law that protects individuals like you who voluntarily provide immediate assistance in road accidents?',
    type: 'multiple-choice',
    options: ['Good Samaritan Law', 'Good Pedestrian Law'],
    correctAnswer: 0
  }
];