<script setup lang="ts">
import { ref, onMounted } from 'vue';
import axios from "axios";
import Swal from "sweetalert2";
const API_URL = import.meta.env.VITE_API_URL;

const select = ref("March");
const items = ref(["March", "April", "May", "June"]);

const monthtable = ref([]);
const usersData = ref([]);

const getAllArtworks = `${API_URL}artwork/`;
const getAllUsers = `${API_URL}users/`;
const approveAPI = `${API_URL}artwork/approve/`;
const rejectAPI = `${API_URL}artwork/reject/`;


onMounted(async () => {
  try {
    const response = await axios.get(getAllArtworks);
    const usersResponse = await axios.get(getAllUsers);

    monthtable.value = response.data;
    usersData.value = usersResponse.data;

  } catch (error) {
    console.error('Error fetching artworks:', error);
  }
});

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
</script>

<template>
  <v-card elevation="3" class="w-100 h-100">

    <v-card-text>
      <div class="d-sm-flex align-center">
        <div>
          <h2 class="title text-h6 font-weight-medium">Overall Artworks</h2>
        </div>
        <v-spacer></v-spacer>
        <div class="ml-auto">
          <v-row>
            <v-btn elevation="7">Export to Excel</v-btn>
            <v-btn class="ml-2" color="default" elevation="5">Export to CSV</v-btn>
          </v-row>
        </div>
      </div>

      <v-table class="month-table mt-10">

        <template v-slot:default>

          <thead>
            <tr>
              <th class="font-weight-medium text-subtitle-1">ID</th>
              <th class="font-weight-medium text-subtitle-1">Artist</th>
              <th class="font-weight-medium text-subtitle-1">Artwork Name</th>
              <th class="font-weight-medium text-subtitle-1">Artwork Status</th>
              <th class="font-weight-medium text-subtitle-1">Price</th>
              <th class="font-weight-medium text-subtitle-1">Bought By</th>
              <th class="font-weight-medium text-subtitle-1">Actionable Item</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="item in monthtable"
              :key="item.id"
              class="month-item"
            >
              <td>{{ item.id }}</td>
              <td>
                <h4 class="font-weight-bold text-no-wrap">
                  {{ getUserDetails(item.artist_id) }}
                </h4>
              </td>
              <td>
                <h5
                  class="
                    font-weight-medium
                    text-no-wrap text-body-2 text-grey-darken-1
                  "
                >{{ item.name }}

                </h5>
              </td>
              <td>
                <v-chip
                  :color="item.statuscolor"
                  size="large"
                  label
                  ><b>{{ (item.status === "" ? "REJECTED" : item.status.toUpperCase()) }}</b>
                </v-chip >
              </td>
              <td>
                <h4>R {{ item.price }}</h4>
              </td>
              <td>
                <h4>{{ getUserDetails(item.bought_by) }}</h4>
              </td>
              <td>
                <v-row>
                  <v-btn
                    class="pl-5 ml-2"
                    color="success"
                    @click="approve(item.id)"
                    elevation="7"
                    :disabled="item.status === 'approved'  || item.status === 'sold'"
                  >
                    Approve
                  </v-btn>
                  <v-btn
                    class="pl-5 ml-2"
                    color="error"
                    @click="reject(item.id)"
                    elevation="7"
                    :disabled="item.status === '' || item.status === 'sold'"
                  >
                    Reject
                  </v-btn>
                </v-row>
              </td>
            </tr>
          </tbody>
        </template>
      </v-table>
    </v-card-text>
  </v-card>
</template>
