document.addEventListener('DOMContentLoaded', () => {
  const stations = [
    { id: 'radio1', name: 'Rádió 1', artist: 'Pop & Sláger', src: 'https://icast.connectmedia.hu/5201/live.mp3' },
    { id: 'petofi', name: 'Petőfi Rádió', artist: 'Mai Zene & Pop', src: 'https://icast.connectmedia.hu/4738/mr2.mp3' },
    { id: 'foxradio', name: 'Fox Radio', artist: 'Klasszikus Slágerek', src: 'http://stream.foxradio.rs:8545/;stream' },
    { id: 'csukas', name: 'Csukás Meserádió', artist: 'Gyermek & Mese', src: 'https://mr-stream.connectmedia.hu/4611/mr10.mp3' },
    { id: 'momo_zene', name: 'Momó Gyerekrádió', artist: 'Gyermekzene', src: 'https://s03.diazol.hu:7092/zene.mp3' },
    { id: 'momo_mese', name: 'Momó Meserádió', artist: 'Esti Mesék & Hangoskönyv', src: 'https://s03.diazol.hu:7092/mese.mp3' },
    { id: 'pluszfm', name: 'Plusz FM', artist: 'Nagyvárad Stream', src: 'https://stream2.radiotransilvania.ro/Nagyvarad' },
    { id: 'danubius', name: 'Danubius Rádió', artist: 'Pop & Slágerek', src: 'https://stream.danubiusradio.hu:443/danubius_192k' },
    { id: 'slager', name: 'Sláger FM', artist: 'Klasszikus Slágerek', src: 'https://slagerfm.netregator.hu:7813/slagerfm128.mp3' },
    { id: 'forras', name: 'Forrás Rádió', artist: 'Helyi Slágerek', src: 'http://91.82.85.44:1630/forrasradio.mp3' },
    { id: 'retro', name: 'Retro Rádió', artist: 'Retro Slágerek', src: 'https://icast.connectmedia.hu/5001/live.mp3' },
    { id: 'kossuth', name: 'Kossuth Rádió', artist: 'Hírek & Beszélgetés', src: 'https://icast.connectmedia.hu/4724/mr1ex.aac' },
    { id: 'bartok', name: 'Bartók Rádió', artist: 'Klasszikus Zene', src: 'https://icast.connectmedia.hu/4739/mr3.aac' },
    { id: 'danko', name: 'Dankó Rádió', artist: 'Népzene & Magyarnóta', src: 'https://icast.connectmedia.hu/4747/mr7.aac' },
    { id: 'maria', name: 'Mária Rádió', artist: 'Keresztény & Lélek', src: 'http://www.mariaradio.hu:8000/mr' }
  ];

  let favorites = JSON.parse(localStorage.getItem('radio_favs') || '[]');

  const audio = document.getElementById('master-audio');
  if (audio) audio.volume = 0.8;
  
  const miniFloating = document.getElementById('global-miniplayer');
  const miniExpandBtn = document.getElementById('mini-expand-btn');
  const miniPlayBtn = document.getElementById('mini-play-btn');
  const miniSleepBtn = document.getElementById('mini-sleep-btn');
  const miniTimerBadge = document.getElementById('mini-timer-badge');
  const miniPlaylistEl = document.getElementById('mini-playlist');
  const miniSearchInput = document.getElementById('mini-playlist-search');
  const miniNoResults = document.getElementById('mini-no-results');
  const miniTitle = document.getElementById('mini-title');
  const miniArtist = document.getElementById('mini-artist');
  const miniAvatar = document.getElementById('mini-avatar');
  const miniMuteBtn = document.getElementById('mini-mute-btn');
  const miniVolumeSlider = document.getElementById('mini-volume-slider');

  let currentIndex = 0;
  let lastVolume = 0.8;
  let sleepTimer = null;
  let sleepMinutesLeft = 0;

  // Kezdeti nyíl beállítás (felfelé mutat zárva)
  if (miniExpandBtn) miniExpandBtn.textContent = '▲';

  function renderMiniPlaylist() {
    if (!miniPlaylistEl) return;
    miniPlaylistEl.innerHTML = '';
    const sorted = [...stations].sort((a, b) => favorites.includes(b.id) - favorites.includes(a.id));

    sorted.forEach((st) => {
      const realIndex = stations.findIndex(s => s.id === st.id);
      const isFav = favorites.includes(st.id);

      const li = document.createElement('li');
      li.className = `mini-playlist-item ${realIndex === currentIndex ? 'active' : ''}`;
      
      li.innerHTML = `
        <div class="mini-item-avatar">📻</div>
        <div class="mini-item-info">
          <span class="mini-item-title">${st.name}</span>
          <span class="mini-item-artist">${st.artist}</span>
        </div>
        <button class="fav-btn ${isFav ? 'is-fav' : ''}" data-id="${st.id}" style="background:none; border:none; font-size:13px; cursor:pointer; color:${isFav ? '#ef4444' : '#64748b'}; transition:0.2s;" title="Kedvenc">❤</button>
      `;

      li.addEventListener('click', (e) => {
        if (e.target.classList.contains('fav-btn')) return;
        loadTrack(realIndex);
        playAudio();
      });

      li.querySelector('.fav-btn').addEventListener('click', (e) => {
        e.stopPropagation();
        toggleFavorite(st.id);
      });

      miniPlaylistEl.appendChild(li);
    });
  }

  function toggleFavorite(id) {
    favorites = favorites.includes(id) ? favorites.filter(favId => favId !== id) : [...favorites, id];
    localStorage.setItem('radio_favs', JSON.stringify(favorites));
    renderMiniPlaylist();
  }

  function loadTrack(index, autoplay = false) {
    const st = stations[index];
    if (!st || !audio) return;

    currentIndex = index;
    if (audio.src !== st.src) {
      audio.src = st.src;
    }

    if (miniTitle) miniTitle.textContent = st.name;
    if (miniArtist) miniArtist.textContent = st.artist;
    if (miniAvatar) miniAvatar.textContent = '📻';

    renderMiniPlaylist();

    if (autoplay) {
      playAudio();
    }
  }

  function playAudio() {
    if (!audio) return;
    audio.play().then(() => {
      if (miniPlayBtn) miniPlayBtn.textContent = '❚❚';
    }).catch(() => {
      if (miniPlayBtn) miniPlayBtn.textContent = '▶';
    });
  }

  function pauseAudio() {
    if (!audio) return;
    audio.pause();
    if (miniPlayBtn) miniPlayBtn.textContent = '▶';
  }

  if (miniPlayBtn) {
    miniPlayBtn.addEventListener('click', () => {
      if (audio.paused) {
        if (!audio.src || audio.src === window.location.href) loadTrack(currentIndex, false);
        playAudio();
      } else {
        pauseAudio();
      }
    });
  }

  if (miniMuteBtn && miniVolumeSlider && audio) {
    miniMuteBtn.addEventListener('click', () => {
      if (audio.volume > 0) {
        lastVolume = audio.volume;
        audio.volume = 0;
        miniVolumeSlider.value = 0;
        miniMuteBtn.textContent = '🔇';
      } else {
        audio.volume = lastVolume;
        miniVolumeSlider.value = lastVolume;
        miniMuteBtn.textContent = '🔊';
      }
    });

    miniVolumeSlider.addEventListener('input', (e) => {
      audio.volume = e.target.value;
      miniMuteBtn.textContent = audio.volume == 0 ? '🔇' : '🔊';
    });
  }

  // Kinyitás/Bezárás és dinamikus nyílváltás (▲ / ▼)
  if (miniExpandBtn && miniFloating) {
    miniExpandBtn.addEventListener('click', () => {
      miniFloating.classList.toggle('expanded');
      const isExpanded = miniFloating.classList.contains('expanded');
      miniExpandBtn.textContent = isExpanded ? '▼' : '▲';
    });
  }

  const timerOptions = [0, 5, 15, 30, 45, 60];
  let timerIndex = 0;

  function handleTimerToggle() {
    timerIndex = (timerIndex + 1) % timerOptions.length;
    const mins = timerOptions[timerIndex];

    clearInterval(sleepTimer);
    if (mins === 0) {
      if (miniTimerBadge) miniTimerBadge.textContent = '';
      if (miniSleepBtn) miniSleepBtn.classList.remove('active');
    } else {
      sleepMinutesLeft = mins;
      if (miniTimerBadge) miniTimerBadge.textContent = `${sleepMinutesLeft}m`;
      if (miniSleepBtn) miniSleepBtn.classList.add('active');

      sleepTimer = setInterval(() => {
        sleepMinutesLeft--;
        if (sleepMinutesLeft <= 0) {
          clearInterval(sleepTimer);
          pauseAudio();
          if (miniTimerBadge) miniTimerBadge.textContent = '';
          if (miniSleepBtn) miniSleepBtn.classList.remove('active');
          timerIndex = 0;
        } else {
          if (miniTimerBadge) miniTimerBadge.textContent = `${sleepMinutesLeft}m`;
        }
      }, 60000);
    }
  }

  if (miniSleepBtn) miniSleepBtn.addEventListener('click', handleTimerToggle);

  if (miniSearchInput && miniNoResults) {
    miniSearchInput.addEventListener('input', (e) => {
      const query = e.target.value.toLowerCase().trim();
      const items = miniPlaylistEl.querySelectorAll('.mini-playlist-item');
      let visibleCount = 0;
      items.forEach(item => {
        const title = item.querySelector('.mini-item-title').textContent.toLowerCase();
        const artist = item.querySelector('.mini-item-artist').textContent.toLowerCase();
        if (title.includes(query) || artist.includes(query)) {
          item.style.display = 'flex';
          visibleCount++;
        } else {
          item.style.display = 'none';
        }
      });
      miniNoResults.style.display = visibleCount === 0 ? 'block' : 'none';
    });
  }

  loadTrack(0, false);
  renderMiniPlaylist();
});