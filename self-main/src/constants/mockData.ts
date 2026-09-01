// Socio Economic Lacuna Foundation (SELF) Central Database & Mocks

export interface FocusArea {
  id: string;
  title: string;
  icon: string;
  color: string;
  bgColor: string;
  description: string;
  points: string[];
}

export interface FeaturedProject {
  id: string;
  title: string;
  category: string;
  imageUrl: string;
  description: string;
  fullDetails: string;
  location: string;
  beneficiaries: string;
  partner: string;
}

export interface Partner {
  id: string;
  name: string;
  type: 'International' | 'Corporate CSR' | 'Government / PSU' | 'Philanthropic';
  logoPlaceholder: string;
  description: string;
}

export interface NewsItem {
  id: string;
  title: string;
  date: string;
  category: 'Event' | 'Press' | 'Project Launch' | 'Recruitment';
  summary: string;
  isNew: boolean;
}

export interface Testimonial {
  id: string;
  quote: string;
  author: string;
  role: string;
  location: string;
  avatarUrl: string;
}

export interface Publication {
  id: string;
  title: string;
  type: 'Annual Report' | 'Case Study' | 'Newsletter' | 'Audit & 80G' | 'Manual';
  year: string;
  fileSize: string;
  downloadUrl: string;
}

export interface FAQItem {
  id: string;
  question: string;
  answer: string;
}

export interface Scheme {
  id: string;
  title: string;
  category: string;
  description: string;
  longDescription: string;
  eligibility: string[];
  fundingLimit: string;
  documentsRequired: string[];
}

export interface ApplicationStatus {
  applicationId: string;
  ngoName: string;
  schemeName: string;
  status: 'Registered' | 'Proposal Submitted' | 'District Review' | 'State Review' | 'Approved' | 'Sanctioned' | 'Rejected';
  updatedAt: string;
  steps: {
    name: string;
    status: 'completed' | 'current' | 'pending' | 'failed';
    date?: string;
    remarks?: string;
  }[];
}

