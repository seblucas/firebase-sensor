<template>
  <div class="d-flex justify-content-end mb-3" v-if="errors.length">
    <button class="btn btn-danger" type="button" @click="removeOldest">
      <i class="bi bi-trash me-1" aria-hidden="true"></i>
      Delete the 100 oldest errors
    </button>
  </div>
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
    },
    async removeOldest () {
      const oldestErrors = this.errors.slice(0, 100)
      if (!oldestErrors.length) return
      if (!window.confirm(`Delete the first ${oldestErrors.length} errors shown? This cannot be undone.`)) return

      await this.$store.dispatch('removeOldestErrors', oldestErrors)
    }
  }
}
</script>
