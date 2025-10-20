# 📝 Blog Platform

![Blog Platform](https://img.shields.io/badge/Blog-Platform-blue)
![Node.js](https://img.shields.io/badge/Node.js-22.16.0-green)
![MongoDB](https://img.shields.io/badge/MongoDB-8.2-orange)

A **full-stack blog platform** built with **Node.js**, **Express**, **MongoDB**, and **EJS**.  
It features **user authentication**, **CRUD operations** for blog posts, and a **responsive UI** powered by Bootstrap.

---

## 🚀 Features

### 🧑‍💻 User Authentication
- Register and login with secure password hashing (`bcryptjs`)
- Session-based authentication using `express-session`
- Authorization middleware for route protection

### ✍️ Blog Post Management
- Full CRUD functionality (Create, Read, Update, Delete)
- Rich text content support
- Author-based permissions and post timestamps

### 💡 User Experience
- Fully responsive design (Bootstrap 5 + custom CSS)
- Clean, modern, and mobile-friendly interface
- Flash messages for real-time feedback
- Pagination for post lists

### ⚙️ Technical Features
- MVC architecture for scalability
- MongoDB database with Mongoose ODM
- EJS templating engine with reusable layouts
- `.env` configuration for environment management

---

## 🛠️ Tech Stack

| Category | Technologies |
|-----------|---------------|
| **Backend** | Node.js, Express.js |
| **Database** | MongoDB (Mongoose ODM) |
| **Templating** | EJS, express-ejs-layouts |
| **Authentication** | express-session, bcryptjs |
| **Styling** | Bootstrap 5, Custom CSS |
| **Dev Tools** | Nodemon, dotenv |

---

## 📦 Installation

### **Prerequisites**
- Node.js (v14 or higher)
- MongoDB (local or Atlas)
- npm or yarn

### **Setup Instructions**

1. **Clone the repository**
   ```bash
   git clone https://github.com/Adebayo-makemoney/blog-platform.git
   cd blog-platform
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure Environment Variables**
   Create a `.env` file in the project root:
   ```env
   MONGODB_URI=mongodb://localhost:27017/blog-platform
   SESSION_SECRET=your-super-secure-secret-key-here
   PORT=3000
   NODE_ENV=development
   ```

4. **Start MongoDB**
   - **Local MongoDB**
     ```bash
     mongod --dbpath=/path/to/your/mongodb/data
     ```
   - **MongoDB Atlas (Recommended)**
     - Create an Atlas cluster
     - Copy your connection string and replace `MONGODB_URI` in `.env`

5. **Start the Application**
   ```bash
   npm run dev   # Development mode with nodemon
   npm start     # Production mode
   ```

6. **Access the App**
   Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🗂️ Project Structure

```
blog-platform/
├── app.js
├── package.json
├── .env
├── .gitignore
│
├── models/
│   ├── User.js
│   └── Post.js
│
├── controllers/
│   ├── authController.js
│   └── postController.js
│
├── routes/
│   ├── index.js
│   ├── auth.js
│   └── posts.js
│
├── middleware/
│   └── authMiddleware.js
│
├── views/
│   ├── layout.ejs
│   ├── partials/
│   │   ├── header.ejs
│   │   └── footer.ejs
│   └── pages/
│       ├── index.ejs
│       ├── login.ejs
│       ├── register.ejs
│       ├── post.ejs
│       ├── new-post.ejs
│       ├── edit-post.ejs
│       └── error.ejs
│
└── public/
    └── css/
        └── style.css
```

---

## 🔧 API Routes

### **Authentication**
| Method | Endpoint | Description |
|--------|-----------|-------------|
| GET | `/auth/register` | Show registration form |
| POST | `/auth/register` | Register new user |
| GET | `/auth/login` | Show login form |
| POST | `/auth/login` | Login user |
| POST | `/auth/logout` | Logout user |

### **Posts**
| Method | Endpoint | Description |
|--------|-----------|-------------|
| GET | `/posts` | List all posts |
| GET | `/posts/new` | Show create post form |
| POST | `/posts` | Create new post |
| GET | `/posts/:id` | View single post |
| GET | `/posts/:id/edit` | Edit post form |
| PUT | `/posts/:id` | Update post |
| DELETE | `/posts/:id` | Delete post |

---

## 👤 User Guide

### **Register a New Account**
1. Navigate to `/auth/register`
2. Enter username, email, and password
3. You’ll be logged in automatically after registration

### **Create a Blog Post**
1. Login to your account
2. Click **New Post**
3. Fill in your post title and content
4. Submit to publish

### **Manage Posts**
- Edit or delete your own posts
- View all published posts from other users

---

## 🎨 Customization

### **Styling**
Modify `public/css/style.css` to change the color theme:

```css
:root {
  --primary-color: #007bff;
  --secondary-color: #6c757d;
}
```

### **Layout**
Update `views/layout.ejs` to adjust header, footer, or layout structure.

### **Feature Extensions**
- 🗨️ Add comments (Comment model + routes)
- 🏷️ Add categories or tags
- 🖼️ Add image uploads via Multer
- 🔍 Implement search functionality

---

## 🐛 Troubleshooting

| Issue | Solution |
|--------|-----------|
| MongoDB Connection Failed | Ensure MongoDB is running and URI is correct |
| Session Not Persisting | Check `SESSION_SECRET` and session middleware |
| Static Files Not Loading | Confirm public path and correct file references |
| Auth Errors | Ensure middleware is applied properly |

---

## 🧩 Scripts

| Command | Description |
|----------|-------------|
| `npm start` | Run production server |
| `npm run dev` | Run dev server with auto-reload |
| `npm test` | Run unit tests (when available) |

---

## 🤝 Contributing

1. Fork the repository  
2. Create a feature branch (`git checkout -b feature/amazing-feature`)  
3. Commit your changes (`git commit -m 'Add amazing feature'`)  
4. Push to branch (`git push origin feature/amazing-feature`)  
5. Open a Pull Request 🎉  

---

## 📄 License
This project is licensed under the **MIT License** — see the [LICENSE](LICENSE) file for details.

---

## 🙏 Acknowledgments
- [Express.js](https://expressjs.com/)
- [MongoDB](https://www.mongodb.com/)
- [Bootstrap](https://getbootstrap.com/)
- [EJS](https://ejs.co/)

---

## 📞 Support
If you have any questions or issues, please open an issue on GitHub or contact the maintainers.

> Built with ❤️ using Node.js, Express, and MongoDB by [Adebayo](https://github.com/Adebayo-makemoney/blog-platform).

> Happy Blogging! 🎉
