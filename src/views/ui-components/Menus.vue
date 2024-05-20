<template>
  <v-container>
    <v-row v-if="onBuy">
      <v-col cols="12" md="6">
        <BaseCard heading="Your Order">
          <div class="order-details">
            <div class="order-item" v-for="item in cartItems" :key="item.id">
              <div class="item-name">
                <h2>{{ item.name }}</h2>
              </div>
              <div class="item-quantity">
                <b>Quantity:</b> 1
              </div>
              <div class="item-price">
                <strong>Price: R</strong>{{ item.price.toFixed(2) }}
              </div>
              <v-divider></v-divider>
              <div class="order-total">
                <strong>Total: R{{ item.price.toFixed(2) }}</strong>
              </div>
            </div>
          </div>
        </BaseCard>
      </v-col>
      <v-col cols="12" md="6">
        <BaseCard heading="Payment Gateway">
          <div class="paypal-header">
            <img
              src="https://www.paypalobjects.com/webstatic/icon/pp258.png"
              alt="PayPal Logo"
              class="paypal-logo"
            />
            <h2>Checkout with PayPal</h2>
          </div>
          <v-form @submit.prevent="handlePaymentSubmit">
            <v-text-field
              label="Card Number"
              v-model="cardNumber"
              type="text"
              required
            ></v-text-field>
            <v-text-field
              label="Expiry Date (MM/YY)"
              v-model="expiryDate"
              type="text"
              required
            ></v-text-field>
            <v-text-field
              label="CVV"
              v-model="cvv"
              type="text"
              required
            ></v-text-field>
            <v-text-field
              label="Total Amount"
              :value="`R${totalAmount.toFixed(2)}`"
              readonly
            ></v-text-field>
            <v-btn color="primary" type="submit" block>Pay Now</v-btn>
          </v-form>
        </BaseCard>
      </v-col>
    </v-row >
    <v-row>
      <v-col cols="12">
        <BaseCard heading="Payment History">
          <v-table
            :headers="paymentHistoryHeaders"
            :items="paymentHistory"
            class="elevation-1"
          >
            <template v-slot:item.amount="{ item }">
              <span>R{{ item.amount.toFixed(2) }}</span>
            </template>
          </v-table>
        </BaseCard>
      </v-col>
    </v-row>
  </v-container>
</template>
<script setup lang="ts">
import { ref, onMounted } from 'vue';
import BaseCard from '@/components/BaseCard.vue';
import { useRoute } from 'vue-router';
import axios from "axios";

const cardNumber = ref<string>('');
const expiryDate = ref<string>('');
const cvv = ref<string>('');
const totalAmount = ref<number>(100);
const onBuy = ref(false);
const route = useRoute();

const cartItems = ref([]);

const paymentHistory = ref([
  { id: 1, date: new Date(), amount: 100, method: 'Credit Card' },
  { id: 2, date: new Date(), amount: 50, method: 'PayPal' },
]);

const paymentHistoryHeaders = [
  { text: 'Date', value: 'date' },
  { text: 'Amount', value: 'amount' },
  { text: 'Method', value: 'method' },
];

onMounted(async () => {
  try {
    if (route.query.art) {

      const getArtwork = 'http://127.0.0.1:3333/api/v1/artwork/';
      const response = await axios.get(getArtwork+ route.query.art);
      onBuy.value = true;
      cartItems.value.push(response.data);
    } else {
      onBuy.value = false;
    }
  } catch (error) {
    console.error('Error fetching artworks:', error);
  }
});

totalAmount.value = cartItems.value.reduce((sum, item) => sum + item.price * 1, 0);

function handlePaymentSubmit() {
  // Simulate payment processing
  alert('Payment processed successfully!');
  // Clear form fields
  cardNumber.value = '';
  expiryDate.value = '';
  cvv.value = '';
}
</script>
<style scoped>
.paypal-header {
  text-align: center;
  margin-bottom: 20px;
}

.paypal-logo {
  width: 150px;
  margin-bottom: 10px;
}

.order-details {
  margin-bottom: 20px;
}

.order-item {
  margin-bottom: 10px;
}

.order-total {
  font-size: 1.2em;
  font-weight: bold;
  margin-top: 20px;
  text-align: right;
}

.item-name h3 {
  color: blue;
}
</style>