// Focus Areas - Government Projects, Agriculture, Human Resources at top
export const FOCUS_AREAS: FocusArea[] = [
  {
    id: 'focus-government',
    title: 'Government Projects & Schemes',
    icon: 'Landmark',
    color: '#004d40',
    bgColor: '#e0f2f1',
    description: 'Execution of central & state sponsored schemes, tribal welfare delivery, Jal Jeevan monitoring and social audits.',
    points: ['Tribal Welfare Schemes Execution', 'Jal Jeevan Mission Third-Party Monitoring', 'Rural Housing & PMAY Impact Audits', 'Direct Benefit Transfer (DBT) Mobilization']
  },
  {
    id: 'focus-agriculture',
    title: 'Agriculture & Horticulture',
    icon: 'Sprout',
    color: '#2e7d32',
    bgColor: '#e8f5e9',
    description: 'Natural farming, millet promotion, fruit plantation, and nutrition kitchen gardens.',
    points: ['Millets & Organic Farming', 'Wadi Fruit Orchards', 'Drip Irrigation & Soil Care', 'Nutrition Kitchen Gardens']
  },
  {
    id: 'focus-hr',
    title: 'Human Resources & Capacity Building',
    icon: 'Users',
    color: '#0d47a1',
    bgColor: '#e3f2fd',
    description: 'Grassroots recruitment, community cadre training, panchayat leadership, and human resource development.',
    points: ['Grassroots Talent Recruitment & Staffing', 'Community Resource Person (CRP) Training', 'Panchayat & PRI Capacity Building', 'Social Sector Career Mentorship']
  },
  {
    id: 'focus-education',
    title: 'Education',
    icon: 'GraduationCap',
    color: '#1565c0',
    bgColor: '#e3f2fd',
    description: 'Quality education, digital literacy, school improvement, learning assessment.',
    points: ['Remedial Learning Centres', 'Digital Classroom Labs', 'Girl Child Retention', 'Teacher Training & Assessment']
  },
  {
    id: 'focus-health',
    title: 'Healthcare',
    icon: 'HeartPulse',
    color: '#c62828',
    bgColor: '#ffebee',
    description: 'Community health, nutrition, maternal health, adolescent health.',
    points: ['Mobile Medical Clinics', 'Maternal & Infant Nutrition', 'Adolescent Anaemia Screening', 'Telemedicine & Health Camps']
  },
  {
    id: 'focus-livelihood',
    title: 'Livelihood',
    icon: 'Briefcase',
    color: '#b78103',
    bgColor: '#fff8e1',
    description: 'Skill development, entrepreneurship, SHGs, FPOs.',
    points: ['Women Self-Help Groups (SHGs)', 'Farmer Producer Orgs (FPOs)', 'Market Linkage Creation', 'Micro-enterprise Seed Grants']
  },
  {
    id: 'focus-women',
    title: 'Women Empowerment',
    icon: 'Users2',
    color: '#6a1b9a',
    bgColor: '#f3e5f5',
    description: 'Leadership development, financial literacy, enterprise promotion.',
    points: ['Legal Rights & Gender Equality', 'Financial Inclusion & Digital Banking', 'Artisanal Collective Enterprises', 'Panchayati Raj Leadership']
  },
  {
    id: 'focus-youth',
    title: 'Youth Development',
    icon: 'UserCheck',
    color: '#4527a0',
    bgColor: '#ede7f6',
    description: 'Career guidance, employability skills, sports and leadership.',
    points: ['Vocational IT Training', 'Youth Leadership Bootcamps', 'Sports for Community Building', 'Job Placement Mentorship']
  },
  {
    id: 'focus-environment',
    title: 'Environment',
    icon: 'Trees',
    color: '#1b5e20',
    bgColor: '#e8f5e9',
    description: 'Tree plantation, climate resilience, water conservation, biodiversity.',
    points: ['Community Afforestation', 'Rainwater Harvesting Structures', 'Solar Water Pump Installation', 'Biodiversity Preservation']
  },
  {
    id: 'focus-disability',
    title: 'Disability Inclusion',
    icon: 'Accessibility',
    color: '#00838f',
    bgColor: '#e0f7fa',
    description: 'Rehabilitation, therapy, assistive devices, vocational rehabilitation.',
    points: ['Physiotherapy & Speech Therapy', 'Assistive Devices Distribution', 'Inclusive Livelihood Training', 'Disability Certificate Camps']
  },
  {
    id: 'focus-research',
    title: 'Research & Evaluation',
    icon: 'BarChart3',
    color: '#37474f',
    bgColor: '#eceff1',
    description: 'Baseline, endline, impact assessment, M&E, data analytics, MIS development.',
    points: ['Socio-Economic Baseline Surveys', 'Third-Party CSR Impact Audits', 'Cloud-based MIS & Geo-tagging', 'Policy Whitepapers']
  }
];

export const SCHEMES: Scheme[] = FOCUS_AREAS.map((fa) => ({
  id: fa.id,
  title: `${fa.title} Intervention Mission`,
  category: fa.title,
  description: fa.description,
  longDescription: `Comprehensive grassroots programme dedicated to ${fa.title.toLowerCase()} across backward blocks and scheduled habitations.`,
  eligibility: ['Registered NGO / SHG Federation with 3+ years experience', 'Active NGO Darpan registration', 'Valid 80G & 12A certification'],
  fundingLimit: '₹25.00 - ₹50.00 Lakhs',
  documentsRequired: ['Organization Registration Certificate', '3-Year Audited Balance Sheets', 'Detailed Project Report (DPR)', 'Activity Plan']
}));

