import { initializeApp, getApps } from 'firebase/app';
import { 
  getFirestore, 
  collection, 
  getDocs, 
  addDoc, 
  setDoc,
  doc, 
  deleteDoc, 
  serverTimestamp 
} from 'firebase/firestore';

// Standard Firebase config using Vite environment variables
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID
};

// Check if firebase variables are set
const isFirebaseConfigured = 
  import.meta.env.VITE_FIREBASE_API_KEY && 
  import.meta.env.VITE_FIREBASE_PROJECT_ID;

let app = null;
let db = null;

if (isFirebaseConfigured) {
  try {
    if (getApps().length === 0) {
      app = initializeApp(firebaseConfig);
    } else {
      app = getApps()[0];
    }
    db = getFirestore(app);
    console.log("Firebase Firestore successfully initialized!");
  } catch (error) {
    console.error("Error initializing Firebase:", error);
  }
} else {
  console.warn(
    "Firebase environment variables not set. Running in demo mode with static local data. " +
    "Create a .env file to configure Firebase."
  );
}

// Fallback dummy data based on user revisions (Bilingual)
const fallbackSkills = [
  { id: 'skill-1', name: 'Mikrotik', level: 80 },
  { id: 'skill-2', name: 'Cisco', level: 75 },
  { id: 'skill-3', name: 'AWS Cloud', level: 40 }
];

const fallbackCertificates = [
  { id: 'cert-1', title: 'MTCNA — MikroTik Certified Network Associate', issuer: 'MikroTik', year: '2023', link: '#' },
  { id: 'cert-2', title: 'MTCRE — MikroTik Certified Routing Engineer', issuer: 'MikroTik', year: '2024', link: '#' }
];

const fallbackEducation = [
  { 
    id: 'edu-1', 
    institution: 'SMK IDN Boarding School Solo', 
    degree_id: 'Teknik Komputer dan Jaringan (TKJ)', 
    degree_en: 'Computer and Network Engineering (TKJ)',
    duration: '2024 - Sekarang' 
  }
];

const fallbackExperiences = [
  {
    id: 'exp-1',
    role_id: 'IT & Network Support — Magang',
    role_en: 'IT & Network Support — Internship',
    company: 'CV. Faham Medika (Emhacare)',
    duration: '2026 - Now',
    description_id: '• Mengkonfigurasi perangkat MikroTik untuk pembagian bandwith dan hotspot login.\n• Menambahkan Access Point untuk area kantor yang tidak terjangkau internet.\n• Melakukan perbaikan dan update website perusahaan menggunakan Wordpress.',
    description_en: '• Configured MikroTik devices for bandwidth distribution and hotspot login.\n• Added Access Points for office areas with no internet coverage.\n• Performed maintenance and updates for the company website using WordPress.'
  },
  {
    id: 'exp-2',
    role_id: 'Uji Kompetensi — Network Infrastructure Project',
    role_en: 'Competency Test — Network Infrastructure Project',
    company: 'SMK IDN Boarding School Solo',
    duration: '2026',
    description_id: '• Mengkonfigurasi infrastruktur jaringan menggunakan perangkat fisik MikroTik dan Cisco.\n• Menerapkan teknologi VLAN, EtherChannel, OSPF, GRE Tunnel, DHCP, dan NAT.\n• Melakukan troubleshooting dan analisis konektivitas antar jaringan.',
    description_en: '• Configured network infrastructure using physical MikroTik and Cisco devices.\n• Implemented VLAN, EtherChannel, OSPF, GRE Tunnel, DHCP, and NAT technologies.\n• Performed troubleshooting and network connectivity analysis.'
  },
  {
    id: 'exp-3',
    role_id: 'Networking Competition Participant',
    role_en: 'Networking Competition Participant',
    company: 'SMK IDN Boarding School Solo',
    duration: '2025',
    description_id: '• ATSWA NESA Jombang — Kompetisi bidang Subnetting & Network Administration (MikroTik).\n• Techtopia Online Competition — Kompetisi simulasi jaringan Cisco Packet Tracer.',
    description_en: '• ATSWA NESA Jombang — Subnetting & Network Administration Competition (MikroTik).\n• Techtopia Online Competition — Cisco Packet Tracer network simulation competition.'
  },
  {
    id: 'exp-4',
    role_id: 'IT Trainer — IDN Mengajar',
    role_en: 'IT Trainer — IDN Teaching Program',
    company: 'SMK IDN Boarding School Solo',
    duration: '2025',
    description_id: '• Mengajarkan konsep subnetting dan network fundamental pada kegiatan IT Camp IDN Solo.\n• Menyampaikan materi pengenalan dasar teknologi Artificial Intelligence di SMAN 1 Nawangan.',
    description_en: '• Taught subnetting concepts and network fundamentals at the IDN Solo IT Camp.\n• Delivered introductory material on basic Artificial Intelligence technology at SMAN 1 Nawangan.'
  }
];

