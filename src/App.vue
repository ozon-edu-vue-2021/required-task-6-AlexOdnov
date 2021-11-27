<template>
  <div id="app" class="container">
    <div class="block has-text-centered">
      <b-radio v-model="radio" name="table" native-value="libs"> Libs </b-radio>
      <b-radio v-model="radio" name="table" native-value="custom">
        Custom
      </b-radio>
    </div>
    <b-table
      v-if="radio === 'libs'"
      :data="data"
      :columns="columns"
      pagination-size="is-small"
      per-page="10"
      paginated
      pagination-rounded
      sort-multiple
    />
    <sort-wrapper v-else />
  </div>
</template>

<script>
import SortWrapper from './components/with-sort';

export default {
  name: 'App',
  components: { SortWrapper },
  data() {
    return {
      radio: 'libs',
      data: [],
      columns: [
        {
          label: 'Post ID',
          field: 'postId',
          searchable: true,
          sortable: true,
          width: '10%',
        },
        {
          label: 'ID',
          field: 'id',
          searchable: true,
          sortable: true,
          width: '10%',
        },
        {
          label: 'Name',
          field: 'name',
          searchable: true,
          sortable: true,
          width: '25%',
        },
        {
          label: 'Email',
          field: 'email',
          searchable: true,
          sortable: true,
          width: '25%',
        },
        {
          label: 'Content',
          field: 'body',
          searchable: true,
          sortable: true,
          width: '30%',
        },
      ],
    };
  },
  async created() {
    const res = await fetch(`https://jsonplaceholder.typicode.com/comments`);
    this.data = await res.json();
  },
};
</script>

<style>
#app {
  padding: 60px 0;
}
</style>
