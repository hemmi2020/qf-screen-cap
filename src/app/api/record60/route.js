import { chromium } from 'playwright';
import fs from 'fs';
import path from 'path';
import { promisify } from 'util';
import { exec } from 'child_process';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

const execAsync = promisify(exec);

// Main page recording with pauses
async function recordMainPageWithPauses(url, outputPath) {
  const browser = await chromium.launch({ 
    headless: true,
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-dev-shm-usage'
    ]
  });
  const context = await browser.newContext({
    viewport: { width: 1920, height: 1080 }
  });
  const page = await context.newPage();
  
  console.log(`Recording MAIN PAGE: ${url}`);
  
  await page.goto(url, { waitUntil: 'networkidle', timeout: 60000 });
  
  console.log('Page loaded - initial wait 3s...');
  await new Promise(resolve => setTimeout(resolve, 3000));
  
  // Disable animations
  await page.addStyleTag({
    content: `
      *, *::before, *::after {
        animation-duration: 0s !important;
        animation-delay: 0s !important;
        transition-duration: 0s !important;
        transition-delay: 0s !important;
      }
    `
  });
  
  // FAST image loading - no multiple scrolls
  console.log('Fast loading images...');
  await page.evaluate(() => {
    // Force all lazy images to load
    document.querySelectorAll('img').forEach(img => {
      if (img.dataset.src) img.src = img.dataset.src;
      if (img.dataset.srcset) img.srcset = img.dataset.srcset;
      img.loading = 'eager';
    });
    
    // Single quick scroll to trigger scroll-based lazy loading
    window.scrollTo(0, document.body.scrollHeight);
  });
  
  await new Promise(resolve => setTimeout(resolve, 3000));
  
  // Force visibility
  await page.evaluate(() => {
    document.querySelectorAll('*').forEach(el => {
      if (el.style.opacity === '0') el.style.opacity = '1';
      if (el.style.transform && el.style.transform !== 'none') el.style.transform = 'none';
    });
  });
  
  await page.evaluate(() => window.scrollTo(0, 0));
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  const maxHeight = await page.evaluate(() => document.body.scrollHeight);
  console.log(`Page height: ${maxHeight}px`);
  
  const tempFrameDir = path.join(path.dirname(outputPath), 'frames_' + Date.now());
  if (!fs.existsSync(tempFrameDir)) {
    fs.mkdirSync(tempFrameDir, { recursive: true });
  }
  
  let frameIndex = 0;
  
  // PHASE 1: 3-second header pause (180 frames at 60 FPS)
  console.log('⏸️  Capturing 3-second header pause...');
  const headerPauseFrames = 180; // 3 seconds × 60 FPS
  
  for (let i = 0; i < headerPauseFrames; i++) {
    const framePath = path.join(tempFrameDir, `frame_${frameIndex.toString().padStart(5, '0')}.jpg`);
    await page.screenshot({ 
      path: framePath, 
      fullPage: false,
      type: 'jpeg',
      quality: 85
    });
    frameIndex++;
    
    if (i % 60 === 0) console.log(`  Header: ${i}/${headerPauseFrames}`);
  }
  
  console.log(`✅ Captured ${headerPauseFrames} header frames`);
  
  // PHASE 2: Manual screenshot scroll (smooth and consistent like nav pages)
  console.log('📜 Starting smooth scroll recording...');
  
  // Calculate scroll parameters for 60 FPS
  const scrollDuration = Math.max(8, Math.min(20, maxHeight / 800));
  const scrollFrames = Math.floor(scrollDuration * 60); // 60 FPS
  const scrollStep = maxHeight / (scrollFrames - 1);
  
  console.log(`  Will capture ${scrollFrames} frames over ${scrollDuration.toFixed(1)}s`);
  
  // Capture scroll frames
  for (let i = 0; i < scrollFrames; i++) {
    const scrollPos = Math.floor(i * scrollStep);
    
    await page.evaluate(({ pos }) => {
      window.scrollTo({ top: pos, behavior: 'instant' });
    }, { pos: scrollPos });
    
    // Small delay for render (reduced for 60 FPS)
    await new Promise(resolve => setTimeout(resolve, 20));
    
    const framePath = path.join(tempFrameDir, `frame_${frameIndex.toString().padStart(5, '0')}.jpg`);
    await page.screenshot({ 
      path: framePath, 
      fullPage: false,
      type: 'jpeg',
      quality: 85
    });
    frameIndex++;
    
    if (i % 100 === 0) console.log(`  Scroll progress: ${i}/${scrollFrames} frames`);
  }
  
  console.log(`✅ Captured ${scrollFrames} scroll frames`);
  
  // PHASE 3: 2-second bottom pause (120 frames at 60 FPS)
  console.log('⏸️  Capturing 2-second bottom pause...');
  const bottomPauseFrames = 120; // 2 seconds × 60 FPS
  
  for (let i = 0; i < bottomPauseFrames; i++) {
    const framePath = path.join(tempFrameDir, `frame_${frameIndex.toString().padStart(5, '0')}.jpg`);
    await page.screenshot({ 
      path: framePath, 
      fullPage: false,
      type: 'jpeg',
      quality: 85
    });
    frameIndex++;
    
    if (i % 60 === 0) console.log(`  Bottom: ${i}/${bottomPauseFrames}`);
  }
  
  console.log(`✅ Total frames: ${frameIndex}`);
  
  // Create video with ULTRAFAST preset at 60 FPS
  console.log('🎬 Creating video...');
  const inputPattern = path.join(tempFrameDir, 'frame_%05d.jpg');
  await execAsync(`ffmpeg -y -r 60 -i "${inputPattern}" -c:v libx264 -pix_fmt yuv420p -crf 23 -preset ultrafast "${outputPath}"`);
  
  fs.rmSync(tempFrameDir, { recursive: true, force: true });
  
  await browser.close();
  console.log(`✅ Main page video saved`);
}

