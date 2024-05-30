import mongoose from 'mongoose';

const PostSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  createdAt: {
    type: String,
    default: function() {
      const options = { year: 'numeric', month: 'long', day: 'numeric' };
      const currentDate = new Date();
      return currentDate.toLocaleDateString('en-US', options); // Format the date
    }
  },
  imageFiles: [
    {
      type: String,
      required: true
    }
  ],
  class: {
    type: String,
    required: true
  },
  glaze: [{
        type: String // Array of glaze titles
  }],
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Customer',
    required: true,
  }
});

const Post = mongoose.models.Post || mongoose.model('Post', PostSchema);
export default Post;
