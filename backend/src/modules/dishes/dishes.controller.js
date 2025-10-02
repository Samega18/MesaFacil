const DishService = require('./dishes.service');

class DishController {
  async create(req, res) {
    try {
      const dish = await DishService.create(req.body);
      res.status(201).json(dish);
    } catch (error) {
      console.error('Error creating dish:', error);
      
      if (error.message.includes('already exists') || error.message.includes('já existe') || error.message.includes('Já existe')) {
        return res.status(409).json({ 
          error: 'Conflito', 
          message: error.message,
          code: 'DISH_ALREADY_EXISTS'
        });
      }
      if (error.message.includes('invalid') || error.message.includes('inválido') || error.message.includes('Dados inválidos')) {
        return res.status(400).json({ 
          error: 'Dados inválidos', 
          message: error.message,
          code: 'VALIDATION_ERROR'
        });
      }
      res.status(500).json({ 
        error: 'Erro interno do servidor', 
        message: 'Ocorreu um erro inesperado ao criar o prato',
        code: 'INTERNAL_ERROR'
      });
    }
  }

  async findAll(req, res) {
    try {
      const dishes = await DishService.findAll();
      res.json(dishes);
    } catch (error) {
      console.error('Error fetching dishes:', error);
      res.status(500).json({ 
        error: 'Erro interno do servidor', 
        message: 'Não foi possível carregar a lista de pratos',
        code: 'FETCH_ERROR'
      });
    }
  }

  async findOne(req, res) {
    try {
      const { id } = req.params;
      const dish = await DishService.findOne(id);
      
      if (!dish) {
        return res.status(404).json({ 
          error: 'Prato não encontrado', 
          message: 'O prato solicitado não foi encontrado',
          code: 'DISH_NOT_FOUND'
        });
      }
      
      res.json(dish);
    } catch (error) {
      console.error('Error fetching dish:', error);
      res.status(500).json({ 
        error: 'Erro interno do servidor', 
        message: 'Não foi possível carregar o prato',
        code: 'FETCH_ERROR'
      });
    }
  }

  async update(req, res) {
    try {
      const { id } = req.params;
      const dish = await DishService.update(id, req.body);
      
      res.json(dish);
    } catch (error) {
      console.error('Error updating dish:', error);
      
      if (error.message.includes('not found') || error.message.includes('não encontrado')) {
        return res.status(404).json({ 
          error: 'Prato não encontrado', 
          message: error.message,
          code: 'DISH_NOT_FOUND'
        });
      }
      if (error.message.includes('already exists') || error.message.includes('já existe')) {
        return res.status(409).json({ 
          error: 'Conflito', 
          message: error.message,
          code: 'DISH_ALREADY_EXISTS'
        });
      }
      if (error.message.includes('invalid') || error.message.includes('inválido') || error.message.includes('Dados inválidos')) {
        return res.status(400).json({ 
          error: 'Dados inválidos', 
          message: error.message,
          code: 'VALIDATION_ERROR'
        });
      }
      res.status(500).json({ 
        error: 'Erro interno do servidor', 
        message: 'Ocorreu um erro inesperado ao atualizar o prato',
        code: 'INTERNAL_ERROR'
      });
    }
  }

  async delete(req, res) {
    try {
      const { id } = req.params;
      await DishService.delete(id);
      
      res.status(204).send();
    } catch (error) {
      console.error('Error deleting dish:', error);
      
      if (error.message.includes('not found') || error.message.includes('não encontrado')) {
        return res.status(404).json({ 
          error: 'Prato não encontrado', 
          message: error.message,
          code: 'DISH_NOT_FOUND'
        });
      }
      if (error.message.includes('cannot be deleted') || error.message.includes('não pode ser deletado') || error.message.includes('pedidos associados')) {
        return res.status(409).json({ 
          error: 'Conflito', 
          message: error.message,
          code: 'DISH_HAS_ORDERS'
        });
      }
      res.status(500).json({ 
        error: 'Erro interno do servidor', 
        message: 'Ocorreu um erro inesperado ao deletar o prato',
        code: 'INTERNAL_ERROR'
      });
    }
  }
}

module.exports = new DishController();