# Ozy's Personal Website

🌐 **Live Demo:** [https://jlu005807.github.io/](https://jlu005807.github.io/)

A modern personal website showcasing projects, skills, and interests. Built with enhanced responsive design and interactive features.

## ✨ Features

- 🎨 **Interactive 3D Flip Cards** - Dual card systems for skills and personal info
- 📱 **Mobile-First Design** - Progressive responsive optimization
- 🎯 **Smart Navigation** - Anti-shake carousel with smooth transitions
- 💬 **Integrated Comments** - GitHub Discussions powered by Giscus
- ⚡ **Smart Back-to-Top** - Context-aware navigation button
- 🌗 **Theme Toggle** - Animated day/night mode switcher
- 🎵 **Music Player** - Persistent cross-page playback with touch & drag optimized controls

## �️ Tech Stack

- **Frontend**: HTML5, CSS3/SCSS, Vanilla JavaScript, jQuery
- **Template**: HTML5 UP Massively (heavily customized)
- **Icons**: FontAwesome
- **Comments**: Giscus (GitHub Discussions)

## 🚀 Quick Start

```bash
git clone https://github.com/jlu005807/jlu005807.github.io.git
cd jlu005807.github.io
```

**Option 1:** Open `index.html` directly in browser

**Option 2:** Use local server (recommended)
```bash
# Using Python
python -m http.server 8000

# Using Node.js
npx http-server -p 8000
```

Visit `http://localhost:8000`

## 📁 Structure

```
/
├── index.html                    # Home page
├── introduction.html            # About page
├── message.html                # Message board
├── other.html                  # Additional content
├── assets/
│   ├── css/                   # Stylesheets
│   ├── js/                    # JavaScript
│   └── webfonts/             # Fonts
│── images/                   # images_Assets
└── music/                   # music_Assets
```

## 🎯 Key Enhancements

- **Smart Back-to-Top**: Context-aware button that adapts to fullcard states
- **Animated Theme Toggle**: Bear-themed day/night switcher with smooth transitions  
- **Progressive Mobile**: Multi-breakpoint responsive design (1200px, 768px, 480px)
- **Anti-Shake Navigation**: Distance-based timing to prevent conflicts
- **Comment Integration**: Stable positioning with DOM mutation monitoring
- **Fixed Background**: Optimized background images for all devices including Windows 100% scaling
- **Responsive Foreground**: Adaptive foreground positioning for portrait orientation on mobile devices

## 🎵 Built-in Music Player

- Persistent playback across pages: an iframe-based player communicates with the parent page via postMessage to keep music playing during navigation.
- Playlist-friendly behavior: switching tracks from the playlist does not auto-close the list or player — you can change tracks repeatedly until you manually close the playlist.
- Touch and drag optimizations: improved mobile touch handling and smooth, requestAnimationFrame-backed dragging for progress and volume controls; sliders can be dragged freely across the page.
- Lightweight and compatible: keyboard controls and broad browser support; UI is decoupled from page content to minimize side effects.


## 🔧 Development

Built with modern web standards and progressive enhancement principles. Optimized for performance with lazy loading and efficient DOM manipulation.

### 📱 Recent Optimizations (2025-09-14)

#### Background Image Improvements
- **Fixed Background Display**: Solved background image disappearing issues on Windows 100% scaling
- **Full Screen Coverage**: Implemented CSS `background-size: cover` for complete viewport coverage
- **Parallax Effect Fix**: Prevented background image movement during scrolling with `position: fixed` and `transform: none`
- **Cross-device Compatibility**: Added media queries for different screen sizes and orientations

#### Mobile Portrait Mode Enhancements
- **Foreground Positioning**: Optimized foreground image position for portrait orientation
- **Responsive Sizing**: Implemented percentage-based sizing (200% auto) for better mobile display
- **Vertical Alignment**: Adjusted top offset (20vh) to improve vertical positioning on small screens
- **Custom Media Queries**: Added specific style adjustments for portrait orientation devices

## 📄 License

[Creative Commons Attribution 3.0](https://html5up.net/license) - Free for personal and commercial use

---

⭐ **Star this repo if you found it helpful!**