const fallbackProjects = [
  {
    id: 'proj-1',
    title_id: "Konfigurasi OSPF Cisco",
    title_en: "Cisco OSPF Configuration",
    category_id: "Routing Jaringan",
    category_en: "Network Routing",
    description_id: "Implementasi routing dinamis menggunakan protokol OSPF pada multi-area enterprise network untuk menjamin redundansi dan skalabilitas infrastruktur. Dilakukan konfigurasi area border router (ABR) dan redistribution static route.",
    description_en: "Dynamic routing implementation using OSPF on multi-area enterprise networks to ensure redundancy and infrastructure scalability. Configured Area Border Routers (ABR) and static route redistribution.",
    technologies: ["Cisco IOS", "OSPF", "Packet Tracer"],
    link: "#",
    image: "/workstation_bg.png"
  },
  {
    id: 'proj-2',
    title_id: "Hardening Firewall Mikrotik",
    title_en: "MikroTik Firewall Hardening",
    category_id: "Keamanan Jaringan",
    category_en: "Network Security",
    description_id: "Penerapan sistem keamanan perimeter tingkat tinggi pada RouterBoard Mikrotik, mencakup perlindungan brute-force, address-list blocking, filter rules ketat, dan logging sensor aktif.",
    description_en: "Implementation of high-level perimeter security systems on MikroTik RouterBoards, covering brute-force protection, address-list blocking, strict filter rules, and active logging sensors.",
    technologies: ["RouterOS", "Firewall Filter", "NAT", "IPS"],
    link: "#",
    image: "/workstation_bg.png"
  },
  {
    id: 'proj-3',
    title_id: "VPC Deployment AWS",
    title_en: "AWS VPC Deployment",
    category_id: "Infrastruktur Cloud",
    category_en: "Cloud Infrastructure",
    description_id: "Deployment Virtual Private Cloud (VPC) multi-AZ di AWS dengan arsitektur public/private subnets, NAT Gateway, security groups, routing table, dan network access control lists (NACL).",
    description_en: "Deployment of Multi-AZ Virtual Private Cloud (VPC) on AWS with public/private subnets, NAT Gateways, security groups, routing tables, and Network Access Control Lists (NACL).",
    technologies: ["AWS VPC", "EC2", "RDS", "CloudWatch"],
    link: "#",
    image: "/workstation_bg.png"
  }
];

const fallbackSettings = {
  id: 'settings',
  cvLink: 'https://drive.google.com/file/d/1qVASHsaqqgG81hb0iNCeZhLojU97mNtk/view?usp=sharing',
  headline_id: 'Network Engineer & Cloud Specialist',
  headline_en: 'Network Engineer & Cloud Specialist',
  about_id: 'Junior Network Engineer dengan sertifikasi MTCNA dan MTCRE. Terbiasa mengkonfigurasi jaringan menggunakan MikroTik dan Cisco dalam pembelajaran serta uji kompetensi. Saat ini sedang menjalani magang di CV. Faham Medika (Emhacare) untuk posisi IT & Network Support. Memiliki ketertarikan pada teknologi AI dan otomatisasi.',
  about_en: 'Junior Network Engineer with MTCNA and MTCRE certifications. Experienced in configuring networks using MikroTik and Cisco in learning and competency tests. Currently interning at CV. Faham Medika (Emhacare) as IT & Network Support. Interested in AI technology and automation.',
  linkedin: 'https://linkedin.com/in/hammad-zakaria',
  website: 'https://hammadzakaria.vercel.app',
  github: 'https://github.com/hammadzakaria',
  youtube: 'https://www.youtube.com/@hammadzakaria',
  homeImage: '/workstation_bg.png',
  aboutImage: '/workstation_bg.png'
};

// Helper to get local storage if configured or return defaults
const getLocalData = (key, defaults) => {
  const stored = localStorage.getItem(`hz_portfolio_v2_${key}`);
  if (stored) {
    try { return JSON.parse(stored); } catch (e) { return defaults; }
  }
  return defaults;
};

const setLocalData = (key, data) => {
  localStorage.setItem(`hz_portfolio_v2_${key}`, JSON.stringify(data));
};

// Data loading functions
export async function getSkills() {
  if (!db) return getLocalData('skills', fallbackSkills);
  try {
    const querySnapshot = await getDocs(collection(db, "skills"));
    if (querySnapshot.empty) return fallbackSkills;
    const skillsList = [];
    querySnapshot.forEach((doc) => {
      skillsList.push({ id: doc.id, ...doc.data() });
    });
    return skillsList;
  } catch (e) {
    console.error("Error reading skills collection: ", e);
    return fallbackSkills;
  }
}

