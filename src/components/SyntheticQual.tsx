import { useState } from 'react';
import { Link } from 'react-router-dom';
import './SyntheticQual.css';

interface Segment {
  id: number;
  name: string;
}

interface QualBoard {
  id: number;
  segmentId: number;
  segmentName: string;
  createdAt: string;
  insights: string[];
  verbatims: string[];
  stimuli: {
    prompt: string;
    responses: string[];
  }[];
}

const SyntheticQual = () => {
  const [selectedSegment, setSelectedSegment] = useState<number | null>(null);
  const [qualBoards, setQualBoards] = useState<QualBoard[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [showBoard, setShowBoard] = useState<number | null>(null);
  const [newStimulus, setNewStimulus] = useState('');
  const [isProcessingStimulus, setIsProcessingStimulus] = useState(false);
  
  // Mock segments from segmentation results
  const segments: Segment[] = [
    { id: 1, name: 'Young Professionals' },
    { id: 2, name: 'Suburban Families' },
    { id: 3, name: 'Value Seekers' },
    { id: 4, name: 'Luxury Enthusiasts' },
  ];
  
  const handleSegmentSelect = (segmentId: number) => {
    setSelectedSegment(segmentId);
  };
  
  const generateQualBoard = async () => {
    if (!selectedSegment) return;
    
    setIsGenerating(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    const selectedSegmentObj = segments.find(s => s.id === selectedSegment);
    
    if (!selectedSegmentObj) {
      setIsGenerating(false);
      return;
    }
    
    // Generate insights and verbatims based on selected segment
    let insights: string[] = [];
    let verbatims: string[] = [];
    
    if (selectedSegment === 1) { // Young Professionals
      insights = [
        'Strongly prefer mobile-first experiences',
        'Highly responsive to personalized recommendations',
        'Value convenience and speed over price',
        'Often make purchases during commute hours',
        'Look for socially responsible brands'
      ];
      verbatims = [
        '"I don\'t have time to browse through a lot of options. Just show me what I need."',
        '"My phone is basically an extension of my arm at this point. If I can\'t do it on mobile, I probably won\'t do it."',
        '"I\'m willing to pay more for convenience and quality. My time is valuable."',
        '"I like brands that reflect my values and make me feel good about my purchase."',
        '"I want a seamless experience from discovery to purchase to delivery."'
      ];
    } else if (selectedSegment === 2) { // Suburban Families
      insights = [
        'Prioritize value and durability',
        'Research extensively before purchasing',
        'Strong preference for reviews from similar families',
        'Responsive to family-oriented promotions',
        'Appreciate flexible return policies'
      ];
      verbatims = [
        '"With kids, I need products that last. I can\'t be replacing things every few months."',
        '"I usually check at least 3-4 websites before making a larger purchase."',
        '"I want to see reviews from other parents who understand my situation."',
        '"Our family budget is always top of mind, but I\'ll invest more in things we use daily."',
        '"I shop online for convenience but often pick up in-store to avoid shipping fees."'
      ];
    } else if (selectedSegment === 3) { // Value Seekers
      insights = [
        'Highly price-sensitive and deal-driven',
        'Willing to wait for sales or promotions',
        'Often compare across multiple retailers',
        'Low brand loyalty if better prices are available',
        'Responsive to loyalty programs with tangible savings'
      ];
      verbatims = [
        '"I never buy anything full price if I can help it."',
        '"I use price comparison apps for almost everything I buy."',
        '"I\'m not loyal to brands; I\'m loyal to my wallet."',
        '"I\'ll drive an extra 15 minutes to save $10-20 on a purchase."',
        '"I sign up for every loyalty program and actually use them."'
      ];
    } else if (selectedSegment === 4) { // Luxury Enthusiasts
      insights = [
        'Value exclusivity and premium experiences',
        'Highly responsive to limited editions',
        'Willing to pay premium for personalized service',
        'Research brand heritage and craftsmanship',
        'Expect seamless omnichannel experience'
      ];
      verbatims = [
        '"I\'m not just buying a product; I\'m investing in an experience."',
        '"I appreciate attention to detail and craftsmanship in everything I purchase."',
        '"I want to feel like the brand understands my specific preferences."',
        '"Limited editions and exclusive releases always catch my attention."',
        '"I expect the same level of service whether I\'m shopping online or in-store."'
      ];
    }
    
    const newQualBoard: QualBoard = {
      id: Date.now(),
      segmentId: selectedSegment,
      segmentName: selectedSegmentObj.name,
      createdAt: new Date().toISOString(),
      insights,
      verbatims,
      stimuli: []
    };
    
    setQualBoards([...qualBoards, newQualBoard]);
    setIsGenerating(false);
    setShowBoard(newQualBoard.id);
  };
  
  const getSelectedBoardData = () => {
    if (showBoard === null) return null;
    return qualBoards.find(board => board.id === showBoard) || null;
  };
  
  const handleStimulusSubmit = async () => {
    if (!newStimulus.trim() || !selectedBoard) return;
    
    setIsProcessingStimulus(true);
    
    // Simulate API call to get responses from AI
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Generate different responses based on segment
    let responses: string[] = [];
    const segmentId = selectedBoard.segmentId;
    
    if (segmentId === 1) { // Young Professionals
      responses = [
        `As a young professional, I think about ${newStimulus} quite often. I'd say my approach is digital-first and efficiency-oriented.`,
        `When it comes to ${newStimulus}, I'm looking for solutions that save me time and integrate with my existing tech ecosystem.`,
        `${newStimulus} matters to me, but I need it to be accessible on-the-go. I make most decisions on my phone while commuting or between meetings.`,
        `I value brands that understand ${newStimulus} should be part of a seamless experience that respects my time and offers personalization.`,
        `For ${newStimulus}, I'm willing to pay more for quality and convenience. I often ask my network for recommendations before making decisions.`
      ];
    } else if (segmentId === 2) { // Suburban Families
      responses = [
        `As a parent, ${newStimulus} is something I consider carefully because it affects the whole family. Safety and reliability are my top priorities.`,
        `When we discuss ${newStimulus} in our household, we're always thinking about value and durability - will this last through multiple kids?`,
        `I research ${newStimulus} extensively online, reading reviews from other parents before making any decisions. Word-of-mouth from other families also matters a lot.`,
        `For our family, ${newStimulus} has to fit within our budget but still meet quality standards. We're willing to invest more in things we use daily.`,
        `With ${newStimulus}, I'm looking for family-friendly options that consider the needs of different age groups and make our busy lives easier.`
      ];
    } else if (segmentId === 3) { // Value Seekers
      responses = [
        `When it comes to ${newStimulus}, I always look for the best deal. I compare prices across multiple websites and use coupon apps.`,
        `I'm not loyal to any particular brand for ${newStimulus} - I go wherever offers the best value and lowest price at the time.`,
        `For ${newStimulus}, I'm willing to wait for seasonal sales or special promotions before making a purchase. Patience saves money.`,
        `I often buy ${newStimulus} at discount stores or look for second-hand options first. It's about being smart with my money.`,
        `With ${newStimulus}, I track prices over time and have price alerts set up. I never buy at full price if I can help it.`
      ];
    } else if (segmentId === 4) { // Luxury Enthusiasts
      responses = [
        `For ${newStimulus}, I look for exceptional quality and craftsmanship. Mass-market options simply don't meet my standards.`,
        `When considering ${newStimulus}, I research the heritage and story behind the product or service. Authenticity and exclusivity matter to me.`,
        `I view ${newStimulus} as an investment, not just a purchase. I expect personalized service and attention to detail throughout the experience.`,
        `With ${newStimulus}, I'm drawn to limited editions and unique offerings that reflect my personal taste and status.`,
        `I want the experience of ${newStimulus} to be seamless across all channels - whether I'm shopping online, on my phone, or in a boutique.`
      ];
    }
    
    // Update the board with new stimulus and responses
    const updatedBoards = qualBoards.map(board => {
      if (board.id === selectedBoard.id) {
        return {
          ...board,
          stimuli: [
            ...board.stimuli,
            {
              prompt: newStimulus,
              responses
            }
          ]
        };
      }
      return board;
    });
    
    setQualBoards(updatedBoards);
    setNewStimulus('');
    setIsProcessingStimulus(false);
  };
  
  const selectedBoard = getSelectedBoardData();
  
  return (
    <div className="synthetic-qual">
      <h1>Synthetic Qual Boards</h1>
      
      <div className="qual-container">
        <div className="board-generation card">
          <h2>Generate New Qual Board</h2>
          <p>Select a customer segment and generate synthetic qualitative insights.</p>
          
          <div className="segment-selection">
            <h3>Select Segment</h3>
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
          
          <button 
            className="btn-primary generate-btn"
            onClick={generateQualBoard}
            disabled={isGenerating || selectedSegment === null}
          >
            {isGenerating ? 'Generating...' : 'Generate Qual Board'}
          </button>
        </div>
        
        <div className="boards-list">
          <h2>Your Qual Boards</h2>
          {qualBoards.length === 0 ? (
            <p className="no-boards">No qual boards generated yet.</p>
          ) : (
            <div className="boards-grid">
              {qualBoards.map(board => (
                <div 
                  key={board.id} 
                  className={`board-card ${showBoard === board.id ? 'active' : ''}`}
                  onClick={() => setShowBoard(board.id)}
                >
                  <h3>{board.segmentName}</h3>
                  <p className="created-date">
                    Created: {new Date(board.createdAt).toLocaleDateString()}
                  </p>
                  <div className="board-preview">
                    <span>{board.insights.length} insights</span>
                    <span>{board.verbatims.length} verbatims</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      
      {selectedBoard && (
        <div className="board-details card">
          <div className="board-header">
            <h2>{selectedBoard.segmentName} Insights</h2>
            <button className="btn-secondary" onClick={() => setShowBoard(null)}>
              Close Board
            </button>
          </div>
          
          <div className="board-content">
            <div className="insights-section">
              <h3>Key Insights</h3>
              <ul className="insights-list">
                {selectedBoard.insights.map((insight, index) => (
                  <li key={index}>{insight}</li>
                ))}
              </ul>
            </div>
            
            <div className="verbatims-section">
              <h3>Representative Verbatims</h3>
              <div className="verbatims-list">
                {selectedBoard.verbatims.map((verbatim, index) => (
                  <div key={index} className="verbatim-item">
                    {verbatim}
                  </div>
                ))}
              </div>
            </div>

            <div className="stimulus-section">
              <h3>Interactive Stimulus</h3>
              <div className="stimulus-input">
                <textarea
                  placeholder="Enter a prompt, scenario, or question to ask this segment..."
                  value={newStimulus}
                  onChange={(e) => setNewStimulus(e.target.value)}
                  className="stimulus-textarea"
                  rows={3}
                />
                <button 
                  className="btn-primary" 
                  onClick={handleStimulusSubmit}
                  disabled={isProcessingStimulus || !newStimulus.trim()}
                >
                  {isProcessingStimulus ? 'Processing...' : 'Submit Stimulus'}
                </button>
              </div>
              
              {selectedBoard.stimuli.length > 0 && (
                <div className="stimuli-responses">
                  {selectedBoard.stimuli.map((stimulus, index) => (
                    <div key={index} className="stimulus-response-group">
                      <div className="stimulus-prompt">
                        <strong>Prompt:</strong> {stimulus.prompt}
                      </div>
                      <div className="stimulus-responses">
                        {stimulus.responses.map((response, respIndex) => (
                          <div key={respIndex} className="response-item">
                            <div className="response-avatar">👤</div>
                            <div className="response-text">{response}</div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
          
          <div className="board-actions">
            <Link to="/focus-groups" className="btn-primary">
              Create Focus Group with this Segment
            </Link>
          </div>
        </div>
      )}
    </div>
  );
};

export default SyntheticQual;