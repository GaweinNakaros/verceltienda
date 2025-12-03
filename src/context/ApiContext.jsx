import React, { createContext, useContext } from 'react';

// Endpoint base de la API (MockAPI)
const API_BASE = 'https://68d482fa214be68f8c696bbd.mockapi.io/api';

const ApiContext = createContext();

export const useApi = () => {
  const ctx = useContext(ApiContext);
  if (!ctx) throw new Error('useApi debe ser usado dentro de ApiProvider');
  return ctx;
};

export const ApiProvider = ({ children }) => {
  // Obtiene todos los productos y normaliza campos
  const getProductos = async (traduccionCategorias = {}) => {
    const resp = await fetch(`${API_BASE}/productos`);
    if (!resp.ok) throw new Error(`Error HTTP: ${resp.status}`);
    const data = await resp.json();
    return data.map((producto) => ({
      ...producto,
      stock: Number(producto.stock || 0),
      categoria: traduccionCategorias[producto.categoria] || producto.categoria || 'Sin categoría',
    }));
  };

  // Crear un nuevo producto
  const createProduct = async (producto) => {
    const resp = await fetch(`${API_BASE}/productos`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(producto),
    });
    if (!resp.ok) throw new Error(`Error al crear producto (HTTP ${resp.status})`);
    return resp.json();
  };

  // Actualizar producto existente
  const updateProduct = async (id, cambios) => {
    const resp = await fetch(`${API_BASE}/productos/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(cambios),
    });
    if (!resp.ok) throw new Error(`Error al actualizar producto ${id} (HTTP ${resp.status})`);
    return resp.json();
  };

  // Eliminar producto por id
  const deleteProduct = async (id) => {
    const resp = await fetch(`${API_BASE}/productos/${id}`, {
      method: 'DELETE',
    });
    if (!resp.ok) throw new Error(`Error al eliminar producto ${id} (HTTP ${resp.status})`);
    return resp.json();
  };

  // Actualiza stock en la API para una compra
  // items: Array de { productoId, cantidad }
  const actualizarStock = async (items) => {
    // Estrategia: para cada item, obtener producto actual y hacer PUT/PATCH con nuevo stock
    // Nota: MockAPI no soporta transacciones; se actualiza uno por uno
    const resultados = [];
    for (const item of items) {
      const { productoId, cantidad } = item;
      // Obtener producto actual
      const prodResp = await fetch(`${API_BASE}/productos/${productoId}`);
      if (!prodResp.ok) throw new Error(`No se pudo obtener producto ${productoId}`);
      const prod = await prodResp.json();
      const stockActual = Number(prod.stock || 0);
      const stockNuevo = Math.max(stockActual - Number(cantidad || 0), 0);

      const updateResp = await fetch(`${API_BASE}/productos/${productoId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...prod, stock: stockNuevo }),
      });
      if (!updateResp.ok) throw new Error(`Error al actualizar stock de ${productoId}`);
      const updated = await updateResp.json();
      resultados.push(updated);
    }
    return resultados;
  };

  const value = {
    getProductos,
    actualizarStock,
    createProduct,
    updateProduct,
    deleteProduct,
    API_BASE,
  };

  return <ApiContext.Provider value={value}>{children}</ApiContext.Provider>;
};
