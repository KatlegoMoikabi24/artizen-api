<script setup lang="ts">
import { ref, onMounted } from 'vue';
import axios from 'axios';

const artworks = ref([]);
const imageApiUrl = 'http://127.0.0.1:3333/api/v1/artwork/image/';

// Fetch data when the component is mounted
onMounted(async () => {
  try {
    const response = await axios.get('http://127.0.0.1:3333/api/v1/artwork');
    artworks.value = response.data;
  } catch (error) {
    console.error('Error fetching artworks:', error);
  }
});
</script>

<template>
  <h1>
    Art Gallery
  </h1>

  <v-divider></v-divider>
  <v-row class="pt-5">
    <v-col v-for="artwork in artworks" :key="artwork.id" cols="12" lg="4">
      <v-card>
        <img
          style="width: 100%;"
          height="320"
          :src="`${imageApiUrl}${artwork.picture}`"
          :alt="artwork.name"
        />
        <v-card-text>
          <h5 class="title font-weight-medium mb-2 text-h6">{{ artwork.name }}</h5>
          <h5 class="title font-weight-medium mb-2 text-h6"> R {{ artwork.price }}</h5>
          <p class="mb-3 text-body-2 text-grey-darken-1">
            Artwork design by {{ artwork.artist }}. -
            <b>{{ artwork.status }}</b>
          </p>
          <v-btn v-if="artwork.status === 'Rejected'" depressed color="info">Re-Upload Artwork</v-btn>
          <v-btn v-if="artwork.status === 'pending'" depressed color="error">Buy Artwork</v-btn>
        </v-card-text>
      </v-card>
    </v-col>
  </v-row>
</template>