// 5 Impact Metrics from infographic
export const IMPACT_METRICS = [
  {
    id: 'impact-projects',
    value: '100+',
    numeric: 100,
    label: 'Projects Completed',
    bgColor: 'bg-[#2e7d32]',
    textColor: 'text-white'
  },
  {
    id: 'impact-villages',
    value: '250+',
    numeric: 250,
    label: 'Villages Covered',
    bgColor: 'bg-[#0d47a1]',
    textColor: 'text-white'
  },
  {
    id: 'impact-beneficiaries',
    value: '150,000+',
    numeric: 150000,
    label: 'Beneficiaries',
    bgColor: 'bg-[#e65100]',
    textColor: 'text-white'
  },
  {
    id: 'impact-partners',
    value: '20+',
    numeric: 20,
    label: 'Government & CSR Partners',
    bgColor: 'bg-[#512da8]',
    textColor: 'text-white'
  },
  {
    id: 'impact-volunteers',
    value: '500+',
    numeric: 500,
    label: 'Volunteers',
    bgColor: 'bg-[#00838f]',
    textColor: 'text-white'
  }
];

export const STATISTICS = IMPACT_METRICS.map((m) => ({
  id: m.id,
  value: m.value,
  label: m.label,
  iconName: 'Users'
}));

// Featured Projects - Government, Agriculture, and Human Resources at top
export const FEATURED_PROJECTS: FeaturedProject[] = [
  {
    id: 'proj-govt-welfare',
    title: 'Government Tribal Welfare & Jal Jeevan Mission Monitoring',
    category: 'Government Projects',
    imageUrl: 'https://images.unsplash.com/photo-1541872703-74c5e44368f9?auto=format&fit=crop&q=80&w=600',
    description: 'Third-party social audit, drinking water testing, and tribal scheme execution under Central & State government guidelines.',
    fullDetails: 'Partnering with state departments to evaluate tap water connections across 180 tribal habitations, conduct DBT beneficiary verifications, and audit rural housing standards under PMAY.',
    location: 'Khunti, Simdega & West Singhbhum Districts',
    beneficiaries: '32,000 Tribal Households',
    partner: 'Drinking Water & Sanitation Dept, Govt of Jharkhand'
  },
  {
    id: 'proj-millet-mission',
    title: 'Millet Promotion & Natural Farming Mission',
    category: 'Agriculture',
    imageUrl: 'https://images.unsplash.com/photo-1500937386664-56d1dfef3854?auto=format&fit=crop&q=80&w=600',
    description: 'Promoting millets for nutrition security and climate-resilient sustainable farming.',
    fullDetails: 'Revitalizing indigenous Finger Millet (Ragi), Kodo, and Foxtail millet cultivation on 1,800 acres, providing processing machinery, and establishing direct procurement tie-ups.',
    location: 'Gumla & Simdega Districts',
    beneficiaries: '4,500 Tribal Farmers',
    partner: 'NABARD & Jharkhand State Livelihood Mission'
  },
  {
    id: 'proj-hr-capacity',
    title: 'Grassroots Human Resource & Capacity Development',
    category: 'Human Resources',
    imageUrl: 'https://images.unsplash.com/photo-1582213782179-e0d53f98f2ca?auto=format&fit=crop&q=80&w=600',
    description: 'Recruitment, community cadre building, and leadership mentoring for rural development facilitators.',
    fullDetails: 'Training and deploying over 350 rural youth and community mobilizers in project administration, survey tools (ODK/Kobo), social forestry, and panchayat governance.',
    location: 'Ranchi, Latehar & Gumla',
    beneficiaries: '1,200 Grassroots Professionals & Fellows',
    partner: 'National Rural Livelihood Mission (NRLM)'
  },
  {
    id: 'proj-skill-centre',
    title: 'Skill Development Centre',
    category: 'Youth & Livelihood',
    imageUrl: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&q=80&w=600',
    description: 'Building skills for employability and entrepreneurship opportunities among rural youth.',
    fullDetails: 'Residential certified vocational courses in solar technician training, electrical maintenance, retail management, and healthcare assistants with 78% placement success.',
    location: 'Bokaro & Dhanbad',
    beneficiaries: '2,800 Youth Trained',
    partner: 'HDFC Bank Parivartan'
  },
  {
    id: 'proj-rural-livelihood',
    title: 'Rural Livelihood Enhancement',
    category: 'Women Empowerment',
    imageUrl: 'https://images.unsplash.com/photo-1509099836639-18ba1795216d?auto=format&fit=crop&q=80&w=600',
    description: 'Strengthening SHGs and livelihood opportunities in backward rural clusters.',
    fullDetails: 'Federating 350 women SHGs into producer companies for organic lac cultivation, mushroom farming, poultry backyard units, and handloom textile production.',
    location: 'West Singhbhum & Saraikela',
    beneficiaries: '8,400 Women Members',
    partner: 'Azim Premji Philanthropic Initiatives'
  },
  {
    id: 'proj-water-conservation',
    title: 'Water Conservation Project',
    category: 'Environment',
    imageUrl: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&q=80&w=600',
    description: 'Conserving water resources and promoting sustainable watershed practices.',
    fullDetails: 'Constructing 42 check dams, loose boulder structures, farm ponds, and percolation pits to recharge groundwater tables and ensure round-the-year irrigation.',
    location: 'Latehar & Lohardaga',
    beneficiaries: '18,000 Villagers across 32 Hamlets',
    partner: 'Vedanta CSR & Reliance Foundation'
  }
];

