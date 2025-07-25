# Ozy's Personal Website

🌐 **Live Demo:** [https://jlu005807.github.io/](https://jlu005807.github.io/)

This is Ozy's personal website, customized and enhanced from the [HTML5 UP Massively](https://html5up.net/massively) template. It showcases personal projects, study notes, interests, and related resources. Feel free to visit the live site above!

## Features

### Content Features
- 💼 Personal introduction and skills showcase
- 📚 Projects and study notes display
- 🌟 Life and interests sharing sections
- 💬 Giscus-powered comment system
- 🔄 Real-time date display

### Interactive Experience
- ✨ Smooth page transition animations
- ⚡ Responsive design for all screen sizes
- 📱 Mobile-optimized layout and typography
- ⌨️ Typewriter animation effect for quotes
- 🖼️ Custom background images and quote styles

### Performance Optimization
- 🚀 Lazy loading for non-critical resources
- 📊 Resource loading indicators
- 🔍 SEO-friendly meta tags configuration
- 📦 Optimized CSS/JS file structure

## Tech Stack
- **Frontend Fundamentals**: 
  - HTML5 & CSS3 (Semantic tags, Flexbox layout)
  - Vanilla JavaScript & jQuery
  - SASS/SCSS preprocessor
  - Responsive design principles

- **UI Frameworks & Components**: 
  - [HTML5 UP Massively](https://html5up.net/massively) template
  - FontAwesome icon library
  - Custom CSS animations

- **Interactive Features**:
  - Typewriter effect (native JS implementation)
  - Smooth scrolling and page transitions
  - Image lazy loading
  - Mutation Observer API (comment system monitoring)

- **Comment System**:
  - [Giscus](https://giscus.app/) (GitHub Discussions-based)

## Local Preview

### Method 1: Direct Opening
1. Clone this repository:
   ```bash
   git clone https://github.com/jlu005807/jlu005807.github.io.git
   ```
2. Open `index.html` directly in your browser.

### Method 2: Using a Local Server (Recommended)
For a better local preview experience, consider using one of the following methods:

#### Using VSCode Live Server Extension
1. Install the [Live Server extension](https://marketplace.visualstudio.com/items?itemName=ritwickdey.LiveServer) in VSCode
2. Right-click on the `index.html` file and select "Open with Live Server"
3. Your browser will automatically open http://localhost:5500

#### Using Python's Simple HTTP Server
```bash
# Navigate to the project directory
cd path/to/jlu005807.github.io

# Python 3.x
python -m http.server 8000

# Or Python 2.x
python -m SimpleHTTPServer 8000
```
Then visit http://localhost:8000

#### Using Node.js http-server
```bash
# Install http-server globally
npm install -g http-server

# Start the server
http-server -p 8000
```
Then visit http://localhost:8000

## Site Structure
```
/
├── index.html              # Home page
├── introduction.html       # Personal introduction page
├── message.html            # Message board page
├── other.html              # Other information page
├── assets/                 # Static resources folder
│   ├── css/                # Stylesheets
│   ├── js/                 # JavaScript scripts
│   ├── sass/               # SCSS source files
│   └── webfonts/           # Font files
├── images/                 # Image resources
│   ├── home/               # Home page images
│   ├── introduction/       # Introduction page images
│   ├── message/            # Message page images
│   └── other/              # Other page images
└── README.md               # Project documentation
```

## Credits
- Template: [AJ / HTML5 UP](https://html5up.net)
- Demo images: Unsplash (not included in this repository)
- Icon library: [Font Awesome](https://fontawesome.com/)
- JS plugins: jQuery, Scrollex, Scrolly, Responsive Tools
- Comment system: [Giscus](https://giscus.app/)

## Custom Features
Beyond the basic template functionality, this website incorporates several custom enhancements:

1. **Responsive Quote Blocks**: Quote blocks with background images and typewriter effects, supporting different screen sizes
2. **Dynamic Date Display**: Real-time date display functionality
3. **Comment System Integration**: Lightweight comment system using Giscus, powered by GitHub Discussions
4. **Mobile Device Optimization**: Layout and typography specifically optimized for mobile devices
5. **Typewriter Effect**: Custom character-by-character typing animation
6. **Image Gallery Display**: Optimized card design for image gallery showcase

## Issue Solutions
This project addresses several common challenges with static websites:

1. **Card Expansion Overlay**: Solved the issue of cards being covered by the footer when expanded using z-index and positioning
2. **Comment System Boundaries**: Optimized comment system container width and overflow handling
3. **Mobile Device Adaptation**: Implemented graceful degradation for various screen sizes

## Deployment
This website is deployed on GitHub Pages and can be automatically deployed using the following method:

1. Push code to the main branch of the GitHub repository
2. GitHub Actions automatically builds and deploys to GitHub Pages
3. Visit https://jlu005807.github.io/ to view the deployed result

## License
This project is open-sourced under the [Creative Commons Attribution 3.0 License](https://html5up.net/license). Feel free to learn from and reuse it!

---

🌟 If you like this project, please ⭐Star and follow for updates!