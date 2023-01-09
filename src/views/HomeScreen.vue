<template>
  <b-row class="header">

  </b-row>
  <b-row class="body">
    <b-col md="2">
      <p class="fw-bold mb-1">Košarice</p>
      <b-list-group v-for="cart in shoppingCarts" :key="cart">
        <b-list-group-item href="#">{{ cart.name }}</b-list-group-item>
      </b-list-group>

      <b-button @click="addModal = true" size="sm" class="mt-2">Dodaj</b-button>
    </b-col>
  </b-row>
  <b-row class="footer"></b-row>

  <b-modal v-model="addModal" ref="addModal" title="Ime nove košarice" @hidden="newCartName = ''" @ok="newCartName.length && addShoppingCart()">
    <b-form-input v-model="newCartName" required></b-form-input>
  </b-modal>
</template>

<script>
import app from "@/main";
import {SHOPPING_CART_URL} from "@/utils/config";

export default {
  name: "HomeScreen",

  data() {
    return {
      shoppingCarts: [
        {
          name: 'Priljubljeni',
          products: []
        }
      ],
      addModal: false,
      newCartName: ""

    }
  },

  mounted() {
    this.getShoppingCarts();
  },

  methods: {
    getShoppingCarts() {
      app.axios.get(`${SHOPPING_CART_URL}/shopping-cart`)
          .then(resp => {
            this.shoppingCarts = this.shoppingCarts.concat(resp.data);
          })
          .catch(err => {
            console.error(err)
          })
    },

    addShoppingCart() {
      let shoppingCart = {
        name: this.newCartName,
        products: []
      }

      app.axios.post(`${SHOPPING_CART_URL}/shopping-cart`, shoppingCart)
          .then(resp => {
            this.shoppingCarts.push(resp.data)
          })
          .catch(err => {
            console.error(err)
          })
    }
  }
}
</script>

<style scoped>

</style>