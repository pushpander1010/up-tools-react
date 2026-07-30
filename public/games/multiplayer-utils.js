/**
 * Multiplayer Game Utilities
 * Provides robust multiplayer support using:
 *   1. Cloudflare Worker API (/api/multiplayer) — cross-device, production
 *   2. BroadcastChannel — same-browser cross-tab (zero config, works instantly in dev)
 *   3. localStorage — last-resort fallback (single device only)
 */

class MultiplayerGameManager {
  constructor(options = {}) {
    this.gameId = null;
    this.playerId = null;
    this.playerName = '';
    this.opponentName = '';
    this.storageKey = null;
    this.pollInterval = options.pollInterval || 800; // ms
    this.pollTimer = null;
    this.isPollingActive = false;
    this.lastProcessedRound = 0;
    this.gameState = {};
    this.onStateChange = options.onStateChange || null;
    this.onGameReady = options.onGameReady || null;
    this.onRoundComplete = options.onRoundComplete || null;
    this._serverOk = true; // tracks if server is reachable
    this._bc = null;       // BroadcastChannel instance
  }

  // ─────────────────────────────────────────
  // Public API
  // ─────────────────────────────────────────

  async createGame(playerName) {
    if (!playerName || !playerName.trim()) throw new Error('Player name is required');

    this.gameId = this.generateGameCode();
    this.playerId = 1;
    this.playerName = playerName.trim();
    this.storageKey = `mp-game-${this.gameId}`;

    this.gameState = {
      gameId: this.gameId,
      createdAt: Date.now(),
      player1: { id: 1, name: this.playerName, score: 0, choice: null, ready: false },
      player2: { id: 2, name: '', score: 0, choice: null, ready: false },
      round: 1,
      maxRounds: 5,
      status: 'waiting',
      lastUpdate: Date.now(),
      lastRoundResult: null
    };

    this._openBroadcastChannel();
    await this.saveState();
    this.startPolling();

    return { gameId: this.gameId, gameUrl: this.getGameUrl() };
  }

  async joinGame(gameId, playerName) {
    if (!gameId || !gameId.trim()) throw new Error('Game code is required');
    if (!playerName || !playerName.trim()) throw new Error('Player name is required');

    this.gameId = gameId.trim().toUpperCase();
    this.playerId = 2;
    this.playerName = playerName.trim();
    this.storageKey = `mp-game-${this.gameId}`;

    this._openBroadcastChannel();

    const state = await this.loadState();
    if (!state) throw new Error('Game not found. Check the game code and make sure the host has created the game.');

    state.player2.name = this.playerName;
    state.status = 'playing';
    state.lastUpdate = Date.now();
    this.gameState = state;

    await this.saveState();
    this.startPolling();

    if (this.onGameReady) this.onGameReady(this.gameState);
    return this.gameState;
  }

  async makeMove(choice) {
    if (!this.gameState || !this.storageKey) throw new Error('Game not initialized');

    const state = await this.loadState();
    if (!state) throw new Error('Game state lost — please rejoin');

    if (this.playerId === 1) {
      state.player1.choice = choice;
      state.player1.ready = true;
    } else {
      state.player2.choice = choice;
      state.player2.ready = true;
    }

    state.lastUpdate = Date.now();
    this.gameState = state;
    await this.saveState();

    if (state.player1.ready && state.player2.ready) {
      await this.resolveRound(state);
    }

    return state;
  }

  async resolveRound(state) {
    const p1Choice = state.player1.choice;
    const p2Choice = state.player2.choice;
    if (!p1Choice || !p2Choice) return;

    const result = this.determineWinner(p1Choice, p2Choice);

    if (result === 'player1') state.player1.score += 1;
    else if (result === 'player2') state.player2.score += 1;

    state.lastRoundResult = {
      result, p1Choice, p2Choice,
      scores: { player1: state.player1.score, player2: state.player2.score },
      round: state.round
    };

    state.player1.choice = null; state.player1.ready = false;
    state.player2.choice = null; state.player2.ready = false;
    state.round += 1;

    if (state.round > state.maxRounds) state.status = 'completed';

    state.lastUpdate = Date.now();
    this.gameState = state;
    await this.saveState();

    if (this.onRoundComplete) this.onRoundComplete(state.lastRoundResult);
  }

  determineWinner(choice1, choice2) { return 'tie'; }

  getGameUrl() {
    return `${window.location.origin}${window.location.pathname}?game=${this.gameId}`;
  }

  isGameReady() {
    return !!(this.gameState?.player1?.name && this.gameState?.player2?.name);
  }

  isGameComplete() {
    return this.gameState?.status === 'completed';
  }

