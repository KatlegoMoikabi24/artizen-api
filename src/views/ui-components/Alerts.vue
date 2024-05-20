<template>
  <BaseCard heading="Upload New Artwork">
    <v-row class="d-flex justify-center mt-4">
      <v-col cols="12" md="6">
        ArtWork Name
        <v-text-field v-model="artwork.name">
        </v-text-field>

        ArtWork Price
        <v-text-field v-model="artwork.price">
        </v-text-field>

        ArtWork Description
        <v-text-field>
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

  <h1 class="pl-2">My Artwork</h1>
  <v-divider></v-divider>
  <v-row class="pt-5">
    <v-col cols="12" lg="4">
      <v-card>
        <img
          style="width: 100%"
          src="@/assets/images/background/u1.jpg"
         alt="artwork"/>
        <v-card-text>
          <h5 class="title font-weight-medium mb-2 text-h6">
            Yellow Mellow Art Painting
          </h5>
          <h5 class="title font-weight-medium mb-2 text-h6">
            R4 800
          </h5>
          <p class="mb-3 text-body-2 text-grey-darken-1">
            Artwork design by K Msimango. -
            <b>  Rejected  </b>
          </p>
          <v-btn depressed color="info">Re-Upload Artwork</v-btn>
        </v-card-text>
      </v-card>
    </v-col>
    <v-col cols="12" lg="4">
      <v-card>
        <img
          style="width: 100%"
          src="@/assets/images/background/u2.jpg"
         alt=""/>
        <v-card-text>
          <h5 class="title font-weight-medium mb-2 text-h6">
            Pinkish 2018 Painting
          </h5>
          <h5 class="title font-weight-medium mb-2 text-h6">
            R5 200
          </h5>
          <p class="mb-3 text-body-2 text-grey-darken-1">
            Artwork design by K Msimango. -
            <b>  Approved  </b>
          </p>
          <v-btn depressed color="error">Delete Artwork</v-btn>
        </v-card-text>
      </v-card>
    </v-col>
    <v-col cols="12" lg="4">
      <v-card>
        <img
          style="width: 100%"
          src="@/assets/images/background/u3.jpg"
        />
        <v-card-text>
          <h5 class="title font-weight-medium mb-2 text-h6">
            White Khalamari Painting
          </h5>
          <h5 class="title font-weight-medium mb-2 text-h6">
           R2 800
          </h5>
          <p class="mb-3 text-body-2 text-grey-darken-1">
            Artwork design by K Msimango. -
            <b>  Approved  </b>
          </p>

          <v-row class="mt-5">
            <v-btn class="ml-2" depressed color="error">Delete Artwork</v-btn>
          </v-row>
        </v-card-text>
      </v-card>
    </v-col>
  </v-row>

</template>

<script setup lang="ts">
import { ref } from 'vue';
import BaseCard from "@/components/BaseCard.vue";
import axios from "axios";

const imageUrl = ref<string | null>(null);
const artwork = ref({
  id: 1,
  name: '',
  artist_id: '',
  approved_by: '',
  price: '',
  picture: ''
});
const selectedFile = ref<File | null>(null);

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

async function upload() {

  const user = JSON.parse(<string>localStorage.getItem('user'));

  if (!selectedFile.value) {
    alert('Please select a file');
    return;
  }

  const formData = new FormData();
  formData.append('name', artwork.value.name);
  formData.append('price', artwork.value.price);
  formData.append('artist_id',user.id);
  formData.append('picture', selectedFile.value);
  try {
    await axios.post('http://127.0.0.1:3333/api/v1/artwork', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    }).then(() => {
      alert('Artwork uploaded successfully, your artwork will be reviewed');
      window.location.reload();
    });
  } catch (error) {
    console.error('Upload failed', error);
  }
}
</script>

<style scoped>

</style>
