<script lang="jsx">
export default {
  name: 'oz-paginator',
  props: {
    totalPages: {
      type: Number,
      default: 0,
    },
    currentPage: {
      type: Number,
      default: 0,
    },
  },
  computed: {
    shownPagesNumbers() {
      const { currentPage, totalPages } = this;

      if (currentPage <= 3) {
        if (totalPages < 5) {
          return Array(totalPages)
            .fill(null)
            .map((index) => index + 1);
        }

        return [1, 2, 3, 4, 5];
      }

      if (currentPage >= totalPages - 2) {
        return [
          totalPages - 4,
          totalPages - 3,
          totalPages - 2,
          totalPages - 1,
          totalPages,
        ];
      }

      return [
        currentPage - 2,
        currentPage - 1,
        currentPage,
        currentPage + 1,
        currentPage + 2,
      ];
    },
  },
  render() {
    const { $style, shownPagesNumbers, currentPage, totalPages, $listeners } =
      this;
    const { changePage } = $listeners;

    return (
      <div class={$style.pagination}>
        <span class={$style.control} on={{ click: () => changePage(1) }}>
          {'<<'}
        </span>
        <span
          class={$style.control}
          on={{ click: () => changePage(currentPage - 1) }}
        >
          {'<'}
        </span>
        {...shownPagesNumbers.map((number) => (
          <span
            class={[
              $style.control,
              { [$style.active]: currentPage === number },
            ]}
            on={{ click: () => changePage(number) }}
          >
            {number}
          </span>
        ))}
        <span
          class={$style.control}
          on={{ click: () => changePage(currentPage + 1) }}
        >
          {'>'}
        </span>
        <span
          class={$style.control}
          on={{ click: () => changePage(totalPages) }}
        >
          {'>>'}
        </span>
      </div>
    );
  },
};
</script>

<style module>
.pagination {
  height: 48px;
  width: 100%;
  border-bottom: 1px solid #c8cacc;
  display: flex;
  align-items: center;
  justify-content: flex-end;
}

.control {
  width: 24px;
  height: 24px;
  margin-right: 8px;
  text-align: center;
}

.control:last-of-type {
  margin-right: 0;
}

.control:hover {
  cursor: pointer;
}

.control.active {
  color: cornflowerblue;
  background: ivory;
  border: 1px solid #c8cacc;
  border-radius: 6px;
}
</style>
