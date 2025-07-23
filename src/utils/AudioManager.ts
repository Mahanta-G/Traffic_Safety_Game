class AudioManagerClass {
  private audio: HTMLAudioElement | null = null;
  private volume: number = 0.5;
  private isInitialized: boolean = false;
  private isDucked: boolean = false;
  private fadeInterval: NodeJS.Timeout | null = null;

  initialize() {
    if (this.isInitialized) return;
    
    try {
      this.audio = new Audio('/Music/BG-Music.mp3');
      this.audio.loop = true;
      this.audio.volume = this.getStoredVolume();
      this.volume = this.audio.volume;
      this.isInitialized = true;
    } catch (error) {
      console.error('Failed to initialize audio:', error);
    }
  }

  private getStoredVolume(): number {
    const stored = localStorage.getItem('gameVolume');
    return stored ? parseFloat(stored) : 0.5;
  }

  async play() {
    if (!this.audio || !this.isInitialized) return;
    
    try {
      // Reset audio to beginning if it ended
      if (this.audio.ended) {
        this.audio.currentTime = 0;
      }
      
      await this.audio.play();
    } catch (error) {
      console.error('Failed to play audio:', error);
    }
  }

  pause() {
    if (!this.audio || !this.isInitialized) return;
    
    try {
      this.audio.pause();
    } catch (error) {
      console.error('Failed to pause audio:', error);
    }
  }

  setVolume(volume: number) {
    this.volume = Math.max(0, Math.min(1, volume));
    
    if (this.audio && this.isInitialized && !this.isDucked) {
      this.audio.volume = this.volume;
    }
    
    localStorage.setItem('gameVolume', this.volume.toString());
  }

  getVolume(): number {
    return this.volume;
  }

  // Duck audio during animations (fade to mute)
  duck() {
    if (!this.audio || !this.isInitialized || this.isDucked) return;
    
    this.isDucked = true;
    this.fadeOut();
  }

  // Restore audio after animations (fade back to original volume)
  unduck() {
    if (!this.audio || !this.isInitialized || !this.isDucked) return;
    
    this.isDucked = false;
    this.fadeIn();
  }

  private fadeOut() {
    if (!this.audio) return;
    
    // Clear any existing fade
    if (this.fadeInterval) {
      clearInterval(this.fadeInterval);
    }
    
    const startVolume = this.audio.volume;
    const fadeSteps = 20;
    const stepSize = startVolume / fadeSteps;
    const stepDuration = 200 / fadeSteps; // 200ms total fade out
    
    this.fadeInterval = setInterval(() => {
      if (!this.audio) return;
      
      this.audio.volume = Math.max(0, this.audio.volume - stepSize);
      
      if (this.audio.volume <= 0) {
        this.audio.volume = 0;
        if (this.fadeInterval) {
          clearInterval(this.fadeInterval);
          this.fadeInterval = null;
        }
      }
    }, stepDuration);
  }

  private fadeIn() {
    if (!this.audio) return;
    
    // Clear any existing fade
    if (this.fadeInterval) {
      clearInterval(this.fadeInterval);
    }
    
    const targetVolume = this.volume;
    const fadeSteps = 30;
    const stepSize = targetVolume / fadeSteps;
    const stepDuration = 800 / fadeSteps; // 800ms total fade in (slower, smoother)
    
    this.audio.volume = 0; // Start from 0
    
    this.fadeInterval = setInterval(() => {
      if (!this.audio) return;
      
      this.audio.volume = Math.min(targetVolume, this.audio.volume + stepSize);
      
      if (this.audio.volume >= targetVolume) {
        this.audio.volume = targetVolume;
        if (this.fadeInterval) {
          clearInterval(this.fadeInterval);
          this.fadeInterval = null;
        }
      }
    }, stepDuration);
  }

  cleanup() {
    if (this.fadeInterval) {
      clearInterval(this.fadeInterval);
      this.fadeInterval = null;
    }
    
    if (this.audio) {
      this.audio.pause();
      this.audio.src = '';
      this.audio = null;
    }
    this.isInitialized = false;
    this.isDucked = false;
  }
}

export const AudioManager = new AudioManagerClass();