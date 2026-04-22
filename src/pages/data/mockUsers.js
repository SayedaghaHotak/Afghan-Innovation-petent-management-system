// src/data/mockData.js

export let mockUsers = [
  { id: 1, email: 'admin@gmail.com', password: 'admin123', name: 'Admin User', role: 'admin' },
  { id: 2, email: 'user@gmail.com', password: 'user123', name: 'Regular User', role: 'user' },
  { id: 3, email: 'test@gmail.com', password: 'test123', name: 'Test User', role: 'user' }
];

// تابع لاگین: چک می‌کند آیا ایمیل و پسورد در لیست هست یا نه
export const loginUser = (email, password) => {
  const user = mockUsers.find(u => u.email === email && u.password === password);
  return user ? user : null;
};

// تابع ثبت‌نام: کاربر جدید را به لیست اضافه می‌کند
export const registerUser = (userData) => {
  const exists = mockUsers.some(u => u.email === userData.email);
  if (exists) {
    return { success: false, message: "این ایمیل قبلاً ثبت شده است!" };
  }

  const newUser = {
    id: mockUsers.length + 1,
    name: `${userData.firstName} ${userData.lastName}`, // ترکیب نام و تخلص
    email: userData.email,
    password: userData.password,
    phone: userData.phone,
    role: 'user'
  };

  mockUsers.push(newUser); // اضافه کردن به دیتابیس موقت
  return { success: true, user: newUser };
};