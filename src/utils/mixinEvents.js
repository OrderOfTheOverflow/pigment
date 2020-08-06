export default {
  computed: {
    tabListSorted() {
      return this.$store.getters['Tabs/listSorted'];
    },
  },
  watch: {
    windowHasFocus(hasFocus) {
      if (hasFocus) {
        this.$electron.remote.app.emit('app-hide-app-icon-badge');
      }
    },
  },
  created() {
    const { app } = this.$electron.remote;
    const r = this.$router;

    app.on('app-router-goto-tabs-create', () => r.push({ name: 'tabs-create' }));
    app.on('app-router-goto-tab-list-index', index => this.goToTabWithListIndex(index));
    app.on('app-router-goto-settings', () => r.push({ name: 'settings' }));
    app.on('app-router-goto-welcome', () => r.push({ name: 'welcome' }));
    app.on('app-router-goto-changelog', () => r.push({ name: 'changelog' }));

    app.on('app-settings-toggle', (property) => {
      this.$store.dispatch('Settings/toggle', property);
    });
  },
  methods: {
    goToTabWithListIndex(index) {
      const tab = this.tabListSorted[index - 1];

      if (tab) {
        this.$router.push({
          name: 'tabs',
          params: { id: tab.id },
        });
      }
    },
  },
};
