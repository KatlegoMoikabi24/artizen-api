<script setup lang="ts">
import { ref } from "vue";

const desserts = ref([]);
</script>

<template>
  <!-- ----------------------------------------------------------------------------- -->
  <!-- Dencity -->
  <!-- ----------------------------------------------------------------------------- -->
  <div>
    <p class="text-subtitle-1 text-grey-darken-1">
      Change or manage user Role
    </p>
    <div class="mt-4">
      <v-table density="compact">
        <thead>
          <tr>
            <th class="text-left text-subtitle-2">Name</th>
            <th class="text-left text-subtitle-2">Role</th>
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
