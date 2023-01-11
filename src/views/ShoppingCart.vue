<template>
  <h4 v-if="cartId === 'favourites'" class="text-start ms-3 mb-2 mt-4">Priljubljeni izdelki</h4>
  <h4 v-else class="text-start ms-3 mb-2 mt-4">Izdelki v košarici</h4>
  <b-table striped :items="products" :fields="productsFields" show-empty responsive="sm">
    <template #empty>V košarici še ni produktov</template>
    <template #cell(show_details)="row">
      <vue-feather type="chevron-down" @click="row.toggleDetails" class="mr-2 align-middle" style="cursor: pointer">
      </vue-feather>
    </template>

    <template #row-details="row">
      <b-card>
        <b-row class="mb-2">
          <b-col class="text-sm-right"><b>Trgovina</b></b-col>
          <b-col><b>Cena</b></b-col>
          <b-col v-if="cartId !== 'favourites'"><b>Cena za količino</b></b-col>
        </b-row>
        <b-row v-for="store in computedStores" :key="store">
          <b-col class="text-sm-right">{{ store.name }}</b-col>
          <b-col>{{ store.price }}€</b-col>
          <b-col v-if="cartId !== 'favourites'">{{ store.price * row.item.quantity }}€</b-col>
        </b-row>

      </b-card>
    </template>
  </b-table>

  <b-button @click="$router.push('/')">Nazaj</b-button>
</template>

<script>
import app from "@/main";
import {SHOPPING_CART_URL, PRODUCT_CATALOG_URL, STORE_CATALOG_URL} from "@/utils/config";

export default {
  name: "ShoppingCart",

  data() {
    return {
      cartId: this.$router.currentRoute.value.params.id === 'favourites' ? 'favourites' : parseInt(this.$router.currentRoute.value.params.id),
      products: [],
      productsFields: [
        {
          key: 'show_details',
          label: '',
          thStyle: 'width: 5%'
        },
        {
          key: 'name',
          label: 'Naziv',
          thStyle: 'width: 60%'
        },
        {
          key: 'quantity',
          label: 'Količina'
        }
      ],
      stores: []
    }
  },

  mounted() {
    if (this.cartId === 'favourites')
      this.productsFields = this.productsFields.filter(item => item.key !== 'quantity')
    this.getProducts();
    this.getStores()
  },

  computed: {
    computedStores() {
      return this.stores.map(item => ({...item, price: Math.floor(Math.random() * (100 - 5) + 5)}))
    }
  },

  methods: {
    getProducts() {
      if (this.cartId === 'favourites') {
        app.axios.get(`${PRODUCT_CATALOG_URL}/products/filter?filter=favourite:EQ:true`)
            .then(resp => {
              this.products = resp.data;
            })
            .catch(err => {
              console.error(err)
            })
      } else {
        app.axios.get(`${SHOPPING_CART_URL}/shopping-cart/${this.cartId}`)
            .then(resp => {
              this.products = resp.data.products;
            })
            .catch(err => {
              console.error(err)
            })
      }
    },

    getStores() {
      let graphQLQuery = `query MyQuery {
        allStores {
          result {
            id
            name
            url
          }
        }
      }`

      app.axios.post(`${STORE_CATALOG_URL.replaceAll('/v1', '/')}graphql`, {query: graphQLQuery}, {
        headers: {'Content-Type': 'application/json'}
      })
          .then(resp => {
            this.stores = resp.data.data.allStores.result
          })
          .catch(err => {
            console.error(err)
          })
    },
  }
}
</script>

<style scoped>

</style>