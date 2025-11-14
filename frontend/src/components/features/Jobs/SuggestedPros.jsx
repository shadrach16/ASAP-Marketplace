// src/components/features/Jobs/SuggestedPros.js (Styling Update)

import React from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, User, Briefcase } from 'lucide-react';
import Button from '../../common/Button';

// (SuggestedProCard remains mostly the same, just cleaned up)
const SuggestedProCard = ({ pro }) => (
  <div className="bg-white p-4 border border-border rounded-lg shadow-sm transition-shadow duration-150">
    <div className="flex items-center space-x-3 mb-3">
      <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center text-text-secondary flex-shrink-0">
        <User className="w-5 h-5" />
      </div>
      <div>
        <Link to={`/pros/${pro._id}`} className="block">
          <h4 className="font-semibold text-text-primary hover:text-primary hover:underline truncate">{pro.name}</h4>
        </Link>
        {pro.title && <p className="text-xs text-text-secondary truncate flex items-center"><Briefcase size={12} className="mr-1" /> {pro.title}</p>}
      </div>
    </div>
    
    {pro.bio && (
      <p className="text-sm text-text-secondary line-clamp-2 mb-3">{pro.bio}</p>
    )}
   
    {pro.skills && pro.skills.length > 0 && (
      <div className="flex flex-wrap gap-1 mb-4 max-h-12 overflow-hidden">
        {pro.skills.map((skill, index) => (
          <span key={index} className="px-2 py-0.5 bg-gray-100 text-text-secondary text-xs font-medium rounded">
            {skill}
          </span>
        ))}
        {pro.skills.length > 5 && <span className="text-xs text-gray-500">+...</span>}
      </div>
    )}
    
    <Button as={Link} to={`/pros/${pro._id}`} variant="secondary" className="w-full">
      View Profile
    </Button>
  </div>
);

const SuggestedPros = ({ pros }) => {
  if (!pros || pros.length === 0) {
    return (
      <div className="text-center text-text-secondary py-10 px-6 bg-white border border-border rounded-lg">
        <p>No AI suggestions are available for this job yet.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {pros.map(pro => (
        <SuggestedProCard key={pro._id} pro={pro} />
      ))}
    </div>
  );
};

export default SuggestedPros;