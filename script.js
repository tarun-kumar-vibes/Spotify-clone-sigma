let currentsong = new Audio();
let songs;

function secondsToMinutesSeconds(seconds) {
    if (isNaN(seconds) || seconds < 0) {
        return "Invalid input!!";
    }

    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);

    const formattedMinutes = String(minutes).padStart(2, "0");
    const formattedSeconds = String(remainingSeconds).padStart(2, "0");

    return `${formattedMinutes}:${formattedSeconds}`;
}

async function getsongs() {
    let a = await fetch("http://127.0.0.1:3000/spotify%20clone%20sigma/songs/");
    let response = await a.text();
    let div = document.createElement("div");
    div.innerHTML = response;
    let as = div.getElementsByTagName("a");
    let songs = [];

    for (let index = 0; index < as.length; index++) {
        const element = as[index];
        if (element.href.endsWith(".mp3")) {
            songs.push(element.href.split("/songs/")[1]);
        }
    }
    return songs
}

const playMusic = (track, pause = false) => {
    currentsong.src = "/Spotify clone sigma/songs/" + track;
    if (!pause) {
        currentsong.play();
        playsong.src = "images/pause.svg";
    }
    document.querySelector(".songinfo").innerHTML = decodeURI(track);
    document.querySelector(".songtime").innerHTML = "00:00 / 00:00";
}

async function main() {

    songs = await getsongs();
    playMusic(songs[0], true);

    let songul = document.querySelector(".songlist").getElementsByTagName("ul")[0];
    for (const song of songs) {
        songul.innerHTML += `<li>
        <div class="songcardlib">
            <img class="invert" src="images/music.svg" alt="">
        </div>
        <div class="info">
            <div> ${song.replaceAll("%20", " ")}</div>
            <div>Tarun</div>
        </div>
        <div class="playnow">
            <img class="invert" src="images/play.svg" alt="">
        </div> 
    </li>`;
    }

    Array.from(document.querySelector(".songlist ").getElementsByTagName("li")).forEach(e => {
        e.addEventListener("click", element => {
            playMusic(e.querySelector(".info").firstElementChild.innerHTML.trim());
        })
    })


    playsong.addEventListener("click", () => {
        if (currentsong.paused) {
            currentsong.play();
            playsong.src = "images/pause.svg";
        } else {
            currentsong.pause();
            playsong.src = "images/play.svg";
        }
    })

    currentsong.addEventListener("timeupdate", () => {
        document.querySelector(".songtime").innerHTML = `${secondsToMinutesSeconds(currentsong.currentTime)}/${secondsToMinutesSeconds(currentsong.duration)}`;
        document.querySelector(".circle").style.left = (currentsong.currentTime / currentsong.duration) * 100 + "%";
    })

    currentsong.addEventListener("loadedmetadata", () => {
        document.querySelector(".songtime").innerHTML = `${secondsToMinutesSeconds(currentsong.currentTime)}/${secondsToMinutesSeconds(currentsong.duration)}`;
    })

    document.querySelector(".seekbar").addEventListener("click", e => {
        let percent = (e.offsetX / e.target.getBoundingClientRect().width) * 100;
        document.querySelector(".circle").style.left = percent + "%";
        currentsong.currentTime = (percent * currentsong.duration) / 100;
    });

    document.querySelector(".hamburger").addEventListener("click", () => {
        document.querySelector(".left").style.left = 0;
    })

    document.getElementById("closehamburger").addEventListener("click", () => {
        document.querySelector(".left").style.left = "-" + 110 + "%";
    })

    previoussong.addEventListener("click", () => {
        currentsong.pause();
        // console.log("Previous click");

        let index = songs.indexOf(currentsong.src.split("/").slice(-1)[0]);

        if (index - 1 >= 0) {
            playMusic(songs[index - 1]);
        }
    })

    nextsong.addEventListener("click", () => {
        currentsong.pause();
        // console.log("Next click");

        let index = songs.indexOf(currentsong.src.split("/").slice(-1)[0]);

        if ((index + 1) < songs.length) {
            playMusic(songs[index + 1]);
        }
    })

    const volumeInput = document.querySelector(".volume-container").getElementsByTagName("input")[0];
    const volumeIcon = document.querySelector("#volume");
    var previousvolume;

    const updateVolumeIcon = (volumeValue) => {
        if (volumeValue == 0) {
            volumeIcon.src = "images/zero-volume.svg";
        } else if (volumeValue > 0 && volumeValue < 70) {
            volumeIcon.src = "images/low-volume.svg";
        } else {
            volumeIcon.src = "images/high-volume.svg";
        }
    };

    const handleVolumeChange = (e) => {
        currentsong.volume = e.target.value / 100;
        updateVolumeIcon(e.target.value);
    };

    const handleVolumeIconClick = () => {
        if (currentsong.volume == 0) {
            currentsong.volume = (previousvolume);
            volumeInput.value = previousvolume * 100;
        } else {
            previousvolume = currentsong.volume;
            currentsong.volume = 0;
            volumeInput.value = 0;
        }

        updateVolumeIcon(currentsong.volume * 100);
    };

    volumeInput.addEventListener("change", handleVolumeChange);
    volumeIcon.addEventListener("click", handleVolumeIconClick);
}

main()