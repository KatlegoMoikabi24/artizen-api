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
          <v-form @submit.prevent="buyArtwork">
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
            <v-btn
              required
              color="primary"
              type="submit"
              block
            >Pay Now</v-btn>
          </v-form>
        </BaseCard>
      </v-col>
    </v-row >
    <v-row>
      <v-col cols="12">
        <v-card elevation="3" class="w-100 h-100">

          <v-card-text>
            <div class="d-sm-flex align-center">
              <div>
                <h2 class="title text-h6 font-weight-medium">Payment History</h2>
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
                  <th class="font-weight-medium text-subtitle-1">Payment By</th>
                  <th class="font-weight-medium text-subtitle-1">Payment Date</th>
                  <th class="font-weight-medium text-subtitle-1">Payment Status</th>
                  <th class="font-weight-medium text-subtitle-1">Payment Amount</th>
                  <th class="font-weight-medium text-subtitle-1">Payment Method</th>
                </tr>
                </thead>
                <tbody>
                <tr
                  v-for="item in paymentHistory"
                  :key="item.id"
                  class="month-item"
                >
                  <td>{{ item.id }}</td>
                  <td>
                    <h4 class="font-weight-bold text-no-wrap">
                      {{ getUserDetails(item.user_id) }}
                    </h4>
                  </td>
                  <td>
                    <h5
                      class="font-weight-mediumtext-no-wrap
                              text-body-2 text-grey-darken-1"
                    >
                      {{ item.created_at }}
                    </h5>
                  </td>
                  <td>
                    <v-chip
                      color="success"
                      size="large"
                      label
                    ><b>{{ (item.status === "" ? "REJECTED" : item.status.toUpperCase()) }}</b>
                    </v-chip >
                  </td>
                  <td>
                    <h3>R {{ item.price }}</h3>
                  </td>
                  <td>
                    <h2>Paypal</h2>
                  </td>
                </tr>
                </tbody>
              </template>
            </v-table>
          </v-card-text>
        </v-card>

      </v-col>
    </v-row>
  </v-container>
</template>
<script setup lang="ts">
import { ref, onMounted } from 'vue';
import BaseCard from '@/components/BaseCard.vue';
import { useRoute } from 'vue-router';
import axios from "axios";
import Swal from "sweetalert2";

const cardNumber = ref<string>('');
const expiryDate = ref<string>('');
const cvv = ref<string>('');
let totalAmount = ref<number>(100);
const onBuy = ref(false);
const route = useRoute();

const cartItems = ref([]);

const paymentHistory = ref([]);
const getArtwork = 'http://127.0.0.1:3333/api/v1/artwork/';
const buyArtworkAPI = 'http://127.0.0.1:3333/api/v1/artwork/buy/';
const getPaymentsAPI = 'http://127.0.0.1:3333/api/v1/payments/user/';
const getAllPaymentsAPI = 'http://127.0.0.1:3333/api/v1/payments/';
const getAllUsers = 'http://127.0.0.1:3333/api/v1/users/';
const usersData = ref([]);

let artId = ref('');
const user = JSON.parse(<string>localStorage.getItem('user'));

function getUserDetails(id: any) {
  const userObj = usersData.value.find(item => item.id === id);

  if(userObj) {
    return `${userObj.name}  ${userObj.surname}`;
  }
}
onMounted(async () => {
  try {
    const usersResponse = await axios.get(getAllUsers);
    usersData.value = usersResponse.data;

    if (route.query.art) {
      artId = route.query.art;

      const response = await axios.get(getArtwork + artId);

      onBuy.value = true;
      totalAmount = response.data.price;
      cartItems.value.push(response.data);

    } else {
      onBuy.value = false;
    }

    const payments_response = await axios.get((user.role === 'admin' ? getAllPaymentsAPI : getPaymentsAPI + user.id));
    paymentHistory.value = payments_response.data;
  } catch (error) {
    alert('Error Occurred : ' + error);
  }
});

function handlePaymentSubmit() {

  cardNumber.value = '';
  expiryDate.value = '';
  cvv.value = '';
}

async function buyArtwork() {
  if(cvv.value === '' || cardNumber.value === '' || expiryDate.value  === '') {
    await Swal.fire({
      title: 'Invalid Card Details!',
      text: 'Please enter all card details',
      icon: 'error',
      confirmButtonText: 'Ok'
    })
  } else {
    try {
      await Swal.fire({
        title: 'Artwork Payment',
        text: 'Are you sure you would like to buy this artwork?',
        icon: 'question',
        confirmButtonText: 'Yes, I am sure',
        showCancelButton: true
      }).then(async (result) => {
        if (result.value) {
          await axios.put(buyArtworkAPI + artId, {
            bought_by: user.id,
          }).then(() => {
            onBuy.value = false;
            Swal.fire({
              title: 'Artwork Purchased!',
              text: 'Payment for this order is successful',
              icon: 'success',
              confirmButtonText: 'Ok'
            }).then(() => {
              location.replace('/ui-components/menus');
            })
          }).catch(error => {
            Swal.fire({
              title: 'Failed To Approve Artwork!',
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
