<template>
  <h4 v-if="cartId === 'favourites'" class="text-start ms-3 mb-2 mt-4">Priljubljeni izdelki</h4>
  <h4 v-else class="text-start ms-3 mb-2 mt-4">Izdelki v košarici</h4>
  <b-table striped :items="products" :fields="productsFields" show-empty>
    <template #empty>V košarici še ni produktov</template>
  </b-table>

  <b-button @click="$router.push('/')">Nazaj</b-button>
</template>

<script>
import app from "@/main";
import {SHOPPING_CART_URL, PRODUCT_CATALOG_URL} from "@/utils/config";

export default {
  name: "ShoppingCart",

  data() {
    return {
      cartId: this.$router.currentRoute.value.params.id === 'favourites' ? 'favourites' : parseInt(this.$router.currentRoute.value.params.id),
      products: [],
      productsFields: [
        {
          key: 'name',
          label: 'Naziv',
          thStyle: 'width: 30%'
        },
        {
          key: 'quantity',
          label: 'Količina'
        }
      ],
    }
  },

  mounted() {
    console.log(this.$router.currentRoute.value.params.id)
    if (this.cartId === 'favourites')
      this.productsFields = this.productsFields.filter(item => item.key !== 'quantity')
    this.getProducts();
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
      }
      else {
        app.axios.get(`${SHOPPING_CART_URL}/shopping-cart/${this.cartId}`)
          .then(resp => {
            this.products = resp.data.products;
          })
          .catch(err => {
            console.error(err)
          })
      }
    }
  }
}
</script>

<style scoped>

</style>