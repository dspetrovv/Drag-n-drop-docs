<template>
  <div class="documents">
    <search-input />
    <div id="documents" class="documents__list">
      <h2>Категории</h2>
      <div
        v-for="(docs, index) in documents"
        :key="docs.id"
        :id="`document-${docs.id}`"
      >
        <document-card
          v-bind:idx="docs.id"
          v-bind:index="index"
          v-bind:name="docs.name"
          v-bind:description="docs.description"
          v-bind:short-title="docs.shortTitle"
          v-bind:type="types.TYPE_PARENT"
          v-bind:is-opened="docs.isOpened"
          :id="`document-main-${docs.id}`"
          @open="openDocsList"
          @dragging="drag"
        />
        <div
          class="documents__wrapper"
          :id="`document-wrapper-${docs.id}`"
          :style="`overflow: hidden; height: ${docs.isOpened ? (DOCUMENT_HEIGHT * (!docs.isDragging ? (!docs.docs?.length || docs.docs[0]?.isEmpty ? 1 : docs.docs?.length) : docs.docs?.length-1)) : 0}px`"
        >
          <template v-if="!docs.docs[0]?.isEmpty">
            <document-card
              v-for="(doc, idx) in docs.docs"
              :key="doc.id"
              v-bind:idx="doc.id"
              v-bind:index="idx"
              v-bind:name="doc.name"
              v-bind:description="doc.description"
              v-bind:short-title="docs.shortTitle"
              v-bind:type="types.TYPE_CHILD"
              v-bind:parent-idx="index"
              :id="`document-${types.TYPE_CHILD}-${doc.id}-${index}`"
              :style="`height: ${DOCUMENT_HEIGHT}px;`"
              @dragging="drag"
            />
          </template>
          <div v-if="!docs.docs.length || docs.docs[0]?.isEmpty" class="documents__block-wrapper">
            <div
              :id="`document-${types.TYPE_CHILD}-${index}-${index}`"
              :class="`documents__block documents__block_doc documents__block_doc-empty`"
            >
              <span>Пусто</span>
            </div>
          </div>
        </div>
      </div>
      <div
        v-if="!documents.length "
        :id="`document-main-0`"
        :class="`documents__block documents__block_free documents__block_free-empty`"
      >
        <span>Пусто</span>
      </div>
      <!-- <document-card v-bind:type="types.TYPE_CHILD" />
      <document-card v-bind:type="types.TYPE_FREE" /> -->
    </div>
    <div id="documents-free" class="documents__list documents__list_free">
      <h2>Без категории</h2>
      <template v-if="!freeDocuments[0]?.isEmpty">
        <document-card
          v-for="(freeDoc, index) in freeDocuments"
          :key="freeDoc.id"
          v-bind:idx="freeDoc.id"
          v-bind:index="index"
          v-bind:name="freeDoc.name"
          v-bind:description="freeDoc.description"
          v-bind:type="types.TYPE_FREE"
          v-bind:parent-idx="documents.length"
          :id="`document-${types.TYPE_FREE}-${freeDoc.id}`"
          :style="`height: ${DOCUMENT_HEIGHT}px;`"
          @dragging="drag"
        />
      </template>
      <div
        v-if="!freeDocuments.length || freeDocuments[0]?.isEmpty"
        :id="`document-${types.TYPE_FREE}-0`"
        :class="`documents__block documents__block_free documents__block_free-empty`"
      >
        <span>Пусто</span>
      </div>
      <!-- <document-card v-bind:type="types.TYPE_CHILD" />
      <document-card v-bind:type="types.TYPE_FREE" /> -->
    </div>
  </div>
</template>

<script>
import types from '@/static/constants';
import docParams from '@/static/document-params';
import SearchInput from '@/components/SearchInput.vue';
import DocumentCard from '@/components/DocumentCard.vue';
import { useDocumentsStore } from '@/store/documents-store'
import { computed } from 'vue';
export default {
  components: { SearchInput, DocumentCard },
  setup() {
    const docsStore = useDocumentsStore();
    let documents = computed(() => docsStore.documents);
    let freeDocuments = computed(() => docsStore.freeDocuments);
    return {
      types,
      documents,
      freeDocuments,
      DOCUMENT_HEIGHT: docParams.DOCUMENT_HEIGHT,
      openDocsList: docsStore.openDocsList,
      drag: docsStore.drag
    };
  },
}
</script>