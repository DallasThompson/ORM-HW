const router = require('express').Router();
const { Tag, Product, ProductTag } = require('../../models');

router.get('/', async (req, res) => {
  try {
    const tag = await Tag.findAll({
      include: [{model: Product}],
    });
    
    res.status(200).json(tag);
  } catch (err) {
    console.log(err);
    res.status(400).json(err);
  }
});

router.get('/:id', async (req, res) => {
  try {
    const tagId = await Tag.findByPk(req.params.id, {
      include: [{model: Product}]
    });
    (tagId ? res.status(200).json(tagId) : res.status(404).json("Id out of range"));
  }catch (err) {
    res.status(400).json(err)
  }
});

router.post('/', (req, res) => {
  Tag.create({
    tag_name: req.body.tag_name,

  }).then((data)=> {
    if (req.body.prodIds.length) {
          const productTagIdArr = req.body.prodIds.map((prod_id) => {
            return {
              product_id: prod_id,
              tag_id: data.id,
            };
          });
          return ProductTag.bulkCreate(productTagIdArr);
  }
  res.status(200).json(data);
})
.then((productTagIds) => res.status(200).json(productTagIds))
  .catch((err) => {
    console.log(err);
    res.status(400).json(err);
  });
});


router.put('/:id', async (req, res) => {
  try {
    const updateTag = await Tag.update({
      tag_name: req.body.tag_name
    },
    {
      where: {
        id: req.params.id
      }
    })
    
    if (updateTag[0]) {
      res.status(200).json("Tag updated successfully")
    } else {
      res.status(404).json("id out of range")
    }
  }catch (err) {
    console.log(err);
    res.status(400).json(err)
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const deleteTag = await Tag.destroy({
      where: {
        id: req.params.id
      }
    })
    if (deleteTag){
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