export async function getCertificates() {
  if (!db) return getLocalData('certificates', fallbackCertificates);
  try {
    const querySnapshot = await getDocs(collection(db, "certificates"));
    if (querySnapshot.empty) return fallbackCertificates;
    const certsList = [];
    querySnapshot.forEach((doc) => {
      certsList.push({ id: doc.id, ...doc.data() });
    });
    return certsList;
  } catch (e) {
    console.error("Error reading certificates collection: ", e);
    return fallbackCertificates;
  }
}

export async function getEducation() {
  if (!db) return getLocalData('education', fallbackEducation);
  try {
    const querySnapshot = await getDocs(collection(db, "education"));
    if (querySnapshot.empty) return fallbackEducation;
    const eduList = [];
    querySnapshot.forEach((doc) => {
      eduList.push({ id: doc.id, ...doc.data() });
    });
    return eduList;
  } catch (e) {
    console.error("Error reading education collection: ", e);
    return fallbackEducation;
  }
}

export async function getExperiences() {
  if (!db) return getLocalData('experiences', fallbackExperiences);
  try {
    const querySnapshot = await getDocs(collection(db, "experiences"));
    if (querySnapshot.empty) return fallbackExperiences;
    const expList = [];
    querySnapshot.forEach((doc) => {
      expList.push({ id: doc.id, ...doc.data() });
    });
    return expList;
  } catch (e) {
    console.error("Error reading experiences collection: ", e);
    return fallbackExperiences;
  }
}

export async function getProjects() {
  if (!db) return getLocalData('projects', fallbackProjects);
  try {
    const querySnapshot = await getDocs(collection(db, "projects"));
    if (querySnapshot.empty) return fallbackProjects;
    const projectsList = [];
    querySnapshot.forEach((doc) => {
      projectsList.push({ id: doc.id, ...doc.data() });
    });
    return projectsList;
  } catch (e) {
    console.error("Error reading projects collection: ", e);
    return fallbackProjects;
  }
}

export async function getSettings() {
  if (!db) return getLocalData('settings', fallbackSettings);
  try {
    const docSnap = await getDocs(collection(db, "settings"));
    if (docSnap.empty) return fallbackSettings;
    return { id: docSnap.docs[0].id, ...docSnap.docs[0].data() };
  } catch (e) {
    console.error("Error reading settings: ", e);
    return fallbackSettings;
  }
}

// Save/Update helper functions
export async function saveSkill(skill) {
  if (!db) {
    const current = getLocalData('skills', fallbackSkills);
    let updated;
    if (skill.id) {
      updated = current.map(item => item.id === skill.id ? skill : item);
    } else {
      const newSkill = { ...skill, id: `skill-${Date.now()}` };
      updated = [...current, newSkill];
    }
    setLocalData('skills', updated);
    return { success: true, mode: 'local' };
  }

  try {
    if (skill.id) {
      const { id, ...data } = skill;
      await setDoc(doc(db, "skills", id), data);
    } else {
      await addDoc(collection(db, "skills"), skill);
    }
    return { success: true, mode: 'firestore' };
  } catch (e) {
    console.error("Error saving skill:", e);
    throw e;
  }
}

export async function deleteSkill(id) {
  if (!db) {
    const current = getLocalData('skills', fallbackSkills);
    const updated = current.filter(item => item.id !== id);
    setLocalData('skills', updated);
    return { success: true };
  }

  try {
    await deleteDoc(doc(db, "skills", id));
    return { success: true };
  } catch (e) {
    console.error("Error deleting skill:", e);
    throw e;
  }
}

export async function saveCertificate(cert) {
  if (!db) {
    const current = getLocalData('certificates', fallbackCertificates);
    let updated;
    if (cert.id) {
      updated = current.map(item => item.id === cert.id ? cert : item);
    } else {
      const newCert = { ...cert, id: `cert-${Date.now()}` };
      updated = [...current, newCert];
    }
    setLocalData('certificates', updated);
    return { success: true, mode: 'local' };
  }

  try {
    if (cert.id) {
      const { id, ...data } = cert;
      await setDoc(doc(db, "certificates", id), data);
    } else {
      await addDoc(collection(db, "certificates"), cert);
    }
    return { success: true, mode: 'firestore' };
  } catch (e) {
    console.error("Error saving certificate:", e);
    throw e;
  }
}

export async function deleteCertificate(id) {
  if (!db) {
    const current = getLocalData('certificates', fallbackCertificates);
    const updated = current.filter(item => item.id !== id);
    setLocalData('certificates', updated);
    return { success: true };
  }

  try {
    await deleteDoc(doc(db, "certificates", id));
    return { success: true };
  } catch (e) {
    console.error("Error deleting certificate:", e);
    throw e;
  }
}

