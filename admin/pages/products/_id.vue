<template>
    <main>
        <div class="container-fluid">
            <div class="row">
                <div class="col-sm-3"></div>
                <div class="col-sm-6">
                    <div class="a-section">
                        <div class="a-spacing-top-medium"></div>
                        <h2 style="text-align: center">Update {{ title }}</h2>
                        <form>
                            <!-- Category Dropdown -->
                            <div class="a-spacing-top-medium">
                                <label>Category</label>

                                <select class="a-select-option" v-model="categoryID">
                                    <option v-for="category in categories" :value="category._id" :key="category._id">
                                        {{ category.type }} </option>
                                </select>
                            </div>

                            <!-- Owner Dropdown -->
                            <div class="a-spacing-top-medium">
                                <label>Owner</label>

                                <select class="a-select-option" v-model="ownerID">
                                    <option v-for="owner in owners" :value="owner._id" :key="owner._id">{{ owner.name }}
                                    </option>
                                </select>
                            </div>
                            <!-- Title input -->
                            <div class="a-spacing-top-medium">
                                <label style="margin-bottom: 0px;">Title</label>

                                <input type="text" class="a-input-text" style="width: 100%" v-model="title" />
                            </div>

                            <!-- Price input -->
                            <div class="a-spacing-top-medium">
                                <label style="margin-bottom: 0px;">Price</label>

                                <input type="number" class="a-input-text" style="width: 100%" v-model="price" />
                            </div>

                            <!-- StockQuantity input -->
                            <div class="a-spacing-top-medium">
                                <label style="margin-bottom: 0px;">Stock Quantity</label>

                                <input type="number" class="a-input-text" style="width: 100%" v-model="stockQuantity" />
                            </div>

                            <!-- Description textarea -->
                            <div class="a-spacing-top-medium">
                                <label style="margin-bottom: 0px;">Description</label>

                                <textarea style="width: 100%" v-model="description"></textarea>
                            </div>

                            <!-- Photo file -->
                            <div class="a-spacing-top-medium">
                                <label style="margin-bottom: 0px;">Add Photo</label>
                                <div class="a-row a-spacing-top-medium">
                                    <label class="choosefile-button">
                                        <div class="imageprewrap" :style="{ 'background-image': `url(${previewImage})` }"
                                            @click="selectImage()"></div>
                                        <input type="file" ref="fileInput" @input="onFileSelected()" />
                                        <p style="margin-top: -70px">{{ fileName }}</p>
                                    </label>
                                </div>
                            </div>
                            <!-- Button -->
                            <hr />
                            <div class="a-spacing-top-large">
                                <span class="a-button-register">
                                    <span class="a-button-inner">
                                        <span class="a-button-text" @click="onUpdateProduct()">Update product</span>
                                    </span>
                                </span>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    </main>
</template>
 
<script>

export default {
    async asyncData({ $axios }) {
        try {
            let categories = $axios.$get('http://localhost:4700/api/categories');
            let owners = $axios.$get('http://localhost:4700/api/owners');

            const [catRes, ownerRes] = await Promise.all([
                categories,
                owners
            ]);

            return {
                categories: catRes.categories,
                owners: ownerRes.owners,
            }
        } catch (error) {
            console.log("Get All Categories and Owners Error>>>>", error);
        }

    },
    data() {
        return {
            previewImage: '',
            categoryID: null,
            ownerID: null,
            title: "",
            price: '',
            description: "",
            selectedFile: null,
            stockQuantity: '',
            fileName: "",
            imgURL: 'http://localhost:4700/'
        }
    },
    created: async function () {
        this.onGetSingleProduct()
    },
    methods: {
        async selectImage() {
            this.$refs.fileInput.click()
        },

        async onFileSelected() {
            try {
                let input = this.$refs.fileInput;
                let file = input.files;
                if (file && file[0]) {
                    let reader = new FileReader
                    reader.onload = e => {

                        this.previewImage = e.target.result
                    }
                    reader.readAsDataURL(file[0])
                    this.$emit('input', file[0])
                    this.fileName = file[0].name;
                    this.selectedFile = file[0];

                }
            } catch (error) {
                console.log("File Selecte For Image Error >>>>", error);
            }

        },

        async onGetSingleProduct() {
            try {
                let singleProduct = await this.$axios.$get(`http://localhost:4700/api/product/${this.$route.params.id}`);
                if (singleProduct.success == true) {
                    let data = singleProduct.product;
                    this.title = data.title;
                    this.price = data.price;
                    this.stockQuantity = data.stockQuantity;
                    this.description = data.description;
                    this.fileName = data.photo;
                    this.previewImage = this.imgURL + '/' + data.photo;
                    this.categoryID = data.category._id;
                    this.ownerID = data.owner._id;
                }
                else {
                    console.log("Error While Get Single Product Details >>>");
                }

            } catch (error) {
                console.log("Error While Get Single Product Details Catch >>>", error);
            }
        },

        async onUpdateProduct() {
            try {
                let data = new FormData();
                data.append("title", this.title)
                data.append("price", this.price)
                data.append("stockQuantity", this.stockQuantity)
                data.append("description", this.description)
                data.append("ownerID", this.ownerID)
                data.append("categoryID", this.categoryID)
                data.append("photo", this.selectedFile, this.selectedFile.name)
                let result = await this.$axios.$put(`http://localhost:4700/api/product/${this.$route.params.id}`, data)

                if (result.success == true) {
                    this.$bvToast.toast(result.message, {
                        title: 'Success Message',
                        autoHideDelay: 3000,
                        variant: 'success',
                        solid: true,
                    })
                    alert(result.message)
                    this.$router.push("/")
                }
                else {
                    this.$bvToast.toast(result.message, {
                        title: 'Error Message',
                        autoHideDelay: 3000,
                        variant: 'danger',
                        solid: true,
                    })
                }


            } catch (error) {
                this.$bvToast.toast(error, {
                    title: 'Update Product By Error',
                    autoHideDelay: 3000,
                    variant: 'danger',
                    solid: true,
                })
                console.log("Update Product By Error >>>>", error);
            }

        }
    }
}
</script>

<style scoped>
.imageprewrap {
    width: 100px;
    height: 100px;
    display: block;
    cursor: pointer;
    margin: 0 auto 30px;
    background-size: cover;
    background-position: center center;
}
</style>