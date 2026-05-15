// --- بخش کاربران و احراز هویت (بدون تغییر) ---
export let mockUsers = [
  { id: 1, email: 'admin@gmail.com', password: 'admin123', name: 'Admin User', role: 'admin' },
  { id: 2, email: 'user@gmail.com', password: 'user123', name: 'Regular User', role: 'user' },
  { id: 3, email: 'test@gmail.com', password: 'test123', name: 'Test User', role: 'user' },
  { id: 4, email: 'farid@gmail.com', password: 'farid123', name: 'Farid Shakir', role: 'user' }

];

export const loginUser = (email, password) => {
  const user = mockUsers.find(u => u.email === email && u.password === password);
  return user ? user : null;
};

export const registerUser = (userData) => {
  const exists = mockUsers.some(u => u.email === userData.email);
  if (exists) return { success: false, message: "این ایمیل قبلاً ثبت شده است!" };

  const newUser = {
    id: mockUsers.length + 1,
    name: `${userData.firstName} ${userData.lastName}`, 
    email: userData.email,
    password: userData.password,
    phone: userData.phone,
    role: 'user'
  };
  mockUsers.push(newUser); 
  return { success: true, user: newUser };
};

// --- دیتای نمودار و درخواست‌ها (بدون تغییر) ---
export const dailyInventionData = [
  { day: '1', inventions: 2 }, { day: '2', inventions: 4 }, { day: '3', inventions: 3 },
  { day: '4', inventions: 7 }, { day: '5', inventions: 5 }, { day: '6', inventions: 9 },
  { day: '7', inventions: 6 }, { day: '8', inventions: 8 }, { day: '9', inventions: 10 },
  { day: '10', inventions: 4 }, { day: '11', inventions: 3 }, { day: '12', inventions: 6 },
  { day: '13', inventions: 9 }, { day: '14', inventions: 7 }, { day: '15', inventions: 11 },
  { day: '16', inventions: 13 }, { day: '17', inventions: 10 }, { day: '18', inventions: 8 },
  { day: '19', inventions: 5 }, { day: '20', inventions: 7 }, { day: '21', inventions: 9 },
  { day: '22', inventions: 6 }, { day: '23', inventions: 4 }, { day: '24', inventions: 8 },
  { day: '25', inventions: 12 }, { day: '26', inventions: 10 }, { day: '27', inventions: 9 },
  { day: '28', inventions: 7 }, { day: '29', inventions: 6 }, { day: '30', inventions: 9 },
];

export const recentApplications = [
  { id: '001', title: 'Smart Solar Tracker', innovetor: 'Alhamuddin Mayatr', date: '2026-04-20', status: 'Pending' },
  { id: '002', title: 'Automated Irrigation', innovetor: 'Farid shakir', date: '2026-04-22', status: 'Approved' },
  { id: '003', title: 'Automated Irrigation', innovetor: 'Farid shakir', date: '2026-04-22', status: 'Approved' },
  { id: '004', title: 'Water Purifier Pro', innovetor: 'Sayedagha Hotak', date: '2026-04-24', status: 'Rejected' },
  { id: '005', title: 'AI Crop Analysis', innovetor: 'ahmad Khan', date: '2026-04-25', status: 'Pending' },
  { id: '006', title: 'Wind Turbine v2', innovetor: 'Abdulhaq Nikzad', date: '2026-04-26', status: 'Pending' },
  { id: '007', title: 'Smart Solar Tracker', innovetor: 'Alhamuddin Mayatr', date: '2026-04-20', status: 'Pending' },
  { id: '008', title: 'Automated Irrigation', innovetor: 'Farid shakir', date: '2026-04-22', status: 'Approved' },
  { id: '009', title: 'Automated Irrigation', innovetor: 'Farid shakir', date: '2026-04-22', status: 'Approved' },
  { id: '010', title: 'Water Purifier Pro', innovetor: 'Sayedagha Hotak', date: '2026-04-24', status: 'Rejected' },
  { id: '011', title: 'AI Crop Analysis', innovetor: 'ahmad Khan', date: '2026-04-25', status: 'Pending' },
  { id: '012', title: 'Wind Turbine v2', innovetor: 'Abdulhaq Nikzad', date: '2026-04-26', status: 'Pending' },
];

