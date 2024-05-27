<script setup lang="ts">
import { ref, onMounted } from 'vue';
import axios from 'axios';
const API_URL = import.meta.env.VITE_API_URL;

// Define your API endpoints using the base URL
const imageApiUrl = `${API_URL}artwork/image/`;
const getByArtistId = `${API_URL}artwork/artist/`;
const deleteArtworkAPI = `${API_URL}artwork/`;
const getAllArtworks = `${API_URL}artwork/`;
const getAllUsers = `${API_URL}users/`;
const approveAPI = `${API_URL}artwork/approve/`;
const rejectAPI = `${API_URL}artwork/reject/`;
const artworks = ref([]);
const user = JSON.parse(<string>localStorage.getItem('user'));
const usersData = ref([]);
function getUserDetails(id: any) {
  const userObj = usersData.value.find(item => item.id === id);

  if(userObj) {
    return `${userObj.name}  ${userObj.surname}`;
  }
}
onMounted(async () => {
  try {
    const response = await axios.get(getAllArtworks);
    const usersResponse = await axios.get(getAllUsers);

    artworks.value =  response.data.filter(item => item.status !== '');
    usersData.value = usersResponse.data;

  } catch (error) {
    alert(error);
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
          <p class="mb-3">
            Artwork Designed by - {{ getUserDetails(artwork.artist_id) }}
          </p>
          <b>Status: </b> {{ artwork.status.toUpperCase() }}
          <br>
          <br>
          <v-btn block v-if="artwork.status === ''" depressed color="error" disabled>Rejected</v-btn>
          <v-btn
            v-if="artwork.status === 'pending'"
            depressed color="info"
            disabled
            block
          >
            Pending Approval
          </v-btn>
          <v-btn
            v-if="artwork.status === 'approved' && user.role !== 'admin'"
            elevation="5"
            color="success"
            :to="'/ui-components/menus?art='+artwork.id"
            block
          >
            Buy Artwork
          </v-btn>
        </v-card-text>
      </v-card>
    </v-col>
  </v-row>
</template>
