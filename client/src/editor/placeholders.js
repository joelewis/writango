var newPostJSON = () => {
    return {"type":"doc","content":[{"type":"paragraph","content":[{"type":"text","text":"Start writing your post here…"}]}]};
};


var newTitleJSON = () => {
    return {"type":"doc","content":[{"type":"text","text":"Untitled Post"}]};
}; 

export {
    newPostJSON,
    newTitleJSON
}