import api from './api';

export const clienteService = {
  // filters is an object with optional properties (nome, cpfCnpj, email, etc.)
  getAll: async (page = 0, size = 10, filters = {}) => {
    const params = { page, size, ...filters };
    const response = await api.get('/clientes', { params });
    return response.data;
  },

  getById: async (id) => {
    const response = await api.get(`/clientes/${id}`);
    return response.data;
  },

  create: async (cliente) => {
    const response = await api.post('/clientes', cliente);
    return response.data;
  },

  update: async (id, cliente) => {
    const response = await api.put(`/clientes/${id}`, cliente);
    return response.data;
  },

  delete: async (id) => {
    await api.delete(`/clientes/${id}`);
  }
};