// Institutional & CSR Partners from infographic
export const PARTNERS: Partner[] = [
  {
    id: 'p-unicef',
    name: 'UNICEF',
    type: 'International',
    logoPlaceholder: 'UNICEF',
    description: 'Collaborative programmes in child health, nutrition, and child protection systems.'
  },
  {
    id: 'p-tatasteel',
    name: 'TATA STEEL',
    type: 'Corporate CSR',
    logoPlaceholder: 'TATA STEEL',
    description: 'Long-term partnership in digital schools, sports academies, and youth skilling.'
  },
  {
    id: 'p-nabard',
    name: 'NABARD',
    type: 'Government / PSU',
    logoPlaceholder: 'NABARD',
    description: 'Watershed development, tribal wadi plantation, and rural enterprise incubation.'
  },
  {
    id: 'p-vedanta',
    name: 'VEDANTA',
    type: 'Corporate CSR',
    logoPlaceholder: 'VEDANTA',
    description: 'Community health dispensaries, clean drinking water, and sanitation initiatives.'
  },
  {
    id: 'p-jsw',
    name: 'JSW Foundation',
    type: 'Corporate CSR',
    logoPlaceholder: 'JSW Foundation',
    description: 'Empowering women artisans and providing disability rehabilitation infrastructure.'
  },
  {
    id: 'p-hdfc',
    name: 'HDFC BANK PARIVARTAN',
    type: 'Corporate CSR',
    logoPlaceholder: 'HDFC Parivartan',
    description: 'Holistic Rural Development Programme (HRDP) touching education, water, and livelihoods.'
  },
  {
    id: 'p-azimpremji',
    name: 'Azim Premji Philanthropic Initiatives',
    type: 'Philanthropic',
    logoPlaceholder: 'Azim Premji Philanthropic',
    description: 'Systemic strengthening of community institutions and combating severe acute malnutrition.'
  },
  {
    id: 'p-reliance',
    name: 'Reliance Foundation',
    type: 'Corporate CSR',
    logoPlaceholder: 'Reliance Foundation',
    description: 'Transforming rural livelihoods through technology, disaster relief, and agriculture.'
  }
];

