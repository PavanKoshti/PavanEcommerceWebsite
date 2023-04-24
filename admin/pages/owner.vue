<template>
    <main>
        <div class="container-fluid c-section">
            <div class="row">
                <div class="col-sm-3"></div>
                <div class="col-sm-6">
                    <div class="a-spacing-top-medium"></div>
                    <h2>Add a New Owner</h2>
                    <form>
                        <!-- Name -->
                        <div class="a-spacing-top-medium">
                            <label>Name</label>
                            <input class="a-input-text" style="width: 100%" v-model="name" />
                        </div>

                        <!-- About -->
                        <div class="a-spacing-top-medium">
                            <label>About</label>
                            <input class="a-input-text" style="width: 100%" v-model="about" />
                        </div>

                        <!-- Photo file -->
                        <div class="a-spacing-top-medium">
                            <label style="margin-bottom: 0px;">Add Photo</label>
                            <div class="a-row a-spacing-top-medium">
                                <label class="choosefile-button">
                                    <div class="imageprewrap" :style="{ 'background-image': `url(${previewImage})` }"
                                        @click="selectImage()"></div>
                                    <input type="file" ref="fileInput" @input="onFileSelected($event)" />
                                    <p style="margin-top: -70px">{{ fileName }}</p>
                                </label>
                            </div>
                        </div>

                        <!-- Button -->
                        <hr />
                        <div class="a-spacing-top-large">
                            <span class="a-button-register">
                                <span class="a-button-inner">
                                    <span class="a-button-text" @click="onAddOwner()">Add Owner</span>
                                </span>
                            </span>
                        </div>
                    </form>
                    <br />
                    <ul class="list-group">
                        <li v-for="owner in ownersList" :key="owner._id" class="list-group-item">{{ owner.name }}</li>
                    </ul>
                </div>
                <div class="col-sm-3"></div>
            </div>
        </div>
    </main>
</template>

<script>
export default {
    // async asyncData({ $axios }) {
    //     try {
    //         let response = await $axios.$get('http://localhost:4700/api/owners')
    //         return {
    //             owners: response.owners
    //         }
    //     } catch (error) {
    //         console.log("Error White Get Owners List>>>", error);
    //     }
    // },
    data() {
        return {
            name: '',
            about: '',
            fileName: '',
            ownersList : [],
            previewImage: 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/65/No-Image-Placeholder.svg/1200px-No-Image-Placeholder.svg.png',
            selectedFile: null,
        }
    },
    created: async function () {
		this.getOwnerList()
	},
    methods: {
        async selectImage() {
            this.$refs.fileInput.click()
        },

        async onFileSelected(event) {
            try {
                let input = this.$refs.fileInput;
                let file = input.files
                if (file && file[0]) {
                    let reader = new FileReader
                    reader.onload = e => {
                        this.previewImage = e.target.result
                    }
                    reader.readAsDataURL(file[0])
                    this.$emit('input', file[0])
                    this.fileName = event.target.files[0].name
                    this.selectedFile = event.target.files[0]
                }
            } catch (error) {
                console.log("File Selecte For Image Error >>>>", error);
            }

        },

        async getOwnerList() {
            try {
                let response = await this.$axios.$get('http://localhost:4700/api/owners').catch((e) => {
                    alert('Problem With Connecting Server!!');
                });
                if (response.success == true) {
                    this.ownersList = response.owners
                }
                else {
                    console.log("Error White Get Owners List >>>");
                }
            } catch (error) {
                console.log("Error White Get Owners List>>>", error);
            }
        },

        async onAddOwner() {
            try {
                let data = new FormData();
                data.append("name", this.name)
                data.append("about", this.about)
                data.append("photo", this.selectedFile, this.selectedFile.name)
                let response = await this.$axios.$post('http://localhost:4700/api/owner', data).catch((e) => {
                    alert('Problem With Connecting Server!!');
                });
                if (response.success == true) {
                    this.ownersList.push(this.name)

                    this.$bvToast.toast(response.message, {
                        title: 'Success Message',
                        autoHideDelay: 3000,
                        variant: 'success',
                        solid: true,
                    })

                    alert(response.message)
                }
                else {
                    this.$bvToast.toast(response.message, {
                        title: 'Error Message',
                        autoHideDelay: 3000,
                        variant: 'danger',
                        solid: true,
                    })
                }
                this.getOwnerList();
                this.name = '';
                this.about = '';
                this.previewImage = 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/65/No-Image-Placeholder.svg/1200px-No-Image-Placeholder.svg.png';
                this.selectedFile = null;
                this.fileName = '';


            } catch (error) {
                this.$bvToast.toast(error, {
                    title: 'Error Message',
                    autoHideDelay: 3000,
                    variant: 'danger',
                    solid: true,
                })
                console.log("Error While Get Add Category>>>", error);
            }
        },

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