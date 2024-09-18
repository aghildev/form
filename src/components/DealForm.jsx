import React, { useState, useEffect } from 'react';
import styles from '../css/DealForm.module.css';
import Toast from './Toast';
import ContactSearch from './ContactSearch';


const fields = [
    { name: 'Deal Name', label: 'Deal Name', type: 'text' },
    // { name: 'pipeline', label: 'Pipeline', type: 'dropdown', options: ['Option 1', 'Option 2', 'Option 3'] },
    // { name: 'Deal Stage', label: 'Deal Stage', type: 'dropdown', options: ['Stage 1', 'Stage 2', 'Stage 3'] },
    // { name: 'Primary Country', label: 'Primary Country', type: 'dropdown', options: ['Company 1', 'Company 2', 'Company 3'] },
    { name: 'country', label: 'Country', type: 'text' },
    { name: 'Donation Cause', label: 'Donation Cause', type: 'dropdown', options: ['Cause 1', 'Cause 2', 'Cause 3'] },
    { name: 'Date Of Donation', label: 'Donation Date', type: 'date' },
    // { name: 'Close Date', label: 'Close Date', type: 'date' },
    { name: 'amount', label: 'Amount', type: 'number' },
    { name: 'Currency', label: 'Currency', type: 'dropdown', options: ['USD', 'EUR', 'GBP'] },
    { name: 'Payment Methods', label: 'Payment Methods', type: 'dropdown', options: ['Method 1', 'Method 2'] },
    { name: 'Deal Frequency', label: 'Deal Frequency', type: 'dropdown', options: ['Monthly', 'Yearly'] },
    { name: 'checkDate', label: 'Check Date', type: 'date' },
    // { name: 'Deal Owner', label: 'Deal Owner', type: 'dropdown', options: ['Owner 1', 'Owner 2'] },
    // { name: 'closedLostReason', label: 'Closed Lost Reason', type: 'text' },
    { name: 'dealDescription', label: 'Deal Description', type: 'text' },
    { name: 'checkNumber', label: 'Check Number', type: 'number' },
    { name: 'journal', label: 'This is a journal', type: 'dropdown', options: ['Yes', 'No'] },
    // { name: 'eventRegistrationId', label: 'Event Registration ID', type: 'number' },
    // { name: 'eventStartDate', label: 'Event Start Date', type: 'date' },
    // { name: 'eventLocation', label: 'Event Location', type: 'text' },
    // { name: 'shalomMemberUID', label: 'Shalom Member UID', type: 'text' },
    { name: 'Member Email', label: 'Member Email', type: 'email' }
];

const associateDealFields = [
    { name: 'contact', label: 'Contact', type: 'dropdown', options: ['number 1', 'number 2', 'number 3'] },
    // { name: 'company', label: 'Company', type: 'dropdown', options: ['company 1', 'company 2', 'company 3'] },
    // { name: 'deal', label: 'Deal', type: 'dropdown', options: ['deal 1', 'deal 2', 'deal 3'] },
    // { name: 'add line item', label: 'Add Line Item', type: 'dropdown', options: ['Line 1', 'Line 2 ', 'Line 3'] },
    // { name: 'lineItemQuantity', label: 'Quantity', type: 'number' },
    // { name: 'ticket', label: 'Ticket', type: 'dropdown', options: ['Ticket 1', 'Ticket 2 ', 'Ticket 3'] },
    { name: 'recurring plan', label: 'Recurring Plan', type: 'dropdown', options: ['Plan 1', 'Plan 2', 'Plan 3'] },
];

const requiredFields = ['Deal Name', 'country', 'Donation Cause', 'Date Of Donation', 'amount', 'Currency', 'Manual Payment Methods', 'Deal Frequency'];

const DealForm = () => {
    const [formData, setFormData] = useState({});
    const [activeDropdown, setActiveDropdown] = useState({});
    const [isFormValid, setIsFormValid] = useState(false);
    const [toast, setToast] = useState(null);
    const [showContactSearch, setShowContactSearch] = useState(false);
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleDropdownChange = (name, value) => {
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleDropdownToggle = (name) => {
        setActiveDropdown(prev => ({ ...prev, [name]: !prev[name] }));
    };

    const handleSubmit = () => {
        console.log('Form Data:', formData);
        setToast('Deal Created successfully!');

        setTimeout(() => {
            setToast(null);
            setShowContactSearch(true);
        }, 500);

    };

    useEffect(() => {
        const isAllRequiredFieldsFilled = requiredFields.every(field => formData[field]);
        setIsFormValid(isAllRequiredFieldsFilled);
    }, [formData]);

    const isFieldRequired = (fieldName) => requiredFields.includes(fieldName);
    if (showContactSearch) {
        return <ContactSearch />;
    }
    return (
        <div className={styles.formContainer}>
            {fields.map((field, index) => (
                <div key={index} className={styles.formGroup}>
                    <label>
                        {field.label} {isFieldRequired(field.name) && <span className={styles.requiredAsterisk}>*</span>}
                    </label>
                    {field.type === 'dropdown' ? (
                        <SearchableDropdown
                            name={field.name}
                            options={field.options}
                            isOpen={activeDropdown[field.name] || false}
                            onSelect={(value) => {
                                handleDropdownChange(field.name, value);
                                setActiveDropdown(prev => ({ ...prev, [field.name]: false }));
                            }}
                            onToggle={() => handleDropdownToggle(field.name)}
                        />
                    ) : (
                        <InputField
                            type={field.type}
                            name={field.name}
                            value={formData[field.name] || ''}
                            onChange={handleInputChange}
                        />
                    )}
                </div>
            ))}
            <button
                className={`${styles.submitButton} ${!isFormValid ? styles.disabledButton : ''}`}
                onClick={handleSubmit}
                disabled={!isFormValid}
            >
                Create Deal
            </button>
            {toast && <Toast message={toast} onClose={() => setToast(null)} />}
        </div>
    );
};


const InputField = ({ type, name, value, onChange }) => (
    <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        className={styles.inputField}
        required
    />
);

const SearchableDropdown = ({ name, options, isOpen, onSelect, onToggle }) => {
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedOption, setSelectedOption] = useState('');

    const filteredOptions = options.filter(option =>
        option.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const handleOptionClick = (option) => {
        setSelectedOption(option);
        onSelect(option);
    };

    return (
        <div className={styles.dropdown}>
            <div
                className={`${styles.dropdownHeader} ${isOpen ? styles.open : ''} ${selectedOption ? styles.selected : styles.placeholder}`}
                onClick={onToggle}
            >
                {selectedOption || `Select ${name}`}
            </div>
            {isOpen && (
                <div className={styles.dropdownMenu}>
                    <input
                        type="text"
                        placeholder="Search..."
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className={styles.dropdownSearch}
                    />
                    <ul>
                        {filteredOptions.length > 0 ? (
                            filteredOptions.map((option, index) => (
                                <li key={index} onClick={() => handleOptionClick(option)}>
                                    {option}
                                </li>
                            ))
                        ) : (
                            <li className={styles.noRecords}>No records found</li>
                        )}
                    </ul>
                </div>
            )}
        </div>
    );
};


export default DealForm;

