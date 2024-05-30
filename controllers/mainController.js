import Customer from '../models/Customer.js';
import Post from '../models/Post.js'; 
import glazePost from '../models/glazePost.js'; 

export const home = async (req, res) => {
  res.render('index');
};

export const glazes = async (req, res) => {
  const glazePosts = await glazePost.find();
  const posts = await Post.find();
  res.render('glazes', { glazePosts , posts } );
};


export const gallery = async (req, res) => {
  const posts = await Post.find().populate('author');
  res.render('gallery', { posts });
};


/*
export const account = async (req, res) => {
  const posts = await Post.find();
  const customers = await Customer.find();
  res.render('account', { customers , posts } );
};
*/

export const account = async (req, res) => {
  try {
    const userId = req.user._id; // Ensure req.user contains the authenticated user's information
    const userPosts = await Post.find({ author: userId }).populate('author');
const posts = await Post.find();
    res.render('account', {
      user: req.user, // Pass user information if needed
      userPosts: userPosts , posts 
    });
  } catch (error) {
    console.error(error);
    res.status(500).send('An error occurred while fetching user posts.');
  }
};

export const favorites = async (req, res) => {
  res.render('favorites');
};

export const uploadart = async (req, res) => {
  const glazePosts = await glazePost.find();
  res.render('uploadart', { glazePosts } );
};

export const uploadglaze = async (req, res) => {
  res.render('uploadglaze');
};





// Get all glaze posts
export const getAllGlazes = async (req, res) => {
  try {
    console.log("test1");
    const glazes = await glazePost.find();
    res.render('glazes', { glazes });
  } catch (error) {
    res.status(500).send('Error fetching glaze posts');
  }
};

// Get a single glaze post by ID
export const getGlazeById = async (req, res) => {
  const { id } = req.params;
  try {
    console.log("test2");
    const glaze = await glazePost.findById(id);
    if (req.headers['hx-request']) {
      res.render('glazeDetails', { glaze });
    } else {
      res.render('glazes', { action: 'show', glazes: [glaze], glaze });
    }
  } catch (error) {
    res.status(500).send('Error fetching glaze post details');
  }
};

export const searchPosts = async (req, res) => {
  const searchTerm = req.body.searchTerm; // Get the search term from the request body

  try {
    // Find posts that match the search term in title or author's username
    const posts = await Post.find({
      $or: [
        { title: { $regex: searchTerm, $options: 'i' } }, // Case-insensitive regex search for title
        { author: { $in: await Customer.find({ username: { $regex: searchTerm, $options: 'i' } }, '_id') } }
      ]
    }).populate('author');

    res.status(200).json(posts);
  } catch (error) {
    console.error(error);
    res.status(500).send('An error occurred while searching for posts.');
  }
};







export const getProducts = async (req, res) => {
  const { name } = req.body;
  let query = {};

  if (name) {
    query.name = { $regex: name, $options: 'i' }; // Case-insensitive search
  }

  try {
    const products = await Product.find(query).sort({price: -1});
    res.json(products); // Send back JSON response
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).send(error);
  }
};

export const addToCart = async (req, res) => {
  try {
    let { productId, quantity } = req.body;
    quantity = parseInt(quantity);
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).send('Product not found');
    }
    const price = product.price;
  
    const userId = req.user._id;
    let customer = await Customer.findOne({ _id: userId });
    console.log(customer);
    
    const itemIndex = customer.cart.items.findIndex(item => item.productId.toString() === productId);
    if (itemIndex > -1) {
      customer.cart.items[itemIndex].quantity += quantity;
      customer.cart.items[itemIndex].price = price;
      req.flash('update', `Successfully added ${product.name} to cart!`)
    } else {
      customer.cart.items.push({ productId, quantity, price });
    }
    customer.cart.totalQuantity += quantity;
    customer.cart.totalPrice += price * quantity;
    

    await customer.save();
    const populatedCustomer = await Customer.findOne({ _id: userId }).populate('cart.items.productId');
    res.redirect('/showCart');
  } catch (error) {
    console.error(error);
    res.status(500).send('An error occurred');
  }
};

export const showCart = async (req, res) => {
  try {
    const populatedCustomer = await Customer.findOne({ _id: req.user }).populate('cart.items.productId');
    res.render('cart', {user: populatedCustomer});
  } catch (error) {
    console.error(error);
    res.status(500).send('An error occurred');
  }
}


export const purchase = async (req, res) => {
  try {
    const customer = await Customer.findOne({ _id: req.user }).populate('cart.items.productId');

    const cartItems = customer.cart.items;

    cartItems.forEach(cartItem => {
      const { productId, quantity, price } = cartItem; 
      
      const itemIndex = customer.purchases.items.findIndex(purchaseItem => purchaseItem.productId.toString() === productId.toString());

      if (itemIndex > -1) {
        customer.purchases.items[itemIndex].quantity += quantity;
        customer.purchases.items[itemIndex].price = price;
     req.flash('update', `Successfully purchased items!`)   
      } else {
        customer.purchases.items.push({ productId: productId, quantity: quantity, price: price });
      }
      
      customer.purchases.totalQuantity += quantity;
      customer.purchases.totalPrice += price * quantity;
    });

    await customer.save();
    res.redirect('/clearCart'); 
  } catch (error) {
    console.error(error);
    res.status(500).send('An error occurred');
  }
};

export const customer = async (req, res) => {
  try {
    const customer = await Customer.findOne({ _id: req.user }).populate('purchases.items.productId');

    res.render('customer', {user: customer}); 
  } catch (error) {
    console.error(error);
    res.status(500).send('An error occurred');
  }
}

export const clearCart = async (req, res) => {
  try {
    const customer = await Customer.findOne({ _id: req.user });
    customer.cart = { items: [], totalQuantity: 0, totalPrice: 0 };
    customer.save();
    req.flash('update', `Cleared cart`)
    res.redirect('/showCart');
  } catch (error) {
    console.error(error);
    res.status(500).send('An error occurred');
  }
}

export const deleteItem = async (req, res) => {
  console.log("check");
  try {
    let productId = req.params.productId;
    console.log(productId);
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).send('Product not found');
    }
    const userId = req.user._id;
    let customer = await Customer.findOne({ _id: userId });
    console.log(customer);
    if (customer.cart) {
      const itemIndex = customer.cart.items.findIndex(item => item.productId.toString() === productId);
      if (itemIndex > -1) { // only splice array when item is found
        let quantity = customer.cart.items[itemIndex].quantity;
        let price = customer.cart.items[itemIndex].price;
        customer.cart.items.splice(itemIndex, 1); // 2nd parameter means remove one item only
        customer.cart.totalQuantity -= quantity;
        customer.cart.totalPrice -= price * quantity;
      } 
      
    } 

    await customer.save();
    req.flash('update', `Deleted ${product.name} from cart!`)
    res.redirect('/showCart');
  } catch (error) {
    console.error(error);
    res.status(500).send('An error occurred');
  }
};






export const filterProducts = async (req, res) => {
  const { type, minPrice, maxPrice, freeShipping } = req.body;
  let query = {};

  if (type != "all") {
    query.type = type; 
  };
  
  if (maxPrice > 100){
    maxPrice = 100;
  };
  
  if (minPrice >= maxPrice){
    minPrice = maxPrice;
  };

  if (minPrice && maxPrice){
     query.price = { $gte: minPrice, $lte: maxPrice };
  };
  
  if(freeShipping) {
    query.shipping = 0;
  };

  try {
    const products = await Product.find(query).sort({price: -1});
    res.json(products); // Send back JSON response
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).send(error);
  }
};





