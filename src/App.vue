
<script setup>
  import { ref, computed } from 'vue'
</script>

<template>
  <header>
    <h1 id="main-title">
      <RouterLink to="/">
        Qu'est-ce qu'on regarde ce soir
      </RouterLink>
    </h1>
  </header>

  <!-- appel de la vue -->
  <router-view></router-view>

  <footer>
    <nav>
      <ul>
        <li>
          <a href="https://www.mallambicpierre.fr" target="_blank">https://www.mallambicpierre.fr</a>
        </li>
        <li>
          <a href="https://www.themoviedb.org" target="_blank">TMDB</a>
        </li>
      </ul>
    </nav>
  </footer>
</template>