import { describe, it, expect, vi, beforeEach } from 'vitest';
import prisma from '../../config/database';
import { assignOptimalTable, reassignBooking } from '../../services/tableAssignmentService';

describe('tableAssignmentService', () => {
  const p = prisma;

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('assignOptimalTable', () => {
    it('debería asignar la mesa con menor desperdicio de capacidad', async () => {
      p.table.findMany.mockResolvedValue([
        { id: 1, name: 'Mesa 1', minCapacity: 2, maxCapacity: 2, isActive: true, zone: { name: 'Sala' } },
        { id: 2, name: 'Mesa 2', minCapacity: 2, maxCapacity: 4, isActive: true, zone: { name: 'Sala' } }
      ]);
      p.booking.findMany.mockResolvedValue([]);

      const result = await assignOptimalTable(2, '2026-05-01', '14:00');
      expect(result.table.id).toBe(1);
    });
  });

  describe('reassignBooking', () => {
    it('debería reasignar con éxito', async () => {
      const booking = { id: 'b1', pax: 2, date: new Date(), duration: 90 };
      const newTable = { id: 10, name: 'Nueva Mesa', maxCapacity: 4, zone: { name: 'Vip' } };

      p.booking.findUnique.mockResolvedValue(booking);
      p.table.findUnique.mockResolvedValue(newTable);
      p.booking.findMany.mockResolvedValue([]);
      p.booking.update.mockResolvedValue({ ...booking, tableId: 10 });

      const result = await reassignBooking('b1', 10);
      expect(result.message).toContain('Nueva Mesa');
    });

    it('debería fallar si la mesa es pequeña', async () => {
      const booking = { id: 'b1', pax: 4, date: new Date(), duration: 90 };
      const newTable = { id: 10, name: 'Mesa Pequeña', maxCapacity: 2 };

      p.booking.findUnique.mockResolvedValue(booking);
      p.table.findUnique.mockResolvedValue(newTable);

      await expect(reassignBooking('b1', 10)).rejects.toThrow('capacidad máxima');
    });
  });
});
