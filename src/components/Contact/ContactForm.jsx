import React from 'react';
import { Send, Loader2 } from 'lucide-react';
import CustomSelect from '../CustomSelect';

const ContactForm = ({ handleSubmit, submitting, subject, setSubject }) => {
    return (
        <div className="glass-card contact-form-card">
            <form onSubmit={handleSubmit}>
                <div className="form-row-dual">
                    <div className="form-group">
                        <label>Full Name</label>
                        <input 
                            type="text" 
                            placeholder="John Doe" 
                            required 
                        />
                    </div>
                    <div className="form-group">
                        <label>Email Address</label>
                        <input 
                            type="email" 
                            placeholder="john@example.com" 
                            required 
                        />
                    </div>
                </div>

                <div className="form-group" style={{ marginBottom: '1.5rem' }}>
                    <label>Subject</label>
                    <CustomSelect
                        options={[
                            { id: 'General Inquiry', name: 'General Inquiry' },
                            { id: 'Tool Submission Question', name: 'Tool Submission Question' },
                            { id: 'Partnership/Advertising', name: 'Partnership/Advertising' },
                            { id: 'Technical Bug Report', name: 'Technical Bug Report' }
                        ]}
                        value={subject}
                        onChange={(val) => setSubject(val)}
                        placeholder="Select subject"
                        style={{ marginBottom: '0' }}
                    />
                </div>

                <div className="form-group" style={{ marginBottom: '2.5rem' }}>
                    <label>Message</label>
                    <textarea 
                        rows="6" 
                        placeholder="How can we help you today?" 
                        required 
                    ></textarea>
                </div>

                <button className="btn-primary" style={{ width: '100%', height: '56px' }} disabled={submitting}>
                    {submitting ? (
                        <Loader2 className="animate-spin" size={20} />
                    ) : (
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }}>
                            Send Message <Send size={20} />
                        </div>
                    )}
                </button>
            </form>
        </div>
    );
};

export default ContactForm;
