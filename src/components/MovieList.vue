<script setup>
    import MovieDetail from './MovieDetail.vue';
    import { Splide, SplideSlide } from '@splidejs/vue-splide';
</script>


<template>
    <h1>test</h1>
    <div v-if="!showMovie">
        <section class="movies-list" v-for="decade in moviesList">
            <ol class="year-list">
                <li v-for="year in decade.decade">
                    <span class="year current" v-if="year == decade.year">{{ year }}</span>
                    <button class="year other" v-else @click="getMoviesFromYear(genreSelected.id,year)">{{ year }}</button>
                </li>
            </ol>
            
            <Splide v-if="decade.movies.length > 0" :options="decade.sliderOptions" class="movies-slide">
                <SplideSlide v-for="movie in decade.movies">
                    <div class="center">
                        <button class="movie" @click="displayMovie(); getMovie(movie);">
                            <img v-if="movie.poster_path" :src="pathimg + movie.poster_path"  loading="lazy" alt="" />
                            <h2 class="movie-title">{{ movie.title }}</h2>
                            <div class="movie-resume">
                                <p v-if="movie.overview.length >= 100">{{ movie.overview.substring(0, 100) }}...</p>
                                <p v-else-if="movie.overview.length > 0">{{ movie.overview.substring(0, 100) }}</p>
                            </div>
                        </button>
                    </div>
                </SplideSlide>
            </Splide>
            <div v-else>
                <h3 class="no-movie">Il n'y a pas de film marquant qui est sorti cette année là.</h3>
            </div>
        </section>
    </div>
    <article v-else>
        <!--<button id="showMovie" class="btnAriane" @click="displayMovies();">Retouir vers la liste de films</button>-->
        <MovieDetail :movieInfo="movieSelected"></MovieDetail>
    </article>
</template>



<script type="module">

    const apiKey = 'api_key=26665d239c52005e4ebb0913a184b7e6';
    const baseUrl = 'https://api.themoviedb.org/3/';
    const voteMin = 100;


    export default {
        components: {
            MovieDetail,
            Splide,
            SplideSlide,
        },
        props: {
            genreSelected : {
                type: Object,
                required: true,
            },
            toggleMovies: {
                type: Boolean,
                required: true,
            }
        },
        data(){
            return {
                moviesList : [],
                pathimg: 'https://image.tmdb.org/t/p/w185/' ,
                yearSelected : null,
                showMovie: this.toggleMovies,
                movieSelected : null,
            }
        },
        beforeMount() {
            this.getMovies(this.genreSelected.id);
            
        },
        methods: {
            // Récupérations des films en fonction du genre sélectionné précédemment
            async getMovies(genreId) {
                this.genreId = genreId;

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
                                lazyLoad: true,
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
                                        perPage: movies.results.length >= 2 ? 2 : movies.results.length,
                                        perMove: movies.results.length >= 2 ? 2 : 1,
                                    },
                                    720: {
                                        perPage: movies.results.length >= 3 ? 3 : movies.results.length, 
                                        perMove: movies.results.length >= 3 ? 3 : 1,
                                    },
                                    960 : {
                                        perPage: movies.results.length >= 4 ? 4 : movies.results.length,
                                        perMove: movies.results.length >= 3 ? 3 : 1,
                                    },
                                    1200 : {
                                        perPage: movies.results.length >= 5 ? 5 : movies.results.length,
                                        perMove: movies.results.length >= 3 ? 3 : 1,
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
                                    perPage: data.results.length >= 2 ? 2 : data.results.length,
                                    perMove: data.results.length >= 2 ? 2 : 1,
                                },
                                640: {
                                    perPage: data.results.length >= 3 ? 3 : data.results.length,
                                    perMove: data.results.length >= 3 ? 1 : 1,
                                },
                                960 : {
                                    perPage: data.results.length >= 4 ? 4 : data.results.length,
                                    perMove: data.results.length >= 3 ? 3 : 1,
                                },
                                1200 : {
                                    perPage: data.results.length >= 5 ? 1 : data.results.length,
                                    perMove: data.results.length >= 3 ? 3 : 1,
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
            displayMovie(){
                // Passer l'info à App.vue qu'on affiche un film en détail
                this.$emit('updateToggleMovies', true);

            },
            getMovie(movieInfo){
                // Récupération des infos du film sélectionné
                this.movieSelected = movieInfo;

                var anchor = document.getElementById('genre-title');
                anchor.scrollIntoView({ behavior: 'instant' });
            }
        },
        watch: {
            // Check si on affiche un film en détail
            toggleMovies: function (boolean) {
                this.showMovie = boolean;
            },
        },
      }
</script>

<style scoped lang="scss">

    .movies-list:nth-child(2n) {
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

    .year-list{
        display: flex;
        flex-wrap: wrap;
        justify-content: center;
        align-items: baseline;
        gap: 15px;

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
        &:hover {
            transform: scale(1.1);
            transition: 0.2s;
            z-index: 999;
        }

        .movie-title {
            margin: 10px 0;
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