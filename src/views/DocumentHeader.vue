<template>
  <div class="documents-header">
    <modal-new-type
      :is-closed="isNewTypeModalClosed"
      @closeModal="toggleModal"
    />
    <modal-new-document
      :is-closed="isNewDocumentModalClosed"
      @closeModal="toggleModal"
    />
    <span class="documents-header__heading">Документы</span>
    <div class="documents-header__buttons">
      <button-plus @on-click="toggleModal(MODAL_NEW_TYPE)">
        <template #name>
          Новый тип
        </template>
      </button-plus>
      <button-plus @on-click="toggleModal(MODAL_NEW_DOC)">
        <template #name>
          Новый документ
        </template>
      </button-plus>
    </div>
  </div>
</template>
<script>
import modals from '@/static/constants';
import ButtonPlus from '@/components/buttons/ButtonPlus.vue';
import ModalNewType from '@/components/modals/ModalNewType.vue';
import { computed } from 'vue';
import ModalNewDocument from '@/components/modals/ModalNewDocument.vue';
import { useModalStore } from '@/store/modal-store';
export default {
  components: { ButtonPlus, ModalNewType, ModalNewDocument },
  setup() {
    const modalStore = useModalStore();
    let isNewTypeModalClosed = computed(() => modalStore.isNewTypeModalClosed);
    let isNewDocumentModalClosed = computed(() => modalStore.isNewDocumentModalClosed);

    function toggleModal(modal) {
      if (modal === modals.MODAL_NEW_TYPE) {
        modalStore.setNewTypeInitials('', '', '', -1, true);
      } else if (modal === modals.MODAL_NEW_DOC) {
        modalStore.setNewDocumentInitials('', '', -1, true);
      }
      modalStore.toggleModal(modal);
    }

    return {
      isNewTypeModalClosed,
      isNewDocumentModalClosed,
      MODAL_NEW_TYPE: modals.MODAL_NEW_TYPE,
      MODAL_NEW_DOC: modals.MODAL_NEW_DOC,
      toggleModal
    };
  },
}
</script>