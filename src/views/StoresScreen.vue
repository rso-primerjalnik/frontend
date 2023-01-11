<template>
  <div class="d-flex align-items-center mb-2 mt-4">
    <h4 class="text-start ms-3 mb-2">Seznam trgovin</h4>
    <b-button class="ms-auto me-3" @click="addStoreModal = true">Dodaj trgovino</b-button>
  </div>
  <b-table striped :items="stores" :fields="storesFields" show-empty>
    <template #empty>Ni trgovin za prikaz</template>
    <template #cell(actions)="data">
      <div class="d-flex justify-content-center align-items-center">
        <vue-feather type="edit-2" size="19" style="cursor: pointer" class="me-3"
                     @click="setData(data.item)"></vue-feather>
        <vue-feather type="trash" size="20" style="cursor: pointer"
                     @click="deleteStore(data.item)"></vue-feather>
      </div>
    </template>
  </b-table>

  <b-modal v-model="addStoreModal" ref="addStoreModal" title="Dodajanje trgovine" @hidden="resetData()"
           @ok="addStore()">
    <label>Ime</label>
    <b-form-input v-model="newStore.name" required></b-form-input>
    <label>Url naslov</label>
    <b-form-input v-model="newStore.url" required></b-form-input>
  </b-modal>

  <b-modal v-model="editStoreModal" ref="editStoreModal" title="Urejanje trgovine" @hidden="resetData()"
           @ok="editStore()">
    <label>Ime</label>
    <b-form-input v-model="newStore.name" required></b-form-input>
    <label>Url naslov</label>
    <b-form-input v-model="newStore.url" required></b-form-input>
  </b-modal>

  <b-button @click="$router.push('/')">Nazaj</b-button>

</template>

<script>
import {STORE_CATALOG_URL} from "@/utils/config";
import app from "@/main";

export default {
  name: "StoresScreen",

  data() {
    return {
      stores: [],
      storesFields: [
        {
          key: 'name',
          label: 'Ime'
        },
        {
          key: 'url',
          label: 'Url'
        },
        {
          key: 'actions',
          label: 'Akcije'
        }
      ],
      addStoreModal: false,
      newStore: {
        name: "",
        url: ""
      },
      editStoreModal: false
    }
  },

  mounted() {
    this.getStores()
  },

  methods: {
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

    addStore() {
      if (!this.newStore.name || !this.newStore.url)
        return

      let graphQLQuery = `mutation MyMutation {
        addStore(store: {name: "${this.newStore.name}", url: "${this.newStore.url}"}) {
          id
          name
          url
        }
      }`

      app.axios.post(`${STORE_CATALOG_URL.replaceAll('/v1', '/')}graphql`, {query: graphQLQuery}, {
        headers: {'Content-Type': 'application/json'}
      })
          .then(resp => {
            this.stores.push(resp.data.data.addStore)
          })
          .catch(err => {
            console.error(err)
          })
    },

    editStore() {
      if (!this.newStore.name || !this.newStore.url)
        return

      let graphQLQuery = `mutation MyMutation {
        editStore(store: {name: "${this.newStore.name}", url: "${this.newStore.url}"}, storeId: ${this.newStore.id}) {
          id
          name
          url
        }
      }`

      app.axios.post(`${STORE_CATALOG_URL.replaceAll('/v1', '/')}graphql`, {query: graphQLQuery}, {
        headers: {'Content-Type': 'application/json'}
      })
          .then(() => {
            this.getStores()
          })
          .catch(err => {
            console.error(err)
          })
    },

    deleteStore(store) {
      let graphQLQuery = `mutation MyMutation {
        deleteStore(storeId: ${store.id}) {
          deleted
        }
      }`

      app.axios.post(`${STORE_CATALOG_URL.replaceAll('/v1', '/')}graphql`, {query: graphQLQuery}, {
        headers: {'Content-Type': 'application/json'}
      })
          .then(() => {
            this.getStores()
          })
          .catch(err => {
            console.error(err)
          })

    },

    resetData() {
      this.newStore = {
        name: "",
        url: ""
      }
    },

    setData(store) {
      this.newStore = {
        id: store.id,
        name: store.name,
        url: store.url
      }
      this.editStoreModal = true;
    }
  }
}
</script>

<style scoped>

</style>