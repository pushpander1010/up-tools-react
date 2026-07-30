/**
 * Universal Fullscreen Utility for Games
 * Provides consistent fullscreen experience across all games
 */
class FullscreenManager {
  constructor(gameSelector = '.game-container', buttonSelector = '.fullscreen-btn') {
    this.gameContainer = document.querySelector(gameSelector);
    this.fullscreenBtn = document.querySelector(buttonSelector);
    this.isFullscreen = false;
    this.exitFullscreenBtn = null;
    this.originalStyles = {};
    
    this.init();
  }
  
  init() {
    if (this.fullscreenBtn) {
      this.fullscreenBtn.addEventListener('click', () => this.toggleFullscreen());
    }
    
    // Exit fullscreen on Escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && this.isFullscreen) {
        this.exitFullscreen();
      }
    });
    
    // Handle browser fullscreen API changes
    document.addEventListener('fullscreenchange', () => this.handleFullscreenChange());
    document.addEventListener('webfullscreenchange', () => this.handleFullscreenChange());
    document.addEventListener('mozfullscreenchange', () => this.handleFullscreenChange());
    document.addEventListener('msfullscreenchange', () => this.handleFullscreenChange());
  }
  
  toggleFullscreen() {
    if (this.isFullscreen) {
      this.exitFullscreen();
    } else {
      this.enterFullscreen();
    }
  }
  
  async enterFullscreen() {
    try {
      const elem = this.gameContainer || document.documentElement;
      
      // Try native fullscreen API
      if (elem.requestFullscreen) {
        await elem.requestFullscreen();
      } else if (elem.webkitRequestFullscreen) {
        await elem.webkitRequestFullscreen();
      } else if (elem.mozRequestFullScreen) {
        await elem.mozRequestFullScreen();
      } else if (elem.msRequestFullscreen) {
        await elem.msRequestFullscreen();
      } else {
        // Fallback to CSS fullscreen
        this.applyCSSFullscreen();
        return;
      }
      
      this.isFullscreen = true;
      this.applyFullscreenStyles();
    } catch (err) {
      console.warn('Fullscreen request failed, using CSS fallback:', err);
      this.applyCSSFullscreen();
    }
  }
  
  exitFullscreen() {
    try {
      if (document.fullscreenElement || document.webkitFullscreenElement || 
          document.mozFullScreenElement || document.msFullscreenElement) {
        if (document.exitFullscreen) {
          document.exitFullscreen();
        } else if (document.webkitExitFullscreen) {
          document.webkitExitFullscreen();
        } else if (document.mozCancelFullScreen) {
          document.mozCancelFullScreen();
        } else if (document.msExitFullscreen) {
          document.msExitFullscreen();
        }
      }
    } catch (err) {
      console.warn('Exit fullscreen failed:', err);
    }
    
    this.isFullscreen = false;
    this.removeFullscreenStyles();
  }
  
  handleFullscreenChange() {
    const isCurrentlyFullscreen = !!(
      document.fullscreenElement || 
      document.webkitFullscreenElement || 
      document.mozFullScreenElement || 
      document.msFullscreenElement
    );

    if (isCurrentlyFullscreen && !this.isFullscreen) {
      this.isFullscreen = true;
      this.applyFullscreenStyles();
    } else if (!isCurrentlyFullscreen && this.isFullscreen) {
      this.isFullscreen = false;
      this.removeFullscreenStyles();
    }
  }
  
  applyCSSFullscreen() {
    this.isFullscreen = true;
    this.gameContainer?.classList.add('css-fullscreen-mode');
    document.body.classList.add('fullscreen-active');
    this.applyFullscreenStyles();
  }
  
  applyFullscreenStyles() {
    // Hide header and footer
    document.querySelectorAll('header, footer, .site-footer').forEach(el => {
      this.originalStyles[el.className] = el.style.display;
      el.style.display = 'none';
    });

    // Store original body styles
    this.originalStyles.bodyOverflow = document.body.style.overflow;
    this.originalStyles.bodyMargin = document.body.style.margin;
    this.originalStyles.bodyPadding = document.body.style.padding;

    // Apply fullscreen styles
    document.body.style.overflow = 'hidden';
    document.body.style.margin = '0';
    document.body.style.padding = '0';

    // Add fullscreen class
    this.gameContainer?.classList.add('fullscreen-mode');
    document.body.classList.add('fullscreen-active');

    // Create exit button
    this.createExitButton();

    // Lock screen orientation on mobile
    if (screen.orientation && screen.orientation.lock) {
      screen.orientation.lock('landscape').catch(() => {
        // Orientation lock not supported
      });
    }

    // Hide fullscreen button
    if (this.fullscreenBtn) {
      this.fullscreenBtn.style.display = 'none';
    }
  }

  removeFullscreenStyles() {
    // Show header and footer
    document.querySelectorAll('header, footer, .site-footer').forEach(el => {
      el.style.display = this.originalStyles[el.className] || '';
    });

    // Restore original body styles
    document.body.style.overflow = this.originalStyles.bodyOverflow || '';
    document.body.style.margin = this.originalStyles.bodyMargin || '';
    document.body.style.padding = this.originalStyles.bodyPadding || '';

    // Remove fullscreen class
    this.gameContainer?.classList.remove('fullscreen-mode');
    this.gameContainer?.classList.remove('css-fullscreen-mode');
    document.body.classList.remove('fullscreen-active');

    // Remove exit button
    const exitBtn = document.getElementById('exitFullscreenBtn');
    if (exitBtn) exitBtn.remove();

    // Unlock screen orientation
    if (screen.orientation && screen.orientation.unlock) {
      screen.orientation.unlock().catch(() => {
        // Unlock not supported
      });
    }

    // Show fullscreen button
    if (this.fullscreenBtn) {
      this.fullscreenBtn.style.display = '';
    }
  }

  createExitButton() {
    let exitBtn = document.getElementById('exitFullscreenBtn');
    if (!exitBtn) {
      exitBtn = document.createElement('button');
      exitBtn.id = 'exitFullscreenBtn';
      exitBtn.className = 'exit-fullscreen-btn';
      exitBtn.textContent = '✕ Exit';
      exitBtn.addEventListener('click', () => this.exitFullscreen());
      document.body.appendChild(exitBtn);
    }
  }
}

// Auto-initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  // Check if fullscreen button exists and initialize
  if (document.querySelector('.fullscreen-btn')) {
    window.fullscreenManager = new FullscreenManager();
  }
});