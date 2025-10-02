const OrderService = require('./orders.service');

class OrderController {
  async create(req, res) {
    try {
      const order = await OrderService.create(req.body);
      res.status(201).json({
        success: true,
        message: 'Pedido criado com sucesso',
        data: order
      });
    } catch (error) {
      console.error('Erro ao criar pedido:', error);
      
      // Tratamento específico de erros de validação
      if (error.message.includes('obrigatório') || 
          error.message.includes('válido') || 
          error.message.includes('quantidade') ||
          error.message.includes('inteiro') ||
          error.message.includes('maior que zero')) {
        return res.status(400).json({ 
          success: false,
          error: 'Dados inválidos', 
          message: error.message 
        });
      }
      
      // Tratamento de erros de recursos não encontrados
      if (error.message.includes('não encontrado') || 
          error.message.includes('inativos')) {
        return res.status(404).json({ 
          success: false,
          error: 'Recurso não encontrado', 
          message: error.message 
        });
      }
      
      // Tratamento de erros de duplicação
      if (error.message.includes('duplicação')) {
        return res.status(409).json({ 
          success: false,
          error: 'Conflito de dados', 
          message: error.message 
        });
      }
      
      // Erro interno do servidor
      res.status(500).json({ 
        success: false,
        error: 'Erro interno do servidor',
        message: 'Ocorreu um erro inesperado ao processar sua solicitação'
      });
    }
  }

  async findAll(req, res) {
    try {
      const { status } = req.query;
      const orders = await OrderService.findAll(status);
      res.json({
        success: true,
        data: orders,
        count: orders.length
      });
    } catch (error) {
      console.error('Erro ao buscar pedidos:', error);
      res.status(500).json({ 
        success: false,
        error: 'Erro interno do servidor',
        message: 'Erro ao buscar pedidos'
      });
    }
  }

  async findOne(req, res) {
    try {
      const { id } = req.params;
      const order = await OrderService.findOne(id);
      
      if (!order) {
        return res.status(404).json({ 
          success: false,
          error: 'Pedido não encontrado',
          message: `Pedido com ID ${id} não foi encontrado`
        });
      }
      
      res.json({
        success: true,
        data: order
      });
    } catch (error) {
      console.error('Erro ao buscar pedido:', error);
      res.status(500).json({ 
        success: false,
        error: 'Erro interno do servidor',
        message: 'Erro ao buscar pedido'
      });
    }
  }

  async update(req, res) {
    try {
      const { id } = req.params;
      const order = await OrderService.update(id, req.body);
      
      if (!order) {
        return res.status(404).json({ 
          success: false,
          error: 'Pedido não encontrado',
          message: `Pedido com ID ${id} não foi encontrado`
        });
      }
      
      res.json({
        success: true,
        message: 'Pedido atualizado com sucesso',
        data: order
      });
    } catch (error) {
      console.error('Erro ao atualizar pedido:', error);
      
      if (error.message.includes('not found') || error.message.includes('não encontrado')) {
        return res.status(404).json({ 
          success: false,
          error: 'Pedido não encontrado', 
          message: error.message 
        });
      }
      
      res.status(500).json({ 
        success: false,
        error: 'Erro interno do servidor',
        message: 'Erro ao atualizar pedido'
      });
    }
  }

  async updateStatus(req, res) {
    try {
      const { id } = req.params;
      const { status } = req.body;
      const order = await OrderService.updateStatus(id, status);
      
      if (!order) {
        return res.status(404).json({ 
          success: false,
          error: 'Pedido não encontrado',
          message: `Pedido com ID ${id} não foi encontrado`
        });
      }
      
      res.json({
        success: true,
        message: 'Status do pedido atualizado com sucesso',
        data: order
      });
    } catch (error) {
      console.error('Erro ao atualizar status do pedido:', error);
      
      if (error.message.includes('not found') || error.message.includes('não encontrado')) {
        return res.status(404).json({ 
          success: false,
          error: 'Pedido não encontrado', 
          message: error.message 
        });
      }
      
      if (error.message.includes('invalid') || error.message.includes('inválido')) {
        return res.status(400).json({ 
          success: false,
          error: 'Status inválido', 
          message: error.message 
        });
      }
      
      res.status(500).json({ 
        success: false,
        error: 'Erro interno do servidor',
        message: 'Erro ao atualizar status do pedido'
      });
    }
  }

  async delete(req, res) {
    try {
      const { id } = req.params;
      const deleted = await OrderService.delete(id);
      
      if (!deleted) {
        return res.status(404).json({ 
          success: false,
          error: 'Pedido não encontrado',
          message: `Pedido com ID ${id} não foi encontrado`
        });
      }
      
      res.json({
        success: true,
        message: 'Pedido excluído com sucesso'
      });
    } catch (error) {
      console.error('Erro ao excluir pedido:', error);
      
      if (error.message.includes('not found') || error.message.includes('não encontrado')) {
        return res.status(404).json({ 
          success: false,
          error: 'Pedido não encontrado', 
          message: error.message 
        });
      }
      
      res.status(500).json({ 
        success: false,
        error: 'Erro interno do servidor',
        message: 'Erro ao excluir pedido'
      });
    }
  }
}

module.exports = new OrderController();