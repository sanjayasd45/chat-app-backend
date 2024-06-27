const expressAsyncHandler = require("express-async-handler");

const createGroupController = expressAsyncHandler(async(req, res) => {
  if (!req.body.userData || !req.body.groupName) {
    return res.status(400).send({ message: "Data is insufficient" });
  }

  const users = req.body.users
  console.log("chatController/createGroups : ", req);
  users.push(req.user);

  try {
    const groupChat = await Chat.create({
      chatName: req.body.name,
      users: users,
      isGroupChat: true,
      groupAdmin: req.user,
    });

    const fullGroupChat = await Chat.findOne({ _id: groupChat._id })
      .populate("users", "-password")
      .populate("groupAdmin", "-password");

    res.status(200).json(fullGroupChat);
  } catch (error) {
    res.status(400);
    throw new Error(error.message);
  }
})


module.exports = {
    createGroupController,
}