
import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { getCustomers } from '../../services/api';
import type { Customer } from '../../types';
import CustomerDetailsModal from '../../components/admin/CustomerDetailsModal';
import '../../styles/pages/admin/CustomersPage.css';

export default function CustomersPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const customerIdParam = searchParams.get('id');
  
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedCustomerId, setSelectedCustomerId] = useState<string | null>(null);
  
  const [filters, setFilters] = useState({
    isVip: false,
    isBlacklisted: false,
  });

  const fetchCustomers = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const params: {
        limit: number;
        search?: string;
        isVip?: boolean;
        isBlacklisted?: boolean;
      } = { limit: 100 };

      if (searchTerm) params.search = searchTerm;
      if (filters.isVip) params.isVip = true;
      if (filters.isBlacklisted) params.isBlacklisted = true;

      const { customers: fetchedCustomers } = await getCustomers(params);
      setCustomers(fetchedCustomers || []);
    } catch (err) {
      const errorMessage =
        (err as { response?: { data?: { message: string } } })?.response?.data
          ?.message || 'Error loading customers';
      setError(errorMessage);
      setCustomers([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      fetchCustomers();
    }, 300);
    return () => clearTimeout(timeoutId);
  }, [searchTerm, filters]);

  // Set selected customer from URL param on load
  useEffect(() => {
    if (customerIdParam) {
      setSelectedCustomerId(customerIdParam);
    }
  }, [customerIdParam]);

  const handleFilterChange = (filterKey: 'isVip' | 'isBlacklisted') => {
    setFilters((prev) => ({
      ...prev,
      [filterKey]: !prev[filterKey],
    }));
  };

  const getStatusBadges = (customer: Customer) => {
    const badges = [];
    if (customer.isVip) {
      badges.push(
        <span key="vip" className="customer-badge customer-badge--vip" title="Cliente VIP">
          ⭐
        </span>
      );
    }
    if (customer.isBlacklisted) {
      badges.push(
        <span key="blacklist" className="customer-badge customer-badge--blacklist" title="En Blacklist">
          🚫
        </span>
      );
    }
    if (customer.allergens && customer.allergens.length > 0) {
      badges.push(
        <span key="allergy" className="customer-badge customer-badge--allergy" title={`Alergias: ${customer.allergens.join(', ')}`}>
          🚨
        </span>
      );
    }
    if (customer.tags && customer.tags.length > 0) {
      const otherTags = customer.tags.filter(
        (t) => t !== 'VIP' && t !== 'BLACKLIST'
      );
      otherTags.slice(0, 2).forEach((tag) => {
        badges.push(
          <span key={tag} className="customer-badge customer-badge--tag" style={{ fontSize: '0.7rem' }}>
            {tag}
          </span>
        );
      });
    }
    return badges;
  };

  const getRowClass = (customer: Customer) => {
    let className = 'customer-row';
    if (customer.isBlacklisted) className += ' customer-row--blacklisted';
    if (customer.isVip) className += ' customer-row--vip';
    return className;
  };

  return (
    <div className="customers-page">
      {/* Header */}
      <div className="customers-header">
        <h1>👥 Clientes</h1>
        <p className="customers-subtitle">
          Gestiona la base de datos de clientes y sus preferencias
        </p>
      </div>

      {/* Filters & Search */}
      <div className="customers-controls">
        <div className="customers-search">
          <input
            type="text"
            placeholder="Buscar por nombre, email o teléfono..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="customers-search__input"
          />
        </div>

        <div className="customers-filters">
          <label className="customers-filter">
            <input
              type="checkbox"
              checked={filters.isVip}
              onChange={() => handleFilterChange('isVip')}
            />
            <span>⭐ Solo VIP</span>
          </label>

          <label className="customers-filter">
            <input
              type="checkbox"
              checked={filters.isBlacklisted}
              onChange={() => handleFilterChange('isBlacklisted')}
            />
            <span>🚫 Solo Blacklist</span>
          </label>
        </div>
      </div>

      {/* Content */}
      {error && <div className="customers-error">❌ {error}</div>}

      {isLoading ? (
        <div className="customers-loading">Cargando clientes...</div>
      ) : customers.length === 0 ? (
        <div className="customers-empty">No hay clientes que mostrar</div>
      ) : (
        <div className="customers-table-wrapper">
          <table className="customers-table">
            <thead>
              <tr>
                <th>Nombre</th>
                <th>Email</th>
                <th>Teléfono</th>
                <th className="text-center">Visitas</th>
                <th className="text-center">No-shows</th>
                <th className="text-center">Estado</th>
              </tr>
            </thead>
            <tbody>
              {customers.map((customer) => (
                <tr
                  key={customer.id}
                  className={getRowClass(customer)}
                  onClick={() => setSelectedCustomerId(customer.id)}
                  style={{ cursor: 'pointer' }}
                >
                  <td>
                    <strong>
                      {customer.firstName} {customer.lastName}
                    </strong>
                  </td>
                  <td>{customer.email}</td>
                  <td>{customer.phone || '-'}</td>
                  <td className="text-center">{customer.totalVisits}</td>
                  <td className="text-center">{customer.totalNoShows}</td>
                  <td className="text-center">
                    <div className="customer-badges" style={{ justifyContent: 'center' }}>
                      {getStatusBadges(customer)}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Summary */}
      {!isLoading && customers.length > 0 && (
        <div className="customers-summary">
          Total: <strong>{customers.length}</strong> clientes
          {filters.isVip && ' (VIP)'}
          {filters.isBlacklisted && ' (Blacklist)'}
        </div>
      )}

      {/* Reusable Details Modal */}
      {selectedCustomerId && (
        <CustomerDetailsModal
          customerId={selectedCustomerId}
          onClose={() => {
            setSelectedCustomerId(null);
            if (searchParams.has('id')) {
              setSearchParams({});
            }
          }}
          onUpdate={fetchCustomers}
        />
      )}
    </div>
  );
}
