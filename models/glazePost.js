import mongoose from 'mongoose';

const glazePostSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  notes: {
    type: String,
    required: true
  },
  imageFile: {
    type: String,
    required: true
  }
});

const glazePost = mongoose.models.glazePost || mongoose.model('glazePost', glazePostSchema);
export default glazePost;
