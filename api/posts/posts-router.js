// implement your posts router here
const express = require("express");
const Posts = require("./posts-model");
const router = express.Router();

router.get("/", async (req, res) => {
  Posts.find()
    .then((posts) => {
      res.status(200).json(posts);
    })
    .catch(() => {
      res.status(500).json({
        message: "The posts information could not be retrieved",
      });
    });
});

router.get("/:id", async (req, res) => {
  const { id } = req.params;
  Posts.findById(id)
    .then((post) => {
      if (!post) {
        res.status(404).json({
          message: "The post with the specified ID does not exist",
        });
      } else {
        res.status(200).json(post);
      }
    })
    .catch(() => {
      res.status(500).json({
        message: "The post information could not be retrieved",
      });
    });
});

router.post("/", async (req, res) => {
  const { title, contents } = req.body;
  if (!title || !contents) {
    res
      .status(400)
      .json({ message: "Please provide title and contents for the post" });
  } else {
    Posts.insert({ title, contents })
      .then(({ id }) => {
        return Posts.findById(id);
      })
      .then((post) => {
        res.status(201).json(post);
      })
      .catch(() => {
        res.status(500).json({
          message: "There was an error while saving the post to the database",
        });
      });
  }
});

// router.put("/:id", async (req, res) => {
//   const { title, contents } = req.body;
//   const { id } = req.params;
//   if (!title || !contents) {
//     res
//       .status(400)
//       .json({ message: "Please provide title and contents for the post" });
//   } else {
//     Posts.findById(id)
//       .then((post) => {
//         console.log(post);
//       })
//       .catch(() => {
//         res.status(404).json({
//           message: "The post with the specified ID does not exist",
//         });
//       })

//       .catch(() => {
//         res.status(500).json({
//           message: "The post information could not be modified",
//         });
//       });
//   }
// });

router.get("/:id/comments", async (req, res) => {
  const { id } = req.params;
  Posts.findById(id).then((post) => {
    if (!post) {
      res.status(404).json({
        message: "The post with the specified ID does not exist",
      });
    } else {
      Posts.findPostComments(id)
        .then((post) => {
          res.status(200).json(post);
        })
        .catch(() => {
          res.status(500).json({
            message: "The comments information could not be retrieved",
          });
        });
    }
  });
});

module.exports = router;
