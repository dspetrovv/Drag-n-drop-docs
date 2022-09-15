<template>
  <!-- flex -->
  <div class="documents__block-wrapper" ref="element">
    <div :class="`documents__block documents__block_${type}`">
      <div
        v-if="type === types.TYPE_PARENT"
        :class="`open-icon${isOpened ? ' open-icon_opened' : ''}`"
        @click="open"
      ></div>
      <div class="documents__info">
        <span :class="`documents__name documents__name_${type}`">
          {{ name }}
        </span>
        <span v-if="type === types.TYPE_CHILD" class="documents__type">
          {{ shortTitle }}
        </span>
        <span class="documents__description">
          {{ description }}
        </span>
      </div>
      <!-- Flex with align-self-right -->
      <div class="documents__icons">
        <pen-icon id="icon-pen" @click.prevent="toggleModal" />
        <trash-icon id="icon-trash" @click.prevent="deleteDocument" />
        <arrow-icon id="icon-arrow" @mousedown="(e) => changeDragability(e)" />
      </div>
    </div>
  </div>
</template>
<script>
import types from '@/static/constants';
import PenIcon from './icons/PenIcon.vue';
import TrashIcon from './icons/TrashIcon.vue';
import ArrowIcon from './icons/ArrowIcon.vue';
import { useModalStore } from '@/store/modal-store';
import { ref } from 'vue';
import { useDocumentsStore } from '@/store/documents-store';
export default {
  components: { PenIcon, TrashIcon, ArrowIcon },
  props: {
    idx: {
      type: Number,
      required: false,
    },
    index: {
      type: Number,
      required: false,
    },
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    shortTitle: {
      type: String,
      required: false,
    },
    type: {
      type: String,
      required: true,
    },
    isOpened: {
      type: Boolean,
      requred: false,
    },
    parentIdx: {
      type: Number,
      required: false,
    },
  },
  emits: ['open', 'dragging'],
  setup(props, { emit }) {
    const modalStore = useModalStore();
    const documentsStore = useDocumentsStore();
    
    let element = ref(null);
    function open() {
      emit('open', props.idx)
    }
    function changeDragability(event) {
      emit('dragging', event, element.value, props.type, props.parentIdx, props.idx, props.index);
    }
    function toggleModal() {
      let modal = '';
      if (props.type === types.TYPE_PARENT) {
        modalStore.setNewTypeInitials(props.name, props.shortTitle, props.description, props.idx, false);
        modal = types.MODAL_NEW_TYPE;
      } else if (props.type === types.TYPE_CHILD || props.type === types.TYPE_FREE) {
        modalStore.setNewDocumentInitials(props.name, props.description, props.idx, false);
        modal = types.MODAL_NEW_DOC;
      }
      setTimeout(() => {
        modalStore.toggleModal(modal);
      });
    }
    function deleteDocument() {
      if (props.type === types.TYPE_PARENT) {
        documentsStore.deleteType(props.idx);
      } else if (props.type === types.TYPE_CHILD || props.type === types.TYPE_FREE) {
        documentsStore.deleteDocument(props.idx);
      }
    }
    return {
      types,
      element,
      open,
      changeDragability,
      toggleModal,
      deleteDocument
    };
  },
}
</script>