// Importación de dependencias necesarias de React y React Router
import React, { useState, useEffect, useMemo } from "react";
import { Helmet } from 'react-helmet-async';
import { toast } from 'react-toastify';
import { Link, useSearchParams } from "react-router-dom";
// Importación de estilos
import './productos.css';
// Importar el contexto del carrito y categorías
import { useCarrito } from '../context/CarritoContext';
import { useCategorias } from '../context/CategoriasContext';
import { useApi } from '../context/ApiContext';

/**
 * Catálogo de Productos
 * 
 * Responsabilidades actualizadas:
 * - Obtener y normalizar productos desde ApiContext.
 * - Filtrar por categoría (?categoria=) y búsqueda reactiva (?q=) por nombre/categoría.
 * - Paginación accesible (?page=) con tamaño fijo (8 por página).
 * - Agregar al carrito con validación de stock y toasts.
 * - SEO per-page con Helmet.
 * - Accesibilidad: aria roles/labels, contador con aria-live.
 */
function Productos() {
    // Obtener funciones del contexto del carrito
    const { agregarAlCarrito } = useCarrito();
    
    // Obtener diccionario de traducción del contexto de categorías
    const { traduccionCategorias } = useCategorias();
    const { getProductos } = useApi();
    
    // Hook para leer parámetros de la URL (query params)
    const [searchParams, setSearchParams] = useSearchParams();
    const categoriaFiltro = searchParams.get('categoria'); // Obtener ?categoria=xxx de la URL
    const queryInicial = searchParams.get('q') || '';
    const pageInicial = parseInt(searchParams.get('page') || '1', 10);
    
    // Estados para manejar los productos y el estado de la aplicación
    const [productos, setProductos] = useState([]); // Almacena la lista de productos
    const [loading, setLoading] = useState(true);   // Controla el estado de carga de datos de la API
    const [error, setError] = useState(null);       // Maneja los errores de la API
    const [query, setQuery] = useState(queryInicial);
    const pageSize = 8;

    // Función para manejar la adición al carrito
    const manejarAgregarCarrito = (producto) => {
        // Verificar que el producto tenga stock disponible
        if (!producto.stock || producto.stock <= 0) {
            toast.warn('Este producto no tiene stock disponible');
            return;
        }
        agregarAlCarrito(producto);
        toast.success(`${producto.nombre} agregado al carrito`);
    };
    // Carga inicial de productos
    useEffect(() => {
        // Función asíncrona para obtener los productos de la API
        const fetchProductos = async () => {
            try {
                const productosNormalizados = await getProductos(traduccionCategorias);
                setProductos(productosNormalizados);
                setError(null);
            } catch (error) {
                console.error('Error al cargar productos:', error);
                setError(`Error al cargar los productos. Código de error: ${error.message}`);
                setProductos([]);
            } finally {
                setLoading(false);
            }
        };

        // Ejecutar la función de fetch
        fetchProductos();
    }, []); 

    // Mantener el estado local del input sincronizado con la URL
    useEffect(() => {
        setQuery(searchParams.get('q') || '');
    }, [searchParams]);
    
    // Filtrado combinado por categoría y búsqueda (memoizado)
    // useMemo: recalcula solo si cambian dependencias, optimizando rendimiento
    const productosFiltrados = useMemo(() => {
        const base = categoriaFiltro 
            ? productos.filter(prod => prod.categoria === categoriaFiltro)
            : productos;
        const q = (searchParams.get('q') || '').trim().toLowerCase();
        if (!q) return base;
        return base.filter(prod =>
            (prod.nombre || '').toLowerCase().includes(q) ||
            (prod.categoria || '').toLowerCase().includes(q)
        );
    }, [productos, categoriaFiltro, searchParams]);

    // Paginación: cálculo de página actual y rebanado de resultados
    const totalProductos = productosFiltrados.length;
    const totalPaginas = Math.max(1, Math.ceil(totalProductos / pageSize));
    const paginaActual = Math.min(Math.max(1, pageInicial), totalPaginas);
    const inicio = (paginaActual - 1) * pageSize;
    const fin = inicio + pageSize;
    const paginaProductos = productosFiltrados.slice(inicio, fin);

    const actualizarParametros = (params) => {
        const nuevos = new URLSearchParams(searchParams);
        Object.entries(params).forEach(([k, v]) => {
            if (v === undefined || v === null || v === '') {
                nuevos.delete(k);
            } else {
                nuevos.set(k, String(v));
            }
        });
        setSearchParams(nuevos);
    };

    const manejarCambioBusqueda = (e) => {
        const valor = e.target.value;
        setQuery(valor);
        actualizarParametros({ q: valor, page: 1 });
    };

    const irAPagina = (p) => {
        const destino = Math.min(Math.max(1, p), totalPaginas);
        actualizarParametros({ page: destino });
    };

    // Renderizado condicional para el estado de carga
    if (loading) {
        return (
            <div className="container py-4">
                <h2>Nuestros Productos</h2>
                <p>Cargando productos...</p>
            </div>
        );
    }

    // Renderizado condicional para el estado de error
    if (error) {
        return (
            <div className="container py-4">
                <h2>Nuestros Productos</h2>
                <div className="alert alert-danger" role="alert">{error}</div>
            </div>
        );
    }

    // Renderizado principal de la lista de productos
    return (
        <div className="container py-4" role="main" aria-labelledby="titulo-productos">
            <Helmet>
              <title>Catálogo de Productos</title>
              <meta name="description" content="Explora nuestro catálogo de productos disponibles por categoría." />
            </Helmet>
            <h2 id="titulo-productos">
                {categoriaFiltro 
                    ? `Productos - ${categoriaFiltro}` 
                    : 'Nuestros Productos'}
            </h2>
            {/* Barra de búsqueda */}
            <div className="row align-items-center g-2 my-3">
                <div className="col-sm-8 col-md-6">
                    <label htmlFor="busqueda" className="form-label visually-hidden">Buscar productos por nombre o categoría</label>
                    <input
                        id="busqueda"
                        type="search"
                        className="form-control"
                        placeholder="Buscar por nombre o categoría..."
                        value={query}
                        onChange={manejarCambioBusqueda}
                        aria-label="Buscar productos por nombre o categoría"
                    />
                </div>
                <div className="col-sm-4 col-md-6 text-sm-end">
                    <div aria-live="polite" className="small text-muted">
                        Mostrando {paginaProductos.length} de {totalProductos} producto(s)
                    </div>
                </div>
            </div>
            {/* Mostrar mensaje si no hay productos en la categoría */}
            {productosFiltrados.length === 0 && !loading && !error ? (
                <div className="my-3">
                    <div className="alert alert-info" role="alert">No hay productos disponibles en esta categoría.</div>
                    <Link to="/productos" className="btn btn-secondary">Ver todos los productos</Link>
                </div>
            ) : (
                <div className="row g-4">
                    {/* Mapear cada producto a una tarjeta */}
                    {paginaProductos.map((prod) => (
                    // map requiere una key única para cada elemento renderizado
                    <div key={prod.id} className="col-sm-6 col-md-4 col-lg-3">
                        <div className="card h-100 shadow-sm">
                            <img
                                src={prod.imagen ? encodeURI(prod.imagen) : 'https://placehold.co/400x300'}
                                alt={`Imagen de ${prod.nombre}`}
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
                                    <Link to={`/productos/${prod.id}`} state={{prod}} className="btn btn-outline-primary">
                                        Ver detalles
                                    </Link>
                                    <button
                                        className="btn btn-primary"
                                        onClick={() => manejarAgregarCarrito(prod)}
                                        disabled={!prod.stock || prod.stock <= 0}
                                        aria-label={prod.stock > 0 ? `Agregar ${prod.nombre} al carrito` : `${prod.nombre} sin stock`}
                                    >
                                        {prod.stock > 0 ? 'Agregar al carrito' : 'Sin stock'}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
                </div>
            )}

            {/* Paginación */}
            {totalPaginas > 1 && (
                <nav className="mt-4 pagination-bar" aria-label="Paginación de productos">
                    <ul className="pagination justify-content-center">
                        <li className={`page-item ${paginaActual === 1 ? 'disabled' : ''}`}>
                            <button className="page-link" onClick={() => irAPagina(paginaActual - 1)} aria-label="Página anterior">&laquo;</button>
                        </li>
                        {Array.from({ length: totalPaginas }).map((_, idx) => {
                            const num = idx + 1;
                            return (
                                <li key={num} className={`page-item ${num === paginaActual ? 'active' : ''}`}>
                                    <button className="page-link" onClick={() => irAPagina(num)} aria-label={`Ir a la página ${num}`}>{num}</button>
                                </li>
                            );
                        })}
                        <li className={`page-item ${paginaActual === totalPaginas ? 'disabled' : ''}`}>
                            <button className="page-link" onClick={() => irAPagina(paginaActual + 1)} aria-label="Página siguiente">&raquo;</button>
                        </li>
                    </ul>
                </nav>
            )}
        </div>
    );
}

export default Productos;