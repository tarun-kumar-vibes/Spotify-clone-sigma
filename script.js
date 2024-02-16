let currentsong = new Audio();

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
    // let audio = new Audio("/Spotify clone sigma/songs/" + track);
    currentsong.src = "/Spotify clone sigma/songs/" + track;
    if (!pause) {
        currentsong.play();
        playsong.src = "images/pause.svg";
    }
    document.querySelector(".songinfo").innerHTML = decodeURI(track);
    document.querySelector(".songtime").innerHTML = "00:00 / 00:00";

}

async function main() {

    let songs = await getsongs();
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
            console.log(e.querySelector(".info").firstElementChild.innerHTML.trim());
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
        console.log(currentsong.currentTime, currentsong.duration);
        document.querySelector(".songtime").innerHTML = `${secondsToMinutesSeconds(currentsong.currentTime)}/${secondsToMinutesSeconds(currentsong.duration)}`;
        document.querySelector(".circle").style.left = (currentsong.currentTime / currentsong.duration) * 100 + "%";
    })

    currentsong.addEventListener("loadedmetadata", () => {
        document.querySelector(".songtime").innerHTML = `${secondsToMinutesSeconds(currentsong.currentTime)}/${secondsToMinutesSeconds(currentsong.duration)}`;
    })

    document.querySelector(".seekbar").addEventListener("click", e => {
        let percent = (e.offsetX/e.target.getBoundingClientRect().width) * 100;
        document.querySelector(".circle").style.left = percent + "%";
        currentsong.currentTime = (percent * currentsong.duration) / 100;
    });

    document.querySelector(".hamburger").addEventListener("click", ()=> {
        document.querySelector(".left").style.left = 0;
    })

    document.getElementById("closehamburger").addEventListener("click", ()=> {
        document.querySelector(".left").style.left = "-" + 110 + "%";
    })
}

main()