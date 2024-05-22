<script setup lang="ts">
import { ref, onMounted } from 'vue';
import axios from 'axios';

const artworks = ref([]);
const imageApiUrl = 'http://127.0.0.1:3333/api/v1/artwork/image/';
const getAllArtworks = 'http://127.0.0.1:3333/api/v1/artwork/';
onMounted(async () => {
  try {
    const response = await axios.get(getAllArtworks);
    artworks.value = response.data;
  } catch (error) {
    console.error('Error fetching artworks:', error);
  }
});
</script>

<template>
  <h1>
    Manage Artworks
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
          <p class="mb-3">
            Artwork design by
            <!--  <b>{{ `${userDetails.name} ${userDetails.surname}` } }</b>   -->
          </p>
          <b>Status: </b> {{( artwork.status === '' ? 'Rejected' :  artwork.status.toUpperCase()) }}
          <br>
          <br>
          <v-btn
            block
            v-if="artwork.status === ''"
            depressed color="info"
          >Approve</v-btn>

          <v-btn
            v-if="artwork.status === 'pending'"
            depressed color="info"
            block
          >
            Approve
          </v-btn>

          <v-btn
            v-if="artwork.status === 'pending'"
            class="mt-2"
            depressed color="error"
            block
          >
            Reject
          </v-btn>
        </v-card-text>
      </v-card>
    </v-col>
  </v-row>
</template>
