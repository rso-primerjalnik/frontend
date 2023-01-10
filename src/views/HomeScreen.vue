<template>
  <b-row class="header">

  </b-row>
  <b-row class="body">
    <b-col md="2">
      <p class="fw-bold mb-1">Košarice</p>
      <b-list-group v-for="cart in shoppingCarts" :key="cart">
        <b-list-group-item href="#" @click="goToCart(cart)">
          {{ cart.name }}
        </b-list-group-item>
      </b-list-group>

      <b-button @click="addCartModal = true" size="sm" class="mt-2">Dodaj</b-button>
    </b-col>
    <b-col>
      <h4 class="text-start ms-3 mb-2">Seznam izdelkov</h4>
      <b-table :items="products" :fields="productsFields">
        <template #cell(actions)="data">
          <div class="d-flex justify-content-center align-items-center">
            <b-button size="sm" class="me-1" @click="addToCartModal = true; productToAdd = data.item">Dodaj v košarico
            </b-button>
            <vue-feather type="star" size="20" :fill="data.item.favourite? 'yellow' : 'None'" style="cursor: pointer"
                         @click="addToFavourites(data.item)"></vue-feather>
          </div>
        </template>
      </b-table>
    </b-col>
  </b-row>
  <b-row class="footer"></b-row>

  <b-modal v-model="addCartModal" ref="addCartModal" title="Ime nove košarice" @hidden="newCartName = ''"
           @ok="newCartName.length && addShoppingCart()">
    <b-form-input v-model="newCartName" required></b-form-input>
  </b-modal>

  <b-modal v-model="addToCartModal" ref="addToCartModal" title="Dodaj v košarico"
           @hidden="cartId = null; quantity = 1; productToAdd = null"
           @ok="cartId && quantity && addToCart()">
    <label>Izberite košarico</label>
    <b-form-select id="selectCart" class="mb-1" placeholder="Izberite košarico"
                   :options="shoppingCarts.filter(item => !item.favourites)" v-model="cartId" value-field="cartId"
                   text-field="name">
    </b-form-select>
    <label>Količina</label>
    <b-form-input type="number" v-model="quantity" min="0"></b-form-input>

  </b-modal>
</template>

<script>
import app from "@/main";
import {SHOPPING_CART_URL, PRODUCT_CATALOG_URL} from "@/utils/config";
import router from "@/router";

export default {
  name: "HomeScreen",

  data() {
    return {
      shoppingCarts: [
        {
          favourites: true,
          name: 'Priljubljeni',
          products: []
        }
      ],
      products: [],
      productsFields: [
        {
          key: 'name',
          label: 'Naziv',
          thStyle: 'width: 30%'
        },
        {
          key: 'description',
          label: 'Opis',
          thStyle: 'width: 40%'
        },
        {
          key: 'weight',
          label: 'Teža'
        },
        {
          key: 'actions',
          label: 'Akcije'
        }
      ],
      addCartModal: false,
      addToCartModal: false,
      cartId: null,
      quantity: 1,
      productToAdd: null,
      newCartName: ""

    }
  },

  mounted() {
    this.getShoppingCarts();
    this.getProducts();
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

    getProducts() {
      app.axios.get(`${PRODUCT_CATALOG_URL}/products`)
          .then(resp => {
            this.products = resp.data;
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
    },

    addToFavourites(product) {
      product.favourite = !product.favourite
      app.axios.put(`${PRODUCT_CATALOG_URL}/products/${product.id}`, product)
          .then(resp => {
            console.log(resp)
          })
          .catch(err => {
            console.error(err)
          })
    },

    addToCart() {
      let product = {
        ...this.productToAdd,
        quantity: this.quantity,
        cartId: this.cartId,
        productId: this.productToAdd.id
      }
      app.axios.put(`${SHOPPING_CART_URL}/shopping-cart/${this.cartId}`, product)
          .then(resp => {
            console.log(resp)
          })
          .catch(err => {
            console.error(err)
          })
    },

    goToCart(cart) {
      router.push({name: 'ShoppingCart', params: {id: cart.favourites ? 'favourites' : cart.cartId}})
    }
  }
}
</script>

<style scoped>

</style>