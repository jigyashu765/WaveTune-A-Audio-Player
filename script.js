document.addEventListener('DOMContentLoaded', function () {
    'use strict';

    var index = 0,
        playing = false,
        mediaPath = './songs/',
        extension = '',
        songs = [
            { songName: "Warriyo - Mortals [NCS Release]", filePath: "1", coverPath: "covers/1.jpg" },
            { songName: "Cielo - Huma-Huma", filePath: "2", coverPath: "covers/2.jpg" },
            { songName: "DEAF KEV - Invincible [NCS Release]-320k", filePath: "3", coverPath: "covers/3.jpg" },
            { songName: "Different Heaven & EH!DE - My Heart [NCS Release]", filePath: "4", coverPath: "covers/4.jpg" },
            { songName: "Janji-Heroes-Tonight-feat-Johnning-NCS-Release", filePath: "5", coverPath: "covers/5.jpg" },
            { songName: "Rabba - Salam-e-Ishq", filePath: "6", coverPath: "covers/6.jpg" },
            { songName: "Sakhiyaan - Salam-e-Ishq", filePath: "7", coverPath: "covers/7.jpg" },
            { songName: "Bhula Dena - Salam-e-Ishq", filePath: "8", coverPath: "covers/8.jpg" },
            { songName: "Tumhari Kasam - Salam-e-Ishq", filePath: "9", coverPath: "covers/9.jpg" },
            { songName: "Na Jaana - Salam-e-Ishq", filePath: "10", coverPath: "covers/10.jpg" }
        ],
        songCount = songs.length,
        npAction = document.getElementById('npAction'),
        npTitle = document.getElementById('npTitle'),
        audio = document.getElementById('audio1'),
        btnPrev = document.getElementById('btnPrev'),
        btnNext = document.getElementById('btnNext'),
        btnPlayPause = document.getElementById('btnPlayPause'),
        plList = document.getElementById('plList'),
        progressBar = document.getElementById('progressBar'),
        currentTimeSpan = document.getElementById('currentTime'),
        durationSpan = document.getElementById('duration'),
        volumeBtn = document.getElementById('volumeBtn'),
        volumeBar = document.getElementById('volumeBar');

    // Build playlist
    songs.forEach(function (song, key) {
        var songNumber = (key + 1).toString().padStart(2, '0');

        // Create list item
        var li = document.createElement('li');
        li.innerHTML = `
        <div class="plItem">
            <div class="plItem-left">
                <span class="plNum">${songNumber}.</span>
                <img class="img" src="${song.coverPath}">
                <span class="plTitle">${song.songName}</span>
            </div>
            <div class="plItem-right">
                <span class="plDuration">Loading...</span>
            </div>
        </div>`;

        // Append the list item to the playlist
        plList.appendChild(li);


        // Get and display the duration
        getDuration("./songs/" + song.filePath + ".mp3", function (duration) {
            li.querySelector('.plDuration').textContent = duration;
        });
    });

    var liElements = plList.querySelectorAll('li');

    // Function to get the duration of a song
    function getDuration(src, callback) {
        var audio = new Audio(src);
        audio.addEventListener("loadedmetadata", function () {
            let length = audio.duration;
            let hrs = Math.floor(length / 3600);
            let mins = Math.floor((length % 3600) / 60);
            let secs = Math.floor(length % 60);

            // Format the duration
            let formattedTime = `${mins}:${secs < 10 ? '0' : ''}${secs}`;
            if (hrs > 0) {
                formattedTime = `${hrs}:${mins < 10 ? '0' : ''}${mins}:${secs < 10 ? '0' : ''}${secs}`;
            }

            callback(formattedTime);
        });
    }


    // Handle play/pause
    btnPlayPause.addEventListener('click', function () {
        if (playing) {
            audio.pause();
        } else {
            audio.play();
        }
    });

    audio.addEventListener('play', function () {
        playing = true;
        addRotation(index);
        btnPlayPause.className = 'bi bi-pause-btn-fill';
        npAction.textContent = 'Now Playing...';
    });

    audio.addEventListener('pause', function () {
        playing = false;
        btnPlayPause.className = 'bi bi-play-fill';
        npAction.textContent = 'Paused...';
    });

    audio.addEventListener('ended', function () {
        npAction.textContent = 'Paused...';
        clearRotation();
        if (index + 1 < songCount) {
            index++;
            loadTrack(index);
            audio.play();
        } else {
            audio.pause();
            index = 0;
            loadTrack(index);
        }
    });

    // Previous button
    btnPrev.addEventListener('click', function () {
        progressBar.style.width = 0 + "%";
        if (index > 0) {
            index--;
            loadTrack(index);
            if (playing) audio.play();
        } else {
            audio.pause();
            index = 0;
            loadTrack(index);
        }
    });

    // Next button
    btnNext.addEventListener('click', function () {
        progressBar.style.width = 0 + "%";
        if (index < songCount - 1) {
            index++;
            loadTrack(index);
            if (playing) audio.play();
            clearRotation();
        } else {
            audio.pause();
            index = 0;
            loadTrack(index);
        }
    });

    // Click on playlist item
    liElements.forEach(function (li, i) {
        li.addEventListener('click', function () {
            if (i !== index) {
                playTrack(i);
            }
        });
    });

    function loadTrack(id) {
        var selectedLi = document.querySelector('.plSel');
        if (selectedLi) selectedLi.classList.remove('plSel');

        liElements[id].classList.add('plSel');
        npTitle.textContent = songs[id].songName;
        index = id;
        audio.src = mediaPath + songs[id].filePath + extension;

        // Clear and add rotation
        if (audio.play()) {
            addRotation(id);
        }
        clearRotation();
    }

    function playTrack(id) {
        loadTrack(id);

        audio.play();
    }

    // Progress bar update
    audio.addEventListener('timeupdate', function () {
        const progress = (audio.currentTime / audio.duration) * 100;
        progressBar.value = progress;
        updateTimeDisplay(audio.currentTime, currentTimeSpan);
    });

    // Seeking functionality
    progressBar.addEventListener('input', function () {
        const seekTime = (progressBar.value / 100) * audio.duration;
        audio.currentTime = seekTime;
    });

    audio.addEventListener('timeupdate', function () {
        const progress = (audio.currentTime / audio.duration) * 100;
        const progressBar = document.getElementById('progressBar');
        progressBar.style.width = progress + '%';
    });

    // Allow the user to seek through the audio (optional with click event)
    document.getElementById('progressContainer').addEventListener('click', function (e) {
        const containerWidth = this.offsetWidth;
        const clickX = e.offsetX;
        const newTime = (clickX / containerWidth) * audio.duration;
        audio.currentTime = newTime;
    });


    // Volume control
    volumeBar.addEventListener('input', function () {
        audio.volume = volumeBar.value;
    });

    volumeBtn.addEventListener('click', function () {
        audio.muted = !audio.muted;
        volumeBtn.className = audio.muted ? 'bi bi-volume-mute-fill' : 'bi bi-volume-up-fill';
    });

    // Metadata loaded event to update duration
    audio.addEventListener('loadedmetadata', function () {
        updateTimeDisplay(audio.duration, durationSpan);
    });

    // Helper function to format time
    function updateTimeDisplay(time, element) {
        const minutes = Math.floor(time / 60);
        const seconds = Math.floor(time % 60).toString().padStart(2, '0');
        element.textContent = `${minutes}:${seconds}`;
        addRotation()
    }

    // Clear rotation from all images
    function clearRotation() {
        document.querySelectorAll('.img').forEach(function (img) {
            img.classList.remove('rotate');
        });
    }

    // Add rotation from all images
    function addRotation(id) {
        document.querySelectorAll('.img')[id].classList.add('rotate');
    }

    extension = audio.canPlayType('audio/mpeg') ? '.mp3' : audio.canPlayType('audio/ogg') ? '.ogg' : '';
    loadTrack(index);

    var year = new Date;
    document.getElementById("todayYear").innerText = year.getFullYear();

});
