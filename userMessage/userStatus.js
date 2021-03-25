/**
 * Get user status
 */

let users = [];

function userJoin(id, room, nickname) {
    let newUser = { id, room, nickname };
    users.push(newUser);
    return newUser;
}

function getCurrentUser(id) {
    return users.find(e => e.id === id);
}

function roomUsers(room) {
    return users.filter(e => e.room === room);
}

function userLeave(id) {
    let index = users.findIndex(e => e.id === id);
    if (index > -1) {
        return users.splice(index, 1)[0];
    }
}

module.exports = {
    userJoin,
    getCurrentUser,
    roomUsers,
    userLeave

}