export const usersData = [
  { id: 1, fullName: 'Sayedagha', email: 'sayedagha@example.com', role: 'Innovetor', joinDate: '2026-01-10', avatar: '' },
  { id: 2, fullName: 'FaridGul', email: 'faridgul@example.com', role: 'Reviewer', joinDate: '2026-02-15', avatar: '' },
  { id: 3, fullName: 'Sayedagha', email: 'sayedagha@example.com', role: 'Innovetor', joinDate: '2026-01-10', avatar: '' },
  { id: 4, fullName: 'FaridGul', email: 'faridgul@example.com', role: 'Reviewer', joinDate: '2026-02-15', avatar: '' },
  { id: 5, fullName: 'Sayedagha', email: 'sayedagha@example.com', role: 'Innovetor', joinDate: '2026-01-10', avatar: '' },
  { id: 6, fullName: 'FaridGul', email: 'faridgul@example.com', role: 'Reviewer', joinDate: '2026-02-15', avatar: '' },
  { id: 7, fullName: 'Sayedagha', email: 'sayedagha@example.com', role: 'Innovetor', joinDate: '2026-01-10', avatar: '' },
  { id: 8, fullName: 'FaridGul', email: 'faridgul@example.com', role: 'Reviewer', joinDate: '2026-02-15', avatar: '' },
  { id: 9, fullName: 'Sayedagha', email: 'sayedagha@example.com', role: 'Innovetor', joinDate: '2026-01-10', avatar: '' },
  { id: 10, fullName: 'FaridGul', email: 'faridgul@example.com', role: 'Reviewer', joinDate: '2026-02-15', avatar: '' },
  { id: 11, fullName: 'Sayedagha', email: 'sayedagha@example.com', role: 'Innovetor', joinDate: '2026-01-10', avatar: '' },
  { id: 12, fullName: 'FaridGul', email: 'faridgul@example.com', role: 'Reviewer', joinDate: '2026-02-15', avatar: '' },
  { id: 13, fullName: 'Sayedagha', email: 'sayedagha@example.com', role: 'Innovetor', joinDate: '2026-01-10', avatar: '' },
  { id: 14, fullName: 'FaridGul', email: 'faridgul@example.com', role: 'Reviewer', joinDate: '2026-02-15', avatar: '' },
  { id: 15, fullName: 'Sayedagha', email: 'sayedagha@example.com', role: 'Innovetor', joinDate: '2026-01-10', avatar: '' },
  { id: 16, fullName: 'FaridGul', email: 'faridgul@example.com', role: 'Reviewer', joinDate: '2026-02-15', avatar: '' },
  { id: 17, fullName: 'Sayedagha', email: 'sayedagha@example.com', role: 'Innovetor', joinDate: '2026-01-10', avatar: '' },
  { id: 18, fullName: 'FaridGul', email: 'faridgul@example.com', role: 'Reviewer', joinDate: '2026-02-15', avatar: '' },
  { id: 19, fullName: 'Sayedagha', email: 'sayedagha@example.com', role: 'Innovetor', joinDate: '2026-01-10', avatar: '' },
  { id: 20, fullName: 'FaridGul', email: 'faridgul@example.com', role: 'Reviewer', joinDate: '2026-02-15', avatar: '' }
];

// --- بخش کمیته‌ها (اصلاح شده برای جلوگیری از ارور) ---
export const mockCommittees = [
  { 
    id: 1, 
    name: 'Technical Review', 
    chair: 'Dr. Ahmad Wali', 
    members: [{ id: 1, name: 'Dr. Ahmad Wali' }, { id: 2, name: 'Dr. sheft' }, { id: 3, name: 'Dr. jert' }, { id: 4, name: 'Dr. Ahmad Wali' }, { id: 5, name: 'Dr. sheft' }, { id: 6, name: 'Dr. jert' }], 
    type: 'Technical',
    description: " ", 
    expertise: ['AI', 'Cloud', 'Security'] 
  },
  { 
    id: 2, 
    name: 'Medical Ethics', 
    chair: 'Prof. Mariam', 
    members: [], 
    type: 'Health', 
      description: "", 
    expertise: ['Medical', 'Bio-Ethics'] 
  },
   { 
    id: 3, 
    name: 'Agree culture', 
    chair: 'Dr. Sayedagha', 
    members: [{ id: 1, name: 'Dr. Ahmad Wali' }], 
    type: 'Technical', 
      description: " ", 
    expertise: ['AI', 'Cloud', 'Security'] 
  },
   { 
    id: 4, 
    name: 'ceval Engineering', 
    chair: 'Dr. Faysal', 
    members: [{ id: 1, name: 'Dr. Ahmad Wali' }], 
    type: 'Technical', 
      description: " ", 
    expertise: ['AI', 'Cloud', 'Security'] 
  },
   { 
    id: 5, 
    name: 'Honar ', 
    chair: 'Dr. Sahel', 
    members: [{ id: 1, name: 'Dr. Ahmad Wali' }], 
    type: 'Technical', 
      description: " ", 
    expertise: ['AI', 'Cloud', 'Security'] 
  },
  { 
    id: 6, 
    name: 'Honar ', 
    chair: 'Dr. Sahel', 
    members: [{ id: 1, name: 'Dr. Ahmad Wali' }], 
    type: 'Technical', 
      description: " ", 
    expertise: ['AI', 'Cloud', 'Security'] 
  },
  { 
    id: 7, 
    name: 'Honar ', 
    chair: 'Dr. Sahel', 
    members: [{ id: 1, name: 'Dr. Ahmad Wali' }], 
    type: 'Technical', 
      description: " ", 
    expertise: ['AI', 'Cloud', 'Security'] 
  },
  { 
    id: 8, 
    name: 'Honar ', 
    
    chair: 'Dr. Sahel', 
    members: [{ id: 1, name: 'Dr. Ahmad Wali' }], 
    type: 'Technical', 
      description: " ", 
    expertise: ['AI', 'Cloud', 'Security'] 
  },
  { 
    id: 9, 
    name: 'DaD ', 
   
    chair: 'Dr. Sahel', 
    members: [{ id: 1, name: 'Dr. Ahmad Wali' }], 
    type: 'Technical', 
      description: "", 
    expertise: ['AI', 'Cloud', 'Security'] 
  },
  { 
    id: 10, 
    name: 'SAD ', 
  
    chair: 'Dr. Sahel', 
    members: [{ id: 1, name: 'Dr. Ahmad Wali' }], 
    type: 'Technical', 
      description: " ", 
    expertise: ['AI', 'Cloud', 'Security'] 
  },{ 
    id: 11, 
    name: 'SQA', 
 
    chair: 'Dr. Sahel', 
    members: [{ id: 1, name: 'Dr. Ahmad Wali' }], 
    type: 'Technical', 
      description: " ", 
    expertise: ['AI', 'Cloud', 'Security'] 
  },{ 
    id: 12, 
    name: 'data Science ', 
   
    chair: 'Dr. Sahel', 
    members: [{ id: 1, name: 'Dr. Ahmad Wali' }], 
    type: 'Technical', 
      description: " ", 
    expertise: ['AI', 'Cloud', 'Security'] 
  }



];



