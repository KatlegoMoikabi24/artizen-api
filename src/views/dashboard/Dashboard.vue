<script setup lang="ts">
import { onMounted } from 'vue';
import { useRouter } from 'vue-router';
import TheSalesOverview from "./dashboardComponents/sales-overview/TheSalesOverview.vue";
import DailyActivities from "./dashboardComponents/daily-activities/DailyActivities.vue";
import ProductMonthTable from "./dashboardComponents/project-month-table/ProductMonthTable.vue";
import BlogCard from "./dashboardComponents/blog-card/BlogCard.vue";

function hasValidToken() {
  const token = localStorage.getItem('user');
  if(token === null) {
    location.href = window.location.href='auth/login';
  }
  return !!token;
}

const router = useRouter();

onMounted(() => {
  if (!hasValidToken()) {
    router.push('/login');
  }
});
</script>

<template>
  <v-row>
    <v-col cols="12" sm="12">
      <TheSalesOverview />
    </v-col>
    <v-col cols="12" lg="4" class="d-flex align-items-stretch">
      <DailyActivities />
    </v-col>
    <v-col cols="12" lg="8" class="d-flex align-items-stretch">
      <ProductMonthTable />
    </v-col>
    <v-col cols="12" sm="12">
      <BlogCard />
    </v-col>
  </v-row>
</template>