// Latest News & Events from infographic
export const LATEST_NEWS: NewsItem[] = [
  {
    id: 'news-01',
    title: 'Training on Organic Farming Completed in 15 Villages',
    date: '2026-08-20',
    category: 'Project Launch',
    summary: 'Over 450 farmers received bio-fertilizer kits, vermicompost units, and training on non-pesticide management.',
    isNew: true
  },
  {
    id: 'news-02',
    title: 'Health Camp Organized for Maternal Health in Remote Blocks',
    date: '2026-08-14',
    category: 'Event',
    summary: 'Free antenatal checkups, hemoglobin screening, and iron folic acid supplements distributed to 320 pregnant women.',
    isNew: true
  },
  {
    id: 'news-03',
    title: 'New Project Launched in Garhwa District for Disability Care',
    date: '2026-08-05',
    category: 'Project Launch',
    summary: 'Inaugurated a dedicated physiotherapy center equipped with specialized pediatric rehabilitation gear.',
    isNew: true
  },
  {
    id: 'news-04',
    title: 'Celebrating International Women’s Day with 1,200 SHG Leaders',
    date: '2026-03-08',
    category: 'Event',
    summary: 'Conferred leadership awards to exemplary women micro-entrepreneurs from 40 village panchayats.',
    isNew: false
  },
  {
    id: 'news-05',
    title: 'Recruitment for Field Staff & Project Coordinators - Apply Now',
    date: '2026-08-25',
    category: 'Recruitment',
    summary: 'Inviting applications from passionate development professionals for M&E and Agriculture Field Executive roles.',
    isNew: true
  }
];

// Testimonials
export const TESTIMONIALS: Testimonial[] = [
  {
    id: 'test-01',
    quote: 'SELF has been a great partner in bringing positive change in our community. Their dedication and transparency are commendable.',
    author: 'Somra Munda',
    role: 'Village Pradhan (Panchayat Head)',
    location: 'Khunti District, Jharkhand',
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200'
  },
  {
    id: 'test-02',
    quote: 'The millet processing unit set up by SELF transformed our income. We now sell packaged ragi flour directly to urban markets.',
    author: 'Sunita Devi',
    role: 'Secretary, Jai Maa SHG Federation',
    location: 'Gumla District, Jharkhand',
    avatarUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=200'
  },
  {
    id: 'test-03',
    quote: 'The digital smart classes installed by SELF have drastically improved student attendance and exam scores in our secondary school.',
    author: 'Rajesh Kumar Singh',
    role: 'Headmaster, Government High School',
    location: 'Ranchi, Jharkhand',
    avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=200'
  }
];

// Publications & Reports
export const PUBLICATIONS: Publication[] = [
  {
    id: 'pub-01',
    title: 'Annual Report & Audited Financial Statement 2025-26',
    type: 'Annual Report',
    year: '2026',
    fileSize: '4.8 MB',
    downloadUrl: '#'
  },
  {
    id: 'pub-02',
    title: 'Comprehensive Impact Study on Millet Promotion in Tribal Jharkhand',
    type: 'Case Study',
    year: '2026',
    fileSize: '2.4 MB',
    downloadUrl: '#'
  },
  {
    id: 'pub-03',
    title: 'Income Tax 12A & 80G Tax Exemption Certificate Copies',
    type: 'Audit & 80G',
    year: '2025-2028',
    fileSize: '1.2 MB',
    downloadUrl: '#'
  },
  {
    id: 'pub-04',
    title: 'Quarterly Development Newsletter (Vikas Varta - Edition 12)',
    type: 'Newsletter',
    year: '2026',
    fileSize: '3.1 MB',
    downloadUrl: '#'
  },
  {
    id: 'pub-05',
    title: 'Community Watershed Management Best Practices Manual',
    type: 'Manual',
    year: '2025',
    fileSize: '5.6 MB',
    downloadUrl: '#'
  }
];

// FAQs
export const FAQS: FAQItem[] = [
  {
    id: 'faq-01',
    question: 'What is Socio Economic Lacuna Foundation (SELF)?',
    answer: 'Socio Economic Lacuna Foundation (SELF) is a registered non-profit organization dedicated to empowering vulnerable rural and tribal communities across education, health, agriculture, livelihood, disability inclusion, and sustainable resource management.'
  },
  {
    id: 'faq-02',
    question: 'Are donations to SELF eligible for tax exemption?',
    answer: 'Yes. All donations to SELF Foundation are 50% tax exempt under Section 80G of the Income Tax Act, 1961. An official 80G receipt and certificate are generated immediately upon donation.'
  },
  {
    id: 'faq-03',
    question: 'How can corporates partner with SELF for CSR projects?',
    answer: 'SELF holds an active MCA CSR Registration Number (CSR00018492) and executes turnkey CSR projects from baseline assessment, community mobilization, hardware deployment to third-party impact evaluation.'
  },
  {
    id: 'faq-04',
    question: 'How can I volunteer or apply for field positions?',
    answer: 'Passionate individuals can join our team as field volunteers or full-time development fellows. Visit our Volunteer Registration page or email your resume to selfjharkhand@gmail.com.'
  }
];

