import { InfrastructureProject, ProjectMilestone, Supplier, ProofOfWork } from '../types/Project';

// Generate realistic African infrastructure projects with comprehensive data
export const africanProjects: InfrastructureProject[] = [
  // SOUTH AFRICA PROJECTS
  {
    id: 'proj_001',
    name: 'Cape Town Smart City Initiative',
    description: 'Comprehensive smart city development including IoT infrastructure, renewable energy grid, and digital governance systems.',
    country: 'South Africa',
    city: 'Cape Town',
    category: 'technology',
    status: 'construction',
    totalCost: 2500000, // HBAR
    raisedAmount: 1800000,
    investors: 1247,
    startDate: '2024-01-15',
    expectedCompletion: '2026-12-31',
    imageUrl: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=600&fit=crop',
    milestones: [
      { id: 'mil_001_1', name: 'IoT Network Installation', description: 'Deploy city-wide IoT sensors and connectivity', status: 'completed', completionDate: '2024-06-30', progress: 100 },
      { id: 'mil_001_2', name: 'Renewable Energy Grid', description: 'Install solar and wind energy infrastructure', status: 'in-progress', progress: 65 },
      { id: 'mil_001_3', name: 'Digital Governance Platform', description: 'Develop citizen engagement and service delivery platform', status: 'pending', progress: 0 }
    ],
    suppliers: [
      { id: 'sup_001_1', name: 'Siemens South Africa', type: 'technology', country: 'South Africa', verificationStatus: 'verified', certifications: ['ISO 9001', 'ISO 27001'] },
      { id: 'sup_001_2', name: 'Eskom Renewable Energy', type: 'materials', country: 'South Africa', verificationStatus: 'verified', certifications: ['IEC 61400', 'ISO 14001'] }
    ],
    proofOfWork: [
      { id: 'pow_001_1', type: 'photo', title: 'IoT Sensor Installation', description: 'Completed installation of 500 IoT sensors across city', url: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&h=600&fit=crop', uploadDate: '2024-06-15', verified: true },
      { id: 'pow_001_2', type: 'report', title: 'Energy Grid Analysis', description: 'Technical analysis of renewable energy integration', url: 'https://example.com/reports/cape-town-energy-analysis.pdf', uploadDate: '2024-07-20', verified: true }
    ],
    nftContractAddress: '0.0.7054981',
    tokenId: '1',
    blockchain: 'hedera'
  },
  {
    id: 'proj_002',
    name: 'Johannesburg High-Speed Rail',
    description: 'Modern high-speed rail connecting Johannesburg to Pretoria and Soweto, reducing travel time by 70%.',
    country: 'South Africa',
    city: 'Johannesburg',
    category: 'transport',
    status: 'funding',
    totalCost: 4500000,
    raisedAmount: 2100000,
    investors: 892,
    startDate: '2024-03-01',
    expectedCompletion: '2027-06-30',
    imageUrl: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=800&h=600&fit=crop',
    milestones: [
      { id: 'mil_002_1', name: 'Route Planning & Design', description: 'Complete engineering design and environmental impact assessment', status: 'completed', completionDate: '2024-05-15', progress: 100 },
      { id: 'mil_002_2', name: 'Land Acquisition', description: 'Secure all necessary land rights and permits', status: 'in-progress', progress: 45 },
      { id: 'mil_002_3', name: 'Track Construction', description: 'Build high-speed rail infrastructure', status: 'pending', progress: 0 }
    ],
    suppliers: [
      { id: 'sup_002_1', name: 'Bombardier Transportation', type: 'construction', country: 'Canada', verificationStatus: 'verified', certifications: ['ISO 9001', 'EN 15085'] },
      { id: 'sup_002_2', name: 'Transnet Engineering', type: 'materials', country: 'South Africa', verificationStatus: 'verified', certifications: ['ISO 14001', 'OHSAS 18001'] }
    ],
    proofOfWork: [
      { id: 'pow_002_1', type: 'document', title: 'Environmental Impact Assessment', description: 'Comprehensive EIA report approved by government', url: 'https://example.com/documents/jhb-rail-eia.pdf', uploadDate: '2024-05-10', verified: true },
      { id: 'pow_002_2', type: 'video', title: 'Route Survey Drone Footage', description: 'Aerial survey of proposed rail route', url: 'https://example.com/videos/jhb-rail-survey.mp4', uploadDate: '2024-06-01', verified: true }
    ],
    nftContractAddress: '0.0.7054981',
    tokenId: '2',
    blockchain: 'hedera'
  },

  // NIGERIA PROJECTS
  {
    id: 'proj_003',
    name: 'Lagos Mega Solar Farm',
    description: '500MW solar energy farm providing clean electricity to 200,000 households in Lagos metropolitan area.',
    country: 'Nigeria',
    city: 'Lagos',
    category: 'energy',
    status: 'construction',
    totalCost: 3200000,
    raisedAmount: 2800000,
    investors: 1563,
    startDate: '2024-02-10',
    expectedCompletion: '2025-11-30',
    imageUrl: 'https://images.unsplash.com/photo-1509391366360-2e959b9eaf0b?w=800&h=600&fit=crop',
    milestones: [
      { id: 'mil_003_1', name: 'Site Preparation', description: 'Land clearing and foundation work', status: 'completed', completionDate: '2024-04-30', progress: 100 },
      { id: 'mil_003_2', name: 'Solar Panel Installation', description: 'Install 1.2 million solar panels', status: 'in-progress', progress: 40 },
      { id: 'mil_003_3', name: 'Grid Connection', description: 'Connect to national electricity grid', status: 'pending', progress: 0 }
    ],
    suppliers: [
      { id: 'sup_003_1', name: 'First Solar Inc', type: 'materials', country: 'USA', verificationStatus: 'verified', certifications: ['IEC 61215', 'IEC 61730'] },
      { id: 'sup_003_2', name: 'Lagos State Construction', type: 'construction', country: 'Nigeria', verificationStatus: 'verified', certifications: ['ISO 9001', 'ISO 14001'] }
    ],
    proofOfWork: [
      { id: 'pow_003_1', type: 'photo', title: 'Solar Panel Installation Progress', description: 'Progress photos of solar panel installation', url: 'https://images.unsplash.com/photo-1497435334941-8c899ee9e8e9?w=800&h=600&fit=crop', uploadDate: '2024-08-15', verified: true },
      { id: 'pow_003_2', type: 'report', title: 'Energy Production Forecast', description: 'Detailed energy production and distribution analysis', url: 'https://example.com/reports/lagos-solar-forecast.pdf', uploadDate: '2024-09-01', verified: true }
    ],
    nftContractAddress: '0.0.7054981',
    tokenId: '3',
    blockchain: 'hedera'
  },
  {
    id: 'proj_004',
    name: 'Abuja Digital Healthcare Network',
    description: 'Telemedicine network connecting rural clinics to major hospitals with AI-powered diagnostic tools.',
    country: 'Nigeria',
    city: 'Abuja',
    category: 'healthcare',
    status: 'planning',
    totalCost: 1800000,
    raisedAmount: 450000,
    investors: 234,
    startDate: '2024-06-01',
    expectedCompletion: '2026-03-31',
    imageUrl: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?w=800&h=600&fit=crop',
    milestones: [
      { id: 'mil_004_1', name: 'Network Infrastructure', description: 'Install high-speed internet and telemedicine equipment', status: 'pending', progress: 0 },
      { id: 'mil_004_2', name: 'AI Diagnostic System', description: 'Develop and deploy AI-powered diagnostic tools', status: 'pending', progress: 0 },
      { id: 'mil_004_3', name: 'Staff Training', description: 'Train healthcare workers on telemedicine systems', status: 'pending', progress: 0 }
    ],
    suppliers: [
      { id: 'sup_004_1', name: 'Microsoft Healthcare', type: 'technology', country: 'USA', verificationStatus: 'verified', certifications: ['HIPAA', 'ISO 27001'] },
      { id: 'sup_004_2', name: 'Nigerian Medical Association', type: 'consulting', country: 'Nigeria', verificationStatus: 'verified', certifications: ['Medical Board License'] }
    ],
    proofOfWork: [
      { id: 'pow_004_1', type: 'document', title: 'Healthcare Needs Assessment', description: 'Comprehensive assessment of rural healthcare needs', url: 'https://example.com/documents/abuja-healthcare-assessment.pdf', uploadDate: '2024-07-15', verified: true }
    ],
    nftContractAddress: '0.0.7054981',
    tokenId: '4',
    blockchain: 'hedera'
  },

  // KENYA PROJECTS
  {
    id: 'proj_005',
    name: 'Nairobi Green Housing Complex',
    description: 'Sustainable housing development with 5,000 eco-friendly units, solar power, and water recycling systems.',
    country: 'Kenya',
    city: 'Nairobi',
    category: 'housing',
    status: 'construction',
    totalCost: 2800000,
    raisedAmount: 1950000,
    investors: 678,
    startDate: '2024-01-20',
    expectedCompletion: '2026-08-31',
    imageUrl: 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800&h=600&fit=crop',
    milestones: [
      { id: 'mil_005_1', name: 'Foundation Work', description: 'Complete foundation and infrastructure', status: 'completed', completionDate: '2024-05-30', progress: 100 },
      { id: 'mil_005_2', name: 'Building Construction', description: 'Construct residential buildings', status: 'in-progress', progress: 30 },
      { id: 'mil_005_3', name: 'Green Systems Installation', description: 'Install solar panels and water recycling', status: 'pending', progress: 0 }
    ],
    suppliers: [
      { id: 'sup_005_1', name: 'Bamburi Cement', type: 'materials', country: 'Kenya', verificationStatus: 'verified', certifications: ['ISO 9001', 'ISO 14001'] },
      { id: 'sup_005_2', name: 'Safaricom Construction', type: 'construction', country: 'Kenya', verificationStatus: 'verified', certifications: ['ISO 9001', 'OHSAS 18001'] }
    ],
    proofOfWork: [
      { id: 'pow_005_1', type: 'photo', title: 'Foundation Completion', description: 'Completed foundation work for housing complex', url: 'https://images.unsplash.com/photo-1541888946425-d81bb19240f5?w=800&h=600&fit=crop', uploadDate: '2024-05-25', verified: true },
      { id: 'pow_005_2', type: 'video', title: 'Construction Progress', description: 'Monthly construction progress video', url: 'https://example.com/videos/nairobi-housing-progress.mp4', uploadDate: '2024-08-01', verified: true }
    ],
    nftContractAddress: '0.0.7054981',
    tokenId: '5',
    blockchain: 'hedera'
  },

  // EGYPT PROJECTS
  {
    id: 'proj_006',
    name: 'Cairo Metro Expansion',
    description: 'Extension of Cairo Metro system with 3 new lines connecting suburbs to city center.',
    country: 'Egypt',
    city: 'Cairo',
    category: 'transport',
    status: 'funding',
    totalCost: 5200000,
    raisedAmount: 3100000,
    investors: 1456,
    startDate: '2024-04-01',
    expectedCompletion: '2028-12-31',
    imageUrl: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=800&h=600&fit=crop',
    milestones: [
      { id: 'mil_006_1', name: 'Route Design', description: 'Complete engineering design for 3 new metro lines', status: 'completed', completionDate: '2024-07-15', progress: 100 },
      { id: 'mil_006_2', name: 'Tunnel Boring', description: 'Underground tunnel construction', status: 'in-progress', progress: 25 },
      { id: 'mil_006_3', name: 'Station Construction', description: 'Build 15 new metro stations', status: 'pending', progress: 0 }
    ],
    suppliers: [
      { id: 'sup_006_1', name: 'Alstom Transport', type: 'construction', country: 'France', verificationStatus: 'verified', certifications: ['ISO 9001', 'EN 15085'] },
      { id: 'sup_006_2', name: 'Egyptian Railways', type: 'consulting', country: 'Egypt', verificationStatus: 'verified', certifications: ['Railway Safety License'] }
    ],
    proofOfWork: [
      { id: 'pow_006_1', type: 'document', title: 'Metro Line Engineering Plans', description: 'Detailed engineering plans for new metro lines', url: 'https://example.com/documents/cairo-metro-plans.pdf', uploadDate: '2024-07-10', verified: true },
      { id: 'pow_006_2', type: 'photo', title: 'Tunnel Boring Machine', description: 'TBM installation and initial boring progress', url: 'https://images.unsplash.com/photo-1581094794329-c8112a89af12?w=800&h=600&fit=crop', uploadDate: '2024-08-20', verified: true }
    ],
    nftContractAddress: '0.0.7054981',
    tokenId: '6',
    blockchain: 'hedera'
  },

  // MOROCCO PROJECTS
  {
    id: 'proj_007',
    name: 'Casablanca Wind Energy Farm',
    description: '300MW offshore wind farm providing clean energy to Casablanca industrial zone.',
    country: 'Morocco',
    city: 'Casablanca',
    category: 'energy',
    status: 'construction',
    totalCost: 3800000,
    raisedAmount: 2900000,
    investors: 1123,
    startDate: '2024-03-15',
    expectedCompletion: '2026-09-30',
    imageUrl: 'https://images.unsplash.com/photo-1466611653911-95081537e5b7?w=800&h=600&fit=crop',
    milestones: [
      { id: 'mil_007_1', name: 'Offshore Foundation', description: 'Install offshore wind turbine foundations', status: 'in-progress', progress: 55 },
      { id: 'mil_007_2', name: 'Turbine Installation', description: 'Install 50 offshore wind turbines', status: 'pending', progress: 0 },
      { id: 'mil_007_3', name: 'Grid Connection', description: 'Connect to national electricity grid', status: 'pending', progress: 0 }
    ],
    suppliers: [
      { id: 'sup_007_1', name: 'Vestas Wind Systems', type: 'materials', country: 'Denmark', verificationStatus: 'verified', certifications: ['IEC 61400', 'ISO 9001'] },
      { id: 'sup_007_2', name: 'Moroccan Energy Company', type: 'construction', country: 'Morocco', verificationStatus: 'verified', certifications: ['ISO 14001', 'OHSAS 18001'] }
    ],
    proofOfWork: [
      { id: 'pow_007_1', type: 'photo', title: 'Offshore Foundation Installation', description: 'Progress photos of offshore foundation work', url: 'https://images.unsplash.com/photo-1466611653911-95081537e5b7?w=800&h=600&fit=crop', uploadDate: '2024-08-10', verified: true },
      { id: 'pow_007_2', type: 'report', title: 'Environmental Impact Study', description: 'Comprehensive environmental impact assessment', url: 'https://example.com/reports/casablanca-wind-eia.pdf', uploadDate: '2024-07-05', verified: true }
    ],
    nftContractAddress: '0.0.7054981',
    tokenId: '7',
    blockchain: 'hedera'
  },

  // GHANA PROJECTS
  {
    id: 'proj_008',
    name: 'Accra Smart Water Management',
    description: 'IoT-based water distribution system with leak detection and automated billing.',
    country: 'Ghana',
    city: 'Accra',
    category: 'water',
    status: 'funding',
    totalCost: 1200000,
    raisedAmount: 680000,
    investors: 445,
    startDate: '2024-05-01',
    expectedCompletion: '2025-12-31',
    imageUrl: 'https://images.unsplash.com/photo-1581094794329-c8112a89af12?w=800&h=600&fit=crop',
    milestones: [
      { id: 'mil_008_1', name: 'Sensor Network', description: 'Install IoT sensors across water distribution network', status: 'pending', progress: 0 },
      { id: 'mil_008_2', name: 'Control System', description: 'Develop automated water management system', status: 'pending', progress: 0 },
      { id: 'mil_008_3', name: 'Customer Portal', description: 'Create customer billing and monitoring portal', status: 'pending', progress: 0 }
    ],
    suppliers: [
      { id: 'sup_008_1', name: 'Honeywell Process Solutions', type: 'technology', country: 'USA', verificationStatus: 'verified', certifications: ['ISO 9001', 'ISO 27001'] },
      { id: 'sup_008_2', name: 'Ghana Water Company', type: 'consulting', country: 'Ghana', verificationStatus: 'verified', certifications: ['Water Utility License'] }
    ],
    proofOfWork: [
      { id: 'pow_008_1', type: 'document', title: 'Water Network Analysis', description: 'Current water distribution network analysis', url: 'https://example.com/documents/accra-water-analysis.pdf', uploadDate: '2024-06-15', verified: true }
    ],
    nftContractAddress: '0.0.7054981',
    tokenId: '8',
    blockchain: 'hedera'
  },

  // ETHIOPIA PROJECTS
  {
    id: 'proj_009',
    name: 'Addis Ababa Digital Education Hub',
    description: 'Technology-enabled learning centers with high-speed internet and digital curriculum.',
    country: 'Ethiopia',
    city: 'Addis Ababa',
    category: 'education',
    status: 'planning',
    totalCost: 900000,
    raisedAmount: 180000,
    investors: 156,
    startDate: '2024-07-01',
    expectedCompletion: '2026-06-30',
    imageUrl: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=800&h=600&fit=crop',
    milestones: [
      { id: 'mil_009_1', name: 'Infrastructure Setup', description: 'Install internet connectivity and computer labs', status: 'pending', progress: 0 },
      { id: 'mil_009_2', name: 'Digital Curriculum', description: 'Develop localized digital learning content', status: 'pending', progress: 0 },
      { id: 'mil_009_3', name: 'Teacher Training', description: 'Train educators on digital teaching methods', status: 'pending', progress: 0 }
    ],
    suppliers: [
      { id: 'sup_009_1', name: 'Microsoft Education', type: 'technology', country: 'USA', verificationStatus: 'verified', certifications: ['ISO 27001', 'FERPA'] },
      { id: 'sup_009_2', name: 'Ethiopian Ministry of Education', type: 'consulting', country: 'Ethiopia', verificationStatus: 'verified', certifications: ['Education License'] }
    ],
    proofOfWork: [
      { id: 'pow_009_1', type: 'document', title: 'Education Needs Assessment', description: 'Assessment of digital education needs in Addis Ababa', url: 'https://example.com/documents/addis-education-assessment.pdf', uploadDate: '2024-07-20', verified: true }
    ],
    nftContractAddress: '0.0.7054981',
    tokenId: '9',
    blockchain: 'hedera'
  },

  // TANZANIA PROJECTS
  {
    id: 'proj_010',
    name: 'Dar es Salaam Port Modernization',
    description: 'Modernize Tanzania\'s largest port with automated systems and expanded capacity.',
    country: 'Tanzania',
    city: 'Dar es Salaam',
    category: 'transport',
    status: 'construction',
    totalCost: 4200000,
    raisedAmount: 3200000,
    investors: 987,
    startDate: '2024-02-01',
    expectedCompletion: '2027-03-31',
    imageUrl: 'https://images.unsplash.com/photo-1581094794329-c8112a89af12?w=800&h=600&fit=crop',
    milestones: [
      { id: 'mil_010_1', name: 'Port Expansion', description: 'Expand port facilities and berths', status: 'in-progress', progress: 35 },
      { id: 'mil_010_2', name: 'Automation Systems', description: 'Install automated cargo handling systems', status: 'pending', progress: 0 },
      { id: 'mil_010_3', name: 'Digital Port Management', description: 'Implement digital port management platform', status: 'pending', progress: 0 }
    ],
    suppliers: [
      { id: 'sup_010_1', name: 'Port of Singapore Authority', type: 'consulting', country: 'Singapore', verificationStatus: 'verified', certifications: ['ISO 9001', 'Port Management License'] },
      { id: 'sup_010_2', name: 'Tanzania Ports Authority', type: 'construction', country: 'Tanzania', verificationStatus: 'verified', certifications: ['ISO 14001', 'OHSAS 18001'] }
    ],
    proofOfWork: [
      { id: 'pow_010_1', type: 'photo', title: 'Port Expansion Progress', description: 'Progress photos of port expansion work', url: 'https://images.unsplash.com/photo-1581094794329-c8112a89af12?w=800&h=600&fit=crop', uploadDate: '2024-08-05', verified: true },
      { id: 'pow_010_2', type: 'report', title: 'Port Capacity Analysis', description: 'Detailed analysis of port capacity and efficiency improvements', url: 'https://example.com/reports/dar-port-analysis.pdf', uploadDate: '2024-07-30', verified: true }
    ],
    nftContractAddress: '0.0.7054981',
    tokenId: '10',
    blockchain: 'hedera'
  }
];

// Generate additional projects to reach 50 total
const additionalProjects: InfrastructureProject[] = [
  // More projects across different African countries...
  {
    id: 'proj_011',
    name: 'Kampala Urban Agriculture Initiative',
    description: 'Vertical farming and urban agriculture program providing fresh produce to 100,000 residents.',
    country: 'Uganda',
    city: 'Kampala',
    category: 'agriculture',
    status: 'funding',
    totalCost: 800000,
    raisedAmount: 320000,
    investors: 234,
    startDate: '2024-06-15',
    expectedCompletion: '2025-12-31',
    imageUrl: 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=800&h=600&fit=crop',
    milestones: [
      { id: 'mil_011_1', name: 'Vertical Farm Construction', description: 'Build 20 vertical farming facilities', status: 'pending', progress: 0 },
      { id: 'mil_011_2', name: 'Seed Distribution', description: 'Distribute seeds and farming equipment', status: 'pending', progress: 0 },
      { id: 'mil_011_3', name: 'Training Program', description: 'Train urban farmers on vertical farming techniques', status: 'pending', progress: 0 }
    ],
    suppliers: [
      { id: 'sup_011_1', name: 'AeroFarms', type: 'technology', country: 'USA', verificationStatus: 'verified', certifications: ['ISO 9001', 'Organic Certification'] },
      { id: 'sup_011_2', name: 'Uganda Ministry of Agriculture', type: 'consulting', country: 'Uganda', verificationStatus: 'verified', certifications: ['Agricultural License'] }
    ],
    proofOfWork: [
      { id: 'pow_011_1', type: 'document', title: 'Urban Agriculture Feasibility Study', description: 'Comprehensive feasibility study for urban agriculture', url: 'https://example.com/documents/kampala-agriculture-study.pdf', uploadDate: '2024-07-01', verified: true }
    ],
    nftContractAddress: '0.0.7054981',
    tokenId: '11',
    blockchain: 'hedera'
  }
];

// Combine all projects
export const allProjects = [...africanProjects, ...additionalProjects];

// Generate remaining projects programmatically to reach 50
const generateRemainingProjects = (): InfrastructureProject[] => {
  const countries = ['Algeria', 'Angola', 'Botswana', 'Burkina Faso', 'Cameroon', 'Chad', 'Congo', 'Côte d\'Ivoire', 'Djibouti', 'Eritrea', 'Gabon', 'Guinea', 'Liberia', 'Libya', 'Madagascar', 'Malawi', 'Mali', 'Mauritania', 'Mauritius', 'Mozambique', 'Namibia', 'Niger', 'Rwanda', 'Senegal', 'Sierra Leone', 'Somalia', 'Sudan', 'Tunisia', 'Zambia', 'Zimbabwe'];
  const cities = ['Algiers', 'Luanda', 'Gaborone', 'Ouagadougou', 'Yaoundé', 'N\'Djamena', 'Brazzaville', 'Abidjan', 'Djibouti', 'Asmara', 'Libreville', 'Conakry', 'Monrovia', 'Tripoli', 'Antananarivo', 'Lilongwe', 'Bamako', 'Nouakchott', 'Port Louis', 'Maputo', 'Windhoek', 'Niamey', 'Kigali', 'Dakar', 'Freetown', 'Mogadishu', 'Khartoum', 'Tunis', 'Lusaka', 'Harare'];
  const categories: Array<'transport' | 'energy' | 'healthcare' | 'education' | 'housing' | 'technology' | 'water' | 'agriculture'> = ['transport', 'energy', 'healthcare', 'education', 'housing', 'technology', 'water', 'agriculture'];
  const statuses: Array<'planning' | 'funding' | 'construction' | 'completed'> = ['planning', 'funding', 'construction', 'completed'];

  const projects: InfrastructureProject[] = [];
  
  for (let i = 12; i <= 50; i++) {
    const countryIndex = (i - 12) % countries.length;
    const cityIndex = (i - 12) % cities.length;
    const categoryIndex = (i - 12) % categories.length;
    const statusIndex = (i - 12) % statuses.length;
    
    const project: InfrastructureProject = {
      id: `proj_${i.toString().padStart(3, '0')}`,
      name: `${cities[cityIndex]} ${categories[categoryIndex].charAt(0).toUpperCase() + categories[categoryIndex].slice(1)} Initiative`,
      description: `Comprehensive ${categories[categoryIndex]} development project in ${cities[cityIndex]}, ${countries[countryIndex]}.`,
      country: countries[countryIndex],
      city: cities[cityIndex],
      category: categories[categoryIndex],
      status: statuses[statusIndex],
      totalCost: Math.floor(Math.random() * 4000000) + 500000,
      raisedAmount: Math.floor(Math.random() * 2000000) + 100000,
      investors: Math.floor(Math.random() * 1500) + 100,
      startDate: '2024-01-01',
      expectedCompletion: '2026-12-31',
      imageUrl: `https://source.unsplash.com/featured/800x600?infrastructure,${categories[categoryIndex]},${cities[cityIndex]}`,
      milestones: [
        { id: `mil_${i}_1`, name: 'Project Planning', description: 'Complete project planning and design', status: 'completed', completionDate: '2024-03-15', progress: 100 },
        { id: `mil_${i}_2`, name: 'Implementation Phase', description: 'Begin project implementation', status: 'in-progress', progress: Math.floor(Math.random() * 80) + 10 },
        { id: `mil_${i}_3`, name: 'Project Completion', description: 'Complete project and handover', status: 'pending', progress: 0 }
      ],
      suppliers: [
        { id: `sup_${i}_1`, name: `${countries[countryIndex]} Construction Co.`, type: 'construction', country: countries[countryIndex], verificationStatus: 'verified', certifications: ['ISO 9001', 'ISO 14001'] },
        { id: `sup_${i}_2`, name: 'International Partners Ltd.', type: 'consulting', country: 'International', verificationStatus: 'verified', certifications: ['ISO 9001'] }
      ],
      proofOfWork: [
        { id: `pow_${i}_1`, type: 'document', title: 'Project Feasibility Study', description: 'Comprehensive feasibility study', url: `https://example.com/documents/project-${i}-feasibility.pdf`, uploadDate: '2024-03-01', verified: true },
        { id: `pow_${i}_2`, type: 'photo', title: 'Project Progress', description: 'Progress photos of project implementation', url: `https://source.unsplash.com/featured/800x600?construction,${categories[categoryIndex]},${cities[cityIndex]}`, uploadDate: '2024-08-01', verified: true }
      ],
      nftContractAddress: '0.0.7054981',
      tokenId: i.toString(),
      blockchain: 'hedera'
    };
    
    projects.push(project);
  }
  
  return projects;
};

export const completeProjectList = [...allProjects, ...generateRemainingProjects()];

// Curated, realistic image overrides for marquee projects
const curatedImageByKeyword: Array<{ keyword: string; url: string }> = [
  { keyword: 'Tunis', url: 'https://images.unsplash.com/photo-1491553895911-0055eca6402d?w=1200&h=800&fit=crop' },
  { keyword: 'Port', url: 'https://images.unsplash.com/photo-1534766555764-acc1f3a83f31?w=1200&h=800&fit=crop' },
  { keyword: 'Libya', url: 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?w=1200&h=800&fit=crop' },
  { keyword: 'Mohammed VI', url: 'https://images.unsplash.com/photo-1501594907352-04cda38ebc29?w=1200&h=800&fit=crop' },
  { keyword: 'Ouarzazate', url: 'https://images.unsplash.com/photo-1509395176047-4a66953fd231?w=1200&h=800&fit=crop' },
  { keyword: 'Ethiopian', url: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?w=1200&h=800&fit=crop' },
  { keyword: 'Tangier', url: 'https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?w=1200&h=800&fit=crop' }
];

// User-provided public domain/commons images as robust fallbacks
// Use Wikimedia Special:FilePath to resolve the actual image bytes
const WIKI_IMAGES: string[] = [
  'https://commons.wikimedia.org/wiki/Special:FilePath/South_Africa-Metrorail-001.jpg',
  'https://commons.wikimedia.org/wiki/Special:FilePath/Rail%20transportation.jpg',
  'https://commons.wikimedia.org/wiki/Special:FilePath/SouthernAfricaRailwayMap_1901.png',
  'https://commons.wikimedia.org/wiki/Special:FilePath/Africa_railway_map_gauge.jpg',
  'https://commons.wikimedia.org/wiki/Special:FilePath/Africa_Smart_%26_Sustainable_Cities_Investment_Summit.jpg',
  'https://commons.wikimedia.org/wiki/Special:FilePath/Components_of_Smart_City.png',
  'https://commons.wikimedia.org/wiki/Special:FilePath/Railway_Map_of_South_Africa.jpg',
  'https://commons.wikimedia.org/wiki/Special:FilePath/Railroad_map_of_Africa._LOC_2009583214.jpg',
  'https://commons.wikimedia.org/wiki/Special:FilePath/Political_map_of_Africa_showing_international_boundaries_and_railways_%285003768%29.jpg',
  'https://commons.wikimedia.org/wiki/Special:FilePath/South_Africa_railways_map_1910.svg',
  'https://commons.wikimedia.org/wiki/Special:FilePath/Smart_City.jpg',
  'https://commons.wikimedia.org/wiki/Special:FilePath/SouthernAfricaRailwayMap_1901.png',
  'https://commons.wikimedia.org/wiki/Special:FilePath/Cairo%20Metro%20Line%203%20train.jpg',
  'https://commons.wikimedia.org/wiki/Special:FilePath/Wind%20turbines%20in%20Morocco.jpg',
  'https://commons.wikimedia.org/wiki/Special:FilePath/Solar%20panels%20in%20Africa.jpg',
  'https://commons.wikimedia.org/wiki/Special:FilePath/Accra%20water%20treatment%20plant.jpg',
  'https://commons.wikimedia.org/wiki/Special:FilePath/Addis%20Ababa%20university%20campus.jpg',
  'https://commons.wikimedia.org/wiki/Special:FilePath/Dar%20es%20Salaam%20port.jpg',
  'https://commons.wikimedia.org/wiki/Special:FilePath/Nairobi%20housing%20estate.jpg',
  'https://commons.wikimedia.org/wiki/Special:FilePath/Lusaka%20skyline.jpg'
];

function hashIdToIndex(id: string, mod: number): number {
  let h = 0;
  for (let i = 0; i < id.length; i++) h = (h * 31 + id.charCodeAt(i)) >>> 0;
  return h % mod;
}

function categoryKeywords(category: InfrastructureProject['category']): string {
  switch (category) {
    case 'transport': return 'railway,metro,high speed rail,africa,city,station';
    case 'energy': return 'solar farm,wind,grid,substation,africa,clean energy';
    case 'healthcare': return 'hospital,clinic,healthcare,medical,africa';
    case 'education': return 'university,campus,school,education,africa';
    case 'housing': return 'housing,apartments,skyline,real estate,africa';
    case 'technology': return 'smart city,data center,fiber,iot,ai,africa';
    case 'water': return 'dam,water plant,desalination,utilities,africa';
    case 'agriculture': return 'agriculture,farms,greenhouse,vertical farming,africa';
    default: return 'infrastructure,smart city,africa';
  }
}

function generateProjectImage(p: InfrastructureProject): string {
  // Strict industry images per user request
  const byCategory: Partial<Record<InfrastructureProject['category'], string>> = {
    water: 'https://scwcontent.affino.com/AcuCustom/Sitename/DAM/048/wastewater_plant3_smart_cities_Adobe_102ldc8lyrro51.jpg',
    education: 'https://content-files.shure.com/CaseStudies/microflex-advance-intellimix-omi-high-school/images/ja/microflex-advance-intellimix-omi-high-school_header.png',
    housing: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT9CZILIBuorZosq8xz2lVdhayHWZiQVDwLjmHEW67x0iXxPHCS3Tfe4O9nKTmMaWU7Kus&usqp=CAU',
    technology: 'https://constructionreviewonline.com/wp-content/uploads/2020/12/Smart-cities-Singapore.jpg',
    transport: 'https://www.railwaypro.com/wp/wp-content/uploads/2025/07/European-metro.jpg',
  };
  if (/solar/i.test(p.name) || /solar/i.test(p.description)) {
    return 'https://media.admiddleeast.com/photos/666232910ee5dd076d618cca/4:3/w_4756,h_3567,c_limit/GettyImages-1492364934.jpg';
  }
  const fixed = byCategory[p.category as keyof typeof byCategory];
  if (fixed) return fixed;
  // Fallback deterministic Wikimedia
  return WIKI_IMAGES[hashIdToIndex(p.id, WIKI_IMAGES.length)];
}

completeProjectList.forEach(p => {
  // Assign tailored image for ALL projects
  p.imageUrl = generateProjectImage(p);
});

// Merge dynamic overrides (e.g., funds raised) from localStorage with the static list
export function getCompleteProjectList(): InfrastructureProject[] {
  try {
    const base = completeProjectList.map(p => ({ ...p }));
    const raw = localStorage.getItem('ethereus_project_overrides');
    if (!raw) return base;
    const overrides: Record<string, Partial<InfrastructureProject>> = JSON.parse(raw);
    const merged = base.map(p => overrides[p.id] ? { ...p, ...overrides[p.id] } : p);
    // Ensure image assignment persists after merge
    for (const proj of merged) {
      if (!proj.imageUrl) proj.imageUrl = generateProjectImage(proj);
    }
    return merged;
  } catch {
    return completeProjectList;
  }
}

export function validateProjectImages(projects: InfrastructureProject[]): { ok: boolean; missing: string[] } {
  const missing: string[] = [];
  for (const p of projects) {
    if (!p.imageUrl || typeof p.imageUrl !== 'string' || !p.imageUrl.startsWith('http')) {
      missing.push(p.id);
    }
  }
  return { ok: missing.length === 0, missing };
}
