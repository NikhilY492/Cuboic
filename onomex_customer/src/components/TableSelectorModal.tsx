import './TableSelectorModal.css';

interface Table {
    id: string;
    table_number: string;
    is_occupied?: boolean;
}

interface TableSelectorModalProps {
    open: boolean;
    onClose: () => void;
    tables: Table[];
    currentTableId: string;
    onSelect: (tableId: string) => void;
}

export function TableSelectorModal({ open, onClose, tables, currentTableId, onSelect }: TableSelectorModalProps) {
    if (!open) return null;

    return (
        <div className="table-modal-overlay fade-in" onClick={onClose}>
            <div className="table-modal fade-up" onClick={e => e.stopPropagation()}>
                <div className="table-modal__header">
                    <h2 className="table-modal__title">Select Your Table</h2>
                    <button className="table-modal__close" onClick={onClose}>✕</button>
                </div>
                <div className="table-modal__grid">
                    {tables.map(table => {
                        const isOccupied = table.is_occupied;
                        const isActive = table.id === currentTableId;
                        let className = `table-btn`;
                        if (isActive) className += ' table-btn--active';
                        else if (isOccupied) className += ' table-btn--occupied';
                        else className += ' table-btn--available';

                        return (
                            <button
                                key={table.id}
                                className={className}
                                disabled={isOccupied && !isActive}
                                onClick={() => {
                                    onSelect(table.id);
                                    onClose();
                                }}
                            >
                                Table {table.table_number}
                            </button>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}