// Organization Profile Details (Extracted from official Trust accreditation)
export const ORG_PROFILE = {
  name: 'Socio Economic Lacuna Foundation',
  shortName: 'SELF',
  motto: 'Bridging Gaps, Empowering Community',
  tagline: 'Empowering Communities | Enriching Lives | Building a Sustainable Jharkhand',
  trustAct: 'Registered Under Indian Trust Act - 1882',
  registrationNumber: '12627/1739',
  registrationYear: '2011',
  mission: 'SELF is committed to empowering communities through inclusive development, sustainable initiatives, and capacity building. We work towards bridging gaps and enriching lives for a stronger, self-reliant and equitable Jharkhand.',
  vision: 'An equitable, self-reliant, and inclusive society where every individual has equal opportunity to realize their full potential with dignity.',
  coreValues: [
    { title: 'Integrity & Transparency', desc: 'Zero tolerance for corruption with open public audits and 100% statutory compliance.' },
    { title: 'Community Centricity', desc: 'Local community ownership at every stage from planning to execution.' },
    { title: 'Inclusivity & Dignity', desc: 'Special focus on women, persons with disabilities, tribal habitations, and children.' },
    { title: 'Innovation & Sustainability', desc: 'Deploying eco-friendly, green, and technologically scalable grassroots solutions.' }
  ],
  address: '92, Aamtand, Ratu, Ranchi, Jharkhand, 835222.',
  addressShort: '92, Aamtand, Ratu, Ranchi, Jharkhand - 835222',
  phone: '+91 9431775101',
  phoneAlt: '+91 7856074123',
  phoneDisplay: '9431775101 / 7856074123',
  email: 'selfjharkhand@gmail.com',
  website: 'www.selfjharkhand.org',
  social: {
    whatsapp: 'https://wa.me/919431775101?text=Hello%20SELF%20Foundation,%20I%20would%20like%20to%20know%20more%20about%20your%20programs.',
    facebook: 'https://facebook.com/selfjharkhand',
    instagram: 'https://instagram.com/selfjharkhand',
    youtube: 'https://youtube.com/@selfjharkhand',
    twitter: 'https://x.com/selfjharkhand',
    linkedin: 'https://linkedin.com/company/selfjharkhand',
    handle: '@selfjharkhand'
  },
  pan: 'AAATS1234F',
  ngoDarpanId: 'JH/2018/0192847',
  csrRegistrationNo: 'CSR00018492',
  taxExemption: '80G & 12A Certified under Income Tax Act 1961'
};

// Application / Tracking Mock Data for NGO & Citizen tracking
export const APPLICATION_TRACKING_MOCKS: ApplicationStatus[] = [
  {
    applicationId: 'SELF-2026-00124',
    ngoName: 'Socio Economic Lacuna Foundation (SELF)',
    schemeName: 'Digital Learning & Smart Classroom Mission',
    status: 'Sanctioned',
    updatedAt: '2026-08-25',
    steps: [
      { name: 'Proposal Submission', status: 'completed', date: '2026-06-10', remarks: 'DPR & itemized budget approved.' },
      { name: 'Field Baseline Audit', status: 'completed', date: '2026-07-02', remarks: 'Baseline test in 15 schools completed.' },
      { name: 'CSR Committee Approval', status: 'completed', date: '2026-07-28', remarks: 'Grant sanction approved by CSR Board.' },
      { name: 'Hardware Deployment', status: 'completed', date: '2026-08-15', remarks: 'Smart boards & solar kits installed.' },
      { name: 'Project Live', status: 'completed', date: '2026-08-25', remarks: 'Classes commenced with teacher monitoring.' }
    ]
  },
  {
    applicationId: 'SELF-2026-00582',
    ngoName: 'Socio Economic Lacuna Foundation (SELF)',
    schemeName: 'Community Rainwater Harvesting & Watershed Project',
    status: 'Approved',
    updatedAt: '2026-08-26',
    steps: [
      { name: 'Proposal Submission', status: 'completed', date: '2026-07-15' },
      { name: 'Technical Feasibility', status: 'completed', date: '2026-08-01', remarks: 'Hydrogeological surveys attached.' },
      { name: 'PAC Clearance', status: 'completed', date: '2026-08-26', remarks: 'Approved by Project Approval Committee.' },
      { name: 'First Installment Release', status: 'current', remarks: 'Disbursement under PFMS processing.' },
      { name: 'Civil Construction', status: 'pending' }
    ]
  }
];

