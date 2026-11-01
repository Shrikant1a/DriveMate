import { Response } from 'express';
import { execute, query, queryOne } from '../../database/db.js';
import { AuthenticatedRequest } from '../../middleware/auth.js';

export async function listVehicles(req: AuthenticatedRequest, res: Response) {
  try {
    const customerId = req.user!.id;
    const vehicles = await query(
      'SELECT id, make, model, year, registration_number, transmission, fuel_type, notes, created_at FROM vehicles WHERE customer_id = ? ORDER BY id DESC',
      [customerId]
    );
    res.json({ vehicles });
  } catch (err: any) {
    console.error('List vehicles error:', err);
    res.status(500).json({ error: 'Failed to retrieve vehicle records.' });
  }
}

export async function addVehicle(req: AuthenticatedRequest, res: Response) {
  try {
    const customerId = req.user!.id;
    const { make, model, year, registrationNumber, transmission, fuelType, notes } = req.body;

    if (!make || !model || !year || !registrationNumber) {
      return res.status(400).json({ error: 'Make, model, year, and registration number are required.' });
    }

    const result = await execute(
      `INSERT INTO vehicles (customer_id, make, model, year, registration_number, transmission, fuel_type, notes)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        customerId,
        make.trim(),
        model.trim(),
        Number(year),
        registrationNumber.trim().toUpperCase(),
        (transmission || 'AUTOMATIC').toUpperCase(),
        (fuelType || 'PETROL').toUpperCase(),
        notes || ''
      ]
    );

    const newVehicle = await queryOne('SELECT * FROM vehicles WHERE id = ?', [result.insertId]);

    res.status(201).json({
      message: 'Vehicle added successfully',
      vehicle: newVehicle
    });
  } catch (err: any) {
    console.error('Add vehicle error:', err);
    res.status(500).json({ error: 'Failed to register vehicle.' });
  }
}

export async function updateVehicle(req: AuthenticatedRequest, res: Response) {
  try {
    const customerId = req.user!.id;
    const vehicleId = Number(req.params.id);
    const { make, model, year, registrationNumber, transmission, fuelType, notes } = req.body;

    const existing = await queryOne('SELECT id FROM vehicles WHERE id = ? AND customer_id = ?', [vehicleId, customerId]);
    if (!existing) {
      return res.status(404).json({ error: 'Vehicle not found or unauthorized access.' });
    }

    await execute(
      `UPDATE vehicles SET make = ?, model = ?, year = ?, registration_number = ?, transmission = ?, fuel_type = ?, notes = ?
       WHERE id = ? AND customer_id = ?`,
      [
        make.trim(),
        model.trim(),
        Number(year),
        registrationNumber.trim().toUpperCase(),
        (transmission || 'AUTOMATIC').toUpperCase(),
        (fuelType || 'PETROL').toUpperCase(),
        notes || '',
        vehicleId,
        customerId
      ]
    );

    const updated = await queryOne('SELECT * FROM vehicles WHERE id = ?', [vehicleId]);
    res.json({ message: 'Vehicle details updated successfully', vehicle: updated });
  } catch (err: any) {
    console.error('Update vehicle error:', err);
    res.status(500).json({ error: 'Failed to update vehicle record.' });
  }
}

export async function deleteVehicle(req: AuthenticatedRequest, res: Response) {
  try {
    const customerId = req.user!.id;
    const vehicleId = Number(req.params.id);

    const existing = await queryOne('SELECT id FROM vehicles WHERE id = ? AND customer_id = ?', [vehicleId, customerId]);
    if (!existing) {
      return res.status(404).json({ error: 'Vehicle not found or unauthorized access.' });
    }

    // Check if vehicle is in an active booking
    const activeBooking = await queryOne(
      "SELECT id FROM bookings WHERE vehicle_id = ? AND status IN ('REQUESTED', 'ACCEPTED', 'EN_ROUTE', 'ARRIVED', 'IN_PROGRESS')",
      [vehicleId]
    );
    if (activeBooking) {
      return res.status(400).json({ error: 'Cannot delete vehicle currently associated with an active trip.' });
    }

    await execute('DELETE FROM vehicles WHERE id = ? AND customer_id = ?', [vehicleId, customerId]);
    res.json({ message: 'Vehicle removed successfully' });
  } catch (err: any) {
    console.error('Delete vehicle error:', err);
    res.status(500).json({ error: 'Failed to delete vehicle record.' });
  }
}

