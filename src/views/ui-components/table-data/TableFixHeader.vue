<script setup lang="ts">
import { ref, onMounted } from "vue";
import axios from "axios";

const usersData = ref([]);
const roles = ['Buyer', 'Artist'];
const API_URL = 'https://bunny-growing-anemone.ngrok-free.app/api/v1/';
const axiosInstance = axios.create({
  headers: {
    'ngrok-skip-browser-warning': 'true',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, PATCH, DELETE',
    'Access-Control-Allow-Headers': 'Origin, X-Requested-With, Content-Type, Accept',
  },
});
const getAllUsers = async () => {
  try {
    const response = await axiosInstance.get(`${API_URL}users/`);
    usersData.value = response.data;
  } catch (error) {
    console.error('Error fetching users:', error);
  }
};

const updateUser = async (user:any) => {
  try {
    await axiosInstance.put(`${API_URL}users/${user.id}`, {
      name: user.name,
      surname: user.surname,
      email: user.email,
      role: user.role,
      contacts: user.contacts
    });
    alert('User updated successfully!');
  } catch (error) {
    console.error('Error updating user:', error);
    alert('Failed to update user.');
  }
};

onMounted(getAllUsers);
</script>


<template>
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
          <th class="text-left">Actionable Item</th>
        </tr>
        </thead>
        <tbody>
        <tr v-for="user in usersData" :key="user.id">
          <td>
            <v-text-field v-model="user.name" dense hide-details></v-text-field>
          </td>
          <td>
            <v-text-field v-model="user.surname" dense hide-details></v-text-field>
          </td>
          <td>
            <v-text-field v-model="user.email" dense hide-details></v-text-field>
          </td>
          <td>
            <v-select
              :items="roles"
              v-model="user.role"
              dense
              hide-details
              solo
            ></v-select>
          </td>
          <td>
            <v-text-field v-model="user.contacts" dense hide-details type="Phone Number"></v-text-field>
          </td>
          <td>
            <v-btn @click="updateUser(user)" dense>Update</v-btn>
          </td>
        </tr>
        </tbody>
      </v-table>
    </div>
  </div>
</template>
