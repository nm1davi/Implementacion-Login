import { Router } from 'express';
import productModel from '../models/product.model.js'


const router = Router();

//GET DE PROFILE
router.get('/profile', async (req, res) => {
  if(!req.session.user){
    return res.redirect('login');
  }
  try {
    const productos = await productModel.find({});
    const formattedProducts = productos.map(product => ({
      title: product.title,
      description: product.description,
      price: product.price,
      thumbnail: product.thumbnail,
      code: product.code,
      stock: product.stock,
      category: product.category,
      status: product.status
    }));
    res.render('profile',{title: 'Profile ✅', user: req.session.user, products: formattedProducts});
  } catch (error) {
    console.error('Error al obtener productos:', error);
    res.render('error', { title: 'Error ❌', messageError: 'Error al obtener productos' });
  }
});

//GET DE LOGIN
router.get('', (req, res) => {
  res.render('login',{title: 'Login ✅'})
});

//GET DE REGISTER
router.get('/register', (req, res) => {
  res.render('register',{title: 'Register ✅'})
});


export default router;