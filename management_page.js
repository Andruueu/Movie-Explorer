let watchlist_enable = 0;

document.addEventListener("DOMContentLoaded", function () {
  movieCardStyling("movies", 0);

  goToWatchlist();
});

function deleteMovieFromHome() {
  const title = document.getElementById("movieTitle").value;
  const movies = JSON.parse(localStorage.getItem("movies"));
  if (movies == null) {
    showPopup("Nothing to remove!");
  } else {
    for (let i = 0; i < movies.length; i++) {
      if (movies[i].title.toUpperCase() == title.toUpperCase()) {
        movies.splice(i, 1);
        localStorage.removeItem("movies");
        localStorage.setItem("movies", JSON.stringify(movies));
        showPopup("The movie has been deleted from Home page!");
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
      showPopup("The movie has been deleted from Watchlist!");
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
  showPopup("The movie has been added to Home page!");
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
        showPopup("Movie added to watchlist!");
      }
    }
  }
}

function goToWatchlist() {
  const cardButton = document.querySelector("#watchlist_btn");
  cardButton.addEventListener("click", function () {
    if (watchlist_enable === 0) {
      movieCardStyling("watchlist", 1);
      document.getElementById("watchlist_btn").textContent = "🏠︎ Home Page";
      watchlist_enable = 1;
    } else {
      movieCardStyling("movies", 0);
      document.getElementById("watchlist_btn").textContent = "📋 Watchlist";
      watchlist_enable = 0;
    }
  });
}

function movieCardStyling(localStorage_key, watchlist) {
  const localStorageTemp = JSON.parse(
    localStorage.getItem(`${localStorage_key}`)
  );

  console.log("mov");

  if (localStorageTemp == null) {
    document.getElementById("movieCard").innerHTML = "No content yet.";
  } else {
    let btnString =
      watchlist === 0 ? "Add to watchlist" : "Remove from watchlist";
    let btnfunctionality = watchlist === 0 ? "add" : "remove";

    const movieCard = document.getElementById("movieCard");
    movieCard.innerHTML = "";

    localStorageTemp.forEach((currentMovie) => {
      const movieDiv = document.createElement("div");
      let short_description = currentMovie.description.substring(0, 150);
      if (currentMovie.description.length > 150) {
        short_description += "...";
      }
      const sanitizedTitle = currentMovie.title
        .replace(/\s+/g, "-")
        .toLowerCase();
      movieDiv.className =
        "w-3/4 md:w-full mx-auto bg-gray-900 p-4 rounded-lg shadow-lg hover:scale-[1.02] transition-transform border border-purple-500 hover:border-blue-500";

      movieDiv.innerHTML = `
        <div class="w-full flex flex-col h-full justify-between bg-gray-800 text-white rounded-lg shadow-lg p-4">
    
    <img
      id="moviePoster"
      src="${currentMovie.posterUrl || "./src/img/logo.png"}"
      alt="Movie Poster"
      class="w-full object-cover rounded"
    />

    
    <h2 id="movieTitle" class="text-xl font-bold mt-4 text-pink-400 uppercase">
      ${currentMovie.title}
    </h2>

   
    <p id="movieRating" class="text-cyan-400">
      ⭐ ${currentMovie.rating || "No rating"} | ${
        currentMovie.genre || "No genre"
      } | ${currentMovie.year || "No year"}
    </p>

    
    <p class="text-gray-300 mt-2">${short_description || "No description"}</p>

    
    <div class="mt-4 flex flex-col space-y-2 flex-grow">
      <button
        class="w-full bg-pink-500 hover:bg-cyan-500 text-white font-bold py-2 px-4 rounded transition-all"
        onclick="window.open('${currentMovie.trailerUrl || "None"}', '_blank');"
      >
        Explore
      </button>

      <button
        id="${btnfunctionality}-${sanitizedTitle}"
        class="w-full bg-pink-500 hover:bg-cyan-500 text-white font-bold py-2 px-4 rounded transition-all"
      >
        ${btnString}
      </button>
    </div>
  </div>
`;

      const cardButton = movieDiv.querySelector(
        `#${btnfunctionality}-${sanitizedTitle}`
      );
      cardButton.addEventListener("click", function () {
        if (watchlist === 0) {
          addToWatchList(currentMovie.title);
          console.log("Buton apăsat pentru add: ", currentMovie.title);
        } else {
          deleteMovieFromWatchlist(currentMovie.title);
          console.log("Buton apăsat pentru stergere: ", currentMovie.title);
        }
      });

      movieCard.appendChild(movieDiv);
    });
  }
}

