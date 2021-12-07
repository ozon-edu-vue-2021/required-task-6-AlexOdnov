<script lang="jsx">
import DotsLoaderIcon from './dost-loader.svg';

export default {
  name: 'oz-inf-paginator',
  render() {
    const directives = [
      {
        name: 'detect-viewport',
        value: {
          callback: this.$listeners.getPage,
        },
      },
    ];

    const style = {
      background: `url("${DotsLoaderIcon}") no-repeat center`,
    };

    return <div {...{ class: this.$style.infPaginator, style, directives }} />;
  },
};
</script>

<style module>
.infPaginator {
  width: 100%;
  height: 32px;
}
</style>
