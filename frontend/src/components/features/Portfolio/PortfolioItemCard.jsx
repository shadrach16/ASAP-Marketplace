import React from 'react';
import Button from '../../common/Button';
import { Trash2, Edit } from 'lucide-react';

const PortfolioItemCard = ({ item, onEdit, onDelete, deleting }) => (
    <div className="bg-white p-5 border border-gray-200 rounded-xl   hover:shadow-lg transition-shadow flex flex-col h-full">
        {/* Project Image */}
        <div className="h-48 mb-4 overflow-hidden rounded-lg bg-gray-50 flex items-center justify-center">
            {item.imageUrl ? (
                 // Use object-cover to ensure images fill the space nicely
                <img src={item.imageUrl} alt={item.title} className="w-full h-full object-cover" />
            ) : (
                <div className="text-gray-400 text-sm">No Image</div>
            )}
        </div>

        {/* Project Details */}
        <h3 className="font-bold text-lg text-text-primary mb-1 line-clamp-2">{item.title}</h3>
        <p className="text-sm text-text-secondary line-clamp-3 mb-4 flex-grow">{item.description}</p>
        
        {/* External Link (if present) */}
        {item.projectUrl && (
            <a 
                href={item.projectUrl} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="text-blue-600 hover:text-blue-700 text-sm mb-4 truncate"
            >
                View Project
            </a>
        )}

        {/* Actions */}
        <div className="flex justify-end space-x-2 mt-auto pt-4 border-t border-gray-100">
            <Button size="sm" variant="secondary" onClick={() => onEdit(item)} disabled={deleting} className="flex items-center">
                <Edit className="w-4 h-4 mr-1" /> Edit
            </Button>
            <Button
                size="sm"
                variant="danger" // Assuming you have a 'danger' variant for delete
                onClick={() => onDelete(item._id)}
                disabled={deleting}
                className="flex items-center"
            >
                <Trash2 className="w-4 h-4 mr-1" />
                {deleting ? 'Deleting...' : 'Delete'}
            </Button>
        </div>
    </div>
);

export default PortfolioItemCard;