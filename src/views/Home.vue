<template>
  <main>
    <section class="genres">
      <ul id="genres-list">
        <li v-for="genre in genres" :key="genre.id">
          <RouterLink :to="{
            name: 'Genre',
            params: {
              genreName: genre.name.toLowerCase()
            }
          }" :title="genre.name">
            <img :src="`/images/${genre.id}.webp`" alt="" />
            <h2 class="genres-title">{{ genre.name }}</h2>
          </RouterLink>
        </li>
      </ul>
    </section>
  </main>
</template>

<script type="module">

    const apiKey = 'api_key=26665d239c52005e4ebb0913a184b7e6';
    const baseUrl = 'https://api.themoviedb.org/3/';
    const genresList = baseUrl + 'genre/movie/list?language=fr&' + apiKey;
    export default {
        name: 'Accueil',

        data(){
          return {
              genres : null,
            }
        },
        mounted() {
          window.scrollTo(0, 0);
          // Récupération des genres au lancement de l'app 
          fetch(genresList)
              .then(response => response.json())
              .then((response) => { 
                this.genres = response.genres;
              })
              .catch(err => console.error(err));
          
        },
    }
</script>

<style scoped lang="scss">

  .genres {
    position: relative;
    margin-top: 80px;

    #genres-list {
      padding: 0;
      margin: 0;
      list-style: none;
      display: grid;
      grid-template-columns: repeat(1, 1fr);
      grid-column-gap: 10px;
      grid-row-gap: 20px;
      li {
        a {
          height: 300px;
          width: 100%;
          display: block;
          position: relative;

          &:hover{
            h2.genres-title {
              letter-spacing:6px;
              height: 100%;
              background-color: #000000d7;
              &::before{
                content: '';
                width: 75%;
                transition-delay: 0.2s; 
              }
            }
          }

          img {
            width: 100%;
            height: 100%;
            object-fit: cover;
          }
          h2.genres-title{
            position: absolute;
            bottom: 0;
            background-color: #000000cc;
            color: var(--color-text);
            width: 100%;
            text-transform: uppercase;
            letter-spacing: 3px;
            padding: 5px 10px;
            height: 35px;
            display: flex;
            justify-content: center;
            align-items: center;
            transition: 0.4s;
            font-weight: 700;
            &::before{
              content: '';
              position: absolute;
              bottom: 15px;
              left: 12.5%;
              width: 0%;
              height: 2px;
              background-color: var(--color-yellow);
              transition: 0.4s;
              transition-delay: 0; 
              }
          }
          
        }

      }
    }
  }
  #genre-title {
    text-align: center;
    font-family: var(--font-1);
    font-size: 2rem;
    text-transform: uppercase;
    letter-spacing: 3px;

    &::first-letter {
      color: var(--color-blue-soft);
      font-size: 3rem;
    }
  }

  @media screen and (min-width: 600px) {
    .genres {
      #genres-list {
          grid-template-columns: repeat(2, 1fr);
      }
    }
  }

  @media screen and (min-width: 960px) {
    .genres {
      #genres-list {
          grid-template-columns: repeat(3, 1fr);
      }
    }
  }

  @media screen and (min-width: 1200px) {
    .genres {
      #genres-list {
          grid-template-columns: repeat(4, 1fr);
      }
    }
  }
</style>