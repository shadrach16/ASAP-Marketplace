import React, { useState, useEffect, useRef } from 'react';
import { useChat } from '../../../hooks/useChat';
import { useAuth } from '../../../hooks/useAuth';
import chatService from '../../../services/chatService'; 
import FileUploaderButton from '../../../components/features/Chat/FileUploaderButton';
import { useLocation } from 'react-router-dom'; // 💡 NEW IMPORT

import FormInput from '../../common/FormInput'; // Assuming FormInput can handle multiline/textarea
import Button from '../../common/Button';
import { 
    Loader2, Send, Paperclip, FileText, Image, Video, Download, Pencil, X,
    MessageSquare, Check
} from 'lucide-react';

// Helper to determine icon based on MIME type
const getFileIcon = (fileType) => {
    if (fileType.startsWith('image/')) return <Image className="h-5 w-5 text-blue-500" />;
    if (fileType.startsWith('video/')) return <Video className="h-5 w-5 text-purple-500" />;
    if (fileType.includes('pdf')) return <FileText className="h-5 w-5 text-red-500" />;
    // Catch-all for other document types
    return <Paperclip className="h-5 w-5 text-gray-500" />;
};

const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

// Sub-component for a single message bubble
const ChatMessageBubble = ({ msg, isCurrentUser, onEditClick }) => {
    const formatTimestamp = (timestamp) => {
        return new Date(timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    }

    const { file, sender, message, createdAt, isEdited } = msg;

    return (
        <div
            className={`flex ${isCurrentUser ? 'justify-end' : 'justify-start'}`}
        >
            <div className={`flex items-end max-w-[75%] space-x-2 ${isCurrentUser ? 'flex-row-reverse space-x-reverse' : 'flex-row'}`}>
                {/* Avatar/Initials placeholder */}
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-xs font-semibold text-gray-700">
                    {sender.name[0]}
                </div>

                <div
                    className={`p-3 rounded-lg shadow-sm border ${
                        isCurrentUser
                            ? 'bg-blue-500 text-white rounded-br-none'
                            : 'bg-white text-gray-800 border-gray-200 rounded-tl-none'
                    } transition-all`}
                >
                    {/* Sender Name for the other user */}
                    {!isCurrentUser && (
                        <p className={`text-xs font-semibold mb-1 text-blue-600`}>
                            {sender.name} ({sender.role})
                        </p>
                    )}

                    {/* File Attachment Area */}
                    {file && (
                        <a 
                           href={file.fileUrl} 
                           target="_blank" 
                           rel="noopener noreferrer" 
                           className={`flex items-center p-2 rounded-lg mb-2 border transition-colors ${isCurrentUser ? 'bg-blue-600 border-blue-700 hover:bg-blue-700' : 'bg-gray-100 border-gray-300 hover:bg-gray-200'}`}
                        >
                            {getFileIcon(file.fileType)}
                            <div className="ml-3 min-w-0">
                                <p className={`text-sm font-medium truncate ${isCurrentUser ? 'text-white' : 'text-gray-800'}`}>{file.fileName}</p>
                                <p className={`text-xs ${isCurrentUser ? 'text-blue-200' : 'text-gray-500'}`}>{formatFileSize(file.fileSize)}</p>
                            </div>
                            <Download className={`h-4 w-4 ml-3 flex-shrink-0 ${isCurrentUser ? 'text-white' : 'text-gray-600'}`} />
                        </a>
                    )}
                    
                    {/* Message Content */}
                    {(message || file) && ( 
                        <p className={`text-sm whitespace-pre-wrap break-words ${isCurrentUser ? 'text-white' : 'text-gray-800'}`}>
                            {message || (file ? `(No message content)` : '')}
                        </p>
                    )}
                    
                    {/* Footer / Meta */}
                    <div className="flex items-center justify-end space-x-2 mt-1">
                        {isEdited && (
                             <span className={`text-xs italic ${isCurrentUser ? 'text-blue-200' : 'text-gray-400'}`}>
                                 Edited
                             </span>
                        )}
                        <span className={`text-xs ${isCurrentUser ? 'text-blue-200' : 'text-gray-500'}`}>
                            {formatTimestamp(createdAt)}
                        </span>
                        {/* Edit Button: Only for current user and if there is *some* text to edit */}
                        {isCurrentUser && message && (
                            <button
                                onClick={() => onEditClick(msg)}
                                className={`p-1 rounded-full ${isCurrentUser ? 'text-blue-100 hover:text-white hover:bg-blue-600' : 'text-gray-400 hover:text-gray-600 hover:bg-gray-100'} transition-colors`}
                                title="Edit message"
                            >
                                <Pencil className="h-3 w-3" />
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};


const ChatWindow = ({ bookingId }) => {
  const { user } = useAuth();
  const {
    messages,
    setMessages,
    sendMessage,
    editMessage,
    isConnected,
    error: chatError,
  } = useChat(bookingId);
    const location = useLocation(); // 💡 NEW HOOK CALL

  const [newMessage, setNewMessage] = useState('');
  const [fileToUpload, setFileToUpload] = useState(null);
  const [historyLoading, setHistoryLoading] = useState(true);
  const [historyError, setHistoryError] = useState(null);
  const [isSending, setIsSending] = useState(false);
  
  // State for message editing
  const [editingMessage, setEditingMessage] = useState(null); // { _id, originalMessage }
  const [editInput, setEditInput] = useState('');

  const messagesEndRef = useRef(null);

  // Fetch initial message history
  useEffect(() => {
    const fetchHistory = async () => {
      if (!bookingId) return;
      setHistoryLoading(true);
      setHistoryError(null);
      try {
        const history = await chatService.getMessages(bookingId);
        setMessages(history);
      } catch (err) {
        setHistoryError(err.message || 'Failed to load chat history.');
      } finally {
        setHistoryLoading(false);
      }
    };
    fetchHistory();
  }, [bookingId, setMessages]);

  // Scroll to bottom
  useEffect(() => {
    if (!location.pathname.startsWith('/workspace/')){

    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  // --- Send Logic ---
  const handleSendMessage = async (e) => {
    e.preventDefault();
    const messageContent = newMessage.trim();
    if ((!messageContent && !fileToUpload) || !isConnected || isSending) return;

    setIsSending(true);
    
    // Call the hook's sendMessage with both message and file
    try {
        await sendMessage(messageContent, fileToUpload);
    } catch (error) {
        // Error handling is primarily done in the hook, but we catch here 
        // to prevent the UI from clearing on API error
        console.error("Chat send failed in component:", error);
    } finally {
        // Clear state regardless of success (hook's error will display issues)
        setNewMessage('');
        setFileToUpload(null);
        setIsSending(false); 
    }
  };
  
  // --- File Logic ---
  const handleFileSelect = (file) => {
    if (file.size > 25 * 1024 * 1024) {
        alert('File size exceeds the 25MB limit.');
        return;
    }
    setFileToUpload(file);
  }

  // --- Edit Logic ---
  const handleEditClick = (msg) => {
    // Cannot edit a message if it's already being edited
    if (editingMessage) return; 
    setEditingMessage({
        _id: msg._id,
        originalMessage: msg.message, // Store original for comparison
    });
    setEditInput(msg.message);
  }
  
  const handleSaveEdit = async () => {
    if (!editingMessage || !editInput.trim() || editInput.trim() === editingMessage.originalMessage.trim()) {
        setEditingMessage(null); // Cancel if no change or empty
        return;
    }
    
    setIsSending(true); // Reuse sending state for edit
    try {
        await editMessage(editingMessage._id, editInput.trim());
        setEditingMessage(null); // Clear editing state on success
    } catch (err) {
        // The hook already handles displaying the error
    } finally {
        setIsSending(false);
    }
  }


  const isInputDisabled = !isConnected || isSending;

  return (
    <div className="flex flex-col h-[90vh] w-full max-w-4xl mx-auto bg-gray-50 rounded-xl  overflow-hidden font-sans">
      
      {/* Header - Upwork Style Header */}
      <div className="p-4 bg-white border-b border-gray-200 flex items-center justify-between  ">
          <h3 className="text-sm font-bold text-gray-800 flex items-center">
             Booking: <span className="ml-1 font-normal text-gray-500">#{bookingId.substring(0, 8)}</span>
          </h3>
          <span className={`text-xs font-medium px-3 py-1 rounded-full ${isConnected ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
            {isConnected ? 'Connected' : 'Offline'}
          </span>
      </div>
      
      {/* Error Indicator */}
      {(chatError || historyError) && (
        <div className="p-3 text-sm text-center bg-red-50 text-red-600 border-b border-red-200">
          ⚠️ **Error:** {chatError || historyError}
        </div>
      )}
      

      {/* Message Display Area */}
      <div className="flex-grow overflow-y-auto p-4 space-y-4">
        {historyLoading ? (
          <p className="text-center text-gray-400 flex items-center justify-center">
             <Loader2 className="h-4 w-4 animate-spin mr-2" /> Loading history...
          </p>
        ) : (
          messages.map((msg) => (
             <ChatMessageBubble
                 key={msg._id}
                 msg={msg}
                 isCurrentUser={msg.sender._id === user?._id}
                 onEditClick={handleEditClick}
             />
          ))
        )}
        <div ref={messagesEndRef} /> {/* Anchor for scrolling */}
      </div>
      
      {/* File Preview */}
      {fileToUpload && (
          <div className="p-3 bg-blue-50 border-t border-blue-200 flex items-center justify-between text-sm">
              <div className="flex items-center space-x-2 text-blue-800">
                  {getFileIcon(fileToUpload.type)}
                  <span>{fileToUpload.name} ({formatFileSize(fileToUpload.size)})</span>
              </div>
              <button 
                  type="button" 
                  onClick={() => setFileToUpload(null)}
                  className="p-1 rounded-full text-blue-500 hover:bg-blue-200"
                  title="Remove file"
              >
                  <X className="h-4 w-4" />
              </button>
          </div>
      )}
      
      {/* Message Input Area / Edit Area */}
      {editingMessage ? (
           <div className="p-4 bg-white border-t border-gray-200 flex flex-col space-y-2">
                <div className="flex items-center justify-between text-sm text-gray-600">
                    <span className="flex items-center font-semibold">
                       <Pencil className="h-4 w-4 mr-1 text-blue-500" /> Editing Message
                    </span>
                    <button 
                        onClick={() => setEditingMessage(null)} 
                        className="text-red-500 hover:text-red-700 text-xs"
                    >
                        Cancel
                    </button>
                </div>
                {/* Assuming FormInput renders a textarea when appropriate */}
                <FormInput
                    id="edit-message"
                    type="text"
                    value={editInput}
                    onChange={(e) => setEditInput(e.target.value)}
                    onKeyPress={(e) => {
                      if (e.key === 'Enter' && !e.shiftKey) { 
                        e.preventDefault(); 
                        handleSaveEdit(); 
                      }
                    }}
                    placeholder="Edit your message..."
                    disabled={isSending}
                    autoComplete="off"
                    className="p-3 border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                    isTextArea={true} 
                />
                <div className="flex justify-end">
                     <Button 
                       type="button" 
                       onClick={handleSaveEdit}
                       variant="primary" 
                       disabled={isSending || !editInput.trim() || editInput.trim() === editingMessage.originalMessage.trim()}
                       className="px-4 py-2 text-sm"
                     >
                        {isSending ? <Loader2 className="h-5 w-5 animate-spin" /> : <Check className="h-5 w-5 mr-1" />}
                        Save Edit
                     </Button>
                </div>
           </div>
      ) : (
          <form
            onSubmit={handleSendMessage}
            className="p-4 bg-white border-t border-gray-200 flex items-center gap-2"
          >
            {/* File Attachment Button */}
            <FileUploaderButton 
                onFileSelect={handleFileSelect}
                acceptedTypes="image/*, application/pdf, .doc, .docx, .zip, .rar" // Example types
                disabled={isInputDisabled || fileToUpload}
            />

            {/* Message Input */}
            <div className="flex-grow">
                 <FormInput
                    id="chat-message"
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyPress={(e) => {
                      if (e.key === 'Enter' && !e.shiftKey && !isInputDisabled) { 
                        e.preventDefault(); 
                        handleSendMessage(e); 
                      }
                    }}
                    placeholder={isInputDisabled ? "Chat is disconnected..." : "Type your message..."}
                    disabled={isInputDisabled}
                    autoComplete="off"
                    className="p-3 border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 resize-none"
                    isTextArea={true}
                />
            </div>

            <Button 
              type="submit" 
              variant="primary" 
              disabled={isInputDisabled || (!newMessage.trim() && !fileToUpload)}
              className="p-3 w-12 h-12 flex items-center justify-center"
            >
              {isSending ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : (
                <Send className="h-5 w-5" />
              )}
            </Button>
          </form>
      )}
      
    </div>
  );
};

export default ChatWindow;