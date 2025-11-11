// 音乐播放器主逻辑
(function() {
  'use strict';

  // DOM 元素
  const openBtn = document.getElementById('open-player');
  const panel = document.getElementById('player-panel');
  const audio = document.getElementById('persistent-audio');
  const btnPlay = document.getElementById('btn-play');
  const btnPrev = document.getElementById('btn-prev');
  const btnNext = document.getElementById('btn-next');
  const btnMode = document.getElementById('btn-mode');
  const btnPlaylist = document.getElementById('btn-playlist');
  const playIcon = document.getElementById('play-icon');
  const modeIcon = document.getElementById('mode-icon');
  const progressBar = document.getElementById('progress-bar');
  const volumeBar = document.getElementById('volume-bar');
  const currentTimeEl = document.getElementById('current-time');
  const durationEl = document.getElementById('duration');
  const trackTitleEl = document.getElementById('player-title');
  const trackArtistEl = document.getElementById('player-artist');
  const playlistEl = document.getElementById('playlist');
  const playlistContainer = document.getElementById('playlist-container');

  // 播放器状态
  let playlist = [];
  let currentIndex = 0;
  let playMode = 'order'; // 'order', 'shuffle', 'loop-one'
  let isPlaying = false;
  let userInteracted = false;

  // 初始化
  async function init() {
    // 检查必需的DOM元素
    if (!openBtn || !panel || !audio) {
      console.error('音乐播放器: 缺少必需的DOM元素');
      return;
    }
    
    // 加载播放列表
    await loadPlaylist();
    
    // 恢复上次状态
    restoreState();
    
    // 绑定事件
    bindEvents();
    
    // 初始化播放器并尝试自动播放
    await attemptAutoplay();
  }

  // 从 music 文件夹加载播放列表
  async function loadPlaylist() {
    try {
      // 根据实际的音频文件列表生成播放列表
      // 格式：歌名-歌手.mp3
      const musicFiles = [
        '0：00-vezyle.mp3',
        'a heart-novembeby.mp3',
        'Airplane Mode-Hayd.mp3',
        'AME TO SAKURA-Seto.mp3',
        'Bedford Falls-ford.mp3',
        'Blinded-Emmit Fenn.mp3',
        'Born a Stranger-Kan R. Gao.mp3',
        'crybaby-Seto.mp3',
        'Daylight-Seredris.mp3',
        'Echoes-Kazukii.mp3',
        'exist-nekoi.mp3',
        'Free With You-Rnla  yaeow.mp3',
        'Glass-Nekoi.mp3',
        'Hollow-Cardinal.mp3',
        'how to live-yaeow  Powfu  Sarcastic Sounds.mp3',
        'I Need U-yaeow.mp3',
        'III-Athletics.mp3',
        'In Another Lifetime-Bolshiee.mp3',
        'it\'s 6pm but I miss u already-BlueLee  Furyl  Siren.mp3',
        'Journey to the Peace (平静之旅）-Kirsty刘瑾睿.mp3',
        'Lucky Final-go missing.mp3',
        'MELANCHOLY-White Cherry.mp3',
        'Merry Christmas Mr. Lawrence-坂本龍一.mp3',
        'Remember Me-Kozoro.mp3',
        'Run-yuuca.mp3',
        'Sacred Play Secret Place-Matryoshka.mp3',
        'savior-Beowülf.mp3',
        'The truth that you leavePianoboy-高至豪.mp3',
        'The Winner Is-Mychael Danna.mp3',
        'XoXo-Waitd  Josuly.mp3',
        'ᐇ-Seto.mp3',
        '∌-go missing.mp3',
        '三葉のテーマ-RADWIMPS.mp3',
        '宝石-別野加奈.mp3',
        '我的世界是个垃圾场，但你选择留下-黄雨篱.mp3',
        '站台 The Platform-royster lee.mp3',
        '诀别书-邓垚.mp3'
      ];

      playlist = musicFiles.map((filename, index) => {
        const parts = filename.replace('.mp3', '').split('-');
        const title = parts[0] || '未知歌曲';
        const artist = parts[1] || '未知艺术家';
        
        return {
          id: index,
          src: `music/${filename}`,
          title: title.trim(),
          artist: artist.trim()
        };
      });

      // 如果没有歌曲，添加一个占位
      if (playlist.length === 0) {
        console.warn('播放列表为空，请在 player.js 中添加音乐文件');
      }

      renderPlaylist();
    } catch (err) {
      console.error('加载播放列表失败:', err);
    }
  }

  // 渲染播放列表
  function renderPlaylist() {
    playlistEl.innerHTML = '';
    playlist.forEach((track, index) => {
      const li = document.createElement('li');
      li.textContent = `${track.title} - ${track.artist}`;
      li.dataset.index = index;
      if (index === currentIndex) {
        li.classList.add('active');
      }
      li.addEventListener('click', (e) => {
        e.stopPropagation(); // 阻止事件冒泡，避免触发关闭面板
        playTrack(index);
        // 不再自动关闭播放列表，用户可以继续选择其他歌曲
      });
      playlistEl.appendChild(li);
    });
  }

  // 绑定事件
  function bindEvents() {
    // 打开/关闭播放器面板
    openBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      togglePanel();
    });

    // 点击面板外部关闭
    document.addEventListener('click', (e) => {
      if (!panel.classList.contains('hidden') && 
          !panel.contains(e.target) && 
          !openBtn.contains(e.target)) {
        hidePanel();
      }
    });

    // 阻止面板内部点击冒泡
    panel.addEventListener('click', (e) => {
      e.stopPropagation();
    });

    // ESC 键关闭面板
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && !panel.classList.contains('hidden')) {
        hidePanel();
      }
    });

    // 播放/暂停
    btnPlay.addEventListener('click', () => {
      togglePlay();
    });

    // 上一首
    btnPrev.addEventListener('click', () => {
      prevTrack();
    });

    // 下一首
    btnNext.addEventListener('click', () => {
      nextTrack();
    });

    // 播放模式切换
    btnMode.addEventListener('click', () => {
      cyclePlayMode();
    });

    // 播放列表切换
    btnPlaylist.addEventListener('click', () => {
      playlistContainer.classList.toggle('hidden');
    });

    // 进度条
    progressBar.addEventListener('input', (e) => {
      const time = (e.target.value / 100) * audio.duration;
      audio.currentTime = time;
    });

    // 音量
    volumeBar.addEventListener('input', (e) => {
      audio.volume = e.target.value / 100;
      saveState();
    });

    // Audio 事件
    audio.addEventListener('timeupdate', updateProgress);
    audio.addEventListener('loadedmetadata', updateDuration);
    audio.addEventListener('ended', onTrackEnded);
    audio.addEventListener('play', () => {
      isPlaying = true;
      playIcon.textContent = '⏸';
      openBtn.classList.add('playing');
      btnPlay.classList.add('playing'); // 添加playing class用于CSS样式控制
    });
    audio.addEventListener('pause', () => {
      isPlaying = false;
      playIcon.textContent = '▶';
      openBtn.classList.remove('playing');
      btnPlay.classList.remove('playing'); // 移除playing class
    });
  }

  // 切换面板显示
  function togglePanel() {
    const isHidden = panel.classList.contains('hidden');
    
    if (isHidden) {
      showPanel();
    } else {
      hidePanel();
    }
  }

  // 显示面板
  function showPanel() {
    panel.classList.remove('hidden');
    openBtn.setAttribute('aria-expanded', 'true');
  }

  // 隐藏面板
  function hidePanel() {
    panel.classList.add('hidden');
    openBtn.setAttribute('aria-expanded', 'false');
    
    // 同时隐藏播放列表
    if (playlistContainer && !playlistContainer.classList.contains('hidden')) {
      playlistContainer.classList.add('hidden');
    }
  }

  // 播放指定曲目
  function playTrack(index, autoPlay = true) {
    if (index < 0 || index >= playlist.length) return;
    
    currentIndex = index;
    const track = playlist[currentIndex];
    
    // 更新 UI
    trackTitleEl.textContent = track.title;
    trackArtistEl.textContent = track.artist;
    
    // 更新播放列表高亮
    document.querySelectorAll('#playlist li').forEach((li, i) => {
      li.classList.toggle('active', i === currentIndex);
    });
    
    // 加载音频
    audio.src = track.src;
    audio.load();
    
    // 只在需要时尝试播放
    if (autoPlay) {
      attemptPlay();
    }
    
    saveState();
  }

  // 尝试播放
  async function attemptPlay() {
    try {
      await audio.play();
      userInteracted = true;
      localStorage.setItem('ozy_user_interacted', '1');
    } catch (err) {
      // 自动播放被阻止是正常的，不影响其他功能
      // console.warn('自动播放被阻止:', err.message);
    }
  }

  // 切换播放/暂停
  function togglePlay() {
    if (audio.paused) {
      attemptPlay();
    } else {
      audio.pause();
    }
  }

  // 上一首
  function prevTrack() {
    let newIndex = currentIndex - 1;
    if (newIndex < 0) {
      newIndex = playlist.length - 1;
    }
    playTrack(newIndex);
  }

  // 下一首
  function nextTrack() {
    let newIndex;
    
    if (playMode === 'shuffle') {
      // 随机播放
      newIndex = Math.floor(Math.random() * playlist.length);
    } else if (playMode === 'loop-one') {
      // 单曲循环
      newIndex = currentIndex;
    } else {
      // 顺序播放
      newIndex = currentIndex + 1;
      if (newIndex >= playlist.length) {
        newIndex = 0;
      }
    }
    
    playTrack(newIndex);
  }

  // 曲目播放结束
  function onTrackEnded() {
    if (playMode === 'loop-one') {
      audio.currentTime = 0;
      attemptPlay();
    } else {
      nextTrack();
    }
  }

  // 循环切换播放模式
  function cyclePlayMode() {
    const modes = ['order', 'shuffle', 'loop-one'];
    const currentModeIndex = modes.indexOf(playMode);
    const nextModeIndex = (currentModeIndex + 1) % modes.length;
    playMode = modes[nextModeIndex];
    
    // 更新图标和提示
    switch(playMode) {
      case 'order':
        modeIcon.textContent = '🔁';
        btnMode.title = '顺序播放';
        break;
      case 'shuffle':
        modeIcon.textContent = '🔀';
        btnMode.title = '随机播放';
        break;
      case 'loop-one':
        modeIcon.textContent = '🔂';
        btnMode.title = '单曲循环';
        break;
    }
    
    saveState();
  }

  // 更新进度条
  function updateProgress() {
    if (!audio.duration) return;
    const percent = (audio.currentTime / audio.duration) * 100;
    progressBar.value = percent;
    currentTimeEl.textContent = formatTime(audio.currentTime);
  }

  // 更新时长显示
  function updateDuration() {
    durationEl.textContent = formatTime(audio.duration);
  }

  // 格式化时间
  function formatTime(seconds) {
    if (!seconds || isNaN(seconds)) return '0:00';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  }

  // 初始化播放器状态并尝试自动播放
  async function attemptAutoplay() {
    if (playlist.length === 0) return;
    
    // 检查是否之前有用户交互
    const hadInteraction = localStorage.getItem('ozy_user_interacted');
    
    if (hadInteraction) {
      // 如果之前有交互,加载并尝试自动播放
      playTrack(currentIndex, true);
    } else {
      // 首次访问,只加载不播放
      playTrack(currentIndex, false);
      // 尝试静音播放来触发用户交互检测
      audio.muted = true;
      try {
        await audio.play();
        audio.pause();
        audio.muted = false;
        audio.currentTime = 0;
        // 如果成功,说明允许自动播放
        playTrack(currentIndex, true);
        localStorage.setItem('ozy_user_interacted', '1');
      } catch (err) {
        // 自动播放被阻止,保持静音状态
        audio.muted = false;
      }
    }
  }

  // 保存状态
  function saveState() {
    localStorage.setItem('player_index', currentIndex);
    localStorage.setItem('player_time', audio.currentTime);
    localStorage.setItem('player_volume', audio.volume);
    localStorage.setItem('player_mode', playMode);
  }

  // 恢复状态
  function restoreState() {
    const savedIndex = localStorage.getItem('player_index');
    const savedVolume = localStorage.getItem('player_volume');
    const savedMode = localStorage.getItem('player_mode');
    
    if (savedIndex !== null) {
      currentIndex = Math.max(0, Math.min(parseInt(savedIndex), playlist.length - 1));
    }
    
    if (savedVolume !== null) {
      audio.volume = parseFloat(savedVolume);
      volumeBar.value = audio.volume * 100;
    } else {
      audio.volume = 0.7;
      volumeBar.value = 70;
    }
    
    if (savedMode) {
      playMode = savedMode;
      // 更新模式图标
      switch(playMode) {
        case 'shuffle':
          modeIcon.textContent = '🔀';
          btnMode.title = '随机播放';
          break;
        case 'loop-one':
          modeIcon.textContent = '🔂';
          btnMode.title = '单曲循环';
          break;
        default:
          modeIcon.textContent = '🔁';
          btnMode.title = '顺序播放';
      }
    }
  }

  // 定期保存状态
  setInterval(() => {
    if (isPlaying) {
      saveState();
    }
  }, 5000);

  // 页面卸载前保存状态
  window.addEventListener('beforeunload', saveState);

  // 页面加载完成后初始化
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
