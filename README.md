# Ozy's Personal Website

🌐 **Live Demo:** [https://jlu005807.github.io/](https://jlu005807.github.io/)

This is Ozy's personal website, customized and enhanced from the [HTML5 UP Massively](https://html5up.net/massively) template. It showcases personal projects, study notes, interests, and related resources. Feel free to visit the live site above!

## Features
- Interactive 3D flip cards
- Anti-shake carousel navigation
- Mobile-first responsive design
- Blockquote overlays with typewriter effect
- Giscus comment integration with scroll protection
- Lazy loading and performance optimizations
- SEO-friendly meta tags and structured data

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
  - Anti-shake carousel navigation system
  - 3D flip card animations with CSS transforms
  - Progressive mobile optimization with clamp() functions
  - Distance-based timing delays for navigation

- **Comment System**:
  - [Giscus](https://giscus.app/) (GitHub Discussions-based)
  - Anti-scroll protection and DOM mutation monitoring
  - Stable page positioning prevention system

## Latest Enhancements (2025)

### 🚀 Interactive Flip Card System
- **Dual Flip Card Implementation**: 
  - `Pure_CSS_Flip_Card.css` for technical skills with Roboto Mono typography
  - `Fancy_3D_flip_card.css` for personal information with advanced visual effects
- **Progressive Mobile Optimization**: Multi-breakpoint responsive design (1200px, 768px, 480px)
- **Visual Enhancement**: Text shadow optimization and clean frame removal

### ⚡ Enhanced Navigation Experience  
- **Anti-Shake Carousel System**: Distance-based timing delays prevent navigation conflicts
- **Smart Jump Prevention**: Advanced algorithm to avoid rapid animation interruptions
- **Search Integration**: Automatic clearing functionality for seamless user experience

### 📱 Advanced Mobile Responsiveness
- **Comprehensive Scaling**: clamp() functions for consistent cross-device proportions  
- **Touch Optimization**: Enhanced interactions specifically designed for mobile users
- **Performance-First**: Mobile-first design approach with desktop progressive enhancement

### 🎯 Content & UX Improvements
- **Simplified Content Structure**: Streamlined information for better readability
- **Blockquote Overlay System**: Transparent text overlays with background image integration
- **Cross-Page Navigation**: Consistent footer navigation with proper anchor linking

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
│   │   ├── main.css        # Main stylesheet
│   │   ├── Pure_CSS_Flip_Card.css    # Technical skills flip cards
│   │   ├── Fancy_3D_flip_card.css    # Personal info flip cards
│   │   ├── expanding-cards.css       # Gallery card animations
│   │   ├── message-comments.css      # Comment system styling
│   │   └── ...             # Other stylesheets
│   ├── js/                 # JavaScript scripts
│   │   ├── main.js         # Enhanced navigation with anti-shake
│   │   ├── expanding-cards.js        # Card interaction logic
│   │   ├── datetime.js     # Real-time date display
│   │   └── ...             # Other scripts
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

1. **Interactive Flip Card System**: 
   - **Pure_CSS_Flip_Card.css**: Technical skills showcase with 3D flip animations
   - **Fancy_3D_flip_card.css**: Personal information display with advanced visual effects
   - Mobile-responsive sizing with progressive breakpoints (1200px, 768px, 480px)
   - Text shadow optimization and frame removal for clean aesthetics

2. **Enhanced Navigation System**:
   - Anti-shake carousel navigation with distance-based timing delays
   - Smart jump prevention to avoid rapid navigation conflicts
   - Search integration with automatic clearing functionality
   - Anchor link optimization to prevent page jumping issues

3. **Advanced Mobile Optimization**:
   - Comprehensive responsive design using clamp() functions
   - Progressive size scaling across multiple device breakpoints
   - Touch-optimized interactions and visual feedback
   - Mobile-first design approach with desktop enhancement

4. **Text Overlay and Typography**:
   - Blockquote-based image overlay system with transparency effects
   - Custom text shadow effects for improved readability
   - Roboto Mono font integration for technical content
   - Responsive font scaling for consistent cross-device experience

5. **Responsive Quote Blocks**: Quote blocks with background images and typewriter effects, supporting different screen sizes

6. **Dynamic Date Display**: Real-time date display functionality

7. **Comment System Integration**: 
   - Lightweight comment system using Giscus, powered by GitHub Discussions
   - Anti-scroll protection to prevent Giscus from jumping to page bottom
   - DOM mutation monitoring for stable page positioning

8. **Content Management**:
   - Simplified and streamlined content for better readability
   - Interactive cards replacing traditional static lists
   - Local image asset optimization and management

9. **Cross-Page Navigation**:
   - Consistent navigation footer across all pages
   - Proper anchor linking with scroll-to-top functionality
   - Session state management for smooth transitions

## Issue Solutions
This project addresses several common challenges with static websites:

1. **Card Expansion Overlay**: Solved the issue of cards being covered by the footer when expanded using z-index and positioning

2. **Comment System Boundaries**: Optimized comment system container width and overflow handling

3. **Mobile Device Adaptation**: Implemented graceful degradation for various screen sizes

4. **Navigation Anti-Shake System**: 
   - Resolved rapid carousel navigation conflicts with distance-based timing delays
   - Implemented smart jump prevention to avoid animation interruptions
   - Added search clearing integration for seamless user experience

5. **Flip Card Mobile Optimization**:
   - Fixed oversized cards on mobile devices through progressive scaling
   - Optimized arrow positioning to prevent content obstruction
   - Removed visual noise (black frames) while maintaining text readability

6. **Page Jumping Issues**:
   - Resolved Giscus comment system auto-scroll conflicts
   - Implemented DOM mutation monitoring to maintain proper page positioning
   - Fixed anchor link navigation between pages

7. **Cross-Device Consistency**:
   - Achieved consistent visual proportions between mobile and desktop
   - Implemented responsive typography with clamp() functions
   - Optimized touch interactions for mobile users

8. **Content Accessibility**:
   - Simplified verbose content for better readability
   - Enhanced text contrast with shadow effects
   - Improved navigation flow between pages

## Deployment
This website is deployed on GitHub Pages and can be automatically deployed using the following method:

1. Push code to the main branch of the GitHub repository
2. GitHub Actions automatically builds and deploys to GitHub Pages
3. Visit https://jlu005807.github.io/ to view the deployed result

## Development Notes

### Key Technical Implementations
- **Anti-Shake Navigation**: Utilizes distance calculations and timing delays to prevent navigation conflicts
- **Responsive Flip Cards**: CSS 3D transforms with progressive mobile optimization
- **DOM Mutation Monitoring**: Advanced observer pattern for comment system stability
- **Progressive Enhancement**: Mobile-first approach with graceful desktop scaling

### Browser Compatibility
- Modern browsers with CSS3 and ES6 support
- Mobile browsers with touch event handling
- Progressive degradation for older browsers

### Performance Considerations
- Lazy loading for non-critical resources
- Optimized CSS with minimal repaints
- Efficient DOM manipulation and event handling
- Compressed assets and optimized images

## Contributing
Feel free to submit issues and enhancement requests! If you'd like to contribute:

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License
This project is open-sourced under the [Creative Commons Attribution 3.0 License](https://html5up.net/license). Feel free to learn from and reuse it!

---

✨ **Latest Updates**: Enhanced with interactive flip cards, anti-shake navigation, and comprehensive mobile optimization

🌟 If you like this project, please ⭐Star and follow for updates!