async function fetchMovie() {
  const title = document.getElementById("movieTitle").value;
  if (!title) return popup("Enter a movie title!");

  const apiKey = "fa07a581";
  const url = `https://www.omdbapi.com/?t=${encodeURIComponent(
    title
  )}&apikey=${apiKey}`;

  try {
    const response = await fetch(url);
    const data = await response.json();

    if (data.Response === "False") {
      showPopup("The movie has not been found!");
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
      showPopup("The movie has not been found!");
    }
  } catch (error) {
    console.error("Eroare:", error);
  }
}

function showPopup(message) {
  const popup = document.getElementById("popup");
  const messageBox = document.getElementById("popup-message");
  messageBox.textContent = message || "Error";
  popup.classList.remove("hidden");
  window.scrollTo({ top: 0, behavior: "smooth" });
  setTimeout(closePopup, 3000);
}
function closePopup() {
  document.getElementById("popup").classList.add("hidden");
}

// Sortarea filmelor
function sortMovies(type) {
  let localStorage_name;
  console.log(watchlist_enable);
  if (watchlist_enable == 1) {
    localStorage_name = "watchlist";
  } else {
    localStorage_name = "movies";
  }
  console.log(localStorage_name);
  const movies = JSON.parse(localStorage.getItem(localStorage_name));
  let sortedMovies;

  switch (type) {
    case "az":
      sortedMovies = [...movies].sort((a, b) => a.title.localeCompare(b.title));
      break;
    case "za":
      sortedMovies = [...movies].sort((a, b) => b.title.localeCompare(a.title));
      break;
    case "ratingAsc":
      sortedMovies = [...movies].sort(
        (a, b) => parseFloat(a.rating) - parseFloat(b.rating)
      );
      break;
    case "ratingDesc":
      sortedMovies = [...movies].sort(
        (a, b) => parseFloat(b.rating) - parseFloat(a.rating)
      );
      break;
    default:
      sortedMovies = [...movies];
  }
  console.log(sortedMovies);
  localStorage.removeItem(localStorage_name);
  localStorage.setItem(localStorage_name, JSON.stringify(sortedMovies));

  const asa = JSON.parse(localStorage.getItem(localStorage_name));
  console.log(asa);

  movieCardStyling(localStorage_name, watchlist_enable);
  document.getElementById("sortDropdown").classList.add("hidden");
}

// Afișează dropdown-ul la click pe buton
document
  .getElementById("sortButton")
  .addEventListener("click", function (event) {
    const dropdown = document.getElementById("sortDropdown");
    dropdown.classList.toggle("hidden");
    event.stopPropagation(); // Previne închiderea dropdown-ului când se face click pe butonul de sortare
  });

// Ascunde dropdown-ul când se face click în afara lui
document.addEventListener("click", function (event) {
  const dropdown = document.getElementById("sortDropdown");
  const sortButton = document.getElementById("sortButton");
  if (!sortButton.contains(event.target)) {
    dropdown.classList.add("hidden");
  }
});

[
  {
    title: "Interstellar",
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
  {
    title: "Titanic",
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
    title: "Inside Out",
    year: "2015",
    genre: "Adventure",
    rating: "8.1",
    posterUrl:
      "https://m.media-amazon.com/images/M/MV5BOTgxMDQwMDk0OF5BMl5BanBnXkFtZTgwNjU5OTg2NDE@._V1_SX300.jpg",
    trailerUrl:
      "https://www.youtube.com/results?search_query=Inside Out+trailer",
    description:
      "Plot: After young Riley is uprooted from her Midwest life and moved to San Francisco, her emotions - Joy, Fear, Anger, Disgust and Sadness - conflict on how best to navigate a new city, house, and school.\n\nActors: Amy Poehler, Bill Hader, Lewis Black\n\nAwards: Won 1 Oscar. 99 wins & 118 nominations total\n\nDirector: Pete Docter, Ronnie Del Carmen",
  },
];

function scrollToTop() {
  window.scrollTo({ top: 0, behavior: "smooth" });
}

// Funcția pentru a arăta sau ascunde butonul la scroll
window.onscroll = function () {
  let scrollButton = document.getElementById("scrollToTopButton");
  if (
    document.body.scrollTop > 100 ||
    document.documentElement.scrollTop > 100
  ) {
    scrollButton.classList.remove("hidden");
  } else {
    scrollButton.classList.add("hidden");
  }
};