export const SECTORS = ['All Sectors', 'Education', 'Health', 'Livelihood', 'Environment', 'Disability', 'Agriculture'];
export const YEARS = ['2026', '2025'];
export const STATES = [
  'All Districts',
  'Ranchi',
  'Khunti',
  'Gumla',
  'Garhwa',
  'Latehar',
  'Simdega',
  'Bokaro'
];

export const GRANTS_BY_YEAR_DATA = {
  '2026': [
    { month: 'Jan', amount: 14.5 },
    { month: 'Feb', amount: 18.2 },
    { month: 'Mar', amount: 32.4 },
    { month: 'Apr', amount: 22.6 },
    { month: 'May', amount: 26.9 },
    { month: 'Jun', amount: 31.1 },
    { month: 'Jul', amount: 38.4 },
    { month: 'Aug', amount: 45.2 }
  ],
  '2025': [
    { month: 'Jan', amount: 8.2 },
    { month: 'Feb', amount: 11.1 },
    { month: 'Mar', amount: 24.2 },
    { month: 'Apr', amount: 15.4 },
    { month: 'May', amount: 18.9 },
    { month: 'Jun', amount: 22.6 },
    { month: 'Jul', amount: 27.3 },
    { month: 'Aug', amount: 29.5 },
    { month: 'Sep', amount: 33.1 },
    { month: 'Oct', amount: 36.5 },
    { month: 'Nov', amount: 41.9 },
    { month: 'Dec', amount: 48.4 }
  ]
};

export const PROJECTS_BY_SECTOR_DATA: Record<string, { name: string; value: number; color: string }[]> = {
  'All States': [
    { name: 'Education', value: 30, color: '#0d47a1' },
    { name: 'Agriculture & Millets', value: 25, color: '#2e7d32' },
    { name: 'Healthcare', value: 20, color: '#c62828' },
    { name: 'Livelihood & SHGs', value: 15, color: '#b78103' },
    { name: 'Disability Care', value: 10, color: '#00838f' }
  ],
  'All Districts': [
    { name: 'Education', value: 30, color: '#0d47a1' },
    { name: 'Agriculture & Millets', value: 25, color: '#2e7d32' },
    { name: 'Healthcare', value: 20, color: '#c62828' },
    { name: 'Livelihood & SHGs', value: 15, color: '#b78103' },
    { name: 'Disability Care', value: 10, color: '#00838f' }
  ]
};

export const STATE_WISE_PROJECTS_DATA = [
  { state: 'Ranchi', projects: 35, grants: 24.2 },
  { state: 'Khunti', projects: 28, grants: 18.6 },
  { state: 'Gumla', projects: 22, grants: 15.1 },
  { state: 'Garhwa', projects: 18, grants: 12.4 },
  { state: 'Latehar', projects: 14, grants: 9.8 },
  { state: 'Simdega', projects: 12, grants: 8.2 }
];

export const NGO_STATUS_DATA = [
  { name: 'Completed & Certified', value: 100, color: '#2e7d32' },
  { name: 'Ongoing Field Implementation', value: 38, color: '#0d47a1' },
  { name: 'Planning & Baseline Stage', value: 12, color: '#e65100' }
];
