// src/data/mockData.js

export let mockUsers = [
  { id: 1, email: 'admin@gmail.com', password: 'admin123', name: 'Admin User', role: 'admin' },
  { id: 2, email: 'user@gmail.com', password: 'user123', name: 'Regular User', role: 'user' },
  { id: 3, email: 'test@gmail.com', password: 'test123', name: 'Test User', role: 'user' }
];

//  چک می‌کند آیا ایمیل و پسورد در لیست هست یا نه
export const loginUser = (email, password) => {
  const user = mockUsers.find(u => u.email === email && u.password === password);
  return user ? user : null;
};

// : کاربر جدید را به لیست اضافه می‌کند
export const registerUser = (userData) => {
  const exists = mockUsers.some(u => u.email === userData.email);
  if (exists) {
    return { success: false, message: "این ایمیل قبلاً ثبت شده است!" };
  }

  const newUser = {
    id: mockUsers.length + 1,
    name: `${userData.firstName} ${userData.lastName}`, 
    email: userData.email,
    password: userData.password,
    phone: userData.phone,
    role: 'user'
  };

  mockUsers.push(newUser); // اضافه کردن به دیتابیس موقت
  return { success: true, user: newUser };
};


// last 30 days innovations data 


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


// recent table fake data
export const recentApplications = [
  { id: '001', title: 'Smart Solar Tracker', innovetor: 'Alhamuddin Mayatr', date: '2026-04-20', status: 'Pending' },
  { id: '002', title: 'Automated Irrigation', innovetor: 'Farid shakir', date: '2026-04-22', status: 'Approved' },
  { id: '003', title: 'Automated Irrigation', innovetor: 'Farid shakir', date: '2026-04-22', status: 'Approved' },
  { id: '004', title: 'Water Purifier Pro', innovetor: 'Sayedagha Hotak', date: '2026-04-24', status: 'Rejected' },
  { id: '005', title: 'AI Crop Analysis', innovetor: 'ahmad Khan', date: '2026-04-25', status: 'Pending' },
  { id: '006', title: 'Wind Turbine v2', innovetor: 'Abdulhaq Nikzad', date: '2026-04-26', status: 'Pending' },
  { id: '007', title: 'Smart Solar Tracker', innovetor: 'Alhamuddin Mayatr', date: '2026-04-20', status: 'Pending' },
  { id: '008', title: 'Automated Irrigation', innovetor: 'Farid shakir', date: '2026-04-22', status: 'Approved' },
  { id: '009', title: 'Water Purifier Pro', innovetor: 'Sayedagha Hotak', date: '2026-04-24', status: 'Rejected' },
  { id: '010', title: 'AI Crop Analysis', innovetor: 'ahmad Khan', date: '2026-04-25', status: 'Pending' },
  { id: '011', title: 'Wind Turbine v2', innovetor: 'Abdulhaq Nikzad', date: '2026-04-26', status: 'Pending' },
];

export const usersData = [
  { 
    id: 1, fullName: 'Sayedagha', email: 'sayedagha@example.com', role: 'Innovetor', joinDate: '2026-01-10',avatar: '' // اینجا لینک عکس واقعی یوزر از دیتابیس است
  },
  { 
    id: 2, fullName: 'FaridGul ', email: 'faridgul@example.com', role: 'Reviewer', joinDate: '2026-02-15',avatar: ''
  },
   { 
    id: 3, fullName: 'FaridGul ', email: 'faridgul@example.com', role: 'Reviewer', joinDate: '2026-02-15',avatar: ''
  },
   { 
    id: 4, fullName: 'FaridGul ', email: 'faridgul@example.com', role: 'Reviewer', joinDate: '2026-02-15',avatar: ''
  },
   { 
    id: 5, fullName: 'FaridGul ', email: 'faridgul@example.com', role: 'Reviewer', joinDate: '2026-02-15',avatar: ''
  },
   { 
    id: 6, fullName: 'FaridGul ', email: 'faridgul@example.com', role: 'Reviewer', joinDate: '2026-02-15',avatar: ''
  },
   { 
    id: 7, fullName: 'FaridGul ', email: 'faridgul@example.com', role: 'Reviewer', joinDate: '2026-02-15',avatar: ''
  },
   { 
    id: 8, fullName: 'FaridGul ', email: 'faridgul@example.com', role: 'Reviewer', joinDate: '2026-02-15',avatar: ''
  },
   { 
    id: 9, fullName: 'FaridGul ', email: 'faridgul@example.com', role: 'Reviewer', joinDate: '2026-02-15',avatar: ''
  },
   { 
    id: 10, fullName: 'FaridGul ', email: 'faridgul@example.com', role: 'Reviewer', joinDate: '2026-02-15',avatar: ''
  },
   { 
    id: 11, fullName: 'FaridGul ', email: 'faridgul@example.com', role: 'innovetor', joinDate: '2026-02-15',avatar: ''
  },
   { 
    id: 12, fullName: 'FaridGul ', email: 'faridgul@example.com', role: 'Reviewer', joinDate: '2026-02-15',avatar: ''
  },
   { 
    id: 13, fullName: 'FaridGul ', email: 'faridgul@example.com', role: 'Reviewer', joinDate: '2026-02-15',avatar: ''
  },
   { 
    id: 14, fullName: 'FaridGul ', email: 'faridgul@example.com', role: 'Reviewer', joinDate: '2026-02-15',avatar: ''
  },
   { 
    id: 15, fullName: 'FaridGul ', email: 'faridgul@example.com', role: 'Reviewer', joinDate: '2026-02-15',avatar: ''
  },
   { 
    id: 16, fullName: 'FaridGul ', email: 'faridgul@example.com', role: 'Reviewer', joinDate: '2026-02-15',avatar: ''
  },
   { 
    id: 17, fullName: 'FaridGul ', email: 'faridgul@example.com', role: 'Reviewer', joinDate: '2026-02-15',avatar: ''
  }


];
