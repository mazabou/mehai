// Fetch data
async function getData() {
    const response = await fetch('selected_data.json');
    return await response.json();
}

// main
async function main() {
    // load data
    const table = await getData();
    const artists = table.artists;
    const genres = table.genres;
    const songs = table.songs;

    ///////////////

    const urlParams = new URLSearchParams(window.location.search);
    const id = urlParams.get('id') || 'default';


    ////////////////////////////////////////
    // Hide Answer

    var iframe = document.getElementById("soundcloud");

    // Create the black box element
    var blackBox = document.createElement("button");
    blackBox.classList.add('hideblock');
    blackBox.innerHTML = "<i class=\"fa-regular fa-eye\"></i>"

    // iframe.onload = function() {
    // Code to execute after the iframe has finished loading goes here
    console.log("iframe has finished loading");

    const imageRect = iframe.getBoundingClientRect();
    console.log(`The image is positioned at (${imageRect.left}, ${imageRect.top}).`);

    blackBox.style.left = imageRect.left + 222  + 'px';
    blackBox.style.top = imageRect.top + 34 + 'px';
    blackBox.style.width = Math.min(400, imageRect.width - 300) + 'px';
    document.body.appendChild(blackBox);
    // };

    window.addEventListener('resize', function() {
        const imageRect = iframe.getBoundingClientRect();
        blackBox.style.left = imageRect.left + 222  + 'px';
        blackBox.style.top = imageRect.top + 34 + 'px';
        blackBox.style.width = Math.min(400, imageRect.width - 300) + 'px';
    });


    // button to reveal

    function handleRevealButtonClick() {
        console.log('Reveal button clicked');
        blackBox.style.display = 'none';
        falseAlert();
        input.disabled = true;
    }

    blackBox.addEventListener('click', handleRevealButtonClick);


    ////////////////////////////////////////

    // collect all artists names to use as suggestion for the text box
    const datalist = document.createElement("datalist");
    datalist.id = "guessOptions";

    // Create option elements for each option in the array
    let result = [];
    for (const genre in genres) {
        const options = genres[genre];
        options.forEach(option => {
            const optionElement = document.createElement("option");
            optionElement.value = option;
            if (!result.includes(option)) {
                result.push(option);
                datalist.appendChild(optionElement);
            }
        });
    }

    // Add the datalist to the document
    document.body.appendChild(datalist);

    ////////////////////////////////////////

    // Sample a limited number of songs for each artist
    // a function that samples n songs from each artist
    const n_songs_per_artist = 5;
    function sampleSongs(artists) {
        let result = [];
        for (const artist in artists) {
            const artistsongs = artists[artist];
            // Randomly select n songs from the list
            const selectedSongs = shuffle(artistsongs).slice(0, Math.min(artistsongs.length, n_songs_per_artist));
            // Add the artist tag to each selected song
            selectedSongs.forEach(song => result.push({song, artist}));
        }
        result = result.sort(() => Math.random() - 0.5);
        return result;
    }

    function shuffle(array) {
        // Shuffle the elements of the array in place
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    }

    const selectedSongs = sampleSongs(artists);
    const filteredSongs = selectedSongs;

    ////////////////////////////////////////

    // function to iterate over songs
    // initialize view
    let index = 0;

    if (id !== 'default') {
        filteredSongs[0] = {'song': songs[id].soundcloud_uri, 'artist': songs[id].artist}
    }

    iframe.src = "https://w.soundcloud.com/player/?url=" + filteredSongs[index].song;

    function nextSong() {
        console.log('Next song triggered');
        blackBox.style.display = 'block';
        index = (index + 1) % filteredSongs.length;

        iframe.src = "https://w.soundcloud.com/player/?url=" + filteredSongs[index].song;
        // + "&amp;amp;auto_play=true&amp;amp;show_comments=false&amp;amp;show_artwork=false&amp;amp;color=06459d";
        input.disabled = false;
        if (!guessed) {
            console.log('total set to 0')
            total = 0;
            falseAlert();
        }
        guessed = false;
        falseTrigger = false;
        UpdateScore();
        input.value = '';
        skipButton.innerHTML = ' <i class="fa-solid fa-forward"></i> skip </i>';
    }

    // const button = document.querySelector('#reveal');
    const skipButton = document.querySelector('#skip');
    skipButton.addEventListener('click', nextSong);

    ////////////////////////////////////////

    // Score tracker

    let total = 0;
    const totalElement = document.getElementById('total');

    ////////////////////////////////////////

    // Guess box
    const input = document.getElementById('guessInput');

    function UpdateScore() {
        if (total > 0) {
            totalElement.innerHTML = "Combo <i class=\"fa-solid fa-x fa-xs\"></i> " + total;
        } else {
            totalElement.innerHTML = "";
        }
    }

    function correctAlert () {
        document.body.style.backgroundColor = '#7ff09b';
        setTimeout(() => {
            document.body.transition = 'background-color 5s ease';
            document.body.style.backgroundColor = 'white';
            // document.body.transition = 'all 0s ease';
        }, 1000); // 1000 milliseconds = 1 second
        input.value = '';
        total = total + 1;
        UpdateScore();
        blackBox.style.display = 'none';
        input.disabled = true;
    }

    let falseTrigger = false;
    function falseAlert () {
        if (!falseTrigger) {
            document.body.style.backgroundColor = '#f06565';
            setTimeout(() => {
                document.body.transition = 'background-color 5s ease';
                document.body.style.backgroundColor = 'white';
                // document.body.transition = 'all 0s ease';
            }, 1000); // 1000 milliseconds = 1 second
            falseTrigger = true;
        }
    }

    let guessed = false;

    input.addEventListener('keydown', event => {
        // Check if the user pressed the Enter key
        if (event.key === 'Enter') {
            // Get the value of the input
            const guess = input.value.toLowerCase();

            // Get correct answer
            const correctAnswer = filteredSongs[index].artist.toLowerCase();

            // Check if the guess is correct
            if (guess === correctAnswer)  {
                correctAlert();
                skipButton.innerHTML = ' <i class="fa-solid fa-forward-step"></i> next';
                guessed = true;
                // nextSong();
            } else {
                falseTrigger = false;
                falseAlert();
            }
        }
    });


    ////////////////////////////////////////
    var notification = document.getElementById('notification');

    function share() {
        // Get ids
        const currentUrl = window.location.href;

        url = "https://w.soundcloud.com/player/?url=" + filteredSongs[index].song;
        const regex = /tracks\/(\d+)\?secret_token=([^&]+)/;
        const match = url.match(regex);
        const id = match[1];

        const newUrl = `www.mehai.dev/jukeguesser?id=${id}`;

        // Copy the text to the clipboard
        navigator.clipboard.writeText('Can you guess this song? ' + newUrl);
        notification.style.opacity = 100;

        // Set a timer to hide the notification after 3 seconds
        setTimeout(function() {
            notification.style.opacity = 0;
        }, 1400);
    }

    document.getElementById('share').addEventListener('click', share);


    /////
    const button = document.querySelector('#info');
    const panel = document.querySelector('#howtoplay');
    const closeButton = document.querySelector('#closeButton');

    button.addEventListener('click', function() {
        panel.style.display = 'block';
    });

    closeButton.addEventListener('click', function() {
        panel.style.display = 'none';
    });

}


main();



//
// // genre selector
// const toggleButtons = document.querySelectorAll('.toggle-button');
// // Add a click event listener to each toggle button
// toggleButtons.forEach(button => {
//     button.addEventListener('click', event => {
//         // Unselect all the toggle buttons
//         toggleButtons.forEach(button => {
//             button.classList.remove('selected');
//         });
//
//         // Select the clicked toggle button
//         event.target.classList.add('selected');
//
//         // filter the list
//         const genresToFilter = [event.target.value];
//
//         // Filtered list of songs
//         const filteredSongs = table.filter(song => genresToFilter.includes(song.genre));
//         console.log(filteredSongs[index])
//         nextSong();
//     });
// });