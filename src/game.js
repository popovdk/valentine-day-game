import gsap from 'gsap';
import { loveMessages, finalMessage } from './messages.js';
import {
  animateHeartFall,
  animateHeartCatch,
  animateToast,
  animateFinalScreen,
  animateStartScreen,
} from './animations.js';

export function gameComponent() {
  return {
    phase: 'start',
    score: 0,
    hearts: [],
    basketX: 50,
    totalHearts: loveMessages.length,
    nextHeartId: 0,
    spawnInterval: null,
    gameLoopRAF: null,
    finalData: finalMessage,
    gameWidth: 0,
    gameHeight: 0,
    basketWidth: 100,
    basketHeight: 75,
    toastMessage: '',
    toastVisible: false,
    _toastTimer: null,

    init() {
      this.updateDimensions();
      this._onResize = () => this.updateDimensions();
      window.addEventListener('resize', this._onResize);
      this.$nextTick(() => animateStartScreen());
    },

    destroy() {
      this.stopGame();
      window.removeEventListener('resize', this._onResize);
    },

    updateDimensions() {
      const area = this.$refs.gameArea || document.getElementById('game-area');
      if (area) {
        this.gameWidth = area.clientWidth;
        this.gameHeight = area.clientHeight;
      }
    },

    startGame() {
      this.phase = 'playing';
      this.score = 0;
      this.hearts = [];
      this.nextHeartId = 0;
      this.updateDimensions();
      this.spawnInterval = setInterval(() => this.spawnHeart(), 1800);
      this.spawnHeart();
      this.runGameLoop();
    },

    stopGame() {
      if (this.spawnInterval) {
        clearInterval(this.spawnInterval);
        this.spawnInterval = null;
      }
      if (this.gameLoopRAF) {
        cancelAnimationFrame(this.gameLoopRAF);
        this.gameLoopRAF = null;
      }
    },

    spawnHeart() {
      if (this.phase !== 'playing') return;

      const id = this.nextHeartId++;
      const emojis = ['❤️', '💖', '💗', '💕', '💘', '💝'];
      const heart = {
        id,
        x: 30 + Math.random() * (this.gameWidth - 60),
        y: -60,
        size: 44 + Math.random() * 20,
        emoji: emojis[Math.floor(Math.random() * emojis.length)],
      };

      this.hearts.push(heart);

      this.$nextTick(() => {
        const el = document.getElementById(`heart-${id}`);
        if (el) {
          animateHeartFall(el, heart, this.gameHeight, () => {
            this.hearts = this.hearts.filter((h) => h.id !== id);
          });
        }
      });
    },

    runGameLoop() {
      if (this.phase !== 'playing') return;
      this.checkCollisions();
      this.gameLoopRAF = requestAnimationFrame(() => this.runGameLoop());
    },

    checkCollisions() {
      const gameArea = document.getElementById('game-area');
      if (!gameArea) return;

      const basketLeft = (this.basketX / 100) * this.gameWidth - this.basketWidth / 2;
      const basketRight = basketLeft + this.basketWidth;
      const basketTop = this.gameHeight - this.basketHeight - 20;
      const gameRect = gameArea.getBoundingClientRect();

      for (const heart of this.hearts) {
        if (heart.caught) continue;

        const el = document.getElementById(`heart-${heart.id}`);
        if (!el) continue;

        const rect = el.getBoundingClientRect();
        const heartCenterX = rect.left - gameRect.left + rect.width / 2;
        const heartBottom = rect.top - gameRect.top + rect.height;

        if (
          heartBottom >= basketTop &&
          heartBottom <= basketTop + this.basketHeight + 15 &&
          heartCenterX >= basketLeft - 10 &&
          heartCenterX <= basketRight + 10
        ) {
          this.catchHeart(heart, el, gameArea);
          if (this.score >= this.totalHearts) break;
        }
      }
    },

    catchHeart(heart, el, gameArea) {
      heart.caught = true;
      this.score++;

      gsap.killTweensOf(el);

      animateHeartCatch(el, gameArea, () => {
        this.hearts = this.hearts.filter((h) => h.id !== heart.id);
      });

      this.showToast(this.score - 1);

      if (this.score >= this.totalHearts) {
        this.stopGame();
        setTimeout(() => this.showFinalScreen(), 1800);
      }
    },

    showToast(index) {
      if (this._toastTimer) {
        clearTimeout(this._toastTimer);
        this._toastTimer = null;
      }

      this.toastMessage = loveMessages[index % loveMessages.length];
      this.toastVisible = true;

      this.$nextTick(() => {
        const el = document.querySelector('.toast-message');
        if (el) animateToast(el, 2.5);
      });

      this._toastTimer = setTimeout(() => {
        this.toastVisible = false;
        this._toastTimer = null;
      }, 3200);
    },

    showFinalScreen() {
      if (this.phase === 'final') return;
      this.phase = 'final';
      this.toastVisible = false;
      this.$nextTick(() => {
        animateFinalScreen('.final-screen');
      });
    },

    handlePointerMove(event) {
      if (this.phase !== 'playing') return;

      event.preventDefault();

      let clientX;
      if (event.type.startsWith('touch')) {
        clientX = event.touches[0].clientX;
      } else {
        clientX = event.clientX;
      }

      const gameArea = document.getElementById('game-area');
      if (!gameArea) return;
      const rect = gameArea.getBoundingClientRect();
      const relativeX = clientX - rect.left;
      this.basketX = Math.max(5, Math.min(95, (relativeX / rect.width) * 100));
    },
  };
}
