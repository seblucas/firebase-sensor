<template>
  <div class="row">
    <div class="col-lg-12" v-for="error in errors" :key="error.id" >
      <div class="alert alert-danger" role="alert">
        <span class="glyphicon glyphicon-trash" style="cursor: pointer" v-on:click="remove(error)"></span>
        <b>{{ error.time | formatDate }} / </b>{{ error.message }}
      </div>
    </div>
  </div>
</template>

<script>

export default {
  name: 'error-page',
  computed: {
    errors () {
      return this.$store.getters.errors
    }
  },
  methods: {
    remove (item) {
      this.$store.dispatch('removeError', item)
    }
  }
}
</script>
