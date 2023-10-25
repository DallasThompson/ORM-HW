const router = require('express').Router();
const { Category, Product } = require('../../models');



router.get('/', async (req, res) => {
  try {
    const category = await Category.findAll({
      include: [{model: Product}],
    });
    
    res.status(200).json(category);
  } catch (err) {
    console.log(err);
    res.status(400).json(err);
  }
});

router.get('/:id', async (req, res) => {
  try {
    const category = await Category.findByPk(req.params.id, {
      include: [{model: Product}]
    });
    (category ? res.status(200).json(category) : res.status(404).json("Id out of range"));
  }catch (err) {
    res.status(400).json(err)
  }
});

router.post('/', async (req, res) => {
  try {
    const category = await Category.create({
        category_name: req.body.category_name
      });
    res.status(200).json(category)
    console.log(category)
  }catch (err) {
    console.log(err);
    res.status(400).json(err)
  }
});

router.put('/:id', async (req, res) => {
  
  try{
    const categoryUpdate = await Category.update(
    {
      category_name: req.body.category_name,
    },
    {
      where: {
        id: req.params.id,
      }
    });
    if (categoryUpdate[0]){
      res.status(200).json(categoryUpdate)
      console.log(`Category at id ${req.params.id} updated`)
    }else{
      res.status(404).json("Id out of range")
    }
  }catch (err) {
    console.log(err);
    res.status(400).json(err)
  }
});

router.delete('/:id', async (req, res) => {
    try {
      const deleteCat = await Category.destroy({
        where: {
          id: req.params.id
        }
      })
      if (deleteCat){
        res.status(200).json(`Deleted id at value: ${req.params.id}`)
        console.log(`Category at id ${req.params.id} deleted`)
      }else{
        res.status(404).json("Id out of range")
      }
    } catch (err) {
        console.log(err);
        res.status(400).json(err)
    }
});

module.exports = router;
