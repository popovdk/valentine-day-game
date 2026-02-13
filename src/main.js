import Alpine from 'alpinejs';
import { gameComponent } from './game.js';
import './style.css';

Alpine.data('game', gameComponent);
Alpine.start();
