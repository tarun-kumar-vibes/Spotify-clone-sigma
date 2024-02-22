let currentsong = new Audio();
let songs;
let currfolder;

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

async function getsongs(folder) {
    currfolder = folder;
    let a = await fetch(`http://127.0.0.1:3000/spotify%20clone%20sigma/${currfolder}/`);
    let response = await a.text();
    let div = document.createElement("div");
    div.innerHTML = response;
    let as = div.getElementsByTagName("a");
    songs = [];

    for (let index = 0; index < as.length; index++) {
        const element = as[index];
        if (element.href.endsWith(".mp3")) {
            songs.push(element.href.split(`/${folder}/`)[1]);
        }
    }

    let songul = document.querySelector(".songlist").getElementsByTagName("ul")[0];
    songul.innerHTML = "";
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
}

const playMusic = (track, pause = false) => {
    currentsong.src = `/Spotify clone sigma/${currfolder}/` + track;
    if (!pause) {
        currentsong.play();
        playsong.src = "images/pause.svg";
    }
    document.querySelector(".songinfo").innerHTML = decodeURI(track);
    document.querySelector(".songtime").innerHTML = "00:00 / 00:00";
}

async function displayalbums() {
    let a = await fetch(`http://127.0.0.1:3000/spotify%20clone%20sigma/songs/`);
    let response = await a.text();
    let div = document.createElement("div");
    div.innerHTML = response;
    let anchors = div.getElementsByTagName("a");
    let array = Array.from(anchors);
    for (let index = 0; index < array.length; index++) {
        const e = array[index];

        if (e.href.includes("/songs")) {
            let folder = e.href.split("/").slice(-2)[0];
            // get the metadata of the folder
            let a = await fetch(`http://127.0.0.1:3000/spotify%20clone%20sigma/songs/${folder}/info.json`);
            let response = await a.json();

            let cardcontainer = document.querySelector(".cardcontainer");
            cardcontainer.innerHTML +=  `
            <div data-folder="${folder}" class="card">
                        <div class="play">
                            <svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" viewBox="0 0 24 24"
                                fill="none">
                                <path
                                    d="m7.05 3.606 13.49 7.788a.7.7 0 0 1 0 1.212L7.05 20.394A.7.7 0 0 1 6 19.788V4.212a.7.7 0 0 1 1.05-.606z"
                                    fill="black"></path>
                            </svg>
                        </div>
                        <div class="cover-image">
                            <img src="${response.image}" alt="">
                        </div>
                        <h2>${response.title}</h2>
                        <p>${response.description}</p>
                    </div>
                    `;
        }
    }

        Array.from(document.getElementsByClassName("card")).forEach(e=> {
            e.addEventListener("click", async item=> {
                await getsongs(`songs/${item.currentTarget.dataset.folder}`);
                playMusic(songs[0], true);
            })
        })
}

async function main() {

    await getsongs(`songs/bollywood`);
    playMusic(songs[0], true);

    //display all the albums on the page
    displayalbums();

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