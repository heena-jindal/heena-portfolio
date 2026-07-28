# 🌐 Heena Jindal — Portfolio

> **A living, interactive showcase of my AI/ML and full-stack engineering work**

A dark, cinematic, single-page developer portfolio — built from scratch with vanilla HTML/CSS/JS, featuring a live neural-network canvas background, glassmorphism UI, scroll-driven project storytelling, and physics-based micro-interactions.

---

## 🌟 Live Demo

> Portfolio: https://heena-portfolio-ten.vercel.app/

---

## ✨ Features Built

### 🧠 Living Neural Network Background
- Custom canvas animation — 65 nodes, connected edges within a 155px threshold
- Mouse-repulsion physics — nodes react to cursor proximity in real time
- Fully re-renders on window resize

### 🌌 Cosmic Depth Layer
- Three slow-drifting nebula glow orbs (violet, cyan, emerald) behind all content
- Independent drift animations (22s–32s loops) for a non-repetitive, "alive" feel
- Disabled on mobile to protect performance and readability

### 🖱️ Custom Cursor System
- Dual cursor (dot + smooth-follower) with lerp-based easing
- Expands and glows on hover over interactive elements
- Auto-disabled on touch devices

### 🃏 Glassmorphism UI + Micro-interactions
- `backdrop-filter` blur cards across Projects, Achievements, and Education
- 3D tilt-on-hover for Achievement and Education cards (perspective + rotateX/Y)
- Magnetic buttons — CTAs pull toward the cursor on approach
- Persistent neon glow on all gradient section titles
- Idle pulsing glow animation on primary CTA buttons

### 📊 Animated Data Visualization
- Count-up number animations (CGPA, LeetCode solved) triggered on scroll via `IntersectionObserver`
- Animated proficiency bars for language/skill breakdown
- SVG donut chart for LeetCode difficulty distribution

### 🗂️ Scroll-Driven Project Showcase
- "Sticky stack" scroll effect — project cards scale and fade as the next one arrives
- Auto-playing project screenshot sliders per project

### ♿ Accessibility & Performance
- Full `prefers-reduced-motion` support — disables decorative animation for users who need it
- Responsive breakpoints at 1100px / 900px / 768px / 480px
- Lightweight preloader (~700ms), no heavy dependencies beyond Lucide icons

---

## 🛠️ Tech Stack

### Frontend
| Technology | Purpose |
|---|---|
| HTML5 | Semantic structure, 8 sections |
| CSS3 (custom, no framework) | Theming via CSS variables, glassmorphism, animations |
| Vanilla JavaScript | Canvas rendering, IntersectionObservers, DOM interactions |
| Lucide Icons | Iconography |

### Deployment
| Technology | Purpose |
|---|---|
| Vercel | Static hosting + CDN |
| GitHub | Source control, CI trigger for Vercel |

---

## 🏗️ Project Structure

```
heena-portfolio/
├── index.html                   # All 8 sections: Name, Hero, About,
│                                 # Projects, Skills, Education,
│                                 # Achievements, Contact
├── style.css                    # Theming, glassmorphism, animations,
│                                 # responsive breakpoints
├── script.js                    # Canvas engine, cursor, scroll
│                                 # observers, micro-interactions
├── metroverse_screenshot/       # MetroVerse project images
├── vibeverse_screenshot/        # VibeVerse project images
└── Heena_Jindal_Resume.pdf      # Downloadable resume
```

---

## 🚀 Local Setup

This is a static site — no build step, no dependencies to install.

```bash
git clone https://github.com/heena-jindal/heena-portfolio.git
cd heena-portfolio
# open index.html directly, or serve it:
npx serve .
```

---

## 📄 Sections

| Section | Content |
|---|---|
| Name Intro | Animated name reveal, click-to-scroll |
| Hero | Role typing animation, CTA buttons |
| About | Bio, current focus, learning goals |
| Projects | 5 featured projects with live demos + repos |
| Skills | Languages, frameworks, tools |
| Education | Semester-by-semester academic roadmap |
| Achievements | Certifications, hackathons, leadership |
| Contact | Email, socials, direct contact form |

---

## 🔜 Roadmap

- [ ] Blog / "Currently Building" section for in-progress GenAI work
- [ ] Dark/Light theme toggle
- [ ] Custom domain (heenajindal.dev or similar)
- [ ] Open Graph banner image (currently reusing a project screenshot)
- [ ] Lighthouse performance audit + optimization pass

---

## 👩‍💻 Author

**Heena Jindal**
B.Tech AI/ML Student | Delhi
Building AI-powered products with Python, Flask, Next.js and ML

[![GitHub](https://img.shields.io/badge/GitHub-heena--jindal-black?logo=github)](https://github.com/heena-jindal)
[![LinkedIn](https://img.shields.io/badge/LinkedIn-Heena_Jindal-blue?logo=linkedin)](https://www.linkedin.com/in/heena-jindal-46581231a)
