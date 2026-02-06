import { useState } from 'react';
import {
  ShoppingCart,
  Send,
  PackageCheck,
  Trash2,
  AlertTriangle,
  ChevronDown,
  ChevronUp,
  Mail,
  Copy,
  Check,
} from 'lucide-react';
import { useInventory } from '../context/InventoryContext';
import { ORDER_STATUS } from '../data/categories';

export default function OrderPanel() {
  const { state, dispatch } = useInventory();
  const [expandedOrder, setExpandedOrder] = useState(null);
  const [selectedSupplier, setSelectedSupplier] = useState('');
  const [copiedId, setCopiedId] = useState(null);

  const supplierMap = Object.fromEntries(
    state.suppliers.map((s) => [s.id, s])
  );

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
    const resolvedId = supplierId === 'sin-proveedor' ? selectedSupplier : supplierId;
    if (!resolvedId) return;

    const items = materials.map((m) => ({
      materialId: m.id,
      name: m.name,
      quantity: Math.max(1, m.minStock * 2 - m.quantity),
      unit: m.unit,
      price: m.price,
    }));

    const supplier = supplierMap[resolvedId];
    dispatch({
      type: 'CREATE_ORDER',
      payload: {
        supplierId: resolvedId,
        supplierName: supplier?.name || 'Proveedor',
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
    msg += `\nTotal estimado: ${order.total.toFixed(2)} €\nGracias, TSO`;
    return encodeURIComponent(msg);
  }

  function generateEmailText(order) {
    let body = `Estimados,\n\nNecesitamos realizar el siguiente pedido:\n\n`;
    order.items.forEach((item) => {
      body += `- ${item.name}: ${item.quantity} ${item.unit} (${(item.quantity * item.price).toFixed(2)} €)\n`;
    });
    body += `\nTotal estimado: ${order.total.toFixed(2)} €\n\nUn saludo,\nTSO`;
    return body;
  }

  function getGmailLink(order) {
    const supplier = supplierMap[order.supplierId];
    const to = supplier?.email || '';
    const subject = encodeURIComponent('Pedido TSO');
    const body = encodeURIComponent(generateEmailText(order));
    return `https://mail.google.com/mail/?view=cm&to=${to}&su=${subject}&body=${body}`;
  }

  function handleCopyOrder(order) {
    const text = generateEmailText(order);
    navigator.clipboard.writeText(text).then(() => {
      setCopiedId(order.id);
      setTimeout(() => setCopiedId(null), 2000);
    });
  }

  return (
    <div className="orders-section">
      {Object.keys(lowStockBySupplier).length > 0 && (
        <div className="low-stock-orders">
          <h3><AlertTriangle size={16} /> Material por pedir</h3>
          {Object.entries(lowStockBySupplier).map(([supplierId, materials]) => {
            const supplier = supplierMap[supplierId];
            const isUnassigned = supplierId === 'sin-proveedor';

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
                <div className="order-suggestion-actions">
                  {isUnassigned && state.suppliers.length > 0 && (
                    <select
                      className="category-select"
                      value={selectedSupplier}
                      onChange={(e) => setSelectedSupplier(e.target.value)}
                    >
                      <option value="">Seleccionar proveedor...</option>
                      {state.suppliers.map((s) => (
                        <option key={s.id} value={s.id}>{s.name}</option>
                      ))}
                    </select>
                  )}
                  <button
                    className="btn btn-primary"
                    onClick={() => createOrder(supplierId, materials)}
                    disabled={isUnassigned && !selectedSupplier}
                  >
                    <ShoppingCart size={15} /> Crear pedido
                  </button>
                </div>
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
                    <span className="order-status-badge" style={{ backgroundColor: statusInfo.color }}>
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
                        <tr><th>Material</th><th>Cant.</th><th>Precio</th></tr>
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
                            <a className="btn btn-secondary" href={getGmailLink(order)} target="_blank" rel="noreferrer">
                              <Mail size={15} /> Gmail
                            </a>
                          )}
                          {supplier?.phone && (
                            <a className="btn btn-secondary" href={`https://wa.me/${supplier.phone.replace(/\s/g, '')}?text=${generateWhatsAppMessage(order)}`} target="_blank" rel="noreferrer">
                              <Send size={15} /> WhatsApp
                            </a>
                          )}
                          <button className="btn btn-secondary" onClick={() => handleCopyOrder(order)}>
                            {copiedId === order.id ? <Check size={15} /> : <Copy size={15} />}
                            {copiedId === order.id ? 'Copiado' : 'Copiar'}
                          </button>
                          <button className="btn btn-primary" onClick={() => handleSendOrder(order.id)}>
                            <Send size={15} /> Enviado
                          </button>
                        </>
                      )}
                      {order.status === 'sent' && (
                        <button className="btn btn-primary" onClick={() => dispatch({ type: 'MARK_ORDER_RECEIVED', payload: order.id })}>
                          <PackageCheck size={15} /> Recibido
                        </button>
                      )}
                      {(order.status === 'received' || order.status === 'cancelled') && (
                        <button className="btn btn-secondary" onClick={() => dispatch({ type: 'DELETE_ORDER', payload: order.id })}>
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

  function handleSendOrder(orderId) {
    dispatch({ type: 'UPDATE_ORDER_STATUS', payload: { id: orderId, status: 'sent' } });
  }
}
