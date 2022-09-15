<template>
  <div class="container">
    <document-header />
    <documents-list />
  </div>
</template>

<script>
import DocumentsList from './views/documents/DocumentsList.vue';
import DocumentHeader from './views/DocumentHeader.vue';
export default {
  components: { DocumentsList, DocumentHeader },
  name: "App",
}
</script>

<style>
  .container {
    width: 1024px;
  }
</style>
