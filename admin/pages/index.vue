<template>
  <main>
    <div class="a-spacing-large"></div>

    <div class="container-fluid browsing-history">
      <div class="row">
        <div class="col-sm-8 col-8">
          <h1 class="a-size-large a-spacing-none a-text-normal">All products</h1>
          <div class="a-spacing-large"></div>
          <!-- Button -->
          <nuxt-link to="/products" class="a-button-buy-again">Add a new product</nuxt-link>

          <nuxt-link to="/category" class="a-button-history margin-right-10">Add a new category</nuxt-link>
          <nuxt-link to="/owner" class="a-button-history margin-right-10">Add a new owner</nuxt-link>
          <!-- Listing page -->
        </div>
      </div>
    </div>
    <div class="a-spacing-large"></div>
    <div class="container-fluid browsing-history">
      <div class="row">
        <!-- v-for="(product, index) in products"
          :key="product._id" -->
        <div v-for="(product) in allProductList" :key="product._id"
          class="col-xl-2 col-lg-2 col-md-3 col-sm-6 col-6 br bb">
          <div class="history-box">
            <!-- Product image -->
            <a href="#" class="a-link-normal">
              <img :src="imgURL + product.photo" class="img-fluid" />
            </a>
            <!-- Product title -->
            <div class="a-spacing-top-base asin-title">
              <span class="a-text-normal">
                <div class="p13n-sc-truncated">{{ product.title }}</div>
              </span>
            </div>
            <!-- Product rating -->
            <div class="a-row">
              <a href="#">
                <i class="fas fa-star"></i>
                <i class="fas fa-star"></i>
                <i class="fas fa-star"></i>
                <i class="fas fa-star"></i>
                <i class="fas fa-star"></i>
              </a>
              <span class="a-letter-space"></span>
              <span class="a-color-tertiary a-size-small asin-reviews">(1732)</span>
            </div>
            <!-- Product price -->
            <div class="a-row">
              <span class="a-size-base a-color-price">
                <span class="p13n-sc-price">${{ product.price }}</span>
              </span>
            </div>
            <!-- Product Buttons -->
            <div class="a-row">
              <nuxt-link :to="`/products/${product._id}`" class="a-button-buy-again margin-right-10 pavan">Update</nuxt-link>
              <a class="a-button-buy-again margin-right-10 pavan" @click="onDeleteProduct(product._id, product.title)">Delete
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  </main>
</template>

<script>
export default {
  data() {
    return {
      imgURL: 'http://localhost:4700/',
      allProductList: []
    }
  },
  created: async function () {
    this.getAllProductsList()
  },
  methods: {

    async getAllProductsList() {
      try {
        let productList = await this.$axios.$get("http://localhost:4700/api/products");
        if (productList.success == true) {
          this.allProductList = productList.allProducts
        }
        else {
          console.log("Prodcuts List Error >>>");
        }
      } catch (error) {
        console.log("Error White Get All Prodcuts List Catch >>>");
      }
    },

    async onDeleteProduct(id, name) {
      try {
        let Deletes = false;
        let text = `Are You Sure Want To Delete This Product :- ${name}`
        if (confirm(text) == true) {
          Deletes = true
        }
        else {
          Deletes = false;
          this.$bvToast.toast('Admin Decline Process.', {
              title: 'Error Message',
              autoHideDelay: 3000,
              variant: 'danger',
              solid: true,
          })
        }
        if (Deletes == true) {
          let deleteProduct = await this.$axios.$delete(`http://localhost:4700/api/product/${id}`);
          if (deleteProduct.success == true) {
            this.$bvToast.toast(deleteProduct.message, {
              title: 'Success Message',
              autoHideDelay: 3000,
              variant: 'success',
              solid: true,
            })
          }
          else {
            this.$bvToast.toast(deleteProduct.message, {
              title: 'Error Message',
              autoHideDelay: 3000,
              variant: 'danger',
              solid: true,
            })
          }
          await this.getAllProductsList();
        }

      } catch (error) {
        console.log("Error White Get Delete Product Error Catch >>>");
      }
    }
    
  }
}
</script>

<style></style>