export class AudioControl extends Audio {
  playHandler = () => {
    this.play().catch((e: unknown) => {
      console.error(e);
    });
  };

  stopTrack(isPause: boolean) {
    this.pause();
    if (!isPause) {
      this.currentTime = 0;
    }
  }

  playTrack(src: string) {
    if (!src) {
      this.src = '';
      return;
    }

    if (src === this.src) {
      this.playHandler();
      return;
    }

    this.currentTime = 0;
    this.src = src;
    this.playHandler();
  }

  setVolume(volume: number) {
    this.volume = volume / 100;
  }
}

const audio = new AudioControl();

export default audio;
