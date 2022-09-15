import { nextTick } from "vue";
import types from '@/static/constants';
import { defineStore } from "pinia";

export const useDocumentsStore = defineStore('documents', {
  state: () => ({
    fullDocuments: [],
    documents: [],
    fullFreeDocuments: [],
    freeDocuments: [],
    isDragging: false,
  }),

  actions: {
    openDocsList(id) {
      this.documents.map(doc => {
        if (doc.id === id) {
          doc.isOpened = !doc.isOpened;
        }
      });
    },

    getCoords(elem) {
      const elemRect = elem.getBoundingClientRect();
      return {
        x: elemRect.left + window.scrollX,
        y: elemRect.top + window.scrollY
      };
    },
    getPosCoords(elem) {
      const box = elem.getBoundingClientRect();
      return {
        top: box.top + scrollY,
        left: box.left + scrollX
      };
    },

    setNewDocs(type, idx) {
      let docs = [];
      let freeDocs = [];
      let dragIdx = 0;
      let docsCounter = [];
      switch (type) {
        case types.TYPE_CHILD:
        case types.TYPE_FREE:
          for (let i = 0; i < this.documents.length; i++) {
            docs = [];
            docsCounter.push(this.documents[i].docs.length + 1);
            for (const doc of this.documents[i].docs) {
              const node = document.getElementById(`document-${types.TYPE_CHILD}-${doc.id}-${i}`);
              let docWithEl = {
                ...doc,
                parentIdx: i,
                el: this.getCoords(node),
                node: node.children[0]
              };
              docs.push(docWithEl);
              if (doc.id === idx) {
                dragIdx = i;
                this.documents[i].isDragging = true;
                docs.push({ ...docWithEl, isTmp: true });
              }
            }
            // if empty
            if (!docs.length) {
              const node = document.getElementById(`document-${types.TYPE_CHILD}-${i}-${i}`);
              docs.push({
                parentIdx: i,
                el: this.getCoords(node),
                node: node,
                isEmpty: true,
              });
            }
            this.documents[i].docs = docs;
          }
          for (const freeDoc of this.freeDocuments) {
            const node = document.getElementById(`document-${types.TYPE_FREE}-${freeDoc.id}`);
            const freeDocWithEl = {
              ...freeDoc,
              parentIdx: this.documents.length,
              el: this.getCoords(node),
              node: node.children[0]
            };
            freeDocs.push(freeDocWithEl);
            if (freeDoc.id === idx) {
              freeDocs.push({ ...freeDocWithEl, isTmp: true });
            }
          }
          // if empty
          if (!freeDocs.length) {
            const node = document.getElementById(`document-${types.TYPE_FREE}-0`);
            freeDocs.push({
              parentIdx: this.documents.length,
              el: this.getCoords(node),
              node: node.children[0],
              isEmpty: true,
            });
          }
          docsCounter.push(this.freeDocuments.length + 1);
          this.freeDocuments = freeDocs;
          return [ dragIdx, docsCounter ];

        case types.TYPE_PARENT:
          dragIdx = idx;
          for (const doc of this.documents) {
            const node = document.getElementById(`document-${type}-${doc.id}`);
            const docWithEl = {
              ...doc,
              el: this.getCoords(node),
              node: node.children[0]
            };
            docs.push(docWithEl);
            if (doc.id === idx) {
              docs.push({ ...docWithEl, isTmp: true });
            }
          }
          this.documents = docs;
          return [ dragIdx, docsCounter ];
        default:
          return [ dragIdx, docsCounter ];
      }
    },

    drag(event, element, type, parentIdx = 0, idx, index) {
      if (this.isDragging) {
        endDragging.bind(this);
        return;
      }
      this.isDragging = true;
      let [ dragIdx, docsCounter ] = this.setNewDocs(type, idx);
      let docs = [ ...this.documents ];
      if (type === types.TYPE_PARENT) {
        element = document.getElementById(`document-${idx}`);
      }
      let coords = this.getPosCoords(element);
      let shiftX = event.pageX - coords.left;
      let shiftY = event.pageY - coords.top;
      let posIdx = index;
      let myDocs = [ ...this.documents ];
      let myFreeDocs = [ ...this.freeDocuments ];
      let uniqueMyDocs = myDocs.filter(doc => !('isTmp' in doc));
      let moveIdx = index;
      let childMoveIdx = index;
      let newParentIdx = parentIdx;
      let prevNode = null;

      const moveAt = (e) => {
        element.style.left = e.clientX - shiftX + 'px';
        element.style.top = e.clientY - shiftY + 'px';
        if (moveIdx + 1 < uniqueMyDocs.length && e.clientY >= uniqueMyDocs[moveIdx + 1].el.y) {
          posIdx++;
          moveIdx++;
          childMoveIdx++;
          if (type === types.TYPE_CHILD || type === types.TYPE_FREE) {
            if (
              (newParentIdx <= this.documents.length - 1
              && childMoveIdx + 1 > this.documents[newParentIdx].docs.length - 1)
              || (newParentIdx === this.documents.length
              && childMoveIdx + 1 > this.freeDocuments.length - 1)
            ) {
              childMoveIdx = 0;
            } else if (childMoveIdx < 0) {
              childMoveIdx = moveIdx;
            }
            newParentIdx = uniqueMyDocs[moveIdx].parentIdx;
          }
          if (prevNode !== null) {
            prevNode.classList.toggle('documents__block_active');
          }
          prevNode = uniqueMyDocs[posIdx].node;
          prevNode.classList.toggle('documents__block_active');
        } else if (moveIdx - 1 >= 0 && e.clientY <= uniqueMyDocs[moveIdx - 1].el.y) {
          posIdx--;
          if (posIdx < 0) {
            posIdx = 0;
          }
          moveIdx--;
          if (type === types.TYPE_CHILD || type === types.TYPE_FREE) {
            if (newParentIdx > 0 && childMoveIdx - 1 < 0) {
              if (newParentIdx <= this.documents.length - 1) {
                childMoveIdx = this.documents[newParentIdx].docs.length - 1;
              } else if (newParentIdx === this.documents.length) {
                childMoveIdx = this.freeDocuments.length - 1;
              }
            }
            childMoveIdx--;
            newParentIdx = uniqueMyDocs[moveIdx].parentIdx;
          }
          if (prevNode !== null) {
            prevNode.classList.toggle('documents__block_active');
          }
          prevNode = uniqueMyDocs[posIdx].node;
          prevNode.classList.toggle('documents__block_active');
        }
      }

      // Creating el
      let docsEl = document.getElementById('documents');
      const width = element.clientWidth;
      element.style.position = 'absolute';
      element.style.minWidth = width + 'px';
      element.style.zIndex = 100;
      docsEl.appendChild(element);
      if (type === types.TYPE_CHILD || type === types.TYPE_FREE) {
        myDocs = [
          ...this.documents.map(docs => docs.docs).flat(Infinity),
          ...this.freeDocuments.flat(Infinity)
        ];
        uniqueMyDocs = myDocs.filter(doc => !('isTmp' in doc));
        moveIdx = myDocs.findIndex(md => md.id === idx);
        posIdx = moveIdx;
        element.style.maxWidth = width - 16 + 'px';
        setTimeout(() => {
          let dragNodes = [];
          if (type === types.TYPE_CHILD){
            dragNodes = document.querySelectorAll(`#document-${type}-${this.documents[dragIdx].docs.find(doc => doc.id === idx).id}-${dragIdx}`);
            dragNodes[0].children[0].style.opacity = 0.5;
            dragNodes[1].children[0].classList.toggle('box-shadow_blue');
          } else if (type === types.TYPE_FREE) {
            dragNodes = document.querySelectorAll(`#document-${type}-${this.freeDocuments.find(doc => doc.id === idx).id}`);
            dragNodes[1].children[0].style.opacity = 0.5;
            dragNodes[0].children[0].classList.toggle('box-shadow_blue');
          }
          moveAt(event);
        });
      }

      document.onmousemove = (evt) => {
        moveAt(evt);
      }
      
      const getNewDocs = () => {
        let newDocs = [];
        for (let i = 0; i < myDocs.length; i++) {
          if (newDocs.length === myDocs.length) {
            break;
          }
          if (myDocs[i].id === idx) {
            posIdx++;
            if (i === myDocs.length - 1) {
              newDocs.push(myDocs.find(md => md.id === idx));
            }
            continue;
          }
          if (i === posIdx) {
            newDocs.push(myDocs.find(md => md.id === idx));
          }
          newDocs.push(myDocs[i]);
          if (i === myDocs.length - 1 && posIdx === myDocs.length) {
            newDocs.push(myDocs.find(md => md.id === idx));
          }
        }
        return newDocs;
      }

      function endDragging() {
        this.isDragging = false;
        document.onmousemove = null;
        element.onmouseup = null;
        if (type === types.TYPE_PARENT) {
          myDocs = myDocs.filter(doc => !('isTmp' in doc));
          docs = [ ...getNewDocs() ];
          if (posIdx < 0) {
            posIdx = 0;
          } else if (posIdx > this.documents.length) {
            posIdx = this.documents.length - 1;
          }
        } else if (type === types.TYPE_CHILD || type === types.TYPE_FREE) {
          docs = [ ...docs.map(doc => ({ ...doc, docs: doc.docs.filter(dc => !('isTmp' in dc)) })) ];
          docs[dragIdx].isDragging = false;
          myDocs = myDocs.filter(doc => !('isTmp' in doc));
          if (newParentIdx !== parentIdx) {
            docsCounter[parentIdx]--;
            if (docsCounter.length === newParentIdx) {
              newParentIdx--;
            }
            posIdx += posIdx === docsCounter[newParentIdx] - 2 ? 1 : 0;
            docsCounter[newParentIdx]++;
          }
          let newMyDocs = [ ...getNewDocs() ];
          let k = 0;
          for (let i = 0; i < docsCounter.length - 1; i++) {
            docs[i].docs = [];
            for (let j = 0; j < docsCounter[i] - 1; j++) {
              if (!newMyDocs[k]?.isEmpty) {
                delete newMyDocs[k].parentIdx;
                docs[i].docs.push(newMyDocs[k]);
              } else {
                j--;
              }
              k++;
            }
          }
          myFreeDocs = [];
          for (let i = k; i < newMyDocs.length; i++) {
            if (!newMyDocs[i]?.isEmpty) {
              delete newMyDocs[i].parentIdx;
              myFreeDocs.push(newMyDocs[i]);
            }
          }
        }
        this.documents = [];
        this.freeDocuments = [];
        nextTick(() => {
          this.documents = docs;
          this.freeDocuments = myFreeDocs;
          element.remove();
        });
      }

      element.onmouseup = endDragging.bind(this);
    },

    deleteType(id) {
      this.documents = this.documents.filter(doc => doc.id !== id);
      this.fullDocuments = this.fullDocuments.filter(doc => doc.id !== id);
    },

    deleteDocument(id) {
      let [ i, j, docToChange ] = this.findDocument(id);
      if (docToChange === undefined) {
        this.freeDocuments = this.freeDocuments.filter(doc => doc.id !== id);
        this.fullFreeDocuments = this.fullFreeDocuments.filter(doc => doc.id !== id);
      } else {
        this.documents[i].docs = this.documents[i].docs.filter((_, idx) => idx !== j);
        this.fullDocuments[i].docs = this.fullDocuments[i].docs.filter((_, idx) => idx !== j);
      }
    },
    
    searchType(text) {
      if (!text.trim().length) {
        this.documents = [ ...this.fullDocuments ];
        return;
      }
      this.documents = [ ...this.fullDocuments.filter(doc => doc.name.startsWith(text)) ];
    },

    searchDoc(text) {
      if (!text.trim().length) {
        this.documents = [ ...this.fullDocuments ];
        this.freeDocuments = [ ...this.fullFreeDocuments ];
        return;
      }
      this.documents = [ ...this.fullDocuments.filter(doc => doc.docs.find(dc => dc.name.startsWith(text))) ];
      for (let i = 0; i < this.documents.length; i++) {
        let docs = [];
        for (let j = 0; j < this.documents[i].docs.length; j++) {
          if (this.documents[i].docs[j].name.startsWith(text)) {
            docs.push(this.documents[i].docs[j]);
          }
        }
        this.documents[i].docs = docs;
      }
      this.freeDocuments = [ ...this.fullFreeDocuments.filter(doc => doc.name.startsWith(text)) ];
    },

    changeType(id, title, shortTitle, description) {
      let docToChange = this.documents.find(doc => doc.id === id);
      docToChange.name = title;
      docToChange.shortTitle = shortTitle;
      docToChange.description = description;
      docToChange = this.fullDocuments.find(doc => doc.id === id);
      docToChange.name = title;
      docToChange.shortTitle = shortTitle;
      docToChange.description = description;
    },
  
    changeDocument(id, title, description) {
      let [ i, j, docToChange ] = this.findDocument(id);
      if (docToChange === undefined) {
        docToChange = this.freeDocuments.find(doc => doc.id === id);
        docToChange.name = title;
        docToChange.description = description;
        docToChange = this.fullFreeDocuments.find(doc => doc.id === id);
        docToChange.name = title;
        docToChange.description = description;
      } else {
        this.documents[i].docs[j].name = title;
        this.documents[i].docs[j].description = description;
        const fullDoc = this.fullDocuments.find(fd => fd.docs.find(dc => dc.id === this.documents[i].docs[j].id));
        fullDoc.name = title;
        fullDoc.description = description;
      }
    },

    findDocument(id) {
      let docToChange = undefined;
      for (let i = 0; i < this.documents.length; i++) {
        for (let j = 0; j < this.documents[i].docs.length; j++) {
          if (this.documents[i].docs[j].id === id) {
            docToChange = this.documents[i].docs[j].id;
            return [ i, j, docToChange ]
          }
        }
      }
      return [ -1, -1, docToChange ];
    },
  }

});