export async function saveEducation(edu) {
  if (!db) {
    const current = getLocalData('education', fallbackEducation);
    let updated;
    if (edu.id) {
      updated = current.map(item => item.id === edu.id ? edu : item);
    } else {
      const newEdu = { ...edu, id: `edu-${Date.now()}` };
      updated = [...current, newEdu];
    }
    setLocalData('education', updated);
    return { success: true, mode: 'local' };
  }

  try {
    if (edu.id) {
      const { id, ...data } = edu;
      await setDoc(doc(db, "education", id), data);
    } else {
      await addDoc(collection(db, "education"), edu);
    }
    return { success: true, mode: 'firestore' };
  } catch (e) {
    console.error("Error saving education:", e);
    throw e;
  }
}

export async function deleteEducation(id) {
  if (!db) {
    const current = getLocalData('education', fallbackEducation);
    const updated = current.filter(item => item.id !== id);
    setLocalData('education', updated);
    return { success: true };
  }

  try {
    await deleteDoc(doc(db, "education", id));
    return { success: true };
  } catch (e) {
    console.error("Error deleting education:", e);
    throw e;
  }
}

export async function saveExperience(exp) {
  if (!db) {
    const current = getLocalData('experiences', fallbackExperiences);
    let updated;
    if (exp.id) {
      updated = current.map(item => item.id === exp.id ? exp : item);
    } else {
      const newExp = { ...exp, id: `exp-${Date.now()}` };
      updated = [...current, newExp];
    }
    setLocalData('experiences', updated);
    return { success: true, mode: 'local' };
  }

  try {
    if (exp.id) {
      const { id, ...data } = exp;
      await setDoc(doc(db, "experiences", id), data);
    } else {
      await addDoc(collection(db, "experiences"), exp);
    }
    return { success: true, mode: 'firestore' };
  } catch (e) {
    console.error("Error saving experience:", e);
    throw e;
  }
}

export async function deleteExperience(id) {
  if (!db) {
    const current = getLocalData('experiences', fallbackExperiences);
    const updated = current.filter(item => item.id !== id);
    setLocalData('experiences', updated);
    return { success: true };
  }

  try {
    await deleteDoc(doc(db, "experiences", id));
    return { success: true };
  } catch (e) {
    console.error("Error deleting experience:", e);
    throw e;
  }
}

export async function saveProject(project) {
  if (!db) {
    const current = getLocalData('projects', fallbackProjects);
    let updated;
    if (project.id) {
      updated = current.map(item => item.id === project.id ? project : item);
    } else {
      const newProj = { ...project, id: `proj-${Date.now()}` };
      updated = [...current, newProj];
    }
    setLocalData('projects', updated);
    return { success: true, mode: 'local' };
  }

  try {
    if (project.id) {
      const { id, ...data } = project;
      await setDoc(doc(db, "projects", id), data);
    } else {
      await addDoc(collection(db, "projects"), project);
    }
    return { success: true, mode: 'firestore' };
  } catch (e) {
    console.error("Error saving project:", e);
    throw e;
  }
}

export async function deleteProject(id) {
  if (!db) {
    const current = getLocalData('projects', fallbackProjects);
    const updated = current.filter(item => item.id !== id);
    setLocalData('projects', updated);
    return { success: true };
  }

  try {
    await deleteDoc(doc(db, "projects", id));
    return { success: true };
  } catch (e) {
    console.error("Error deleting project:", e);
    throw e;
  }
}

export async function saveInquiry(name, email, message) {
  if (!db) {
    console.log("Saving inquiry locally:", { name, email, message });
    await new Promise(resolve => setTimeout(resolve, 800));
    return { success: true, mode: 'demo' };
  }
  try {
    const docRef = await addDoc(collection(db, "inquiries"), {
      name,
      email,
      message,
      createdAt: serverTimestamp()
    });
    return { success: true, mode: 'firestore', id: docRef.id };
  } catch (e) {
    console.error("Error adding document: ", e);
    throw e;
  }
}

export async function saveSettings(settings) {
  if (!db) {
    setLocalData('settings', settings);
    return { success: true, mode: 'local' };
  }

  try {
    if (settings.id && settings.id !== 'settings') {
      const { id, ...data } = settings;
      await setDoc(doc(db, "settings", id), data);
    } else {
      // Use 'global' as fixed document ID for settings
      await setDoc(doc(db, "settings", "global"), settings);
    }
    return { success: true, mode: 'firestore' };
  } catch (e) {
    console.error("Error saving settings:", e);
    throw e;
  }
}

export { db };
