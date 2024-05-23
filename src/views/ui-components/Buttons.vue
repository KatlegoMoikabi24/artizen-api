<script setup lang="ts">
import { ref, onMounted } from 'vue';
import axios from 'axios';

const artworks = ref([]);
const imageApiUrl = 'http://127.0.0.1:3333/api/v1/artwork/image/';
const getAllArtworks = 'http://127.0.0.1:3333/api/v1/artwork/';
const getAllUsers = 'http://127.0.0.1:3333/api/v1/users/';
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
