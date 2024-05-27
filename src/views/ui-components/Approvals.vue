<script setup lang="ts">
import { ref, onMounted } from 'vue';
import axios from 'axios';
import Swal from "sweetalert2";
const API_URL = import.meta.env.VITE_API_URL;

const artworks = ref([]);
const imageApiUrl = `${API_URL}artwork/image/`;
const getAllArtworks = `${API_URL}artwork/`;
const getAllUsers = `${API_URL}users/`;
const approveAPI = `${API_URL}artwork/approve/`;
const rejectAPI = `${API_URL}artwork/reject/`;

const usersData = ref([]);
function getUserDetails(id: any) {
  const userObj = usersData.value.find(item => item.id === id);

  if(userObj) {
    return `${userObj.name}  ${userObj.surname}`;
  }
}
async function approve(id: any) {
  await Swal.fire({
    title: 'Approve Artwork?',
    text: 'Are you sure you would like to approve this artwork?',
    icon: 'question',
    confirmButtonText: 'Yes, I am sure',
    showCancelButton: true
  }).then(async (result) => {
    if (result.value) {
      await axios.put(approveAPI + id).then(async () => {
        await Swal.fire({
          title: 'Artwork approved!',
          text: 'Artwork approved Successfully',
          icon: 'success',
          confirmButtonText: 'Ok'
        }).then(() => {
          location.reload();
        });
      }).catch(error => {
        Swal.fire({
          title: 'Failed To Approve Artwork!',
          text: error,
          icon: 'error',
          confirmButtonText: 'Ok'
        }).then(() => {
          location.reload();
        })
      })
    }
  });
}

async function reject(id: any) {
  await Swal.fire({
    title: 'Reject Artwork?',
    text: 'Are you sure you would like to reject this artwork?',
    icon: 'question',
    confirmButtonText: 'Yes, I am sure',
    showCancelButton: true
  }).then(async (result) => {
    if (result.value) {
      await axios.put(rejectAPI + id).then(async () => {
        await Swal.fire({
          title: 'Artwork rejected!',
          text: 'Artwork rejected Successfully',
          icon: 'success',
          confirmButtonText: 'Ok'
        }).then(() => {
          location.reload();
        });
      }).catch(error => {
        Swal.fire({
          title: 'Failed To Reject Artwork!',
          text: error,
          icon: 'error',
          confirmButtonText: 'Ok'
        }).then(() => {
          location.reload();
        })
      })
    }
  });
}


onMounted(async () => {
  try {
    const response = await axios.get(getAllArtworks);
    const usersResponse = await axios.get(getAllUsers);

    artworks.value = response.data;
    usersData.value = usersResponse.data;

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
            Artwork design by - {{ getUserDetails(artwork.artist_id) }}
          </p>
          <b>Status: </b> {{( artwork.status === '' ? 'Rejected' :  artwork.status.toUpperCase()) }}
          <br>
          <br>

          <v-btn
            :disabled="artwork.status === 'approved'  || artwork.status === 'sold'"
            depressed color="info"
            elevation="6"
            @click="approve(artwork.id)"
            block
          >
            Approve
          </v-btn>

          <v-btn
            class="mt-2"
            elevation="8"
            :disabled="artwork.status === ''  || artwork.status === 'sold'"
            color="error"
            @click="reject(artwork.id)"
            block
          >
            Reject
          </v-btn>
        </v-card-text>
      </v-card>
    </v-col>
  </v-row>
</template>
