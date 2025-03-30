let watchlist_enable = 0;

document.addEventListener("DOMContentLoaded", function () {
  movieCardStyling("movies", 0);

  goToWatchlist();
});

function deleteMovieFromHome() {
  const title = document.getElementById("movieTitle").value;
  const movies = JSON.parse(localStorage.getItem("movies"));
  if (movies == null) {
    alert("Nothing to remove!");
  } else {
    for (let i = 0; i < movies.length; i++) {
      if (movies[i].title.toUpperCase() == title.toUpperCase()) {
        movies.splice(i, 1);
        localStorage.removeItem("movies");
        localStorage.setItem("movies", JSON.stringify(movies));
        alert("The movie has been deleted from Home page!");
      }
    }
  }
}
function deleteMovieFromWatchlist(btnId) {
  const watchlist = JSON.parse(localStorage.getItem("watchlist"));
  console.log(btnId);
  for (let i = 0; i < watchlist.length; i++) {
    if (watchlist[i].title == btnId) {
      watchlist.splice(i, 1);
      localStorage.removeItem("watchlist");
      localStorage.setItem("watchlist", JSON.stringify(watchlist));
      movieCardStyling("watchlist", 1);
    }
  }
}

function addMovieToHome() {
  const title = document.getElementById("movieTitle").value;
  const year = document.getElementById("movieYear").value;
  const genre = document.getElementById("movieGenre").value;
  const rating = document.getElementById("movieRating").value;
  const posterUrl = document.getElementById("moviePoster").value;
  const trailerUrl = document.getElementById("movieTrailer").value;
  const description = document.getElementById("movieDescription").value;

  const movie = {
    title,
    year,
    genre,
    rating,
    posterUrl,
    trailerUrl,
    description,
  };

  const movies = JSON.parse(localStorage.getItem("movies")) || [];
  movies.push(movie);
  localStorage.setItem("movies", JSON.stringify(movies));

  alert("The movie has been added to Home page!");
  document.getElementById("movieTitle").value = "";
  document.getElementById("movieYear").value = "";
  document.getElementById("movieGenre").value = "";
  document.getElementById("movieRating").value = "";
  document.getElementById("moviePoster").value = "";
  document.getElementById("movieTrailer").value = "";
  document.getElementById("movieDescription").value = "";
}

function searchMovies() {
  const search = JSON.parse(localStorage.getItem("search")) || [];
  const movies = JSON.parse(localStorage.getItem("movies")) || [];
  const label = document.getElementById("search").value;
  for (let i = 0; i < movies.length; i++) {
    if (movies[i].title.toUpperCase().indexOf(label.toUpperCase()) == 0) {
      search.push(movies[i]);
      console.log(movies[i]);
    }
  }
  if (search.length > 0) {
    localStorage.setItem("search", JSON.stringify(search));
  }
  movieCardStyling("search", 0);
  localStorage.removeItem("search");
}

function addToWatchList(btnId) {
  const watchlist = JSON.parse(localStorage.getItem("watchlist")) || [];
  const movies = JSON.parse(localStorage.getItem("movies")) || [];

  console.log(btnId);

  for (let i = 0; i < movies.length; i++) {
    if (movies[i].title == btnId) {
      let isMovieInWatchlist = false;
      for (let j = 0; j < watchlist.length; j++) {
        if (watchlist[j].title === btnId) {
          isMovieInWatchlist = true;
          break;
        }
      }

      if (!isMovieInWatchlist) {
        watchlist.push(movies[i]);
        localStorage.setItem("watchlist", JSON.stringify(watchlist));
        console.log("Film adăugat în watchlist:", movies[i].title);
      }
    }
  }
}

function goToWatchlist() {
  const cardButton = document.querySelector("#watchlist_btn");
  cardButton.addEventListener('click', function () {
    if(watchlist_enable === 0){
      movieCardStyling("watchlist", 1);
      document.getElementById("watchlist_btn").textContent = "🏠︎ Home Page";
      watchlist_enable = 1;
    }
    else{
      movieCardStyling("movies", 0);
      document.getElementById("watchlist_btn").textContent = "📋 Watchlist";
      watchlist_enable = 0;
    }
  });
}

