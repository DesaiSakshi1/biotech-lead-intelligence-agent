BioLeads Pro – Biotech Lead Intelligence Dashboard

BioLeads Pro is a focused B2B lead intelligence dashboard built to help biotech and pharmaceutical business development teams identify and prioritize high-intent prospects. The system combines structured lead data with a transparent scoring model to support better outreach decisions.

This project was designed from a business development point of view, not just as a technical demo.

Purpose of the Project

In biotech sales, not every contact is worth equal effort. BioLeads Pro aims to solve this by:

Collecting structured lead information relevant to life sciences

Applying a clear, explainable propensity score (0–100)

Presenting the results in a searchable and usable dashboard

The goal is to help teams focus first on people who are most likely to be interested in advanced biotech solutions.

Core Features
Lead Management

Preloaded dataset with 65+ sample leads from real biotech and pharma companies

Sortable and searchable lead table

Highlighted cards showing the top-scoring leads

Watchlist to mark and track priority prospects

Side-by-side comparison for selected leads

Propensity Scoring System

Each lead is assigned a score between 0 and 100 based on weighted business signals.
The scoring logic is intentionally simple and interpretable.

Factor	Weight	Explanation
Role Fit	25%	Seniority and decision-making authority
Company Intent	20%	Funding stage, hiring activity, expansion
Technology Match	20%	Alignment with relevant biotech tools
Location	15%	Presence in major biotech hubs
Research Activity	10%	Publications or conference presence
Engagement	10%	Simulated engagement indicators

Higher scores represent a higher likelihood of interest.

Filtering and Search

Global text search across all lead fields

Score range filter (0–100)

Filters by location, job title, and funding stage

One-click reset to clear all filters

Analytics Section

Score distribution chart to understand lead quality

Funding stage breakdown of companies

Geographic distribution of leads across biotech hubs

Contact Actions

Email action with copyable address

Phone action using direct dial

LinkedIn profile access in a new tab

Data Export

Export filtered or selected leads to CSV

Includes full lead details and scoring data

Technology Stack

Framework: Next.js (App Router)

Language: TypeScript

Styling: Tailwind CSS

UI Components: shadcn/ui

Charts: Recharts

Icons: Lucide React

State Management: React hooks

Notifications: Sonner

Project Structure
├── app/
│   ├── globals.css          # Global styles and design tokens
│   ├── layout.tsx           # Root layout and providers
│   └── page.tsx             # Main dashboard
├── components/
│   ├── analytics-section.tsx
│   ├── comparison-modal.tsx
│   ├── filters-section.tsx
│   ├── lead-card.tsx
│   ├── lead-table.tsx
│   ├── score-breakdown-modal.tsx
│   ├── scoring-legend.tsx
│   └── stats-cards.tsx
├── lib/
│   ├── lead-data.ts         # Sample lead dataset and types
│   └── utils.ts             # Utility helpers
└── README.md

Lead Data Model
interface Lead {
  id: string
  name: string
  title: string
  company: string
  email: string
  phone: string
  linkedin: string
  location: string
  propensityScore: number
  scoreBreakdown: {
    roleFit: number
    companyIntent: number
    techStack: number
    location: number
    researchActivity: number
    engagement: number
  }
  lastActivity: string
  fundingStage: string
  employeeCount: string
  techStackTags: string[]
  recentPublication: string
}

Key Metrics Shown

Total number of leads

Count of high-intent leads (score ≥ 70)

Average propensity score

Number of leads in the watchlist

Targeted Biotech Regions

The dataset focuses on established biotech clusters, including:

Cambridge, MA

South San Francisco, CA

San Diego, CA

Basel, Switzerland

Cambridge, UK

Munich, Germany

Tokyo, Japan

Dublin, Ireland

Paris, France

Stockholm, Sweden

How to Use the Dashboard
Viewing Leads

Browse all leads in the table

Sort columns as needed

Review top leads in the summary cards

Filtering

Use the search bar for quick lookups

Adjust score range to narrow focus

Filter by role, location, or funding stage

Comparing Leads

Select multiple leads

Open comparison view

Review differences side by side

Exporting

Apply filters or selections

Export data as a CSV file

Customization

Add leads: Update lib/lead-data.ts

Adjust scoring: Modify weights in scoring-legend.tsx

Styling: Change design tokens in globals.css

Notes

Lead data is sample/demo data for demonstration purposes

Email and phone actions may be limited in preview environments

Designed to be extended with real data sources or CRM integrations
Running the Project Locally

This project is designed to run entirely on a local development environment and does not require any external APIs.

Prerequisites

Ensure the following are installed on your system:

Node.js (v18 or higher recommended)

npm (included with Node.js)

Verify installation:

node -v
npm -v

Installation Steps

Clone the repository:
https://github.com/DesaiSakshi1/biotech-lead-intelligence-agent
cd biotech-lead-intelligence-agent
Install dependencies:

npm install

Start the Development Server

Run the application locally:

npm run dev


Once the server starts, open your browser and navigate to:

http://localhost:3000


The BioLeads Pro dashboard should now be running in development mode.
