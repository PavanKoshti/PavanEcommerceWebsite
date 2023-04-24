<template>
    <!--MAIN-->
    <main>
        <!--REVIEW ADDRESS-->
        <div class="reviewPage mt-3">
            <div class="container-fluid c-section">
                <div class="row">
                    <div class="col-sm-2"></div>
                    <div class="col-sm-8">
                        <div class="a-spacing-top-medium">
                            <h1 class="a-spacing-base">
                                <b>Create Review</b>
                            </h1>
                            <div class="row">
                                <!-- Product Photo -->
                                <div class="col-md-2 col-sm-3 col-3">
                                    <img :src="baseURL + singleProduct.photo" style="width: 80px" />
                                </div>
                                <!-- Product Title -->
                                <div class="col-md-10 col-sm-9 col-9 m-auto">
                                    <h4>
                                        <b>{{ singleProduct.title }}</b>
                                    </h4>
                                </div>
                            </div>
                            <div class="a-spacing-top-medium"></div>
                            <hr />
                            <h2 class="a-spacing-base">Overall Rating</h2>
                            <div class="a-row">
                                <!-- Rating -->
                                <no-ssr>
                                    <star-rating v-model="rating"></star-rating>
                                </no-ssr>
                            </div>
                            <div class="a-row a-spacing-top-large">
                                <h2>Add photo or video</h2>
                                <p style="font-size: 14px; font-weight: 700;">Shoppers find images and videos more helpful
                                    than text alone.</p>
                            </div>
                            <div class="a-row a-spacing-top-medium">
                                <!-- Choose a Photo -->
                                <label class="choosefile-button">
                                    <div class="imageprewrap" :style="{ 'background-image': `url(${previewImage})` }"
                                        @click="selectImage()"></div>
                                    <input type="file" ref="fileInput" @change="onFileSelected()" />
                                </label>
                                <p>{{ fileName }}</p>
                            </div>
                            <div class="a-spacing-top-large"></div>
                            <hr />
                            <!-- Headline -->
                            <div class="headline a-spacing-large">
                                <h2 class="a-spacing-base">Add a headline</h2>
                                <input type="text" class="a-input-text" style="width: 70%;"
                                    placeholder="What's most important to know?" v-model="headline" />
                            </div>
                            <!-- Body -->
                            <div class="a-spacing-base">
                                <h2 class="a-spacing-base">Write your review</h2>
                                <textarea placeholder="What do you like or dislike? What did you see this product for?"
                                    style="height:6em; width: 100%;" v-model="body"></textarea>
                            </div>
                        </div>
                        <br />
                        <br />
                        <hr />
                        <div class="a-spacing-top-medium">
                            <p style="font-size: 14px; font-weight: 700;">This is how you'll appear to other customers:</p>
                            <div class="media a-spacing-top-large">
                                <div class="media-left">
                                    <img src="../../static/img/avatar.png" class="img-fluid" style="width: 50px;" />
                                </div>
                                <div class="media-body pl-3 pt-2">
                                    <input type="text" class="a-input-text" style="width: 100%;"
                                        :value="$auth.$state.user.name" />
                                </div>
                            </div>
                        </div>
                        <div class="a-row a-spacing-top-medium">
                            <span class="a-color-tertiary">Don't worry, you can always change this on your profile</span>
                        </div>
                        <div class="a-row text-right a-spacing-top-large">
                            <span class="a-button-register">
                                <span class="a-button-inner">
                                    <span class="a-button-text" @click="onAddReview">Submit</span>
                                </span>
                            </span>
                        </div>
                    </div>
                    <div class="col-sm-2"></div>
                </div>
                <div class="a-spacing-large pb-5"></div>
                <hr />
            </div>
        </div>
        <!--/REVIEW ADDRESS-->
    </main>
    <!--/MAIN-->
</template>
  
<script>
import StarRating from "vue-star-rating";
export default {
    components: {
        StarRating
    },
    data() {
        return {
            baseURL: this.$axios.defaults.baseURL,
            rating: 0,
            body: "",
            headline: "",
            previewImage: 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/65/No-Image-Placeholder.svg/1200px-No-Image-Placeholder.svg.png',
            selectedFile: null,
            fileName: null,
            singleProduct: ''
        };
    },
    created: async function () {
        await this.onGetSingleProduct()
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
                let singleProductDetails = await this.$axios.$get(`api/product/${this.$route.params.id}`);
                if (singleProductDetails.success == true) {
                    this.singleProduct = singleProductDetails.product
                }
                else {
                    console.log("Error While Get Single Product Details >>>");
                }

            } catch (error) {
                console.log("Error While Get Single Product Details Catch >>>", error);
            }
        },

        async onAddReview() {
            try {
                let data = new FormData();
                data.append("headline", this.headline);
                data.append("body", this.body);
                data.append("rating", this.rating);
                data.append("photo", this.selectedFile, this.selectedFile.name);

                let response = await this.$axios.$post(
                    `api/reviews/${this.$route.params.id}`,
                    data
                );
                if (response.success) {
                    this.$router.push(`/products/${this.$route.params.id}`);
                }
            } catch (err) {
                console.log(err);
            }
        }
    }
};
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
  