  stopPolling() {
    this.isPollingActive = false;
    if (this.pollTimer) { clearTimeout(this.pollTimer); this.pollTimer = null; }
  }

  resetGame() {
    this.stopPolling();
    if (this._bc) { try { this._bc.close(); } catch(_) {} this._bc = null; }
    if (this.storageKey) localStorage.removeItem(this.storageKey);
    this.gameId = null; this.playerId = null;
    this.playerName = ''; this.opponentName = '';
    this.storageKey = null; this.gameState = {};
  }

  generateGameCode() {
    return Math.random().toString(36).substring(2, 8).toUpperCase();
  }

  // ─────────────────────────────────────────
  // Storage: Server + BroadcastChannel + localStorage
  // ─────────────────────────────────────────

  async saveState() {
    if (!this.storageKey) return;

    // 1. Always save to localStorage (instant, same-device sync)
    try {
      localStorage.setItem(this.storageKey, JSON.stringify(this.gameState));
    } catch(e) {}

    // 2. Broadcast to other tabs via BroadcastChannel (same-browser cross-tab)
    if (this._bc) {
      try { this._bc.postMessage({ type: 'state', state: this.gameState }); } catch(e) {}
    }

    // 3. Save to server (cross-device)
    if (this._serverOk) {
      try {
        const res = await fetch('/api/multiplayer', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ gameId: this.gameId, state: this.gameState }),
          signal: AbortSignal.timeout(4000)
        });
        if (!res.ok) this._serverOk = false;
      } catch(e) {
        this._serverOk = false;
        console.warn('Multiplayer server unavailable — using local sync only');
      }
    }
  }

  async loadState() {
    if (!this.storageKey) return null;

    // 1. Try server first (cross-device — most authoritative)
    if (this._serverOk) {
      try {
        const res = await fetch(
          `/api/multiplayer?code=${encodeURIComponent(this.gameId)}`,
          { signal: AbortSignal.timeout(4000) }
        );
        if (res.ok) {
          const data = await res.json();
          if (data && data.gameId) return data;
        } else {
          this._serverOk = false;
        }
      } catch(e) {
        this._serverOk = false;
        console.warn('Multiplayer server unavailable — using local sync only');
      }
    }

    // 2. Fall back to localStorage (same-device or same-browser)
    try {
      const raw = localStorage.getItem(this.storageKey);
      if (raw) return JSON.parse(raw);
    } catch(e) {}

    return null;
  }

  // ─────────────────────────────────────────
  // BroadcastChannel: instant same-browser cross-tab sync
  // ─────────────────────────────────────────

  _openBroadcastChannel() {
    if (!window.BroadcastChannel || !this.storageKey) return;
    try {
      this._bc = new BroadcastChannel(this.storageKey);
      this._bc.onmessage = (ev) => {
        if (ev.data?.type !== 'state' || !ev.data?.state) return;
        const incoming = ev.data.state;
        if (incoming.lastUpdate <= (this.gameState.lastUpdate || 0)) return;
        // Update local cache so the next poll comparison picks it up
        try { localStorage.setItem(this.storageKey, JSON.stringify(incoming)); } catch(e) {}
        this.gameState = incoming;
        this._processStateChange(incoming);
      };
    } catch(e) {}
  }

  // ─────────────────────────────────────────
  // Polling
  // ─────────────────────────────────────────

  startPolling() {
    if (this.pollTimer) return;
    this.isPollingActive = true;
    this.lastProcessedRound = (this.gameState?.round ?? 1) - 1;

    const poll = async () => {
      if (!this.isPollingActive) return;
      try {
        const newState = await this.loadState();
        if (newState && this.isPollingActive) {
          this._processStateChange(newState);
        }
      } catch(e) {
        console.error('Poll error:', e);
      }
      if (this.isPollingActive) {
        this.pollTimer = setTimeout(poll, this.pollInterval);
      }
    };

    this.pollTimer = setTimeout(poll, this.pollInterval);
  }

  _processStateChange(newState) {
    const stateChanged = JSON.stringify(newState) !== JSON.stringify(this.gameState);

    // Fire onRoundComplete for new rounds
    if (newState.lastRoundResult && newState.lastRoundResult.round > this.lastProcessedRound) {
      this.lastProcessedRound = newState.lastRoundResult.round;
      if (this.onRoundComplete) this.onRoundComplete(newState.lastRoundResult);
    }

    // Fire onGameReady when game transitions from waiting → playing
    if (this.gameState?.status === 'waiting' && newState.status === 'playing') {
      if (this.onGameReady) this.onGameReady(newState);
    }

    if (stateChanged) {
      this.gameState = newState;
      if (this.onStateChange) this.onStateChange(newState);
    }
  }
}

// Export for use in games
window.MultiplayerGameManager = MultiplayerGameManager;
