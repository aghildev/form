import React, { useState, useEffect } from 'react';
import styles from '../css/DealForm.module.css';
import Toast from './Toast';
import ContactSearch from './ContactSearch';

const fields = [
    { name: 'select a plan', label: 'Please Select a Plan', type: 'dropdown', options: ['Plan A', 'Plan B', 'Plan C'] },
];

const requiredFields = ['Donation Cause', 'Date Of Donation', 'amount', 'Currency', 'Payment Methods', 'Deal Frequency'];

const SelectRecurringPlan = () => {
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
        // Enable the button if a plan is selected
        if (name === 'select a plan') {
            setIsFormValid(value !== '');
        }
    };

    const handleDropdownToggle = (name) => {
        setActiveDropdown(prev => ({ ...prev, [name]: !prev[name] }));
    };

    const handleSubmit = () => {
        console.log('Form Data:', formData);
        setToast('Recurring Plan Created successfully!');

        setTimeout(() => {
            setToast(null);
            setShowContactSearch(true);
        }, 500);
    };

    const handleExitClick = () => {
        setShowContactSearch(true);
    };

    const handleNewClick = () => {
        // Logic for the New button
        console.log('New plan creation logic');
    };

    useEffect(() => {
        const isAllRequiredFieldsFilled = requiredFields.every(field => formData[field]);
        setIsFormValid(isAllRequiredFieldsFilled && formData['select a plan']); // Check if plan is also selected
    }, [formData]);

    if (showContactSearch) {
        return <ContactSearch />;
    }

    return (
        <div className={styles.formContainer}>
            <h1 className={styles.formHeading}>Please Select a Plan</h1>
            <button className={styles.exitButton} onClick={handleExitClick}>Go Back</button>
            {fields.map((field, index) => (
                <div key={index} className={styles.formGroup}>
                    <label>
                        {field.label} {requiredFields.includes(field.name) && <span className={styles.requiredAsterisk}>*</span>}
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
            <div className={styles.buttonContainer}>
                <button
                    className={`${styles.submitButton} ${!isFormValid ? styles.disabledButton : ''}`}
                    onClick={handleSubmit}
                    disabled={!isFormValid}
                >
                    Select Plan
                </button>
                <button
                    className={styles.newButton}
                    onClick={handleNewClick}
                >
                    Create New Plan
                </button>
            </div>
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
                            <li className={styles.noRecords}>No Plans found</li>
                        )}
                    </ul>
                </div>
            )}
        </div>
    );
};

export default SelectRecurringPlan;
