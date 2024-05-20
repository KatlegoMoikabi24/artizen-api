<template>
  <v-container>
    <v-row>
      <v-col cols="12" md="6">
        <BaseCard heading="Your Order">
          <div class="order-details">
            <div class="order-item" v-for="item in cartItems" :key="item.id">
              <div class="item-name">
                <h3>{{ item.name }}</h3>
              </div>
              <div class="item-quantity">
                <b>Quantity:</b> {{ item.quantity }}
              </div>
              <div class="item-price">
                <b>Price: R</b>{{ item.price.toFixed(2) }}
              </div>
            </div>
            <v-divider></v-divider>
            <div class="order-total">
              <strong>Total: R{{ totalAmount.toFixed(2) }}</strong>
            </div>
          </div>
        </BaseCard>
      </v-col>
      <v-col cols="12" md="6">
        <BaseCard heading="Payment Gateway">
          <div class="paypal-header">
            <img src="https://www.paypalobjects.com/webstatic/icon/pp258.png" alt="PayPal Logo" class="paypal-logo" />
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
    </v-row>
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
import { ref } from 'vue';
import BaseCard from '@/components/BaseCard.vue';
import { format } from 'date-fns';

const cardNumber = ref<string>('');
const expiryDate = ref<string>('');
const cvv = ref<string>('');
const totalAmount = ref<number>(100);

const cartItems = ref([
  { id: 1, name: 'Tut Artwork', quantity: 2, price: 25 },
  { id: 2, name: 'Mzansi Artwork Desgin', quantity: 1, price: 50 },
]);

const paymentHistory = ref([
  { id: 1, date: new Date(), amount: 100, method: 'Credit Card' },
  { id: 2, date: new Date(), amount: 50, method: 'PayPal' },
]);

const paymentHistoryHeaders = [
  { text: 'Date', value: 'date' },
  { text: 'Amount', value: 'amount' },
  { text: 'Method', value: 'method' },
];

// Calculate total amount from cart items
totalAmount.value = cartItems.value.reduce((sum, item) => sum + item.price * item.quantity, 0);

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
