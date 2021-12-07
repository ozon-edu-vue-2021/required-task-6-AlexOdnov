<template>
  <div id="app" class="container">
    <div class="block has-text-centered">
      <b-radio v-model="radio" name="table" native-value="libs"> Libs </b-radio>
      <b-radio v-model="radio" name="table" native-value="custom">
        Custom
      </b-radio>
    </div>
    <lib-table v-if="radio === 'libs'" />
    <custom-table v-else virtScroll />
  </div>
</template>

<script>
import CustomTable from './components/custom-table';
import LibTable from './components/lib-table';

export default {
  name: 'App',
  components: {
    CustomTable,
    LibTable,
  },
  data() {
    return {
      radio: 'libs',
    };
  },
};
</script>

<style>
#app {
  padding: 60px 0;
}
</style>
