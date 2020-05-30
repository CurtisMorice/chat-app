const users = [];

const addUser = ({ id, name, room }) => {
  name = name.trim().toLowerCase(); //trim spaces and lowercase er'
  room = room.trim().toLowerCase();

  // check for exisitng user && error check
  const existingUser = users.find((user) => user.room === room && user.name === name);
  if (existingUser) {
    return { error: 'Usernam is taken' };
  }
  // create user object to pass to the array
  const user = { id, name, room };
  users.push(user);

  return { user }
}

const removeUser = (id) => {
  const index = users.findIndex((user) => user.id === id);

  if (index !== -1) {
    return user.splice(index, 1)[0];
  }
}

const getUser = (id) => users.find((user) => user.id === id);

const getUsersInRoom = (room) => users.filter((user) => user.room === room);

module.exports = { addUser, removeUser, getUser, getUsersInRoom };