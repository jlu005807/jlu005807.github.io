(function() {
  function getUserUUID() {
    try {
      let uuid = localStorage.getItem('userUUID');
      if (!uuid) {
        const cryptoObj = window.crypto || window.msCrypto;
        uuid = ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, c =>
          (c ^ cryptoObj.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16)
        );
        localStorage.setItem('userUUID', uuid);
      }
      return uuid;
    } catch (e) {
      console.error('UUID生成失败:', e);
      return `temp-${Date.now()}-${Math.random().toString(36).slice(2)}`;
    }
  }
  if (typeof window.SeededRandom === 'undefined') {
    class SeededRandom {
      constructor(seedStr) {
        let hash = 0;
        for (let i = 0; i < seedStr.length; i++) {
          hash = (Math.imul(31, hash) + seedStr.charCodeAt(i)) >>> 0;
        }
        this.seed = hash % 2147483647;
        if (this.seed <= 0) this.seed += 2147483646;
      }
      next() {
        this.seed = Math.imul(16807, this.seed) % 2147483647;
        return (this.seed - 1) / 2147483646;
      }
    }
    window.SeededRandom = SeededRandom;
  }
  function getDailySeed() {
    const today = new Date();
    const datePart = [
      today.getFullYear(),
      (today.getMonth() + 1).toString().padStart(2, '0'),
      today.getDate().toString().padStart(2, '0')
    ].join('');
    return `${datePart}_${getUserUUID()}`;
  }
  function seededShuffle(array, seedStr) {
    try {
      const rng = new window.SeededRandom(seedStr);
      const arr = [...array];
      let currentIndex = arr.length;
      while (currentIndex > 0) {
        currentIndex--;
        const randomIndex = Math.floor(rng.next() * (currentIndex + 1));
        if (arr[currentIndex] && arr[randomIndex]) {
          [arr[currentIndex], arr[randomIndex]] =
            [arr[randomIndex], arr[currentIndex]];
        }
      }
      return arr.filter(el => el instanceof HTMLElement);
    } catch (e) {
      console.error('洗牌失败:', e);
      return array;
    }
  }
  function shuffleArticles() {
    const container = document.querySelector('section.posts');
    if (!container || !container.children.length) return;
    try {
      const seed = getDailySeed();
      const articles = Array.from(container.children);
      const shuffled = seededShuffle(articles, seed);
      container.replaceChildren(...shuffled);
      console.log('shuffleArticles: articles shuffled successfully');
    } catch (e) {
      console.error('文章排序失败:', e);
    }
  }
  function initShuffle() {
    const readyHandler = () => {
      if (document.querySelector('section.posts')) {
        setTimeout(shuffleArticles, 100);
      }
    };
    if (document.readyState !== 'loading') {
      readyHandler();
    } else {
      document.addEventListener('DOMContentLoaded', readyHandler);
    }
    const now = new Date();
    const nextMidnight = new Date(now);
    nextMidnight.setDate(now.getDate() + 1);
    nextMidnight.setHours(0, 0, 0, 0);
    setTimeout(() => {
      try {
        window.location.reload();
      } catch (e) {
        console.error('自动刷新失败:', e);
      }
    }, nextMidnight - now);
  }
  initShuffle();
})(); 