// Nav page - manual screenshots for smooth, consistent scrolling
async function recordNavPageFast(url, outputPath) {
  const browser = await chromium.launch({ 
    headless: true,
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-dev-shm-usage'
    ]
  });
  const context = await browser.newContext({
    viewport: { width: 1920, height: 1080 }
  });
  const page = await context.newPage();
  
  console.log(`Recording NAV PAGE: ${url}`);
  
  await page.goto(url, { waitUntil: 'networkidle', timeout: 60000 });
  
  await new Promise(resolve => setTimeout(resolve, 2000));
  
  // Disable animations
  await page.addStyleTag({
    content: `
      *, *::before, *::after {
        animation-duration: 0s !important;
        transition-duration: 0s !important;
      }
    `
  });
  
  // FAST image loading
  console.log('Fast loading images...');
  await page.evaluate(() => {
    document.querySelectorAll('img').forEach(img => {
      if (img.dataset.src) img.src = img.dataset.src;
      if (img.dataset.srcset) img.srcset = img.dataset.srcset;
      img.loading = 'eager';
    });
    window.scrollTo(0, document.body.scrollHeight);
  });
  
  await new Promise(resolve => setTimeout(resolve, 2000));
  
  await page.evaluate(() => window.scrollTo(0, 0));
  await new Promise(resolve => setTimeout(resolve, 500));
  
  const maxHeight = await page.evaluate(() => document.body.scrollHeight);
  console.log(`Page height: ${maxHeight}px`);
  
  const tempFrameDir = path.join(path.dirname(outputPath), 'frames_' + Date.now());
  if (!fs.existsSync(tempFrameDir)) {
    fs.mkdirSync(tempFrameDir, { recursive: true });
  }
  
  // Manual screenshot recording for smooth, consistent scrolling
  console.log('📜 Recording with manual screenshots (smooth scroll)...');
  
  // Calculate scroll parameters for 60 FPS
  const scrollDuration = Math.max(10, Math.min(20, maxHeight / 500)); // 10-20 seconds
  const fps = 60;
  const totalFrames = Math.floor(scrollDuration * fps);
  const scrollStep = maxHeight / (totalFrames - 1);
  
  console.log(`  Will capture ${totalFrames} frames over ${scrollDuration.toFixed(1)}s`);
  
  let frameIndex = 0;
  
  // Capture frames while scrolling
  for (let i = 0; i < totalFrames; i++) {
    const scrollPos = Math.floor(i * scrollStep);
    
    await page.evaluate(({ pos }) => {
      window.scrollTo({ top: pos, behavior: 'instant' });
    }, { pos: scrollPos });
    
    // Small delay for render (reduced for 60 FPS)
    await new Promise(resolve => setTimeout(resolve, 20));
    
    const framePath = path.join(tempFrameDir, `frame_${frameIndex.toString().padStart(5, '0')}.jpg`);
    await page.screenshot({ 
      path: framePath, 
      fullPage: false,
      type: 'jpeg',
      quality: 85
    });
    frameIndex++;
    
    if (i % 100 === 0) console.log(`  Progress: ${i}/${totalFrames} frames`);
  }
  
  console.log(`✅ Captured ${frameIndex} frames`);
  
  console.log('🎬 Creating video...');
  const inputPattern = path.join(tempFrameDir, 'frame_%05d.jpg');
  await execAsync(`ffmpeg -y -r 60 -i "${inputPattern}" -c:v libx264 -pix_fmt yuv420p -crf 23 -preset ultrafast "${outputPath}"`);
  
  fs.rmSync(tempFrameDir, { recursive: true, force: true });
  
  await browser.close();
  console.log(`✅ Nav page video saved`);
}

