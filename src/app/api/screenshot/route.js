import puppeteer from 'puppeteer';

export async function POST(request) {
  console.log('=== Screenshot API called ===');
  
  let browser;
  try {
    const body = await request.json();
    console.log('Request body:', body);
    const { url, waitTime = 10000 } = body;
    
    if (!url) {
      console.error('No URL provided in request body');
      return Response.json({ 
        success: false,
        error: 'URL is required' 
      }, { status: 400 });
    }
    
    console.log('URL received:', url);
    
    browser = await puppeteer.launch({ 
      headless: true,
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-web-security',
        '--disable-features=IsolateOrigins,site-per-process',
        '--disable-dev-shm-usage',
        '--disable-accelerated-2d-canvas',
        '--disable-gpu'
      ]
    });
    
    const page = await browser.newPage();
    await page.setViewport({ width: 1920, height: 1080 });
    page.setDefaultNavigationTimeout(60000);
    
    console.log('Navigating to:', url);
    await page.goto(url, { 
      waitUntil: 'networkidle2', // Changed from networkidle0 (more lenient)
      timeout: 60000 
    });
    
    console.log('Page loaded - initial wait 5s...');
    await new Promise(resolve => setTimeout(resolve, 5000));
    
    // Disable all animations FIRST before scrolling
    console.log('Disabling animations...');
    await page.evaluate(() => {
      const style = document.createElement('style');
      style.innerHTML = `
        *, *::before, *::after {
          animation-duration: 0s !important;
          animation-delay: 0s !important;
          transition-duration: 0s !important;
          transition-delay: 0s !important;
        }
      `;
      document.head.appendChild(style);
    });
    
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // SLOW scroll to trigger lazy-loaded images with MORE wait time
    console.log('Scrolling slowly to load all images...');
    await page.evaluate(() => {
      return new Promise((resolve) => {
        let scrollPos = 0;
        const scrollStep = 500; // Smaller steps
        const scrollDelay = 800; // LONGER delay between scrolls (was 300ms)
        const maxHeight = document.body.scrollHeight;
        
        const doScroll = () => {
          if (scrollPos < maxHeight) {
            window.scrollTo(0, scrollPos);
            scrollPos += scrollStep;
            setTimeout(doScroll, scrollDelay);
          } else {
            resolve();
          }
        };
        
        doScroll();
      });
    });
    
    console.log('First scroll complete - waiting 5s for images...');
    await new Promise(resolve => setTimeout(resolve, 5000));
    
    // Scroll DOWN again to catch any missed lazy loads
    console.log('Second pass - scrolling to bottom...');
    await page.evaluate(() => {
      return new Promise((resolve) => {
        window.scrollTo(0, document.body.scrollHeight);
        setTimeout(resolve, 3000);
      });
    });
    
    console.log('Waiting 5s at bottom...');
    await new Promise(resolve => setTimeout(resolve, 5000));
    
    // Scroll back to top slowly
    console.log('Scrolling back to top...');
    await page.evaluate(() => {
      return new Promise((resolve) => {
        const scrollToTop = () => {
          const currentScroll = window.pageYOffset;
          if (currentScroll > 0) {
            window.scrollTo(0, currentScroll - 500);
            setTimeout(scrollToTop, 100);
          } else {
            resolve();
          }
        };
        scrollToTop();
      });
    });
    
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    // Force all elements to visible state and force image loading
    console.log('Forcing all elements visible and loading images...');
    await page.evaluate(() => {
      // Force visible state on all elements
      document.querySelectorAll('*').forEach(el => {
        const style = window.getComputedStyle(el);
        if (style.opacity === '0' || el.style.opacity === '0') {
          el.style.opacity = '1';
        }
        if (el.style.transform && el.style.transform !== 'none') {
          el.style.transform = 'none';
        }
      });
      
      // Force all images to load by setting their src again
      document.querySelectorAll('img').forEach(img => {
        if (img.dataset.src) {
          img.src = img.dataset.src;
        }
        if (img.dataset.srcset) {
          img.srcset = img.dataset.srcset;
        }
        // Remove lazy loading attribute
        img.loading = 'eager';
      });
      
      // Trigger reflow
      document.body.offsetHeight;
    });
    
    console.log('Waiting 8s for all images to fully load...');
    await new Promise(resolve => setTimeout(resolve, 8000));
    
    console.log(`Final wait ${waitTime}ms...`);
    await new Promise(resolve => setTimeout(resolve, waitTime));
    
    console.log('Taking screenshot...');
    const screenshot = await page.screenshot({ 
      fullPage: true,
      encoding: 'base64',
      captureBeyondViewport: true
    });
    
    await browser.close();
    console.log('Screenshot captured successfully!');
    
    return Response.json({ 
      success: true,
      screenshot: `data:image/png;base64,${screenshot}` 
    });
    
  } catch (error) {
    console.error('Screenshot error:', error);
    if (browser) {
      await browser.close().catch(e => console.error('Browser close error:', e));
    }
    return Response.json({ 
      success: false,
      error: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    }, { status: 500 });
  }
}