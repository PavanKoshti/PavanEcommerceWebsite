<template>
    <main>
        <div class="container-fluid c-section">
            <div class="row">
                <div class="col-sm-3"></div>
                <div class="col-sm-6">
                    <div class="a-spacing-top-medium"></div>
                    <h2>Add a new category</h2>
                    <form>
                        <div class="a-spacing-top-medium">
                            <label>Type</label>
                            <input class="a-input-text" style="width: 100%" v-model="type" />
                        </div>

                        <!-- Button -->
                        <hr />
                        <div class="a-spacing-top-large">
                            <span class="a-button-register">
                                <span class="a-button-inner">
                                    <span class="a-button-text" @click="onAddCategory()">Add
                                        Category</span>
                                </span>
                            </span>
                        </div>
                    </form>
                    <br />
                    <ul class="list-group">
                        <li v-for="category in categoriesList" :key="category._id" class="list-group-item">{{ category.type }}
                        </li>
                    </ul>
                </div>
                <div class="col-sm-3"></div>
            </div>
        </div>
    </main>
</template>

<script>
export default {
    data() {
        return {
            type: '',
            categoriesList : [],
        }
    },
    created: async function () {
		this.getCategoriesList()
	},
    methods: {

        async getCategoriesList() {
        try {
            let response = await this.$axios.$get('http://localhost:4700/api/categories')
            if (response.success == true) {
                    this.categoriesList = response.categories
                }
                else {
                    console.log("Error White Get Category List >>>");
                }
        } catch (error) {
            console.log("Error White Get Category List>>>", error);
        }
    },        

        async onAddCategory() {
            try {
                let data = { type: this.type }
                let response = await this.$axios.$post('http://localhost:4700/api/categories', data)
                if (response.success == true) {
                    this.categoriesList.push(data)

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
                this.type = '';
                this.getCategoriesList();

            } catch (error) {
                this.$bvToast.toast(error, {
                    title: 'Error Message',
                    autoHideDelay: 3000,
                    variant: 'danger',
                    solid: true,
                })
                console.log("Error While Get Add Category>>>", error);
            }
        }
    }
}
</script>

<style></style>