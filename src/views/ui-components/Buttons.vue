<script setup lang="ts">
import { ref, onMounted } from 'vue';
import axios from 'axios';
import moment from "moment";
import Swal from "sweetalert2";

const API_URL = "https://bunny-growing-anemone.ngrok-free.app/api/v1/";
const axiosInstance = axios.create({
  headers: {
    'ngrok-skip-browser-warning': 'true',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, PATCH, DELETE',
    'Access-Control-Allow-Headers': 'Origin, X-Requested-With, Content-Type, Accept',
  },
});

const imageApiUrl = `${API_URL}artwork/image/`;
const getAllArtworks = `${API_URL}artwork/`;
const getAllUsers = `${API_URL}users/`;
const placeBidAPI = `${API_URL}artwork/update/`;
const artworks = ref([]);
const countdowns = ref<{ [key: number]: string }>({});
const usersData = ref([]);
const user = JSON.parse(<string>localStorage.getItem('user'));

const bidAmounts = ref<{ [key: number]: string }>({});
function getUserDetails(id: number) {
  const userObj = usersData.value.find(item => item.id === id);
  if (userObj) {
    return `${userObj.name} ${userObj.surname}`;
  }
  return '';
}

function startCountdown(artwork: any) {
  const createdAt = moment(artwork.created_at);
  const expiresAt = createdAt.add(1, 'minutes');

  const updateCountdown = () => {
    const now = moment();
    const duration = moment.duration(expiresAt.diff(now));

    if (duration.asSeconds() <= 0 && artwork.status === 'approved') {
      countdowns.value[artwork.id] = 'Bought';
    } else {
      countdowns.value[artwork.id] = `${duration.hours()}h ${duration.minutes()}m ${duration.seconds()}s`;
    }
  };

  updateCountdown();
  setInterval(updateCountdown, 1000);
}
onMounted(async () => {
  try {
    const response = await axiosInstance.get(getAllArtworks);
    const usersResponse = await axiosInstance.get(getAllUsers);
    artworks.value = response.data.filter(item => item.status !== '');
    usersData.value = usersResponse.data;

    artworks.value.forEach(artwork => {
      startCountdown(artwork);

      bidAmounts.value[artwork.id] = '';
    });
  } catch (error) {
    console.log(import.meta.env);
  }
});

async function placeBid(artwork: any) {
  const bidAmount = bidAmounts.value[artwork.id];

  if (!bidAmount || isNaN(parseFloat(bidAmount))) {
    alert('Please enter a valid bid amount.');
    return;
  }
  const currentBid = artwork.price;
  if (parseFloat(bidAmount) <= currentBid) {
    alert('Bid amount must be higher than the current bid amount.');
    return;
  }

  try {
    await Swal.fire({
      title: 'Place Bid',
      text: 'Are you sure you would like to place a bid for this artwork?',
      icon: 'question',
      confirmButtonText: 'Yes, I am sure',
      showCancelButton: true
    }).then(async (result) => {
      if (result.value) {
        await axiosInstance.post(placeBidAPI + artwork.id, {
          bought_by: user.id,
          price: bidAmount,
        }).then(() => {
          Swal.fire({
            title: 'Place bid!',
            text: 'Bid for this order is successfully placed',
            icon: 'success',
            confirmButtonText: 'Ok'
          }).then(() => {
            location.reload();
          })
        }).catch(error => {
          Swal.fire({
            title: 'Failed To Place bid !',
            text: error.response.data,
            icon: 'error',
            confirmButtonText: 'Ok'
          })
        })
      }
    });
  } catch (error) {
    alert('Error Occurred : ' + error);
  }
}

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
          <v-divider></v-divider>
          <h5 class="title font-weight-medium mb-2 text-h6">Current Bid: <b>R {{ artwork.price }}</b></h5>
          <p class="mb-3">
            Artwork Designed by - {{ getUserDetails(artwork.artist_id) }}
          </p>
          <br>
          <b>Status: </b> {{ artwork.status.toUpperCase() }}
          <br><br>
          <b>Time Left: </b> {{ countdowns[artwork.id] }}
          <br><br>

          <v-text-field v-model="bidAmounts[artwork.id]" label="Enter Bid Amount.."></v-text-field>

          <v-btn
            block
            @click="placeBid(artwork)"
            v-if="artwork.status === ''"
            depressed color="error"
            disabled
          >Rejected
          </v-btn>
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
            @click="placeBid(artwork)"
            block
          >
            Place Bid
          </v-btn>
        </v-card-text>
      </v-card>
    </v-col>
  </v-row>
</template>

<style scoped>
.error-message {
  color: red;
}
</style>
