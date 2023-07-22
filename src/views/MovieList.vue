<script setup>
    import { Splide, SplideSlide } from '@splidejs/vue-splide';
</script>


<template>
    <nav id="ariane">
        <ol>
            <li>
                <RouterLink to="/">
                    Accueil
                </RouterLink>
            </li>
            <li>
                <RouterLink :to="`${genreName}`">
                    {{ genreName }}
                </RouterLink>
            </li>
        </ol>
    </nav>
    <main>
        <section class="movies-list" v-for="decade in moviesList">
            <ol class="year-list">
                <li v-for="year in decade.decade">
                    <span class="year current" v-if="year == decade.year">{{ year }}</span>
                    <button class="year other" v-else @click="getMoviesFromYear(genreId,year)">{{ year }}</button>
                </li>
            </ol>
            
            <Splide v-if="decade.movies.length > 0" :options="decade.sliderOptions" class="movies-slide">
                <SplideSlide v-for="movie in decade.movies">
                    <div class="center">
                        <RouterLink 
                        :to="`/genre/${genreName}/${movie.id}`"
                        :title="movie.title"
                        class="movie" >
                        <img v-if="movie.poster_path" :src="pathimg + movie.poster_path" :data-splide-lazy="pathimg + movie.poster_path" alt="" />
                            <h2 class="movie-title">{{ movie.title }}</h2>
                            <div class="movie-resume">
                                <p v-if="movie.overview.length >= 100">{{ movie.overview.substring(0, 100) }}...</p>
                                <p v-else-if="movie.overview.length > 0">{{ movie.overview.substring(0, 100) }}</p>
                            </div>
                        </RouterLink>
                    </div>
                </SplideSlide>
            </Splide>
            <div v-else>
                <h3 class="no-movie">Il n'y a pas de film marquant qui est sorti cette année là.</h3>
            </div>
        </section>
    </main>
</template>



