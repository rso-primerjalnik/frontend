<template>
  <b-row class="body">
    <b-col md="2" class="mt-5">
      <p class="fw-bold mb-1">Košarice</p>
      <b-list-group v-for="cart in shoppingCarts" :key="cart">
        <b-list-group-item href="#" @click="goToCart(cart)">
          {{ cart.name }}
        </b-list-group-item>
      </b-list-group>

      <b-button @click="addCartModal = true" size="sm" class="mt-2">Dodaj</b-button>
    </b-col>
    <b-col>
      <b-navbar toggleable="lg" class="mb-3">
        <b-navbar-brand href="/">Domača stran</b-navbar-brand>
        <b-collapse id="nav-collapse" is-nav>

          <b-navbar-nav>
            <b-nav-item href="/stores">Trgovine</b-nav-item>
          </b-navbar-nav>
        </b-collapse>

      </b-navbar>
      <b-col>
        <div class="d-flex align-items-center mb-2">
          <h4 class="text-start ms-3 mb-0">Seznam izdelkov</h4>
          <b-button class="ms-auto me-3" @click="addProductModal = true">Dodaj izdelek</b-button>
        </div>
        <b-table :items="products" :fields="productsFields">
          <template #cell(actions)="data">
            <div class="d-flex justify-content-center align-items-center">
              <b-button size="sm" class="me-1" @click="addToCartModal = true; productToAdd = data.item">Dodaj v košarico
              </b-button>
              <vue-feather type="star" size="20" :fill="data.item.favourite? 'yellow' : 'None'" style="cursor: pointer"
                           @click="addToFavourites(data.item)"></vue-feather>
            </div>
          </template>
          <template #cell(delete)="data">
            <div class="d-flex justify-content-center align-items-center">
              <vue-feather type="trash" class="ms-3" size="20" style="cursor: pointer"
                           @click="deleteProduct(data.item)"></vue-feather>
            </div>
          </template>
        </b-table>
      </b-col>
    </b-col>

  </b-row>
  <b-row class="footer"></b-row>

  <b-modal v-model="addCartModal" ref="addCartModal" title="Ime nove košarice" @hidden="newCartName = ''"
           @ok="newCartName.length && addShoppingCart()">
    <b-form-input v-model="newCartName" required></b-form-input>
  </b-modal>

  <b-modal v-model="addProductModal" ref="addProductModal" title="Nov izdelek" @hidden="resetProductData()" @ok="addProduct()">
    <label>Naziv</label>
    <b-form-input v-model="newProduct.name" class="mb-1" required></b-form-input>
    <label>Opis</label>
    <b-form-input v-model="newProduct.description" class="mb-1" required></b-form-input>
    <label>Teža</label>
    <b-form-input v-model="newProduct.weight" required></b-form-input>

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
        },
        {
          key: 'delete',
          label: ''
        }
      ],
      addCartModal: false,
      addToCartModal: false,
      cartId: null,
      quantity: 1,
      productToAdd: null,
      newCartName: "",
      addProductModal: false,
      newProduct: {
        name: "",
        weight: "",
        description: ""
      }

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

    addProduct() {
      if (!this.newProduct.name || !this.newProduct.weight || !this.newProduct.description)
        return

      this.newProduct.favourite = false

      app.axios.post(`${PRODUCT_CATALOG_URL}/products`, this.newProduct)
          .then(resp => {
            this.products.push(resp.data)
          })
          .catch(err => {
            console.error(err)
          })

    },

    deleteProduct(product) {
      app.axios.delete(`${PRODUCT_CATALOG_URL}/products/${product.id}`)
          .then(() => {
            this.getProducts()
          })
          .catch(err => {
            console.error(err)
          })
    },

    goToCart(cart) {
      router.push({name: 'ShoppingCart', params: {id: cart.favourites ? 'favourites' : cart.cartId}})
    },

    resetProductData() {
      this.newProduct = {
        name: "",
        weight: "",
        description: ""
      }
    }
  }
}
</script>

<style scoped>

</style>