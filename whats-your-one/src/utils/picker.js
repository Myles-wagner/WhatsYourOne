// src/utils/picker.js
export class PickerState {
  constructor(items) {
    this.items = [...items];
    this.eliminated = [];
    this.survived = [];
    this.current = [...items];
    this.evaluating = [];
    this.favorites = [];
    this.batchSize = Math.max(2, Math.min(20, Math.ceil(items.length / 5)));
    this.history = [];
    this.historyPos = -1;
    
    this.shuffle(this.current);
    this.nextBatch();
    this.pushHistory();
  }

  // Shuffle array in place
  shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  }

  // Get the next batch of items to compare
  nextBatch() {
    if (this.current.length < this.batchSize && this.survived.length > 0) {
      this.nextRound();
      return;
    }
    this.evaluating = this.current.splice(0, this.batchSize);
  }

  // Move to the next round (when current round is complete)
  nextRound() {
    if (this.current.length === 0 && this.survived.length === 1) {
      this.favorites.push(this.survived.pop());
      this.nextRound();
      return;
    }
    
    this.shuffle(this.survived);
    this.current = [...this.current, ...this.survived];
    this.survived = [];
    this.batchSize = Math.max(2, Math.min(20, Math.ceil(this.current.length / 5)));
    this.nextBatch();
  }

  // Pick items from current batch
  pick(picked) {
    if (!picked || picked.length === 0) return;
    
    const pickedItems = [];
    const notPickedItems = [];
    
    // Separate items into picked and not picked
    this.evaluating.forEach(item => {
      if (picked.includes(item.id)) {
        pickedItems.push(item);
      } else {
        notPickedItems.push(item);
      }
    });
    
    // Add to survived and eliminated
    this.survived.push(...pickedItems);
    this.eliminated.push(...notPickedItems.map(item => ({
      ...item,
      eliminatedBy: pickedItems.map(p => p.id)
    })));
    
    this.evaluating = [];
    this.nextBatch();
    this.pushHistory();
  }

  // Pass on this batch (all items survive)
  pass() {
    this.survived.push(...this.evaluating);
    this.evaluating = [];
    this.nextBatch();
    this.pushHistory();
  }

  // History management
  getState() {
    return {
      eliminated: [...this.eliminated],
      survived: [...this.survived],
      current: [...this.current],
      evaluating: [...this.evaluating],
      favorites: [...this.favorites]
    };
  }

  pushHistory() {
    this.history.splice(this.historyPos + 1, this.history.length, this.getState());
    if (this.history.length > 10) { // Keep last 10 states
      this.history.shift();
    }
    this.historyPos = this.history.length - 1;
  }

  undo() {
    if (this.historyPos > 0) {
      const state = this.history[--this.historyPos];
      this.restoreState(state);
      return true;
    }
    return false;
  }

  redo() {
    if (this.historyPos < this.history.length - 1) {
      const state = this.history[++this.historyPos];
      this.restoreState(state);
      return true;
    }
    return false;
  }

  restoreState(state) {
    this.eliminated = [...state.eliminated];
    this.survived = [...state.survived];
    this.current = [...state.current];
    this.evaluating = [...state.evaluating];
    this.favorites = [...state.favorites];
  }
}

// Create a new picker state with sample items
export function createPicker(items) {
  return new PickerState(items);
}