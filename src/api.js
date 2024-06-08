const usersKey = 'users';
const itemsKey = 'items';
const kitsKey = 'kits';

const loadFromLocalStorage = (key, defaultValue) => {
  const data = localStorage.getItem(key);
  return data ? JSON.parse(data) : defaultValue;
};

const saveToLocalStorage = (key, value) => {
  localStorage.setItem(key, JSON.stringify(value));
};

let users = loadFromLocalStorage(usersKey, [
  {
    id: 1,
    name: 'Admin',
    email: 'admin@example.com',
    password: 'password'
  }
]);

let items = loadFromLocalStorage(itemsKey, []);
let kitCompositions = loadFromLocalStorage(kitsKey, {});

export const getUsers = async () => {
  return users;
};

export const authenticateUser = async (email, password) => {
  const user = users.find(user => user.email === email && user.password === password);
  return user ? { ...user, token: 'fake-jwt-token' } : null;
};

export const registerUser = async (name, email, password) => {
  const newUser = {
    id: users.length + 1,
    name,
    email,
    password
  };
  users.push(newUser);
  saveToLocalStorage(usersKey, users);
  return newUser;
};

export const getItems = async () => {
  return items;
};

export const getItemById = async (id) => {
  return items.find(item => item.id === id);
};

export const searchItemsByQuery = async (query) => {
  const lowerCaseQuery = query.toLowerCase();
  return items.filter(item =>
    item.id.toLowerCase().includes(lowerCaseQuery) ||
    item.name.toLowerCase().includes(lowerCaseQuery) ||
    item.axCode.toLowerCase().includes(lowerCaseQuery) ||
    item.legacyCode.toLowerCase().includes(lowerCaseQuery)
  );
};

export const saveItem = async (item) => {
  const newId = (items.length + 1).toString().padStart(7, '0');
  const newItem = { ...item, id: newId };

  if (item.image) {
    newItem.image = URL.createObjectURL(item.image);
  }

  items.push(newItem);
  saveToLocalStorage(itemsKey, items);
};

export const updateItem = async (updatedItem) => {
  const index = items.findIndex(item => item.id === updatedItem.id);
  if (index !== -1) {
    if (updatedItem.image instanceof File) {
      updatedItem.image = URL.createObjectURL(updatedItem.image);
    }
    items[index] = updatedItem;
    saveToLocalStorage(itemsKey, items);
  }
};

export const deleteItem = async (id) => {
  const index = items.findIndex(item => item.id === id);
  if (index !== -1) {
    items.splice(index, 1);
    saveToLocalStorage(itemsKey, items);
  }
};

export const getKitItemsByCardNumber = async (cardNumber) => {
  const itemIds = kitCompositions[cardNumber] || [];
  return items.filter(item => itemIds.includes(item.id));
};

export const saveKitComposition = async (cardNumber, itemIds) => {
  kitCompositions[cardNumber] = itemIds;
  saveToLocalStorage(kitsKey, kitCompositions);
};

export const updateKitComposition = async (cardNumber, itemIds) => {
  kitCompositions[cardNumber] = itemIds;
  saveToLocalStorage(kitsKey, kitCompositions);
};

export const deleteKitComposition = async (cardNumber) => {
  delete kitCompositions[cardNumber];
  saveToLocalStorage(kitsKey, kitCompositions);
};

export const getKits = async () => {
  const kitKeys = Object.keys(kitCompositions);
  const savedKits = await Promise.all(kitKeys.map(async (cardNumber) => {
    const kitItems = await getKitItemsByCardNumber(cardNumber);
    return { cardNumber, items: kitItems };
  }));
  return savedKits;
};

export const searchKitByItemId = async (query) => {
  const matchedItems = await searchItemsByQuery(query);

  const matchedItemIds = matchedItems.map(item => item.id);

  const cardNumbers = Object.keys(kitCompositions).filter(cardNumber =>
    kitCompositions[cardNumber].some(itemId => matchedItemIds.includes(itemId))
  );

  return cardNumbers.map(cardNumber => ({
    cardNumber,
    items: items.filter(item => kitCompositions[cardNumber].includes(item.id))
  }));
};
