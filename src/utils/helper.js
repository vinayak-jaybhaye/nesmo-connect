function generateChatId (user1, user2){
    return [user1, user2].sort().join('_');
}


export { generateChatId };