# Todo Management Application

A modern, feature-rich Todo management application built with React, TypeScript, and Tailwind CSS. This application provides a comprehensive task management solution with advanced filtering, sorting, and CRUD operations.

## 🚀 Features

### Core Functionality
- **Create Tasks**: Add new tasks with title, description, and completion status
- **Read Tasks**: View all tasks in a responsive table format
- **Update Tasks**: Edit existing tasks and toggle completion status
- **Delete Tasks**: Remove tasks with confirmation
- **Bulk Operations**: Select and manage multiple tasks

### Advanced Features
- **Real-time Filtering**: Search tasks by title, description, or status
- **Sorting**: Sort tasks by any column (ID, Title, Status)
- **Column Visibility**: Show/hide table columns as needed
- **Pagination**: Navigate through large task lists efficiently
- **Responsive Design**: Works seamlessly on desktop and mobile devices

### UI/UX Features
- **Modern Interface**: Clean, intuitive design with Tailwind CSS
- **Dark/Light Mode Support**: Built-in theme switching
- **Loading States**: Visual feedback during API operations
- **Error Handling**: Graceful error handling with user feedback
- **Accessibility**: WCAG compliant with proper ARIA labels

## 🛠️ Tech Stack

### Frontend
- **React 18** - Modern React with hooks and functional components
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first CSS framework
- **TanStack Table** - Powerful table component with sorting/filtering
- **Lucide React** - Beautiful, customizable icons
- **Vite** - Fast build tool and development server

### UI Components
- **Shadcn/ui** - High-quality, accessible component library
- **Custom Components** - Tailored components for specific use cases
- **Form Handling** - Robust form validation and submission

### API Integration
- **OpenAPI/Swagger** - Auto-generated TypeScript client
- **RESTful API** - Standard HTTP operations
- **Error Handling** - Comprehensive error management

## 📦 Installation

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn package manager

### Setup Instructions

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd stich-worker-frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   ```

3. **Start the development server**
   ```bash
   npm run dev
   # or
   yarn dev
   ```

4. **Open your browser**
   Navigate to `http://localhost:5173` to view the application

## 🏗️ Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── ui/             # Shadcn/ui components
│   ├── Sidebar.tsx     # Navigation sidebar
│   └── ...
├── modules/            # Feature modules
│   ├── todo/           # Todo feature
│   │   ├── components/ # Todo-specific components
│   │   ├── hooks/      # Custom hooks
│   │   └── config.ts   # Configuration
│   └── author/         # Author feature
├── pages/              # Page components
│   ├── Todo.tsx        # Main todo page
│   └── Author.tsx      # Author management page
├── client/             # Auto-generated API client
├── types/              # TypeScript type definitions
├── hooks/              # Global custom hooks
├── lib/                # Utility functions
└── config/             # Application configuration
```

## 🎯 Usage

### Managing Tasks

1. **Adding a New Task**
   - Click the "Add Task" button in the top-right corner
   - Fill in the task title (required)
   - Optionally add a description
   - Choose completion status
   - Click "Create Task"

2. **Editing a Task**
   - Click the three-dot menu (⋮) next to any task
   - Select "Edit Task"
   - Modify the task details
   - Click "Update Task"

3. **Deleting a Task**
   - Click the three-dot menu (⋮) next to any task
   - Select "Delete Task"
   - Confirm the deletion

4. **Filtering and Sorting**
   - Use the search box to filter tasks by title
   - Click column headers to sort by that column
   - Use the "Columns" dropdown to show/hide columns

### Navigation
- Use the sidebar to navigate between different sections
- The current page is highlighted in the navigation

## 🔧 Configuration

### Environment Variables
Create a `.env` file in the root directory:

```env
VITE_API_BASE_URL=http://localhost:8000
VITE_APP_TITLE=Todo Management
```

### API Configuration
The application uses an auto-generated API client based on OpenAPI specifications. Update the `openapi.json` file to match your backend API.

## 🧪 Development

### Available Scripts

```bash
# Development
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build

# Code Quality
npm run lint         # Run ESLint
npm run type-check   # Run TypeScript type checking

# Testing
npm run test         # Run tests
npm run test:watch   # Run tests in watch mode
```

### Code Style
- **ESLint** - JavaScript/TypeScript linting
- **Prettier** - Code formatting
- **TypeScript** - Strict type checking

## 🚀 Deployment

### Build for Production
```bash
npm run build
```

The built files will be in the `dist/` directory, ready for deployment to any static hosting service.

### Deployment Options
- **Vercel** - Zero-config deployment
- **Netlify** - Drag and drop deployment
- **GitHub Pages** - Free hosting for public repositories
- **AWS S3** - Scalable cloud hosting

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Guidelines
- Follow the existing code style
- Add TypeScript types for new features
- Include proper error handling
- Write meaningful commit messages
- Test your changes thoroughly

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

If you encounter any issues or have questions:

1. Check the [Issues](https://github.com/your-repo/issues) page
2. Create a new issue with detailed information
3. Include steps to reproduce the problem
4. Provide error messages and screenshots if applicable

## 🔄 Changelog

### Version 1.0.0
- Initial release
- Complete CRUD operations for tasks
- Advanced filtering and sorting
- Responsive design
- TypeScript support
- Modern UI with Tailwind CSS

---

**Built with ❤️ using React, TypeScript, and Tailwind CSS**