function movieCardStyling(localStorage_key, watchlist) {
  const localStorageTemp = JSON.parse(localStorage.getItem(`${localStorage_key}`));

  if (localStorageTemp == null) {
    document.getElementById("movieCard").innerHTML = "No content yet.";
  } else {
    let btnString = watchlist === 0 ? "Add to watchlist" : "Remove from watchlist";
    let btnfunctionality = watchlist === 0 ? "add" : "remove";

    const movieCard = document.getElementById("movieCard");
    movieCard.innerHTML = "";

    localStorageTemp.forEach((currentMovie) => {
      const movieDiv = document.createElement('div');
      movieDiv.className = 'bg-gray-900 p-4 rounded-lg shadow-lg hover:scale-105 transition-transform border border-purple-500 hover:border-blue-500';
      
      movieDiv.innerHTML = `
        <img id="moviePoster" src="${currentMovie.posterUrl}" alt="Movie Poster" class="w-full object-fit rounded" />
        <h2 id="movieTitle" class="text-xl font-bold mt-4 text-pink-400 uppercase">${currentMovie.title}</h2>
        <p id="movieRating" class="text-cyan-400">⭐ ${currentMovie.rating} | ${currentMovie.genre} | ${currentMovie.year}</p>
        <p class="text-gray-300 mt-2">${currentMovie.description}</p>
        <button class="mt-4 w-full bg-pink-500 hover:bg-cyan-500 text-white font-bold py-2 px-4 rounded transition-all" onclick="window.open('${currentMovie.trailerUrl}', '_blank');">Explore</button>
        <button id="${btnfunctionality}-${currentMovie.title}" class="mt-4 w-full bg-pink-500 hover:bg-cyan-500 text-white font-bold py-2 px-4 rounded transition-all">
          ${btnString}
        </button>
      `;

      const cardButton = movieDiv.querySelector(`#${btnfunctionality}-${currentMovie.title}`);
      cardButton.addEventListener('click', function () {
        if(watchlist === 0){
          addToWatchList(currentMovie.title);
          console.log("Buton apăsat pentru add: ", currentMovie.title);
        }
        else{
          deleteMovieFromWatchlist(currentMovie.title); 
          console.log("Buton apăsat pentru stergere: ", currentMovie.title);
        }
      });

      movieCard.appendChild(movieDiv);
    });
  }
}

[
  {
    title: "titanic",
    year: "1997",
    genre: "Drama",
    rating: "7.9",
    posterUrl:
      "https://m.media-amazon.com/images/M/MV5BYzYyN2FiZmUtYWYzMy00MzViLWJkZTMtOGY1ZjgzNWMwN2YxXkEyXkFqcGc@._V1_SX300.jpg",
    trailerUrl: "https://www.youtube.com/results?search_query=Titanic+trailer",
    description:
      "Plot: A seventeen-year-old aristocrat falls in love with a kind but poor artist aboard the luxurious, ill-fated R.M.S. Titanic.\n\nActors: Leonardo DiCaprio, Kate Winslet, Billy Zane\n\nAwards: Won 11 Oscars. 126 wins & 83 nominations total\n\nDirector: James Cameron",
  },
  {
    title: "interstellar",
    year: "2014",
    genre: "Adventure",
    rating: "8.7",
    posterUrl:
      "https://m.media-amazon.com/images/M/MV5BYzdjMDAxZGItMjI2My00ODA1LTlkNzItOWFjMDU5ZDJlYWY3XkEyXkFqcGc@._V1_SX300.jpg",
    trailerUrl:
      "https://www.youtube.com/results?search_query=Interstellar+trailer",
    description:
      "Plot: When Earth becomes uninhabitable in the future, a farmer and ex-NASA pilot, Joseph Cooper, is tasked to pilot a spacecraft, along with a team of researchers, to find a new planet for humans.\n\nActors: Matthew McConaughey, Anne Hathaway, Jessica Chastain\n\nAwards: Won 1 Oscar. 44 wins & 148 nominations total\n\nDirector: Christopher Nolan",
  },
];

async function fetchMovie() {
  const title = document.getElementById("movieTitle").value;
  if (!title) return alert("Introduceți un nume de film!");

  const apiKey = "fa07a581";
  const url = `https://www.omdbapi.com/?t=${encodeURIComponent(
    title
  )}&apikey=${apiKey}`;

  try {
    const response = await fetch(url);
    const data = await response.json();

    if (data.Response === "False") {
      alert("Filmul nu a fost găsit!");
      return;
    }
    console.log(data);
    if (data.Response === "True") {
      const select = document.getElementById("movieGenre");

      for (let i = 0; i < select.options.length; i++) {
        if (data.Genre.includes(select.options[i].text)) {
          document.getElementById("movieGenre").value = select.options[i].text;
          break;
        }
      }
      const details =
        "Plot: " +
        data.Plot +
        "\n\nActors: " +
        data.Actors +
        "\n\nAwards: " +
        data.Awards +
        "\n\nDirector: " +
        data.Director;
      document.getElementById("movieDescription").value = details;
      document.getElementById("movieRating").value = data.imdbRating;
      document.getElementById("movieYear").value = data.Year;
      document.getElementById("moviePoster").value = data.Poster;
      document.getElementById(
        "movieTrailer"
      ).value = `https://www.youtube.com/results?search_query=${data.Title}+trailer`;
    } else {
      alert("Filmul nu a fost găsit!");
    }
  } catch (error) {
    console.error("Eroare:", error);
  }
}
