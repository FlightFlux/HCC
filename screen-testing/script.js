// Professional Screen Testing Tool
class ScreenTester {
    constructor() {
        this.lastWidth = 0;
        this.lastHeight = 0;
        this.init();
        this.setupEventListeners();
        this.startRealTimeUpdates();
    }

    init() {
        this.updateAllData();
        this.setupThemeToggle();
    }

    setupEventListeners() {
        // Window resize event
        window.addEventListener('resize', () => {
            this.updateAllData();
        });

        // Window orientation change
        window.addEventListener('orientationchange', () => {
            setTimeout(() => {
                this.updateAllData();
            }, 200);
        });

        // Mouse move event for real-time position tracking
        document.addEventListener('mousemove', (e) => {
            this.updateMousePosition(e.clientX, e.clientY);
        });

        // Touch move for mobile devices
        document.addEventListener('touchmove', (e) => {
            if (e.touches.length > 0) {
                const touch = e.touches[0];
                this.updateMousePosition(touch.clientX, touch.clientY);
            }
        });

        // Refresh button click
        const refreshBtn = document.getElementById('refresh-btn');
        if (refreshBtn) {
            refreshBtn.addEventListener('click', () => {
                this.refreshAllData();
            });
        }

        // Export data link
        const exportLink = document.getElementById('export-link');
        if (exportLink) {
            exportLink.addEventListener('click', () => {
                this.exportScreenData();
            });
        }

        // Keyboard shortcuts
        document.addEventListener('keydown', (e) => {
            if (e.key === 'F5' || (e.ctrlKey && e.key === 'r')) {
                e.preventDefault();
                this.refreshAllData();
            }
        });
    }

    setupThemeToggle() {
        const themeToggle = document.getElementById('theme-toggle');
        const body = document.body;
        
        // Check for saved theme preference or default to light
        const savedTheme = localStorage.getItem('screenTester-theme');
        if (savedTheme === 'dark') {
            body.classList.add('dark-mode');
            themeToggle.checked = true;
        }

        themeToggle.addEventListener('change', () => {
            if (themeToggle.checked) {
                body.classList.add('dark-mode');
                localStorage.setItem('screenTester-theme', 'dark');
            } else {
                body.classList.remove('dark-mode');
                localStorage.setItem('screenTester-theme', 'light');
            }
        });
    }

    updateAllData() {
        this.updateScreenInfo();
        this.updateBreakpoints();
        this.updateQuickStats();
        this.updateTimestamp();
    }

    updateScreenInfo() {
        try {
            // Screen resolution
            const screenRes = `${screen.width} × ${screen.height}`;
            this.updateElementText('screen-resolution', screenRes);

            // Viewport size
            const viewportSize = `${window.innerWidth} × ${window.innerHeight}`;
            this.updateElementText('viewport-size', viewportSize);

            // Device pixel ratio
            const pixelRatio = window.devicePixelRatio || 1;
            this.updateElementText('pixel-ratio', pixelRatio.toFixed(2));

            // Color depth
            const colorDepth = `${screen.colorDepth}-bit`;
            this.updateElementText('color-depth', colorDepth);

            // Available screen size
            const availableSize = `${screen.availWidth} × ${screen.availHeight}`;
            this.updateElementText('available-size', availableSize);

            // Orientation
            const orientation = this.getOrientation();
            this.updateElementText('orientation', orientation);

            // Window size for tracking
            const windowSize = `${window.outerWidth} × ${window.outerHeight}`;
            this.updateElementText('window-size', windowSize);

        } catch (error) {
            console.error('Error updating screen info:', error);
        }
    }

    updateQuickStats() {
        // Current device type
        const deviceType = this.getCurrentDeviceType();
        this.updateElementText('current-device', deviceType);

        // Quick viewport
        const quickViewport = `${window.innerWidth} × ${window.innerHeight}`;
        this.updateElementText('quick-viewport', quickViewport);

        // Quick orientation
        const orientation = this.getOrientation();
        const shortOrientation = orientation.includes('portrait') ? 'Portrait' : 'Landscape';
        this.updateElementText('quick-orientation', shortOrientation);
    }

    getCurrentDeviceType() {
        const width = window.innerWidth;
        if (width < 768) return 'Mobile';
        if (width < 1024) return 'Tablet';
        if (width < 1440) return 'Desktop';
        return 'Large Desktop';
    }

    getOrientation() {
        if (screen.orientation && screen.orientation.type) {
            return screen.orientation.type.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase());
        } else if (window.orientation !== undefined) {
            const angle = window.orientation;
            if (angle === 0) return 'Portrait Primary';
            if (angle === 180) return 'Portrait Secondary';
            if (angle === 90) return 'Landscape Primary';
            if (angle === -90) return 'Landscape Secondary';
        }
        