export async function POST(request) {
  console.log('=== Screen Recording API called ===');
  
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return Response.json({ 
        success: false,
        error: 'Unauthorized' 
      }, { status: 401 });
    }

    const body = await request.json();
    const { url, multiPage = false } = body;
    
    if (!url) {
      return Response.json({ 
        success: false,
        error: 'URL is required' 
      }, { status: 400 });
    }

    // BYPASS FOR LOCAL DEV - Comment out for production
    const subscription = await prisma.subscription.findUnique({
      where: { userId: session.user.id }
    });

    if (!subscription || subscription.status !== 'ACTIVE') {
      return Response.json({ 
        success: false,
        error: 'Active subscription required',
        requiresSubscription: true
      }, { status: 403 });
    }

    // Save search to database
    await prisma.search.create({
      data: {
        url,
        type: 'recording',
        fps: 60,
        multiPage,
        userName: session.user.name || 'Unknown',
        userEmail: session.user.email,
        userId: session.user.id
      }
    });
    console.log('Search saved to database');
    
    const tempDir = path.join(process.cwd(), 'temp');
    if (!fs.existsSync(tempDir)) {
      fs.mkdirSync(tempDir, { recursive: true });
    }
    
    if (multiPage) {
      console.log('🌐 Multi-page mode - extracting nav links...');
      
      // Extract nav links first
      const browser = await chromium.launch({ 
        headless: true,
        args: [
          '--no-sandbox',
          '--disable-setuid-sandbox',
          '--disable-dev-shm-usage'
        ]
      });
      const context = await browser.newContext({
        viewport: { width: 1920, height: 1080 }
      });
      const page = await context.newPage();
      
      await page.goto(url, { waitUntil: 'networkidle', timeout: 60000 });
      await new Promise(resolve => setTimeout(resolve, 5000));
      
      try {
        await page.waitForSelector('nav, header, [role="navigation"], a', { timeout: 5000 });
        console.log('✅ Navigation elements detected');
      } catch (e) {
        console.log('⚠️  No standard navigation found, will search all links');
      }
      
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const navLinks = await page.evaluate(() => {
        const links = [];
        const baseUrl = new URL(window.location.href);
        const baseDomain = baseUrl.hostname.replace('www.', '');
        
        const allLinkElements = document.querySelectorAll('a');
        const seenUrls = new Set();
        
        allLinkElements.forEach(link => {
          try {
            const href = link.href;
            const text = link.textContent?.trim() || link.getAttribute('aria-label') || link.getAttribute('title') || '';
            
            if (!href || 
                href.includes('mailto:') || 
                href.includes('tel:') ||
                href.includes('javascript:') ||
                href === window.location.href ||
                href === window.location.origin + '/') {
              return;
            }
            
            const linkUrl = new URL(href);
            const linkDomain = linkUrl.hostname.replace('www.', '');
            
            if (linkDomain !== baseDomain) return;
            
            const normalizedUrl = linkUrl.origin + linkUrl.pathname.replace(/\/$/, '');
            const currentNormalized = window.location.origin + window.location.pathname.replace(/\/$/, '');
            
            if (seenUrls.has(normalizedUrl) || normalizedUrl === currentNormalized) return;
            
            const isVisible = link.offsetParent !== null;
            
            if (isVisible && text.length > 0 && text.length < 100) {
              links.push({ 
                url: href,
                title: text,
                pathname: linkUrl.pathname
              });
              seenUrls.add(normalizedUrl);
            }
          } catch (e) {}
        });
        
        links.sort((a, b) => a.pathname.length - b.pathname.length);
        return links.slice(0, 5);
      });
      
      await browser.close();
      
      console.log(`✅ Found ${navLinks.length} nav links:`, navLinks.map(l => l.title));
      
      // PARALLEL RECORDING - Record all pages at once!
      console.log('\n🚀 Starting PARALLEL recording of all pages...');
      
      const videoFiles = [];
      const recordingPromises = [];
      
      // Main page
      const mainVideo = path.join(tempDir, `page_0_${Date.now()}.mp4`);
      videoFiles.push(mainVideo);
      recordingPromises.push(recordMainPageWithPauses(url, mainVideo));
      
      // Nav pages in parallel
      for (let i = 0; i < navLinks.length; i++) {
        if (navLinks[i].url !== url) {
          const videoPath = path.join(tempDir, `page_${i+1}_${Date.now()}.mp4`);
          videoFiles.push(videoPath);
          recordingPromises.push(recordNavPageFast(navLinks[i].url, videoPath));
        }
      }
      
      // Wait for ALL recordings to complete
      await Promise.all(recordingPromises);
      
      console.log('\n✅ All recordings complete!');
      console.log(`🎬 Concatenating ${videoFiles.length} videos...`);
      
      // Concatenate
      const listFile = path.join(tempDir, 'videos.txt');
      fs.writeFileSync(listFile, videoFiles.map(f => `file '${f}'`).join('\n'));
      
      const outputPath = path.join(tempDir, `final_${Date.now()}.mp4`);
      await execAsync(`ffmpeg -f concat -safe 0 -i "${listFile}" -c copy "${outputPath}"`);
      
      const videoBuffer = fs.readFileSync(outputPath);
      const videoBase64 = `data:video/mp4;base64,${videoBuffer.toString('base64')}`;
      
      // Cleanup
      videoFiles.forEach(f => fs.existsSync(f) && fs.unlinkSync(f));
      fs.unlinkSync(listFile);
      fs.unlinkSync(outputPath);
      
      console.log('✅ All done!');
      
      return Response.json({ 
        success: true,
        video: videoBase64,
        type: 'video/mp4',
        pagesRecorded: videoFiles.length,
        navLinks: navLinks.map(l => ({ title: l.title, url: l.url }))
      });
      
    } else {
      // Single page
      console.log('📹 Single page mode');
      const outputPath = path.join(tempDir, `recording_${Date.now()}.mp4`);
      await recordMainPageWithPauses(url, outputPath);
      
      const videoBuffer = fs.readFileSync(outputPath);
      const videoBase64 = `data:video/mp4;base64,${videoBuffer.toString('base64')}`;
      
      fs.unlinkSync(outputPath);
      
      return Response.json({ 
        success: true,
        video: videoBase64,
        type: 'video/mp4'
      });
    }
    
  } catch (error) {
    console.error('❌ Recording error:', error);
    
    return Response.json({ 
      success: false,
      error: error.message
    }, { status: 500 });
  }
}