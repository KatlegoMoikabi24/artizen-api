<script setup lang="ts">
import { ref, onMounted } from 'vue';
import axios from "axios";

const select = ref("March");
const items = ref(["March", "April", "May", "June"]);

const monthtable = ref([]);

const getAllArtworks = 'http://127.0.0.1:3333/api/v1/artwork/';
onMounted(async () => {
  try {

    const response = await axios.get(getAllArtworks);
    monthtable.value = response.data;
  } catch (error) {
    console.error('Error fetching artworks:', error);
  }
});
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
                  {{ item.name }}
                </h4>
              </td>
              <td>
                <h5
                  class="
                    font-weight-medium
                    text-no-wrap text-body-2 text-grey-darken-1
                  "
                >
                  {{ item.name }}
                </h5>
              </td>
              <td>
                <v-chip
                  :color="item.statuscolor"
                  size="large"
                  label
                  ><i>{{ item.status.toUpperCase() }}</i>
                </v-chip >
              </td>
              <td>
                <h4>R {{ item.price }}</h4>
              </td>
              <td>
                <v-row>
                  <v-btn class="pl-5 ml-2" color="success">Approve</v-btn>
                  <v-btn class="pl-5 ml-2" color="error">Reject</v-btn>
                </v-row>
              </td>
            </tr>
          </tbody>
        </template>
      </v-table>
    </v-card-text>
  </v-card>
</template>
