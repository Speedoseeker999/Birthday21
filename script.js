(function() {
  // Performance optimization: Check for reduced motion preference
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  
  const blowBtn = document.getElementById('blow-btn');
  const confettiCanvas = document.getElementById('confetti-canvas');
  const ctx = confettiCanvas.getContext('2d');
  const balloonsRoot = document.getElementById('balloons');
  const floatingQuotesRoot = document.getElementById('floating-quotes');
  const floatingFlowersRoot = document.getElementById('floating-flowers');
  const atmosphericParticlesRoot = document.getElementById('atmospheric-particles');
  const birthdayLetter = document.getElementById('birthday-letter');
  const letterClose = document.querySelector('.letter-close');

  // Performance optimization: Throttle resize events
  let resizeTimeout;
  function resizeCanvas() {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(() => {
      confettiCanvas.width = window.innerWidth;
      confettiCanvas.height = window.innerHeight;
    }, 100);
  }
  
  resizeCanvas();
  window.addEventListener('resize', resizeCanvas);

  // Blow button functionality for the cake section
  if (blowBtn) {
    console.log('Blow button found, adding event listener');
    blowBtn.addEventListener('click', () => {
      console.log('Blow button clicked!');
      // Blow out candles in the cake section
      document.querySelectorAll('.cake-top-layer .candle').forEach((candle, index) => {
        setTimeout(() => {
          candle.classList.add('blowing');
          // Hide the flame immediately
          const flame = candle.querySelector('.flame');
          if (flame) {
            flame.style.opacity = '0';
            flame.style.transform = 'translateX(-50%) scale(0)';
          }
          setTimeout(() => {
            candle.classList.remove('blowing');
            candle.classList.add('blown');
            // Ensure flame is completely hidden
            if (flame) {
              flame.style.display = 'none';
            }
          }, 800);
        }, index * 300);
      });
      
      // Start confetti after candles blow out
      setTimeout(() => {
        startHeartConfetti(2000);
      }, 1000);
      
      // Show birthday letter after confetti starts
      setTimeout(() => {
        birthdayLetter.hidden = false;
        typeLine('Happy 21st Birthday! May all your dreams come true! 🎂✨');
      }, 1500);
      
      // Disable button after use
      blowBtn.disabled = true;
      blowBtn.textContent = 'Candles blown! 🎂';
    });
  } else {
    console.log('Blow button not found!');
  }

  // Lightbox for polaroids
  const lightbox = document.getElementById('lightbox');
  const lightboxImg = lightbox.querySelector('.lightbox-img');
  const lightboxCaption = lightbox.querySelector('.lightbox-caption');
  const lightboxClose = lightbox.querySelector('.lightbox-close');

  document.querySelectorAll('.polaroid img').forEach(img => {
    img.addEventListener('click', () => openLightbox(img.src, img.alt, img.nextElementSibling?.textContent || ''));
  });

  function openLightbox(src, alt, caption) {
    lightboxImg.src = src;
    lightboxImg.alt = alt;
    lightboxCaption.textContent = caption;
    lightbox.hidden = false;
  }
  function closeLightbox() { lightbox.hidden = true; }
  lightbox.addEventListener('click', (e) => { if (e.target === lightbox) closeLightbox(); });
  lightboxClose.addEventListener('click', closeLightbox);
  window.addEventListener('keydown', (e) => { if (e.key === 'Escape' && !lightbox.hidden) closeLightbox(); });

  // Typewriter effect
  const lineEl = document.getElementById('wish-line');
  let typeInterval;
  function typeLine(text) {
    clearInterval(typeInterval);
    let i = 0;
    lineEl.textContent = '';
    lineEl.style.width = '0ch';
    typeInterval = setInterval(() => {
      lineEl.textContent = text.slice(0, i);
      lineEl.style.width = i + 'ch';
      i++;
      if (i > text.length) clearInterval(typeInterval);
    }, 30);
  }

  // Heart confetti
  function startHeartConfetti(durationMs = 1500) {
    const colors = ['#ff6f91', '#ffd166', '#cdb4db', '#b8f2e6', '#ff9a8b'];
    const pieces = 220;
    const hearts = new Array(pieces).fill(0).map(() => ({
      x: Math.random() * confettiCanvas.width,
      y: -20 - Math.random() * 200,
      s: 0.6 + Math.random() * 1.2,
      c: colors[Math.floor(Math.random() * colors.length)],
      vy: 1.8 + Math.random() * 2.2,
      vx: -1 + Math.random() * 2,
      rot: Math.random() * Math.PI,
      wobble: Math.random() * 0.6 + 0.2
    }));
    const start = performance.now();
    function drawHeart(x, y, size, color, rotation) {
      ctx.save();
      ctx.translate(x, y);
      ctx.rotate(rotation);
      ctx.scale(size, size);
      ctx.beginPath();
      // Heart path
      ctx.moveTo(0, -2);
      ctx.bezierCurveTo(2, -4, 4, -1.5, 0, 2);
      ctx.bezierCurveTo(-4, -1.5, -2, -4, 0, -2);
      ctx.closePath();
      ctx.fillStyle = color;
      ctx.fill();
      ctx.restore();
    }
    function frame(t) {
      const elapsed = t - start;
      ctx.clearRect(0, 0, confettiCanvas.width, confettiCanvas.height);
      hearts.forEach(h => {
        h.y += h.vy;
        h.x += h.vx + Math.sin(h.y * 0.02) * h.wobble;
        h.rot += 0.02;
        drawHeart(h.x, h.y, h.s, h.c, h.rot);
      });
      if (elapsed < durationMs) requestAnimationFrame(frame);
      else ctx.clearRect(0, 0, confettiCanvas.width, confettiCanvas.height);
    }
    requestAnimationFrame(frame);
  }

  // Balloons surprise
  function releaseBalloons(count = 18) {
    for (let i = 0; i < count; i++) {
      const b = document.createElement('div');
      b.className = 'balloon';
      const hue = Math.floor(Math.random() * 360);
      b.style.background = `hsl(${hue} 80% 65%)`;
      b.style.left = `${Math.random() * 100}%`;
      b.style.animationDuration = `${6 + Math.random() * 5}s`;
      b.style.setProperty('--drift', `${(-40 + Math.random()*80)}px`);
      balloonsRoot.appendChild(b);
      setTimeout(() => b.remove(), 12000);
    }
  }
  // Balloons surprise - only if motion is not reduced
  if (!prefersReducedMotion) {
    window.addEventListener('keydown', (e) => { if (e.key.toLowerCase() === 'b') releaseBalloons(); });
  }

  // Nicety: small heart confetti on load - only if motion is not reduced
  if (!prefersReducedMotion) {
    setTimeout(() => startHeartConfetti(700), 500);
  }

  // Surprise modal logic - Meaningful birthday messages
  const notes = [
    '🎂 Happy 21st Birthday! You\'ve grown into such an amazing person.',
    '✨ At 21, you\'re stepping into a world of endless possibilities. Embrace every moment!',
    '🌟 You have the power to make all your dreams come true. Believe in yourself!',
    '💖 Your kindness touches everyone around you. Keep spreading that beautiful energy.',
    '🎉 This is your year to shine! May 21 bring you incredible adventures and joy.',
    '🌈 You\'re not just getting older, you\'re getting more wonderful with each year.',
    '🎈 May this birthday mark the beginning of your most amazing chapter yet.',
    '💫 You deserve all the happiness, love, and success that life has to offer.',
    '🎁 Never forget how special and loved you are. Happy 21st, beautiful soul!',
    '🌟 Here\'s to 21 years of being absolutely incredible. Here\'s to many more!',
    '💝 You make the world a brighter place just by being in it. Happy Birthday!',
    '🎊 May your 21st year be filled with laughter, love, and unforgettable memories.'
  ];
  let noteIndex = 0;
  // Sunflower surprise button functionality
  const surpriseBtn = document.getElementById('surprise-btn');
  const sunflowerModal = document.getElementById('sunflower-modal');
  const sunflowerClose = document.querySelector('.sunflower-close');
  const sunflowerNextBtn = document.querySelector('.sunflower-next-btn');
  const secondMessageModal = document.getElementById('second-message-modal');
  const secondMessageClose = document.querySelector('.second-message-close');
  
  if (surpriseBtn && sunflowerModal) {
    console.log('Surprise button and modal found, adding event listener');
    surpriseBtn.addEventListener('click', () => {
      console.log('Surprise button clicked!');
      sunflowerModal.hidden = false;
      sunflowerModal.style.display = 'flex';
      document.body.style.overflow = 'hidden';
      startHeartConfetti(1000);
    });
    
    if (sunflowerClose) {
      sunflowerClose.addEventListener('click', () => {
        sunflowerModal.hidden = true;
        sunflowerModal.style.display = 'none';
        document.body.style.overflow = 'auto';
      });
    }
    
    // Next button functionality - opens separate modal
    if (sunflowerNextBtn && secondMessageModal) {
      sunflowerNextBtn.addEventListener('click', () => {
        console.log('Next button clicked!');
        // Close sunflower modal
        sunflowerModal.hidden = true;
        sunflowerModal.style.display = 'none';
        // Open second message modal
        secondMessageModal.hidden = false;
        secondMessageModal.style.display = 'flex';
      });
    }
    
    // Close sunflower modal when clicking outside
    sunflowerModal.addEventListener('click', (e) => {
      if (e.target === sunflowerModal) {
        sunflowerModal.hidden = true;
        sunflowerModal.style.display = 'none';
        document.body.style.overflow = 'auto';
      }
    });
    
    // Close second message modal
    if (secondMessageClose && secondMessageModal) {
      secondMessageClose.addEventListener('click', () => {
        secondMessageModal.hidden = true;
        secondMessageModal.style.display = 'none';
        document.body.style.overflow = 'auto';
      });
    }
    
    // Close second message modal when clicking outside
    secondMessageModal.addEventListener('click', (e) => {
      if (e.target === secondMessageModal) {
        secondMessageModal.hidden = true;
        secondMessageModal.style.display = 'none';
        document.body.style.overflow = 'auto';
      }
    });
    
    // Close modals with Escape key
    window.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        if (!sunflowerModal.hidden) {
          sunflowerModal.hidden = true;
          sunflowerModal.style.display = 'none';
          document.body.style.overflow = 'auto';
        } else if (!secondMessageModal.hidden) {
          secondMessageModal.hidden = true;
          secondMessageModal.style.display = 'none';
          document.body.style.overflow = 'auto';
        }
      }
    });
  } else {
    console.log('Surprise button or modal not found!');
  }

  // Random surprise functionality
  const randomSurpriseBtn = document.getElementById('random-surprise-btn');
  
  if (randomSurpriseBtn) {
    const randomSurprises = [
      () => {
        // Surprise 1: Heart rain
        createHeartRain();
        showRandomMessage("Hearts raining for you! 💕");
      },
      () => {
        // Surprise 2: Balloon burst
        releaseBalloons(20);
        showRandomMessage("Balloon party! 🎈");
      },
      () => {
        // Surprise 3: Confetti explosion
        startHeartConfetti(3000);
        showRandomMessage("Confetti celebration! 🎉");
      },
      () => {
        // Surprise 4: Star shower
        createStarShower();
        showRandomMessage("Starry night for you! ⭐");
      },
      () => {
        // Surprise 5: Love message
        showRandomMessage("You are absolutely amazing! ✨");
        startHeartConfetti(2000);
      }
    ];
    
    randomSurpriseBtn.addEventListener('click', () => {
      const randomIndex = Math.floor(Math.random() * randomSurprises.length);
      randomSurprises[randomIndex]();
    });
  }
  
  function createHeartRain() {
    const heartRain = document.createElement('div');
    heartRain.style.position = 'fixed';
    heartRain.style.top = '0';
    heartRain.style.left = '0';
    heartRain.style.width = '100%';
    heartRain.style.height = '100%';
    heartRain.style.pointerEvents = 'none';
    heartRain.style.zIndex = '1000';
    document.body.appendChild(heartRain);
    
    for (let i = 0; i < 30; i++) {
      setTimeout(() => {
        const heart = document.createElement('div');
        heart.innerHTML = '💕';
        heart.style.position = 'absolute';
        heart.style.left = Math.random() * 100 + '%';
        heart.style.fontSize = '20px';
        heart.style.animation = 'fallDown 3s linear forwards';
        heartRain.appendChild(heart);
      }, i * 100);
    }
    
    setTimeout(() => {
      document.body.removeChild(heartRain);
    }, 5000);
  }
  
  function createStarShower() {
    const starShower = document.createElement('div');
    starShower.style.position = 'fixed';
    starShower.style.top = '0';
    starShower.style.left = '0';
    starShower.style.width = '100%';
    starShower.style.height = '100%';
    starShower.style.pointerEvents = 'none';
    starShower.style.zIndex = '1000';
    document.body.appendChild(starShower);
    
    for (let i = 0; i < 25; i++) {
      setTimeout(() => {
        const star = document.createElement('div');
        star.innerHTML = '⭐';
        star.style.position = 'absolute';
        star.style.left = Math.random() * 100 + '%';
        star.style.fontSize = '24px';
        star.style.animation = 'fallDown 4s linear forwards';
        starShower.appendChild(star);
      }, i * 150);
    }
    
    setTimeout(() => {
      document.body.removeChild(starShower);
    }, 6000);
  }
  
  function showRandomMessage(message) {
    const messageDiv = document.createElement('div');
    messageDiv.textContent = message;
    messageDiv.style.position = 'fixed';
    messageDiv.style.top = '50%';
    messageDiv.style.left = '50%';
    messageDiv.style.transform = 'translate(-50%, -50%)';
    messageDiv.style.background = 'linear-gradient(135deg, #fff 0%, #fbf7f2 100%)';
    messageDiv.style.padding = '20px 30px';
    messageDiv.style.borderRadius = '15px';
    messageDiv.style.boxShadow = '0 10px 30px rgba(91, 70, 54, 0.2)';
    messageDiv.style.fontFamily = "'Great Vibes', cursive";
    messageDiv.style.fontSize = '24px';
    messageDiv.style.color = 'var(--text-pink)';
    messageDiv.style.zIndex = '2000';
    messageDiv.style.animation = 'fadeInOut 3s ease-in-out';
    document.body.appendChild(messageDiv);
    
    setTimeout(() => {
      document.body.removeChild(messageDiv);
    }, 3000);
  }

  // Daylight song functionality
  const jiyaPhoto = document.getElementById('jiya-photo');
  const daylightAudio = document.getElementById('daylight-audio');
  const lyricLines = document.querySelectorAll('.lyric-line');
  
  if (jiyaPhoto && daylightAudio) {
    let isPlaying = false;
    let currentLineIndex = 0;
    
        jiyaPhoto.addEventListener('click', () => {
          if (!isPlaying) {
            // Apple Music style: Initialize audio analysis before playing
            initializeAudioAnalysis();
            daylightAudio.play();
            isPlaying = true;
            startLyricHighlighting();
          } else {
            daylightAudio.pause();
            isPlaying = false;
            resetLyrics();
          }
        });
    
        // Remove click functionality - lyrics will only sync with song
        lyricLines.forEach((line, index) => {
          line.style.cursor = 'default';
        });
    
    daylightAudio.addEventListener('ended', () => {
      isPlaying = false;
      resetLyrics();
    });
    
    
        function startLyricHighlighting() {
          // Apple Music style: Use multiple events for better sync
          daylightAudio.addEventListener('timeupdate', updateLyrics);
          daylightAudio.addEventListener('seeked', updateLyrics);
          daylightAudio.addEventListener('play', updateLyrics);
          
          // Apple Music style: Use requestAnimationFrame for smoother updates
          let animationId;
          function smoothUpdate() {
            updateLyrics();
            if (!daylightAudio.paused) {
              animationId = requestAnimationFrame(smoothUpdate);
            }
          }
          
          daylightAudio.addEventListener('play', () => {
            smoothUpdate();
          });
          
          daylightAudio.addEventListener('pause', () => {
            if (animationId) {
              cancelAnimationFrame(animationId);
            }
          });
        }
        
        // Apple Music style: Audio analysis and dynamic timing
        let audioContext;
        let analyser;
        let microphone;
        let isAnalyzing = false;
        
        function initializeAudioAnalysis() {
          if (!audioContext) {
            audioContext = new (window.AudioContext || window.webkitAudioContext)();
            analyser = audioContext.createAnalyser();
            analyser.fftSize = 2048;
            
            const source = audioContext.createMediaElementSource(daylightAudio);
            source.connect(analyser);
            analyser.connect(audioContext.destination);
          }
        }
        
        function analyzeAudio() {
          if (!analyser) return null;
          
          const bufferLength = analyser.frequencyBinCount;
          const dataArray = new Uint8Array(bufferLength);
          analyser.getByteFrequencyData(dataArray);
          
          // Calculate audio intensity
          let sum = 0;
          for (let i = 0; i < bufferLength; i++) {
            sum += dataArray[i];
          }
          const average = sum / bufferLength;
          
          return {
            intensity: average,
            timestamp: daylightAudio.currentTime
          };
        }
        
        function updateLyrics() {
          const currentTime = daylightAudio.currentTime;
          let currentLineIndex = -1;
          
          // Apple Music style: Dynamic timing adjustment based on audio analysis
          const audioData = analyzeAudio();
          const baseTolerance = 0.3;
          const dynamicTolerance = audioData ? (audioData.intensity / 255) * 0.5 : 0;
          const totalTolerance = baseTolerance + dynamicTolerance;
          
          // Find current line with Apple Music precision
          lyricLines.forEach((line, index) => {
            const lineTime = parseFloat(line.dataset.time);
            const nextLineTime = index < lyricLines.length - 1 ? 
              parseFloat(lyricLines[index + 1].dataset.time) : Infinity;
            
            // Apple Music style: Adaptive timing based on audio characteristics
            const startTime = lineTime - totalTolerance;
            const endTime = nextLineTime - totalTolerance;
            
            if (currentTime >= startTime && currentTime < endTime) {
              currentLineIndex = index;
            }
          });
          
          // Apple Music style: Smooth state transitions with audio feedback
          lyricLines.forEach((line, index) => {
            line.classList.remove('active', 'sung', 'upcoming');
            
            if (index < currentLineIndex) {
              line.classList.add('sung');
            } else if (index === currentLineIndex) {
              line.classList.add('active');
              // Apple Music style: Real-time word highlighting with audio sync
              highlightWordsProgressive(line, currentTime - parseFloat(line.dataset.time), audioData);
            } else if (index === currentLineIndex + 1) {
              line.classList.add('upcoming');
            }
          });
        }
    
    function highlightWordsProgressive(line, timeIntoLine = 0, audioData = null) {
      const words = line.textContent.split(' ');
      const originalText = line.textContent;
      
      // Apple Music style: Dynamic word timing based on audio intensity
      let averageWordDuration = 0.3;
      if (audioData && audioData.intensity > 100) {
        // Faster highlighting during intense parts (like Apple Music)
        averageWordDuration = 0.2;
      } else if (audioData && audioData.intensity < 50) {
        // Slower highlighting during quiet parts
        averageWordDuration = 0.4;
      }
      
      const wordsToHighlight = Math.floor(timeIntoLine / averageWordDuration);
      
      // Apple Music style: Audio-responsive visual effects
      const intensity = audioData ? audioData.intensity / 255 : 0.5;
      const glowIntensity = Math.max(0.3, intensity);
      
      const highlightedText = words.map((w, i) => {
        if (i < wordsToHighlight) {
          // Completed words with audio-responsive glow
          const glowStrength = Math.floor(glowIntensity * 15);
          return `<span style="color: #ffffff; font-weight: 600; text-shadow: 0 0 ${glowStrength}px rgba(255,255,255,${glowIntensity});">${w}</span>`;
        } else if (i === wordsToHighlight) {
          // Current word with pulsing effect like Apple Music
          const pulse = Math.sin(Date.now() * 0.01) * 0.2 + 0.8;
          return `<span style="color: #f0f0f0; font-weight: 500; opacity: ${pulse}; text-shadow: 0 0 5px rgba(255,255,255,0.3);">${w}</span>`;
        }
        return `<span style="color: rgba(139, 115, 85, 0.6);">${w}</span>`;
      }).join(' ');
      
      line.innerHTML = highlightedText;
    }
    
    function resetLyrics() {
      lyricLines.forEach(line => {
        line.classList.remove('active', 'sung');
        line.innerHTML = line.textContent; // Reset innerHTML to original text
      });
    }
  }

  // Countdown timer functionality - counts to next October 22nd
  function updateCountdown() {
    const now = new Date();
    const currentYear = now.getFullYear();
    
    // Create target date for this year's October 22nd
    let targetDate = new Date(currentYear, 9, 22, 0, 0, 0); // Month is 0-indexed, so 9 = October
    
    // If we've already passed this year's October 22nd, target next year
    if (now > targetDate) {
      targetDate = new Date(currentYear + 1, 9, 22, 0, 0, 0);
    }
    
    const timeLeft = targetDate.getTime() - now.getTime();

    if (timeLeft > 0) {
      const days = Math.floor(timeLeft / (1000 * 60 * 60 * 24));
      const hours = Math.floor((timeLeft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((timeLeft % (1000 * 60)) / 1000);

      document.getElementById('days').textContent = days.toString().padStart(2, '0');
      document.getElementById('hours').textContent = hours.toString().padStart(2, '0');
      document.getElementById('minutes').textContent = minutes.toString().padStart(2, '0');
      document.getElementById('seconds').textContent = seconds.toString().padStart(2, '0');
    } else {
      // Birthday has arrived!
      document.getElementById('days').textContent = '00';
      document.getElementById('hours').textContent = '00';
      document.getElementById('minutes').textContent = '00';
      document.getElementById('seconds').textContent = '00';
      
      // You could add special birthday celebration here
      console.log('Happy Birthday! 🎂');
    }
  }

  // Update countdown every second
  setInterval(updateCountdown, 1000);
  updateCountdown(); // Initial call

  // Scroll-triggered confetti for queen section
  let queenConfettiTriggered = false;
  
  function checkQueenSectionScroll() {
    const queenSection = document.querySelector('.queen-section');
    if (!queenSection || queenConfettiTriggered) return;
    
    const rect = queenSection.getBoundingClientRect();
    const windowHeight = window.innerHeight;
    
    // Trigger when section is 50% visible
    if (rect.top < windowHeight * 0.5 && rect.bottom > windowHeight * 0.5) {
      queenConfettiTriggered = true;
      
      // Create confetti from both sides
      createSideConfetti('left');
      createSideConfetti('right');
      
      console.log('Queen section confetti triggered! 🎉');
    }
  }
  
  function createSideConfetti(side) {
    const canvas = document.createElement('canvas');
    canvas.style.position = 'fixed';
    canvas.style.top = '0';
    canvas.style.left = side === 'left' ? '0' : '50%';
    canvas.style.width = '50%';
    canvas.style.height = '100vh';
    canvas.style.pointerEvents = 'none';
    canvas.style.zIndex = '1000';
    document.body.appendChild(canvas);
    
    const ctx = canvas.getContext('2d');
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
    
    const confettiPieces = [];
    const colors = ['#ff6b6b', '#4ecdc4', '#45b7d1', '#96ceb4', '#feca57', '#ff9ff3', '#54a0ff'];
    
    // Create confetti pieces
    for (let i = 0; i < 50; i++) {
      confettiPieces.push({
        x: side === 'left' ? 0 : canvas.width,
        y: Math.random() * canvas.height,
        vx: side === 'left' ? Math.random() * 8 + 2 : -(Math.random() * 8 + 2),
        vy: Math.random() * 4 - 2,
        color: colors[Math.floor(Math.random() * colors.length)],
        size: Math.random() * 8 + 4,
        rotation: Math.random() * 360,
        rotationSpeed: Math.random() * 10 - 5
      });
    }
    
    function animateConfetti() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      confettiPieces.forEach((piece, index) => {
        piece.x += piece.vx;
        piece.y += piece.vy;
        piece.vy += 0.1; // gravity
        piece.rotation += piece.rotationSpeed;
        
        ctx.save();
        ctx.translate(piece.x, piece.y);
        ctx.rotate(piece.rotation * Math.PI / 180);
        ctx.fillStyle = piece.color;
        ctx.fillRect(-piece.size/2, -piece.size/2, piece.size, piece.size);
        ctx.restore();
        
        // Remove pieces that are off screen or falling too far
        if (piece.x < -50 || piece.x > canvas.width + 50 || piece.y > canvas.height + 100) {
          confettiPieces.splice(index, 1);
        }
      });
      
      if (confettiPieces.length > 0) {
        requestAnimationFrame(animateConfetti);
      } else {
        // Remove canvas when animation is complete
        setTimeout(() => {
          document.body.removeChild(canvas);
        }, 1000);
      }
    }
    
    animateConfetti();
  }
  
  // Listen for scroll events
  window.addEventListener('scroll', checkQueenSectionScroll);
  
  // Check on page load in case section is already visible
  setTimeout(checkQueenSectionScroll, 500);

  // Birthday letter controls
  function closeBirthdayLetter() { birthdayLetter.hidden = true; }
  letterClose.addEventListener('click', closeBirthdayLetter);
  birthdayLetter.addEventListener('click', (e) => { if (e.target === birthdayLetter) closeBirthdayLetter(); });
  window.addEventListener('keydown', (e) => { if (e.key === 'Escape' && !birthdayLetter.hidden) closeBirthdayLetter(); });

  // Floating love quotes
  const loveQuotes = [
    'You are loved',
    'You matter',
    'You are enough',
    'You are beautiful',
    'You are amazing',
    'You are wonderful',
    'You are cherished',
    'You are special',
    'You are perfect',
    'You are treasured'
  ];

  function createFloatingQuote() {
    const quote = document.createElement('div');
    quote.className = 'floating-quote';
    quote.textContent = loveQuotes[Math.floor(Math.random() * loveQuotes.length)];
    quote.style.left = Math.random() * 100 + '%';
    quote.style.setProperty('--drift', (Math.random() - 0.5) * 200 + 'px');
    quote.style.setProperty('--rot', (Math.random() - 0.5) * 20 + 'deg');
    floatingQuotesRoot.appendChild(quote);
    setTimeout(() => quote.remove(), 12000);
  }

  // Heart cursor trail - only if motion is not reduced
  if (!prefersReducedMotion) {
    let lastTrailTime = 0;
    window.addEventListener('pointermove', (e) => {
      const now = performance.now();
      if (now - lastTrailTime < 40) return; // throttle
      lastTrailTime = now;
      const span = document.createElement('span');
      span.className = 'trail';
      span.style.left = e.clientX + 'px';
      span.style.top = e.clientY + 'px';
      span.style.opacity = '0.9';
      span.style.transition = 'transform 600ms ease, opacity 600ms ease';
      document.body.appendChild(span);
      requestAnimationFrame(() => {
        span.style.transform = 'translate(-50%, -50%) translateY(-12px) scale(0.6)';
        span.style.opacity = '0';
      });
      setTimeout(() => span.remove(), 700);
    });
  }

  // Start floating quotes every 3 seconds
  setInterval(createFloatingQuote, 3000);
  setTimeout(createFloatingQuote, 1000); // First one after 1 second

  // Floating Flowers
  const flowerTypes = ['sunflower', 'rose', 'lily'];
  function createFlowerSVG(type) {
    const el = document.createElement('div');
    el.className = 'flower';
    // Base styles
    const left = Math.random() * 100 + '%';
    el.style.left = left;
    el.style.setProperty('--drift', (Math.random() - 0.5) * 300 + 'px');
    el.style.setProperty('--rot', Math.random() * 360 + 'deg');
    el.style.animationDuration = (12 + Math.random() * 8) + 's';

    // Build inner HTML with simple SVG per type
    if (type === 'sunflower') {
      el.innerHTML = `<svg width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg" style="position:absolute;inset:0;margin:auto">
        <circle cx="14" cy="14" r="6" fill="var(--accent)"/>
        ${Array.from({length:12}).map((_,i)=>{
          const ang = (i/12)*Math.PI*2;
          const x = 14 + Math.cos(ang)*10; const y = 14 + Math.sin(ang)*10;
          return `<ellipse cx="${x}" cy="${y}" rx="4" ry="8" transform="rotate(${(ang*180/Math.PI).toFixed(1)} ${x} ${y})" fill="var(--flower-sun)" opacity="0.9"/>`;
        }).join('')}
      </svg>`;
    } else if (type === 'rose') {
      el.innerHTML = `<svg width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg" style="position:absolute;inset:0;margin:auto">
        <circle cx="14" cy="14" r="5" fill="var(--flower-rose)"/>
        ${Array.from({length:8}).map((_,i)=>{
          const ang = (i/8)*Math.PI*2; const r=8;
          const x = 14 + Math.cos(ang)*r; const y = 14 + Math.sin(ang)*r;
          return `<path d="M14 14 Q ${x} ${y} 14 14" stroke="var(--flower-rose)" stroke-width="3" fill="none" opacity="0.7"/>`;
        }).join('')}
      </svg>`;
    } else {
      // lily
      el.innerHTML = `<svg width="30" height="30" viewBox="0 0 30 30" fill="none" xmlns="http://www.w3.org/2000/svg" style="position:absolute;inset:0;margin:auto">
        ${Array.from({length:6}).map((_,i)=>{
          const ang = (i/6)*Math.PI*2; const x=15+Math.cos(ang)*7; const y=15+Math.sin(ang)*7;
          return `<path d="M15 15 C 15 10, ${x} ${y}, 15 22" fill="var(--flower-lily)" opacity="0.9"/>`;
        }).join('')}
        <circle cx="15" cy="15" r="2" fill="var(--accent)"/>
      </svg>`;
    }
    return el;
  }

  function createFloatingFlower() {
    const type = flowerTypes[Math.floor(Math.random()*flowerTypes.length)];
    const flower = createFlowerSVG(type);
    floatingFlowersRoot.appendChild(flower);
    setTimeout(() => flower.remove(), 20000);
  }

  // Atmospheric Particles colors tuned to cocoa theme
  const particleColors = [
    'var(--gold)',
    'var(--accent-2)',
    'var(--soft)',
    'rgba(91,70,54,0.25)'
  ];

  function createAtmosphericParticle() {
    const particle = document.createElement('div');
    particle.className = 'particle';
    particle.style.left = Math.random() * 100 + '%';
    particle.style.setProperty('--drift', (Math.random() - 0.5) * 150 + 'px');
    particle.style.setProperty('--particle-color', particleColors[Math.floor(Math.random() * particleColors.length)]);
    particle.style.animationDuration = (15 + Math.random() * 10) + 's';
    particle.style.animationDelay = Math.random() * 5 + 's';
    atmosphericParticlesRoot.appendChild(particle);
    setTimeout(() => particle.remove(), 25000);
  }

  // Start background animations only if motion is not reduced
  if (!prefersReducedMotion) {
    setInterval(createFloatingFlower, 2000);
    setInterval(createAtmosphericParticle, 1500);
    
    // Initial flowers and particles
    setTimeout(() => {
      for (let i = 0; i < 5; i++) {
        setTimeout(createFloatingFlower, i * 400);
        setTimeout(createAtmosphericParticle, i * 300);
      }
    }, 500);
  }

  // Memories carousel
  (function initMemoriesCarousel(){
    const track = document.getElementById('mem-track');
    if (!track) return;
    const slides = Array.from(track.children);
    const prev = document.getElementById('mem-prev');
    const next = document.getElementById('mem-next');
    const dotsRoot = document.getElementById('mem-dots');
    let index = 0;

    function update() {
      const slideWidth = slides[0].getBoundingClientRect().width + 16; // include gap
      track.style.transform = `translateX(${-index * slideWidth}px)`;
      Array.from(dotsRoot.children).forEach((b, i) => b.setAttribute('aria-selected', i === index));
      prev.disabled = index === 0;
      next.disabled = index === slides.length - 1;
    }

    // Create dots
    slides.forEach((_, i) => {
      const b = document.createElement('button');
      b.setAttribute('role', 'tab');
      b.setAttribute('aria-label', `Go to memory ${i+1}`);
      b.addEventListener('click', () => { index = i; update(); });
      dotsRoot.appendChild(b);
    });

    prev.addEventListener('click', () => { index = Math.max(0, index - 1); update(); });
    next.addEventListener('click', () => { index = Math.min(slides.length - 1, index + 1); update(); });

    // Basic swipe
    let startX = 0; let dragging = false;
    track.addEventListener('pointerdown', (e) => { dragging = true; startX = e.clientX; track.setPointerCapture(e.pointerId); });
    track.addEventListener('pointerup', (e) => {
      if (!dragging) return; dragging = false;
      const dx = e.clientX - startX;
      if (dx > 40) index = Math.max(0, index - 1);
      else if (dx < -40) index = Math.min(slides.length - 1, index + 1);
      update();
    });

    window.addEventListener('resize', () => update());
    update();
  })();
})();
