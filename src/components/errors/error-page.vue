<template>
  <div class="row">
    <div class="col-12" v-for="error in errors" :key="error.id">
      <div class="alert alert-danger" role="alert">
        <button class="btn btn-link text-danger p-0 me-2" type="button" aria-label="Delete error" @click="remove(error)">
          <i class="bi bi-trash" aria-hidden="true"></i>
        </button>
        <b>{{ formatDate(error.time) }} / </b>{{ error.message }}
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
    async remove (item) {
      await this.$store.dispatch('removeError', item)
    }
  }
}
</script>
