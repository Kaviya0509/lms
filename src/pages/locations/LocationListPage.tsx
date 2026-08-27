import React from 'react';
import { useNavigate } from 'react-router-dom';
import { PlusCircle, Pencil } from 'lucide-react';
import DataTable from '../../components/common/DataTable';
import Button from '../../components/common/Button';
import { useAppSelector } from '../../hooks/useAppDispatch';
import type { Location, TableColumn } from '../../types';

const LocationListPage: React.FC = () => {
  const locations = useAppSelector(s => s.locations.items);
  const navigate = useNavigate();

  const handleEdit = (id: string) => {
    navigate(`/locations/edit/${id}`);
  };

  const columns: TableColumn<Location>[] = [
    { key: 'name', label: 'Center Name', render: (v) => <span className="font-semibold text-slate-900 text-sm">{String(v)}</span> },
    { key: 'address', label: 'Address', render: (_, r) => <span className="text-xs text-slate-700">{r.address}, {r.city}, {r.state}</span> },
    { key: 'buildings', label: 'Buildings', render: (_, r) => <span className="text-xs">{r.buildings.length} Block(s)</span> },
    {
      key: 'rooms', label: 'Total Capacity',
      render: (_, r) => {
        const totalCap = r.buildings.flatMap(b => b.rooms).reduce((acc, rm) => acc + rm.capacity, 0);
        return <span className="text-xs font-bold text-emerald-600">{totalCap} seats</span>;
      },
    },
  ];

  return (
    <div className="flex flex-col gap-5 h-full">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-slate-900">Location Management</h1>
          <p className="text-slate-500 text-sm mt-0.5">Offline training centers, buildings, and classroom capacities</p>
        </div>
        <Button icon={<PlusCircle size={15} />} onClick={() => navigate('/locations/add')}>Add Location</Button>
      </div>

      <div className="bg-white border border-slate-100 shadow-sm rounded-2xl p-5 flex-1 flex flex-col min-h-0">
        <DataTable
          columns={columns as unknown as TableColumn<Record<string, unknown>>[]}
          data={locations as unknown as Record<string, unknown>[]}
          searchPlaceholder="Search locations..."
          actions={(row) => {
            const l = row as unknown as Location;
            return (
              <div className="flex items-center gap-1.5 justify-end">
                <Button variant="ghost" size="xs" icon={<Pencil size={13} />} onClick={() => handleEdit(l.id)} />
              </div>
            );
          }}
        />
      </div>
    </div>
  );
};

export default LocationListPage;
