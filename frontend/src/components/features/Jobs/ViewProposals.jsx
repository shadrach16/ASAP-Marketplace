// src/components/features/Jobs/ViewProposals.js (Modern Redesign)

import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Loader2, User, Clock, DollarSign, ChevronDown, Calendar, MessageSquare, FileText, CheckCircle2, TrendingUp } from 'lucide-react';
import { toast } from 'sonner';
import Button from '../../common/Button';
import bookingService from '../../../services/bookingService';

/**
 * Formats a date string (YYYY-MM-DD) to a more readable format.
 */
const formatDate = (dateString) => {
  try {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  } catch (e) {
    return 'Invalid Date';
  }
};

/**
 * Modern stat badge component for displaying key metrics
 */
const StatBadge = ({ icon: Icon, label, value, variant = 'default' }) => {
  const variantClasses = {
    default: 'bg-gray-50 text-gray-700 border-gray-200',
    primary: 'bg-blue-50 text-blue-700 border-blue-200',
    success: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  };

  return (
    <div className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-sm font-medium ${variantClasses[variant]}`}>
      <Icon size={14} className="opacity-70" />
      <span className="text-xs font-medium opacity-75">{label}:</span>
      <span className="font-semibold">{value}</span>
    </div>
  );
};

/**
 * A container component that displays all proposals for a job in a
 * modern, professional accordion layout.
 */
const ViewProposals = ({ proposals, jobId }) => {
  const [openProposalId, setOpenProposalId] = useState(null);
  const [loadingProposalId, setLoadingProposalId] = useState(null);
  const navigate = useNavigate();

  const handleAccept = async (proposalId) => {
    setLoadingProposalId(proposalId);
    try {
      const response = await bookingService.acceptProposal(proposalId);
      toast.success("Proposal accepted! Proceed to funding.");
      
      const acceptedProposal = proposals.find(p => p._id === proposalId);

      navigate(`/workspace/${response.bookingId}`, {
        state: {
          clientSecret: response.paymentIntentClientSecret,
          milestoneId: response.milestoneId,
          amount: acceptedProposal.bidAmount,
          currency: acceptedProposal.currency
        }
      });
    } catch (err) {
      const errorMsg = err.message || 'Failed to accept proposal.';
      toast.error(errorMsg);
      setLoadingProposalId(null);
    }
  };

  const toggleProposal = (id) => {
    setOpenProposalId(prevId => (prevId === id ? null : id));
  };

  if (!proposals || proposals.length === 0) {
    return (
      <div className="text-center py-16 px-6 bg-gradient-to-br from-gray-50 to-white border-2 border-dashed border-gray-200 rounded-2xl">
        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <FileText className="w-8 h-8 text-gray-400" />
        </div>
        <p className="text-lg font-medium text-gray-900 mb-1">No proposals yet</p>
        <p className="text-sm text-gray-500">Proposals will appear here once professionals submit them</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Header Stats */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-100 rounded-xl p-4 mb-6">
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-blue-600" />
            <span className="font-semibold text-gray-900">{proposals.length} Proposal{proposals.length !== 1 ? 's' : ''} Received</span>
          </div>
          <div className="flex flex-wrap gap-2">
            <StatBadge 
              icon={DollarSign} 
              label="Avg Bid" 
              value={`$${(proposals.reduce((sum, p) => sum + p.bidAmount, 0) / proposals.length).toFixed(2)}`}
              variant="primary"
            />
          </div>
        </div>
      </div>

      {/* Proposals List */}
      {proposals.map((proposal, index) => {
        const isOpen = openProposalId === proposal._id;
        const isLoading = loadingProposalId === proposal._id;

        return (
          <div 
            key={proposal._id} 
          className={` ${isOpen ?'bg-gray-100':'bg-white'}  border border-gray-200 rounded-xl shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden`}
            style={{ animationDelay: `${index * 50}ms` }}
          >
            {/* Accordion Trigger */}
            <button
              type="button"
              onClick={() => toggleProposal(proposal._id)}
              className="w-full p-5 space-x-5 bg-white text-left flex justify-between items-center hover:bg-gray-50/50 transition-colors group"
              aria-expanded={isOpen}
            >
            <span> {index+1}. </span>   {/* Professional Info */}
              <div className="flex items-center space-x-4 flex-1 min-w-0">
                <div className="relative flex-shrink-0">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-full flex items-center justify-center ring-2 ring-white shadow-sm">
                    <User className="w-6 h-6 text-blue-600" />
                  </div>
                  {proposal.milestones && proposal.milestones.length > 0 && (
                    <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-emerald-500 rounded-full flex items-center justify-center ring-2 ring-white">
                      <CheckCircle2 className="w-3 h-3 text-white" />
                    </div>
                  )}
                </div>
                
                <div className="flex-1 min-w-0">
                  <Link 
                    to={`/pros/${proposal?.pro?._id}`}
                    onClick={(e) => e.stopPropagation()}
                    className="font-semibold text-gray-900 hover:text-blue-600 transition-colors inline-block group-hover:underline"
                  >
                    {proposal?.pro?.name || 'A Professional'}
                  </Link>
                  
                  <div className="flex flex-wrap items-center gap-2 mt-1">
                    {proposal.estimatedDuration && (
                      <span className="inline-flex items-center text-xs text-gray-600 bg-gray-100 px-2 py-1 rounded-md">
                        <Clock size={12} className="mr-1" />
                        {proposal.estimatedDuration}
                      </span>
                    )}
                    {proposal.milestones && proposal.milestones.length > 0 && (
                      <span className="inline-flex items-center text-xs text-emerald-600 bg-emerald-50 px-2 py-1 rounded-md font-medium">
                        {proposal.milestones.length} Milestone{proposal.milestones.length !== 1 ? 's' : ''}
                      </span>
                    )}
                    {proposal.attachments && proposal.attachments.length > 0 && (
                      <span className="inline-flex items-center text-xs text-blue-600 bg-blue-50 px-2 py-1 rounded-md font-medium">
                        <FileText size={12} className="mr-1" />
                        {proposal.attachments.length} File{proposal.attachments.length !== 1 ? 's' : ''}
                      </span>
                    )}
                  </div>
                </div>
              </div>
              
              {/* Price & Toggle */}
              <div className="flex items-center space-x-4 flex-shrink-0 ml-4">
                <div className="text-right hidden sm:block">
                  <div className="text-2xl font-bold text-gray-900">
                    ${proposal.bidAmount.toFixed(2)}
                  </div>
                  <div className="text-xs text-gray-500 font-medium uppercase tracking-wide">
                    {proposal.currency}
                  </div>
                </div>
                <div className="sm:hidden text-lg font-bold text-gray-900">
                  ${proposal.bidAmount.toFixed(2)}
                </div>
                <ChevronDown
                  size={20}
                  className={`text-gray-400 transition-transform duration-300 ${isOpen ? 'rotate-180 text-blue-600' : ''}`}
                />
              </div>
            </button>

            {/* Accordion Content */}
            <div
              className={`transition-all duration-300 ease-in-out ${
                isOpen ? 'max-h-[5000px] opacity-100' : 'max-h-0 opacity-0'
              } overflow-hidden`}
            >
              <div className="p-6 border-t border-gray-100 bg-gray-50/30">
                
                {/* Cover Letter */}
                <div className="mb-6">
                  <div className="flex items-center gap-2 mb-3">
                    <MessageSquare className="w-4 h-4 text-blue-600" />
                    <h5 className="text-sm font-semibold text-gray-900 uppercase tracking-wide">Cover Letter</h5>
                  </div>
                  <div className="bg-white p-4 rounded-lg border border-gray-200">
                    <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap">
                      {proposal.coverLetter}
                    </p>
                  </div>
                </div>
                
                {/* Milestones */}
                {proposal.milestones && proposal.milestones.length > 0 && (
                  <div className="mb-6">
                    <div className="flex items-center gap-2 mb-3">
                      <Calendar className="w-4 h-4 text-emerald-600" />
                      <h5 className="text-sm font-semibold text-gray-900 uppercase tracking-wide">Proposed Milestones</h5>
                    </div>
                    <div className="bg-white rounded-lg border border-gray-200 divide-y divide-gray-100">
                      {proposal.milestones.map((milestone, index) => (
                        <div key={index} className="p-4 hover:bg-gray-50/50 transition-colors">
                          <div className="flex items-start justify-between gap-4 items-center">
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-1">
                                <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-emerald-100 text-emerald-700 text-xs font-bold">
                                  {index + 1}
                                </span>
                                <p className="font-medium text-gray-900">{milestone.description}</p>
                              </div>
                            </div>
                            <div className="text-right flex-shrink-0">
                              <div className="text-lg font-bold text-gray-900 mb-1">
                                ${parseFloat(milestone.amount).toFixed(2)}
                              </div>
                              <div className="inline-flex items-center text-xs text-gray-600 bg-gray-100 px-2 py-1 rounded-md">
                                <Calendar size={10} className="mr-1" />
                                {formatDate(milestone.dueDate)}
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Attachments */}
                {proposal.attachments && proposal.attachments.length > 0 && (
                  <div className="mb-6">
                    <div className="flex items-center gap-2 mb-3">
                      <FileText className="w-4 h-4 text-blue-600" />
                      <h5 className="text-sm font-semibold text-gray-900 uppercase tracking-wide">Attachments</h5>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {proposal.attachments.map((file, index) => (
                        <a 
                          key={index}
                          href={file.fileUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-3 p-3 bg-white border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50/50 transition-all group"
                        >
                          <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0 group-hover:bg-blue-200 transition-colors">
                            <FileText className="w-5 h-5 text-blue-600" />
                          </div>
                          <span className="text-sm font-medium text-gray-900 group-hover:text-blue-600 truncate">
                            {file.fileName}
                          </span>
                        </a>
                      ))}
                    </div>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex justify-end items-center gap-3 pt-4 border-t border-gray-200">
               {/*   <Button
                   to={`/messages?proposalId=${proposal._id}`}
                    variant="secondary" 
                    className="flex justify-center items-center gap-2 px-5 py-2.5 rounded-lg font-medium transition-all hover:bg-gray-100"
                  >
                    <MessageSquare size={16} />
                    <span>Message</span>
                  </Button>*/}
                  <Button
                    variant="primary"
                    onClick={() => handleAccept(proposal.pro._id)}
                    disabled={isLoading}
                    className="flex justify-center items-center gap-2 px-6 py-2.5 rounded-lg font-semibold shadow-sm hover:shadow-md transition-all"
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        <span>Processing...</span>
                      </>
                    ) : (
                      <>
                        <CheckCircle2 size={16} />
                        <span>Accept & Fund</span>
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default ViewProposals;