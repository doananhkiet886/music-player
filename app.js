/**
 * 1. Create songs contain all song -> OK
 * 2. Load song to UI -> OK
 * 3. Playing song -> OK
 * 4. Pause song -> OK
 * 5. Rotate cd -> OK
 * 6. Progress bar -> OK
 * 7. Play previous song -> OK
 * 8. Play next song -> OK
 * 9. Repeat song -> OK
 * 10. Random song -> OK
 * 11. Next song when song ends -> OK
 * 12. Scroll down make cd is zoom in or zoom out
 * 13. Makeup song is playing on playlist
 */

const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);

const app = {
    isPlaying: false,
    isRepeat: false,
    isRandom: false,
    currentIndex: 0,
    songs: [
        {
            name: 'I Do',
            singer: '911',
            img: './assets/img/i_do.png',
            path: './assets/music/i_do_911.mp3'
        },
        {
            name: 'Nevada',
            singer: 'Vicetone',
            img: './assets/img/nevada.png',
            path: './assets/music/nevada_vicetone.mp3'
        },
        {
            name: 'SummerTime',
            singer: 'Lana Del',
            img: './assets/img/summertime.png',
            path: './assets/music/summertime_lana-del.mp3'
        },
        {
            name: '4 Mùa Thương Em',
            singer: 'Lập Nguyễn',
            img: './assets/img/4_mua_thuong_em.png',
            path: './assets/music/4_mua_thuong_em_lap-nguyen.mp3'
        },
        {
            name: 'Đếm Ngày Xa em',
            singer: 'Only C',
            img: './assets/img/dem_ngay_xa_em.png',
            path: './assets/music/dem_ngay_xa_em_only-c.mp3'
        },
        {
            name: 'Ghé Qua',
            singer: 'Dic & PC & Tofu',
            img: './assets/img/ghe_qua.png',
            path: './assets/music/ghe_qua_dic-pc-tofu.mp3'
        }
    ],

    defineProperties: function () {
        Object.defineProperty(this, 'currentSong', {
            get: function () {
                return this.songs[this.currentIndex];
            }
        })
    },

    renderHTML: function () {
        const html = this.songs.map(function (song, index) {
            return `
                <li class="song-item">
                    <div class="song-item__cd">
                        <div class="song-item__thumbnail"
                        style="background-image: url('${song.img}')">
                        </div>
                    </div>

                    <div class="song-item__title">
                        <h3 class="song-item__name">${song.name}</h3>
                        <p class="song-item__singer">${song.singer}</p>
                    </div>

                    <div class="options">
                        <i class="fa-solid fa-ellipsis"></i>
                    </div>
                </li>
            `;
        }).join('');
        $('.song-list').innerHTML = html;
    },

    loadCurrentSong: function () {
        const songName = $('.dashboard__song-name');
        const songThumbnail = $('.dashboard__thumbnail');
        const audio = $('.audio');

        songName.innerText = this.currentSong.name;
        songThumbnail.style.backgroundImage = `url('${this.currentSong.img}')`;
        audio.src = this.currentSong.path;
    },

    previousSong: function () {
        this.currentIndex--;
        if (this.currentIndex < 0) {
            this.currentIndex = this.songs.length - 1;
        }
        this.loadCurrentSong();
    },

    nextSong: function () {
        this.currentIndex++;
        if (this.currentIndex >= this.songs.length) {
            this.currentIndex = 0;
        }
        this.loadCurrentSong();
    },

    randomSong: function () {
        let newIndex;
        do {
            newIndex = Math.floor(Math.random() * this.songs.length);
        } while (newIndex === this.currentIndex)
        this.currentIndex = newIndex;
        this.loadCurrentSong();
    },

    handleEvents: function () {
        const _this = this;
        const btnPlayPause = $('.btn-play-pause');
        const playIcon = $('.play-icon');
        const pauseIcon = $('.pause-icon');
        const audio = $('.audio');
        const cdThumbnail = $('.dashboard__thumbnail');
        const progress = $('.dashboard__progress');
        const previousBtn = $('.btn-prev');
        const nextBtn = $('.btn-next');
        const repeatBtn = $('.btn-repeat');
        const randomBtn = $('.btn-random');
        const cdThumbnailWidth = cdThumbnail.offsetWidth;
        
        // handle playing/pause song
        btnPlayPause.onclick = function () {
            if (_this.isPlaying) {
                audio.pause();
            } else {
                audio.play();
            }
        };
        audio.onplay = function () {
            playIcon.classList.remove('play-icon--show');
            pauseIcon.classList.add('pause-icon--show');
            cdThumbnailAnimate.play()
            _this.isPlaying = true;
        };
        audio.onpause = function () {
            pauseIcon.classList.remove('pause-icon--show');
            playIcon.classList.add('play-icon--show');
            cdThumbnailAnimate.pause();
            _this.isPlaying = false;
        };

        // handle rotate cd thumbnail
        const cdThumbnailAnimate = cdThumbnail.animate([
            { transform: 'rotate(360deg)' }
        ], {
            duration: 10000,
            iterations: Infinity
        });
        cdThumbnailAnimate.pause();

        // handle progress bar when the song progress changes
        audio.ontimeupdate = function () {
            const currentTimePercent = this.currentTime / this.duration * 100;
            if (currentTimePercent) {
                progress.value = currentTimePercent;
            }
        };

        // handle progress bar when drag
        progress.onchange = function () {
            const currentMiliseconds = progress.value * audio.duration / 100;
            audio.currentTime = currentMiliseconds;
        }

        // handle click previous song
        previousBtn.onclick = function () {
            if (_this.isRandom) {
                _this.randomSong();
            } else {
                _this.previousSong()
            }
            audio.play();
        }

        // handle click next song
        nextBtn.onclick = function () {
            if (_this.isRandom) {
                _this.randomSong();
            } else {
                _this.nextSong();
            }
            audio.play();
        }

        // handle repeat song
        repeatBtn.onclick = function () {
            _this.isRepeat = !_this.isRepeat;
            repeatBtn.classList.toggle('btn-repeat--active');
        }

        // handle random song
        randomBtn.onclick = function () {
            _this.isRandom = !_this.isRandom;
            randomBtn.classList.toggle('btn-random--active');
        }

        // handle when song ends
        audio.onended = function () {
            if (_this.isRepeat) {
                audio.load();
            } else {
                _this.nextSong();
            }
            audio.play();
        }

        // handle scroll down/up make cd thumbnail is zoom in or zoom out
        document.onscroll = function (e) {
            const scrollTop = window.scrollY || document.documentElement.scrollTop;
            let newWidth = cdThumbnailWidth - scrollTop;
            if (newWidth < 0) {
                newWidth = 0;
            }
            cdThumbnail.style.width = newWidth + 'px';
        }
    },

    start: function () {
        this.defineProperties();
        this.renderHTML();
        this.loadCurrentSong();
        this.handleEvents();
    }
}

app.start();