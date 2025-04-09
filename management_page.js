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

let initial_array=
[
  {
    title: "scary movie",
    year: "2000",
    genre: "Comedy",
    rating: "6.3",
    posterUrl:
      "https://m.media-amazon.com/images/M/MV5BZGRmMGRhOWMtOTk3Ni00OTRjLTkyYTAtYzA1M2IzMGE3NGRkXkEyXkFqcGc@._V1_SX300.jpg",
    trailerUrl:
      "https://www.youtube.com/results?search_query=Scary Movie+trailer",
    description:
      "Plot: A year after disposing of the body of a man they accidentally killed, a group of dumb teenagers are stalked by a bumbling serial killer.\n\nActors: Anna Faris, Jon Abrahams, Marlon Wayans\n\nAwards: 7 wins & 6 nominations total\n\nDirector: Keenen Ivory Wayans",
  },
  {
    title: "dune",
    year: "1984",
    genre: "Action",
    rating: "6.3",
    posterUrl:
      "https://m.media-amazon.com/images/M/MV5BMGJlMGM3NDAtOWNhMy00MWExLWI2MzEtMDQ0ZDIzZDY5ZmQ2XkEyXkFqcGc@._V1_SX300.jpg",
    trailerUrl: "https://www.youtube.com/results?search_query=Dune+trailer",
    description:
      "Plot: A Duke's son leads desert warriors against the galactic emperor and his father's evil nemesis to free their desert world from the emperor's rule.\n\nActors: Kyle MacLachlan, Virginia Madsen, Francesca Annis\n\nAwards: Nominated for 1 Oscar. 2 wins & 6 nominations total\n\nDirector: David Lynch",
  },
  {
    title: "Challengers",
    year: "2024",
    genre: "Comedy",
    rating: "7.1",
    posterUrl:
      "https://m.media-amazon.com/images/M/MV5BZTcyZGIyODctZGJhOS00MWUyLWI5ZWEtMjg4YzhkMDczMDBhXkEyXkFqcGc@._V1_SX300.jpg",
    trailerUrl:
      "https://www.youtube.com/results?search_query=Challengers+trailer",
    description:
      "Plot: Tashi, a former tennis prodigy turned coach, transformed her husband into a champion. But to overcome a recent losing streak and redeem himself, he'll need to face off against his former best friend and Tashi's ex-boyfriend.\n\nActors: Mike Faist, Josh O'Connor, Zendaya\n\nAwards: 82 wins & 155 nominations total\n\nDirector: Luca Guadagnino",
  },
  {
    title: "John wick",
    year: "2014",
    genre: "Action",
    rating: "7.4",
    posterUrl:
      "https://m.media-amazon.com/images/M/MV5BMTU2NjA1ODgzMF5BMl5BanBnXkFtZTgwMTM2MTI4MjE@._V1_SX300.jpg",
    trailerUrl:
      "https://www.youtube.com/results?search_query=John Wick+trailer",
    description:
      "Plot: John Wick is a former hitman grieving the loss of his true love. When his home is broken into, robbed, and his dog killed, he is forced to return to action to exact revenge.\n\nActors: Keanu Reeves, Michael Nyqvist, Alfie Allen\n\nAwards: 5 wins & 10 nominations total\n\nDirector: Chad Stahelski",
  },
  {
    title: "a quiet place",
    year: "2018",
    genre: "Drama",
    rating: "7.5",
    posterUrl:
      "https://m.media-amazon.com/images/M/MV5BMjI0MDMzNTQ0M15BMl5BanBnXkFtZTgwMTM5NzM3NDM@._V1_SX300.jpg",
    trailerUrl:
      "https://www.youtube.com/results?search_query=A Quiet Place+trailer",
    description:
      "Plot: A family struggles for survival in a world invaded by blind alien creatures with ultra-sensitive hearing.\n\nActors: Emily Blunt, John Krasinski, Millicent Simmonds\n\nAwards: Nominated for 1 Oscar. 38 wins & 129 nominations total\n\nDirector: John Krasinski",
  },
  {
    title: "superbad",
    year: "2007",
    genre: "Comedy",
    rating: "7.6",
    posterUrl:
      "https://m.media-amazon.com/images/M/MV5BNjk0MzdlZGEtNTRkOC00ZDRiLWJkYjAtMzUzYTRiNzk1YTViXkEyXkFqcGc@._V1_SX300.jpg",
    trailerUrl: "https://www.youtube.com/results?search_query=Superbad+trailer",
    description:
      "Plot: Two co-dependent high school seniors are forced to deal with separation anxiety after their plan to stage a booze-soaked party goes awry.\n\nActors: Michael Cera, Jonah Hill, Christopher Mintz-Plasse\n\nAwards: 11 wins & 24 nominations\n\nDirector: Greg Mottola",
  },
  {
    title: "a star is born",
    year: "2018",
    genre: "Drama",
    rating: "7.6",
    posterUrl:
      "https://m.media-amazon.com/images/M/MV5BNGUxZTc0NTAtNzQwMy00MmM2LTgzMGYtZWIyY2E1MGFjYmM5XkEyXkFqcGc@._V1_SX300.jpg",
    trailerUrl:
      "https://www.youtube.com/results?search_query=A Star Is Born+trailer",
    description:
      "Plot: A musician helps a young singer find fame as age and alcoholism send his own career into a downward spiral.\n\nActors: Lady Gaga, Bradley Cooper, Sam Elliott\n\nAwards: Won 1 Oscar. 99 wins & 290 nominations total\n\nDirector: Bradley Cooper",
  },
  {
    title: "the hangover",
    year: "2009",
    genre: "Comedy",
    rating: "7.7",
    posterUrl:
      "https://m.media-amazon.com/images/M/MV5BNDI2MzBhNzgtOWYyOS00NDM2LWE0OGYtOGQ0M2FjMTI2NTllXkEyXkFqcGc@._V1_SX300.jpg",
    trailerUrl:
      "https://www.youtube.com/results?search_query=The Hangover+trailer",
    description:
      "Plot: Three buddies wake up from a bachelor party in Las Vegas with no memory of the previous night and the bachelor missing. They must make their way around the city in order to find their friend in time for his wedding.\n\nActors: Zach Galifianakis, Bradley Cooper, Justin Bartha\n\nAwards: Nominated for 1 BAFTA Award13 wins & 25 nominations total\n\nDirector: Todd Phillips",
  },
  {
    title: "the notebook",
    year: "2004",
    genre: "Drama",
    rating: "7.8",
    posterUrl:
      "https://m.media-amazon.com/images/M/MV5BZjE0ZjgzMzYtMTAxYi00NGMzLThmZDktNzFlMzA2MWRmYWQ0XkEyXkFqcGc@._V1_SX300.jpg",
    trailerUrl:
      "https://www.youtube.com/results?search_query=The Notebook+trailer",
    description:
      "Plot: An elderly man reads to a woman with dementia the story of two young lovers whose romance is threatened by the difference in their respective social classes.\n\nActors: Gena Rowlands, James Garner, Rachel McAdams\n\nAwards: 12 wins & 10 nominations total\n\nDirector: Nick Cassavetes",
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
    title: "avatar",
    year: "2009",
    genre: "Action",
    rating: "7.9",
    posterUrl:
      "https://m.media-amazon.com/images/M/MV5BMDEzMmQwZjctZWU2My00MWNlLWE0NjItMDJlYTRlNGJiZjcyXkEyXkFqcGc@._V1_SX300.jpg",
    trailerUrl: "https://www.youtube.com/results?search_query=Avatar+trailer",
    description:
      "Plot: A paraplegic Marine dispatched to the moon Pandora on a unique mission becomes torn between following his orders and protecting the world he feels is his home.\n\nActors: Sam Worthington, Zoe Saldaña, Sigourney Weaver\n\nAwards: Won 3 Oscars. 91 wins & 131 nominations total\n\nDirector: James Cameron",
  },
  {
    title: "deadpool",
    year: "2016",
    genre: "Action",
    rating: "8.0",
    posterUrl:
      "https://m.media-amazon.com/images/M/MV5BNzY3ZWU5NGQtOTViNC00ZWVmLTliNjAtNzViNzlkZWQ4YzQ4XkEyXkFqcGc@._V1_SX300.jpg",
    trailerUrl: "https://www.youtube.com/results?search_query=Deadpool+trailer",
    description:
      "Plot: A wisecracking mercenary gets experimented on and becomes immortal yet hideously scarred, and sets out to track down the man who ruined his looks.\n\nActors: Ryan Reynolds, Morena Baccarin, T.J. Miller\n\nAwards: 29 wins & 78 nominations total\n\nDirector: Tim Miller",
  },
  {
    title: "Harry Potter",
    year: "2011",
    genre: "Adventure",
    rating: "8.1",
    posterUrl:
      "https://m.media-amazon.com/images/M/MV5BOTA1Mzc2N2ItZWRiNS00MjQzLTlmZDQtMjU0NmY1YWRkMGQ4XkEyXkFqcGc@._V1_SX300.jpg",
    trailerUrl:
      "https://www.youtube.com/results?search_query=Harry Potter and the Deathly Hallows: Part 2+trailer",
    description:
      "Plot: As the battle between the forces of good and evil in the wizarding world escalates, Harry Potter draws ever closer to his final confrontation with Voldemort.\n\nActors: Daniel Radcliffe, Emma Watson, Rupert Grint\n\nAwards: Nominated for 3 Oscars. 49 wins & 95 nominations total\n\nDirector: David Yates",
  },
  {
    title: "gone girl",
    year: "2014",
    genre: "Drama",
    rating: "8.1",
    posterUrl:
      "https://m.media-amazon.com/images/M/MV5BMTk0MDQ3MzAzOV5BMl5BanBnXkFtZTgwNzU1NzE3MjE@._V1_SX300.jpg",
    trailerUrl:
      "https://www.youtube.com/results?search_query=Gone Girl+trailer",
    description:
      "Plot: The husband of a missing woman becomes the chief suspect in her disappearance.\n\nActors: Ben Affleck, Rosamund Pike, Neil Patrick Harris\n\nAwards: Nominated for 1 Oscar. 64 wins & 188 nominations total\n\nDirector: David Fincher",
  },
  {
    title: "the wild robot",
    year: "2024",
    genre: "Sci-Fi",
    rating: "8.2",
    posterUrl:
      "https://m.media-amazon.com/images/M/MV5BZWNiZjVlZTUtNGUwYi00MjJmLTg2MDctNWEzYTJiMzY1ODc4XkEyXkFqcGc@._V1_SX300.jpg",
    trailerUrl:
      "https://www.youtube.com/results?search_query=The Wild Robot+trailer",
    description:
      "Plot: After a shipwreck, an intelligent robot called Roz is stranded on an uninhabited island. To survive the harsh environment, Roz bonds with the island's animals and cares for an orphaned baby goose.\n\nActors: Lupita Nyong'o, Pedro Pascal, Kit Connor\n\nAwards: Nominated for 3 Oscars. 85 wins & 104 nominations total\n\nDirector: Chris Sanders",
  },
  {
    title: "shutter island",
    year: "2010",
    genre: "Drama",
    rating: "8.2",
    posterUrl:
      "https://m.media-amazon.com/images/M/MV5BN2FjNWExYzEtY2YzOC00YjNlLTllMTQtNmIwM2Q1YzBhOWM1XkEyXkFqcGc@._V1_SX300.jpg",
    trailerUrl:
      "https://www.youtube.com/results?search_query=Shutter Island+trailer",
    description:
      "Plot: Two US marshals are sent to a mental institution on an inhospitable island in order to investigate the disappearance of a patient.\n\nActors: Leonardo DiCaprio, Emily Mortimer, Mark Ruffalo\n\nAwards: 11 wins & 66 nominations total\n\nDirector: Martin Scorsese",
  },
  {
    title: "gladiator",
    year: "2000",
    genre: "Action",
    rating: "8.5",
    posterUrl:
      "https://m.media-amazon.com/images/M/MV5BYWQ4YmNjYjEtOWE1Zi00Y2U4LWI4NTAtMTU0MjkxNWQ1ZmJiXkEyXkFqcGc@._V1_SX300.jpg",
    trailerUrl:
      "https://www.youtube.com/results?search_query=Gladiator+trailer",
    description:
      "Plot: A former Roman General sets out to exact vengeance against the corrupt emperor who murdered his family and sent him into slavery.\n\nActors: Russell Crowe, Joaquin Phoenix, Connie Nielsen\n\nAwards: Won 5 Oscars. 60 wins & 104 nominations total\n\nDirector: Ridley Scott",
  },
  {
    title: "se7en",
    year: "1995",
    genre: "Drama",
    rating: "8.6",
    posterUrl:
      "https://m.media-amazon.com/images/M/MV5BY2IzNzMxZjctZjUxZi00YzAxLTk3ZjMtODFjODdhMDU5NDM1XkEyXkFqcGc@._V1_SX300.jpg",
    trailerUrl: "https://www.youtube.com/results?search_query=Se7en+trailer",
    description:
      "Plot: Two detectives, a rookie and a veteran, hunt a serial killer who uses the seven deadly sins as his motives.\n\nActors: Morgan Freeman, Brad Pitt, Kevin Spacey\n\nAwards: Nominated for 1 Oscar. 29 wins & 44 nominations total\n\nDirector: David Fincher",
  },
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
    title: "inception",
    year: "2010",
    genre: "Action",
    rating: "8.8",
    posterUrl:
      "https://m.media-amazon.com/images/M/MV5BMjAxMzY3NjcxNF5BMl5BanBnXkFtZTcwNTI5OTM0Mw@@._V1_SX300.jpg",
    trailerUrl:
      "https://www.youtube.com/results?search_query=Inception+trailer",
    description:
      "Plot: A thief who steals corporate secrets through the use of dream-sharing technology is given the inverse task of planting an idea into the mind of a C.E.O., but his tragic past may doom the project and his team to disaster.\n\nActors: Leonardo DiCaprio, Joseph Gordon-Levitt, Elliot Page\n\nAwards: Won 4 Oscars. 159 wins & 220 nominations total\n\nDirector: Christopher Nolan",
  },
];

localStorage.setItem("movies", JSON.stringify(initial_array));