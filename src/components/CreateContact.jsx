import React, { useEffect, useState } from 'react';
import styles from '../css/DealForm.module.css';
import Toast from './Toast';

const fields = [
    { name: 'email', label: 'Email', type: 'email' },
    { name: 'salutation', label: 'Salutation', type: 'dropdown', options: ['Bro', 'Deacon', 'Dr'] },
    { name: 'firstName', label: 'First Name', type: 'text' },
    { name: 'lastName', label: 'Last Name', type: 'text' },
    { name: 'primaryCountry', label: 'Primary Country', type: 'text' },
    { name: 'prefferedLanguage', label: 'Preffered Language', type: 'text' },
    { name: 'mobileNumber', label: 'Mobile Number', type: 'text' },
    { name: 'billingAddressLine1', label: 'Billing Address Line 1', type: 'text' },
    { name: 'billingCity', label: 'Billing City', type: 'text' },
    { name: 'billingState', label: 'Billing State/Region', type: 'text' },
    { name: 'billingPostalCode', label: 'Billing Postal Code', type: 'text' },
    { name: 'country/region', label: 'Country/Region', type: 'text' },
    { name: 'shalomJoinDate', label: 'Shalom Join Date', type: 'date' },
    { name: 'eventName', label: 'Event Name', type: 'text' },
    { name: 'eventLocation', label: 'Event Location', type: 'text' },
    { name: 'isFamilyMember', label: 'Is Family Member', type: 'dropdown', options: ['Yes', 'No'] },
    { name: 'secondaryPhoneNumber', label: 'Secondary Phone Number', type: 'text' },
    { name: 'secondaryLanguage', label: 'Secondary Language', type: 'text' },
    { name: 'shalomCategory', label: 'Shalom Category', type: 'text' },
    { name: 'gender', label: 'Gender', type: 'dropdown', options: ['Male', 'Female', 'Transgender'] },
    { name: 'dateOfBirth', label: 'Date Of Birth', type: 'date' },
    { name: 'communicationProhibitions', label: 'Communication Prohibitions', type: 'dropdown', options: ['Do Not Call', 'Do Not Email', 'Do Not Mail- Postal'] },
];

const requiredFields = ['email', 'firstName', 'lastName', 'salutation', 'primaryCountry', 'prefferedLanguage', 'mobileNumber'];

const CreateContact = ({ onClose }) => {
    const [formData, setFormData] = useState({});
    const [activeDropdown, setActiveDropdown] = useState(null);
    const [isFormValid, setIsFormValid] = useState(false);
    const [toast, setToast] = useState(null);
    const [showDealForm, setShowDealForm] = useState(false);
    const [showContactSearch, setShowContactSearch] = useState(false);
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleDropdownChange = (name, value) => {
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleDropdownToggle = (name) => {
        setActiveDropdown(prev => (prev === name ? null : name));
    };

    const handleSubmit = () => {
        console.log('Form Data:', formData);
        setToast('Contact Created successfully!');


        setTimeout(() => {
            onClose();
            setToast(null);

        }, 1000);
    };

    useEffect(() => {
        const isAllRequiredFieldsFilled = requiredFields.every(field => formData[field]);
        setIsFormValid(isAllRequiredFieldsFilled);
    }, [formData]);

    const isFieldRequired = (fieldName) => requiredFields.includes(fieldName);

    return (
        <div className={styles.modalOverlay}>
            <div className={styles.modalContent}>
                <button className={styles.closeButton} onClick={onClose}>
                    &times;
                </button>
                <div className={styles.formContainer}>
                    <h1 className={styles.formHeading}>Create Contact</h1>
                    {fields.map((field, index) => (
                        <div key={index} className={styles.formGroup}>
                            <label>
                                {field.label} {isFieldRequired(field.name) && <span className={styles.requiredAsterisk}>*</span>}
                            </label>
                            {field.type === 'dropdown' ? (
                                <SearchableDropdown
                                    name={field.name}
                                    options={field.options}
                                    isOpen={activeDropdown === field.name}
                                    onSelect={(value) => {
                                        handleDropdownChange(field.name, value);
                                        setActiveDropdown(null);
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
                        Create Contact
                    </button>
                    {toast && <Toast message={toast} onClose={() => setToast(null)} />}

                </div>
            </div>
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

export default CreateContact;