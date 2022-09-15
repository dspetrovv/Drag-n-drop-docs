<template>
  <div class="search" style="width: 50%">
    <img class="search__icon" :src="require('../assets/icons/search.svg')" alt="Search icon">
    <input class="search__input" type="text" v-model="searchText" placeholder="Поиск">
    <span v-if="searchText.trim().length" class="search__clear-btn" @click.prevent="clearInput"></span>
  </div>
  <div style="display: flex; margin-top: 10px;">
    <div>
      <input
        name="search"
        id="type"
        type="radio"
        class="radio"
        @change="changeRadio('type')"
        :checked="type"
        :disabled="searchText.trim().length"
      >
      <label for="type" style="margin-right: 10px;">Категория</label>
    </div>
    <div>
      <input
        name="search"
        id="docs"
        type="radio"
        class="radio"
        @change="changeRadio('docs')"
        :checked="docs"
        :disabled="searchText.trim().length"
      >
      <label for="docs">Документы</label>
    </div>
  </div>
</template>

<script>
import { ref, watch } from 'vue'
import { useDocumentsStore } from '@/store/documents-store';
export default {
  setup() {
    const docsStore = useDocumentsStore();
    let searchText = ref('');
    let type = ref(true);
    let docs = ref(false);
    function changeRadio(radio) {
      if (radio === 'type') {
        type.value = true;
        docs.value = false;
      } else if (radio === 'docs') {
        docs.value = true;
        type.value = false;
      }
    }
    function clearInput() {
      searchText.value = '';
    }

    watch(searchText, (val) => {
      if (type.value) {
        docsStore.searchType(val);
      } else if (docs.value) {
        docsStore.searchDoc(val);
      }
    });

    return {
      searchText,
      type,
      docs,
      changeRadio,
      clearInput,
    };
  },
}
</script>