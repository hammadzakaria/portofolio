import React, { useState, useEffect, useRef, useCallback } from 'react';
import { 
  ArrowRight, 
  ArrowLeft,
  MapPin, 
  Award, 
  BookOpen, 
  FileText, 
  Mail, 
  X, 
  Send, 
  Check, 
  Loader2,
  Lock,
  Unlock,
  Plus,
  Edit2,
  Trash2,
  ExternalLink,
  ChevronDown,
  Briefcase,
  ChevronLeft,
  ChevronRight,
  GripVertical,
  Menu,
  Home,
  User
} from 'lucide-react';
import { 
  getSkills, 
  getCertificates, 
  getEducation, 
  getExperiences,
  getProjects, 
  saveInquiry,
  saveSkill,
  deleteSkill,
  saveCertificate,
  deleteCertificate,
  saveEducation,
  deleteEducation,
  saveExperience,
  deleteExperience,
  saveProject,
  deleteProject
} from './firebase';

const SECTIONS = ['home', 'about', 'resume', 'portfolio'];

// Multilingual Static Translation Dictionary
const DICTIONARY = {
  en: {
    home: "Home",
    based: "Welcome to my portfolio web",
    resume: "Resume",
    portfolio: "Portfolio",
    discover: "Discover",
    about: "About",
    skills: "Skills",
    timeline: "Timeline",
    certifications: "Certifications",
    education: "Education",
    experiences: "Experiences",
    readMore: "Read More",
    backToPorto: "Back to Porto",
    inquiryChannel: "Inquiry Channel",
    getInTouch: "Get in Touch",
    name: "Name",
    email: "Email Address",
    message: "Message",
    sendInquiry: "Send Email",
    transmitting: "Preparing Mail...",
    received: "Redirecting to Mail Client...",
    secureChannel: "DIRECT CONTACT CHANNEL",
    directSignal: "DIRECT EMAIL: hammadzakaria1369@outlook.com",
    objectiveDetails: "Objective & Details",
    deploymentParams: "Deployment Parameters",
    deployUrl: "Deploy URL",
    projectDetail: "Project Detail Archive",
    close: "CLOSE [X]",
    adminGate: "Admin Gate",
    securedAccess: "SECURED DATABASE ACCESS",
    authenticate: "Authenticate",
    passcodeLabel: "Enter Passcode",
    passcodeError: "Passcode rejected",
    cancel: "Cancel Access",
    adminDashboard: "Database Control Tower",
    lockDashboard: "Lock Dashboard",
    existingItems: "Existing items in database",
    createNew: "Create New",
    commitChanges: "Commit to Database",
    savingChanges: "Saving Changes..."
  },
  id: {
    home: "Home",
    based: "Selamat datang di web portofolio",
    resume: "Resume",
    portfolio: "Portofolio",
    discover: "Telusuri",
    about: "Tentang",
    skills: "Keahlian",
    timeline: "Linimasa",
    certifications: "Sertifikasi",
    education: "Pendidikan",
    experiences: "Pengalaman Kerja",
    readMore: "Selengkapnya",
    backToPorto: "Kembali ke Porto",
    inquiryChannel: "Hubungi Saya",
    getInTouch: "Hubungi Saya",
    name: "Nama",
    email: "Alamat Email",
    message: "Pesan",
    sendInquiry: "Kirim Email",
    transmitting: "Menyiapkan Email...",
    received: "Membuka Klien Email...",
    secureChannel: "SALURAN KONTAK LANGSUNG",
    directSignal: "EMAIL LANGSUNG: hammadzakaria1369@outlook.com",
    objectiveDetails: "Tujuan & Rincian",
    deploymentParams: "Parameter Penerapan",
    deployUrl: "Tautan Deploy",
    projectDetail: "Arsip Rincian Proyek",
    close: "TUTUP [X]",
    adminGate: "Gerbang Admin",
    securedAccess: "AKSES DATABASE AMAN",
    authenticate: "Otentikasi",
    passcodeLabel: "Masukkan Kode Sandi",
    passcodeError: "Kode sandi salah",
    cancel: "Batalkan Akses",
    adminDashboard: "Menara Kontrol Database",
    lockDashboard: "Kunci Dashboard",
    existingItems: "Item yang terdaftar di database",
    createNew: "Tambah Baru",
    commitChanges: "Simpan ke Database",
    savingChanges: "Menyimpan Data..."
  }
};