export const mockInnovations = [
  {
    id: 101,
    title: "Solar Water Purifier",
    description: "An intelligent device for purifying water in remote areas that operates with solar energy and has very low maintenance costs.",
    author: "Sayedagha Hotak",
    status: "Unassigned", 
    date: "2026-05-12",
    category: "Technical"
  },
  {
    id: 102,
    title: "Health Tracking Application",
    description: "A system for monitoring the nutritional and physical health status of university students and providing health recommendations.",
    author: "Mariam Sadiq ",
    status: "Assigned", 
    committeeId: 1, 
    committeeName: "Technical Review Committee",
    date: "2026-05-10",
    category: "Health"
  },
  {
    id: 103,
    title: "Smart Librarian Robot",
    description: "This robot, utilizing artificial intelligence, can move books within library shelves and assist patrons.",
    author: "ADRIS RAHMANI",
    status: "Unassigned",
    date: "2026-05-08",
    category: "Technical"
  },
  {
    id: 104,
    title: "Solar Water Purifier",
    description: "An intelligent device for purifying water in remote areas that operates with solar energy and has very low maintenance costs.",
    author: "Sayedagha Hotak",
    status: "Unassigned", 
    date: "2026-05-12",
    category: "Technical"
  },
  {
    id: 105,
    title: "Health Tracking Application",
    description: "A system for monitoring the nutritional and physical health status of university students and providing health recommendations.",
    author: "Mariam Sadiq ",
    status: "Assigned", 
    committeeId: 1, 
    committeeName: "Technical Review Committee",
    date: "2026-05-10",
    category: "Health"
  },
  {
    id: 106,
    title: "Smart Librarian Robot",
    description: "This robot, utilizing artificial intelligence, can move books within library shelves and assist patrons.",
    author: "ADRIS RAHMANI",
    status: "Unassigned",
    date: "2026-05-08",
    category: "Technical"
  },
  {
    id: 107,
    title: "Solar Water Purifier",
    description: "An intelligent device for purifying water in remote areas that operates with solar energy and has very low maintenance costs.",
    author: "Sayedagha Hotak",
    status: "Unassigned", 
    date: "2026-05-12",
    category: "Technical"
  },
  {
    id: 108,
    title: "Health Tracking Application",
    description: "A system for monitoring the nutritional and physical health status of university students and providing health recommendations.",
    author: "Mariam Sadiq ",
    status: "Assigned", 
    committeeId: 1, 
    committeeName: "Technical Review Committee",
    date: "2026-05-10",
    category: "Health"
  },
  {
    id: 109,
    title: "Smart Librarian Robot",
    description: "This robot, utilizing artificial intelligence, can move books within library shelves and assist patrons.",
    author: "ADRIS RAHMANI",
    status: "Unassigned",
    date: "2026-05-08",
    category: "Technical"
  }
];