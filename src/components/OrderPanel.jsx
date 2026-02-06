import { useState } from 'react';
import {
  ShoppingCart,
  Send,
  PackageCheck,
  Trash2,
  AlertTriangle,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import { useInventory } from '../context/InventoryContext';
import { ORDER_STATUS } from '../data/categories';

export default function OrderPanel() {
  const { state, dispatch } = useInventory();
  const [expandedOrder, setExpandedOrder] = useState(null);

  const supplierMap = Object.fromEntries(
    state.suppliers.map((s) => [s.id, s])
  );

  // Materials with low stock grouped by supplier
  const lowStockMaterials = state.materials.filter(
    (m) => m.quantity <= m.minStock && m.minStock > 0
  );

  const lowStockBySupplier = lowStockMaterials.reduce((acc, m) => {
    const key = m.supplierId || 'sin-proveedor';
    if (!acc[key]) acc[key] = [];
    acc[key].push(m);
    return acc;
  }, {});

  function createOrder(supplierId, materials) {
    const items = materials.map((m) => ({
      materialId: m.id,
      name: m.name,
      quantity: m.minStock * 2 - m.quantity, // order enough to reach 2x minimum
      unit: m.unit,
      price: m.price,
    }));

    const supplier = supplierMap[supplierId];
    dispatch({
      type: 'CREATE_ORDER',
      payload: {
        supplierId,
        supplierName: supplier?.name || 'Sin proveedor',
        items,
        total: items.reduce((sum, i) => sum + i.quantity * i.price, 0),
      },
    });
  }

  function generateWhatsAppMessage(order) {
    const supplier = supplierMap[order.supplierId];
    let msg = `Hola${supplier ? ' ' + supplier.name : ''}, necesitamos pedir:\n\n`;
    order.items.forEach((item) => {
      msg += `- ${item.name}: ${item.quantity} ${item.unit}\n`;
    });
    msg += `\nTotal estimado: ${order.total.toFixed(2)} €\n`;
    msg += `\nGracias, TSO`;
    return encodeURIComponent(msg);
  }

  function generateEmailBody(order) {
    const supplier = supplierMap[order.supplierId];
    let body = `Estimados,\n\nNecesitamos realizar el siguiente pedido:\n\n`;
    order.items.forEach((item) => {
      body += `- ${item.name}: ${item.quantity} ${item.unit} (${(item.quantity * item.price).toFixed(2)} €)\n`;
    });
    body += `\nTotal estimado: ${order.total.toFixed(2)} €\n`;
    body += `\nRuego confirmación de disponibilidad y plazo de entrega.\n\nUn saludo,\nTSO`;
    return encodeURIComponent(body);
  }

  function handleMarkReceived(orderId) {
    dispatch({ type: 'MARK_ORDER_RECEIVED', payload: orderId });
  }

  function handleSendOrder(orderId) {
    dispatch({
      type: 'UPDATE_ORDER_STATUS',
      payload: { id: orderId, status: 'sent' },
    });
  }

  return (
    <div className="orders-section">
      {/* Low stock alerts with quick order */}
      {Object.keys(lowStockBySupplier).length > 0 && (
        <div className="low-stock-orders">
          <h3>
            <AlertTriangle size={16} /> Material por pedir
          </h3>
          {Object.entries(lowStockBySupplier).map(([supplierId, materials]) => {
            const supplier = supplierMap[supplierId];
            return (
              <div key={supplierId} className="order-suggestion">
                <div className="order-suggestion-header">
                  <span className="order-suggestion-supplier">
                    {supplier?.name || 'Sin proveedor asignado'}
                  </span>
                  <span className="order-suggestion-count">
                    {materials.length} artículo{materials.length > 1 ? 's' : ''}
                  </span>
                </div>
                <ul className="order-suggestion-items">
                  {materials.map((m) => (
                    <li key={m.id}>
                      <strong>{m.name}</strong> — quedan {m.quantity} {m.unit} (mín: {m.minStock})
                    </li>
                  ))}
                </ul>
                {supplierId !== 'sin-proveedor' && (
                  <button
                    className="btn btn-primary"
                    onClick={() => createOrder(supplierId, materials)}
                  >
                    <ShoppingCart size={15} /> Crear pedido
                  </button>
                )}
              </div>
            );
          })}
        </div>
      )}

      {Object.keys(lowStockBySupplier).length === 0 && state.orders.length === 0 && (
        <div className="empty-state">
          <p>Todo el stock está en orden. No hay pedidos pendientes.</p>
        </div>
      )}

      {/* Order history */}
      {state.orders.length > 0 && (
        <div className="orders-history">
          <h3>Pedidos ({state.orders.length})</h3>
          {state.orders.map((order) => {
            const statusInfo = ORDER_STATUS[order.status];
            const isExpanded = expandedOrder === order.id;
            const supplier = supplierMap[order.supplierId];

            return (
              <div key={order.id} className="order-card">
                <div
                  className="order-card-header"
                  onClick={() => setExpandedOrder(isExpanded ? null : order.id)}
                >
                  <div className="order-card-info">
                    <span
                      className="order-status-badge"
                      style={{ backgroundColor: statusInfo.color }}
                    >
                      {statusInfo.label}
                    </span>
                    <strong>{order.supplierName}</strong>
                    <span className="text-muted">{order.date}</span>
                  </div>
                  <div className="order-card-right">
                    <span className="order-total">{order.total.toFixed(2)} €</span>
                    {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                  </div>
                </div>

                {isExpanded && (
                  <div className="order-card-body">
                    <table className="order-items-table">
                      <thead>
                        <tr>
                          <th>Material</th>
                          <th>Cantidad</th>
                          <th>Precio</th>
                        </tr>
                      </thead>
                      <tbody>
                        {order.items.map((item, i) => (
                          <tr key={i}>
                            <td>{item.name}</td>
                            <td>{item.quantity} {item.unit}</td>
                            <td>{(item.quantity * item.price).toFixed(2)} €</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>

                    <div className="order-actions">
                      {order.status === 'pending' && (
                        <>
                          {supplier?.email && (
                            <a
                              className="btn btn-secondary"
                              href={`mailto:${supplier.email}?subject=Pedido TSO&body=${generateEmailBody(order)}`}
                            >
                              <Mail size={15} /> Email
                            </a>
                          )}
                          {supplier?.phone && (
                            <a
                              className="btn btn-secondary"
                              href={`https://wa.me/${supplier.phone.replace(/\s/g, '')}?text=${generateWhatsAppMessage(order)}`}
                              target="_blank"
                              rel="noreferrer"
                            >
                              <Send size={15} /> WhatsApp
                            </a>
                          )}
                          <button
                            className="btn btn-primary"
                            onClick={() => handleSendOrder(order.id)}
                          >
                            <Send size={15} /> Marcar enviado
                          </button>
                        </>
                      )}
                      {order.status === 'sent' && (
                        <button
                          className="btn btn-primary"
                          onClick={() => handleMarkReceived(order.id)}
                        >
                          <PackageCheck size={15} /> Recibido (actualizar stock)
                        </button>
                      )}
                      {(order.status === 'received' || order.status === 'cancelled') && (
                        <button
                          className="btn btn-secondary"
                          onClick={() => dispatch({ type: 'DELETE_ORDER', payload: order.id })}
                        >
                          <Trash2 size={15} /> Eliminar
                        </button>
                      )}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

function Mail({ size }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect width="20" height="16" x="2" y="4" rx="2" />
      <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
    </svg>
  );
}