<script type="module">

    const apiKey = 'api_key=26665d239c52005e4ebb0913a184b7e6';
    const baseUrl = 'https://api.themoviedb.org/3/';
    const genresList = baseUrl + 'genre/movie/list?language=fr&' + apiKey;
    const voteMin = 100;


    export default {
        name: 'genre',
        components: {
            Splide,
            SplideSlide,
        },
        // On encode le nom du genre pour gérer les accents dans les genres
        props: ['genreName'],
        data(){
            return {
                moviesList : [],
                pathimg: 'https://image.tmdb.org/t/p/w185/' ,
                genreId : null,
            }
        },
        created() {
            window.scrollTo(0, 0);
            // On récupère la liste de tous les genre et on retrouve le genre sélectionné précédemment par l'utilisateur
            fetch(genresList)
                .then(response => response.json())
                .then((response) => { 
                    this.genres = response.genres;
                    this.genreId = this.genres.find(genreInfo => genreInfo.name.toLowerCase() === this.genreName.toLowerCase());
                    this.genreId = this.genreId.id;
                    this.moviesList = this.getMovies(this.genreId);
                })
                .catch(err => console.error(err));
           
        },
        methods: {
            // Récupérations des films en fonction du genre sélectionné précédemment
            async getMovies(paramGenreId) {
                this.genreId = paramGenreId;

                // Déclaration des années par décénies
                const decadeList = {};
                const startYear = 1950;
                const currentYear = new Date().getFullYear();

                for(let i = startYear; i <= currentYear; i++) {
                    const decade = Math.floor(i / 10) * 10;
                    if(!decadeList.hasOwnProperty(decade)) {
                        decadeList[decade] = [];
                    }
                    decadeList[decade].push(i.toString());
                }
                
                // Séelection d'une année au hasard par décennie 
                const yearsList = []
                for (var decade of Object.keys(decadeList)) {
                    var randomYearIndex = Math.floor(Math.random() * decadeList[decade].length);
                    var yearsInDecade = decadeList[decade];
                    var randomYear = yearsInDecade[randomYearIndex];
                    yearsList.push(randomYear);
                }


                // Requête à l'api pour chaque année sélectionné
                const yearSelected = [];
                for (var year of yearsList) {
                    var request = fetch(`${baseUrl}/discover/movie?include_adult=true&primary_release_year=${year}&language=fr&with_genres=${this.genreId}&vote_count.gte=${voteMin}&sort_by=popularity.desc&${apiKey}`);
                    yearSelected.push(request);
                }

                try {
                    // Traitement des requêtes
                    const responses = await Promise.all(yearSelected);
                    const data = await Promise.all(responses.map(response => response.json()))
                    const movieArray = [];
                    // Ajout des films récupérés dans un tableau 
                    data.forEach((movies, index) => {

                        const year = yearsList[index];
                        const decadeOfYear = Object.values(decadeList).find(decade => decade.includes(year));
                        const moviesByYear = {
                            year,
                            decade : decadeOfYear,
                            movies : movies.results,
                            sliderOptions: { 
                                type: 'loop', 
                                padding: { left: 10, right: 20 },
                                pagination: false,
                                lazyLoad: 'nearby',
                                speed: 1500, 
                                flickPower: 200,
                                rewind: true,
                                gap: 60,
                                clones: 0,
                                mediaQuery: 'min',
                                breakpoints: {
                                    320: {
                                        perPage: 1,
                                        perMove: 1, 
                                    },
                                    480: {
                                        perPage: 2,
                                        perMove: 2,
                                    },
                                    720: {
                                        perPage: 3, 
                                        perMove: 3,
                                    },
                                    960 : {
                                        perPage: 4,
                                        perMove: 3
                                    },
                                    1200 : {
                                        perPage: 5,
                                        perMove: 3
                                    }

                                }
                            }
                        };
                        movieArray.push(moviesByYear);
                    });
                    // Stockage des films et du genre sélecitonné
                    movieArray.reverse();
                    this.moviesList = movieArray;
                }
                catch(error) {
                    this.answer = error;
                }
            },
            // Requête en fonction de l'année sélectionné et du genre
            async getMoviesFromYear(genreId, year) {
                this.genreId = genreId;
                var request = fetch(`${baseUrl}/discover/movie?include_adult=true&primary_release_year=${year}&language=fr&with_genres=${this.genreId}&vote_count.gte=${voteMin}&sort_by=popularity.desc&${apiKey}`);

                try {
                    // Traitement des requêtes
                    const response = await Promise.resolve(request);
                    const data = await Promise.resolve(response.json());  

                    // Rendre la reponse utilisable
                    var actualMoviesList = JSON.parse(JSON.stringify(this.moviesList));
                    // Association de l'année sélectionnée et des films en lien avec cette année 
                    for (var entrie of Object.values(actualMoviesList)) {

                        var decadeFind = entrie.decade.find(yearInDecade => yearInDecade === year);
                        if(decadeFind){
                            entrie.sliderOptions.breakpoints = {
                                320: {
                                    perPage: 1,
                                    perMove: 1, 
                                },
                                480: {
                                    perPage: 2,
                                    perMove: 2,
                                },
                                720: {
                                    perPage: 3, 
                                    perMove: 3,
                                },
                                960 : {
                                    perPage: 4,
                                    perMove: 3
                                },
                                1200 : {
                                    perPage: 5,
                                    perMove: 3
                                }
                            };
                            entrie.year = year;
                            entrie.movies = data.results;

                            this.moviesList = actualMoviesList;
                            break;
                        }
                    }
                
                }
                catch(error) {
                    this.answer = error;
                }  
            },
        },
      }
</script>

<style scoped lang="scss">

    .movies-list {
        padding-bottom: 20px;

        &:nth-child(2n) {
        background-color: var(--color-background-soft);
        position: relative;
        padding: 15px 0 30px 0;
        margin: 30px 0;

            &::before, &::after{
                content: "";
                top:0;
                width: calc((100vw - 1216px) / 2);
                height: 100%;
                position: absolute;
                background: var(--color-background-soft);
            }
            &::before {
                right: 100%;
            }
            &::after {
                left:  100%;
            }
        }
    }

    .year-list{
        display: flex;
        flex-wrap: wrap;
        justify-content: center;
        align-items: baseline;
        gap: 15px;
        margin-bottom: 15px;

        li {
            list-style: none;
            .year {
                font-family: var(--font-2);
                &.current {
                    font-size: 2rem;
                    color: var(--color-yellow);
                }
                &.other {
                    font-size: 1.8rem;
                    color: var(--color-blue-soft);                    
                }
            }

        }
    }
    .center {
        text-align: center;
    }
    .no-movie {
        text-align: center;
        margin: 10px 0;
    }
    .movie {
        transition: 0.2s;
        color: inherit;
        text-decoration: none;
        &:hover {
            transform: scale(1.1);
            transition: 0.2s;
            z-index: 999;
        }

        .movie-title {
            margin: 10px 0;
            font-size: 1.4rem;
            line-height: 1.6rem;
            color: var(--color-yellow);
        }
        .movie-resume {
            font-size: 1.2rem;
            line-height: 1.4rem;
        }

    }

    .movies-slide {
        max-width: 80%;
        margin: 0 auto;
    }

    @media screen and (min-width: 1280px) {
        .movies-slide {
            max-width: 100%;
        }
    }
    
</style>