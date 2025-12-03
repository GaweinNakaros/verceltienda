import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { toast } from 'react-toastify';
import { useApi } from '../context/ApiContext';
import { useCategorias } from '../context/CategoriasContext';
import './productos.css';

// Página de administración de productos (solo admin)
// Responsabilidades actualizadas:
// - CRUD de productos con validaciones y feedback mediante toasts.
// - Carga inicial desde ApiContext con traducción de categorías.
// - Formulario controlado (crear/editar) y listado en tarjetas Bootstrap.
// - Confirmación de eliminación mediante modal simple.
// - SEO por página con Helmet y accesibilidad en contenedores.
function AdminProductos() {
  const { getProductos, createProduct, updateProduct, deleteProduct } = useApi();
  const { traduccionCategorias } = useCategorias();

  const [productos, setProductos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [form, setForm] = useState({
    nombre: '',
    precio: '',
    descripcion: '',
    imagen: '',
    categoria: '',
    stock: ''
  });
  const [editId, setEditId] = useState(null);
  const [formError, setFormError] = useState('');
  const [accionCargando, setAccionCargando] = useState(false);
  const [eliminarId, setEliminarId] = useState(null); // para modal de confirmación

  // Cargar productos iniciales desde la API
  useEffect(() => {
    const cargar = async () => {
      try {
        const data = await getProductos(traduccionCategorias);
        setProductos(data);
      } catch (e) {
        setError(`Error al obtener productos: ${e.message}`);
        toast.error('Error al obtener productos');
      } finally {
        setLoading(false);
      }
    };
    cargar();
  }, [getProductos, traduccionCategorias]);

  // Validar formulario: campos obligatorios y formatos
  const validar = () => {
    if (!form.nombre.trim()) return 'El nombre es obligatorio';
    const precioNum = Number(form.precio);
    if (isNaN(precioNum) || precioNum <= 0) return 'El precio debe ser mayor a 0';
    if (!form.descripcion.trim() || form.descripcion.trim().length < 10) return 'La descripción debe tener al menos 10 caracteres';
    const stockNum = Number(form.stock);
    if (isNaN(stockNum) || stockNum < 0) return 'El stock debe ser un número >= 0';
    return '';
  };

  const manejarCambio = (e) => {
    const { name, value } = e.target;
    setForm(f => ({ ...f, [name]: value }));
    if (formError) setFormError('');
  };

  const resetForm = () => {
    setForm({ nombre: '', precio: '', descripcion: '', imagen: '', categoria: '', stock: '' });
    setEditId(null);
    setFormError('');
  };

  const manejarSubmit = async (e) => {
    e.preventDefault();
    const err = validar();
    if (err) {
      setFormError(err);
      return;
    }
    setAccionCargando(true);
    try {
      if (editId) {
        const actualizado = await updateProduct(editId, {
          nombre: form.nombre,
          precio: Number(form.precio),
          descripcion: form.descripcion,
          imagen: form.imagen,
          categoria: form.categoria,
          stock: Number(form.stock)
        });
        setProductos(prev => prev.map(p => p.id === editId ? { ...actualizado, stock: Number(actualizado.stock || 0) } : p));
      } else {
        const creado = await createProduct({
          nombre: form.nombre,
          precio: Number(form.precio),
          descripcion: form.descripcion,
          imagen: form.imagen,
          categoria: form.categoria,
          stock: Number(form.stock)
        });
        setProductos(prev => [...prev, { ...creado, stock: Number(creado.stock || 0) }]);
      }
      resetForm();
      toast.success(editId ? 'Producto actualizado' : 'Producto creado');
    } catch (e) {
      setFormError(`Error en la operación: ${e.message}`);
    } finally {
      setAccionCargando(false);
    }
  };

  const iniciarEdicion = (prod) => {
    setEditId(prod.id);
    setForm({
      nombre: prod.nombre || '',
      precio: prod.precio || '',
      descripcion: prod.descripcion || '',
      imagen: prod.imagen || '',
      categoria: prod.categoria || '',
      stock: prod.stock || ''
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const confirmarEliminar = (id) => setEliminarId(id);
  const cancelarEliminar = () => setEliminarId(null);

  const ejecutarEliminar = async () => {
    if (!eliminarId) return;
    setAccionCargando(true);
    try {
      await deleteProduct(eliminarId);
      setProductos(prev => prev.filter(p => p.id !== eliminarId));
      cancelarEliminar();
    } catch (e) {
      toast.error('Error al eliminar producto');
    } finally {
      setAccionCargando(false);
    }
  };

  if (loading) {
    return <div className="productos-container" role="main"><h2>Administrar Productos</h2><p>Cargando...</p></div>;
  }

  return (
    <div className="productos-container" role="main" aria-labelledby="titulo-admin-productos">
      <Helmet>
        <title>Administrar Productos</title>
        <meta name="description" content="Panel de administración para crear, editar y eliminar productos." />
      </Helmet>
      <h2 id="titulo-admin-productos">Administrar Productos {editId ? '(Editar)' : '(Nuevo)'}</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}

      <form className="mb-4 bg-light p-3 rounded shadow-sm" onSubmit={manejarSubmit}>
        <div className="row g-3 mb-2">
          <div className="col-md-4">
            <label className="form-label">Nombre *</label>
            <input name="nombre" className="form-control" placeholder="Ej: Mouse Gamer" value={form.nombre} onChange={manejarCambio} />
          </div>
          <div className="col-md-4">
            <label className="form-label">Precio *</label>
            <input name="precio" type="number" className="form-control" placeholder="Ej: 199.99" value={form.precio} onChange={manejarCambio} />
          </div>
          <div className="col-md-4">
            <label className="form-label">Stock *</label>
            <input name="stock" type="number" className="form-control" placeholder="Ej: 25" value={form.stock} onChange={manejarCambio} />
          </div>
        </div>
        <div className="row g-3 mb-2">
          <div className="col-md-6">
            <label className="form-label">Categoría</label>
            <input name="categoria" className="form-control" placeholder="Ej: perifericos" value={form.categoria} onChange={manejarCambio} />
          </div>
          <div className="col-md-6">
            <label className="form-label">URL Imagen</label>
            <input name="imagen" className="form-control" placeholder="https://..." value={form.imagen} onChange={manejarCambio} />
          </div>
        </div>
        <div className="mb-3">
          <label className="form-label">Descripción *</label>
          <textarea name="descripcion" className="form-control" placeholder="Descripción (mínimo 10 caracteres)" value={form.descripcion} onChange={manejarCambio} rows={3} />
          <div className="form-text">Incluye detalles clave del producto.</div>
        </div>
        {formError && <div className="alert alert-danger py-2 mb-3" role="alert">{formError}</div>}
        <div className="d-flex gap-2">
          <button type="submit" className="btn btn-primary" disabled={accionCargando}>{accionCargando ? 'Guardando...' : (editId ? 'Actualizar' : 'Crear')}</button>
          {editId && <button type="button" className="btn btn-secondary" onClick={resetForm}>Cancelar</button>}
        </div>
      </form>

      <h3>Listado</h3>
      {productos.length === 0 ? (
        <p>No hay productos.</p>
      ) : (
        <div className="row g-4">
          {productos.map(prod => (
            <div key={prod.id} className="col-sm-6 col-md-4 col-lg-3">
              <div className="card h-100 shadow-sm">
                <img
                  src={prod.imagen ? encodeURI(prod.imagen) : 'https://placehold.co/400x300'}
                  alt={prod.nombre}
                  className="card-img-top"
                  onError={(e) => { e.target.src = 'https://placehold.co/400x300'; }}
                />
                <div className="card-body d-flex flex-column">
                  <h5 className="card-title mb-2">{prod.nombre}</h5>
                  <p className="text-muted text-uppercase small mb-2">{prod.categoria}</p>
                  <p className="card-text flex-grow-1 mb-3">{prod.descripcion}</p>
                  <div className="d-flex align-items-center gap-2 mb-3">
                    <span className="badge bg-primary">${parseFloat(prod.precio || 0).toFixed(2)}</span>
                    <span className={`badge ${prod.stock > 0 ? 'bg-success' : 'bg-secondary'}`}>
                      {prod.stock > 0 ? `Stock: ${prod.stock}` : 'Sin stock'}
                    </span>
                  </div>
                  <div className="d-flex gap-2 mt-auto">
                    <button className="btn btn-outline-primary" onClick={() => iniciarEdicion(prod)}>Editar</button>
                    <button className="btn btn-outline-danger" onClick={() => confirmarEliminar(prod.id)}>Eliminar</button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {eliminarId && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h4>Confirmar eliminación</h4>
            <p>¿Seguro que deseas eliminar este producto?</p>
            <div style={{ display:'flex', gap:'10px', justifyContent:'center' }}>
              <button className="btn-agregar" onClick={ejecutarEliminar} disabled={accionCargando}>{accionCargando ? 'Eliminando...' : 'Sí, eliminar'}</button>
              <button className="btn-detalle" onClick={cancelarEliminar}>Cancelar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminProductos;
