<template>   
    <div class="movie-detail">
        <div class="movie-img">
            <img v-if="movieInfo.poster_path" :src="pathimg + movieInfo.poster_path"  loading="lazy" alt="" />
        </div>
        <div class="movie-content">
            <div class="movie-info">
                <h3 class="movie-title">
                    <span>{{movieInfo.title}}</span>
                    <span v-if="movieInfo.release_date">({{ movieInfo.release_date.substring(0, 4) }})</span>
                </h3>
                <div v-if="runtime" class="movie-runtime">{{ runtime }}</div>
                <p  v-if="movieInfo.overview" class="movie-overview">{{movieInfo.overview}}</p>
            </div>
            <div v-if="directors" class="movie-directors">
                <h4>Réalisateur(s)</h4>
                <ul>
                    <li v-for="director in directors.slice(0,5)">
                        {{ director.name }}
                    </li>
                </ul>
            </div>
            <div v-if="credits" class="movie-castings">
                <h4>Castings</h4>
                <ul>
                    <li v-for="cast in credits.cast.slice(0,5)">
                        {{ cast.name }}
                    </li>
                </ul>
            </div>
            <div v-if="providers" class="movie-providers">
                <h4>Où regarder le film ?</h4>
                <div v-if="providers.flatrate">
                    <h5>En streaming</h5>
                    <ul>
                        <li v-for="provider in providers.flatrate">
                            <img width="30" height="30" :src="pathimg + provider.logo_path"  loading="lazy" :alt="provider.provider_name" :title="provider.provider_name"  />
                        </li>
                    </ul>
                </div>
                <div v-if="providers.rent">
                    <h5>En location</h5>
                    <ul>
                        <li v-for="provider in providers.rent">
                            <img width="30" height="30" :src="pathimg + provider.logo_path"  loading="lazy" :alt="provider.provider_name" :title="provider.provider_name"  />
                        </li>
                    </ul>
                </div>
                <div v-if="providers.buy">
                    <h5>A l'achat</h5>
                    <ul>
                        <li v-for="provider in providers.buy">
                            <img width="30" height="30" :src="pathimg + provider.logo_path"  loading="lazy" :alt="provider.provider_name" :title="provider.provider_name"  />
                        </li>
                    </ul>
                </div>
            </div>
            <div v-else class="movie-unavailable">
                Ce film n'est pas encore disponible en ligne.
            </div>
        </div>
    </div>
</template>

<script>
    const apiKey = 'api_key=26665d239c52005e4ebb0913a184b7e6';
    const baseUrl = 'https://api.themoviedb.org/3/';

    export default {
        props: {
            movieInfo : {
                type: Object,
                required: true,
            }
        },
        data(){
            return {
                pathimg: 'https://image.tmdb.org/t/p/w342/' ,
                providers: null,
                credits: null,
                directors: null,
                runtime: null
            }
        },
        methods: {
            // Récupération des plateformes où le film est visible
            async getProvider(movieId){
                const response = await fetch(`${baseUrl}movie/${movieId}/watch/providers?${apiKey}`);
                const providers = await response.json();
                this.providers = providers.results.FR;
            },
            // Récupération des crédits du film
            async getCredit(movieId){
                const response = await fetch(`${baseUrl}movie/${movieId}/credits?${apiKey}&language=fr`);
                const credits = await response.json();
                this.credits = credits;

                // Récupération des réalisateurs
                const directors =  credits.crew.filter(({job})=> job ==='Director');
                this.directors = JSON.parse(JSON.stringify(directors));
            },
            // Récupération de la durée  du film
            async getRuntime(movieId){
                const response = await fetch(`${baseUrl}movie/${movieId}?${apiKey}&`);
                const runtime = await response.json();
                const duration = runtime.runtime;

                var hours = Math.trunc(duration/60);
                var minutes = duration % 60;
                this.runtime = hours +" h "+ minutes;
            }
        },
        beforeMount() {
            this.getProvider(this.movieInfo.id);
            this.getCredit(this.movieInfo.id);
            this.getRuntime(this.movieInfo.id);
        }
    }
</script>

<style scoped lang="scss">
    .movie-detail {
        margin-top: 30px;
        display: flex;
        flex-wrap: wrap;
        gap: 30px;

        .movie-img {
            width: 100%;
            max-height: 300px;
            
            img {
                width: 100%;
                height: 100%;
                object-fit: contain;
            } 
        }
        .movie-content {
            min-width: 1px;
            padding: 0 30px;
            flex: 1;
            .movie-info {
                display: flex;
                flex-wrap: wrap;
                align-items: center;
                margin-bottom: 44px;
                .movie-title {
                    flex: 1;
                    font-size: 2rem;

                    &::first-letter {
                        font-size: 3rem;
                        color: var(--color-red);
                    }
                    span:not(:last-child) {
                        margin: 0 10px 0 0;
                    }
                }   
                .movie-runtime {
                    margin-left: auto;
                    width: 100%;
                    font-size: 2rem;
                    color: var(--color-blue);
                }
                .movie-overview {
                    width: 100%;
                }     
                p {
                    font-size: 1.2rem;
                }   
                .imdb-link {
                    display: block;
                    margin: 10px 0;
                    font-size: 1.2rem;
                    color: var(--color-blue-soft);
                }
            }
            .movie-directors {
                margin: 22px 0;
                h4 {
                    font-size: 1.5rem;
                    line-height: 1.7rem;
                    margin-bottom: 15px;
                    display: inline-flex;
                    border-bottom: 1px solid var(--color-red);

                }
                ul{
                    display: flex;
                    flex-wrap: wrap;
                    gap: 10px;
                    margin-left: 5px;
                    li {
                        font-size: 1.2rem;
                        &:not(:last-child)::after{
                            content: '|';
                            color: var(--color-blue-soft);
                            margin-left: 10px;
                        }
                    }
                }
            }
            .movie-castings{
                margin: 22px 0;
                h4 {
                    font-size: 1.5rem;
                    line-height: 1.7rem;
                    margin-bottom: 15px;
                    display: inline-flex;
                    border-bottom: 1px solid var(--color-blue);
                }
                ul{
                    display: flex;
                    flex-wrap: wrap;
                    gap: 10px;
                    margin-left: 5px;
                    li {
                        font-size: 1.2rem;
                        
                        &:not(:last-child)::after{
                            content: '|';
                            color: var(--color-blue-soft);
                            margin-left: 10px;
                        }
                    }
                    
                }
            }
            .movie-providers {
                margin: 44px 0;
                h4 {
                    font-size: 1.5rem;
                    line-height: 1.7rem;
                    margin-bottom: 15px;
                    display: inline-flex;
                    border-bottom: 1px solid var(--color-yellow);
                }
                ul {
                    list-style: none;
                    display: flex;
                    flex-wrap: wrap;
                    gap: 10px;
                    margin: 10px 0;
                }
                h5 {
                    font-size: 1.3rem;
                }
                &> div {
                    margin-left: 5px;
                }
            }
            .movie-unavailable {
                margin: 30px 0;
            }
        }
    }

    @media screen and (min-width: 600px) {
        .movie-detail {
            .movie-img {
                max-height: 100%;

                width: 30%;

                img {
                    height: auto;
                }
            }
            .movie-content {
                padding: 0;
                .movie-info {
                    .movie-runtime {
                        width: auto;
                    }
                }
            }
        }
    }
</style>