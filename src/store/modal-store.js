import { defineStore } from "pinia";
import { useDocumentsStore } from "./documents-store";
import modals from '@/static/constants';

const defaultState = {
  initialIdx: -1,
  initialTitle: '',
  initialDescription: '',
  initialShortTitle: '',
  isNew: true
}

export const useModalStore = defineStore('modal-store', {
  state: () => ({
    initialIdx: -1,
    initialTitle: '',
    initialDescription: '',
    initialShortTitle: '',
    isNew: true,
    isNewTypeModalClosed: true,
    isNewDocumentModalClosed: true
  }),

  actions: {
    setNewTypeInitials(title, shortTitle, description, idx, isNew) {
      this.initialIdx = idx;
      this.initialTitle = title;
      this.initialShortTitle = shortTitle;
      this.initialDescription = description;
      this.isNew = isNew;
    },
    setNewDocumentInitials(title, description, idx, isNew) {
      this.initialIdx = idx;
      this.initialTitle = title;
      this.initialDescription = description;
      this.isNew = isNew;
    },
    toggleModal(modal) {
      if (modal === modals.MODAL_NEW_TYPE) {
        this.isNewTypeModalClosed = !this.isNewTypeModalClosed;
        return;
      }
      if (modal === modals.MODAL_NEW_DOC) {
        this.isNewDocumentModalClosed = !this.isNewDocumentModalClosed;
      }
    },

    makeTypeActions(title, shortTitle, description, isNew) {
      const docs = useDocumentsStore();
      if (isNew) {
        docs.documents.push({
          id: new Date().getTime(),
          name: title,
          shortTitle,
          description,
          isOpened: false,
          el: null,
          isDragging: false,
          docs: []
        });
        docs.fullDocuments.push({
          id: new Date().getTime(),
          name: title,
          shortTitle,
          description,
          isOpened: false,
          el: null,
          isDragging: false,
          docs: []
        });
      } else {
        docs.changeType(this.initialIdx, title, shortTitle, description);
      }
    },
    makeDocumentActions(title, description, isNew) {
      const docs = useDocumentsStore();
      if (isNew) {
        docs.freeDocuments.push({
          id: new Date().getTime(),
          name: title,
          description,
          el: null
        });
        docs.fullFreeDocuments.push({
          id: new Date().getTime(),
          name: title,
          description,
          el: null
        });
      } else {
        docs.changeDocument(this.initialIdx, title, description);
      }
    },

    resetModalState() {
      this.$state = { ...this.$state, ...defaultState }
    }
  },
});