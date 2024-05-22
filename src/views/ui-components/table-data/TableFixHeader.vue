<script setup lang="ts">
import { ref } from "vue";

const desserts = ref([
]);
</script>

<template>
  <!-- ----------------------------------------------------------------------------- -->
  <!-- Fixed Header -->
  <!-- ----------------------------------------------------------------------------- -->
  <div>
    <p class="text-subtitle-1 text-grey-darken-1">
     Manage User Profile
    </p>
    <div class="mt-4">
      <v-table fixed-header height="300px">
        <thead>
          <tr>
            <th class="text-left">Name</th>
            <th class="text-left">Surname</th>
            <th class="text-left">Email</th>
            <th class="text-left">User Role</th>
            <th class="text-left">Password</th>
            <th class="text-left">Confirm Password</th>
            <th class="text-left">Actionable Item</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="item in desserts" :key="item.name">
            <td>{{ item.name }}</td>
            <td>{{ item.calories }}</td>
          </tr>
        </tbody>
      </v-table>
    </div>
  </div>
</template>
