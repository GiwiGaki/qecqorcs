import { createRouter, createWebHistory } from 'vue-router';
import Home from '../views/Home.vue';
import MovieList from '../views/MovieList.vue';
import MovieDetail from '../views/MovieDetail.vue';

const routes = [
    {
        path: '/',
        name: 'Accueil',
        component: Home,
    },
    {
        path: '/genre/:genreName',
        name: 'Genre',
        component: MovieList,
        props: true
    },
    {
        path: '/genre/:genreName/:movieIdentifiant',
        name: 'Film',
        component: MovieDetail
    }
]

const router = createRouter({
    history: createWebHistory(),
    routes
  });
  
  export default router;