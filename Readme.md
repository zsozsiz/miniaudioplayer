# Web Rádió Miniplayer

Ez egy modern, reszponzív, fixen lebegő online rádió miniplayer, amely Vanilla JavaScript-tel, CSS3-mal és a HTML5 Audio API-val készült. A komponens teljesen moduláris, így bármilyen külső weboldalba könnyedén beilleszthető.

## Főbb Funkciók és Tulajdonságok

* **Lebegő, egysoros dizájn:** Diszkréten helyezkedik el a képernyő jobb alsó sarkában (mobilon teljes szélességre igazodik).
* **Dinamikus adólista és kereső:** Valós idejű szűrés név és műfaj alapján.
* **Kedvencek kezelése (`LocalStorage`):** A kedvencnek jelölt adók automatikusan a lista tetejére rendeződnek, a státuszuk pedig megmarad oldalfrissítés után is.
* **Elalvási időzítő (Sleep Timer):** Választható időintervallumok (5, 15, 30, 45, 60 perc), amelyek leteltével automatikusan leállítja a lejátszást.
* **Hangerőszabályzó és némítás:** Finomhangolható csúszka és gyors némító gomb.
* **Dinamikus nyíl animáció:** Zárt állapotban felfelé (`▲`), kinyitott állapotban lefelé (`▼`) mutató indikátor.
* **Egyedi görgetősáv:** A miniplayer sötét arculatához illeszkedő vékony scrollbar.

---

## Fájlstruktúra

A működéshez mindössze három dologra van szükség:
1. `radio.css` – A lejátszó megjelenése és animációi.
2. `radio.js` – A lejátszás logikája, adólista, kereső és LocalStorage kezelés.
3. A HTML komponens kódja.

---

## Implementálási Útmutató (Bármilyen weboldalba)

Ha be szeretnéd építeni ezt a rádiót egy meglévő vagy új weboldalba, kövesd az alábbi 3 lépést:

### 1. Lépés: CSS stíluslap betöltése
Illeszd be a weboldalad `<head>` szekciójába a `radio.css` hivatkozását:
```html
<link rel="stylesheet" href="radio.css">
```

### 2. Lépés: HTML struktúra elhelyezése

Másold be a weboldalad **`<body>`** elemének a végébe (közvetlenül a lezáró **`</body>`** elé) az alábbi kódrészletet:

```html
<!-- GLOBÁLIS MASTER AUDIO -->
<audio id="master-audio" preload="auto"></audio>

<!-- GLOBÁLIS EGYSOROS MINIPLAYER -->
<div id="global-miniplayer" class="mini-player-floating">
  <div class="mini-row-main">
    <div id="mini-avatar" class="mini-avatar">📻</div>
    <div class="mini-info">
      <div id="mini-title" class="mini-title">Válassz adót</div>
      <div id="mini-artist" class="mini-artist">-</div>
    </div>
    <div class="mini-actions-inline">
      <button id="mini-sleep-btn" class="mini-btn-timer" title="Elalvási időzítő">⏱ <span id="mini-timer-badge"></span></button>
      <button id="mini-play-btn" class="mini-play-btn" title="Lejátszás/Szünet">▶</button>
      
      <div class="mini-volume-box">
        <button class="mini-btn-mute" id="mini-mute-btn" title="Némítás">🔊</button>
        <input type="range" id="mini-volume-slider" min="0" max="1" step="0.05" value="0.8">
      </div>

      <button id="mini-expand-btn" class="mini-expand-btn" title="Adólista">▲</button>
    </div>
  </div>

  <div class="mini-expandable-content">
    <div class="mini-search-box">
      <input type="text" id="mini-playlist-search" placeholder="Keresés...">
      <span class="search-icon">🔍</span>
    </div>
    <div class="mini-playlist-wrapper">
      <ul id="mini-playlist" class="mini-playlist"></ul>
      <div id="mini-no-results" class="mini-no-results" style="display: none;">Nincs találat</div>
    </div>
  </div>
</div>
```
### 3. Lépés: JavaScript fájl csatolása
Szintén a **`<body>`** végén, a HTML struktúra után töltsd be a scriptet:

```html
<script src="radio.js"></script>
```

## Új rádióállomások hozzáadása

A `radio.js` fájl elején található a stations tömb. Új adót a következő formátumban tudsz hozzáadni:
```js
{ 
  id: 'egyedi_id', 
  name: 'Rádió Neve', 
  artist: 'Műfaj vagy leírás', 
  src: '[https://stream-url-ide-jön.mp3](https://stream-url-ide-jön.mp3)', 
  logo: '[https://logo-kep-url-eloehuzva.png](https://logo-kep-url-eloehuzva.png)' 
}
```