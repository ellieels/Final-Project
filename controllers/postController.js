import Post from '../Models/Post.js'; 
import Customer from '../Models/Customer.js';
import GlazePost from '../models/glazePost.js';

/*
export const createPost = async (req, res) => {
  const { title, description, className } = req.body; // Destructure 'class' from req.body
  try {
    console.log(req.body);
    console.log(req.file);
    
    const post = new Post({
      title: title,
      description: description,
      author: req.user._id,
      imageFile: req.file.filename,
      class: className // Add 'class' field to the post
    });
    await post.save();
    res.redirect('/gallery');
  } catch (error) {
    res.status(500).send(error.toString());
  }
};
*/

export const createPost = async (req, res) => {
  const { title, description, className, glaze } = req.body; // Destructure 'class' from req.body  
  try {
      console.log("test1");
        const files = req.files;
        if (!files) {
            return res.status(400).send({ message: 'Please upload files.' });
        }
      let fileArray = files.map(file => file.filename);
        console.log(fileArray);
        const postDetails = {
            title: title,
            description: description,
            imageFiles: fileArray,
            author: req.user._id,
            class: className, // Add 'class' field to the post
            glaze: glaze
        };
        console.log("test3");
        const newPost = new Post(postDetails);
        console.log("test4");
        await newPost.save();
        console.log("test5");
        res.redirect('/gallery');
        //res.status(201).send({ message: 'Post created successfully', post: newPost });
    } catch (error) {
        res.status(500).send({ message: 'Error creating post', error: error.message });
    }
};


export const createGlaze = async (req, res) => {
  const { title, notes } = req.body;
  try {
    if (!req.file) {
      return res.status(400).send('No file uploaded.');
    }

    const glazePost = new GlazePost({
      title: title,
      notes: notes,
      imageFile: req.file.filename
    });

    await glazePost.save();
    res.redirect('/glazes');
  } catch (error) {
    res.status(500).send(error.toString());
  }
};




















export const deletePost = async (req, res) => {
  try {
    const { id } = req.params;
    await Post.findOneAndDelete({ _id: id });
    res.redirect('/');
  } catch (error) {
    res.status(500).send(error.toString());
  }
};


// Show form to edit a post (only for post author or admin)
 export const editPost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).send('Post not found');
    }
    if (post.author.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).send('Unauthorized');
    }
    res.render('posts/new', { post });
  } catch (error) {
    res.status(500).send(error.toString());
  }
};

// Update a post (only for post author or admin)
 export const savePost = async (req, res) => {
  const { title, content } = req.body;
  try {
    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).send('Post not found');
    }
    if (post.author.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).send('Unauthorized');
    }
    post.title = title;
    post.content = content;
    await post.save();
    res.redirect('/');
  } catch (error) {
    res.status(500).send(error.toString());
  }
};

