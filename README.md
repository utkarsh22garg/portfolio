# Utkarsh Garg - Developer Portfolio

[![Deploy to GitHub Pages](https://img.shields.io/github/actions/workflow/status/utkarsh22garg/portfolio/deploy-to-pages.yaml)](https://utkarsh22garg.github.io/portfolio/)


A modern, responsive portfolio website built with React, TypeScript, and Tailwind CSS, showcasing professional experience, projects, and skills.

## 🚀 Live Demo

Visit the live portfolio: [https://utkarsh22garg.github.io/portfolio/](https://utkarsh22garg.github.io/portfolio/)

## ✨ Features

- **Modern Design**: Dark theme with green and blue accents inspired by modern UX/UI design
- **Responsive**: Fully responsive design that works on all devices
- **Interactive**: Smooth scrolling navigation and hover effects
- **Performance Optimized**: Built with Vite for fast loading times
- **Accessible**: Built with accessibility best practices
- **Dynamic Content**: All content loaded from a single configuration file

## 🛠️ Tech Stack

- **Frontend**: React 18 + TypeScript
- **Styling**: Tailwind CSS + shadcn/ui components
- **Build Tool**: Vite
- **Icons**: Lucide React
- **Deployment**: Ready for deployment on any static hosting platform

## 📁 Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── ui/             # shadcn/ui components
│   ├── About.tsx       # About section component
│   ├── Experience.tsx  # Experience timeline component
│   ├── Footer.tsx      # Footer component
│   ├── Hero.tsx        # Hero/landing section component
│   ├── Navigation.tsx  # Navigation header component
│   └── Projects.tsx    # Projects showcase component
├── data/
│   └── config.json     # Configuration file with all personal data
├── pages/
│   ├── Index.tsx       # Main portfolio page
│   └── NotFound.tsx    # 404 error page
├── hooks/              # Custom React hooks
├── lib/                # Utility functions
└── styles/
    └── index.css       # Global styles and design system
```

## ⚙️ Configuration

All personal information, experience, projects, and skills are managed through a single configuration file:

```json
// src/data/config.json
{
  "personal": {
    "name": "Your Name",
    "title": "Your Title",
    "email": "your.email@example.com",
    // ... more personal info
  },
  "experience": [
    // Your work experience
  ],
  "projects": [
    // Your projects
  ],
  "skills": {
    // Your technical skills
  }
}
```

### Customizing Your Portfolio

1. **Update Personal Information**: Edit `src/data/config.json` with your details
2. **Add Your Photo**: Replace the hero section image or use the design without photos
3. **Modify Colors**: Update the design system in `src/index.css` and `tailwind.config.ts`
4. **Add Projects**: Include your projects in the config file with GitHub links
5. **Update Skills**: List your technical skills in the appropriate categories

## 🚀 Getting Started

### Prerequisites

- Node.js (version 16 or higher)
- pnpm package manager

### Installation

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd developer-portfolio
   ```

2. **Install dependencies**
   ```bash
   pnpm install
   ```

3. **Start the development server**
   ```bash
   pnpm dev
   ```

4. **Open your browser**
   Navigate to `http://localhost:8080` to see your portfolio

### Building for Production

```bash
pnpm build
```

The built files will be in the `dist` directory, ready for deployment.

## 🎨 Design System

The portfolio uses a cohesive design system with:

- **Colors**: Dark background with green (#84ff3b) and blue (#42caff) accents
- **Typography**: Clean, modern font hierarchy
- **Spacing**: Consistent spacing using Tailwind's spacing scale
- **Components**: Reusable UI components built with shadcn/ui

### Color Palette

```css
--primary: 84 100% 59%;        /* Bright Green */
--accent: 194 100% 65%;        /* Bright Blue */
--background: 220 13% 9%;      /* Dark Background */
--foreground: 0 0% 95%;        /* Light Text */
```

## 📱 Responsive Design

The portfolio is fully responsive with breakpoints for:
- Mobile: 320px - 768px
- Tablet: 768px - 1024px
- Desktop: 1024px+

## 🔧 Available Scripts

- `pnpm dev` - Start development server
- `pnpm build` - Build for production
- `pnpm preview` - Preview production build locally
- `pnpm lint` - Run ESLint for code quality

## 🌐 Deployment

This portfolio can be deployed to various platforms:

### Vercel (Recommended)
1. Connect your GitHub repository to Vercel
2. Vercel will automatically detect it's a Vite project
3. Deploy with default settings

### Netlify
1. Connect your GitHub repository to Netlify
2. Set build command: `pnpm build`
3. Set publish directory: `dist`

### GitHub Pages
1. Build the project: `pnpm build`
2. Deploy the `dist` folder to GitHub Pages

## 🤝 Contributing

If you'd like to contribute to this portfolio template:

1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Commit your changes: `git commit -m 'Add some feature'`
4. Push to the branch: `git push origin feature-name`
5. Open a pull request

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 📞 Contact

**Utkarsh Garg**
- Email: utkarsh22garg@gmail.com
- LinkedIn: [Your LinkedIn Profile]
- GitHub: [Your GitHub Profile]

---

Built with ❤️ using React, TypeScript, and Tailwind CSS
