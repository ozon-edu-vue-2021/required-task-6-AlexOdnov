<script lang="jsx">
import { orderBy } from 'lodash/collection';
import FilterDropdown from './filter-dropdown';
import OzTableRow from './oz-table-row';
import OzInfPaginator from './oz-inf-paginator';
import OzPaginator from './oz-paginator';

export default {
  name: 'oz-table',
  props: {
    rows: {
      type: Array,
      default: () => [],
    },
    virtScroll: {
      type: Boolean,
      default: false,
    },
    infScroll: {
      type: Boolean,
      default: false,
    },
    paginate: {
      type: Boolean,
      default: false,
    },
    currentPage: {
      type: Number,
      default: 1,
    },
    perPage: {
      type: Number,
      default: 20,
    },
    totalPages: {
      type: Number,
      default: 1,
    },
  },
  data() {
    return {
      sortProp: [],
      sortDirection: [],
      filter: {},
      filterText: [],
      openedTooltip: '',
    };
  },
  computed: {
    sortedRows() {
      let res;

      if (!this.sortDirection.length) {
        res = this.rows;
      }

      res = orderBy(this.rows, this.sortProp, this.sortDirection);

      if (Object.keys(this.filter).length) {
        res = res.filter((row) => {
          for (const prop in this.filter) {
            const text = this.filter[prop];
            let res = true;
            if (text) {
              res = row[prop].toString().includes(text);
            }
            if (!res) {
              return false;
            }
          }
          return true;
        });
      }

      if (this.paginate) {
        const start = (this.currentPage - 1) * 10;
        const end = start + this.perPage;
        res = res.splice(start, end);
      }

      return res;
    },
  },
  methods: {
    toggleSort(prop) {
      const index = this.sortProp.indexOf(prop);
      if (index !== -1) {
        const sortDirection =
          this.sortDirection[index] === 'desc' ? 'asc' : 'desc';
        this.sortDirection.splice(index, 1, sortDirection);
      } else {
        this.sortProp.push(prop);
        this.sortDirection.push('desc');
      }
    },
    removeSort(prop) {
      const index = this.sortProp.indexOf(prop);
      this.sortProp.splice(index, 1);
      this.sortDirection.splice(index, 1);
    },
    openFilterTooltip(prop) {
      this.openedTooltip = prop;
      if (!this.filter[prop]) {
        this.filter = Object.assign({}, this.filter, { [prop]: '' });
      }
    },
    closeFilterTooltip() {
      this.openedTooltip = '';
    },
    removeFilterText(prop) {
      const tempObj = this.filter;
      delete tempObj[prop];
      this.filter = Object.assign({}, tempObj);

      this.closeFilterTooltip();
    },
    setFilterText(prop, e) {
      this.filter[prop] = e.target.value;
    },
    renderHead(h, columnsOptions) {
      const { $style, sortProp, sortDirection, filter } = this;

      return columnsOptions.map((column) => {
        const renderedTitle = column.scopedSlots.title
          ? column.scopedSlots.title()
          : column.title;
        let sortIcon = 'sort';

        const indexSort = sortProp.indexOf(column.prop);

        if (indexSort !== -1) {
          sortIcon =
            sortDirection[indexSort] === 'asc'
              ? 'sort-amount-down'
              : 'sort-amount-up';
        }

        return (
          <div key={column.prop} class={$style.headerCell}>
            <span>{renderedTitle}</span>
            <font-awesome-icon
              class={$style.sortIcon}
              icon={sortIcon}
              on={{ click: () => this.toggleSort(column.prop) }}
            />
            {indexSort !== -1 ? (
              <font-awesome-icon
                class={$style.sortIcon}
                icon="times"
                on={{ click: () => this.removeSort(column.prop) }}
              />
            ) : null}
            <FilterDropdown
              columnProp={column.prop}
              shown={this.openedTooltip === column.prop}
              filterText={filter[column.prop]}
              style={{ color: filter[column.prop] ? 'green' : 'currentColor' }}
              on={{
                openFilterTooltip: () => this.openFilterTooltip(column.prop),
                closeFilterTooltip: () => this.closeFilterTooltip(),
                removeFilterText: () => this.removeFilterText(column.prop),
                setFilterText: (e) => this.setFilterText(column.prop, e),
              }}
            />
          </div>
        );
      });
    },
    getColumnOptions() {
      return this.$slots.default
        .filter(
          (item) =>
            item.componentOptions &&
            item.componentOptions.tag === 'oz-table-column'
        )
        .map((column) =>
          Object.assign({}, column.componentOptions.propsData, {
            scopedSlots: column.data.scopedSlots || {},
          })
        );
    },
    renderRows(columnsOptions) {
      return this.sortedRows.map((row) => (
        <OzTableRow row={row} columnsOptions={columnsOptions} />
      ));
    },
  },
  render(h) {
    const columnsOptions = this.getColumnOptions();
    const columnsHead = this.renderHead(h, columnsOptions);

    return (
      <div class={this.$style.table}>
        <div class={this.$style.thead}>{...columnsHead}</div>
        {this.virtScroll ? (
          <RecycleScroller
            items={this.sortedRows}
            itemSize={110}
            pageMode
            scopedSlots={{
              default: ({ item }) => (
                <OzTableRow row={item} columnsOptions={columnsOptions} />
              ),
            }}
          />
        ) : (
          this.renderRows(columnsOptions)
        )}
        {this.infScroll ? (
          <OzInfPaginator on={{ getPage: this.$listeners.getPage }} />
        ) : null}
        {this.paginate ? (
          <OzPaginator
            currentPage={this.currentPage}
            totalPages={this.totalPages}
            on={{ changePage: this.$listeners.changePage }}
          />
        ) : null}
      </div>
    );
  },
};
</script>

<style module>
.table {
  border-spacing: 0;
  width: 100%;
}

.grid {
  display: grid;
  grid-template-columns: 10% 12.5% 25% 25% 27.5%;
}

.thead {
  composes: grid;
  position: sticky;
  top: 0;
  z-index: 2;
}

.cell {
  text-align: left;
  border-bottom: 1px solid #c8cacc;
  padding: 1rem;
}

.headerCell {
  composes: cell;
  display: flex;
  align-items: center;
  background: #c7cbcb;
}

.sortIcon {
  margin-left: 8px;
}

.sortIcon:hover {
  cursor: pointer;
}
</style>