export default function App() {
  const [lang, setLang] = useState('id');

  // Mobile detection for dynamic carousel limits
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Data lists states
  const [skills, setSkills] = useState([]);
  const [certificates, setCertificates] = useState([]);
  const [education, setEducation] = useState([]);
  const [experiences, setExperiences] = useState([]);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  // Active section index (controlled by scroll observer)
  const [activeIdx, setActiveIdx] = useState(0);

  // Project slider pagination index
  const [projStartIdx, setProjStartIdx] = useState(0);
  const maxVisibleProjects = isMobile ? 1 : 3;

  const [selectedProject, setSelectedProject] = useState(null);
  const [contactOpen, setContactOpen] = useState(false);
  const [resumeOpen, setResumeOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [expSlideIdx, setExpSlideIdx] = useState(0);
  const [expAnimating, setExpAnimating] = useState(false);
  const [expDirection, setExpDirection] = useState('next');
  const [expPerPage, setExpPerPage] = useState(2);

  const [eduSlideIdx, setEduSlideIdx] = useState(0);
  const [eduAnimating, setEduAnimating] = useState(false);
  const [eduDirection, setEduDirection] = useState('next');
  const [eduPerPage, setEduPerPage] = useState(2);

  const [certSlideIdx, setCertSlideIdx] = useState(0);
  const [certAnimating, setCertAnimating] = useState(false);
  const [certDirection, setCertDirection] = useState('next');
  const [certPerPage, setCertPerPage] = useState(4);

  useEffect(() => {
    setExpPerPage(isMobile ? 1 : 2);
    setEduPerPage(isMobile ? 1 : 2);
    setCertPerPage(isMobile ? 1 : 4);
  }, [isMobile]);
  
  // Admin Mode states
  const [adminMode, setAdminMode] = useState(false);
  const [adminPasscode, setAdminPasscode] = useState('');
  const [adminAuthorized, setAdminAuthorized] = useState(false);
  const [adminAuthError, setAdminAuthError] = useState(false);
  const [adminTab, setAdminTab] = useState('projects');
  
  // Admin CRUD Editing states
  const [editingItem, setEditingItem] = useState(null);
  const [crudSubmitting, setCrudSubmitting] = useState(false);

  // Admin drag-and-drop reordering state
  const [dragIdx, setDragIdx] = useState(null);
  const [dragOverIdx, setDragOverIdx] = useState(null);

  // Contact Inquiry Form states
  const [formName, setFormName] = useState('');
  const [formEmail, setFormEmail] = useState('');
  const [formMessage, setFormMessage] = useState('');
  const [formSubmitting, setFormSubmitting] = useState(false);
  const [formSuccess, setFormSuccess] = useState(false);

  // Reference for the main scroll snap container
  const scrollContainerRef = useRef(null);

  // Detect URL Route path or query for Admin entry
  useEffect(() => {
    const checkAdminPath = () => {
      const path = window.location.pathname;
      const hash = window.location.hash;
      if (path.endsWith('/hammadzakaria') || hash.includes('hammadzakaria')) {
        setAdminMode(true);
      }
    };
    checkAdminPath();
    window.addEventListener('popstate', checkAdminPath);
    window.addEventListener('hashchange', checkAdminPath);
    return () => {
      window.removeEventListener('popstate', checkAdminPath);
      window.removeEventListener('hashchange', checkAdminPath);
    };
  }, []);

  // Set up IntersectionObserver to update active navigation index during snap scroll
  useEffect(() => {
    const sectionsList = document.querySelectorAll('.page-section-snap');
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const id = entry.target.id;
          const index = SECTIONS.indexOf(id.replace('section-', ''));
          if (index !== -1) {
            setActiveIdx(index);
          }
        }
      });
    }, {
      threshold: 0.55 // Trigger when section is mostly visible
    });

    sectionsList.forEach(sec => observer.observe(sec));
    return () => {
      sectionsList.forEach(sec => observer.unobserve(sec));
    };
  }, []);

  // Fetch initial data
  const loadPortfolioData = async () => {
    try {
      const [skillsData, certsData, eduData, expData, projData] = await Promise.all([
        getSkills(),
        getCertificates(),
        getEducation(),
        getExperiences(),
        getProjects()
      ]);
      setSkills(skillsData);
      setCertificates(certsData);
      setEducation(eduData);
      setExperiences(expData);
      setProjects(projData);
    } catch (err) {
      console.error("Failed to load portfolio database:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPortfolioData();
  }, []);

  // Reset pagination if resizing
  useEffect(() => {
    if (projects.length > 0) {
      if (projStartIdx + maxVisibleProjects > projects.length) {
        setProjStartIdx(Math.max(0, projects.length - maxVisibleProjects));
      }
    }
  }, [maxVisibleProjects, projects]);

  // Navigate to section by scroll snap trigger
  const scrollToSection = (index) => {
    const sectionName = SECTIONS[index];
    const element = document.getElementById(`section-${sectionName}`);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
      setActiveIdx(index);
    }
  };

  // Helper to extract bilingual attributes
  const getField = (item, base) => {
    if (!item) return '';
    const localizedKey = `${base}_id`;
    return item[localizedKey] || item[`${base}_en`] || item[base] || '';
  };

  // Contact form submission (mailto redirect)
  const handleContactSubmit = async (e) => {
    e.preventDefault();
    if (!formName || !formEmail || !formMessage) return;

    setFormSubmitting(true);
    try {
      const emailTo = "hammadzakaria1369@outlook.com";
      const subject = encodeURIComponent(`Portfolio Inquiry dari ${formName}`);
      const body = encodeURIComponent(
        `Nama: ${formName}\n` +
        `Email: ${formEmail}\n\n` +
        `Pesan:\n${formMessage}`
      );
      
      await new Promise(resolve => setTimeout(resolve, 850));
      window.location.href = `mailto:${emailTo}?subject=${subject}&body=${body}`;
      
      setFormSuccess(true);
      setFormName('');
      setFormEmail('');
      setFormMessage('');
      setTimeout(() => setFormSuccess(false), 5000);
    } catch (err) {
      alert("Gagal memproses email.");
    } finally {
      setFormSubmitting(false);
    }
  };

  // Admin Code verification
  const handleAdminVerify = (e) => {
    e.preventDefault();
    if (adminPasscode === 'hammadsuksesbanget') {
      setAdminAuthorized(true);
      setAdminAuthError(false);
    } else {
      setAdminAuthError(true);
      setAdminPasscode('');
    }
  };

  // CRUD Actions
  const handleSaveCRUD = async (e) => {
    e.preventDefault();
    setCrudSubmitting(true);

    try {
      if (adminTab === 'projects') {
        const techArray = typeof editingItem.technologies === 'string'
          ? editingItem.technologies.split(',').map(t => t.trim())
          : editingItem.technologies || [];
        
        await saveProject({ ...editingItem, technologies: techArray });
      } else if (adminTab === 'skills') {
        await saveSkill({ ...editingItem, level: parseInt(editingItem.level) || 0 });
      } else if (adminTab === 'certificates') {
        await saveCertificate(editingItem);
      } else if (adminTab === 'education') {
        await saveEducation(editingItem);
      } else if (adminTab === 'experiences') {
        await saveExperience(editingItem);
      }

      setEditingItem(null);
      await loadPortfolioData();
    } catch (err) {
      alert("Error saving document to database.");
      console.error(err);
    } finally {
      setCrudSubmitting(false);
    }
  };

  const handleDeleteCRUD = async (id) => {
    if (!confirm("Are you sure you want to delete this item?")) return;
    try {
      if (adminTab === 'projects') {
        await deleteProject(id);
      } else if (adminTab === 'skills') {
        await deleteSkill(id);
      } else if (adminTab === 'certificates') {
        await deleteCertificate(id);
      } else if (adminTab === 'education') {
        await deleteEducation(id);
      } else if (adminTab === 'experiences') {
        await deleteExperience(id);
      }
      await loadPortfolioData();
    } catch (err) {
      alert("Error deleting document.");
      console.error(err);
    }
  };

  // Open Add CRUD form
  const initiateAdd = () => {
    if (adminTab === 'projects') {
      setEditingItem({ 
        title_id: '', title_en: '', 
        category_id: '', category_en: '', 
        description_id: '', description_en: '', 
        technologies: '', link: '#', image: '/workstation_bg.png' 
      });
    } else if (adminTab === 'skills') {
      setEditingItem({ name: '', level: 50 });
    } else if (adminTab === 'certificates') {
      setEditingItem({ title: '', issuer: '', year: new Date().getFullYear().toString(), link: '' });
    } else if (adminTab === 'education') {
      setEditingItem({ institution: '', degree_id: '', degree_en: '', duration: '' });
    } else if (adminTab === 'experiences') {
      setEditingItem({ 
        role_id: '', role_en: '', 
        company: '', duration: '', 
        description_id: '', description_en: '' 
      });
    }
  };

  // Translation hook wrapper
  const t = (key) => {
    return DICTIONARY[lang][key] || DICTIONARY['en'][key] || key;
  };

  // Slider navigation
  const prevProjectSlide = () => {
    setProjStartIdx(prev => Math.max(prev - 1, 0));
  };
  const nextProjectSlide = () => {
    setProjStartIdx(prev => Math.min(prev + 1, projects.length - maxVisibleProjects));
  };

  // Smooth experience slide navigation
  const goExpSlide = useCallback((dir) => {
    if (expAnimating) return;
    const maxPage = Math.ceil(experiences.length / expPerPage) - 1;
    const nextIdx = dir === 'next' ? Math.min(expSlideIdx + 1, maxPage) : Math.max(expSlideIdx - 1, 0);
    if (nextIdx === expSlideIdx) return;
    setExpDirection(dir);
    setExpAnimating(true);
    setTimeout(() => {
      setExpSlideIdx(nextIdx);
      setTimeout(() => setExpAnimating(false), 50);
    }, 250);
  }, [expAnimating, expSlideIdx, experiences.length, expPerPage]);

  // Smooth education slide navigation
  const goEduSlide = useCallback((dir) => {
    if (eduAnimating) return;
    const maxPage = Math.ceil(education.length / eduPerPage) - 1;
    const nextIdx = dir === 'next' ? Math.min(eduSlideIdx + 1, maxPage) : Math.max(eduSlideIdx - 1, 0);
    if (nextIdx === eduSlideIdx) return;
    setEduDirection(dir);
    setEduAnimating(true);
    setTimeout(() => {
      setEduSlideIdx(nextIdx);
      setTimeout(() => setEduAnimating(false), 50);
    }, 250);
  }, [eduAnimating, eduSlideIdx, education.length, eduPerPage]);

  // Smooth certification slide navigation
  const goCertSlide = useCallback((dir) => {
    if (certAnimating) return;
    const maxPage = Math.ceil(certificates.length / certPerPage) - 1;
    const nextIdx = dir === 'next' ? Math.min(certSlideIdx + 1, maxPage) : Math.max(certSlideIdx - 1, 0);
    if (nextIdx === certSlideIdx) return;
    setCertDirection(dir);
    setCertAnimating(true);
    setTimeout(() => {
      setCertSlideIdx(nextIdx);
      setTimeout(() => setCertAnimating(false), 50);
    }, 250);
  }, [certAnimating, certSlideIdx, certificates.length, certPerPage]);

  // Admin drag-and-drop handlers
  const getAdminList = () => {
    if (adminTab === 'projects') return projects;
    if (adminTab === 'skills') return skills;
    if (adminTab === 'certificates') return certificates;
    if (adminTab === 'education') return education;
    if (adminTab === 'experiences') return experiences;
    return [];
  };

  const setAdminList = (list) => {
    if (adminTab === 'projects') setProjects(list);
    if (adminTab === 'skills') setSkills(list);
    if (adminTab === 'certificates') setCertificates(list);
    if (adminTab === 'education') setEducation(list);
    if (adminTab === 'experiences') setExperiences(list);
  };

  const handleDragStart = (idx) => setDragIdx(idx);
  const handleDragOver = (e, idx) => { e.preventDefault(); setDragOverIdx(idx); };
  const handleDrop = (idx) => {
    if (dragIdx === null || dragIdx === idx) { setDragIdx(null); setDragOverIdx(null); return; }
    const list = [...getAdminList()];
    const [removed] = list.splice(dragIdx, 1);
    list.splice(idx, 0, removed);
    setAdminList(list);
    setDragIdx(null);
    setDragOverIdx(null);
  };
  const handleDragEnd = () => { setDragIdx(null); setDragOverIdx(null); };

  return (
    <div className="relative h-screen w-screen bg-darkBg text-white font-sans overflow-hidden select-none">
      
      {/* 1. TOP HEADER NAVIGATION */}
      <header className="fixed top-0 left-0 right-0 z-50 px-5 sm:px-12 md:px-24 py-4 sm:py-6 flex justify-between items-center bg-gradient-to-b from-darkBg via-darkBg/80 to-transparent backdrop-blur-[3px]">
        {/* Desktop: Left-aligned Section Navigation */}
        <nav className="hidden md:flex items-center space-x-8 lg:space-x-10">
          {SECTIONS.map((sec, index) => (
            <button
              key={sec}
              onClick={() => scrollToSection(index)}
              className={`text-xs font-semibold tracking-mega uppercase transition-all duration-300 ${
                activeIdx === index ? 'text-white' : 'text-gray-500 hover:text-white'
              }`}
            >
              {t(sec)}
            </button>
          ))}
        </nav>

        {/* Right-side: Language selector & Contact CTA */}
        <div className="flex items-center space-x-4 md:space-x-8">
          <div className="flex items-center space-x-2 text-[10px] font-bold tracking-widest text-gray-400 select-none">
            <button 
              onClick={() => setLang('id')} 
              className={`hover:text-white transition-colors ${lang === 'id' ? 'text-accentCyan font-bold' : 'text-gray-400'}`}
            >
              ID
            </button>
            <span className="text-gray-600">|</span>
            <button 
              onClick={() => setLang('en')} 
              className={`hover:text-white transition-colors ${lang === 'en' ? 'text-accentCyan font-bold' : 'text-gray-400'}`}
            >
              EN
            </button>
          </div>

          <button 
            onClick={() => setContactOpen(true)}
            className="flex items-center space-x-2 text-[10px] md:text-xs font-semibold tracking-widest uppercase border-b border-transparent hover:border-white transition-all duration-300 text-white"
          >
            <Mail size={12} className="text-gray-400" />
            <span className="hidden sm:inline">{t('getInTouch')}</span>
          </button>
        </div>
      </header>

      {/* Mobile Floating Bottom Navbar */}
      <nav className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 bg-[#0c0e12]/95 backdrop-blur-xl border border-gray-800 rounded-full flex md:hidden items-center px-6 py-4 space-x-8 shadow-2xl">
        {[
          { id: 0, icon: Home, label: t('home') },
          { id: 1, icon: User, label: t('about') },
          { id: 2, icon: FileText, label: t('resume') },
          { id: 3, icon: Briefcase, label: t('portfolio') }
        ].map((item) => {
          const isActive = activeIdx === item.id;
          const Icon = item.icon;
          return (
            <button
              key={item.id}
              onClick={() => scrollToSection(item.id)}
              className={`flex flex-col items-center justify-center space-y-1.5 transition-colors focus:outline-none ${
                isActive ? 'text-accentCyan' : 'text-gray-500 hover:text-white'
              }`}
            >
              <Icon size={20} className={isActive ? 'text-accentCyan' : ''} />
              <span className="text-[8px] font-bold tracking-widest uppercase">{item.label}</span>
            </button>
          )
        })}
      </nav>

      {/* 2. FLOATING RIGHT DOT INDICATOR (hidden on mobile) */}
      <div className="hidden md:flex fixed right-6 md:right-12 top-1/2 -translate-y-1/2 z-45 flex-col space-y-6">
        {SECTIONS.map((sec, idx) => (
          <button
            key={sec}
            onClick={() => scrollToSection(idx)}
            className="group flex items-center justify-end focus:outline-none"
            aria-label={`Go to ${sec}`}
          >
            <span className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 text-[10px] font-mono tracking-widest text-gray-500 mr-3 uppercase">
              0{idx + 1}
            </span>
            <span className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${
              activeIdx === idx 
                ? 'bg-white scale-150 shadow-[0_0_8px_rgba(255,255,255,0.8)]' 
                : 'bg-gray-700 group-hover:bg-gray-400'
            }`} />
          </button>
        ))}
      </div>

      {/* ==================== MAIN SNAP SCROLL CONTAINER ==================== */}
      <main 
        ref={scrollContainerRef}
        className="h-screen w-full overflow-y-scroll snap-y snap-mandatory scroll-smooth no-scrollbar"
      >

        {/* SECTION 1: HOME */}
        <section 
          id="section-home"
          className="page-section-snap h-screen w-full snap-start relative flex flex-col justify-center px-6 sm:px-12 md:px-24 bg-darkBg overflow-hidden"
        >
          {/* Full-screen dark background image */}
          <div 
            className="absolute inset-0 w-full h-full bg-cover bg-center pointer-events-none z-0"
            style={{ 
              backgroundImage: 'url(/workstation_bg.png)'
            }}
          />
          {/* Dark overlay */}
          <div className="absolute inset-0 bg-black/70 z-[1] pointer-events-none" />
          {/* Extra gradient fade */}
          <div className="absolute inset-0 bg-gradient-to-r from-darkBg via-darkBg/80 to-transparent z-[2] pointer-events-none" />

          <div 
            className={`max-w-[1500px] mx-auto w-full relative z-10 transition-all duration-1000 ease-in-out ${
              activeIdx === 0 ? 'opacity-100 blur-none scale-100 translate-y-0' : 'opacity-0 blur-xl scale-98 translate-y-4'
            }`}
          >
            <div className="relative z-10 space-y-4 sm:space-y-6 pt-8 sm:pt-12">
              <span className="text-[10px] sm:text-xs font-semibold tracking-mega text-gray-400 uppercase block">
                {t('based')}
              </span>
              <h1 className="text-4xl sm:text-6xl md:text-8xl lg:text-9xl font-extrabold tracking-tight leading-none text-white select-none">
                HAMMAD <br /> ZAKARIA
              </h1>
              <p className="text-[10px] sm:text-xs md:text-sm font-light tracking-widest text-gray-400 uppercase max-w-xl">
                Network Engineer & Cloud Specialist
              </p>
              <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4 pt-4 sm:pt-6">
                <button 
                  onClick={() => setResumeOpen(true)}
                  className="px-5 sm:px-6 py-3 border border-gray-700 hover:border-white text-[10px] sm:text-xs font-semibold tracking-widest uppercase transition-all duration-300 bg-transparent hover:bg-white hover:text-black flex items-center justify-center space-x-2"
                >
                  <FileText size={14} />
                  <span>{t('resume')}</span>
                </button>
                <button 
                  onClick={() => scrollToSection(3)}
                  className="px-5 sm:px-6 py-3 border border-gray-700 hover:border-white text-[10px] sm:text-xs font-semibold tracking-widest uppercase transition-all duration-300 bg-transparent hover:bg-white hover:text-black flex items-center justify-center space-x-2"
                >
                  <span>{t('portfolio')}</span>
                  <ArrowRight size={14} />
                </button>
              </div>
            </div>
          </div>

          {/* Discover / Telusuri - bottom center */}
          <div 
            onClick={() => scrollToSection(1)}
            className="absolute bottom-8 sm:bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center cursor-pointer opacity-40 hover:opacity-100 transition-opacity duration-300 z-10"
          >
            <span className="text-[9px] font-mono tracking-mega uppercase mb-2">{t('discover')}</span>
            <ChevronDown size={14} className="animate-bounce" />
          </div>
        </section>

        {/* SECTION 2: ABOUT */}
        <section 
          id="section-about"
          className="page-section-snap h-screen w-full snap-start relative flex flex-col justify-center px-6 sm:px-12 md:px-24 bg-darkCard"
        >
          <div 
            className={`max-w-[1500px] mx-auto w-full transition-all duration-1000 ease-in-out ${
              activeIdx === 1 ? 'opacity-100 blur-none scale-100 translate-y-0' : 'opacity-0 blur-xl scale-98 translate-y-4'
            }`}
          >
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6 sm:gap-8 md:gap-16 items-center pt-16 sm:pt-12">
              {/* Photo - shows first on mobile (order-1 mobile, order-2 desktop) */}
              <div className="md:col-span-5 flex justify-center order-1 md:order-2">
                <div className="relative group max-w-[120px] sm:max-w-xs md:max-w-md w-full aspect-[3/4] border border-gray-800 p-2 overflow-hidden bg-black mx-auto">
                  <div 
                    className="w-full h-full bg-cover bg-center grayscale contrast-125 transition-all duration-700 group-hover:scale-105 group-hover:grayscale-0"
                    style={{ backgroundImage: 'url(/profile_portrait.png)' }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-darkBg/80 via-transparent to-transparent opacity-85 pointer-events-none" />
                  <div className="absolute top-4 left-4 w-4 h-[1px] bg-white/40" />
                  <div className="absolute top-4 left-4 w-[1px] h-4 bg-white/40" />
                  <div className="absolute bottom-4 right-4 w-4 h-[1px] bg-white/40" />
                  <div className="absolute bottom-4 right-4 w-[1px] h-4 bg-white/40" />
                </div>
              </div>

              {/* Text content - shows second on mobile (order-2 mobile, order-1 desktop) */}
              <div className="md:col-span-7 space-y-3 sm:space-y-6 order-2 md:order-1 text-center md:text-left flex flex-col items-center md:items-start">
                <span className="text-[10px] sm:text-xs font-bold tracking-mega text-gray-500 uppercase block">
                  {lang === 'id' ? 'PENGENALAN' : 'INTRODUCTION'}
                </span>
                <h2 className="text-2xl sm:text-4xl md:text-6xl font-extrabold text-white tracking-tight uppercase">
                  {t('about')}
                </h2>
                <p className="text-xs sm:text-lg md:text-xl font-light text-textMuted leading-relaxed max-w-2xl select-text">
                  {lang === 'id' 
                    ? "Seorang junior network engineer dan cloud engineer. Spesialisasi dalam infrastruktur jaringan Mikrotik, Cisco, dan deployment AWS dengan fokus pada presisi dan keamanan data."
                    : "A junior network engineer and cloud engineer. Specializing in MikroTik network infrastructure, Cisco routing, and AWS cloud deployment with a focus on data security and precision."}
                </p>

                {/* Social Media Links */}
                <div className="pt-3 sm:pt-5 flex items-center justify-center md:justify-start space-x-5">
                  <a href="https://www.linkedin.com/in/hammadzakaria" target="_blank" rel="noopener noreferrer" className="group flex items-center space-x-2 text-gray-500 hover:text-white transition-colors duration-300">
                    <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
                    <span className="text-[10px] font-semibold tracking-widest uppercase hidden sm:inline">LinkedIn</span>
                  </a>
                  <a href="https://www.instagram.com/hammadzakaria" target="_blank" rel="noopener noreferrer" className="group flex items-center space-x-2 text-gray-500 hover:text-white transition-colors duration-300">
                    <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/></svg>
                    <span className="text-[10px] font-semibold tracking-widest uppercase hidden sm:inline">Instagram</span>
                  </a>
                  <a href="https://www.youtube.com/@hammadzakaria" target="_blank" rel="noopener noreferrer" className="group flex items-center space-x-2 text-gray-500 hover:text-white transition-colors duration-300">
                    <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M23.498 6.186a3.016 3.016 0 00-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 00.502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 002.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 002.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>
                    <span className="text-[10px] font-semibold tracking-widest uppercase hidden sm:inline">YouTube</span>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* SECTION 3: RESUME PAGE */}
        <section 
          id="section-resume"
          className="page-section-snap h-screen w-full snap-start relative flex flex-col justify-center px-6 sm:px-12 md:px-24 bg-darkBg"
        >
          <div 
            className={`max-w-[1500px] mx-auto w-full transition-all duration-1000 ease-in-out ${
              activeIdx === 2 ? 'opacity-100 blur-none scale-100 translate-y-0' : 'opacity-0 blur-xl scale-98 translate-y-4'
            }`}
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 sm:gap-12 md:gap-24 h-[65vh] md:h-auto overflow-y-auto no-scrollbar py-6 md:py-0 mt-16 md:mt-0 pb-28 md:pb-0">
              
              {/* Left Column */}
              <div className="space-y-12">
                <div className="space-y-6">
                  <div className="space-y-2">
                    <span className="text-[10px] sm:text-xs font-bold tracking-mega text-gray-500 uppercase block">
                      {lang === 'id' ? 'Kemampuan Teknis' : 'Technical Capabilities'}
                    </span>
                    <h2 className="text-2xl sm:text-3xl md:text-5xl font-extrabold text-white uppercase tracking-tight">
                      {t('skills')}
                    </h2>
                  </div>
                  
                  <div className="space-y-5">
                    {skills.map((skill) => (
                      <div key={skill.id} className="space-y-2">
                        <div className="flex justify-between text-xs tracking-wider">
                          <span className="font-semibold text-white uppercase">{skill.name}</span>
                          <span className="text-gray-400 font-mono">{skill.level}%</span>
                        </div>
                        <div className="h-[2px] w-full bg-gray-900 overflow-hidden relative">
                          <div 
                            className="h-full bg-white progress-bar-glow transition-all duration-1000 ease-out" 
                            style={{ width: `${skill.level}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Certifications (White Header) */}
                <div className="space-y-6 border-t border-gray-900 pt-6">
                  <div className="flex items-center justify-between">
                    <h3 className="text-2xl md:text-3xl font-extrabold text-white uppercase tracking-tight flex items-center space-x-2">
                      <Award size={22} className="text-white" />
                      <span>{t('certifications')}</span>
                    </h3>
                    {certificates.length > certPerPage && (
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => goCertSlide('prev')}
                          disabled={certSlideIdx === 0}
                          className={`p-1 border border-gray-800 rounded-full transition-all duration-300 focus:outline-none ${
                            certSlideIdx === 0 ? 'opacity-30 cursor-not-allowed' : 'hover:border-white text-gray-400 hover:text-white'
                          }`}
                        >
                          <ChevronLeft size={10} />
                        </button>
                        <span className="text-[8px] font-mono text-gray-500 text-center min-w-[20px]">
                          {certSlideIdx + 1}/{Math.ceil(certificates.length / certPerPage)}
                        </span>
                        <button
                          onClick={() => goCertSlide('next')}
                          disabled={certSlideIdx >= Math.ceil(certificates.length / certPerPage) - 1}
                          className={`p-1 border border-gray-800 rounded-full transition-all duration-300 focus:outline-none ${
                            certSlideIdx >= Math.ceil(certificates.length / certPerPage) - 1 ? 'opacity-30 cursor-not-allowed' : 'hover:border-white text-gray-400 hover:text-white'
                          }`}
                        >
                          <ChevronRight size={10} />
                        </button>
                      </div>
                    )}
                  </div>
                  
                  <div className="overflow-hidden relative">
                    <div 
                      className={`grid ${isMobile ? 'grid-cols-1' : 'grid-cols-2'} gap-3 sm:gap-4 transition-all duration-400 ease-out ${
                        certAnimating 
                          ? `opacity-0 ${certDirection === 'next' ? 'translate-x-8' : '-translate-x-8'}` 
                          : 'opacity-100 translate-x-0'
                      }`}
                    >
                      {certificates.slice(certSlideIdx * certPerPage, certSlideIdx * certPerPage + certPerPage).map((cert) => {
                        const cardContent = (
                          <div className="group relative border border-gray-900 bg-darkCard/30 p-3 hover:border-white transition-colors h-full flex flex-col justify-between cursor-pointer">
                            <div>
                              <div className="flex justify-between items-start">
                                <p className="text-[10px] sm:text-xs font-bold text-white uppercase pr-3">{cert.title}</p>
                                {cert.link && (
                                  <ExternalLink size={10} className="text-accentCyan opacity-60 group-hover:opacity-100 transition-opacity flex-shrink-0 mt-0.5" />
                                )}
                              </div>
                              <p className="text-[9px] sm:text-[10px] text-gray-500">{cert.issuer} • {cert.year}</p>
                            </div>
                          </div>
                        );

                        if (cert.link) {
                          return (
                            <a 
                              key={cert.id} 
                              href={cert.link} 
                              target="_blank" 
                              rel="noopener noreferrer" 
                              className="block h-full"
                            >
                              {cardContent}
                            </a>
                          );
                        }

                        return (
                          <div key={cert.id} className="h-full">
                            <div className="border border-gray-900 bg-darkCard/30 p-3 hover:border-gray-700 transition-colors h-full">
                              <p className="text-xs font-bold text-white uppercase">{cert.title}</p>
                              <p className="text-[10px] text-gray-500">{cert.issuer} • {cert.year}</p>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column */}
              <div className="space-y-12">
                <div className="relative border-l border-gray-800 pl-6 space-y-10 ml-2">
                  
                  {/* Experiences timeline items - smooth slide pagination */}
                  <div className="space-y-6">
                    <div className="relative flex items-center justify-between">
                      <div className="flex items-center">
                        <div className="absolute -left-[32px] top-1/2 -translate-y-1/2 bg-darkBg border border-gray-800 w-4 h-4 rounded-full flex items-center justify-center">
                          <Briefcase size={8} className="text-white" />
                        </div>
                        <h3 className="text-xl sm:text-2xl md:text-3xl font-extrabold text-white uppercase tracking-tight">
                          {t('experiences')}
                        </h3>
                      </div>

                      {/* Slide controls */}
                      {experiences.length > expPerPage && (
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => goExpSlide('prev')}
                            disabled={expSlideIdx === 0}
                            className={`p-1.5 border border-gray-800 rounded-full transition-all duration-300 focus:outline-none ${
                              expSlideIdx === 0 ? 'opacity-30 cursor-not-allowed' : 'hover:border-white text-gray-400 hover:text-white'
                            }`}
                          >
                            <ChevronLeft size={12} />
                          </button>
                          <span className="text-[9px] font-mono text-gray-500 min-w-[32px] text-center">
                            {expSlideIdx + 1}/{Math.ceil(experiences.length / expPerPage)}
                          </span>
                          <button
                            onClick={() => goExpSlide('next')}
                            disabled={expSlideIdx >= Math.ceil(experiences.length / expPerPage) - 1}
                            className={`p-1.5 border border-gray-800 rounded-full transition-all duration-300 focus:outline-none ${
                              expSlideIdx >= Math.ceil(experiences.length / expPerPage) - 1 ? 'opacity-30 cursor-not-allowed' : 'hover:border-white text-gray-400 hover:text-white'
                            }`}
                          >
                            <ChevronRight size={12} />
                          </button>
                        </div>
                      )}
                    </div>
                    
                    {/* Experiences content with smooth slide transition */}
                    <div className="overflow-hidden relative">
                      <div 
                        className={`space-y-6 transition-all duration-400 ease-out ${
                          expAnimating 
                            ? `opacity-0 ${expDirection === 'next' ? 'translate-x-8' : '-translate-x-8'}` 
                            : 'opacity-100 translate-x-0'
                        }`}
                      >
                        {experiences.slice(expSlideIdx * expPerPage, expSlideIdx * expPerPage + expPerPage).map((exp) => (
                          <div key={exp.id} className="space-y-1">
                            <div className="flex justify-between items-baseline">
                              <p className="text-[10px] sm:text-xs font-bold text-white uppercase">{getField(exp, 'role')}</p>
                              <span className="text-[8px] sm:text-[9px] font-mono text-gray-500">{exp.duration}</span>
                            </div>
                            <p className="text-[9px] sm:text-[10px] text-accentCyan uppercase tracking-widest font-semibold">{exp.company}</p>
                            <p className="text-[10px] sm:text-xs text-textMuted font-light leading-relaxed select-text">
                              {getField(exp, 'description')}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Education timeline items */}
                  <div className="space-y-6 border-t border-gray-900/50 pt-6">
                    <div className="relative flex items-center justify-between">
                      <div className="flex items-center">
                        <div className="absolute -left-[32px] top-1/2 -translate-y-1/2 bg-darkBg border border-gray-800 w-4 h-4 rounded-full flex items-center justify-center">
                          <BookOpen size={8} className="text-white" />
                        </div>
                        <h3 className="text-xl sm:text-2xl md:text-3xl font-extrabold text-white uppercase tracking-tight">
                          {t('education')}
                        </h3>
                      </div>

                      {/* Slide controls */}
                      {education.length > eduPerPage && (
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => goEduSlide('prev')}
                            disabled={eduSlideIdx === 0}
                            className={`p-1.5 border border-gray-800 rounded-full transition-all duration-300 focus:outline-none ${
                              eduSlideIdx === 0 ? 'opacity-30 cursor-not-allowed' : 'hover:border-white text-gray-400 hover:text-white'
                            }`}
                          >
                            <ChevronLeft size={12} />
                          </button>
                          <span className="text-[9px] font-mono text-gray-500 min-w-[32px] text-center">
                            {eduSlideIdx + 1}/{Math.ceil(education.length / eduPerPage)}
                          </span>
                          <button
                            onClick={() => goEduSlide('next')}
                            disabled={eduSlideIdx >= Math.ceil(education.length / eduPerPage) - 1}
                            className={`p-1.5 border border-gray-800 rounded-full transition-all duration-300 focus:outline-none ${
                              eduSlideIdx >= Math.ceil(education.length / eduPerPage) - 1 ? 'opacity-30 cursor-not-allowed' : 'hover:border-white text-gray-400 hover:text-white'
                            }`}
                          >
                            <ChevronRight size={12} />
                          </button>
                        </div>
                      )}
                    </div>
                    
                    {/* Education content with smooth slide transition */}
                    <div className="overflow-hidden relative">
                      <div 
                        className={`space-y-4 transition-all duration-400 ease-out ${
                          eduAnimating 
                            ? `opacity-0 ${eduDirection === 'next' ? 'translate-x-8' : '-translate-x-8'}` 
                            : 'opacity-100 translate-x-0'
                        }`}
                      >
                        {education.slice(eduSlideIdx * eduPerPage, eduSlideIdx * eduPerPage + eduPerPage).map((edu) => (
                          <div key={edu.id} className="space-y-1">
                            <div className="flex justify-between items-baseline">
                              <p className="text-[10px] sm:text-xs font-semibold text-white uppercase">{edu.institution}</p>
                              <span className="text-[8px] sm:text-[9px] font-mono text-gray-500">{edu.duration}</span>
                            </div>
                            <p className="text-[10px] sm:text-xs text-textMuted font-light">{getField(edu, 'degree')}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                </div>
              </div>

            </div>
          </div>
        </section>

        {/* SECTION 4: PORTFOLIO */}
        <section 
          id="section-portfolio"
          className="page-section-snap h-screen w-full snap-start relative flex flex-col justify-center px-6 sm:px-12 md:px-24 bg-darkCard"
        >
          <div 
            className={`max-w-[1500px] mx-auto w-full transition-all duration-1000 ease-in-out ${
              activeIdx === 3 ? 'opacity-100 blur-none scale-100 translate-y-0' : 'opacity-0 blur-xl scale-98 translate-y-4'
            }`}
          >
            <div className="space-y-6 sm:space-y-8 h-[85vh] md:h-auto overflow-y-auto no-scrollbar py-20 md:py-0 pt-16 md:pt-12">
              <div className="flex justify-between items-end border-b border-gray-800 pb-4">
                <div>
                  <span className="text-[10px] sm:text-xs font-bold tracking-mega text-gray-500 uppercase block">
                    {lang === 'id' ? 'KARYA PILIHAN' : 'SELECTED WORK'}
                  </span>
                  <h2 className="text-3xl sm:text-4xl md:text-6xl font-extrabold text-white uppercase tracking-tight">
                    {lang === 'id' ? 'Portofolio' : 'Portfolio'}
                  </h2>
                </div>
              </div>

              {/* Flex row sliding container */}
              <div className="relative px-2 sm:px-4 md:px-10 overflow-hidden w-full">
                <div 
                  className="flex transition-transform duration-500 ease-out"
                  style={{ transform: `translateX(-${projStartIdx * (isMobile ? 100 : 33.333)}%)` }}
                >
                  {projects.map((proj) => (
                    <div 
                      key={proj.id} 
                      className="w-full md:w-1/3 flex-shrink-0 px-2 sm:px-4"
                    >
                      <div className="group relative border border-gray-800/80 bg-darkBg/20 hover:bg-darkBg/60 p-5 sm:p-8 flex flex-col justify-between h-60 sm:h-72 transition-all duration-300 hover:border-gray-600">
                        <div className="space-y-3 sm:space-y-4">
                          <span className="text-[9px] font-mono tracking-widest text-accentCyan uppercase block">
                            {getField(proj, 'category')}
                          </span>
                          <h3 className="text-sm sm:text-base font-bold text-white uppercase tracking-wide group-hover:text-accentCyan transition-colors">
                            {getField(proj, 'title')}
                          </h3>
                          <p className="text-[11px] sm:text-xs text-textMuted font-light leading-relaxed line-clamp-3 select-text">
                            {getField(proj, 'description')}
                          </p>
                        </div>
                        
                        <div className="flex justify-between items-center pt-3 sm:pt-4 border-t border-gray-900 group-hover:border-gray-800 transition-colors">
                          <div className="flex space-x-2 overflow-hidden">
                            {proj.technologies && proj.technologies.slice(0, isMobile ? 2 : 3).map((tech, i) => (
                              <span key={i} className="text-[8px] sm:text-[9px] font-mono text-gray-500 uppercase">
                                #{tech}
                              </span>
                            ))}
                          </div>
                          <button 
                            onClick={() => setSelectedProject(proj)}
                            className="text-[10px] font-bold tracking-widest text-white uppercase flex items-center space-x-1 group-hover:text-accentCyan transition-colors focus:outline-none flex-shrink-0"
                          >
                            <span>{t('readMore')}</span>
                            <ArrowRight size={10} className="group-hover:translate-x-1 transition-transform" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Left Side Arrow */}
                {projStartIdx > 0 && (
                  <button 
                    onClick={prevProjectSlide}
                    className="absolute left-0 sm:left-[-4px] md:left-[-8px] top-1/2 -translate-y-1/2 p-2 sm:p-3 bg-darkBg/95 border border-gray-800 text-gray-400 hover:text-white hover:border-white transition-all duration-300 z-40 focus:outline-none rounded-full shadow-xl"
                    aria-label="Previous slide"
                  >
                    <ChevronLeft size={14} className="sm:w-4 sm:h-4" />
                  </button>
                )}

                {/* Right Side Arrow */}
                {projStartIdx + maxVisibleProjects < projects.length && (
                  <button 
                    onClick={nextProjectSlide}
                    className="absolute right-0 sm:right-[-4px] md:right-[-8px] top-1/2 -translate-y-1/2 p-2 sm:p-3 bg-darkBg/95 border border-gray-800 text-gray-400 hover:text-white hover:border-white transition-all duration-300 z-40 focus:outline-none rounded-full shadow-xl"
                    aria-label="Next slide"
                  >
                    <ChevronRight size={14} className="sm:w-4 sm:h-4" />
                  </button>
                )}
              </div>
              
              {/* Footer */}
              <div className="pt-4 flex justify-between items-center text-[10px] font-mono text-gray-600">
                <span>© 2026 HAMMAD ZAKARIA. ALL RIGHTS RESERVED.</span>
                <span className="hidden md:inline">BY HAMMADZAKARIA</span>
              </div>
            </div>
          </div>
        </section>

      </main>

      {/* ==================== SUB-PAGE: PORTFOLIO DETAILED VIEW ==================== */}
      <div 
        className={`fixed inset-0 z-50 bg-darkBg transition-all duration-500 ease-in-out flex flex-col justify-between ${
          selectedProject ? 'opacity-100 translate-y-0 pointer-events-auto' : 'opacity-0 translate-y-4 pointer-events-none'
        }`}
      >
        {selectedProject && (
          <>
            <header className="px-5 sm:px-12 md:px-24 py-6 sm:py-8 border-b border-gray-900 flex justify-between items-center">
              <button 
                onClick={() => setSelectedProject(null)}
                className="flex items-center space-x-2 text-xs font-semibold tracking-widest text-gray-400 hover:text-white uppercase transition-colors focus:outline-none"
              >
                <ArrowLeft size={14} />
                <span>{t('backToPorto')}</span>
              </button>
              
              <span className="text-[10px] font-mono tracking-widest text-gray-500 uppercase hidden sm:block">
                {t('projectDetail')}
              </span>
            </header>

            <main className="flex-1 overflow-y-auto no-scrollbar py-8 sm:py-12 px-5 sm:px-12 md:px-24">
              <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-8 sm:gap-12 items-start">
                
                <div className="md:col-span-7 space-y-6 sm:space-y-8">
                  <div className="space-y-3">
                    <span className="text-[10px] sm:text-xs font-bold tracking-widest text-accentCyan uppercase">
                      {getField(selectedProject, 'category')}
                    </span>
                    <h1 className="text-2xl sm:text-4xl md:text-6xl font-extrabold uppercase text-white tracking-tight leading-tight">
                      {getField(selectedProject, 'title')}
                    </h1>
                  </div>

                  <div className="space-y-4">
                    <h3 className="text-xs font-bold tracking-widest text-gray-400 uppercase">{t('objectiveDetails')}</h3>
                    <p className="text-base font-light text-textMuted leading-relaxed select-text">
                      {getField(selectedProject, 'description')}
                    </p>
                  </div>

                  <div className="space-y-3 pt-4">
                    <h3 className="text-xs font-bold tracking-widest text-gray-400 uppercase">{t('deploymentParams')}</h3>
                    <div className="flex flex-wrap gap-2">
                      {selectedProject.technologies && selectedProject.technologies.map((tech, i) => (
                        <span key={i} className="px-3 py-1.5 bg-darkCard border border-gray-800 text-xs font-mono text-white/80">
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>

                  {selectedProject.link && selectedProject.link !== '#' && (
                    <div className="pt-6">
                      <a 
                        href={selectedProject.link} 
                        target="_blank" 
                        rel="noreferrer"
                        className="inline-flex items-center space-x-2 px-6 py-3 border border-white hover:bg-white hover:text-black text-xs font-bold tracking-widest uppercase transition-colors"
                      >
                        <span>{t('deployUrl')}</span>
                        <ExternalLink size={12} />
                      </a>
                    </div>
                  )}
                </div>

                <div className="md:col-span-5">
                  <div className="border border-gray-800 p-2 bg-darkCard/40 aspect-[4/3] w-full relative overflow-hidden group">
                    <div 
                      className="w-full h-full bg-cover bg-center grayscale hover:grayscale-0 transition-all duration-700" 
                      style={{ backgroundImage: `url(${selectedProject.image || '/workstation_bg.png'})` }}
                    />
                    <div className="absolute top-4 right-4 w-3 h-3 border-r border-t border-white/50" />
                    <div className="absolute bottom-4 left-4 w-3 h-3 border-l border-b border-white/50" />
                  </div>
                </div>

              </div>
            </main>

            <footer className="px-5 sm:px-12 md:px-24 py-5 sm:py-6 border-t border-gray-900 flex justify-between items-center text-[9px] font-mono text-gray-600">
              <span>HZ ARCHIVE // {selectedProject.id}</span>
              <button 
                onClick={() => setSelectedProject(null)}
                className="hover:text-white transition-colors uppercase font-bold text-[10px] tracking-widest"
              >
                {t('close')}
              </button>
            </footer>
          </>
        )}
      </div>

      {/* ==================== CONTACT SIDE DRAWER ==================== */}
      <div 
        className={`fixed inset-y-0 right-0 w-full sm:w-[420px] md:w-[480px] bg-darkBg border-l border-gray-800 z-50 p-6 sm:p-8 md:p-12 shadow-2xl transition-transform duration-500 ease-in-out transform ${
          contactOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="flex justify-between items-center mb-12">
          <div>
            <span className="text-[10px] font-bold tracking-mega text-gray-500 uppercase block">{t('inquiryChannel')}</span>
            <h3 className="text-xl font-bold uppercase text-white">{t('getInTouch')}</h3>
          </div>
          <button 
            onClick={() => setContactOpen(false)}
            className="p-2 border border-gray-800 text-gray-400 hover:text-white hover:border-white transition-colors focus:outline-none"
          >
            <X size={16} />
          </button>
        </div>

        <form onSubmit={handleContactSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="text-[10px] font-bold tracking-widest text-gray-400 uppercase block">{t('name')}</label>
            <input 
              type="text" 
              value={formName}
              onChange={(e) => setFormName(e.target.value)}
              required
              placeholder="Contoh: John Doe"
              className="w-full bg-darkCard border border-gray-800 px-4 py-3 text-xs text-white placeholder-gray-600 focus:outline-none focus:border-white transition-colors"
            />
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-bold tracking-widest text-gray-400 uppercase block">{t('email')}</label>
            <input 
              type="email" 
              value={formEmail}
              onChange={(e) => setFormEmail(e.target.value)}
              required
              placeholder="Contoh: john@company.com"
              className="w-full bg-darkCard border border-gray-800 px-4 py-3 text-xs text-white placeholder-gray-600 focus:outline-none focus:border-white transition-colors"
            />
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-bold tracking-widest text-gray-400 uppercase block">{t('message')}</label>
            <textarea 
              rows={5}
              value={formMessage}
              onChange={(e) => setFormMessage(e.target.value)}
              required
              placeholder="Jelaskan kebutuhan infrastruktur jaringan atau kebutuhan deployment cloud Anda..."
              className="w-full bg-darkCard border border-gray-800 px-4 py-3 text-xs text-white placeholder-gray-600 focus:outline-none focus:border-white transition-colors resize-none"
            />
          </div>

          <button 
            type="submit"
            disabled={formSubmitting}
            className="w-full py-4 border border-gray-800 hover:border-white bg-transparent hover:bg-white hover:text-black transition-all duration-300 text-xs font-bold tracking-widest uppercase flex items-center justify-center space-x-2"
          >
            {formSubmitting ? (
              <>
                <Loader2 size={14} className="animate-spin" />
                <span>{t('transmitting')}</span>
              </>
            ) : formSuccess ? (
              <>
                <Check size={14} className="text-green-500" />
                <span>{t('received')}</span>
              </>
            ) : (
              <>
                <Send size={14} />
                <span>{t('sendInquiry')}</span>
              </>
            )}
          </button>
        </form>

        <div className="mt-8 sm:mt-12 pt-6 sm:pt-8 border-t border-gray-900 space-y-4">

          {/* WhatsApp Chat Link */}
          <a 
            href="https://wa.me/6282241228252" 
            target="_blank" 
            rel="noopener noreferrer"
            className="flex items-center space-x-3 py-3 px-4 border border-gray-800 hover:border-green-500/50 bg-darkCard/30 hover:bg-green-500/5 rounded-lg transition-all duration-300 group"
          >
            <svg className="w-5 h-5 fill-current text-green-500 flex-shrink-0" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
            <div>
              <span className="text-xs font-bold text-white block group-hover:text-green-400 transition-colors">Chat WhatsApp</span>
              <span className="text-[10px] text-gray-500 font-mono">+62 822-4122-8252</span>
            </div>
          </a>
        </div>
      </div>

      {/* ==================== RESUME OVERLAY MODAL ==================== */}
      <div 
        className={`fixed inset-0 z-50 bg-black/90 flex items-center justify-center transition-all duration-300 ${
          resumeOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
      >
        <div className="relative bg-darkBg border border-gray-850 w-full max-w-2xl max-h-[85vh] overflow-y-auto no-scrollbar p-8 md:p-12 space-y-8">
          <button 
            onClick={() => setResumeOpen(false)}
            className="absolute top-6 right-6 p-2 border border-gray-800 text-gray-400 hover:text-white hover:border-white transition-colors focus:outline-none"
          >
            <X size={16} />
          </button>

          <div className="border-b border-gray-850 pb-4">
            <h3 className="text-3xl font-extrabold tracking-tight uppercase text-white">Curriculum Vitae</h3>
            <p className="text-xs text-accentCyan font-semibold tracking-widest uppercase mt-1">Hammad Zakaria • Network & Cloud Infrastructure</p>
          </div>

          <div className="space-y-6 text-xs text-textMuted leading-relaxed">
            <div className="space-y-2">
              <h4 className="text-xs font-bold text-white uppercase tracking-widest">Executive Summary</h4>
              <p>
                Highly analytical and detail-oriented Network and Cloud Engineer. Demonstrated success designing, securing, and maintaining business-critical enterprise routing infrastructures and highly available cloud deployments. Core focus on AWS architecture, RouterOS configuration, and Cisco networking principles.
              </p>
            </div>

            <div className="space-y-2">
              <h4 className="text-xs font-bold text-white uppercase tracking-widest">Core Technical Expertise</h4>
              <div className="grid grid-cols-2 gap-2 text-[11px] font-mono text-white/80">
                <div>• Enterprise Routing & Switching (OSPF, VLANs)</div>
                <div>• Cloud Computing (AWS VPC, EC2, CloudWatch)</div>
                <div>• Network Security (Firewall filtering, RouterOS security)</div>
                <div>• System Administration (Linux/Bash basics)</div>
              </div>
            </div>

            <div className="space-y-2">
              <h4 className="text-xs font-bold text-white uppercase tracking-widest">Professional Credentials</h4>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <p className="font-semibold text-white">MTCNA & MTCRE</p>
                  <p className="text-[10px] text-gray-500">MikroTik Certified Network Associate / Routing Engineer</p>
                </div>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-gray-900 flex justify-between">
            <a 
              href="#"
              onClick={(e) => { e.preventDefault(); alert("Resume PDF download simulated."); }}
              className="px-4 py-2 bg-white text-black text-[10px] font-bold tracking-widest uppercase hover:bg-gray-200 transition-colors"
            >
              Download PDF
            </a>
            <button 
              onClick={() => setResumeOpen(false)}
              className="px-4 py-2 border border-gray-800 text-[10px] font-bold tracking-widest uppercase hover:border-white transition-colors"
            >
              Tutup
            </button>
          </div>
        </div>
      </div>

      {/* ==================== SECURED ADMIN PANEL ==================== */}
      <div 
        className={`fixed inset-0 z-50 bg-[#0c0e12] font-sans transition-all duration-500 flex flex-col md:flex-row ${
          adminMode ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
      >
        {!adminAuthorized ? (
          /* Password gate screen - separate black industrial styling */
          <div className="m-auto max-w-sm w-full p-8 border border-[#1e2530] bg-[#141820] text-center space-y-6 rounded shadow-2xl">
            <div className="flex justify-center text-accentCyan">
              <Lock size={36} />
            </div>
            <div>
              <h3 className="text-lg font-bold uppercase tracking-wider text-white">Admin Gate</h3>
              <p className="text-[9px] text-gray-500 tracking-widest mt-1">SECURED DATABASE ACCESS</p>
            </div>
            
            <form onSubmit={handleAdminVerify} className="space-y-4">
              <input 
                type="password"
                required
                value={adminPasscode}
                onChange={(e) => setAdminPasscode(e.target.value)}
                placeholder="Enter Passcode"
                className="w-full bg-[#0c0e12] border border-[#2e394b] px-4 py-2.5 text-center text-xs tracking-widest focus:outline-none focus:border-accentCyan transition-colors text-white"
              />
              {adminAuthError && (
                <p className="text-[10px] text-red-500 uppercase tracking-widest">Passcode rejected</p>
              )}
              <button 
                type="submit" 
                className="w-full py-2.5 bg-accentCyan text-black text-xs font-bold tracking-widest uppercase hover:bg-[#0284c7] transition-colors"
              >
                Authenticate
              </button>
            </form>
            <button 
              onClick={() => { setAdminMode(false); setAdminAuthError(false); window.location.hash = ''; }}
              className="text-[10px] font-mono tracking-widest text-gray-400 hover:text-white uppercase transition-colors"
            >
              Cancel Access
            </button>
          </div>
        ) : (
          /* Authorized Admin Portal Dashboard */
          <>
            <aside className="w-full md:w-64 bg-[#141820] border-b md:border-b-0 md:border-r border-[#1e2530] flex flex-col md:justify-between p-4 md:p-6">
              <div className="space-y-4 md:space-y-8">
                <div className="flex items-center justify-between md:justify-start space-x-3 pb-3 md:pb-4 border-b border-[#222a36]">
                  <div className="flex items-center space-x-3">
                    <Unlock size={18} className="text-green-500" />
                    <div>
                      <span className="text-[10px] font-bold text-gray-500 block tracking-widest">PORTAL</span>
                      <span className="text-xs font-bold uppercase tracking-wider text-white">Admin Console</span>
                    </div>
                  </div>
                  <button 
                    onClick={() => { setAdminAuthorized(false); setAdminMode(false); window.location.hash = ''; }}
                    className="md:hidden p-2 border border-[#2e394b] text-red-400 hover:text-white rounded"
                  >
                    <Lock size={14} />
                  </button>
                </div>

                <nav className="flex flex-row md:flex-col space-x-2 md:space-x-0 md:space-y-2 overflow-x-auto no-scrollbar pb-2 md:pb-0">
                  {[
                    { id: 'projects', label: 'Projects' },
                    { id: 'skills', label: 'Skills' },
                    { id: 'certificates', label: 'Certs' },
                    { id: 'education', label: 'Education' },
                    { id: 'experiences', label: 'Experiences' }
                  ].map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => { setAdminTab(tab.id); setEditingItem(null); }}
                      className={`whitespace-nowrap py-2 md:py-3 px-3 md:px-4 text-[10px] md:text-xs font-bold text-left tracking-wider uppercase rounded transition-all ${
                        adminTab === tab.id 
                          ? 'bg-accentCyan text-black' 
                          : 'text-gray-400 hover:bg-[#1a202a] hover:text-white'
                      }`}
                    >
                      {tab.label}
                    </button>
                  ))}
                </nav>
              </div>

              <button 
                onClick={() => { setAdminAuthorized(false); setAdminMode(false); window.location.hash = ''; }}
                className="hidden md:flex w-full py-3 border border-[#2e394b] text-xs font-bold text-red-400 hover:bg-[#1f1414] hover:text-white hover:border-red-500 uppercase rounded transition-colors items-center justify-center space-x-2 mt-4"
              >
                <Lock size={12} />
                <span>Lock Console</span>
              </button>
            </aside>

            <main className="flex-1 bg-[#0c0e12] overflow-y-auto flex flex-col justify-between">
              <div className="p-8 md:p-12 max-w-5xl w-full">
                {!editingItem ? (
                  <div className="space-y-6">
                    <div className="flex justify-between items-center border-b border-[#1e2530] pb-4">
                      <h4 className="text-xs font-bold tracking-widest text-gray-400 uppercase">
                        Current entries / {adminTab}
                      </h4>
                      <button 
                        onClick={initiateAdd}
                        className="px-4 py-2 bg-accentCyan text-black text-xs font-bold tracking-widest uppercase hover:bg-[#0284c7] flex items-center space-x-1 transition-colors rounded"
                      >
                        <Plus size={14} />
                        <span>Create New</span>
                      </button>
                    </div>

                    <p className="text-[9px] text-gray-500 font-mono tracking-widest">DRAG TO REORDER • {getAdminList().length} ITEMS</p>
                    <div className="grid grid-cols-1 gap-3">
                      {getAdminList().map((item, idx) => {
                        // Build label based on adminTab
                        let primary = '';
                        let secondary = '';
                        if (adminTab === 'projects') { primary = item.title_id || item.title; secondary = `${item.category_id} | ${item.category_en}`; }
                        else if (adminTab === 'skills') { primary = item.name; secondary = `Level: ${item.level}%`; }
                        else if (adminTab === 'certificates') { primary = item.title; secondary = `${item.issuer} (${item.year})`; }
                        else if (adminTab === 'education') { primary = item.institution; secondary = `${item.degree_id} / ${item.degree_en} (${item.duration})`; }
                        else if (adminTab === 'experiences') { primary = `${item.role_id} / ${item.role_en}`; secondary = `${item.company} (${item.duration})`; }

                        return (
                          <div 
                            key={item.id} 
                            draggable
                            onDragStart={() => handleDragStart(idx)}
                            onDragOver={(e) => handleDragOver(e, idx)}
                            onDrop={() => handleDrop(idx)}
                            onDragEnd={handleDragEnd}
                            className={`border bg-[#141820]/45 p-4 flex items-center justify-between hover:border-accentCyan/30 transition-all rounded cursor-grab active:cursor-grabbing select-none ${
                              dragOverIdx === idx ? 'border-accentCyan/60 bg-accentCyan/5 scale-[1.01]' : 'border-[#1e2530]'
                            } ${dragIdx === idx ? 'opacity-40' : 'opacity-100'}`}
                          >
                            <div className="flex items-center space-x-3 min-w-0">
                              <GripVertical size={14} className="text-gray-600 flex-shrink-0" />
                              <div className="min-w-0">
                                <span className="text-xs font-bold text-white uppercase block truncate">{primary}</span>
                                <span className="text-[10px] text-gray-500 block truncate">{secondary}</span>
                              </div>
                            </div>
                            <div className="flex space-x-2 flex-shrink-0">
                              <button onClick={() => setEditingItem(item)} className="p-2 border border-[#2e394b] hover:border-white text-gray-400 hover:text-white rounded">
                                <Edit2 size={12} />
                              </button>
                              <button onClick={() => handleDeleteCRUD(item.id)} className="p-2 border border-[#2e394b] hover:border-red-500 text-gray-500 hover:text-red-500 rounded">
                                <Trash2 size={12} />
                              </button>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ) : (
                  <form onSubmit={handleSaveCRUD} className="space-y-6 max-w-xl bg-[#141820] border border-[#1e2530] p-8 rounded shadow-2xl">
                    <h4 className="text-xs font-bold tracking-widest text-accentCyan uppercase">
                      {editingItem.id ? 'Modify Database Document' : 'Provision New Entry'}
                    </h4>

                    {adminTab === 'projects' && (
                      <>
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-1">
                            <label className="text-[9px] text-gray-400 uppercase tracking-widest">Project Title (ID)</label>
                            <input type="text" required value={editingItem.title_id} onChange={(e) => setEditingItem({...editingItem, title_id: e.target.value})} className="w-full bg-[#0c0e12] border border-[#2e394b] px-3 py-2 text-xs text-white focus:outline-none focus:border-accentCyan" />
                          </div>
                          <div className="space-y-1">
                            <label className="text-[9px] text-gray-400 uppercase tracking-widest">Project Title (EN)</label>
                            <input type="text" required value={editingItem.title_en} onChange={(e) => setEditingItem({...editingItem, title_en: e.target.value})} className="w-full bg-[#0c0e12] border border-[#2e394b] px-3 py-2 text-xs text-white focus:outline-none focus:border-accentCyan" />
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-1">
                            <label className="text-[9px] text-gray-400 uppercase tracking-widest">Category (ID)</label>
                            <input type="text" required value={editingItem.category_id} onChange={(e) => setEditingItem({...editingItem, category_id: e.target.value})} className="w-full bg-[#0c0e12] border border-[#2e394b] px-3 py-2 text-xs text-white focus:outline-none focus:border-accentCyan" />
                          </div>
                          <div className="space-y-1">
                            <label className="text-[9px] text-gray-400 uppercase tracking-widest">Category (EN)</label>
                            <input type="text" required value={editingItem.category_en} onChange={(e) => setEditingItem({...editingItem, category_en: e.target.value})} className="w-full bg-[#0c0e12] border border-[#2e394b] px-3 py-2 text-xs text-white focus:outline-none focus:border-accentCyan" />
                          </div>
                        </div>

                        <div className="space-y-1">
                          <label className="text-[9px] text-gray-400 uppercase tracking-widest">Description (ID)</label>
                          <textarea rows={3} required value={editingItem.description_id} onChange={(e) => setEditingItem({...editingItem, description_id: e.target.value})} className="w-full bg-[#0c0e12] border border-[#2e394b] px-3 py-2 text-xs text-white focus:outline-none focus:border-accentCyan resize-none" />
                        </div>

                        <div className="space-y-1">
                          <label className="text-[9px] text-gray-400 uppercase tracking-widest">Description (EN)</label>
                          <textarea rows={3} required value={editingItem.description_en} onChange={(e) => setEditingItem({...editingItem, description_en: e.target.value})} className="w-full bg-[#0c0e12] border border-[#2e394b] px-3 py-2 text-xs text-white focus:outline-none focus:border-accentCyan resize-none" />
                        </div>

                        <div className="space-y-1">
                          <label className="text-[9px] text-gray-400 uppercase tracking-widest">Technologies (comma separated)</label>
                          <input type="text" value={Array.isArray(editingItem.technologies) ? editingItem.technologies.join(', ') : editingItem.technologies || ''} onChange={(e) => setEditingItem({...editingItem, technologies: e.target.value})} className="w-full bg-[#0c0e12] border border-[#2e394b] px-3 py-2 text-xs text-white focus:outline-none focus:border-accentCyan" />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-1">
                            <label className="text-[9px] text-gray-400 uppercase tracking-widest">External Link</label>
                            <input type="text" value={editingItem.link} onChange={(e) => setEditingItem({...editingItem, link: e.target.value})} className="w-full bg-[#0c0e12] border border-[#2e394b] px-3 py-2 text-xs text-white focus:outline-none focus:border-accentCyan" />
                          </div>
                          <div className="space-y-1">
                            <label className="text-[9px] text-gray-400 uppercase tracking-widest">Image URL / Path</label>
                            <input type="text" value={editingItem.image} onChange={(e) => setEditingItem({...editingItem, image: e.target.value})} className="w-full bg-[#0c0e12] border border-[#2e394b] px-3 py-2 text-xs text-white focus:outline-none focus:border-accentCyan" />
                          </div>
                        </div>
                      </>
                    )}

                    {adminTab === 'skills' && (
                      <>
                        <div className="space-y-1">
                          <label className="text-[10px] text-gray-400 uppercase tracking-widest">Skill Name</label>
                          <input type="text" required value={editingItem.name} onChange={(e) => setEditingItem({...editingItem, name: e.target.value})} className="w-full bg-[#0c0e12] border border-[#2e394b] px-3 py-2 text-xs text-white focus:outline-none focus:border-accentCyan" />
                        </div>
                        <div className="space-y-1">
                          <label className="text-[10px] text-gray-400 uppercase tracking-widest">Proficiency Level (0-100%)</label>
                          <input type="number" min="0" max="100" required value={editingItem.level} onChange={(e) => setEditingItem({...editingItem, level: e.target.value})} className="w-full bg-[#0c0e12] border border-[#2e394b] px-3 py-2 text-xs text-white focus:outline-none focus:border-accentCyan" />
                        </div>
                      </>
                    )}

                    {adminTab === 'certificates' && (
                      <>
                        <div className="space-y-1">
                          <label className="text-[10px] text-gray-400 uppercase tracking-widest">Certificate Title</label>
                          <input type="text" required value={editingItem.title} onChange={(e) => setEditingItem({...editingItem, title: e.target.value})} className="w-full bg-[#0c0e12] border border-[#2e394b] px-3 py-2 text-xs text-white focus:outline-none focus:border-accentCyan" />
                        </div>
                        <div className="space-y-1">
                          <label className="text-[10px] text-gray-400 uppercase tracking-widest">Issuer Institution</label>
                          <input type="text" required value={editingItem.issuer} onChange={(e) => setEditingItem({...editingItem, issuer: e.target.value})} className="w-full bg-[#0c0e12] border border-[#2e394b] px-3 py-2 text-xs text-white focus:outline-none focus:border-accentCyan" />
                        </div>
                        <div className="space-y-1">
                          <label className="text-[10px] text-gray-400 uppercase tracking-widest">Year of Issue</label>
                          <input type="text" required value={editingItem.year} onChange={(e) => setEditingItem({...editingItem, year: e.target.value})} className="w-full bg-[#0c0e12] border border-[#2e394b] px-3 py-2 text-xs text-white focus:outline-none focus:border-accentCyan" />
                        </div>
                        <div className="space-y-1">
                          <label className="text-[10px] text-gray-400 uppercase tracking-widest">Verification Link</label>
                          <input type="text" value={editingItem.link || ''} onChange={(e) => setEditingItem({...editingItem, link: e.target.value})} className="w-full bg-[#0c0e12] border border-[#2e394b] px-3 py-2 text-xs text-white focus:outline-none focus:border-accentCyan" />
                        </div>
                      </>
                    )}

                    {adminTab === 'education' && (
                      <>
                        <div className="space-y-1">
                          <label className="text-[10px] text-gray-400 uppercase tracking-widest">School / University</label>
                          <input type="text" required value={editingItem.institution} onChange={(e) => setEditingItem({...editingItem, institution: e.target.value})} className="w-full bg-[#0c0e12] border border-[#2e394b] px-3 py-2 text-xs text-white focus:outline-none focus:border-accentCyan" />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-1">
                            <label className="text-[9px] text-gray-400 uppercase tracking-widest">Degree / Major (ID)</label>
                            <input type="text" required value={editingItem.degree_id} onChange={(e) => setEditingItem({...editingItem, degree_id: e.target.value})} className="w-full bg-[#0c0e12] border border-[#2e394b] px-3 py-2 text-xs text-white focus:outline-none focus:border-accentCyan" />
                          </div>
                          <div className="space-y-1">
                            <label className="text-[9px] text-gray-400 uppercase tracking-widest">Degree / Major (EN)</label>
                            <input type="text" required value={editingItem.degree_en} onChange={(e) => setEditingItem({...editingItem, degree_en: e.target.value})} className="w-full bg-[#0c0e12] border border-[#2e394b] px-3 py-2 text-xs text-white focus:outline-none focus:border-accentCyan" />
                          </div>
                        </div>
                        <div className="space-y-1">
                          <label className="text-[10px] text-gray-400 uppercase tracking-widest">Duration (Years)</label>
                          <input type="text" required value={editingItem.duration} onChange={(e) => setEditingItem({...editingItem, duration: e.target.value})} className="w-full bg-[#0c0e12] border border-[#2e394b] px-3 py-2 text-xs text-white focus:outline-none focus:border-accentCyan" />
                        </div>
                      </>
                    )}

                    {adminTab === 'experiences' && (
                      <>
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-1">
                            <label className="text-[9px] text-gray-400 uppercase tracking-widest">Job Role (ID)</label>
                            <input type="text" required value={editingItem.role_id} onChange={(e) => setEditingItem({...editingItem, role_id: e.target.value})} className="w-full bg-[#0c0e12] border border-[#2e394b] px-3 py-2 text-xs text-white focus:outline-none focus:border-accentCyan" />
                          </div>
                          <div className="space-y-1">
                            <label className="text-[9px] text-gray-400 uppercase tracking-widest">Job Role (EN)</label>
                            <input type="text" required value={editingItem.role_en} onChange={(e) => setEditingItem({...editingItem, role_en: e.target.value})} className="w-full bg-[#0c0e12] border border-[#2e394b] px-3 py-2 text-xs text-white focus:outline-none focus:border-accentCyan" />
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-1">
                            <label className="text-[9px] text-gray-400 uppercase tracking-widest">Company / Org</label>
                            <input type="text" required value={editingItem.company} onChange={(e) => setEditingItem({...editingItem, company: e.target.value})} className="w-full bg-[#0c0e12] border border-[#2e394b] px-3 py-2 text-xs text-white focus:outline-none focus:border-accentCyan" />
                          </div>
                          <div className="space-y-1">
                            <label className="text-[9px] text-gray-400 uppercase tracking-widest">Duration</label>
                            <input type="text" required value={editingItem.duration} onChange={(e) => setEditingItem({...editingItem, duration: e.target.value})} placeholder="e.g. 2021 - Present" className="w-full bg-[#0c0e12] border border-[#2e394b] px-3 py-2 text-xs text-white focus:outline-none focus:border-accentCyan" />
                          </div>
                        </div>

                        <div className="space-y-1">
                          <label className="text-[9px] text-gray-400 uppercase tracking-widest">Job Description (ID)</label>
                          <textarea rows={3} required value={editingItem.description_id} onChange={(e) => setEditingItem({...editingItem, description_id: e.target.value})} className="w-full bg-[#0c0e12] border border-[#2e394b] px-3 py-2 text-xs text-white focus:outline-none focus:border-accentCyan resize-none" />
                        </div>

                        <div className="space-y-1">
                          <label className="text-[9px] text-gray-400 uppercase tracking-widest">Job Description (EN)</label>
                          <textarea rows={3} required value={editingItem.description_en} onChange={(e) => setEditingItem({...editingItem, description_en: e.target.value})} className="w-full bg-[#0c0e12] border border-[#2e394b] px-3 py-2 text-xs text-white focus:outline-none focus:border-accentCyan resize-none" />
                        </div>
                      </>
                    )}

                    <div className="flex space-x-2 pt-4">
                      <button 
                        type="submit" 
                        disabled={crudSubmitting}
                        className="flex-1 py-3 bg-accentCyan text-black text-xs font-bold tracking-widest uppercase hover:bg-[#0284c7] transition-all duration-300 flex items-center justify-center space-x-2 rounded"
                      >
                        {crudSubmitting ? (
                          <>
                            <Loader2 size={12} className="animate-spin" />
                            <span>Saving Changes...</span>
                          </>
                        ) : (
                          <span>Commit to Database</span>
                        )}
                      </button>
                      <button 
                        type="button" 
                        onClick={() => setEditingItem(null)}
                        className="px-6 py-3 border border-[#2e394b] text-xs font-bold text-gray-400 hover:text-white hover:border-white transition-colors rounded"
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                )}
              </div>

              <footer className="px-12 py-6 border-t border-[#1e2530] flex justify-between items-center text-[10px] font-mono text-gray-500 bg-[#0c0e12]">
                <span>ADMIN PANEL WORKSPACE</span>
                <span>SECURED SCHEMA</span>
              </footer>
            </main>
          </>
        )}
      </div>

    </div>
  );
}
