import React, { useState, useId, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Briefcase,
  MapPin,
  Calendar,
  IndianRupee,
  GraduationCap,
  Upload,
  CheckCircle2,
  ArrowRight,
  Search,
  User,
  ShieldCheck,
  Award,
  AlertCircle,
  X,
  ChevronRight,
  Filter,
  Sparkles,
  HeartHandshake,
  Plus,
  Trash2,
  Eye,
  FileCheck,
  Lock,
  Edit3
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { careerService } from '../../services/careerService';

export interface JobOpening {
  id: string;
  code: string;
  title: string;
  department: string;
  location: string;
  type: string;
  experience: string;
  salary: string;
  openings: number;
  deadline: string;
  isUrgent?: boolean;
  isCustom?: boolean;
  shortDesc: string;
  responsibilities: string[];
  qualifications: string[];
  desirableSkills: string[];
}

export interface CandidateApplication {
  id: string;
  refNumber: string;
  jobId: string;
  jobTitle: string;
  fullName: string;
  email: string;
  phone: string;
  location: string;
  qualification: string;
  experience: string;
  salaryExpected: string;
  resumeName: string;
  submittedAt: string;
  status: 'Under Review' | 'Shortlisted' | 'Interview Scheduled' | 'Selected' | 'Rejected';
  coverLetter?: string;
  additionalNotes?: string;
  languages: string[];
}

export const INITIAL_JOB_OPENINGS: JobOpening[] = [
  {
    id: 'job-01',
    code: 'SELF/REC/2026/01',
    title: 'Senior Project Coordinator – Rural Livelihoods & FPOs',
    department: 'Programs & Field Operations',
    location: 'Ranchi (with frequent field travel)',
    type: 'Full-Time',
    experience: '3 - 5 Years',
    salary: '₹45,000 – ₹60,000 / month',
    openings: 2,
    deadline: '2026-09-25',
    isUrgent: true,
    shortDesc: 'Lead the execution of farm and off-farm livelihood initiatives, Farmer Producer Organizations (FPOs), and SHG enterprise incubation across rural Jharkhand.',
    responsibilities: [
      'Coordinate field project managers across Khunti, Gumla, and Simdega districts.',
      'Facilitate market linkages and value chain addition for organic millets and forest produce.',
      'Ensure timely submission of donor compliance reports, milestone tracking, and M&E metrics.',
      'Conduct regular monitoring visits, stakeholder consultations, and community reviews.'
    ],
    qualifications: [
      'Post Graduate Degree in Rural Management (IRMA/XISS/TISS or equivalent), MSW, or Agribusiness.',
      'Minimum 3 years of hands-on experience in rural development, livelihood promotion, or FPO management.',
      'Fluency in Hindi and English; working familiarity with local tribal dialects (Nagpuri/Mundari) preferred.'
    ],
    desirableSkills: ['Community mobilization', 'FPO statutory compliance', 'Project budget monitoring', 'Report writing']
  },
  {
    id: 'job-02',
    code: 'SELF/REC/2026/02',
    title: 'Field Monitoring & Evaluation (M&E) Officer',
    department: 'Research & Impact Evaluation',
    location: 'Khunti / Simdega District',
    type: 'Full-Time',
    experience: '2 - 4 Years',
    salary: '₹35,000 – ₹45,000 / month',
    openings: 3,
    deadline: '2026-09-30',
    isUrgent: false,
    shortDesc: 'Responsible for empirical baseline and endline evaluations, digital data collection via KoboToolbox, and impact assessment of healthcare and education schemes.',
    responsibilities: [
      'Design digital survey tools (ODK, KoboToolbox) and oversee field enumerator training.',
      'Conduct qualitative Focus Group Discussions (FGDs) and Key Informant Interviews (KIIs).',
      'Perform data cleaning, validation, statistical analysis, and dashboard metric upkeep.',
      'Author monthly analytical dashboards and impact stories for CSR donor reporting.'
    ],
    qualifications: [
      'Master’s degree in Statistics, Economics, Development Studies, Population Studies, or Social Work.',
      'Proven experience managing large-scale field surveys and mobile-based data collection.',
      'Strong command of Excel, SPSS, or Stata; data visualization skills are a strong plus.'
    ],
    desirableSkills: ['KoboToolbox/ODK', 'Quantitative & qualitative analysis', 'Field auditing', 'Impact evaluation methodologies']
  },
  {
    id: 'job-03',
    code: 'SELF/REC/2026/03',
    title: 'Digital Literacy & ICT Lab Lead Trainer',
    department: 'Education & Digital Labs',
    location: 'Ratu & Itki Block (Ranchi)',
    type: 'Full-Time',
    experience: '1 - 3 Years',
    salary: '₹28,000 – ₹35,000 / month',
    openings: 2,
    deadline: '2026-09-20',
    isUrgent: true,
    shortDesc: 'Deliver interactive computer education, STEM learning, and digital empowerment programs to rural government school students in our smart learning centres.',
    responsibilities: [
      'Conduct hands-on digital literacy classes for rural adolescents and youth.',
      'Maintain hardware, operating software, and internet connectivity of rural digital lab setups.',
      'Train local government school teachers on audio-visual digital learning modules.',
      'Track student attendance, learning milestone assessments, and certification testing.'
    ],
    qualifications: [
      'BCA, B.Sc IT/CS, B.Tech, or Diploma in Computer Applications / Information Technology.',
      'Experience in teaching, conducting training workshops, or managing community computer centres.',
      'Patience and passion for mentoring underprivileged children in rural environments.'
    ],
    desirableSkills: ['Basic computer hardware troubleshooting', 'Audio-visual pedagogy', 'Curriculum planning', 'Classroom management']
  },
  {
    id: 'job-04',
    code: 'SELF/REC/2026/04',
    title: 'Community Health & Nutrition Coordinator',
    department: 'Health & Nutrition',
    location: 'Gumla District',
    type: 'Contract',
    experience: '2+ Years',
    salary: '₹38,000 – ₹48,000 / month',
    openings: 2,
    deadline: '2026-10-05',
    isUrgent: false,
    shortDesc: 'Implement community health camps, maternal and infant nutrition drives, adolescent anaemia interventions, and support Anganwadi worker capacity building.',
    responsibilities: [
      'Organize mobile health clinics in remote tribal habitations in coordination with doctors.',
      'Supervise POSHAN nutrition demonstration camps and poshan kitchen gardens in villages.',
      'Liaise with Primary Health Centres (PHCs), ASHA, and Anganwadi workers.',
      'Maintain clinical screening registers, referral pathways, and diagnostic record sheets.'
    ],
    qualifications: [
      'Master’s in Public Health (MPH), M.Sc Nutrition, B.Sc Nursing, or MSW with health background.',
      'At least 2 years in maternal and child health or nutrition programs in rural settings.',
      'Willingness to travel to remote tribal hamlets.'
    ],
    desirableSkills: ['Growth monitoring', 'Maternal health protocols', 'Community counseling', 'Govt health department liaison']
  },
  {
    id: 'job-05',
    code: 'SELF/REC/2026/05',
    title: 'Natural Farming & Watershed Technical Specialist',
    department: 'Agriculture & Environment',
    location: 'Simdega & Latehar Districts',
    type: 'Full-Time',
    experience: '3+ Years',
    salary: '₹42,000 – ₹52,000 / month',
    openings: 1,
    deadline: '2026-09-28',
    isUrgent: false,
    shortDesc: 'Provide agronomic technical advisory for chemical-free natural farming, organic certification, wadi orchard development, and ridge-to-valley water harvesting structures.',
    responsibilities: [
      'Design soil and water conservation structures (TCBs, water harvesting tanks, farm ponds).',
      'Train tribal farmer groups in preparation of bio-fertilizers (Jeevarmrut, Neemastra, etc.).',
      'Guide plantation and survival monitoring of fruit trees under tribal wadi schemes.',
      'Document indigenous agricultural practices and climate adaptation techniques.'
    ],
    qualifications: [
      'B.Sc / M.Sc in Agriculture, Horticulture, Soil Science, or Watershed Engineering.',
      'Extensive practical knowledge of non-pesticidal management (NPM) and agro-forestry.',
      'Demonstrated experience working with smallholder tribal farming communities.'
    ],
    desirableSkills: ['GIS watershed mapping', 'Organic certification protocols', 'Agronomic training', 'Irrigation layout planning']
  },
  {
    id: 'job-06',
    code: 'SELF/REC/2026/06',
    title: 'CSR Partnerships & Communications Associate',
    department: 'Management & Communications',
    location: 'Ranchi Head Office',
    type: 'Full-Time',
    experience: '2 - 4 Years',
    salary: '₹32,000 – ₹42,000 / month',
    openings: 1,
    deadline: '2026-10-10',
    isUrgent: false,
    shortDesc: 'Develop high-impact CSR proposal pitches, case study documentation, newsletters, and coordinate quarterly reporting with corporate donors and philanthropic trusts.',
    responsibilities: [
      'Draft concept notes, project proposals, and detailed budgets for corporate CSR grants.',
      'Gather human-interest field stories, high-resolution photographs, and testimonial videos.',
      'Curate the quarterly newsletter (Vikas Varta) and maintain official institutional presentations.',
      'Coordinate CSR donor visits and field inspection delegations.'
    ],
    qualifications: [
      'Degree in Mass Communication, English, Development Communication, or Public Relations.',
      'Exceptional written English skills with experience writing NGO grant proposals or reports.',
      'Proficiency in Canva, PowerPoint, and digital documentation tools.'
    ],
    desirableSkills: ['Grant writing', 'Newsletter layout', 'Donor relations', 'Social media storytelling']
  }
];

export const Careers: React.FC = () => {
  const formId = useId();

  // Active View Tab: 'candidate' | 'admin-post' | 'admin-applications'
  const [activeTab, setActiveTab] = useState<'candidate' | 'admin-post' | 'admin-applications'>('candidate');

  // Job Openings State (with localStorage persistence)
  const [jobs, setJobs] = useState<JobOpening[]>(() => {
    const saved = localStorage.getItem('self_job_openings');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Failed to parse saved jobs', e);
      }
    }
    return INITIAL_JOB_OPENINGS;
  });

  // Submitted Applications (with localStorage persistence)
  const [applications, setApplications] = useState<CandidateApplication[]>(() => {
    const saved = localStorage.getItem('self_candidate_applications');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Failed to parse saved applications', e);
      }
    }
    return [
      {
        id: 'app-sample-1',
        refNumber: 'SELF-REC-2026-928412',
        jobId: 'job-01',
        jobTitle: 'SELF/REC/2026/01 - Senior Project Coordinator',
        fullName: 'Amitesh Kumar Singh',
        email: 'amitesh.k@example.com',
        phone: '9431102948',
        location: 'Ranchi Head Office',
        qualification: "Master's / Post Graduate (XISS MSW)",
        experience: '4 Years',
        salaryExpected: '₹55,000 / month',
        resumeName: 'Amitesh_Singh_CV.pdf',
        submittedAt: '2026-08-30',
        status: 'Shortlisted',
        languages: ['Hindi', 'English', 'Nagpuri']
      },
      {
        id: 'app-sample-2',
        refNumber: 'SELF-REC-2026-583921',
        jobId: 'job-03',
        jobTitle: 'SELF/REC/2026/03 - Digital Literacy Lead Trainer',
        fullName: 'Pooja Kumari Oraon',
        email: 'pooja.oraon@example.com',
        phone: '9835712903',
        location: 'Ratu & Itki Block (Ranchi)',
        qualification: 'BCA (Ranchi University)',
        experience: '2 Years',
        salaryExpected: '₹30,000 / month',
        resumeName: 'Pooja_Resume_2026.pdf',
        submittedAt: '2026-08-31',
        status: 'Under Review',
        languages: ['Hindi', 'English', 'Kurukh (Oraon)']
      }
    ];
  });

  const { user } = useAuth();
  const canManageJobs = user?.role === 'ADMIN' || user?.role === 'OFFICER' || Boolean(user?.permissions?.canPostJobs);

  // Fetch real jobs from backend API on mount
  useEffect(() => {
    careerService
      .getAllJobs()
      .then((data) => {
        if (data && data.length > 0) {
          setJobs(data as any);
        }
      })
      .catch((err) => {
        console.log('Using local fallback for jobs', err);
      });
  }, []);

  // Fetch candidates from backend API if authorized
  useEffect(() => {
    if (canManageJobs) {
      careerService
        .getAllCandidates()
        .then((data) => {
          if (data && data.length > 0) {
            setApplications(data as any);
          }
        })
        .catch((err) => {
          console.log('Using local fallback for candidates', err);
        });
    }
  }, [canManageJobs]);

  useEffect(() => {
    localStorage.setItem('self_job_openings', JSON.stringify(jobs));
  }, [jobs]);

  useEffect(() => {
    localStorage.setItem('self_candidate_applications', JSON.stringify(applications));
  }, [applications]);

  // Filter States
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDept, setSelectedDept] = useState('All');
  const [selectedType, setSelectedType] = useState('All');
  const [selectedLocation, setSelectedLocation] = useState('All');

  // Job Modal State
  const [viewingJob, setViewingJob] = useState<JobOpening | null>(null);

  // Custom other language input
  const [customLanguageInput, setCustomLanguageInput] = useState('');

  // ================= ADMIN: POST JOB STATE =================
  const [newJobData, setNewJobData] = useState({
    title: '',
    code: `SELF/REC/${new Date().getFullYear()}/0${jobs.length + 1}`,
    department: 'Programs & Field Operations',
    otherDepartment: '',
    location: 'Ranchi Head Office',
    otherLocation: '',
    type: 'Full-Time',
    otherType: '',
    experience: '2 - 4 Years',
    otherExperience: '',
    salary: '₹35,000 – ₹45,000 / month',
    otherSalary: '',
    openings: 1,
    deadline: '2026-10-31',
    isUrgent: false,
    shortDesc: '',
    responsibilities: [''],
    qualifications: [''],
    desirableSkills: ''
  });

  const [jobPostSuccess, setJobPostSuccess] = useState<string | null>(null);
  const [jobPostError, setJobPostError] = useState<string | null>(null);

  const addResponsibility = () => {
    setNewJobData((prev) => ({
      ...prev,
      responsibilities: [...prev.responsibilities, '']
    }));
  };

  const updateResponsibility = (index: number, val: string) => {
    const copy = [...newJobData.responsibilities];
    copy[index] = val;
    setNewJobData((prev) => ({ ...prev, responsibilities: copy }));
  };

  const removeResponsibility = (index: number) => {
    if (newJobData.responsibilities.length > 1) {
      const copy = newJobData.responsibilities.filter((_, i) => i !== index);
      setNewJobData((prev) => ({ ...prev, responsibilities: copy }));
    }
  };

  const addQualification = () => {
    setNewJobData((prev) => ({
      ...prev,
      qualifications: [...prev.qualifications, '']
    }));
  };

  const updateQualification = (index: number, val: string) => {
    const copy = [...newJobData.qualifications];
    copy[index] = val;
    setNewJobData((prev) => ({ ...prev, qualifications: copy }));
  };

  const removeQualification = (index: number) => {
    if (newJobData.qualifications.length > 1) {
      const copy = newJobData.qualifications.filter((_, i) => i !== index);
      setNewJobData((prev) => ({ ...prev, qualifications: copy }));
    }
  };

  const handlePublishJob = async (e: React.FormEvent) => {
    e.preventDefault();
    setJobPostError(null);

    if (!newJobData.title.trim()) {
      setJobPostError('Please enter the Job Title.');
      return;
    }
    if (newJobData.department === 'Other' && !newJobData.otherDepartment.trim()) {
      setJobPostError('Please type your custom Department name.');
      return;
    }
    if (newJobData.location === 'Other' && !newJobData.otherLocation.trim()) {
      setJobPostError('Please type your custom Location.');
      return;
    }
    if (newJobData.type === 'Other' && !newJobData.otherType.trim()) {
      setJobPostError('Please type your custom Employment Type.');
      return;
    }
    if (!newJobData.shortDesc.trim()) {
      setJobPostError('Please provide a brief job overview / summary.');
      return;
    }

    const dept = newJobData.department === 'Other' ? newJobData.otherDepartment.trim() : newJobData.department;
    const loc = newJobData.location === 'Other' ? newJobData.otherLocation.trim() : newJobData.location;
    const jobType = newJobData.type === 'Other' ? newJobData.otherType.trim() : newJobData.type;
    const exp = newJobData.experience === 'Other' ? newJobData.otherExperience.trim() : newJobData.experience;
    const sal = newJobData.salary === 'Other' ? newJobData.otherSalary.trim() : newJobData.salary;

    const filteredResp = newJobData.responsibilities.filter((r) => r.trim().length > 0);
    const filteredQual = newJobData.qualifications.filter((q) => q.trim().length > 0);

    const createdJob: JobOpening = {
      id: `job-${Date.now()}`,
      code: newJobData.code || `SELF/REC/${new Date().getFullYear()}/${Math.floor(10 + Math.random() * 90)}`,
      title: newJobData.title.trim(),
      department: dept,
      location: loc,
      type: jobType,
      experience: exp,
      salary: sal,
      openings: Number(newJobData.openings) || 1,
      deadline: newJobData.deadline,
      isUrgent: newJobData.isUrgent,
      isCustom: true,
      shortDesc: newJobData.shortDesc,
      responsibilities: filteredResp.length > 0 ? filteredResp : ['Conduct field project execution and community coordination.'],
      qualifications: filteredQual.length > 0 ? filteredQual : ['Relevant academic degree and development experience.'],
      desirableSkills: newJobData.desirableSkills ? newJobData.desirableSkills.split(',').map((s) => s.trim()) : ['Community engagement', 'MS Office']
    };

    try {
      const serverJob = await careerService.createJob({
        code: createdJob.code,
        title: createdJob.title,
        department: createdJob.department,
        location: createdJob.location,
        type: createdJob.type,
        experience: createdJob.experience,
        salary: createdJob.salary,
        openings: createdJob.openings,
        deadline: createdJob.deadline,
        shortDesc: createdJob.shortDesc,
        responsibilities: createdJob.responsibilities,
        qualifications: createdJob.qualifications,
        desirableSkills: createdJob.desirableSkills,
      });
      setJobs((prev) => [serverJob as any, ...prev]);
    } catch (apiErr: any) {
      console.warn('Saved locally:', apiErr);
      setJobs((prev) => [createdJob, ...prev]);
    }

    setJobPostSuccess(`Job Opening "${createdJob.title}" (${createdJob.code}) was successfully posted!`);

    setTimeout(() => {
      setJobPostSuccess(null);
      setActiveTab('candidate');
    }, 2000);
  };

  const handleDeleteJob = async (jobId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (window.confirm('Are you sure you want to remove this job vacancy?')) {
      try {
        await careerService.deleteJob(jobId);
      } catch (err) {
        console.warn('Delete on server skipped or failed', err);
      }
      setJobs((prev) => prev.filter((j) => j.id !== jobId));
    }
  };

  const handleUpdateAppStatus = async (appId: string, newStatus: CandidateApplication['status']) => {
    try {
      await careerService.updateCandidateStatus(appId, newStatus);
    } catch (err) {
      console.warn('Status update on server skipped or failed', err);
    }
    setApplications((prev) =>
      prev.map((app) => (app.id === appId ? { ...app, status: newStatus } : app))
    );
  };

  // ================= CANDIDATE APPLICATION FORM STATE =================
  const [applicantData, setApplicantData] = useState({
    // Position
    jobId: '',
    jobTitle: '',
    otherPosition: '',
    preferredLocation: 'Ranchi Head Office',
    otherLocation: '',
    expectedSalary: '₹30,000 – ₹40,000 / month',
    otherSalary: '',
    noticePeriod: '15 Days',
    otherNoticePeriod: '',
    
    // Personal Details
    fullName: '',
    guardianName: '',
    dob: '',
    gender: 'Female',
    otherGender: '',
    email: '',
    phone: '',
    whatsapp: '',
    currentAddress: '',
    district: 'Ranchi',
    otherDistrict: '',
    state: 'Jharkhand',
    otherState: '',
    pincode: '',
    idProofType: 'Aadhar Card',
    otherIdProof: '',
    idProofNumber: '',

    // Education
    highestQualification: "Master's / Post Graduate",
    otherQualification: '',
    degreeName: '',
    institution: '',
    passingYear: '2023',
    otherPassingYear: '',
    percentage: '',

    // Experience
    employmentStatus: 'Employed',
    otherEmploymentStatus: '',
    totalExperience: '1-3 Years',
    otherExperience: '',
    currentEmployer: '',
    currentDesignation: '',
    currentSalary: '',
    hasTwoWheeler: 'Yes',
    otherTwoWheeler: '',
    willingToTravel: 'Yes',
    otherTravelPreference: '',
    languages: ['Hindi', 'English'],

    // SOP, References & Other Notes
    coverLetter: '',
    additionalNotes: '',
    ref1Name: '',
    ref1Org: '',
    ref1Phone: '',
    ref2Name: '',
    ref2Org: '',
    ref2Phone: '',

    // Declaration
    agreeDeclaration: false
  });

  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState<string | null>(null);
  const [formError, setFormError] = useState<string | null>(null);

  const departments = ['All', ...Array.from(new Set(jobs.map((j) => j.department)))];
  const types = ['All', 'Full-Time', 'Contract', 'Internship', 'Consultancy'];
  const locations = ['All', 'Ranchi', 'Khunti', 'Simdega', 'Gumla'];

  const filteredJobs = jobs.filter((job) => {
    const matchesSearch =
      job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      job.shortDesc.toLowerCase().includes(searchQuery.toLowerCase()) ||
      job.code.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesDept = selectedDept === 'All' || job.department === selectedDept;
    const matchesType = selectedType === 'All' || job.type === selectedType;
    const matchesLoc =
      selectedLocation === 'All' ||
      job.location.toLowerCase().includes(selectedLocation.toLowerCase());
    return matchesSearch && matchesDept && matchesType && matchesLoc;
  });

  const handleApplyClick = (job?: JobOpening) => {
    setActiveTab('candidate');
    if (job) {
      setApplicantData((prev) => ({
        ...prev,
        jobId: job.id,
        jobTitle: `${job.code} - ${job.title}`
      }));
    } else {
      setApplicantData((prev) => ({
        ...prev,
        jobId: 'general',
        jobTitle: 'General Recruitment Pool / Open Application'
      }));
    }
    setSubmitSuccess(null);
    setFormError(null);
    setTimeout(() => {
      document.getElementById('application-form-section')?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  const toggleLanguage = (lang: string) => {
    setApplicantData((prev) => {
      const exists = prev.languages.includes(lang);
      return {
        ...prev,
        languages: exists ? prev.languages.filter((l) => l !== lang) : [...prev.languages, lang]
      };
    });
  };

  const handleAddCustomLanguage = (e: React.FormEvent) => {
    e.preventDefault();
    if (customLanguageInput.trim() && !applicantData.languages.includes(customLanguageInput.trim())) {
      setApplicantData((prev) => ({
        ...prev,
        languages: [...prev.languages, customLanguageInput.trim()]
      }));
      setCustomLanguageInput('');
    }
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    if (!applicantData.jobId) {
      setFormError('Please select a position or choose "Other Position".');
      return;
    }
    if (applicantData.jobId === 'other' && !applicantData.otherPosition.trim()) {
      setFormError('Please type your custom position / role name.');
      return;
    }
    if (!applicantData.fullName.trim()) {
      setFormError('Please enter your full name.');
      return;
    }
    if (!applicantData.email.trim() || !applicantData.email.includes('@')) {
      setFormError('Please enter a valid email address.');
      return;
    }
    if (!applicantData.phone.trim() || applicantData.phone.length < 10) {
      setFormError('Please enter a valid 10-digit mobile number.');
      return;
    }
    if (applicantData.preferredLocation === 'Other' && !applicantData.otherLocation.trim()) {
      setFormError('Please type your custom preferred work location.');
      return;
    }
    if (applicantData.expectedSalary === 'Other' && !applicantData.otherSalary.trim()) {
      setFormError('Please type your expected salary/remuneration.');
      return;
    }
    if (applicantData.noticePeriod === 'Other' && !applicantData.otherNoticePeriod.trim()) {
      setFormError('Please type your custom availability / notice period.');
      return;
    }
    if (applicantData.gender === 'Other' && !applicantData.otherGender.trim()) {
      setFormError('Please type your gender.');
      return;
    }
    if (applicantData.idProofType === 'Other' && !applicantData.otherIdProof.trim()) {
      setFormError('Please type your ID proof name.');
      return;
    }
    if (applicantData.district === 'Other' && !applicantData.otherDistrict.trim()) {
      setFormError('Please type your custom district.');
      return;
    }
    if (applicantData.state === 'Other' && !applicantData.otherState.trim()) {
      setFormError('Please type your custom state.');
      return;
    }
    if (applicantData.highestQualification === 'Other' && !applicantData.otherQualification.trim()) {
      setFormError('Please type your custom academic qualification.');
      return;
    }
    if (applicantData.passingYear === 'Other' && !applicantData.otherPassingYear.trim()) {
      setFormError('Please type your graduation year.');
      return;
    }
    if (applicantData.employmentStatus === 'Other' && !applicantData.otherEmploymentStatus.trim()) {
      setFormError('Please type your employment status.');
      return;
    }
    if (applicantData.totalExperience === 'Other' && !applicantData.otherExperience.trim()) {
      setFormError('Please type your total experience.');
      return;
    }
    if (applicantData.hasTwoWheeler === 'Other' && !applicantData.otherTwoWheeler.trim()) {
      setFormError('Please type your two-wheeler / vehicle transport status.');
      return;
    }
    if (applicantData.willingToTravel === 'Other' && !applicantData.otherTravelPreference.trim()) {
      setFormError('Please type your travel preferences.');
      return;
    }
    if (!resumeFile) {
      setFormError('Please upload your updated Resume / CV (PDF or Word document).');
      return;
    }
    if (!applicantData.agreeDeclaration) {
      setFormError('Please check and confirm the declaration before submitting.');
      return;
    }

    setIsSubmitting(true);

    setTimeout(() => {
      setIsSubmitting(false);
      const generatedRef = `SELF-REC-${new Date().getFullYear()}-${Math.floor(100000 + Math.random() * 900000)}`;
      setSubmitSuccess(generatedRef);

      const finalPosition = applicantData.jobId === 'other'
        ? applicantData.otherPosition
        : applicantData.jobTitle;

      const finalLocation = applicantData.preferredLocation === 'Other'
        ? applicantData.otherLocation
        : applicantData.preferredLocation;

      const finalQual = applicantData.highestQualification === 'Other'
        ? applicantData.otherQualification
        : applicantData.highestQualification;

      const finalExp = applicantData.totalExperience === 'Other'
        ? applicantData.otherExperience
        : applicantData.totalExperience;

      const finalSalary = applicantData.expectedSalary === 'Other'
        ? applicantData.otherSalary
        : applicantData.expectedSalary;

      const newApp: CandidateApplication = {
        id: `app-${Date.now()}`,
        refNumber: generatedRef,
        jobId: applicantData.jobId,
        jobTitle: finalPosition,
        fullName: applicantData.fullName,
        email: applicantData.email,
        phone: applicantData.phone,
        location: finalLocation,
        qualification: finalQual,
        experience: finalExp,
        salaryExpected: finalSalary,
        resumeName: resumeFile ? resumeFile.name : 'Resume_Document.pdf',
        submittedAt: new Date().toISOString().split('T')[0],
        status: 'Under Review',
        coverLetter: applicantData.coverLetter,
        additionalNotes: applicantData.additionalNotes,
        languages: applicantData.languages
      };

      setApplications((prev) => [newApp, ...prev]);

      setTimeout(() => {
        document.getElementById('application-success-box')?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    }, 1200);
  };

  return (
    <div className="bg-slate-50 text-slate-800 min-h-screen">
      {/* 1. HERO BANNER */}
      <div className="bg-gradient-to-br from-[#0a270d] via-[#0f3813] to-[#1b5e20] text-white py-12 px-4 md:px-8 border-b-4 border-[#2e7d32] relative overflow-hidden">
        <div className="absolute right-0 top-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute left-10 bottom-0 w-64 h-64 bg-amber-400/10 rounded-full blur-2xl pointer-events-none" />

        <div className="max-w-7xl mx-auto space-y-6 relative z-10">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="inline-flex items-center gap-2 bg-emerald-800/80 text-emerald-200 text-xs font-bold px-3.5 py-1.5 rounded-full uppercase tracking-wider border border-emerald-700">
              <Briefcase className="h-3.5 w-3.5 text-amber-300" /> SELF Recruitment & Career Portal
            </div>

            {/* View Switcher */}
            <div className="flex items-center bg-black/30 p-1 rounded-xl border border-white/15">
              <button
                onClick={() => setActiveTab('candidate')}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                  activeTab === 'candidate'
                    ? 'bg-[#2e7d32] text-white shadow-md'
                    : 'text-emerald-200 hover:text-white'
                }`}
              >
                <User className="h-3.5 w-3.5" /> Candidate: Explore & Apply
              </button>
              {canManageJobs ? (
                <>
                  <button
                    onClick={() => setActiveTab('admin-post')}
                    className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                      activeTab === 'admin-post'
                        ? 'bg-amber-400 text-slate-900 shadow-md font-extrabold'
                        : 'text-emerald-200 hover:text-white'
                    }`}
                  >
                    <Plus className="h-3.5 w-3.5" /> Post Job Opening
                  </button>
                  <button
                    onClick={() => setActiveTab('admin-applications')}
                    className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                      activeTab === 'admin-applications'
                        ? 'bg-amber-400 text-slate-900 shadow-md font-extrabold'
                        : 'text-emerald-200 hover:text-white'
                    }`}
                  >
                    <FileCheck className="h-3.5 w-3.5" /> Applicants & Shortlist ({applications.length})
                  </button>
                </>
              ) : (
                <Link
                  to="/login?role=admin"
                  className="px-3.5 py-1.5 rounded-lg text-xs font-semibold text-emerald-200 hover:text-white transition-all flex items-center gap-1.5 opacity-80 hover:opacity-100"
                >
                  <Lock className="h-3.5 w-3.5" /> Admin / Recruiter Login
                </Link>
              )}
            </div>
          </div>

          <div className="max-w-3xl space-y-2">
            <h1 className="text-3xl md:text-5xl font-black tracking-tight text-white leading-tight">
              Careers, Recruitment & Grassroots Opportunities
            </h1>
            <p className="text-emerald-100 text-xs md:text-sm leading-relaxed">
              Admin can post new jobs, and users can apply for any position. In every field, an "Other" option is available to type custom details.
            </p>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2 border-t border-emerald-800/80 max-w-4xl text-left">
            <div className="bg-white/5 p-2.5 rounded-lg border border-white/10">
              <span className="text-2xl font-extrabold text-amber-400 block">{jobs.length}</span>
              <span className="text-[11px] text-emerald-200 font-medium">Active Job Openings</span>
            </div>
            <div className="bg-white/5 p-2.5 rounded-lg border border-white/10">
              <span className="text-2xl font-extrabold text-white block">{applications.length}</span>
              <span className="text-[11px] text-emerald-200 font-medium">Applications Received</span>
            </div>
            <div className="bg-white/5 p-2.5 rounded-lg border border-white/10">
              <span className="text-2xl font-extrabold text-white block">5</span>
              <span className="text-[11px] text-emerald-200 font-medium">Districts Covered</span>
            </div>
            <div className="bg-white/5 p-2.5 rounded-lg border border-white/10">
              <span className="text-2xl font-extrabold text-emerald-400 block">100%</span>
              <span className="text-[11px] text-emerald-200 font-medium">Custom "Other" Enabled</span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 md:px-8 py-10 space-y-10">
        
        {/* ================= TAB 1: ADMIN - POST A NEW JOB ================= */}
        {activeTab === 'admin-post' && (
          <div className="bg-white rounded-2xl border border-slate-200 shadow-lg overflow-hidden animate-fadeIn">
            <div className="bg-gradient-to-r from-[#0f3813] to-[#1b5e20] text-white p-6 flex items-center justify-between">
              <div className="space-y-1">
                <div className="inline-flex items-center gap-1.5 text-amber-300 text-xs font-bold uppercase tracking-wider">
                  <Lock className="h-3.5 w-3.5" /> Admin / Recruiter Portal
                </div>
                <h2 className="text-2xl font-black text-white">
                  Post a New Job Vacancy
                </h2>
                <p className="text-emerald-100 text-xs">
                  Fill out the job specifications. Every field contains an "Other" option in case you want to type custom requirements.
                </p>
              </div>

              <button
                onClick={() => setActiveTab('candidate')}
                className="text-xs bg-white/10 hover:bg-white/20 px-3 py-1.5 rounded-lg font-bold transition-colors"
              >
                ← Back to Candidate View
              </button>
            </div>

            {jobPostSuccess && (
              <div className="m-6 p-4 bg-emerald-50 border border-emerald-300 rounded-xl text-xs text-emerald-900 font-semibold flex items-center gap-2">
                <CheckCircle2 className="h-5 w-5 text-[#2e7d32] flex-shrink-0" />
                <span>{jobPostSuccess}</span>
              </div>
            )}

            {jobPostError && (
              <div className="m-6 p-4 bg-rose-50 border border-rose-300 rounded-xl text-xs text-rose-900 font-semibold flex items-center gap-2">
                <AlertCircle className="h-5 w-5 text-rose-600 flex-shrink-0" />
                <span>{jobPostError}</span>
              </div>
            )}

            <form onSubmit={handlePublishJob} className="p-6 md:p-8 space-y-6 text-xs">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                {/* Title */}
                <div className="md:col-span-2 space-y-1">
                  <label className="font-bold text-slate-700 block">
                    Job Title / Designation <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Field Coordinator - Watershed Management"
                    value={newJobData.title}
                    onChange={(e) => setNewJobData({ ...newJobData, title: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-lg text-slate-800 font-medium focus:bg-white focus:ring-2 focus:ring-[#2e7d32]"
                  />
                </div>

                {/* Job Code */}
                <div className="space-y-1">
                  <label className="font-bold text-slate-700 block">
                    Job Reference Code <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. SELF/REC/2026/08"
                    value={newJobData.code}
                    onChange={(e) => setNewJobData({ ...newJobData, code: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-lg text-slate-800 font-medium focus:bg-white focus:ring-2 focus:ring-[#2e7d32]"
                  />
                </div>

                {/* Department */}
                <div className="space-y-1">
                  <label className="font-bold text-slate-700 block">Department</label>
                  <select
                    value={newJobData.department}
                    onChange={(e) => setNewJobData({ ...newJobData, department: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-lg text-slate-800 focus:bg-white focus:ring-2 focus:ring-[#2e7d32]"
                  >
                    <option value="Programs & Field Operations">Programs & Field Operations</option>
                    <option value="Research & Impact Evaluation">Research & Impact Evaluation</option>
                    <option value="Education & Digital Labs">Education & Digital Labs</option>
                    <option value="Health & Nutrition">Health & Nutrition</option>
                    <option value="Agriculture & Environment">Agriculture & Environment</option>
                    <option value="Management & Communications">Management & Communications</option>
                    <option value="Finance & Accounts">Finance & Accounts</option>
                    <option value="Other">Other Department (Type custom below)</option>
                  </select>
                </div>

                {/* Other Dept */}
                {newJobData.department === 'Other' && (
                  <div className="space-y-1 animate-fadeIn">
                    <label className="font-bold text-[#1b5e20] block flex items-center gap-1">
                      <Edit3 className="h-3 w-3" /> Type Custom Department Name <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Legal & Statutory, Renewable Energy, etc."
                      value={newJobData.otherDepartment}
                      onChange={(e) => setNewJobData({ ...newJobData, otherDepartment: e.target.value })}
                      className="w-full p-2.5 bg-white border border-emerald-400 rounded-lg font-medium"
                    />
                  </div>
                )}

                {/* Location */}
                <div className="space-y-1">
                  <label className="font-bold text-slate-700 block">Work Location</label>
                  <select
                    value={newJobData.location}
                    onChange={(e) => setNewJobData({ ...newJobData, location: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-lg text-slate-800 focus:bg-white focus:ring-2 focus:ring-[#2e7d32]"
                  >
                    <option value="Ranchi Head Office">Ranchi Head Office</option>
                    <option value="Khunti District Field">Khunti District Field</option>
                    <option value="Simdega District Field">Simdega District Field</option>
                    <option value="Gumla District Field">Gumla District Field</option>
                    <option value="Ratu & Itki Block (Ranchi)">Ratu & Itki Block (Ranchi)</option>
                    <option value="Any Tribal District / Flexible">Any Tribal District / Flexible</option>
                    <option value="Other">Other Location (Type custom below)</option>
                  </select>
                </div>

                {/* Other Location */}
                {newJobData.location === 'Other' && (
                  <div className="space-y-1 animate-fadeIn">
                    <label className="font-bold text-[#1b5e20] block flex items-center gap-1">
                      <Edit3 className="h-3 w-3" /> Type Custom Work Location <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. West Singhbhum, Dumka, Latehar, Remote"
                      value={newJobData.otherLocation}
                      onChange={(e) => setNewJobData({ ...newJobData, otherLocation: e.target.value })}
                      className="w-full p-2.5 bg-white border border-emerald-400 rounded-lg font-medium"
                    />
                  </div>
                )}

                {/* Employment Type */}
                <div className="space-y-1">
                  <label className="font-bold text-slate-700 block">Employment Type</label>
                  <select
                    value={newJobData.type}
                    onChange={(e) => setNewJobData({ ...newJobData, type: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-lg text-slate-800 focus:bg-white focus:ring-2 focus:ring-[#2e7d32]"
                  >
                    <option value="Full-Time">Full-Time</option>
                    <option value="Contract">Contract</option>
                    <option value="Internship">Internship</option>
                    <option value="Consultancy">Consultancy</option>
                    <option value="Other">Other Type (Type custom below)</option>
                  </select>
                </div>

                {newJobData.type === 'Other' && (
                  <div className="space-y-1 animate-fadeIn">
                    <label className="font-bold text-[#1b5e20] block flex items-center gap-1">
                      <Edit3 className="h-3 w-3" /> Type Custom Employment Type <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Part-time, Fellow, Volunteer, Retainer"
                      value={newJobData.otherType}
                      onChange={(e) => setNewJobData({ ...newJobData, otherType: e.target.value })}
                      className="w-full p-2.5 bg-white border border-emerald-400 rounded-lg font-medium"
                    />
                  </div>
                )}

                {/* Experience */}
                <div className="space-y-1">
                  <label className="font-bold text-slate-700 block">Experience Required</label>
                  <select
                    value={newJobData.experience}
                    onChange={(e) => setNewJobData({ ...newJobData, experience: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-lg text-slate-800 focus:bg-white focus:ring-2 focus:ring-[#2e7d32]"
                  >
                    <option value="Fresher / Students">Fresher / Students</option>
                    <option value="1 - 3 Years">1 - 3 Years</option>
                    <option value="2 - 4 Years">2 - 4 Years</option>
                    <option value="3 - 5 Years">3 - 5 Years</option>
                    <option value="5+ Years">5+ Years</option>
                    <option value="Other">Other Experience (Type custom below)</option>
                  </select>
                </div>

                {newJobData.experience === 'Other' && (
                  <div className="space-y-1 animate-fadeIn">
                    <label className="font-bold text-[#1b5e20] block flex items-center gap-1">
                      <Edit3 className="h-3 w-3" /> Type Custom Experience Requirement <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. 10+ Years Executive, Retired Officer"
                      value={newJobData.otherExperience}
                      onChange={(e) => setNewJobData({ ...newJobData, otherExperience: e.target.value })}
                      className="w-full p-2.5 bg-white border border-emerald-400 rounded-lg font-medium"
                    />
                  </div>
                )}

                {/* Salary */}
                <div className="space-y-1">
                  <label className="font-bold text-slate-700 block">Remuneration / Salary Range</label>
                  <select
                    value={newJobData.salary}
                    onChange={(e) => setNewJobData({ ...newJobData, salary: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-lg text-slate-800 focus:bg-white focus:ring-2 focus:ring-[#2e7d32]"
                  >
                    <option value="₹15,000 – ₹25,000 / month">₹15,000 – ₹25,000 / month</option>
                    <option value="₹25,000 – ₹35,000 / month">₹25,000 – ₹35,000 / month</option>
                    <option value="₹35,000 – ₹45,000 / month">₹35,000 – ₹45,000 / month</option>
                    <option value="₹45,000 – ₹60,000 / month">₹45,000 – ₹60,000 / month</option>
                    <option value="₹60,000+ / month">₹60,000+ / month</option>
                    <option value="As per Industry Standards / Negotiable">As per Industry Standards / Negotiable</option>
                    <option value="Other">Other Salary / Stipend (Type custom below)</option>
                  </select>
                </div>

                {newJobData.salary === 'Other' && (
                  <div className="space-y-1 animate-fadeIn">
                    <label className="font-bold text-[#1b5e20] block flex items-center gap-1">
                      <Edit3 className="h-3 w-3" /> Type Custom Remuneration <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. ₹5,000 per field visit / Daily Honorarium"
                      value={newJobData.otherSalary}
                      onChange={(e) => setNewJobData({ ...newJobData, otherSalary: e.target.value })}
                      className="w-full p-2.5 bg-white border border-emerald-400 rounded-lg font-medium"
                    />
                  </div>
                )}

                {/* Openings */}
                <div className="space-y-1">
                  <label className="font-bold text-slate-700 block">Number of Openings</label>
                  <input
                    type="number"
                    min={1}
                    value={newJobData.openings}
                    onChange={(e) => setNewJobData({ ...newJobData, openings: Number(e.target.value) })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-lg"
                  />
                </div>

                {/* Deadline */}
                <div className="space-y-1">
                  <label className="font-bold text-slate-700 block">Application Deadline</label>
                  <input
                    type="date"
                    value={newJobData.deadline}
                    onChange={(e) => setNewJobData({ ...newJobData, deadline: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-lg"
                  />
                </div>

                {/* Urgent check */}
                <div className="flex items-center gap-2 pt-6">
                  <input
                    type="checkbox"
                    id="urgent-check"
                    checked={newJobData.isUrgent}
                    onChange={(e) => setNewJobData({ ...newJobData, isUrgent: e.target.checked })}
                    className="h-4 w-4 text-[#2e7d32] rounded focus:ring-[#2e7d32]"
                  />
                  <label htmlFor="urgent-check" className="font-bold text-slate-700 cursor-pointer">
                    Flag as Immediate / Urgent Requirement
                  </label>
                </div>
              </div>

              {/* Short Overview */}
              <div className="space-y-1 pt-2">
                <label className="font-bold text-slate-700 block">
                  Short Overview / Summary <span className="text-rose-500">*</span>
                </label>
                <textarea
                  rows={2}
                  required
                  placeholder="Describe the main objectives and scope of this role..."
                  value={newJobData.shortDesc}
                  onChange={(e) => setNewJobData({ ...newJobData, shortDesc: e.target.value })}
                  className="w-full p-3 bg-slate-50 border border-slate-300 rounded-lg text-slate-800"
                />
              </div>

              {/* Key Responsibilities */}
              <div className="space-y-2 pt-2 border-t border-slate-200">
                <div className="flex justify-between items-center">
                  <label className="font-bold text-slate-800 block text-xs uppercase tracking-wide">
                    Key Responsibilities (Add bullet points)
                  </label>
                  <button
                    type="button"
                    onClick={addResponsibility}
                    className="text-xs text-[#2e7d32] hover:underline font-bold flex items-center gap-1"
                  >
                    <Plus className="h-3.5 w-3.5" /> Add Another Responsibility
                  </button>
                </div>
                {newJobData.responsibilities.map((resp, idx) => (
                  <div key={idx} className="flex items-center gap-2">
                    <span className="text-slate-400 font-bold w-4 text-right">{idx + 1}.</span>
                    <input
                      type="text"
                      placeholder="e.g. Conduct baseline survey and community mobilization meetings"
                      value={resp}
                      onChange={(e) => updateResponsibility(idx, e.target.value)}
                      className="flex-1 p-2 bg-slate-50 border border-slate-300 rounded-lg text-xs"
                    />
                    {newJobData.responsibilities.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeResponsibility(idx)}
                        className="p-2 text-rose-500 hover:text-rose-700"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    )}
                  </div>
                ))}
              </div>

              {/* Qualifications */}
              <div className="space-y-2 pt-2 border-t border-slate-200">
                <div className="flex justify-between items-center">
                  <label className="font-bold text-slate-800 block text-xs uppercase tracking-wide">
                    Educational Qualifications & Experience Required
                  </label>
                  <button
                    type="button"
                    onClick={addQualification}
                    className="text-xs text-[#2e7d32] hover:underline font-bold flex items-center gap-1"
                  >
                    <Plus className="h-3.5 w-3.5" /> Add Another Qualification
                  </button>
                </div>
                {newJobData.qualifications.map((qual, idx) => (
                  <div key={idx} className="flex items-center gap-2">
                    <span className="text-slate-400 font-bold w-4 text-right">{idx + 1}.</span>
                    <input
                      type="text"
                      placeholder="e.g. MSW or Bachelor's in Agriculture with 2+ years field experience"
                      value={qual}
                      onChange={(e) => updateQualification(idx, e.target.value)}
                      className="flex-1 p-2 bg-slate-50 border border-slate-300 rounded-lg text-xs"
                    />
                    {newJobData.qualifications.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeQualification(idx)}
                        className="p-2 text-rose-500 hover:text-rose-700"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    )}
                  </div>
                ))}
              </div>

              {/* Desirable skills */}
              <div className="space-y-1 pt-2">
                <label className="font-bold text-slate-700 block">
                  Desirable Skills / Competencies (Comma separated)
                </label>
                <input
                  type="text"
                  placeholder="e.g. PRA techniques, SHG formation, ODK data collection, Mundari dialect"
                  value={newJobData.desirableSkills}
                  onChange={(e) => setNewJobData({ ...newJobData, desirableSkills: e.target.value })}
                  className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-lg"
                />
              </div>

              {/* Publish button */}
              <div className="pt-4 flex justify-end gap-3 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setActiveTab('candidate')}
                  className="px-5 py-2.5 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-[#2e7d32] hover:bg-[#1b5e20] text-white font-extrabold text-xs uppercase tracking-wider px-8 py-3 rounded-xl shadow-md hover:shadow-lg transition-all flex items-center gap-2"
                >
                  <Sparkles className="h-4 w-4" /> Publish Job Opening
                </button>
              </div>
            </form>
          </div>
        )}

        {/* ================= TAB 2: ADMIN - RECEIVED APPLICATIONS ================= */}
        {activeTab === 'admin-applications' && (
          <div className="bg-white rounded-2xl border border-slate-200 shadow-lg overflow-hidden animate-fadeIn space-y-6 p-6 md:p-8">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 pb-4 border-b border-slate-200">
              <div>
                <span className="text-[10px] font-extrabold uppercase text-[#2e7d32] tracking-wider bg-emerald-50 px-2 py-0.5 rounded">
                  Admin Recruitment Tracking
                </span>
                <h2 className="text-2xl font-black text-slate-900 mt-1">
                  Received Job Applications ({applications.length})
                </h2>
                <p className="text-xs text-slate-500">
                  Review applicant profiles, change review statuses, and inspect custom "Other" answers typed by candidates.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setActiveTab('admin-post')}
                  className="bg-[#2e7d32] text-white text-xs font-bold px-3.5 py-2 rounded-lg flex items-center gap-1.5"
                >
                  <Plus className="h-3.5 w-3.5" /> Post Another Job
                </button>
                <button
                  onClick={() => setActiveTab('candidate')}
                  className="bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold px-3.5 py-2 rounded-lg"
                >
                  Candidate View
                </button>
              </div>
            </div>

            {applications.length === 0 ? (
              <div className="text-center py-12 space-y-3">
                <FileCheck className="h-10 w-10 text-slate-300 mx-auto" />
                <h4 className="font-bold text-sm text-slate-700">No applications received yet</h4>
                <p className="text-xs text-slate-500">Applications submitted by users will be listed here automatically.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase text-[10px] tracking-wider">
                      <th className="p-3">Ref ID</th>
                      <th className="p-3">Candidate</th>
                      <th className="p-3">Position</th>
                      <th className="p-3">Location / Exp</th>
                      <th className="p-3">Date</th>
                      <th className="p-3">Status</th>
                      <th className="p-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {applications.map((app) => (
                      <tr key={app.id} className="hover:bg-slate-50/70 transition-colors">
                        <td className="p-3 font-mono font-bold text-[#1b5e20]">{app.refNumber}</td>
                        <td className="p-3">
                          <div className="font-bold text-slate-900">{app.fullName}</div>
                          <div className="text-[11px] text-slate-500">{app.email} • {app.phone}</div>
                        </td>
                        <td className="p-3 font-medium text-slate-800 max-w-xs truncate">{app.jobTitle}</td>
                        <td className="p-3 text-slate-600">
                          <div>{app.location}</div>
                          <div className="text-[10px] text-slate-500">Exp: {app.experience}</div>
                        </td>
                        <td className="p-3 text-slate-500">{app.submittedAt}</td>
                        <td className="p-3">
                          <select
                            value={app.status}
                            onChange={(e) => handleUpdateAppStatus(app.id, e.target.value as any)}
                            className={`p-1 text-[11px] font-bold rounded border cursor-pointer ${
                              app.status === 'Shortlisted'
                                ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                                : app.status === 'Interview Scheduled'
                                ? 'bg-blue-50 text-blue-800 border-blue-300'
                                : app.status === 'Selected'
                                ? 'bg-purple-50 text-purple-800 border-purple-300'
                                : app.status === 'Rejected'
                                ? 'bg-rose-50 text-rose-800 border-rose-300'
                                : 'bg-amber-50 text-amber-800 border-amber-300'
                            }`}
                          >
                            <option value="Under Review">Under Review</option>
                            <option value="Shortlisted">Shortlisted</option>
                            <option value="Interview Scheduled">Interview Scheduled</option>
                            <option value="Selected">Selected</option>
                            <option value="Rejected">Rejected</option>
                          </select>
                        </td>
                        <td className="p-3 text-right">
                          <button
                            onClick={() => alert(`Applicant Profile:\nName: ${app.fullName}\nEmail: ${app.email}\nPhone: ${app.phone}\nRole: ${app.jobTitle}\nQualification: ${app.qualification}\nExpected Salary: ${app.salaryExpected}\nResume File: ${app.resumeName}\nLanguages: ${app.languages?.join(', ')}\n\nStatement of Purpose:\n${app.coverLetter || 'None provided'}\n\nAdditional Notes:\n${app.additionalNotes || 'None'}`)}
                            className="text-[#2e7d32] hover:underline font-bold text-xs"
                          >
                            View Profile
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* ================= TAB 3: CANDIDATE VIEW ================= */}
        {activeTab === 'candidate' && (
          <>
            {/* 2. RECRUITMENT NOTICE */}
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 md:p-5 flex items-start gap-4 shadow-sm text-slate-800">
              <div className="p-2.5 bg-amber-100 rounded-lg text-amber-800 flex-shrink-0">
                <AlertCircle className="h-5 w-5" />
              </div>
              <div className="space-y-1 text-xs leading-relaxed">
                <h4 className="font-bold text-amber-900 uppercase text-xs tracking-wider">
                  Recruitment Notification & Integrity Notice (Advt. No. SELF/REC/2026-I)
                </h4>
                <p className="text-slate-700">
                  SELF Foundation never charges any application or processing fee at any stage of recruitment. In the application form below, every field allows you to choose "Other" to type your own specific answers.
                </p>
                <div className="pt-1 text-[11px] font-semibold text-emerald-900 flex flex-wrap gap-x-4 gap-y-1">
                  <span>Recruitment Cell: <strong className="underline">careers@selfjharkhand.org</strong></span>
                  <span>HR Helpdesk: <strong>+91 9431775101</strong></span>
                </div>
              </div>
            </div>

            {/* 3. SEARCH & FILTERS BAR */}
            <div id="openings" className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-4">
              <div className="flex flex-col md:flex-row gap-3 items-center justify-between">
                <div className="relative w-full md:w-96">
                  <Search className="h-4 w-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search job title, code, or keyword..."
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#2e7d32] focus:border-transparent transition-all"
                  />
                </div>

                <div className="flex flex-wrap items-center gap-2.5 w-full md:w-auto">
                  <div className="flex items-center gap-1 text-xs text-slate-500 font-semibold">
                    <Filter className="h-3.5 w-3.5" /> Filters:
                  </div>

                  {/* Department filter */}
                  <select
                    value={selectedDept}
                    onChange={(e) => setSelectedDept(e.target.value)}
                    className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-[#2e7d32]"
                  >
                    {departments.map((dept) => (
                      <option key={dept} value={dept}>
                        {dept === 'All' ? 'All Departments' : dept}
                      </option>
                    ))}
                  </select>

                  {/* Job type filter */}
                  <select
                    value={selectedType}
                    onChange={(e) => setSelectedType(e.target.value)}
                    className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-[#2e7d32]"
                  >
                    {types.map((type) => (
                      <option key={type} value={type}>
                        {type === 'All' ? 'All Job Types' : type}
                      </option>
                    ))}
                  </select>

                  {/* Location filter */}
                  <select
                    value={selectedLocation}
                    onChange={(e) => setSelectedLocation(e.target.value)}
                    className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-[#2e7d32]"
                  >
                    {locations.map((loc) => (
                      <option key={loc} value={loc}>
                        {loc === 'All' ? 'All Locations' : loc}
                      </option>
                    ))}
                  </select>

                  {(searchQuery || selectedDept !== 'All' || selectedType !== 'All' || selectedLocation !== 'All') && (
                    <button
                      onClick={() => {
                        setSearchQuery('');
                        setSelectedDept('All');
                        setSelectedType('All');
                        setSelectedLocation('All');
                      }}
                      className="text-xs text-rose-600 hover:text-rose-700 font-bold px-2 py-1"
                    >
                      Reset
                    </button>
                  )}
                </div>
              </div>

              <div className="text-xs text-slate-500 font-medium flex justify-between items-center border-t border-slate-100 pt-3">
                <span>Showing <strong>{filteredJobs.length}</strong> of <strong>{jobs.length}</strong> available positions</span>
                <span className="text-[11px] text-emerald-800 font-bold bg-emerald-50 px-2.5 py-0.5 rounded-full">
                  Updated for Fiscal Year 2026-27
                </span>
              </div>
            </div>

            {/* 4. JOB LISTINGS GRID */}
            <div className="space-y-4">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <h2 className="text-xl md:text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
                  <Briefcase className="h-5 w-5 text-[#2e7d32]" />
                  Current Job Openings
                </h2>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setActiveTab('admin-post')}
                    className="text-xs font-bold bg-amber-50 text-amber-900 border border-amber-300 px-3 py-1.5 rounded-lg flex items-center gap-1.5 hover:bg-amber-100 transition-colors"
                  >
                    <Plus className="h-3.5 w-3.5" /> Admin: Post a New Job
                  </button>
                  <button
                    onClick={() => handleApplyClick()}
                    className="text-xs font-bold text-[#2e7d32] hover:underline flex items-center gap-1"
                  >
                    General Application Pool <ArrowRight className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>

              {filteredJobs.length === 0 ? (
                <div className="bg-white border border-slate-200 rounded-2xl p-12 text-center space-y-3">
                  <Briefcase className="h-10 w-10 text-slate-300 mx-auto" />
                  <h3 className="font-bold text-base text-slate-800">No matching job positions found</h3>
                  <p className="text-xs text-slate-500 max-w-md mx-auto">
                    No openings currently match your selected filters. Try clearing your filters or submit a general application.
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                  {filteredJobs.map((job) => (
                    <div
                      key={job.id}
                      className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm hover:shadow-md hover:border-emerald-500 transition-all flex flex-col justify-between group relative"
                    >
                      <div className="space-y-4">
                        {/* Header */}
                        <div className="space-y-2">
                          <div className="flex flex-wrap items-center justify-between gap-2">
                            <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#2e7d32] bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                              {job.code}
                            </span>
                            <div className="flex items-center gap-2">
                              {job.isCustom && (
                                <span className="text-[10px] font-extrabold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded">
                                  Newly Posted
                                </span>
                              )}
                              {job.isUrgent && (
                                <span className="text-[10px] font-extrabold text-rose-600 bg-rose-50 px-2 py-0.5 rounded border border-rose-200 animate-pulse">
                                  Immediate
                                </span>
                              )}
                              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-700">
                                {job.type}
                              </span>
                            </div>
                          </div>

                          <h3 className="text-lg font-black text-slate-900 group-hover:text-[#1b5e20] transition-colors leading-tight">
                            {job.title}
                          </h3>

                          <span className="text-xs font-semibold text-slate-500 block">
                            {job.department}
                          </span>
                        </div>

                        {/* Meta Specs */}
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 py-2.5 px-3 bg-[#f8fafc] rounded-xl text-[11px] text-slate-600 border border-slate-100">
                          <div className="flex items-center gap-1.5">
                            <MapPin className="h-3.5 w-3.5 text-emerald-600 flex-shrink-0" />
                            <span className="truncate">{job.location}</span>
                          </div>
                          <div className="flex items-center gap-1.5">
                            <GraduationCap className="h-3.5 w-3.5 text-emerald-600 flex-shrink-0" />
                            <span>Exp: {job.experience}</span>
                          </div>
                          <div className="flex items-center gap-1.5">
                            <IndianRupee className="h-3.5 w-3.5 text-emerald-600 flex-shrink-0" />
                            <span className="truncate font-semibold text-slate-900">{job.salary}</span>
                          </div>
                          <div className="flex items-center gap-1.5">
                            <User className="h-3.5 w-3.5 text-emerald-600 flex-shrink-0" />
                            <span>{job.openings} {job.openings === 1 ? 'Opening' : 'Openings'}</span>
                          </div>
                          <div className="flex items-center gap-1.5 col-span-2">
                            <Calendar className="h-3.5 w-3.5 text-rose-500 flex-shrink-0" />
                            <span>Apply before: <strong className="text-slate-800">{job.deadline}</strong></span>
                          </div>
                        </div>

                        {/* Brief description */}
                        <p className="text-xs text-slate-600 leading-relaxed line-clamp-2">
                          {job.shortDesc}
                        </p>

                        {/* Responsibilities highlight */}
                        <div className="space-y-1.5 pt-1">
                          <span className="text-[10px] font-extrabold uppercase text-slate-400 tracking-wider block">
                            Key Responsibilities:
                          </span>
                          <ul className="space-y-1 text-xs text-slate-700">
                            {job.responsibilities.slice(0, 2).map((resp, rIdx) => (
                              <li key={rIdx} className="flex items-start gap-1.5">
                                <CheckCircle2 className="h-3.5 w-3.5 text-[#2e7d32] flex-shrink-0 mt-0.5" />
                                <span className="line-clamp-1">{resp}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="pt-5 mt-4 border-t border-slate-100 flex items-center justify-between gap-3">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => setViewingJob(job)}
                            className="text-xs font-bold text-slate-600 hover:text-slate-900 hover:underline flex items-center gap-1"
                          >
                            <Eye className="h-3.5 w-3.5" /> View JD
                          </button>
                          {job.isCustom && (
                            <button
                              onClick={(e) => handleDeleteJob(job.id, e)}
                              className="text-xs text-rose-500 hover:text-rose-700 font-semibold flex items-center gap-1 ml-2"
                              title="Delete this custom posted job"
                            >
                              <Trash2 className="h-3 w-3" /> Remove
                            </button>
                          )}
                        </div>

                        <button
                          onClick={() => handleApplyClick(job)}
                          className="bg-[#2e7d32] hover:bg-[#1b5e20] text-white font-extrabold text-xs uppercase tracking-wider px-4 py-2 rounded-lg shadow transition-all flex items-center gap-1.5 cursor-pointer"
                        >
                          Apply Now <ChevronRight className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* 5. JOB DETAILS MODAL */}
            {viewingJob && (
              <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fadeIn">
                <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 md:p-8 space-y-6 shadow-2xl border border-slate-200">
                  <div className="flex justify-between items-start border-b border-slate-100 pb-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-extrabold text-[#2e7d32] bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                          {viewingJob.code}
                        </span>
                        <span className="text-xs font-bold text-slate-600 bg-slate-100 px-2 py-0.5 rounded">
                          {viewingJob.type}
                        </span>
                      </div>
                      <h3 className="text-xl font-black text-slate-900">
                        {viewingJob.title}
                      </h3>
                      <p className="text-xs text-slate-500 font-medium">
                        Department: {viewingJob.department} • Location: {viewingJob.location}
                      </p>
                    </div>
                    <button
                      onClick={() => setViewingJob(null)}
                      className="p-1 text-slate-400 hover:text-slate-700 rounded-full hover:bg-slate-100 transition-colors"
                    >
                      <X className="h-6 w-6" />
                    </button>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-emerald-50/70 p-3.5 rounded-xl border border-emerald-100 text-xs">
                    <div>
                      <span className="text-[10px] text-emerald-800 font-bold uppercase block">Remuneration</span>
                      <strong className="text-slate-900 font-bold">{viewingJob.salary}</strong>
                    </div>
                    <div>
                      <span className="text-[10px] text-emerald-800 font-bold uppercase block">Experience</span>
                      <strong className="text-slate-900 font-bold">{viewingJob.experience}</strong>
                    </div>
                    <div>
                      <span className="text-[10px] text-emerald-800 font-bold uppercase block">Openings</span>
                      <strong className="text-slate-900 font-bold">{viewingJob.openings} Positions</strong>
                    </div>
                    <div>
                      <span className="text-[10px] text-emerald-800 font-bold uppercase block">Apply Deadline</span>
                      <strong className="text-rose-600 font-bold">{viewingJob.deadline}</strong>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <h4 className="text-xs font-black uppercase text-slate-900 tracking-wider">Role Overview</h4>
                    <p className="text-xs text-slate-700 leading-relaxed">
                      {viewingJob.shortDesc}
                    </p>
                  </div>

                  <div className="space-y-2">
                    <h4 className="text-xs font-black uppercase text-slate-900 tracking-wider">Key Responsibilities</h4>
                    <ul className="space-y-1.5 text-xs text-slate-700">
                      {viewingJob.responsibilities.map((item, idx) => (
                        <li key={idx} className="flex items-start gap-2">
                          <CheckCircle2 className="h-4 w-4 text-[#2e7d32] flex-shrink-0 mt-0.5" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="space-y-2">
                    <h4 className="text-xs font-black uppercase text-slate-900 tracking-wider">Educational Qualification & Experience</h4>
                    <ul className="space-y-1.5 text-xs text-slate-700">
                      {viewingJob.qualifications.map((item, idx) => (
                        <li key={idx} className="flex items-start gap-2">
                          <GraduationCap className="h-4 w-4 text-[#2e7d32] flex-shrink-0 mt-0.5" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
                    <button
                      onClick={() => setViewingJob(null)}
                      className="px-4 py-2 rounded-lg text-xs font-bold text-slate-600 hover:bg-slate-100 transition-colors"
                    >
                      Close
                    </button>
                    <button
                      onClick={() => {
                        const j = viewingJob;
                        setViewingJob(null);
                        handleApplyClick(j);
                      }}
                      className="bg-[#2e7d32] hover:bg-[#1b5e20] text-white font-extrabold text-xs uppercase px-5 py-2.5 rounded-lg shadow-md transition-all flex items-center gap-1.5"
                    >
                      Proceed to Application <ChevronRight className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* 6. COMPLETE JOB APPLICATION & RECRUITMENT FORM */}
            <div id="application-form-section" className="scroll-mt-20">
              <div className="bg-white rounded-2xl border border-slate-200 shadow-md overflow-hidden">
                <div className="bg-[#1b5e20] text-white p-6 md:p-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                  <div className="space-y-1">
                    <div className="inline-flex items-center gap-1.5 text-amber-300 text-xs font-bold uppercase tracking-wider">
                      <Sparkles className="h-3.5 w-3.5" /> Direct Candidate Application Form
                    </div>
                    <h2 className="text-2xl md:text-3xl font-black text-white">
                      Apply for Position & Recruitment
                    </h2>
                    <p className="text-emerald-100 text-xs max-w-2xl">
                      Select or type your custom details. In every dropdown, an "Other" option is available to type your own specific answers.
                    </p>
                  </div>

                  <div className="bg-white/10 px-3 py-2 rounded-lg border border-white/20 text-right">
                    <span className="text-[10px] text-emerald-200 uppercase font-semibold block">Application Fee</span>
                    <strong className="text-amber-300 text-sm font-extrabold">₹0 (Free / No Charges)</strong>
                  </div>
                </div>

                {/* Success State */}
                {submitSuccess ? (
                  <div id="application-success-box" className="p-8 md:p-12 text-center space-y-6 animate-fadeIn">
                    <div className="h-16 w-16 bg-emerald-100 text-[#2e7d32] rounded-full flex items-center justify-center mx-auto shadow-inner">
                      <CheckCircle2 className="h-10 w-10" />
                    </div>

                    <div className="space-y-2 max-w-xl mx-auto">
                      <span className="text-xs font-extrabold text-[#2e7d32] uppercase tracking-wider bg-emerald-50 px-3 py-1 rounded-full">
                        Application Successfully Submitted
                      </span>
                      <h3 className="text-2xl font-black text-slate-900">
                        Thank You, {applicantData.fullName}!
                      </h3>
                      <p className="text-xs text-slate-600 leading-relaxed">
                        Your application has been securely recorded into the SELF Foundation database and is now visible in the Admin/Recruitment portal.
                      </p>
                    </div>

                    {/* Receipt Card */}
                    <div className="max-w-md mx-auto bg-slate-50 border-2 border-dashed border-slate-300 rounded-2xl p-6 text-left space-y-3 text-xs">
                      <div className="flex justify-between border-b border-slate-200 pb-2">
                        <span className="text-slate-500 font-semibold">Application Reference:</span>
                        <span className="font-extrabold text-[#1b5e20] text-sm tracking-wider">{submitSuccess}</span>
                      </div>
                      <div className="flex justify-between border-b border-slate-200 pb-2">
                        <span className="text-slate-500 font-semibold">Applied Position:</span>
                        <span className="font-bold text-slate-900 text-right">
                          {applicantData.jobId === 'other'
                            ? applicantData.otherPosition || 'Other Position'
                            : applicantData.jobTitle || 'General Pool'}
                        </span>
                      </div>
                      <div className="flex justify-between border-b border-slate-200 pb-2">
                        <span className="text-slate-500 font-semibold">Preferred Location:</span>
                        <span className="font-bold text-slate-900">
                          {applicantData.preferredLocation === 'Other'
                            ? applicantData.otherLocation || 'Custom Location'
                            : applicantData.preferredLocation}
                        </span>
                      </div>
                      <div className="flex justify-between border-b border-slate-200 pb-2">
                        <span className="text-slate-500 font-semibold">Candidate Name:</span>
                        <span className="font-bold text-slate-900">{applicantData.fullName}</span>
                      </div>
                      <div className="flex justify-between border-b border-slate-200 pb-2">
                        <span className="text-slate-500 font-semibold">Mobile Number:</span>
                        <span className="font-bold text-slate-900">{applicantData.phone}</span>
                      </div>
                      <div className="flex justify-between text-emerald-800 font-bold pt-1">
                        <span>Next Step:</span>
                        <span>Document Screening & Shortlisting</span>
                      </div>
                    </div>

                    <div className="pt-4 flex justify-center gap-3">
                      <button
                        onClick={() => {
                          setSubmitSuccess(null);
                          setResumeFile(null);
                        }}
                        className="bg-[#2e7d32] text-white text-xs font-bold px-6 py-2.5 rounded-lg shadow hover:bg-[#1b5e20] transition-colors"
                      >
                        Submit Another Application
                      </button>
                      <button
                        onClick={() => setActiveTab('admin-applications')}
                        className="bg-slate-100 text-slate-700 hover:bg-slate-200 text-xs font-bold px-5 py-2.5 rounded-lg transition-colors"
                      >
                        View in Admin Panel
                      </button>
                    </div>
                  </div>
                ) : (
                  <form onSubmit={handleFormSubmit} className="p-6 md:p-8 space-y-8">
                    {formError && (
                      <div className="p-4 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-800 flex items-center gap-2">
                        <AlertCircle className="h-4 w-4 text-rose-600 flex-shrink-0" />
                        <span className="font-semibold">{formError}</span>
                      </div>
                    )}

                    {/* SECTION 1: POSITION SELECTION */}
                    <div className="space-y-4">
                      <div className="flex items-center gap-2 pb-2 border-b border-slate-200">
                        <div className="w-6 h-6 rounded-full bg-[#1b5e20] text-white flex items-center justify-center text-xs font-bold">
                          1
                        </div>
                        <h3 className="font-black text-sm uppercase tracking-wide text-slate-900">
                          Position Applied For & Preferences
                        </h3>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                        {/* Position */}
                        <div className="md:col-span-2 space-y-1">
                          <label htmlFor={`${formId}-position`} className="font-bold text-slate-700 block">
                            Select Position / Job Code <span className="text-rose-500">*</span>
                          </label>
                          <select
                            id={`${formId}-position`}
                            value={applicantData.jobId}
                            onChange={(e) => {
                              const val = e.target.value;
                              const found = jobs.find((j) => j.id === val);
                              setApplicantData((prev) => ({
                                ...prev,
                                jobId: val,
                                jobTitle: val === 'other'
                                  ? 'Other Position (Custom)'
                                  : found
                                  ? `${found.code} - ${found.title}`
                                  : val === 'general'
                                  ? 'General Recruitment Pool / Open Application'
                                  : ''
                              }));
                            }}
                            className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-lg font-medium text-slate-800 focus:bg-white focus:ring-2 focus:ring-[#2e7d32] focus:outline-none"
                            required
                          >
                            <option value="">-- Choose Opening, General Pool, or Other --</option>
                            <option value="general">🌟 General Application / Candidate Talent Pool</option>
                            {jobs.map((job) => (
                              <option key={job.id} value={job.id}>
                                {job.code} — {job.title} ({job.type})
                              </option>
                            ))}
                            <option value="other">✍️ Other Position (Type custom role below)</option>
                          </select>
                        </div>

                        {/* Location */}
                        <div className="space-y-1">
                          <label htmlFor={`${formId}-preferred-loc`} className="font-bold text-slate-700 block">
                            Preferred Location
                          </label>
                          <select
                            id={`${formId}-preferred-loc`}
                            value={applicantData.preferredLocation}
                            onChange={(e) => setApplicantData({ ...applicantData, preferredLocation: e.target.value })}
                            className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-lg text-slate-800 focus:bg-white focus:ring-2 focus:ring-[#2e7d32] focus:outline-none"
                          >
                            <option value="Ranchi Head Office">Ranchi Head Office</option>
                            <option value="Khunti District Field">Khunti District Field</option>
                            <option value="Simdega District Field">Simdega District Field</option>
                            <option value="Gumla District Field">Gumla District Field</option>
                            <option value="Any Tribal District / Flexible">Any Tribal District / Flexible</option>
                            <option value="Other">Other Location (Type custom below)</option>
                          </select>
                        </div>

                        {/* Other Position Input */}
                        {applicantData.jobId === 'other' && (
                          <div className="md:col-span-3 space-y-1 p-3 bg-emerald-50/70 border border-emerald-300 rounded-xl animate-fadeIn">
                            <label htmlFor={`${formId}-other-position`} className="font-bold text-[#1b5e20] block flex items-center gap-1">
                              <Edit3 className="h-3 w-3" /> Type Custom Position / Role Name <span className="text-rose-500">*</span>
                            </label>
                            <input
                              id={`${formId}-other-position`}
                              type="text"
                              required
                              placeholder="e.g. Community Mobilizer, Rural IT Trainer, Field Research Associate"
                              value={applicantData.otherPosition}
                              onChange={(e) => setApplicantData({ ...applicantData, otherPosition: e.target.value })}
                              className="w-full p-2.5 bg-white border border-emerald-400 rounded-lg text-slate-800 font-medium focus:ring-2 focus:ring-[#2e7d32] focus:outline-none"
                            />
                          </div>
                        )}

                        {/* Other Location Input */}
                        {applicantData.preferredLocation === 'Other' && (
                          <div className="md:col-span-3 space-y-1 p-3 bg-emerald-50/70 border border-emerald-300 rounded-xl animate-fadeIn">
                            <label htmlFor={`${formId}-other-location`} className="font-bold text-[#1b5e20] block flex items-center gap-1">
                              <Edit3 className="h-3 w-3" /> Type Custom Work Location <span className="text-rose-500">*</span>
                            </label>
                            <input
                              id={`${formId}-other-location`}
                              type="text"
                              required
                              placeholder="e.g. West Singhbhum, Latehar, Dumka, Palamu, or Remote"
                              value={applicantData.otherLocation}
                              onChange={(e) => setApplicantData({ ...applicantData, otherLocation: e.target.value })}
                              className="w-full p-2.5 bg-white border border-emerald-400 rounded-lg text-slate-800 font-medium focus:ring-2 focus:ring-[#2e7d32] focus:outline-none"
                            />
                          </div>
                        )}

                        {/* Expected Salary */}
                        <div className="space-y-1">
                          <label htmlFor={`${formId}-expected-salary`} className="font-bold text-slate-700 block">
                            Expected Monthly Salary
                          </label>
                          <select
                            id={`${formId}-expected-salary`}
                            value={applicantData.expectedSalary}
                            onChange={(e) => setApplicantData({ ...applicantData, expectedSalary: e.target.value })}
                            className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-lg text-slate-800 focus:bg-white focus:ring-2 focus:ring-[#2e7d32] focus:outline-none"
                          >
                            <option value="₹15,000 – ₹25,000 / month">₹15,000 – ₹25,000 / month</option>
                            <option value="₹25,000 – ₹35,000 / month">₹25,000 – ₹35,000 / month</option>
                            <option value="₹35,000 – ₹50,000 / month">₹35,000 – ₹50,000 / month</option>
                            <option value="₹50,000 – ₹70,000 / month">₹50,000 – ₹70,000 / month</option>
                            <option value="As per Organization Norms / Negotiable">As per Organization Norms / Negotiable</option>
                            <option value="Other">Other (Type custom salary below)</option>
                          </select>
                        </div>

                        {/* Other Salary Input */}
                        {applicantData.expectedSalary === 'Other' && (
                          <div className="space-y-1 animate-fadeIn">
                            <label htmlFor={`${formId}-other-salary`} className="font-bold text-[#1b5e20] block flex items-center gap-1">
                              <Edit3 className="h-3 w-3" /> Type Custom Expected Salary <span className="text-rose-500">*</span>
                            </label>
                            <input
                              id={`${formId}-other-salary`}
                              type="text"
                              required
                              placeholder="e.g. ₹42,000 / month or ₹2,000 per day"
                              value={applicantData.otherSalary}
                              onChange={(e) => setApplicantData({ ...applicantData, otherSalary: e.target.value })}
                              className="w-full p-2.5 bg-white border border-emerald-400 rounded-lg font-medium"
                            />
                          </div>
                        )}

                        {/* Notice Period */}
                        <div className="space-y-1">
                          <label htmlFor={`${formId}-notice-period`} className="font-bold text-slate-700 block">
                            Notice Period / Availability
                          </label>
                          <select
                            id={`${formId}-notice-period`}
                            value={applicantData.noticePeriod}
                            onChange={(e) => setApplicantData({ ...applicantData, noticePeriod: e.target.value })}
                            className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-lg text-slate-800 focus:bg-white focus:ring-2 focus:ring-[#2e7d32] focus:outline-none"
                          >
                            <option value="Immediate">Immediate</option>
                            <option value="15 Days">15 Days</option>
                            <option value="30 Days (1 Month)">30 Days (1 Month)</option>
                            <option value="45 Days">45 Days</option>
                            <option value="60 Days (2 Months)">60 Days (2 Months)</option>
                            <option value="Other">Other (Type custom availability below)</option>
                          </select>
                        </div>

                        {applicantData.noticePeriod === 'Other' && (
                          <div className="space-y-1 animate-fadeIn">
                            <label htmlFor={`${formId}-other-notice`} className="font-bold text-[#1b5e20] block flex items-center gap-1">
                              <Edit3 className="h-3 w-3" /> Type Custom Availability / Notice Period <span className="text-rose-500">*</span>
                            </label>
                            <input
                              id={`${formId}-other-notice`}
                              type="text"
                              required
                              placeholder="e.g. 90 Days / After exams in July / Part-time"
                              value={applicantData.otherNoticePeriod}
                              onChange={(e) => setApplicantData({ ...applicantData, otherNoticePeriod: e.target.value })}
                              className="w-full p-2.5 bg-white border border-emerald-400 rounded-lg font-medium"
                            />
                          </div>
                        )}
                      </div>
                    </div>

                    {/* SECTION 2: PERSONAL DETAILS */}
                    <div className="space-y-4">
                      <div className="flex items-center gap-2 pb-2 border-b border-slate-200">
                        <div className="w-6 h-6 rounded-full bg-[#1b5e20] text-white flex items-center justify-center text-xs font-bold">
                          2
                        </div>
                        <h3 className="font-black text-sm uppercase tracking-wide text-slate-900">
                          Personal & Contact Information
                        </h3>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 text-xs">
                        <div className="space-y-1">
                          <label htmlFor={`${formId}-fullname`} className="font-bold text-slate-700 block">
                            Full Name (as per Govt ID) <span className="text-rose-500">*</span>
                          </label>
                          <input
                            id={`${formId}-fullname`}
                            type="text"
                            required
                            placeholder="e.g. Anjali Kumari"
                            value={applicantData.fullName}
                            onChange={(e) => setApplicantData({ ...applicantData, fullName: e.target.value })}
                            className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-lg text-slate-800 focus:bg-white focus:ring-2 focus:ring-[#2e7d32] focus:outline-none"
                          />
                        </div>

                        <div className="space-y-1">
                          <label htmlFor={`${formId}-guardian`} className="font-bold text-slate-700 block">
                            Father's / Guardian's Name
                          </label>
                          <input
                            id={`${formId}-guardian`}
                            type="text"
                            placeholder="e.g. Rameshwar Oraon"
                            value={applicantData.guardianName}
                            onChange={(e) => setApplicantData({ ...applicantData, guardianName: e.target.value })}
                            className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-lg text-slate-800 focus:bg-white focus:ring-2 focus:ring-[#2e7d32] focus:outline-none"
                          />
                        </div>

                        <div className="space-y-1">
                          <label htmlFor={`${formId}-dob`} className="font-bold text-slate-700 block">
                            Date of Birth <span className="text-rose-500">*</span>
                          </label>
                          <input
                            id={`${formId}-dob`}
                            type="date"
                            required
                            value={applicantData.dob}
                            onChange={(e) => setApplicantData({ ...applicantData, dob: e.target.value })}
                            className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-lg text-slate-800 focus:bg-white focus:ring-2 focus:ring-[#2e7d32] focus:outline-none"
                          />
                        </div>

                        {/* Gender */}
                        <div className="space-y-1">
                          <label htmlFor={`${formId}-gender`} className="font-bold text-slate-700 block">
                            Gender
                          </label>
                          <select
                            id={`${formId}-gender`}
                            value={applicantData.gender}
                            onChange={(e) => setApplicantData({ ...applicantData, gender: e.target.value })}
                            className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-lg text-slate-800 focus:bg-white focus:ring-2 focus:ring-[#2e7d32] focus:outline-none"
                          >
                            <option value="Female">Female</option>
                            <option value="Male">Male</option>
                            <option value="Transgender">Transgender</option>
                            <option value="Prefer not to say">Prefer not to say</option>
                            <option value="Other">Other (Type custom below)</option>
                          </select>
                        </div>

                        {applicantData.gender === 'Other' && (
                          <div className="space-y-1 animate-fadeIn">
                            <label htmlFor={`${formId}-other-gender`} className="font-bold text-[#1b5e20] block flex items-center gap-1">
                              <Edit3 className="h-3 w-3" /> Type Custom Gender <span className="text-rose-500">*</span>
                            </label>
                            <input
                              id={`${formId}-other-gender`}
                              type="text"
                              required
                              placeholder="Please specify gender"
                              value={applicantData.otherGender}
                              onChange={(e) => setApplicantData({ ...applicantData, otherGender: e.target.value })}
                              className="w-full p-2.5 bg-white border border-emerald-400 rounded-lg text-slate-800 font-medium"
                            />
                          </div>
                        )}

                        <div className="space-y-1">
                          <label htmlFor={`${formId}-email`} className="font-bold text-slate-700 block">
                            Email Address <span className="text-rose-500">*</span>
                          </label>
                          <input
                            id={`${formId}-email`}
                            type="email"
                            required
                            placeholder="youremail@domain.com"
                            value={applicantData.email}
                            onChange={(e) => setApplicantData({ ...applicantData, email: e.target.value })}
                            className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-lg text-slate-800 focus:bg-white focus:ring-2 focus:ring-[#2e7d32] focus:outline-none"
                          />
                        </div>

                        <div className="space-y-1">
                          <label htmlFor={`${formId}-phone`} className="font-bold text-slate-700 block">
                            Mobile Number (10 Digits) <span className="text-rose-500">*</span>
                          </label>
                          <input
                            id={`${formId}-phone`}
                            type="tel"
                            required
                            maxLength={10}
                            placeholder="e.g. 9876543210"
                            value={applicantData.phone}
                            onChange={(e) => setApplicantData({ ...applicantData, phone: e.target.value })}
                            className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-lg text-slate-800 focus:bg-white focus:ring-2 focus:ring-[#2e7d32] focus:outline-none"
                          />
                        </div>

                        <div className="space-y-1">
                          <label htmlFor={`${formId}-whatsapp`} className="font-bold text-slate-700 block">
                            WhatsApp Number
                          </label>
                          <input
                            id={`${formId}-whatsapp`}
                            type="tel"
                            maxLength={10}
                            placeholder="WhatsApp contact"
                            value={applicantData.whatsapp}
                            onChange={(e) => setApplicantData({ ...applicantData, whatsapp: e.target.value })}
                            className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-lg text-slate-800 focus:bg-white focus:ring-2 focus:ring-[#2e7d32] focus:outline-none"
                          />
                        </div>

                        {/* ID Type */}
                        <div className="space-y-1">
                          <label htmlFor={`${formId}-id-type`} className="font-bold text-slate-700 block">
                            Government Photo ID Type
                          </label>
                          <select
                            id={`${formId}-id-type`}
                            value={applicantData.idProofType}
                            onChange={(e) => setApplicantData({ ...applicantData, idProofType: e.target.value })}
                            className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-lg text-slate-800 focus:bg-white focus:ring-2 focus:ring-[#2e7d32] focus:outline-none"
                          >
                            <option value="Aadhar Card">Aadhar Card</option>
                            <option value="Voter ID">Voter ID Card</option>
                            <option value="PAN Card">PAN Card</option>
                            <option value="Driving License">Driving License</option>
                            <option value="Other">Other ID Proof (Type custom below)</option>
                          </select>
                        </div>

                        {applicantData.idProofType === 'Other' && (
                          <div className="space-y-1 animate-fadeIn">
                            <label htmlFor={`${formId}-other-id`} className="font-bold text-[#1b5e20] block flex items-center gap-1">
                              <Edit3 className="h-3 w-3" /> Type Custom ID Proof Name <span className="text-rose-500">*</span>
                            </label>
                            <input
                              id={`${formId}-other-id`}
                              type="text"
                              required
                              placeholder="e.g. Passport, MNREGA Job Card, College ID"
                              value={applicantData.otherIdProof}
                              onChange={(e) => setApplicantData({ ...applicantData, otherIdProof: e.target.value })}
                              className="w-full p-2.5 bg-white border border-emerald-400 rounded-lg font-medium"
                            />
                          </div>
                        )}

                        <div className="space-y-1">
                          <label htmlFor={`${formId}-id-number`} className="font-bold text-slate-700 block">
                            ID Card / Registration Number
                          </label>
                          <input
                            id={`${formId}-id-number`}
                            type="text"
                            placeholder="e.g. 1234 5678 9012"
                            value={applicantData.idProofNumber}
                            onChange={(e) => setApplicantData({ ...applicantData, idProofNumber: e.target.value })}
                            className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-lg text-slate-800 focus:bg-white focus:ring-2 focus:ring-[#2e7d32] focus:outline-none"
                          />
                        </div>
                      </div>

                      {/* Address & District with Other Option */}
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs pt-2">
                        <div className="space-y-1">
                          <label htmlFor={`${formId}-curr-address`} className="font-bold text-slate-700 block">
                            Current Address (Street / Village) <span className="text-rose-500">*</span>
                          </label>
                          <input
                            id={`${formId}-curr-address`}
                            type="text"
                            required
                            placeholder="Village / Street, Post Office"
                            value={applicantData.currentAddress}
                            onChange={(e) => setApplicantData({ ...applicantData, currentAddress: e.target.value })}
                            className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-lg text-slate-800 focus:bg-white focus:ring-2 focus:ring-[#2e7d32] focus:outline-none"
                          />
                        </div>

                        {/* District */}
                        <div className="space-y-1">
                          <label htmlFor={`${formId}-district`} className="font-bold text-slate-700 block">
                            District
                          </label>
                          <select
                            id={`${formId}-district`}
                            value={applicantData.district}
                            onChange={(e) => setApplicantData({ ...applicantData, district: e.target.value })}
                            className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-lg text-slate-800 focus:bg-white focus:ring-2 focus:ring-[#2e7d32] focus:outline-none"
                          >
                            <option value="Ranchi">Ranchi</option>
                            <option value="Khunti">Khunti</option>
                            <option value="Gumla">Gumla</option>
                            <option value="Simdega">Simdega</option>
                            <option value="Lohardaga">Lohardaga</option>
                            <option value="Latehar">Latehar</option>
                            <option value="Palamu">Palamu</option>
                            <option value="West Singhbhum">West Singhbhum</option>
                            <option value="East Singhbhum">East Singhbhum</option>
                            <option value="Other">Other District (Type custom below)</option>
                          </select>
                        </div>

                        {/* State */}
                        <div className="space-y-1">
                          <label htmlFor={`${formId}-state`} className="font-bold text-slate-700 block">
                            State
                          </label>
                          <select
                            id={`${formId}-state`}
                            value={applicantData.state}
                            onChange={(e) => setApplicantData({ ...applicantData, state: e.target.value })}
                            className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-lg text-slate-800 focus:bg-white focus:ring-2 focus:ring-[#2e7d32] focus:outline-none"
                          >
                            <option value="Jharkhand">Jharkhand</option>
                            <option value="Bihar">Bihar</option>
                            <option value="West Bengal">West Bengal</option>
                            <option value="Odisha">Odisha</option>
                            <option value="Chhattisgarh">Chhattisgarh</option>
                            <option value="Other">Other State (Type custom below)</option>
                          </select>
                        </div>

                        {applicantData.district === 'Other' && (
                          <div className="space-y-1 animate-fadeIn">
                            <label htmlFor={`${formId}-other-dist`} className="font-bold text-[#1b5e20] block flex items-center gap-1">
                              <Edit3 className="h-3 w-3" /> Type Custom District Name <span className="text-rose-500">*</span>
                            </label>
                            <input
                              id={`${formId}-other-dist`}
                              type="text"
                              required
                              placeholder="e.g. Dumka, Deoghar, Bokaro, etc."
                              value={applicantData.otherDistrict}
                              onChange={(e) => setApplicantData({ ...applicantData, otherDistrict: e.target.value })}
                              className="w-full p-2.5 bg-white border border-emerald-400 rounded-lg font-medium"
                            />
                          </div>
                        )}

                        {applicantData.state === 'Other' && (
                          <div className="space-y-1 animate-fadeIn">
                            <label htmlFor={`${formId}-other-state`} className="font-bold text-[#1b5e20] block flex items-center gap-1">
                              <Edit3 className="h-3 w-3" /> Type Custom State Name <span className="text-rose-500">*</span>
                            </label>
                            <input
                              id={`${formId}-other-state`}
                              type="text"
                              required
                              placeholder="e.g. Uttar Pradesh, Delhi, Assam"
                              value={applicantData.otherState}
                              onChange={(e) => setApplicantData({ ...applicantData, otherState: e.target.value })}
                              className="w-full p-2.5 bg-white border border-emerald-400 rounded-lg font-medium"
                            />
                          </div>
                        )}
                      </div>
                    </div>

                    {/* SECTION 3: ACADEMIC QUALIFICATIONS */}
                    <div className="space-y-4">
                      <div className="flex items-center gap-2 pb-2 border-b border-slate-200">
                        <div className="w-6 h-6 rounded-full bg-[#1b5e20] text-white flex items-center justify-center text-xs font-bold">
                          3
                        </div>
                        <h3 className="font-black text-sm uppercase tracking-wide text-slate-900">
                          Educational Qualifications
                        </h3>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 text-xs">
                        {/* Qualification */}
                        <div className="space-y-1">
                          <label htmlFor={`${formId}-qual`} className="font-bold text-slate-700 block">
                            Highest Qualification <span className="text-rose-500">*</span>
                          </label>
                          <select
                            id={`${formId}-qual`}
                            value={applicantData.highestQualification}
                            onChange={(e) => setApplicantData({ ...applicantData, highestQualification: e.target.value })}
                            className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-lg text-slate-800 focus:bg-white focus:ring-2 focus:ring-[#2e7d32] focus:outline-none"
                          >
                            <option value="Doctorate / Ph.D">Doctorate / Ph.D</option>
                            <option value="Master's / Post Graduate">Master's / Post Graduate</option>
                            <option value="Bachelor's / Graduate">Bachelor's / Graduate</option>
                            <option value="Diploma">Diploma / Polytech</option>
                            <option value="Intermediate / 12th">Intermediate / 12th</option>
                            <option value="Other">Other Qualification (Type custom below)</option>
                          </select>
                        </div>

                        {applicantData.highestQualification === 'Other' && (
                          <div className="space-y-1 animate-fadeIn">
                            <label htmlFor={`${formId}-other-qual`} className="font-bold text-[#1b5e20] block flex items-center gap-1">
                              <Edit3 className="h-3 w-3" /> Type Custom Qualification <span className="text-rose-500">*</span>
                            </label>
                            <input
                              id={`${formId}-other-qual`}
                              type="text"
                              required
                              placeholder="e.g. ITI, Fellowship, Certificate"
                              value={applicantData.otherQualification}
                              onChange={(e) => setApplicantData({ ...applicantData, otherQualification: e.target.value })}
                              className="w-full p-2.5 bg-white border border-emerald-400 rounded-lg font-medium"
                            />
                          </div>
                        )}

                        <div className="space-y-1">
                          <label htmlFor={`${formId}-degree`} className="font-bold text-slate-700 block">
                            Degree / Specialization <span className="text-rose-500">*</span>
                          </label>
                          <input
                            id={`${formId}-degree`}
                            type="text"
                            required
                            placeholder="e.g. MSW / B.Sc Agriculture / BCA"
                            value={applicantData.degreeName}
                            onChange={(e) => setApplicantData({ ...applicantData, degreeName: e.target.value })}
                            className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-lg text-slate-800 focus:bg-white focus:ring-2 focus:ring-[#2e7d32] focus:outline-none"
                          />
                        </div>

                        <div className="space-y-1">
                          <label htmlFor={`${formId}-institute`} className="font-bold text-slate-700 block">
                            University / Institution <span className="text-rose-500">*</span>
                          </label>
                          <input
                            id={`${formId}-institute`}
                            type="text"
                            required
                            placeholder="e.g. Ranchi University / XISS"
                            value={applicantData.institution}
                            onChange={(e) => setApplicantData({ ...applicantData, institution: e.target.value })}
                            className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-lg text-slate-800 focus:bg-white focus:ring-2 focus:ring-[#2e7d32] focus:outline-none"
                          />
                        </div>

                        {/* Year & Grade */}
                        <div className="space-y-1">
                          <label htmlFor={`${formId}-percentage`} className="font-bold text-slate-700 block">
                            Passing Year & % / CGPA
                          </label>
                          <div className="grid grid-cols-2 gap-2">
                            <select
                              value={applicantData.passingYear}
                              onChange={(e) => setApplicantData({ ...applicantData, passingYear: e.target.value })}
                              className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-lg text-slate-800"
                            >
                              <option value="2026">2026</option>
                              <option value="2025">2025</option>
                              <option value="2024">2024</option>
                              <option value="2023">2023</option>
                              <option value="2022">2022</option>
                              <option value="2021">2021</option>
                              <option value="2020">2020</option>
                              <option value="Other">Other Year</option>
                            </select>

                            <input
                              type="text"
                              placeholder="% / Grade"
                              value={applicantData.percentage}
                              onChange={(e) => setApplicantData({ ...applicantData, percentage: e.target.value })}
                              className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-lg text-slate-800"
                            />
                          </div>
                        </div>

                        {applicantData.passingYear === 'Other' && (
                          <div className="space-y-1 animate-fadeIn">
                            <label htmlFor={`${formId}-other-year`} className="font-bold text-[#1b5e20] block flex items-center gap-1">
                              <Edit3 className="h-3 w-3" /> Type Custom Passing Year <span className="text-rose-500">*</span>
                            </label>
                            <input
                              id={`${formId}-other-year`}
                              type="text"
                              required
                              placeholder="e.g. 2018 or Earlier"
                              value={applicantData.otherPassingYear}
                              onChange={(e) => setApplicantData({ ...applicantData, otherPassingYear: e.target.value })}
                              className="w-full p-2.5 bg-white border border-emerald-400 rounded-lg font-medium"
                            />
                          </div>
                        )}
                      </div>
                    </div>

                    {/* SECTION 4: EXPERIENCE & SKILLS */}
                    <div className="space-y-4">
                      <div className="flex items-center gap-2 pb-2 border-b border-slate-200">
                        <div className="w-6 h-6 rounded-full bg-[#1b5e20] text-white flex items-center justify-center text-xs font-bold">
                          4
                        </div>
                        <h3 className="font-black text-sm uppercase tracking-wide text-slate-900">
                          Work Experience & Grassroots Competencies
                        </h3>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 text-xs">
                        {/* Status */}
                        <div className="space-y-1">
                          <label htmlFor={`${formId}-emp-status`} className="font-bold text-slate-700 block">
                            Current Employment Status
                          </label>
                          <select
                            id={`${formId}-emp-status`}
                            value={applicantData.employmentStatus}
                            onChange={(e) => setApplicantData({ ...applicantData, employmentStatus: e.target.value })}
                            className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-lg text-slate-800 focus:bg-white focus:ring-2 focus:ring-[#2e7d32] focus:outline-none"
                          >
                            <option value="Employed">Employed</option>
                            <option value="Unemployed / Looking">Unemployed / Looking</option>
                            <option value="Fresher">Fresher / Recent Graduate</option>
                            <option value="Freelancer / Consultant">Freelancer / Consultant</option>
                            <option value="Other">Other Status (Type custom below)</option>
                          </select>
                        </div>

                        {applicantData.employmentStatus === 'Other' && (
                          <div className="space-y-1 animate-fadeIn">
                            <label htmlFor={`${formId}-other-emp`} className="font-bold text-[#1b5e20] block flex items-center gap-1">
                              <Edit3 className="h-3 w-3" /> Type Custom Employment Status <span className="text-rose-500">*</span>
                            </label>
                            <input
                              id={`${formId}-other-emp`}
                              type="text"
                              required
                              placeholder="e.g. Sabbatical, Social Fellow, Self-employed"
                              value={applicantData.otherEmploymentStatus}
                              onChange={(e) => setApplicantData({ ...applicantData, otherEmploymentStatus: e.target.value })}
                              className="w-full p-2.5 bg-white border border-emerald-400 rounded-lg font-medium"
                            />
                          </div>
                        )}

                        {/* Experience */}
                        <div className="space-y-1">
                          <label htmlFor={`${formId}-tot-exp`} className="font-bold text-slate-700 block">
                            Total Experience
                          </label>
                          <select
                            id={`${formId}-tot-exp`}
                            value={applicantData.totalExperience}
                            onChange={(e) => setApplicantData({ ...applicantData, totalExperience: e.target.value })}
                            className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-lg text-slate-800 focus:bg-white focus:ring-2 focus:ring-[#2e7d32] focus:outline-none"
                          >
                            <option value="Fresher (0 Years)">Fresher (0 Years)</option>
                            <option value="Less than 1 Year">Less than 1 Year</option>
                            <option value="1-3 Years">1 - 3 Years</option>
                            <option value="3-5 Years">3 - 5 Years</option>
                            <option value="5-8 Years">5 - 8 Years</option>
                            <option value="8+ Years">8+ Years</option>
                            <option value="Other">Other Experience (Type custom below)</option>
                          </select>
                        </div>

                        {applicantData.totalExperience === 'Other' && (
                          <div className="space-y-1 animate-fadeIn">
                            <label htmlFor={`${formId}-other-exp`} className="font-bold text-[#1b5e20] block flex items-center gap-1">
                              <Edit3 className="h-3 w-3" /> Type Custom Total Experience <span className="text-rose-500">*</span>
                            </label>
                            <input
                              id={`${formId}-other-exp`}
                              type="text"
                              required
                              placeholder="e.g. 12 Years NGO Management, 6 Months Intern"
                              value={applicantData.otherExperience}
                              onChange={(e) => setApplicantData({ ...applicantData, otherExperience: e.target.value })}
                              className="w-full p-2.5 bg-white border border-emerald-400 rounded-lg font-medium"
                            />
                          </div>
                        )}

                        <div className="space-y-1">
                          <label htmlFor={`${formId}-curr-org`} className="font-bold text-slate-700 block">
                            Current / Last Organization
                          </label>
                          <input
                            id={`${formId}-curr-org`}
                            type="text"
                            placeholder="Organization name"
                            value={applicantData.currentEmployer}
                            onChange={(e) => setApplicantData({ ...applicantData, currentEmployer: e.target.value })}
                            className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-lg text-slate-800 focus:bg-white focus:ring-2 focus:ring-[#2e7d32] focus:outline-none"
                          />
                        </div>

                        <div className="space-y-1">
                          <label htmlFor={`${formId}-curr-role`} className="font-bold text-slate-700 block">
                            Current Designation / Role
                          </label>
                          <input
                            id={`${formId}-curr-role`}
                            type="text"
                            placeholder="e.g. Field Officer"
                            value={applicantData.currentDesignation}
                            onChange={(e) => setApplicantData({ ...applicantData, currentDesignation: e.target.value })}
                            className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-lg text-slate-800 focus:bg-white focus:ring-2 focus:ring-[#2e7d32] focus:outline-none"
                          />
                        </div>
                      </div>

                      {/* Field Logistics with Other Options */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs pt-2">
                        {/* Two wheeler */}
                        <div className="space-y-1 p-3 bg-slate-50 rounded-xl border border-slate-200">
                          <span className="font-bold text-slate-700 block mb-1">
                            Do you possess a two-wheeler with valid driving license?
                          </span>
                          <div className="flex flex-wrap gap-4">
                            <label className="flex items-center gap-1.5 cursor-pointer">
                              <input
                                type="radio"
                                name="twoWheeler"
                                value="Yes"
                                checked={applicantData.hasTwoWheeler === 'Yes'}
                                onChange={() => setApplicantData({ ...applicantData, hasTwoWheeler: 'Yes' })}
                              />
                              <span>Yes (Available)</span>
                            </label>
                            <label className="flex items-center gap-1.5 cursor-pointer">
                              <input
                                type="radio"
                                name="twoWheeler"
                                value="No"
                                checked={applicantData.hasTwoWheeler === 'No'}
                                onChange={() => setApplicantData({ ...applicantData, hasTwoWheeler: 'No' })}
                              />
                              <span>No</span>
                            </label>
                            <label className="flex items-center gap-1.5 cursor-pointer">
                              <input
                                type="radio"
                                name="twoWheeler"
                                value="Other"
                                checked={applicantData.hasTwoWheeler === 'Other'}
                                onChange={() => setApplicantData({ ...applicantData, hasTwoWheeler: 'Other' })}
                              />
                              <span>Other (Type below)</span>
                            </label>
                          </div>
                          {applicantData.hasTwoWheeler === 'Other' && (
                            <input
                              type="text"
                              placeholder="Type your transport status (e.g. Can arrange / Bicycle / DL applied)"
                              value={applicantData.otherTwoWheeler}
                              onChange={(e) => setApplicantData({ ...applicantData, otherTwoWheeler: e.target.value })}
                              className="w-full p-2 bg-white border border-emerald-400 rounded-lg text-xs mt-2"
                            />
                          )}
                        </div>

                        {/* Travel willingness */}
                        <div className="space-y-1 p-3 bg-slate-50 rounded-xl border border-slate-200">
                          <span className="font-bold text-slate-700 block mb-1">
                            Willingness to travel to remote tribal hamlets & forest villages:
                          </span>
                          <div className="flex flex-wrap gap-4">
                            <label className="flex items-center gap-1.5 cursor-pointer">
                              <input
                                type="radio"
                                name="willingTravel"
                                value="Yes"
                                checked={applicantData.willingToTravel === 'Yes'}
                                onChange={() => setApplicantData({ ...applicantData, willingToTravel: 'Yes' })}
                              />
                              <span>Yes (100% willing)</span>
                            </label>
                            <label className="flex items-center gap-1.5 cursor-pointer">
                              <input
                                type="radio"
                                name="willingTravel"
                                value="No"
                                checked={applicantData.willingToTravel === 'No'}
                                onChange={() => setApplicantData({ ...applicantData, willingToTravel: 'No' })}
                              />
                              <span>Prefer HQ only</span>
                            </label>
                            <label className="flex items-center gap-1.5 cursor-pointer">
                              <input
                                type="radio"
                                name="willingTravel"
                                value="Other"
                                checked={applicantData.willingToTravel === 'Other'}
                                onChange={() => setApplicantData({ ...applicantData, willingToTravel: 'Other' })}
                              />
                              <span>Other (Type below)</span>
                            </label>
                          </div>
                          {applicantData.willingToTravel === 'Other' && (
                            <input
                              type="text"
                              placeholder="Type your travel preferences / constraints"
                              value={applicantData.otherTravelPreference}
                              onChange={(e) => setApplicantData({ ...applicantData, otherTravelPreference: e.target.value })}
                              className="w-full p-2 bg-white border border-emerald-400 rounded-lg text-xs mt-2"
                            />
                          )}
                        </div>
                      </div>

                      {/* Languages known + Custom input */}
                      <div className="space-y-2 pt-2">
                        <span className="font-bold text-xs text-slate-700 block">
                          Languages Known (Crucial for Community Engagement in Jharkhand):
                        </span>
                        <div className="flex flex-wrap gap-2 text-xs">
                          {applicantData.languages.map((lang) => (
                            <button
                              type="button"
                              key={lang}
                              onClick={() => toggleLanguage(lang)}
                              className="px-3 py-1.5 rounded-lg border text-xs font-semibold transition-all bg-[#2e7d32] text-white border-[#2e7d32] shadow-sm flex items-center gap-1"
                            >
                              ✓ {lang}
                            </button>
                          ))}

                          {['Hindi', 'English', 'Santhali', 'Mundari', 'Ho', 'Kurukh (Oraon)', 'Nagpuri', 'Bengali']
                            .filter((l) => !applicantData.languages.includes(l))
                            .map((lang) => (
                              <button
                                type="button"
                                key={lang}
                                onClick={() => toggleLanguage(lang)}
                                className="px-3 py-1.5 rounded-lg border text-xs font-semibold transition-all bg-slate-100 text-slate-700 border-slate-200 hover:bg-slate-200"
                              >
                                + {lang}
                              </button>
                            ))}
                        </div>

                        {/* Add Other Language Box */}
                        <div className="flex items-center gap-2 pt-1 max-w-md">
                          <input
                            type="text"
                            placeholder="Type other dialect / language (e.g. Khortha, Sadri, Odia...)"
                            value={customLanguageInput}
                            onChange={(e) => setCustomLanguageInput(e.target.value)}
                            className="flex-1 p-2 bg-slate-50 border border-slate-300 rounded-lg text-xs"
                          />
                          <button
                            type="button"
                            onClick={handleAddCustomLanguage}
                            className="px-3 py-2 bg-slate-700 hover:bg-slate-900 text-white rounded-lg text-xs font-bold flex items-center gap-1 transition-colors"
                          >
                            <Plus className="h-3.5 w-3.5" /> Add Language
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* SECTION 5: RESUME UPLOAD & STATEMENT OF PURPOSE */}
                    <div className="space-y-4">
                      <div className="flex items-center gap-2 pb-2 border-b border-slate-200">
                        <div className="w-6 h-6 rounded-full bg-[#1b5e20] text-white flex items-center justify-center text-xs font-bold">
                          5
                        </div>
                        <h3 className="font-black text-sm uppercase tracking-wide text-slate-900">
                          Resume Upload & Statement of Purpose
                        </h3>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 text-xs">
                        {/* Resume */}
                        <div className="space-y-2">
                          <label htmlFor={`${formId}-resume-file`} className="font-bold text-slate-700 block">
                            Upload Updated Resume / Curriculum Vitae (CV) <span className="text-rose-500">*</span>
                          </label>
                          <div className="border-2 border-dashed border-slate-300 hover:border-[#2e7d32] bg-slate-50 hover:bg-emerald-50/40 rounded-xl p-6 text-center transition-colors relative cursor-pointer">
                            <input
                              id={`${formId}-resume-file`}
                              type="file"
                              accept=".pdf,.doc,.docx"
                              onChange={(e) => {
                                if (e.target.files && e.target.files[0]) {
                                  setResumeFile(e.target.files[0]);
                                }
                              }}
                              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                            />
                            <Upload className="h-8 w-8 text-[#2e7d32] mx-auto mb-2" />
                            {resumeFile ? (
                              <div className="space-y-1">
                                <span className="font-bold text-[#1b5e20] block text-xs">{resumeFile.name}</span>
                                <span className="text-[10px] text-slate-500">{(resumeFile.size / 1024).toFixed(1)} KB • File attached</span>
                                <span className="text-[10px] text-emerald-700 underline block font-semibold">Click to replace file</span>
                              </div>
                            ) : (
                              <div className="space-y-1">
                                <span className="font-bold text-slate-800 block text-xs">Click or drag & drop your Resume</span>
                                <span className="text-[10px] text-slate-500 block">PDF, DOC, DOCX up to 5 MB</span>
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Passport Photo */}
                        <div className="space-y-2">
                          <label htmlFor={`${formId}-photo-file`} className="font-bold text-slate-700 block">
                            Recent Passport Photograph (Optional)
                          </label>
                          <div className="border-2 border-dashed border-slate-300 hover:border-[#2e7d32] bg-slate-50 hover:bg-emerald-50/40 rounded-xl p-6 text-center transition-colors relative cursor-pointer">
                            <input
                              id={`${formId}-photo-file`}
                              type="file"
                              accept=".jpg,.jpeg,.png"
                              onChange={(e) => {
                                if (e.target.files && e.target.files[0]) {
                                  setPhotoFile(e.target.files[0]);
                                }
                              }}
                              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                            />
                            <User className="h-8 w-8 text-slate-400 mx-auto mb-2" />
                            {photoFile ? (
                              <div className="space-y-1">
                                <span className="font-bold text-[#1b5e20] block text-xs">{photoFile.name}</span>
                                <span className="text-[10px] text-slate-500">{(photoFile.size / 1024).toFixed(1)} KB attached</span>
                              </div>
                            ) : (
                              <div className="space-y-1">
                                <span className="font-bold text-slate-800 block text-xs">Attach Passport Photo</span>
                                <span className="text-[10px] text-slate-500 block">JPG or PNG (max 2 MB)</span>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Statement of Purpose */}
                      <div className="space-y-1 text-xs">
                        <label htmlFor={`${formId}-sop`} className="font-bold text-slate-700 block">
                          Statement of Purpose / Cover Note
                        </label>
                        <textarea
                          id={`${formId}-sop`}
                          rows={3}
                          placeholder="Briefly state why you wish to work with SELF Foundation and how your background aligns with our mission..."
                          value={applicantData.coverLetter}
                          onChange={(e) => setApplicantData({ ...applicantData, coverLetter: e.target.value })}
                          className="w-full p-3 bg-slate-50 border border-slate-300 rounded-lg text-slate-800 focus:bg-white focus:ring-2 focus:ring-[#2e7d32] focus:outline-none"
                        />
                      </div>

                      {/* Other Details / Additional Notes */}
                      <div className="space-y-1 text-xs p-3 bg-slate-50 rounded-xl border border-slate-200">
                        <label htmlFor={`${formId}-notes`} className="font-bold text-slate-800 block flex items-center gap-1.5">
                          <Edit3 className="h-3.5 w-3.5 text-[#2e7d32]" />
                          <span>Any Other Information, Special Accommodations, or Custom Notes</span>
                        </label>
                        <textarea
                          id={`${formId}-notes`}
                          rows={2}
                          placeholder="In case you want to input anything else (special achievements, honors, publications, PwD disability details, etc.)..."
                          value={applicantData.additionalNotes}
                          onChange={(e) => setApplicantData({ ...applicantData, additionalNotes: e.target.value })}
                          className="w-full p-2.5 bg-white border border-slate-300 rounded-lg text-slate-800 focus:ring-2 focus:ring-[#2e7d32] focus:outline-none"
                        />
                      </div>

                      {/* Professional Reference */}
                      <div className="space-y-2 pt-2 text-xs">
                        <span className="font-bold text-slate-700 block">
                          Professional Reference (Previous supervisor, mentor, or senior colleague):
                        </span>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                          <input
                            type="text"
                            placeholder="Reference Person Name"
                            value={applicantData.ref1Name}
                            onChange={(e) => setApplicantData({ ...applicantData, ref1Name: e.target.value })}
                            className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-lg"
                          />
                          <input
                            type="text"
                            placeholder="Organization / Designation"
                            value={applicantData.ref1Org}
                            onChange={(e) => setApplicantData({ ...applicantData, ref1Org: e.target.value })}
                            className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-lg"
                          />
                          <input
                            type="tel"
                            placeholder="Contact Phone / Email"
                            value={applicantData.ref1Phone}
                            onChange={(e) => setApplicantData({ ...applicantData, ref1Phone: e.target.value })}
                            className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-lg"
                          />
                        </div>
                      </div>
                    </div>

                    {/* SECTION 6: DECLARATION & SUBMIT */}
                    <div className="space-y-4 pt-4 border-t border-slate-200">
                      <label className="flex items-start gap-3 p-4 bg-emerald-50/60 border border-emerald-200 rounded-xl cursor-pointer select-none">
                        <input
                          type="checkbox"
                          checked={applicantData.agreeDeclaration}
                          onChange={(e) => setApplicantData({ ...applicantData, agreeDeclaration: e.target.checked })}
                          className="h-4 w-4 rounded text-[#2e7d32] focus:ring-[#2e7d32] mt-0.5 cursor-pointer"
                        />
                        <span className="text-xs text-slate-700 leading-relaxed">
                          <strong>Solemn Declaration:</strong> I hereby declare that all entries made in this application form and attached documents are true, complete, and correct to the best of my knowledge and belief. I understand that in the event of any information being found false or incorrect at any stage, my candidature / appointment shall be liable to immediate cancellation.
                        </span>
                      </label>

                      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
                        <div className="text-xs text-slate-500">
                          Need help? Reach out at <a href="mailto:careers@selfjharkhand.org" className="text-[#2e7d32] font-semibold underline">careers@selfjharkhand.org</a>
                        </div>

                        <button
                          type="submit"
                          disabled={isSubmitting}
                          className="w-full sm:w-auto bg-[#2e7d32] hover:bg-[#1b5e20] text-white font-extrabold text-xs uppercase tracking-wider px-8 py-3.5 rounded-xl shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                        >
                          {isSubmitting ? (
                            <>
                              <div className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                              Processing Application...
                            </>
                          ) : (
                            <>
                              <CheckCircle2 className="h-4 w-4" /> Submit Application
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  </form>
                )}
              </div>
            </div>

            {/* 7. WHY JOIN SELF FOUNDATION */}
            <div className="bg-white rounded-2xl border border-slate-200 p-8 shadow-sm space-y-6">
              <div className="text-center max-w-2xl mx-auto space-y-2">
                <span className="text-xs font-extrabold uppercase text-[#2e7d32] tracking-wider bg-emerald-50 px-3 py-1 rounded-full">
                  Why Work With Us
                </span>
                <h3 className="text-2xl font-black text-slate-900">
                  An Impactful, Transparent & Nurturing Work Culture
                </h3>
                <p className="text-xs text-slate-600">
                  Join a cadre of dedicated social innovators, rural technocrats, and community organizers transforming grassroots lives across Jharkhand.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4 text-xs">
                <div className="p-5 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                  <div className="p-2 bg-emerald-100 text-[#1b5e20] rounded-lg w-fit">
                    <HeartHandshake className="h-5 w-5" />
                  </div>
                  <h4 className="font-extrabold text-sm text-slate-900">Tangible Grassroots Impact</h4>
                  <p className="text-slate-600 leading-relaxed">
                    Directly witness how your daily efforts improve rural education, farmer livelihoods, child nutrition, and women's self-reliance.
                  </p>
                </div>

                <div className="p-5 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                  <div className="p-2 bg-amber-100 text-amber-800 rounded-lg w-fit">
                    <Award className="h-5 w-5" />
                  </div>
                  <h4 className="font-extrabold text-sm text-slate-900">Professional Development</h4>
                  <p className="text-slate-600 leading-relaxed">
                    Regular institutional training, M&E tool certifications, exposure visits to leading social enterprises, and peer-to-peer mentoring.
                  </p>
                </div>

                <div className="p-5 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                  <div className="p-2 bg-blue-100 text-blue-800 rounded-lg w-fit">
                    <ShieldCheck className="h-5 w-5" />
                  </div>
                  <h4 className="font-extrabold text-sm text-slate-900">Fair Benefits & Respect</h4>
                  <p className="text-slate-600 leading-relaxed">
                    Competitive NGO sector pay packages, travel allowances, medical insurance, statutory leave benefits, and an inclusive work atmosphere.
                  </p>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Careers;
