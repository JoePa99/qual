import { useState, FormEvent, ChangeEvent } from 'react';
import { Link } from 'react-router-dom';
import './DataUpload.css';

interface FileData {
  name: string;
  size: number;
  type: string;
}

const DataUpload = () => {
  const [activeTab, setActiveTab] = useState('manual');
  const [researchData, setResearchData] = useState('');
  const [industry, setIndustry] = useState('');
  const [targetAudience, setTargetAudience] = useState('');
  const [projectGoals, setProjectGoals] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [dataProcessed, setDataProcessed] = useState(false);
  const [errors, setErrors] = useState({
    researchData: '',
    industry: '',
    targetAudience: '',
    files: ''
  });
  
  // For document upload
  const [files, setFiles] = useState<File[]>([]);
  const [uploadedFiles, setUploadedFiles] = useState<FileData[]>([]);

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const selectedFiles = Array.from(e.target.files);
      setFiles(prevFiles => [...prevFiles, ...selectedFiles]);
      
      const fileData: FileData[] = selectedFiles.map(file => ({
        name: file.name,
        size: file.size,
        type: file.type
      }));
      
      setUploadedFiles(prevData => [...prevData, ...fileData]);
      setErrors({...errors, files: ''});
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (e.dataTransfer.files) {
      const droppedFiles = Array.from(e.dataTransfer.files);
      setFiles(prevFiles => [...prevFiles, ...droppedFiles]);
      
      const fileData: FileData[] = droppedFiles.map(file => ({
        name: file.name,
        size: file.size,
        type: file.type
      }));
      
      setUploadedFiles(prevData => [...prevData, ...fileData]);
      setErrors({...errors, files: ''});
    }
  };

  const removeFile = (index: number) => {
    setFiles(files.filter((_, i) => i !== index));
    setUploadedFiles(uploadedFiles.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    // Validate inputs based on active tab
    let newErrors = {
      researchData: '',
      industry: industry.trim() === '' ? 'Please select an industry' : '',
      targetAudience: targetAudience.trim() === '' ? 'Please describe your target audience' : '',
      files: ''
    };
    
    if (activeTab === 'manual' && researchData.trim() === '') {
      newErrors.researchData = 'Please enter your research data';
    } else if (activeTab === 'upload' && files.length === 0) {
      newErrors.files = 'Please upload at least one research document';
    }
    
    setErrors(newErrors);
    
    if (Object.values(newErrors).some(error => error !== '')) {
      return;
    }

    setIsProcessing(true);
    
    // Simulate AI processing with a delay
    try {
      // In a real app, you would send the data to an AI service
      // If files are uploaded, you'd process them here
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      setDataProcessed(true);
    } catch (error) {
      if (activeTab === 'manual') {
        setErrors({
          ...errors,
          researchData: 'Error processing data. Please try again.'
        });
      } else {
        setErrors({
          ...errors,
          files: 'Error processing files. Please try again.'
        });
      }
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="data-upload">
      <h1>Research Input</h1>
      
      {!dataProcessed ? (
        <div className="upload-container">
          <form onSubmit={handleSubmit}>
            <div className="input-tabs">
              <div 
                className={`tab ${activeTab === 'manual' ? 'active' : ''}`}
                onClick={() => setActiveTab('manual')}
              >
                Manual Entry
              </div>
              <div 
                className={`tab ${activeTab === 'upload' ? 'active' : ''}`}
                onClick={() => setActiveTab('upload')}
              >
                Upload Documents
              </div>
            </div>
            
            <div className="form-section">
              <h3>Industry</h3>
              <select 
                value={industry} 
                onChange={(e) => setIndustry(e.target.value)}
                className="select-input"
              >
                <option value="">Select an industry</option>
                <option value="retail">Retail / E-commerce</option>
                <option value="healthcare">Healthcare</option>
                <option value="finance">Financial Services</option>
                <option value="technology">Technology</option>
                <option value="education">Education</option>
                <option value="travel">Travel & Hospitality</option>
                <option value="food">Food & Beverage</option>
                <option value="media">Media & Entertainment</option>
                <option value="automotive">Automotive</option>
                <option value="other">Other</option>
              </select>
              {errors.industry && <div className="error-message">{errors.industry}</div>}
            </div>
            
            <div className="form-section">
              <h3>Target Audience</h3>
              <input
                type="text"
                value={targetAudience}
                onChange={(e) => setTargetAudience(e.target.value)}
                placeholder="Describe your target audience (e.g., 'urban millennials', 'small business owners')"
                className="text-input"
              />
              {errors.targetAudience && <div className="error-message">{errors.targetAudience}</div>}
            </div>
            
            <div className="form-section">
              <h3>Project Goals (Optional)</h3>
              <input
                type="text"
                value={projectGoals}
                onChange={(e) => setProjectGoals(e.target.value)}
                placeholder="What are you trying to accomplish? (e.g., 'improve product design', 'refine marketing')"
                className="text-input"
              />
            </div>
            
            {activeTab === 'manual' ? (
              <div className="form-section">
                <h3>Research Data</h3>
                <p className="input-description">
                  Enter any research data you have, including surveys, interviews, market research, or general observations.
                  The AI will analyze this to generate segments and insights.
                </p>
                <textarea
                  value={researchData}
                  onChange={(e) => setResearchData(e.target.value)}
                  placeholder="Paste or type your research data here..."
                  className="textarea-input"
                  rows={10}
                />
                {errors.researchData && <div className="error-message">{errors.researchData}</div>}
              </div>
            ) : (
              <div className="form-section">
                <h3>Upload Research Documents</h3>
                <p className="input-description">
                  Upload research reports, survey results, interview transcripts, or any other documents containing customer insights.
                  Supported formats: PDF, DOCX, TXT, CSV, XLSX, PPTX.
                </p>
                
                <div 
                  className="file-drop-area"
                  onDragOver={handleDragOver}
                  onDrop={handleDrop}
                >
                  <div className="drop-icon">📄</div>
                  <p>Drag files here or <label className="file-select-label">browse<input 
                    type="file" 
                    multiple 
                    onChange={handleFileChange} 
                    className="file-input"
                    accept=".pdf,.docx,.txt,.csv,.xlsx,.pptx,.doc,.xls,.ppt"
                  /></label></p>
                </div>
                
                {uploadedFiles.length > 0 && (
                  <div className="uploaded-files">
                    <h4>Uploaded Files:</h4>
                    <ul className="file-list">
                      {uploadedFiles.map((file, index) => (
                        <li key={index} className="file-item">
                          <div className="file-info">
                            <span className="file-name">{file.name}</span>
                            <span className="file-size">({(file.size / 1024).toFixed(1)} KB)</span>
                          </div>
                          <button 
                            type="button" 
                            className="remove-file-btn" 
                            onClick={() => removeFile(index)}
                            title="Remove file"
                          >
                            ✕
                          </button>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                
                {errors.files && <div className="error-message">{errors.files}</div>}
              </div>
            )}
            
            <button 
              type="submit" 
              className="btn-primary submit-btn"
              disabled={isProcessing}
            >
              {isProcessing ? 'Processing...' : 'Process Data with AI'}
            </button>
          </form>
        </div>
      ) : (
        <div className="success-container">
          <div className="success-icon">✓</div>
          <h2>Data Processed Successfully!</h2>
          <p>Our AI has analyzed your research data and is ready to generate segments and insights.</p>
          <div className="next-actions">
            <Link to="/segmentation" className="btn-primary">
              Continue to Segmentation
            </Link>
            <button 
              className="btn-secondary" 
              onClick={() => {
                setDataProcessed(false);
                if (activeTab === 'upload') {
                  setFiles([]);
                  setUploadedFiles([]);
                }
              }}
            >
              Enter Different Data
            </button>
          </div>
        </div>
      )}
      
      <div className="upload-instructions">
        <h2>AI-Powered Analysis</h2>
        <p>Our AI can analyze your qualitative research and generate meaningful customer segments without requiring structured data files.</p>
        <ul>
          <li><strong>Two ways to input data</strong> - Type/paste text directly or upload research documents</li>
          <li><strong>Provide context</strong> - Tell us about your industry and target audience</li>
          <li><strong>Enter what you know</strong> - Include any research findings, observations, or data points</li>
          <li><strong>AI does the rest</strong> - Our system will analyze patterns and generate segments</li>
          <li><strong>Refine as needed</strong> - You can adjust the results in the segmentation step</li>
        </ul>
        <p className="instruction-note">Even unstructured or limited research data can yield valuable insights with AI assistance.</p>
      </div>
    </div>
  );
};

export default DataUpload;