import { useState } from 'react';
import './FocusGroups.css';
import { AIService } from '../services/aiService';

interface Segment {
  id: number;
  name: string;
}

interface Participant {
  id: number;
  name: string;
  age: number;
  location: string;
  occupation: string;
  avatar: string;
}

interface FocusGroup {
  id: number;
  name: string;
  segmentId: number;
  segmentName: string;
  createdAt: string;
  participants: Participant[];
  questions: string[];
  session: {
    isActive: boolean;
    currentQuestion: string;
    responses: {
      participantId: number;
      response: string;
    }[];
  } | null;
}

const FocusGroups = () => {
  const [step, setStep] = useState(1);
  const [selectedSegment, setSelectedSegment] = useState<number | null>(null);
  const [groupName, setGroupName] = useState('');
  const [questions, setQuestions] = useState<string[]>([
    'What factors are most important to you when making a purchase decision?',
    'How do you typically research products before buying?',
    'What are your biggest pain points in the current shopping experience?'
  ]);
  const [newQuestion, setNewQuestion] = useState('');
  const [focusGroups, setFocusGroups] = useState<FocusGroup[]>([]);
  const [activeGroup, setActiveGroup] = useState<FocusGroup | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [customStimulus, setCustomStimulus] = useState('');
  const [isSessionActive, setIsSessionActive] = useState(false);
  const [isProcessingResponses, setIsProcessingResponses] = useState(false);
  
  // Mock segments from segmentation results
  const segments: Segment[] = [
    { id: 1, name: 'Young Professionals' },
    { id: 2, name: 'Suburban Families' },
    { id: 3, name: 'Value Seekers' },
    { id: 4, name: 'Luxury Enthusiasts' },
  ];
  
  const handleSegmentSelect = (segmentId: number) => {
    setSelectedSegment(segmentId);
    
    // Set default group name based on segment
    const segment = segments.find(s => s.id === segmentId);
    if (segment) {
      setGroupName(`${segment.name} Focus Group`);
    }
  };
  
  const handleAddQuestion = () => {
    if (newQuestion.trim()) {
      setQuestions([...questions, newQuestion.trim()]);
      setNewQuestion('');
    }
  };
  
  const handleRemoveQuestion = (index: number) => {
    setQuestions(questions.filter((_, i) => i !== index));
  };
  
  const handleCreateGroup = async () => {
    if (!selectedSegment || !groupName.trim() || questions.length === 0) {
      return;
    }
    
    setIsGenerating(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    const selectedSegmentObj = segments.find(s => s.id === selectedSegment);
    
    if (!selectedSegmentObj) {
      setIsGenerating(false);
      return;
    }
    
    // Generate synthetic participants based on selected segment
    const participants: Participant[] = [];
    
    if (selectedSegment === 1) { // Young Professionals
      participants.push(
        {
          id: 1,
          name: 'Alex Chen',
          age: 28,
          location: 'San Francisco, CA',
          occupation: 'UX Designer',
          avatar: '👨‍💼'
        },
        {
          id: 2,
          name: 'Mia Johnson',
          age: 31,
          location: 'Chicago, IL',
          occupation: 'Marketing Manager',
          avatar: '👩‍💼'
        },
        {
          id: 3,
          name: 'Jordan Taylor',
          age: 26,
          location: 'New York, NY',
          occupation: 'Software Developer',
          avatar: '👨‍💻'
        },
        {
          id: 4,
          name: 'Sarah Patel',
          age: 29,
          location: 'Austin, TX',
          occupation: 'Financial Analyst',
          avatar: '👩‍💻'
        },
        {
          id: 5,
          name: 'Tyler Wilson',
          age: 33,
          location: 'Seattle, WA',
          occupation: 'Product Manager',
          avatar: '👨‍💼'
        }
      );
    } else if (selectedSegment === 2) { // Suburban Families
      participants.push(
        {
          id: 1,
          name: 'Jennifer Miller',
          age: 38,
          location: 'Naperville, IL',
          occupation: 'Elementary Teacher',
          avatar: '👩‍🏫'
        },
        {
          id: 2,
          name: 'Michael Rodriguez',
          age: 42,
          location: 'Plano, TX',
          occupation: 'Sales Manager',
          avatar: '👨‍💼'
        },
        {
          id: 3,
          name: 'Lisa Thompson',
          age: 36,
          location: 'Cary, NC',
          occupation: 'Registered Nurse',
          avatar: '👩‍⚕️'
        },
        {
          id: 4,
          name: 'David Clark',
          age: 45,
          location: 'Bellevue, WA',
          occupation: 'Accountant',
          avatar: '👨‍💼'
        },
        {
          id: 5,
          name: 'Rebecca Green',
          age: 41,
          location: 'Irvine, CA',
          occupation: 'HR Director',
          avatar: '👩‍💼'
        }
      );
    } else if (selectedSegment === 3) { // Value Seekers
      participants.push(
        {
          id: 1,
          name: 'Susan Reynolds',
          age: 52,
          location: 'Cleveland, OH',
          occupation: 'Office Administrator',
          avatar: '👩‍💼'
        },
        {
          id: 2,
          name: 'Robert Henderson',
          age: 47,
          location: 'Phoenix, AZ',
          occupation: 'Store Manager',
          avatar: '👨‍💼'
        },
        {
          id: 3,
          name: 'Karen Martinez',
          age: 39,
          location: 'San Antonio, TX',
          occupation: 'Customer Service Rep',
          avatar: '👩‍💼'
        },
        {
          id: 4,
          name: 'James Cooper',
          age: 58,
          location: 'Detroit, MI',
          occupation: 'Bus Driver',
          avatar: '👨‍💼'
        },
        {
          id: 5,
          name: 'Patricia Lewis',
          age: 44,
          location: 'Atlanta, GA',
          occupation: 'Postal Worker',
          avatar: '👩‍💼'
        }
      );
    } else if (selectedSegment === 4) { // Luxury Enthusiasts
      participants.push(
        {
          id: 1,
          name: 'Elizabeth Morgan',
          age: 48,
          location: 'Manhattan, NY',
          occupation: 'Corporate Attorney',
          avatar: '👩‍⚖️'
        },
        {
          id: 2,
          name: 'Richard Campbell',
          age: 53,
          location: 'Beverly Hills, CA',
          occupation: 'Surgeon',
          avatar: '👨‍⚕️'
        },
        {
          id: 3,
          name: 'Victoria Zhang',
          age: 41,
          location: 'Boston, MA',
          occupation: 'Investment Banker',
          avatar: '👩‍💼'
        },
        {
          id: 4,
          name: 'Jonathan Brooks',
          age: 44,
          location: 'Chicago, IL',
          occupation: 'Real Estate Developer',
          avatar: '👨‍💼'
        },
        {
          id: 5,
          name: 'Sophia Washington',
          age: 39,
          location: 'Miami, FL',
          occupation: 'Fashion Executive',
          avatar: '👩‍💼'
        }
      );
    }
    
    const newFocusGroup: FocusGroup = {
      id: Date.now(),
      name: groupName.trim(),
      segmentId: selectedSegment,
      segmentName: selectedSegmentObj.name,
      createdAt: new Date().toISOString(),
      participants: participants,
      questions: [...questions],
      session: null
    };
    
    setFocusGroups([...focusGroups, newFocusGroup]);
    setActiveGroup(newFocusGroup);
    setIsGenerating(false);
    setStep(2);
  };
  
  const resetForm = () => {
    setSelectedSegment(null);
    setGroupName('');
    setQuestions([
      'What factors are most important to you when making a purchase decision?',
      'How do you typically research products before buying?',
      'What are your biggest pain points in the current shopping experience?'
    ]);
    setNewQuestion('');
    setCustomStimulus('');
    setIsSessionActive(false);
    setStep(1);
  };
  
  const startFocusGroupSession = () => {
    if (!activeGroup) return;
    
    // Initialize the session with the first question
    const updatedGroups = focusGroups.map(group => {
      if (group.id === activeGroup.id) {
        return {
          ...group,
          session: {
            isActive: true,
            currentQuestion: group.questions[0],
            responses: []
          }
        };
      }
      return group;
    });
    
    setFocusGroups(updatedGroups);
    setActiveGroup(updatedGroups.find(g => g.id === activeGroup.id) || null);
    setIsSessionActive(true);
  };
  
  const submitCustomStimulus = async () => {
    if (!activeGroup || !customStimulus.trim() || !activeGroup.session) return;
    
    setIsProcessingResponses(true);
    
    try {
      // Call AI service to get focus group responses
      const result = await AIService.getFocusGroupResponses({
        segmentId: activeGroup.segmentId,
        segmentName: activeGroup.segmentName,
        participants: activeGroup.participants,
        question: customStimulus
      });
      
      if (result.status === 'success' && result.data) {
        // Update the focus group with the new responses
        const updatedGroups = focusGroups.map(group => {
          if (group.id === activeGroup.id) {
            return {
              ...group,
              session: {
                ...group.session!,
                currentQuestion: customStimulus,
                responses: result.data
              }
            };
          }
          return group;
        });
        
        setFocusGroups(updatedGroups);
        setActiveGroup(updatedGroups.find(g => g.id === activeGroup.id) || null);
      } else {
        console.error('Failed to get AI responses:', result.error);
        alert('Failed to generate focus group responses. Please try again.');
      }
    } catch (error) {
      console.error('Error getting focus group responses:', error);
      alert('An error occurred. Please try again.');
    } finally {
      setIsProcessingResponses(false);
      setCustomStimulus('');
    }
  };
  
  return (
    <div className="focus-groups">
      <h1>Focus Groups</h1>
      
      {step === 1 ? (
        <div className="focus-group-setup card">
          <h2>Set Up a New Focus Group</h2>
          
          <div className="setup-section">
            <h3>1. Select Customer Segment</h3>
            <div className="segment-options">
              {segments.map(segment => (
                <div 
                  key={segment.id} 
                  className={`segment-option ${selectedSegment === segment.id ? 'selected' : ''}`}
                  onClick={() => handleSegmentSelect(segment.id)}
                >
                  {segment.name}
                </div>
              ))}
            </div>
          </div>
          
          <div className="setup-section">
            <h3>2. Name Your Focus Group</h3>
            <input
              type="text"
              value={groupName}
              onChange={(e) => setGroupName(e.target.value)}
              placeholder="Enter focus group name"
              className="text-input"
            />
          </div>
          
          <div className="setup-section">
            <h3>3. Define Discussion Questions</h3>
            <div className="questions-list">
              {questions.map((question, index) => (
                <div key={index} className="question-item">
                  <span>{index + 1}. {question}</span>
                  <button 
                    className="remove-btn"
                    onClick={() => handleRemoveQuestion(index)}
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
            
            <div className="add-question">
              <input
                type="text"
                value={newQuestion}
                onChange={(e) => setNewQuestion(e.target.value)}
                placeholder="Add a new question"
                className="text-input"
              />
              <button 
                className="btn-secondary add-btn"
                onClick={handleAddQuestion}
                disabled={!newQuestion.trim()}
              >
                Add
              </button>
            </div>
          </div>
          
          <button 
            className="btn-primary create-btn"
            onClick={handleCreateGroup}
            disabled={isGenerating || !selectedSegment || !groupName.trim() || questions.length === 0}
          >
            {isGenerating ? 'Creating...' : 'Create Focus Group'}
          </button>
        </div>
      ) : (
        <div className="focus-group-container">
          <div className="group-sidebar">
            <h2>Your Focus Groups</h2>
            <div className="groups-list">
              {focusGroups.map(group => (
                <div 
                  key={group.id} 
                  className={`group-item ${activeGroup?.id === group.id ? 'active' : ''}`}
                  onClick={() => setActiveGroup(group)}
                >
                  <h3>{group.name}</h3>
                  <p>{group.segmentName}</p>
                  <p className="small-text">
                    Created: {new Date(group.createdAt).toLocaleDateString()}
                  </p>
                </div>
              ))}
            </div>
            <button className="btn-primary new-group-btn" onClick={resetForm}>
              Create New Group
            </button>
          </div>
          
          {activeGroup && (
            <div className="group-details card">
              <div className="group-header">
                <div>
                  <h2>{activeGroup.name}</h2>
                  <p>Segment: {activeGroup.segmentName}</p>
                </div>
                <p className="created-date">
                  Created: {new Date(activeGroup.createdAt).toLocaleDateString()}
                </p>
              </div>
              
              <div className="participants-section">
                <h3>Participants</h3>
                <div className="participants-list">
                  {activeGroup.participants.map(participant => (
                    <div key={participant.id} className="participant-card">
                      <div className="participant-avatar">{participant.avatar}</div>
                      <div className="participant-info">
                        <h4>{participant.name}</h4>
                        <p>{participant.age} years old</p>
                        <p>{participant.location}</p>
                        <p>{participant.occupation}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="questions-section">
                <h3>Discussion Guide</h3>
                <div className="discussion-questions">
                  {activeGroup.questions.map((question, index) => (
                    <div key={index} className="discussion-question">
                      <span className="question-number">{index + 1}</span>
                      <p>{question}</p>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="group-actions">
                {!activeGroup.session ? (
                  <button 
                    className="btn-primary"
                    onClick={startFocusGroupSession}
                  >
                    Start Virtual Session
                  </button>
                ) : (
                  <div className="virtual-session">
                    <h3>Virtual Focus Group Session</h3>
                    
                    <div className="session-controls">
                      <textarea
                        placeholder="Enter a custom question or scenario to discuss..."
                        value={customStimulus}
                        onChange={(e) => setCustomStimulus(e.target.value)}
                        className="stimulus-textarea"
                        rows={3}
                      />
                      <button 
                        className="btn-primary" 
                        onClick={submitCustomStimulus}
                        disabled={isProcessingResponses || !customStimulus.trim()}
                      >
                        {isProcessingResponses ? 'Processing...' : 'Submit Question'}
                      </button>
                    </div>
                    
                    {activeGroup.session.responses.length > 0 && (
                      <div className="session-responses">
                        <div className="current-question">
                          <strong>Question:</strong> {activeGroup.session.currentQuestion}
                        </div>
                        
                        <div className="participant-responses">
                          {activeGroup.session.responses.map((response, index) => {
                            const participant = activeGroup.participants.find(
                              p => p.id === response.participantId
                            );
                            
                            return (
                              <div key={index} className="participant-response">
                                <div className="response-header">
                                  <div className="participant-avatar">{participant?.avatar}</div>
                                  <div className="participant-name">{participant?.name}</div>
                                </div>
                                <div className="response-content">
                                  {response.response}
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    )}
                  </div>
                )}
                <button className="btn-secondary">Export Discussion Guide</button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default FocusGroups;