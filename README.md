# AI-Powered Segmentation & Synthetic Qual App

A React application that uses AI to transform qualitative research into customer segmentations and generate synthetic qualitative research insights.

## Features

- **AI Research Analysis**: Enter your qualitative research findings and business context
- **AI-Powered Segmentation**: Generate meaningful customer segments without needing structured data files
- **Synthetic Qual Boards**: Create rich qualitative insights for each segment
- **Virtual Focus Groups**: Simulate focus groups with AI-generated personas based on segments

## Key Benefits

- **No quantitative data required**: Works with general qualitative research inputs
- **Depth of insights**: AI identifies nuanced characteristics, affinities, and pain points
- **Editable outputs**: Refine AI-generated segments and insights
- **Fast iteration**: Test different segmentation approaches in minutes

## Technologies Used

- React 18
- TypeScript
- React Router
- AI integration for research analysis and insight generation
- Vite for build tooling
- CSS for styling (no external UI libraries)

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn

### Installation

1. Clone the repository:
   ```
   git clone <repository-url>
   cd segmentation-app
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Start the development server:
   ```
   npm run dev
   ```

4. Open your browser and navigate to:
   ```
   http://localhost:5173
   ```

## Project Structure

```
├── src/
│   ├── components/      # React components
│   ├── data/            # Data processing and management
│   ├── services/        # API services and data fetching
│   ├── utils/           # Utility functions
│   ├── App.tsx          # Main app component
│   └── main.tsx         # Application entry point
├── public/              # Static assets
├── index.html           # HTML template
├── package.json         # Project dependencies and scripts
├── tsconfig.json        # TypeScript configuration
└── vite.config.ts       # Vite configuration
```

## Workflow

1. **Enter Research**: Input your qualitative research, industry context, and business goals
2. **Configure AI Segmentation**: Choose from behavioral, attitudinal, or needs-based segmentation approaches
3. **Generate & Refine Segments**: Create AI-powered segments and edit as needed
4. **Develop Qual Boards**: Generate detailed qualitative insights for each segment
5. **Run Virtual Focus Groups**: Test ideas with AI-generated personas representing your segments

## Common Use Cases

- Product development and feature prioritization
- Marketing strategy and campaign development
- Customer experience optimization
- Business strategy and decision making
- Market research with limited data

## Future Enhancements

- Natural language processing for research documents
- Advanced AI models for deeper insight generation
- Export capabilities for segmentation results and insights
- Interactive visualization of segment data
- Real-time collaboration for team research

## License

This project is licensed under the MIT License - see the LICENSE file for details.