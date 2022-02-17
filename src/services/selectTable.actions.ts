// Makes an action with genre as input that the reducer can listen to.
export const setSelectedTable = (name: string, selectedTable: string) => ({
  type: `SET_CURRENT_TABLE_${name}`,
  selectedTable,
});