        // Fallback based on viewport dimensions
        return window.innerWidth > window.innerHeight ? 'Landscape' : 'Portrait';
    }

    updateBreakpoints() {
        const width = window.innerWidth;
        
        // Define breakpoints
        const breakpoints = {
            mobile: width < 768,
            tablet: width >= 768 && width < 1024,
            desktop: width >= 1024 && width < 1440,
            largeDesktop: width >= 1440
        };

        // Update breakpoint status
        Object.entries(breakpoints).forEach(([key, isActive]) => {
            this.updateBreakpointStatus(key, isActive);
        });
    }

    updateBreakpointStatus(breakpointType, isActive) {
        const statusElement = document.getElementById(`${breakpointType.replace(/([A-Z])/g, '-$1').toLowerCase()}-status`);
        const itemElement = document.getElementById(`${breakpointType.replace(/([A-Z])/g, '-$1').toLowerCase()}-bp`);
        
        if (statusElement) {
            statusElement.textContent = isActive ? '●' : '○';
            statusElement.style.color = isActive ? 'var(--success-color)' : 'var(--text-light)';
        }
        
        if (itemElement) {
            if (isActive) {
                itemElement.classList.add('active');
            } else {
                itemElement.classList.remove('active');
            }
        }
    }

    updateMousePosition(x, y) {
        const mousePos = `X: ${x}, Y: ${y}`;
        this.updateElementText('mouse-position', mousePos);
    }

    updateTimestamp() {
        const now = new Date();
        const timeString = now.toLocaleTimeString();
        this.updateElementText('last-updated', timeString);
    }

    updateElementText(elementId, text) {
        const element = document.getElementById(elementId);
        if (element) {
            element.textContent = text;
        }
    }

    refreshAllData() {
        const refreshBtn = document.getElementById('refresh-btn');
        
        // Add visual feedback
        if (refreshBtn) {
            const originalHTML = refreshBtn.innerHTML;
            refreshBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Refreshing...';
            refreshBtn.disabled = true;
        }

        // Refresh all data after a short delay
        setTimeout(() => {
            this.updateAllData();
            
            // Reset button
            if (refreshBtn) {
                refreshBtn.innerHTML = '<i class="fas fa-sync-alt"></i> Refresh All Data';
                refreshBtn.disabled = false;
            }
        }, 1000);
    }

    startRealTimeUpdates() {
        // Update timestamp every second
        setInterval(() => {
            this.updateTimestamp();
        }, 1000);

        // Check for screen changes every 100ms
        setInterval(() => {
            this.checkForChanges();
        }, 100);
    }

    checkForChanges() {
        const currentWidth = window.innerWidth;
        const currentHeight = window.innerHeight;
        
        if (this.lastWidth !== currentWidth || this.lastHeight !== currentHeight) {
            this.updateAllData();
            this.lastWidth = currentWidth;
            this.lastHeight = currentHeight;
        }
    }

    // Utility methods for comprehensive screen testing
    getDetailedScreenInfo() {
        return {
            screen: {
                width: screen.width,
                height: screen.height,
                availWidth: screen.availWidth,
                availHeight: screen.availHeight,
                colorDepth: screen.colorDepth,
                pixelDepth: screen.pixelDepth
            },
            viewport: {
                width: window.innerWidth,
                height: window.innerHeight,
                outerWidth: window.outerWidth,
                outerHeight: window.outerHeight,
                scrollX: window.scrollX,
                scrollY: window.scrollY
            },
            device: {
                pixelRatio: window.devicePixelRatio,
                orientation: this.getOrientation(),
                userAgent: navigator.userAgent,
                platform: navigator.platform,
                language: navigator.language,
                cookieEnabled: navigator.cookieEnabled,
                onLine: navigator.onLine
            },
            display: {
                colorScheme: window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light',
                reducedMotion: window.matchMedia('(prefers-reduced-motion: reduce)').matches,
                highContrast: window.matchMedia('(prefers-contrast: high)').matches
            },
            breakpoints: {
                isMobile: window.innerWidth < 768,
                isTablet: window.innerWidth >= 768 && window.innerWidth < 1024,
                isDesktop: window.innerWidth >= 1024 && window.innerWidth < 1440,
                isLargeDesktop: window.innerWidth >= 1440
            },
            timestamp: new Date().toISOString()
        };
    }

    exportScreenData() {
        try {
            const data = this.getDetailedScreenInfo();
            const jsonString = JSON.stringify(data, null, 2);
            const blob = new Blob([jsonString], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            
            const a = document.createElement('a');
            a.href = url;
            a.download = `screen-test-data-${new Date().toISOString().slice(0, 19).replace(/:/g, '-')}.json`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
            
            // Show feedback
            const exportLink = document.getElementById('export-link');
            if (exportLink) {
                const originalText = exportLink.textContent;
                exportLink.textContent = 'Downloaded!';
                exportLink.style.color = 'var(--success-color)';
                
                setTimeout(() => {
                    exportLink.textContent = originalText;
                    exportLink.style.color = 'var(--primary-color)';
                }, 2000);
            }
        } catch (error) {
            console.error('Error exporting screen data:', error);
            alert('Error exporting data. Check console for details.');
        }
    }

    // Performance monitoring
    measurePerformance() {
        const start = performance.now();
        this.updateAllData();
        const end = performance.now();
        console.log(`Screen data update took ${(end - start).toFixed(2)} milliseconds`);
    }
}

// Initialize the screen tester when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Initialize screen tester
    window.screenTester = new ScreenTester();
    
    // Add global functions for console access
    window.exportScreenData = () => window.screenTester.exportScreenData();
    window.getScreenInfo = () => window.screenTester.getDetailedScreenInfo();
    window.measurePerformance = () => window.screenTester.measurePerformance();
    
    console.log('🖥️ Professional Screen Testing Tool loaded successfully!');
    console.log('Available console commands:');
    console.log('- exportScreenData() - Download screen data as JSON');
    console.log('- getScreenInfo() - Get detailed screen information');
    console.log('- measurePerformance() - Measure update performance');
});

// Handle page visibility changes
document.addEventListener('visibilitychange', () => {
    if (!document.hidden && window.screenTester) {
        window.screenTester.updateAllData();
    }
});

// Handle online/offline status
window.addEventListener('online', () => {
    if (window.screenTester) {
        window.screenTester.updateAllData();
    }
});

window.addEventListener('offline', () => {
    if (window.screenTester) {
        window.screenTester.updateAllData();
    }
});

// Error handling for uncaught errors
window.addEventListener('error', (event) => {
    console.error('Screen Tester Error:', event.error);
});

// Handle unhandled promise rejections
window.addEventListener('unhandledrejection', (event) => {
    console.error('Screen Tester Promise Rejection:', event.reason);
});