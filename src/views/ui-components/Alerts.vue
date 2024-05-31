<template>
  <BaseCard heading="Upload New Artwork">
    <v-row class="d-flex justify-center mt-4">
      <v-col cols="12" md="6">
        ArtWork Name
        <v-text-field v-model="artwork.name">
        </v-text-field>

        ArtWork Price
        <v-text-field
          type="number"
          label="Price"
          v-model="artwork.price">
        </v-text-field>

        <v-file-input
          label="Upload Picture"
          outlined
          dense
          rounded
          accept="image/*"
          @change="handleFileUpload"

        ></v-file-input>
        <v-img
          v-if="imageUrl"
          :src="imageUrl"
          class="mt-4"
          max-height="300"
          max-width="100%"
          contain
        ></v-img>
      </v-col>
    </v-row>
    <v-row>
      <v-btn
        class="pl-5 ml-5"
        @click="upload"
        v-if="imageUrl!== null"
      >Upload </v-btn>
    </v-row>
  </BaseCard>

  <h1 class="pl-2">My Artworks</h1>
  <v-divider></v-divider>
  <v-row class="pt-5">
    <v-col v-for="artwork in artworks" :key="artwork.id" cols="12" lg="4">
      <v-card elevation="7">
        <img
          style="width: 100%;"
          height="320"
          :src="`data:image/png;base64,${artwork.picture}`"
          :alt="artwork.name"
        />
        <v-card-text>
          <h5 class="title font-weight-medium mb-2 text-h6">{{ artwork.name }}</h5>
          <h5 class="title font-weight-medium mb-2 text-h6"> R {{ artwork.price }}</h5>
          <p class="mb-3">
            Artwork design by
            <b>{{ `${userDetails.name} ${userDetails.surname}` }}</b>
          </p>
           <b>Status: </b> {{ artwork.status.toUpperCase() }}
          <br>
          <br>
          <v-btn
            v-if="artwork.status !== 'approved' || artwork.status === 'sold'"
            elevation="5"
            color="success"
            @click="deleteArtwork(artwork)"
          >Delete</v-btn>
        </v-card-text>
      </v-card>
    </v-col>
  </v-row>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import BaseCard from "@/components/BaseCard.vue";
import axios from "axios";
import Swal from "sweetalert2";
const API_URL = 'https://first-unbiased-osprey.ngrok-free.app/api/v1/';

const imageUrl = ref<string | null>(null);
const artworks = ref([]);
const userDetails = ref({});

const imageApiUrl = `${API_URL}artwork/image/`;
const getByArtistId = `${API_URL}artwork/artist/`;
const deleteArtworkAPI = `${API_URL}artwork/`;
const axiosInstance = axios.create({
  headers: {
    'ngrok-skip-browser-warning': 'true',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, PATCH, DELETE',
    'Access-Control-Allow-Headers': 'Origin, X-Requested-With, Content-Type, Accept',
  },
});
const artwork = ref({
  id: 1,
  name: '',
  artist_id: '',
  approved_by: '',
  price: '',
  picture: ''
});
const selectedFile = ref<File | null>(null);

async function deleteArtwork(item:any) {
  const response = await axiosInstance.delete(deleteArtworkAPI + item.id);

  alert(response.data.message);
}
function handleFileUpload(event: Event) {
  const target = event.target as HTMLInputElement;
  const file = target.files ? target.files[0] : null;
  if (file) {
    selectedFile.value = file;
    const reader = new FileReader();
    reader.onload = (e) => {
      imageUrl.value = e.target?.result as string;
    };
    reader.readAsDataURL(file);
  } else {
    imageUrl.value = null;
  }
}
onMounted(async () => {
  try {
    const user = JSON.parse(<string>localStorage.getItem('user'));
    const response = await axiosInstance.get(getByArtistId + user.id);

    artworks.value = response.data.artworks;
    userDetails.value = response.data.user;

  } catch (error) {
    console.error('Error fetching artworks:', error);
  }
});
async function upload() {

  const user = JSON.parse(<string>localStorage.getItem('user'));

  if (!selectedFile.value) {
    await Swal.fire({
      title: 'Upload Error!',
      text: 'Please Select A File',
      icon: 'error',
      confirmButtonText: 'Ok'
    });
    return;
  }

  if(artworks.value.find(item => item.name === artwork.value.name)){
    await Swal.fire({
      title: 'Artwork Already Exist!',
      text: 'Please Select Another File or Change its name',
      icon: 'error',
      confirmButtonText: 'Ok'
    });
  } else {
    const formData = new FormData();
    formData.append('name', artwork.value.name);
    formData.append('price', artwork.value.price);
    formData.append('artist_id',user.id);
    formData.append('picture', selectedFile.value);
    try {
      await axiosInstance.post(`${API_URL}artwork`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      }).then(async () => {
        await Swal.fire({
          title: 'Artwork Uploaded!',
          text: 'Your Artwork Will be Reviewed',
          icon: 'success',
          confirmButtonText: 'Ok'
        });
        window.location.reload();
      });
    } catch (error) {
      alert(error)
    }
  }
}
</script>

<style scoped>

</style>
