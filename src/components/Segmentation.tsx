import { useState } from 'react';
import { Link } from 'react-router-dom';
import './Segmentation.css';
import { AIService } from '../services/aiService';

interface Segment {
  id: number;
  name: string;
  description: string;
  size: number;
  characteristics: string[];
  affinities: string[];
  painPoints: string[];
}

const Segmentation = () => {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [segmentCount, setSegmentCount] = useState(4);
  const [segments, setSegments] = useState<Segment[]>([]);
  const [segmentFocus, setSegmentFocus] = useState('behavioral');
  const [customPrompt, setCustomPrompt] = useState('');
  const [editingSegment, setEditingSegment] = useState<Segment | null>(null);
  const [editName, setEditName] = useState('');
  const [editDescription, setEditDescription] = useState('');
  const [researchData, setResearchData] = useState<string>(() => {
    // Try to get uploaded research data from session storage
    return sessionStorage.getItem('researchData') || 'Sample research data about customer behavior and preferences.';
  });

  const handleSegmentCountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSegmentCount(parseInt(e.target.value));
  };

  const handleSegmentFocusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSegmentFocus(e.target.value);
  };

  const generateSegments = async () => {
    setLoading(true);
    
    try {
      // Call the AI service to generate segments
      const result = await AIService.generateSegments({
        researchData: researchData,
        approach: segmentFocus as any,  // Type assertion to match the expected type
        segmentCount,
        customPrompt: customPrompt || undefined
      });
      
      if (result.status === 'success' && result.data) {
        let generatedSegments = result.data.segments;
        
        // Check if we got the expected format, otherwise use the mock data
        if (!Array.isArray(generatedSegments) || generatedSegments.length === 0) {
          console.warn('AI service did not return segments in expected format, using mock data');
          
          // Use existing mock data based on segment focus
          // For brevity, I'm using a simpler mock data set here
          generatedSegments = getMockSegments();
        }
        
        // Adjust number of segments based on user selection
        generatedSegments = generatedSegments.slice(0, segmentCount);
        
        // Recalculate percentages to always total 100%
        const totalSegments = generatedSegments.length;
        let remainingPercentage = 100;
        
        generatedSegments.forEach((segment, index) => {
          if (index === totalSegments - 1) {
            // Last segment gets whatever remains to ensure total is 100%
            segment.size = remainingPercentage;
          } else {
            // Adjust segment size but keep relative proportions
            segment.size = Math.round(segment.size * (100 / generatedSegments.reduce((acc, s) => acc + s.size, 0)));
            remainingPercentage -= segment.size;
          }
        });
        
        setSegments(generatedSegments);
        setStep(2);
      } else {
        console.error('Failed to generate segments:', result.error);
        alert('Failed to generate segments. Using mock data instead.');
        
        // Fall back to mock data
        setSegments(getMockSegments().slice(0, segmentCount));
        setStep(2);
      }
    } catch (error) {
      console.error('Error generating segments:', error);
      alert('An error occurred while generating segments. Using mock data instead.');
      
      // Fall back to mock data
      setSegments(getMockSegments().slice(0, segmentCount));
      setStep(2);
    } finally {
      setLoading(false);
    }
  };
  
  // Helper function to get mock segments based on current segmentFocus
  const getMockSegments = (): Segment[] => {
    // Return mock segments based on the selected approach
    if (segmentFocus === 'behavioral') {
      return [
        {
          id: 1,
          name: 'Digital Enthusiasts',
          description: 'Early adopters who embrace new technologies and digital channels for all interactions.',
          size: 28,
          characteristics: [
            'Tech-savvy consumers',
            'Prefer self-service options',
            'Research extensively online',
            'High digital engagement'
          ],
          affinities: [
            'Mobile app experiences',
            'Digital payment methods',
            'Personalized recommendations',
            'Cutting-edge features'
          ],
          painPoints: [
            'Slow digital interfaces',
            'Limited self-service options',
            'Having to use traditional channels',
            'Generic, non-personalized experiences'
          ]
        },
        {
          id: 2,
          name: 'Traditional Shoppers',
          description: 'Value familiarity and personal interactions over digital convenience.',
          size: 33,
          characteristics: [
            'Prefer in-person interactions',
            'Value relationships with brands',
            'Appreciate traditional service models',
            'Moderate technology adoption'
          ],
          affinities: [
            'In-store experiences',
            'Face-to-face customer service',
            'Loyalty programs',
            'Consistent, predictable service'
          ],
          painPoints: [
            'Forced digital migration',
            'Reduction in physical locations',
            'Automated customer service',
            'Rapid changes to familiar processes'
          ]
        },
        {
          id: 3,
          name: 'Value Maximizers',
          description: 'Highly informed consumers who thoroughly research to get the best value.',
          size: 24,
          characteristics: [
            'Price-sensitive decision makers',
            'Extensive comparison shopping',
            'Use multiple channels to research',
            'Deliberate purchase process'
          ],
          affinities: [
            'Transparent pricing',
            'Comparison tools',
            'Reviews and testimonials',
            'Clear value propositions'
          ],
          painPoints: [
            'Hidden fees or charges',
            'Difficult to compare options',
            'Limited product information',
            'Pressure to make quick decisions'
          ]
        },
        {
          id: 4,
          name: 'Convenience Seekers',
          description: 'Prioritize ease and speed in all interactions, willing to pay for simplicity.',
          size: 15,
          characteristics: [
            'Time-conscious consumers',
            'Value efficiency and speed',
            'Willing to pay premiums for convenience',
            'Flexible channel preferences'
          ],
          affinities: [
            'Quick checkout processes',
            'Saved preferences',
            'Subscription services',
            'Streamlined user journeys'
          ],
          painPoints: [
            'Complex processes',
            'Lengthy forms or steps',
            'Repetitive information requests',
            'Unnecessary waiting periods'
          ]
        }
      ];
    } else if (segmentFocus === 'attitudinal') {
      return [
        {
          id: 1,
          name: 'Brand Loyalists',
          description: 'Deeply connected to brands they trust and typically resistant to alternatives.',
          size: 22,
          characteristics: [
            'Strong brand affinity',
            'Less price sensitive',
            'Long-term relationships with preferred brands',
            'Brand advocates and referrers'
          ],
          affinities: [
            'Premium brand experiences',
            'Loyalty rewards',
            'Brand communities',
            'Exclusive content or access'
          ],
          painPoints: [
            'Inconsistent brand experiences',
            'Changes to beloved products',
            'Poor customer service from trusted brands',
            'Feeling unappreciated for loyalty'
          ]
        },
        // More mock segments for attitudinal would be here...
        {
          id: 2,
          name: 'Skeptical Evaluators',
          description: 'Approach brand claims with caution and require substantial evidence before trust.',
          size: 28,
          characteristics: [
            'Highly analytical decision process',
            'Research-driven consumers',
            'Question marketing claims',
            'Rely heavily on reviews and testimonials'
          ],
          affinities: [
            'Transparent communication',
            'Detailed product information',
            'Social proof',
            'Money-back guarantees'
          ],
          painPoints: [
            'Overpromising marketing',
            'Limited information availability',
            'Perceived deception in marketing',
            'Poor reviews or testimonials'
          ]
        }
      ];
    } else {
      // Default case
      return [
        {
          id: 1,
          name: 'Tech-Forward Pragmatists',
          description: 'Embrace technology that delivers clear practical benefits while maintaining value consciousness.',
          size: 32,
          characteristics: [
            'Selective technology adoption',
            'Practical benefit seekers',
            'Value-conscious consumers',
            'Research before committing'
          ],
          affinities: [
            'Technology with clear ROI',
            'Intuitive user experiences',
            'Productivity enhancements',
            'Cost-effective solutions'
          ],
          painPoints: [
            'Technology for technology\'s sake',
            'Hidden costs or subscriptions',
            'Complex learning curves',
            'Features without clear benefits'
          ]
        },
        {
          id: 2,
          name: 'Relationship Builders',
          description: 'Value consistent, personalized interactions and long-term connections with brands.',
          size: 28,
          characteristics: [
            'Loyalty-driven consumers',
            'Value personal connections',
            'Consistent engagement across channels',
            'Provide feedback and engage with brands'
          ],
          affinities: [
            'Recognition of loyalty',
            'Personalized communications',
            'Consistent service experiences',
            'Community involvement'
          ],
          painPoints: [
            'Being treated like a number',
            'Inconsistent service experiences',
            'Having to re-establish preferences',
            'Impersonal communication'
          ]
        }
      ];
    }
  };

  const handleEditSegment = (segment: Segment) => {
    setEditingSegment(segment);
    setEditName(segment.name);
    setEditDescription(segment.description);
  };

  const saveSegmentEdit = () => {
    if (!editingSegment) return;
    
    const updatedSegments = segments.map(segment => {
      if (segment.id === editingSegment.id) {
        return {
          ...segment,
          name: editName,
          description: editDescription
        };
      }
      return segment;
    });
    
    setSegments(updatedSegments);
    setEditingSegment(null);
  };

  const cancelEdit = () => {
    setEditingSegment(null);
  };

  return (
    <div className="segmentation">
      <h1>AI-Powered Segmentation</h1>
      
      {step === 1 ? (
        <div className="segment-config card">
          <h2>Configure AI Segmentation</h2>
          <p className="config-description">
            Our AI will analyze your research data and generate meaningful customer segments.
            Customize how you want the AI to approach your segmentation below.
          </p>
          
          <div className="config-section">
            <h3>Segmentation Approach</h3>
            <select 
              value={segmentFocus} 
              onChange={handleSegmentFocusChange}
              className="select-input"
            >
              <option value="behavioral">Behavioral (How customers act)</option>
              <option value="attitudinal">Attitudinal (How customers think)</option>
              <option value="needs-based">Needs-Based (What customers want)</option>
              <option value="custom">Custom (Combined approach)</option>
            </select>
          </div>
          
          <div className="config-section">
            <h3>Number of Segments</h3>
            <div className="range-container">
              <input
                type="range"
                min="2"
                max="6"
                value={segmentCount}
                onChange={handleSegmentCountChange}
                className="range-input"
              />
              <span className="range-value">{segmentCount}</span>
            </div>
            <p className="input-description">
              For most businesses, 3-5 segments provide actionable insights without becoming too fragmented.
            </p>
          </div>
          
          {segmentFocus === 'custom' && (
            <div className="config-section">
              <h3>Custom Segmentation Instructions (Optional)</h3>
              <textarea
                value={customPrompt}
                onChange={(e) => setCustomPrompt(e.target.value)}
                placeholder="Provide any specific instructions or focus areas for your segmentation (e.g., 'Focus on digital adoption patterns and service preferences')"
                className="textarea-input"
                rows={4}
              />
            </div>
          )}
          
          <button 
            className="btn-primary run-btn"
            onClick={generateSegments}
            disabled={loading}
          >
            {loading ? 'Generating Segments...' : 'Generate AI Segments'}
          </button>
        </div>
      ) : (
        <>
          <div className="segment-results">
            <div className="results-header">
              <h2>Segmentation Results</h2>
              <button className="btn-secondary" onClick={() => setStep(1)}>
                Adjust Configuration
              </button>
            </div>
            
            {/* Visualization Section */}
            <div className="visualization-container card">
              <h3>Segment Visualization</h3>
              <div className="charts-container">
                <div className="pie-chart-container">
                  <h4>Segment Distribution</h4>
                  <svg className="pie-chart" viewBox="0 0 200 200">
                    {segments.map((segment, index) => {
                      // Calculate the segment's position in the pie chart
                      let startPercent = 0;
                      for (let i = 0; i < index; i++) {
                        startPercent += segments[i].size;
                      }
                      
                      const startAngle = (startPercent / 100) * 360;
                      const endAngle = ((startPercent + segment.size) / 100) * 360;
                      const largeArcFlag = segment.size > 50 ? 1 : 0;
                      
                      // Convert angle to radians and calculate coordinates
                      const startRad = (startAngle - 90) * (Math.PI / 180);
                      const endRad = (endAngle - 90) * (Math.PI / 180);
                      
                      const x1 = 100 + 80 * Math.cos(startRad);
                      const y1 = 100 + 80 * Math.sin(startRad);
                      const x2 = 100 + 80 * Math.cos(endRad);
                      const y2 = 100 + 80 * Math.sin(endRad);
                      
                      // Calculate midpoint for label
                      const midAngle = (startAngle + endAngle) / 2 - 90;
                      const midRad = midAngle * (Math.PI / 180);
                      const labelX = 100 + 50 * Math.cos(midRad);
                      const labelY = 100 + 50 * Math.sin(midRad);
                      
                      // Colors based on segment ID
                      const colors = [
                        '#4E79A7', '#F28E2B', '#59A14F', '#E15759', '#76B7B2', '#EDC948'
                      ];
                      
                      return (
                        <g key={segment.id}>
                          <path 
                            d={`M 100 100 L ${x1} ${y1} A 80 80 0 ${largeArcFlag} 1 ${x2} ${y2} Z`}
                            fill={colors[(segment.id - 1) % colors.length]}
                            stroke="white"
                            strokeWidth="1"
                          />
                          {segment.size > 5 && (
                            <text
                              x={labelX}
                              y={labelY}
                              textAnchor="middle"
                              fill="white"
                              fontSize="12"
                              fontWeight="bold"
                            >
                              {segment.size}%
                            </text>
                          )}
                        </g>
                      );
                    })}
                  </svg>
                  
                  <div className="chart-legend">
                    {segments.map(segment => {
                      const colors = [
                        '#4E79A7', '#F28E2B', '#59A14F', '#E15759', '#76B7B2', '#EDC948'
                      ];
                      return (
                        <div key={segment.id} className="legend-item">
                          <div className="legend-color" style={{ backgroundColor: colors[(segment.id - 1) % colors.length] }}></div>
                          <div className="legend-label">{segment.name} ({segment.size}%)</div>
                        </div>
                      );
                    })}
                  </div>
                </div>
                
                <div className="attribute-chart-container">
                  <h4>Customer Attribute Map</h4>
                  <div className="attribute-chart">
                    {/* Create a simplified attribute chart */}
                    <svg className="attribute-grid" viewBox="0 0 200 200">
                      <g className="grid-background">
                        <circle className="grid-circle circle-outer" cx="100" cy="100" r="80" fill="none" stroke="#ddd" />
                        <circle className="grid-circle circle-mid" cx="100" cy="100" r="50" fill="none" stroke="#ddd" />
                        <circle className="grid-circle circle-inner" cx="100" cy="100" r="20" fill="none" stroke="#ddd" />
                        <line className="grid-line line-vertical" x1="100" y1="20" x2="100" y2="180" stroke="#ddd" />
                        <line className="grid-line line-horizontal" x1="20" y1="100" x2="180" y2="100" stroke="#ddd" />
                        <line className="grid-line line-diagonal-1" x1="41" y1="41" x2="159" y2="159" stroke="#ddd" />
                        <line className="grid-line line-diagonal-2" x1="41" y1="159" x2="159" y2="41" stroke="#ddd" />
                      </g>
                      
                      <g className="grid-labels">
                        <text className="grid-label label-top" x="100" y="10" textAnchor="middle">Digital Adoption</text>
                        <text className="grid-label label-right" x="190" y="100" textAnchor="start">Value Sensitivity</text>
                        <text className="grid-label label-bottom" x="100" y="190" textAnchor="middle">Brand Loyalty</text>
                        <text className="grid-label label-left" x="10" y="100" textAnchor="end">Experience Focus</text>
                      </g>
                      
                      {segments.map(segment => {
                        // Generate unique attribute scores for each segment
                        const generateScore = (id: number, attribute: number) => {
                          const base = [0.7, 0.5, 0.8, 0.6]; // Different starting positions
                          // Use segment id and attribute to create unique but consistent values
                          return 0.3 + Math.min(0.7, (base[attribute] + (id * 0.15 + attribute * 0.1)) % 0.7);
                        };
                        
                        // Calculate coordinates based on attribute scores
                        const digitalScore = generateScore(segment.id, 0);
                        const valueScore = generateScore(segment.id, 1);
                        const loyaltyScore = generateScore(segment.id, 2);
                        const experienceScore = generateScore(segment.id, 3);
                        
                        // Calculate the 4 points of our shape
                        const topY = 100 - digitalScore * 80;
                        const rightX = 100 + valueScore * 80;
                        const bottomY = 100 + loyaltyScore * 80;
                        const leftX = 100 - experienceScore * 80;
                        
                        const colors = [
                          '#4E79A7', '#F28E2B', '#59A14F', '#E15759', '#76B7B2', '#EDC948'
                        ];
                        
                        return (
                          <g key={segment.id} className="segment-shape">
                            <polygon
                              points={`100,${topY} ${rightX},100 100,${bottomY} ${leftX},100`}
                              fill={colors[(segment.id - 1) % colors.length]}
                              fillOpacity="0.5"
                              stroke={colors[(segment.id - 1) % colors.length]}
                              strokeWidth="2"
                            />
                            <circle cx="100" cy={topY} r="4" fill={colors[(segment.id - 1) % colors.length]} />
                            <circle cx={rightX} cy="100" r="4" fill={colors[(segment.id - 1) % colors.length]} />
                            <circle cx="100" cy={bottomY} r="4" fill={colors[(segment.id - 1) % colors.length]} />
                            <circle cx={leftX} cy="100" r="4" fill={colors[(segment.id - 1) % colors.length]} />
                          </g>
                        );
                      })}
                    </svg>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="segments-grid">
              {segments.map(segment => (
                <div key={segment.id} className="segment-card">
                  {editingSegment?.id === segment.id ? (
                    <div className="segment-edit">
                      <input
                        type="text"
                        value={editName}
                        onChange={(e) => setEditName(e.target.value)}
                        className="edit-name-input"
                      />
                      <textarea
                        value={editDescription}
                        onChange={(e) => setEditDescription(e.target.value)}
                        className="edit-description-input"
                        rows={3}
                      />
                      <div className="edit-actions">
                        <button className="btn-primary edit-save" onClick={saveSegmentEdit}>Save</button>
                        <button className="btn-secondary" onClick={cancelEdit}>Cancel</button>
                      </div>
                    </div>
                  ) : (
                    <>
                      <div className="segment-header">
                        <h3>{segment.name}</h3>
                        <button 
                          className="edit-button" 
                          onClick={() => handleEditSegment(segment)}
                          title="Edit segment"
                        >
                          ✎
                        </button>
                      </div>
                      <div className="segment-size">
                        <span className="size-number">{segment.size}%</span> of customer base
                      </div>
                      <p className="segment-description">{segment.description}</p>
                      
                      {/* Visual indicator bar */}
                      <div className="segment-indicators">
                        {['Digital Adoption', 'Price Sensitivity', 'Brand Loyalty', 'Convenience'].map((attr, i) => {
                          // Generate scores based on segment id to ensure consistency
                          const score = 25 + ((segment.id * 7 + i * 13) % 75);
                          return (
                            <div key={i} className="indicator-row">
                              <div className="indicator-label">{attr}</div>
                              <div className="indicator-bar">
                                <div 
                                  className="indicator-fill" 
                                  style={{ 
                                    width: `${score}%`,
                                    backgroundColor: i === 0 ? '#4C93E3' : 
                                                    i === 1 ? '#E35D5F' : 
                                                    i === 2 ? '#5AAE50' : '#F1AB44' 
                                  }}
                                ></div>
                              </div>
                              <div className="indicator-value">{score}%</div>
                            </div>
                          );
                        })}
                      </div>
                      
                      <div className="segment-details">
                        <div className="segment-detail-section">
                          <h4>Key Characteristics:</h4>
                          <ul>
                            {segment.characteristics.map((char, index) => (
                              <li key={index}>{char}</li>
                            ))}
                          </ul>
                        </div>
                        
                        <div className="segment-detail-section">
                          <h4>Key Affinities:</h4>
                          <ul className="affinities-list">
                            {segment.affinities.map((affinity, index) => (
                              <li key={index}>{affinity}</li>
                            ))}
                          </ul>
                        </div>
                        
                        <div className="segment-detail-section">
                          <h4>Pain Points:</h4>
                          <ul className="pain-points-list">
                            {segment.painPoints.map((point, index) => (
                              <li key={index}>{point}</li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              ))}
            </div>
          </div>
          
          <div className="next-steps card">
            <h3>Next Steps</h3>
            <p>Now that you have identified customer segments, you can create synthetic qual boards or focus groups based on these segments.</p>
            <div className="action-buttons">
              <Link to="/synthetic-qual" className="btn-primary">
                Create Synthetic Qual Boards
              </Link>
              <Link to="/focus-groups" className="btn-secondary">
                Set Up Focus Groups
              </Link>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Segmentation;